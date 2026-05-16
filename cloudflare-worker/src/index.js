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
  const parsed = {
    timestamp: null,
    signaturesV1: []
  };

  for (const part of parts) {
    const [key, value] = part.split("=");
    if (!key || !value) continue;

    if (key === "t") parsed.timestamp = value;
    if (key === "v1") parsed.signaturesV1.push(value);
  }

  if (!parsed.timestamp || parsed.signaturesV1.length === 0) return null;
  return parsed;
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

function parseHttpSignatureHeader(signatureHeader) {
  if (!signatureHeader) return null;

  const parsed = {};
  const parts = signatureHeader.split(",");

  for (const part of parts) {
    const [rawKey, ...rawValueParts] = part.trim().split("=");
    if (!rawKey || rawValueParts.length === 0) continue;

    let rawValue = rawValueParts.join("=").trim();
    if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
      rawValue = rawValue.slice(1, -1);
    }

    parsed[rawKey.toLowerCase()] = rawValue;
  }

  if (!parsed.algorithm || !parsed.signature || !parsed.headers) return null;

  return {
    algorithm: parsed.algorithm.toLowerCase(),
    signature: parsed.signature,
    headers: parsed.headers
      .split(/\s+/)
      .map((header) => header.trim().toLowerCase())
      .filter(Boolean),
    keyid: parsed.keyid || null
  };
}

function base64ToBytes(value) {
  try {
    const decoded = atob(value);
    const bytes = new Uint8Array(decoded.length);

    for (let i = 0; i < decoded.length; i += 1) {
      bytes[i] = decoded.charCodeAt(i);
    }

    return bytes;
  } catch {
    return null;
  }
}

function bytesToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

function pemToSpkiBytes(publicKeyPem) {
  if (!publicKeyPem || typeof publicKeyPem !== "string") return null;

  const sanitized = publicKeyPem
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\s+/g, "");

  return base64ToBytes(sanitized);
}

async function sha256Base64(value) {
  const digest = await crypto.subtle.digest("SHA-256", TEXT_ENCODER.encode(value));
  return bytesToBase64(new Uint8Array(digest));
}

async function verifyKeygenWebhook(request, rawBody, env) {
  const publicKeyPem = env.KEYGEN_WEBHOOK_PUBLIC_KEY || env.KEYGEN_WEBHOOK_SECRET;
  if (!publicKeyPem) {
    return { ok: false, verified: false, reason: "missing-keygen-public-key" };
  }

  const signatureHeader =
    request.headers.get("keygen-signature") ||
    request.headers.get("x-keygen-signature");
  const parsedSignature = parseHttpSignatureHeader(signatureHeader);

  if (!parsedSignature) {
    return { ok: false, verified: false, reason: "missing-or-invalid-keygen-signature" };
  }

  if (parsedSignature.algorithm !== "ed25519") {
    return {
      ok: false,
      verified: false,
      reason: `unsupported-keygen-signature-algorithm:${parsedSignature.algorithm}`
    };
  }

  const dateHeader = request.headers.get("date");
  if (!dateHeader) {
    return { ok: false, verified: false, reason: "missing-date-header" };
  }

  const dateMs = Date.parse(dateHeader);
  if (!Number.isFinite(dateMs)) {
    return { ok: false, verified: false, reason: "invalid-date-header" };
  }

  const nowMs = Date.now();
  const skewMs = Math.abs(nowMs - dateMs);
  if (skewMs > 5 * 60 * 1000) {
    return { ok: false, verified: false, reason: "date-skew" };
  }

  const providedDigest = request.headers.get("digest");
  if (!providedDigest) {
    return { ok: false, verified: false, reason: "missing-digest-header" };
  }

  const expectedDigest = `sha-256=${await sha256Base64(rawBody)}`;
  if (!timingSafeEqual(expectedDigest, providedDigest.trim())) {
    return { ok: false, verified: false, reason: "digest-mismatch" };
  }

  const requestUrl = new URL(request.url);
  const requestTarget = `${request.method.toLowerCase()} ${requestUrl.pathname}${requestUrl.search}`;
  const hostHeader = request.headers.get("host") || requestUrl.host;

  const signingLines = [];
  for (const headerName of parsedSignature.headers) {
    switch (headerName) {
      case "(request-target)":
        signingLines.push(`(request-target): ${requestTarget}`);
        break;
      case "host":
        signingLines.push(`host: ${hostHeader}`);
        break;
      case "date":
        signingLines.push(`date: ${dateHeader}`);
        break;
      case "digest":
        signingLines.push(`digest: ${expectedDigest}`);
        break;
      default: {
        const headerValue = request.headers.get(headerName);
        if (!headerValue) {
          return {
            ok: false,
            verified: false,
            reason: `missing-signed-header:${headerName}`
          };
        }

        signingLines.push(`${headerName}: ${headerValue}`);
      }
    }
  }

  const signingData = signingLines.join("\n");
  const signatureBytes = base64ToBytes(parsedSignature.signature);
  if (!signatureBytes) {
    return { ok: false, verified: false, reason: "invalid-signature-encoding" };
  }

  const spkiBytes = pemToSpkiBytes(publicKeyPem);
  if (!spkiBytes) {
    return { ok: false, verified: false, reason: "invalid-keygen-public-key" };
  }

  const spki = spkiBytes.buffer.slice(
    spkiBytes.byteOffset,
    spkiBytes.byteOffset + spkiBytes.byteLength
  );

  const key = await crypto.subtle.importKey("spki", spki, { name: "Ed25519" }, false, [
    "verify"
  ]);

  const verified = await crypto.subtle.verify(
    "Ed25519",
    key,
    signatureBytes,
    TEXT_ENCODER.encode(signingData)
  );

  if (!verified) {
    return { ok: false, verified: false, reason: "keygen-signature-mismatch" };
  }

  return { ok: true, verified: true, keyid: parsedSignature.keyid };
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

  const signatureMatch = parsed.signaturesV1.some((candidate) => timingSafeEqual(expected, candidate));
  if (!signatureMatch) {
    return { ok: false, reason: "signature-mismatch" };
  }

  return { ok: true };
}

function parseJsonSafe(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function parseMetadataField(metadata, key) {
  const value = metadata?.[key];
  if (!value || typeof value !== "string") return null;
  return value.trim() || null;
}

function getPlanMapping(env) {
  if (!env.PRICE_POLICY_MAP_JSON) return { byPriceId: {}, byLookupKey: {}, byProductId: {} };

  const parsed = parseJsonSafe(env.PRICE_POLICY_MAP_JSON, {});
  return {
    byPriceId: parsed?.byPriceId || {},
    byLookupKey: parsed?.byLookupKey || {},
    byProductId: parsed?.byProductId || {}
  };
}

function resolveFromLookupKey(lookupKey, mapping) {
  if (!lookupKey || !mapping.byLookupKey[lookupKey]) return null;

  return {
    policyId: mapping.byLookupKey[lookupKey].keygenPolicyId,
    planCode: mapping.byLookupKey[lookupKey].planCode || lookupKey,
    source: "lookup-key"
  };
}

function resolveFromPriceId(priceId, mapping) {
  if (!priceId || !mapping.byPriceId[priceId]) return null;

  return {
    policyId: mapping.byPriceId[priceId].keygenPolicyId,
    planCode: mapping.byPriceId[priceId].planCode || priceId,
    source: "price-id"
  };
}

function resolveFromProductId(productId, mapping) {
  if (!productId || !mapping.byProductId[productId]) return null;

  return {
    policyId: mapping.byProductId[productId].keygenPolicyId,
    planCode: mapping.byProductId[productId].planCode || productId,
    source: "product-id"
  };
}

async function fetchStripeSessionLineItemInfo(sessionId, env) {
  if (!sessionId || !env.STRIPE_API_SECRET) return null;

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}/line_items?limit=1`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${env.STRIPE_API_SECRET}`
      }
    }
  );

  if (!response.ok) return null;

  const payload = parseJsonSafe(await response.text(), {});
  const first = payload?.data?.[0];
  const price = first?.price;

  return {
    priceId: typeof price?.id === "string" ? price.id : null,
    lookupKey: typeof price?.lookup_key === "string" ? price.lookup_key : null,
    productId: typeof price?.product === "string" ? price.product : null
  };
}

async function resolvePlanFromCheckoutSession(session, env) {
  const mapping = getPlanMapping(env);
  const metadata = session.metadata || {};

  const explicitPolicyId = parseMetadataField(metadata, "keygen_policy_id");
  if (explicitPolicyId) {
    return {
      policyId: explicitPolicyId,
      planCode: parseMetadataField(metadata, "plan_code") || "custom",
      source: "session-metadata"
    };
  }

  const metadataLookup = parseMetadataField(metadata, "plan_lookup_key");
  const fromLookup = resolveFromLookupKey(metadataLookup, mapping);
  if (fromLookup) return fromLookup;

  const metadataPrice = parseMetadataField(metadata, "price_id");
  const fromPrice = resolveFromPriceId(metadataPrice, mapping);
  if (fromPrice) return fromPrice;

  const metadataProduct = parseMetadataField(metadata, "product_id");
  const fromProduct = resolveFromProductId(metadataProduct, mapping);
  if (fromProduct) return fromProduct;

  const lineItemInfo = await fetchStripeSessionLineItemInfo(session.id, env);

  const fromLineLookup = resolveFromLookupKey(lineItemInfo?.lookupKey, mapping);
  if (fromLineLookup) return { ...fromLineLookup, source: "stripe-line-item-lookup" };

  const fromLinePrice = resolveFromPriceId(lineItemInfo?.priceId, mapping);
  if (fromLinePrice) return { ...fromLinePrice, source: "stripe-line-item-price" };

  const fromLineProduct = resolveFromProductId(lineItemInfo?.productId, mapping);
  if (fromLineProduct) return { ...fromLineProduct, source: "stripe-line-item-product" };

  return null;
}

async function ensureNotDuplicateEvent(env, eventId) {
  if (!env.BILLING_EVENTS_KV || !eventId) return { duplicate: false };

  const key = `evt:${eventId}`;
  const alreadySeen = await env.BILLING_EVENTS_KV.get(key);
  if (alreadySeen) return { duplicate: true };

  await env.BILLING_EVENTS_KV.put(key, "1", { expirationTtl: 60 * 60 * 24 * 14 });
  return { duplicate: false };
}

async function getExistingSessionLicense(env, sessionId) {
  if (!env.BILLING_EVENTS_KV || !sessionId) return null;

  const key = `session:${sessionId}`;
  const value = await env.BILLING_EVENTS_KV.get(key);
  if (!value) return null;

  return parseJsonSafe(value, null);
}

async function setSessionLicense(env, sessionId, licenseRecord) {
  if (!env.BILLING_EVENTS_KV || !sessionId || !licenseRecord) return;

  const key = `session:${sessionId}`;
  await env.BILLING_EVENTS_KV.put(key, JSON.stringify(licenseRecord), {
    expirationTtl: 60 * 60 * 24 * 120
  });
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
  const existingLicense = await getExistingSessionLicense(env, session.id);
  if (existingLicense?.keygenLicenseId) {
    await postM365Flow(env, "billing.license_already_exists", {
      stripeEventId: event.id,
      stripeSessionId: session.id,
      existingLicense
    });

    return {
      ok: true,
      action: "license-already-exists",
      keygenLicenseId: existingLicense.keygenLicenseId
    };
  }

  const resolvedPlan = await resolvePlanFromCheckoutSession(session, env);

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

  const issuedLicense = {
    keygenLicenseId: keygenResult?.data?.id,
    keygenLicenseKey: keygenResult?.data?.attributes?.key,
    stripeSessionId: session.id,
    stripeEventId: event.id,
    planCode: resolvedPlan.planCode,
    issuedAt: new Date().toISOString()
  };

  await setSessionLicense(env, session.id, issuedLicense);

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
    case "checkout.session.async_payment_succeeded":
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
        features: {
          stripeApiFallback: Boolean(env.STRIPE_API_SECRET),
          keygenWebhookValidation: Boolean(
            env.KEYGEN_WEBHOOK_PUBLIC_KEY || env.KEYGEN_WEBHOOK_SECRET
          ),
          idempotencyKv: Boolean(env.BILLING_EVENTS_KV)
        },
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

    if (request.method === "POST" && url.pathname === "/webhooks/keygen") {
      try {
        const rawBody = await request.text();
        const verification = await verifyKeygenWebhook(request, rawBody, env);
        if (!verification.ok) {
          return json({ ok: false, error: verification.reason }, 401);
        }

        const event = parseJsonSafe(rawBody, {});
        await postM365Flow(env, "billing.keygen_event", {
          verified: verification.verified,
          keygenEventType: event?.meta?.event,
          keygenPayload: event
        });

        return json({ ok: true, received: true, verified: verification.verified });
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
