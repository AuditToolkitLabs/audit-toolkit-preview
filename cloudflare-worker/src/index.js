const TEXT_ENCODER = new TextEncoder();

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8"
    }
  });
}

function parseStripeSignature(signatureHeader) {
  if (!signatureHeader) return null;

  const parts = signatureHeader.split(",").map((part) => part.trim());
  const parsed = {};

  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key && value) parsed[key] = value;
  }

  if (!parsed.t || !parsed.v1) return null;
  return { timestamp: parsed.t, signatureV1: parsed.v1 };
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;

  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return mismatch === 0;
}

async function hmacSha256Hex(secret, payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    TEXT_ENCODER.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, TEXT_ENCODER.encode(payload));
  const bytes = new Uint8Array(signature);

  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyStripeWebhook(request, rawBody, env) {
  const header = request.headers.get("stripe-signature");
  const parsed = parseStripeSignature(header);

  if (!parsed) {
    return { ok: false, reason: "missing-or-invalid-signature-header" };
  }

  if (!env.STRIPE_WEBHOOK_SECRET) {
    return { ok: false, reason: "missing-webhook-secret" };
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const timestamp = Number(parsed.timestamp);
  const skew = Math.abs(nowSeconds - timestamp);

  if (!Number.isFinite(timestamp) || skew > 300) {
    return { ok: false, reason: "timestamp-skew" };
  }

  const signedPayload = `${parsed.timestamp}.${rawBody}`;
  const expected = await hmacSha256Hex(env.STRIPE_WEBHOOK_SECRET, signedPayload);

  if (!timingSafeEqual(expected, parsed.signatureV1)) {
    return { ok: false, reason: "signature-mismatch" };
  }

  return { ok: true };
}

function getPlanMapping(env) {
  if (!env.PRICE_POLICY_MAP_JSON) return { byPriceId: {}, byLookupKey: {} };

  try {
    const parsed = JSON.parse(env.PRICE_POLICY_MAP_JSON);
    return {
      byPriceId: parsed.byPriceId || {},
      byLookupKey: parsed.byLookupKey || {}
    };
  } catch {
    return { byPriceId: {}, byLookupKey: {} };
  }
}

function resolvePlanFromCheckoutSession(session, env) {
  const mapping = getPlanMapping(env);
  const metadata = session.metadata || {};

  const explicitPolicyId = metadata.keygen_policy_id;
  if (explicitPolicyId) {
    return {
      policyId: explicitPolicyId,
      planCode: metadata.plan_code || "custom",
      source: "session-metadata"
    };
  }

  const lookupKey = metadata.plan_lookup_key;
  if (lookupKey && mapping.byLookupKey[lookupKey]) {
    return {
      policyId: mapping.byLookupKey[lookupKey].keygenPolicyId,
      planCode: mapping.byLookupKey[lookupKey].planCode || lookupKey,
      source: "lookup-key"
    };
  }

  const priceId = metadata.price_id;
  if (priceId && mapping.byPriceId[priceId]) {
    return {
      policyId: mapping.byPriceId[priceId].keygenPolicyId,
      planCode: mapping.byPriceId[priceId].planCode || priceId,
      source: "price-id"
    };
  }

  return null;
}

async function ensureNotDuplicateEvent(env, eventId) {
  if (!env.BILLING_EVENTS_KV || !eventId) return { duplicate: false };

  const alreadySeen = await env.BILLING_EVENTS_KV.get(eventId);
  if (alreadySeen) return { duplicate: true };

  await env.BILLING_EVENTS_KV.put(eventId, "1", { expirationTtl: 60 * 60 * 24 * 14 });
  return { duplicate: false };
}

async function callKeygenCreateLicense(env, payload) {
  if (!env.KEYGEN_ACCOUNT_ID || !env.KEYGEN_API_TOKEN) {
    throw new Error("keygen-config-missing");
  }

  const keygenBase = env.KEYGEN_API_BASE_URL || "https://api.keygen.sh";
  const url = `${keygenBase}/v1/accounts/${env.KEYGEN_ACCOUNT_ID}/licenses`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/vnd.api+json",
      accept: "application/vnd.api+json",
      authorization: `Bearer ${env.KEYGEN_API_TOKEN}`
    },
    body: JSON.stringify({
      data: {
        type: "licenses",
        attributes: {
          metadata: payload.metadata
        },
        relationships: {
          policy: {
            data: {
              type: "policies",
              id: payload.policyId
            }
          }
        }
      }
    })
  });

  const bodyText = await response.text();
  let body;

  try {
    body = JSON.parse(bodyText);
  } catch {
    body = { raw: bodyText };
  }

  if (!response.ok) {
    throw new Error(`keygen-create-license-failed:${response.status}:${JSON.stringify(body)}`);
  }

  return body;
}

async function postM365Flow(env, eventType, payload) {
  if (!env.M365_FLOW_WEBHOOK_URL) {
    return { sent: false, reason: "m365-flow-not-configured" };
  }

  const response = await fetch(env.M365_FLOW_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      source: "audittoolkit-cloudflare-worker",
      eventType,
      payload,
      timestamp: new Date().toISOString()
    })
  });

  if (!response.ok) {
    throw new Error(`m365-flow-post-failed:${response.status}`);
  }

  return { sent: true };
}

async function handleCheckoutCompleted(event, env) {
  const session = event.data?.object || {};
  const resolvedPlan = resolvePlanFromCheckoutSession(session, env);

  if (!resolvedPlan) {
    await postM365Flow(env, "billing.plan_unresolved", {
      stripeEventId: event.id,
      stripeSessionId: session.id,
      metadata: session.metadata || {}
    });

    return {
      ok: true,
      action: "no-license-created",
      reason: "plan-mapping-not-found"
    };
  }

  const keygenResult = await callKeygenCreateLicense(env, {
    policyId: resolvedPlan.policyId,
    metadata: {
      stripe_event_id: event.id,
      stripe_session_id: session.id,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      stripe_payment_intent: session.payment_intent,
      customer_email: session.customer_details?.email,
      plan_code: resolvedPlan.planCode,
      mapping_source: resolvedPlan.source
    }
  });

  await postM365Flow(env, "billing.license_issued", {
    stripeEventId: event.id,
    stripeSessionId: session.id,
    customerEmail: session.customer_details?.email,
    planCode: resolvedPlan.planCode,
    keygenLicenseId: keygenResult?.data?.id,
    keygenLicenseKey: keygenResult?.data?.attributes?.key
  });

  return {
    ok: true,
    action: "license-created",
    planCode: resolvedPlan.planCode,
    keygenLicenseId: keygenResult?.data?.id
  };
}

async function handleStripeEvent(event, env) {
  switch (event.type) {
    case "checkout.session.completed":
      return handleCheckoutCompleted(event, env);

    case "invoice.payment_failed":
    case "customer.subscription.deleted":
    case "customer.subscription.updated":
    case "invoice.paid":
      await postM365Flow(env, `billing.${event.type.replace(/\./g, "_")}`, {
        stripeEventId: event.id,
        stripeObject: event.data?.object || {}
      });
      return { ok: true, action: "notified-flow", eventType: event.type };

    default:
      return { ok: true, action: "ignored", eventType: event.type };
  }
}

function unauthorized() {
  return json({ ok: false, error: "unauthorized" }, 401);
}

function serverError(err) {
  return json(
    {
      ok: false,
      error: "internal_error",
      message: err instanceof Error ? err.message : String(err)
    },
    500
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "audittoolkit-billing-worker",
        timestamp: new Date().toISOString()
      });
    }

    if (request.method === "POST" && url.pathname === "/webhooks/stripe") {
      try {
        const rawBody = await request.text();
        const verification = await verifyStripeWebhook(request, rawBody, env);

        if (!verification.ok) {
          return json({ ok: false, error: verification.reason }, 401);
        }

        const event = JSON.parse(rawBody);
        const dedupe = await ensureNotDuplicateEvent(env, event.id);

        if (dedupe.duplicate) {
          return json({ ok: true, duplicate: true, eventId: event.id });
        }

        const result = await handleStripeEvent(event, env);
        return json({ ok: true, eventId: event.id, result });
      } catch (err) {
        return serverError(err);
      }
    }

    if (request.method === "POST" && url.pathname === "/admin/reissue-license") {
      const adminToken = request.headers.get("x-admin-token");
      if (!env.ADMIN_API_TOKEN || adminToken !== env.ADMIN_API_TOKEN) {
        return unauthorized();
      }

      try {
        const payload = await request.json();

        await postM365Flow(env, "billing.manual_reissue_requested", {
          request: payload
        });

        return json({ ok: true, action: "queued-manual-reissue" });
      } catch (err) {
        return serverError(err);
      }
    }

    return json({ ok: false, error: "not_found" }, 404);
  }
};
