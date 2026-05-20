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

function parseResendSignatures(signatureHeader) {
  if (!signatureHeader) return [];

  return signatureHeader
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [version, signature] = part.split(",");
      return {
        version: sanitizeText(version),
        signature: sanitizeText(signature)
      };
    })
    .filter((entry) => entry.version && entry.signature);
}

function normalizeBase64(value) {
  const normalized = sanitizeText(value).replace(/-/g, "+").replace(/_/g, "/");
  if (!normalized) return "";

  const paddingNeeded = (4 - (normalized.length % 4)) % 4;
  return normalized + "=".repeat(paddingNeeded);
}

function decodeSvixSecret(secret) {
  const normalized = sanitizeText(secret);
  if (!normalized) return null;

  if (normalized.startsWith("whsec_")) {
    const encoded = normalizeBase64(normalized.slice("whsec_".length));
    const decoded = base64ToBytes(encoded);
    if (decoded) return decoded;
  }

  return TEXT_ENCODER.encode(normalized);
}

async function hmacSha256Base64(secret, payload) {
  const keyBytes = decodeSvixSecret(secret);
  if (!keyBytes) return "";

  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, TEXT_ENCODER.encode(payload));
  return bytesToBase64(new Uint8Array(signature));
}

async function verifyResendWebhook(request, rawBody, env) {
  if (!env.RESEND_WEBHOOK_SECRET) {
    return { ok: false, reason: "missing-resend-webhook-secret" };
  }

  const resendId = sanitizeText(request.headers.get("svix-id"));
  const resendTimestamp = sanitizeText(request.headers.get("svix-timestamp"));
  const resendSignatureHeader = request.headers.get("svix-signature");
  const signatures = parseResendSignatures(resendSignatureHeader).filter(
    (entry) => entry.version === "v1"
  );

  if (!resendId || !resendTimestamp || signatures.length === 0) {
    return { ok: false, reason: "missing-or-invalid-resend-signature-headers" };
  }

  const timestampSeconds = Number(resendTimestamp);
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(timestampSeconds) || Math.abs(nowSeconds - timestampSeconds) > 300) {
    return { ok: false, reason: "resend-timestamp-skew" };
  }

  const signedContent = `${resendId}.${resendTimestamp}.${rawBody}`;
  const expected = normalizeBase64(await hmacSha256Base64(env.RESEND_WEBHOOK_SECRET, signedContent));
  if (!expected) {
    return { ok: false, reason: "resend-signature-generation-failed" };
  }

  const signatureMatch = signatures.some((entry) =>
    timingSafeEqual(normalizeBase64(entry.signature), expected)
  );

  if (!signatureMatch) {
    return { ok: false, reason: "resend-signature-mismatch" };
  }

  return {
    ok: true,
    resendWebhookId: resendId
  };
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

  let verified = false;
  try {
    const key = await crypto.subtle.importKey("spki", spki, { name: "Ed25519" }, false, [
      "verify"
    ]);

    verified = await crypto.subtle.verify(
      "Ed25519",
      key,
      signatureBytes,
      TEXT_ENCODER.encode(signingData)
    );
  } catch (error) {
    return {
      ok: false,
      verified: false,
      reason: `keygen-verification-runtime-error:${
        error instanceof Error ? error.message : String(error)
      }`
    };
  }

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

function jsonDownload(data, filename, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`
    }
  });
}

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(sanitizeText(value), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function toBoolean(value, fallback = false) {
  const normalized = sanitizeText(value).toLowerCase();
  if (!normalized) return fallback;
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

function canUseNoKeyFallback(url, env) {
  const host = sanitizeText(url?.hostname || "").toLowerCase();
  const localHost = host === "localhost" || host === "127.0.0.1";
  return localHost || toBoolean(env.NVD_ALLOW_NO_KEY, false);
}

function nvdHeaders(env) {
  const headers = {
    "content-type": "application/json",
    "user-agent": "audittoolkit-nvd-broker/1.0"
  };

  if (env.NVD_API_KEY) {
    headers.apiKey = env.NVD_API_KEY;
  }

  return headers;
}

function nvdBaseUrl(env) {
  return sanitizeText(env.NVD_API_BASE_URL) || "https://services.nvd.nist.gov/rest/json/cves/2.0";
}

function buildNvdProxyCacheKey(pathAndQuery) {
  return `nvd-cache:${pathAndQuery}`;
}

async function readNvdCache(env, key) {
  const cache = caches.default;
  const cacheRequest = new Request(`https://nvd-cache.internal/${encodeURIComponent(key)}`);

  const cachedResponse = await cache.match(cacheRequest);
  if (cachedResponse) {
    const payload = parseJsonSafe(await cachedResponse.text(), null);
    if (payload) {
      return { source: "cache-api", payload };
    }
  }

  if (!env.BILLING_EVENTS_KV) return null;
  const value = await env.BILLING_EVENTS_KV.get(key);
  if (!value) return null;

  const payload = parseJsonSafe(value, null);
  if (!payload) return null;
  return { source: "kv", payload };
}

async function writeNvdCache(env, key, payload, ttlSeconds) {
  if (!payload) return;

  const cache = caches.default;
  const cacheRequest = new Request(`https://nvd-cache.internal/${encodeURIComponent(key)}`);
  await cache.put(
    cacheRequest,
    new Response(JSON.stringify(payload), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": `public, max-age=${ttlSeconds}`
      }
    })
  );

  if (!env.BILLING_EVENTS_KV) return;
  await env.BILLING_EVENTS_KV.put(key, JSON.stringify(payload), { expirationTtl: ttlSeconds });
}

async function enforceNvdRateLimit(env, minIntervalMs) {
  if (!env.BILLING_EVENTS_KV) {
    return { ok: true, limitedByKv: false };
  }

  const key = "nvd:rate:last-upstream-call-ms";
  const now = Date.now();
  const lastRaw = await env.BILLING_EVENTS_KV.get(key);
  const last = Number(lastRaw || "0");

  if (Number.isFinite(last) && last > 0) {
    const elapsed = now - last;
    if (elapsed < minIntervalMs) {
      const retryAfterSeconds = Math.ceil((minIntervalMs - elapsed) / 1000);
      return {
        ok: false,
        limitedByKv: true,
        retryAfterSeconds
      };
    }
  }

  await env.BILLING_EVENTS_KV.put(key, String(now), { expirationTtl: 3600 });
  return { ok: true, limitedByKv: true };
}

function isAuthorizedForBroker(request, env) {
  const expected = sanitizeText(env.NVD_BROKER_TOKEN);
  if (!expected) return true;

  const received = sanitizeText(request.headers.get("x-broker-token"));
  return Boolean(received && timingSafeEqual(received, expected));
}

function getNvdQuotaConfig(env) {
  return {
    windowSeconds: toPositiveInteger(env.NVD_QUOTA_WINDOW_SECONDS, 24 * 60 * 60),
    customerLimit: toPositiveInteger(env.NVD_QUOTA_PER_WINDOW, 5000),
    anonymousLimit: toPositiveInteger(env.NVD_ANON_QUOTA_PER_WINDOW, 250),
    enforceCustomerId: toBoolean(env.NVD_ENFORCE_CUSTOMER_ID, false)
  };
}

function sanitizeQuotaCustomerId(value) {
  const normalized = sanitizeText(value).toLowerCase();
  if (!normalized) return "";

  const safe = normalized.replace(/[^a-z0-9._:-]/g, "").slice(0, 80);
  return safe;
}

function resolveNvdCustomerIdentity(request, env) {
  const explicitCustomerId = sanitizeQuotaCustomerId(
    request.headers.get("x-customer-id") || request.headers.get("x-toolkit-customer-id")
  );

  if (explicitCustomerId) {
    return {
      customerId: explicitCustomerId,
      source: "header",
      anonymous: false
    };
  }

  const config = getNvdQuotaConfig(env);
  if (config.enforceCustomerId) {
    return {
      error: "missing_customer_id",
      message:
        "Missing customer identity header. Send x-customer-id (or x-toolkit-customer-id), or disable NVD_ENFORCE_CUSTOMER_ID."
    };
  }

  const ipDerived = sanitizeQuotaCustomerId(request.headers.get("cf-connecting-ip"));
  if (ipDerived) {
    return {
      customerId: `ip:${ipDerived}`,
      source: "cf-connecting-ip",
      anonymous: true
    };
  }

  return {
    customerId: "anonymous",
    source: "anonymous",
    anonymous: true
  };
}

function withNvdQuotaHeaders(response, quota) {
  if (!quota) return response;

  const headers = new Headers(response.headers);
  headers.set("x-quota-limit", String(quota.limit));
  headers.set("x-quota-remaining", String(quota.remaining));
  headers.set("x-quota-reset", String(quota.resetAtUnix));
  headers.set("x-quota-customer", quota.customerId);
  headers.set("x-quota-customer-source", quota.customerSource);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function enforceNvdCustomerQuota(request, env) {
  if (!env.BILLING_EVENTS_KV) {
    return {
      ok: true,
      quota: null
    };
  }

  const identity = resolveNvdCustomerIdentity(request, env);
  if (identity.error) {
    return {
      ok: false,
      response: json({ ok: false, error: identity.error, message: identity.message }, 400)
    };
  }

  const config = getNvdQuotaConfig(env);
  const nowUnix = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(nowUnix / config.windowSeconds) * config.windowSeconds;
  const resetAtUnix = windowStart + config.windowSeconds;
  const ttlSeconds = Math.max(resetAtUnix - nowUnix + 60, 60);
  const limit = identity.anonymous ? config.anonymousLimit : config.customerLimit;
  const quotaKey = `nvd:quota:${identity.customerId}:${windowStart}`;

  const rawCount = await env.BILLING_EVENTS_KV.get(quotaKey);
  const used = Number.parseInt(rawCount || "0", 10);
  const currentUsed = Number.isFinite(used) && used > 0 ? used : 0;

  if (currentUsed >= limit) {
    const retryAfterSeconds = Math.max(resetAtUnix - nowUnix, 1);
    const response = json(
      {
        ok: false,
        error: "nvd_customer_quota_exceeded",
        message: "Customer quota exceeded for current window.",
        retryAfterSeconds,
        quota: {
          limit,
          used: currentUsed,
          remaining: 0,
          resetAtUnix,
          customerId: identity.customerId,
          customerSource: identity.source
        }
      },
      429
    );

    return {
      ok: false,
      response: withNvdQuotaHeaders(response, {
        limit,
        remaining: 0,
        resetAtUnix,
        customerId: identity.customerId,
        customerSource: identity.source
      })
    };
  }

  const nextUsed = currentUsed + 1;
  await env.BILLING_EVENTS_KV.put(quotaKey, String(nextUsed), { expirationTtl: ttlSeconds });

  return {
    ok: true,
    quota: {
      limit,
      remaining: Math.max(limit - nextUsed, 0),
      resetAtUnix,
      customerId: identity.customerId,
      customerSource: identity.source
    }
  };
}

async function fetchNvdData(urlPathAndQuery, env, options = {}) {
  const cacheTtlSeconds = toPositiveInteger(
    env.NVD_CACHE_TTL_SECONDS,
    options.defaultCacheTtlSeconds || 3600
  );
  const cacheKey = buildNvdProxyCacheKey(urlPathAndQuery);

  const cached = await readNvdCache(env, cacheKey);
  if (cached?.payload) {
    return {
      ok: true,
      cached: true,
      cacheSource: cached.source,
      payload: cached.payload
    };
  }

  const hasNvdKey = Boolean(env.NVD_API_KEY);
  const fallbackMode = !hasNvdKey;
  const minIntervalMs = hasNvdKey
    ? toPositiveInteger(env.NVD_MIN_INTERVAL_MS, 1200)
    : toPositiveInteger(env.NVD_NO_KEY_MIN_INTERVAL_MS, 8000);

  const limiter = await enforceNvdRateLimit(env, minIntervalMs);
  if (!limiter.ok) {
    return {
      ok: false,
      status: 429,
      error: "nvd_rate_limited",
      retryAfterSeconds: limiter.retryAfterSeconds
    };
  }

  const upstream = `${nvdBaseUrl(env)}${urlPathAndQuery}`;
  const response = await fetch(upstream, {
    method: "GET",
    headers: nvdHeaders(env)
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: "nvd_upstream_error",
      message: await response.text()
    };
  }

  const payload = parseJsonSafe(await response.text(), null);
  if (!payload) {
    return {
      ok: false,
      status: 502,
      error: "nvd_invalid_response"
    };
  }

  const wrapped = {
    fetchedAt: new Date().toISOString(),
    fallbackNoKeyMode: fallbackMode,
    data: payload
  };

  await writeNvdCache(env, cacheKey, wrapped, cacheTtlSeconds);
  return {
    ok: true,
    cached: false,
    cacheSource: "upstream",
    payload: wrapped
  };
}

async function handleNvdCveLookup(request, env, url) {
  const cveId = sanitizeText(decodeURIComponent(url.pathname.split("/").pop() || "")).toUpperCase();
  if (!/^CVE-\d{4}-\d{4,}$/.test(cveId)) {
    return json({ ok: false, error: "invalid_cve_id", cveId }, 400);
  }

  const result = await fetchNvdData(`?cveId=${encodeURIComponent(cveId)}`, env, {
    defaultCacheTtlSeconds: 4 * 60 * 60
  });

  if (!result.ok) {
    const status = result.status || 500;
    const headers = {};
    if (result.retryAfterSeconds) {
      headers["retry-after"] = String(result.retryAfterSeconds);
    }

    return new Response(
      JSON.stringify(
        {
          ok: false,
          error: result.error,
          message: result.message || null,
          retryAfterSeconds: result.retryAfterSeconds || null
        },
        null,
        2
      ),
      {
        status,
        headers: {
          "content-type": "application/json; charset=utf-8",
          ...headers
        }
      }
    );
  }

  return json({
    ok: true,
    cveId,
    cached: result.cached,
    cacheSource: result.cacheSource,
    payload: result.payload
  });
}

async function handleNvdSearch(request, env, url) {
  const params = new URLSearchParams();
  const allowedParams = [
    "cpeName",
    "keywordSearch",
    "cvssV3Severity",
    "pubStartDate",
    "pubEndDate",
    "lastModStartDate",
    "lastModEndDate",
    "resultsPerPage",
    "startIndex"
  ];

  for (const key of allowedParams) {
    const value = sanitizeText(url.searchParams.get(key));
    if (value) params.set(key, value);
  }

  if ([...params.keys()].length === 0) {
    return json(
      {
        ok: false,
        error: "missing_query",
        message: "Provide at least one supported filter (for example: cpeName or keywordSearch)."
      },
      400
    );
  }

  const result = await fetchNvdData(`?${params.toString()}`, env, {
    defaultCacheTtlSeconds: 60 * 60
  });

  if (!result.ok) {
    const status = result.status || 500;
    return json(
      {
        ok: false,
        error: result.error,
        message: result.message || null,
        retryAfterSeconds: result.retryAfterSeconds || null
      },
      status
    );
  }

  return json({
    ok: true,
    cached: result.cached,
    cacheSource: result.cacheSource,
    payload: result.payload
  });
}

async function handleNvdCveDownload(request, env, url) {
  const cveId = sanitizeText(decodeURIComponent(url.pathname.split("/").pop() || "")).toUpperCase();
  if (!/^CVE-\d{4}-\d{4,}$/.test(cveId)) {
    return json({ ok: false, error: "invalid_cve_id", cveId }, 400);
  }

  const result = await fetchNvdData(`?cveId=${encodeURIComponent(cveId)}`, env, {
    defaultCacheTtlSeconds: 4 * 60 * 60
  });

  if (!result.ok) {
    return json(
      {
        ok: false,
        error: result.error,
        message: result.message || null,
        retryAfterSeconds: result.retryAfterSeconds || null
      },
      result.status || 500
    );
  }

  const filename = `${cveId.toLowerCase()}.json`;
  return jsonDownload(
    {
      ok: true,
      cveId,
      cached: result.cached,
      cacheSource: result.cacheSource,
      payload: result.payload
    },
    filename
  );
}

async function handleNvdSearchDownload(request, env, url) {
  const params = new URLSearchParams();
  const allowedParams = [
    "cpeName",
    "keywordSearch",
    "cvssV3Severity",
    "pubStartDate",
    "pubEndDate",
    "lastModStartDate",
    "lastModEndDate",
    "resultsPerPage",
    "startIndex"
  ];

  for (const key of allowedParams) {
    const value = sanitizeText(url.searchParams.get(key));
    if (value) params.set(key, value);
  }

  if ([...params.keys()].length === 0) {
    return json(
      {
        ok: false,
        error: "missing_query",
        message: "Provide at least one supported filter (for example: cpeName or keywordSearch)."
      },
      400
    );
  }

  const result = await fetchNvdData(`?${params.toString()}`, env, {
    defaultCacheTtlSeconds: 60 * 60
  });

  if (!result.ok) {
    return json(
      {
        ok: false,
        error: result.error,
        message: result.message || null,
        retryAfterSeconds: result.retryAfterSeconds || null
      },
      result.status || 500
    );
  }

  const filename = `nvd-search-${Date.now()}.json`;
  return jsonDownload(
    {
      ok: true,
      cached: result.cached,
      cacheSource: result.cacheSource,
      filters: Object.fromEntries(params.entries()),
      payload: result.payload
    },
    filename
  );
}

async function handleNvdCacheRefresh(request, env) {
  const payload = await request.json().catch(() => ({}));
  const cveId = sanitizeText(payload?.cveId).toUpperCase();

  if (!/^CVE-\d{4}-\d{4,}$/.test(cveId)) {
    return json({ ok: false, error: "invalid_cve_id", cveId }, 400);
  }

  const cacheKey = buildNvdProxyCacheKey(`?cveId=${encodeURIComponent(cveId)}`);
  if (env.BILLING_EVENTS_KV) {
    await env.BILLING_EVENTS_KV.delete(cacheKey);
  }

  const cache = caches.default;
  const cacheRequest = new Request(`https://nvd-cache.internal/${encodeURIComponent(cacheKey)}`);
  await cache.delete(cacheRequest);

  const result = await fetchNvdData(`?cveId=${encodeURIComponent(cveId)}`, env, {
    defaultCacheTtlSeconds: 4 * 60 * 60
  });

  if (!result.ok) {
    return json(
      {
        ok: false,
        error: result.error,
        message: result.message || null,
        retryAfterSeconds: result.retryAfterSeconds || null
      },
      result.status || 500
    );
  }

  return json({
    ok: true,
    refreshed: true,
    cveId,
    cached: result.cached,
    cacheSource: result.cacheSource,
    payload: result.payload
  });
}

async function handleNvdPrewarm(request, env) {
  const body = await request.json().catch(() => ({}));
  const rawCveIds = Array.isArray(body?.cveIds) ? body.cveIds : [];
  const maxCveIds = toPositiveInteger(env.NVD_PREWARM_MAX_CVE_IDS, 100);

  const cveIds = [...new Set(rawCveIds.map((value) => sanitizeText(value).toUpperCase()))]
    .filter((value) => /^CVE-\d{4}-\d{4,}$/.test(value))
    .slice(0, maxCveIds);

  if (cveIds.length === 0) {
    return json(
      {
        ok: false,
        error: "missing_or_invalid_cve_ids",
        message: "Provide body { cveIds: [\"CVE-YYYY-NNNN\", ...] }"
      },
      400
    );
  }

  const results = [];
  for (const cveId of cveIds) {
    const result = await fetchNvdData(`?cveId=${encodeURIComponent(cveId)}`, env, {
      defaultCacheTtlSeconds: 4 * 60 * 60
    });

    results.push({
      cveId,
      ok: result.ok,
      cached: result.cached || false,
      cacheSource: result.cacheSource || null,
      error: result.error || null,
      status: result.status || 200,
      retryAfterSeconds: result.retryAfterSeconds || null
    });
  }

  const successful = results.filter((item) => item.ok).length;
  return json({
    ok: true,
    requested: cveIds.length,
    successful,
    failed: cveIds.length - successful,
    results
  });
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

async function fetchStripeCheckoutSession(sessionId, env) {
  const normalizedSessionId = sanitizeText(sessionId);
  if (!normalizedSessionId || !env.STRIPE_API_SECRET) return null;

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(normalizedSessionId)}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${env.STRIPE_API_SECRET}`
      }
    }
  );

  if (!response.ok) return null;
  return parseJsonSafe(await response.text(), null);
}

async function fetchStripePaymentLink(paymentLinkId, env) {
  const normalizedPaymentLinkId = sanitizeText(paymentLinkId);
  if (!normalizedPaymentLinkId || !env.STRIPE_API_SECRET) return null;

  const response = await fetch(
    `https://api.stripe.com/v1/payment_links/${encodeURIComponent(normalizedPaymentLinkId)}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${env.STRIPE_API_SECRET}`
      }
    }
  );

  if (!response.ok) return null;
  return parseJsonSafe(await response.text(), null);
}

async function fetchStripePaymentIntent(paymentIntentId, env) {
  const normalizedPaymentIntentId = sanitizeText(paymentIntentId);
  if (!normalizedPaymentIntentId || !env.STRIPE_API_SECRET) return null;

  const response = await fetch(
    `https://api.stripe.com/v1/payment_intents/${encodeURIComponent(normalizedPaymentIntentId)}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${env.STRIPE_API_SECRET}`
      }
    }
  );

  if (!response.ok) return null;
  return parseJsonSafe(await response.text(), null);
}

async function fetchStripeCustomer(customerId, env) {
  const normalizedCustomerId = sanitizeText(customerId);
  if (!normalizedCustomerId || !env.STRIPE_API_SECRET) return null;

  const response = await fetch(
    `https://api.stripe.com/v1/customers/${encodeURIComponent(normalizedCustomerId)}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${env.STRIPE_API_SECRET}`
      }
    }
  );

  if (!response.ok) return null;
  return parseJsonSafe(await response.text(), null);
}

async function fetchStripeInvoice(invoiceId, env) {
  const normalizedInvoiceId = sanitizeText(invoiceId);
  if (!normalizedInvoiceId || !env.STRIPE_API_SECRET) return null;

  const query = new URLSearchParams();
  query.append("expand[]", "customer");
  query.append("expand[]", "payment_intent.latest_charge");

  const response = await fetch(
    `https://api.stripe.com/v1/invoices/${encodeURIComponent(normalizedInvoiceId)}?${query.toString()}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${env.STRIPE_API_SECRET}`
      }
    }
  );

  if (!response.ok) return null;
  return parseJsonSafe(await response.text(), null);
}

async function fetchLatestCheckoutSessionForCustomer(customerId, env) {
  const normalizedCustomerId = sanitizeText(customerId);
  if (!normalizedCustomerId || !env.STRIPE_API_SECRET) return null;

  const query = new URLSearchParams();
  query.append("customer", normalizedCustomerId);
  query.append("limit", "1");

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions?${query.toString()}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${env.STRIPE_API_SECRET}`
      }
    }
  );

  if (!response.ok) return null;

  const payload = parseJsonSafe(await response.text(), {});
  return payload?.data?.[0] || null;
}

async function fetchRecentPaidCheckoutSessions(env, limit = 10) {
  if (!env.STRIPE_API_SECRET) return [];

  const query = new URLSearchParams();
  query.append("limit", String(limit));

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions?${query.toString()}`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${env.STRIPE_API_SECRET}`
      }
    }
  );

  if (!response.ok) return [];

  const payload = parseJsonSafe(await response.text(), {});
  return Array.isArray(payload?.data)
    ? payload.data.filter(
        (session) =>
          sanitizeText(session?.status) === "complete" &&
          sanitizeText(session?.payment_status) === "paid"
      )
    : [];
}

function getInvoiceLineItemIdentity(stripeObject) {
  const firstLine = stripeObject?.lines?.data?.[0];
  return {
    priceId: sanitizeText(firstLine?.pricing?.price_details?.price),
    productId: sanitizeText(firstLine?.pricing?.price_details?.product)
  };
}

async function findMatchingCheckoutSessionForInvoice(stripeObject, env) {
  const invoiceItemIdentity = getInvoiceLineItemIdentity(stripeObject);
  if (!invoiceItemIdentity.priceId && !invoiceItemIdentity.productId) return null;

  const sessions = await fetchRecentPaidCheckoutSessions(env, 10);

  for (const session of sessions) {
    const lineItemInfo = await fetchStripeSessionLineItemInfo(session.id, env);
    const priceMatches =
      invoiceItemIdentity.priceId && lineItemInfo?.priceId === invoiceItemIdentity.priceId;
    const productMatches =
      invoiceItemIdentity.productId && lineItemInfo?.productId === invoiceItemIdentity.productId;

    if (priceMatches || productMatches) {
      return session;
    }
  }

  return null;
}

function mergeCustomerIntoPayload(payload, mergeData) {
  const stripeObject = payload?.stripeObject || {};
  const customerDetails = stripeObject.customer_details || {};

  const mergedCustomerEmail =
    sanitizeCustomerEmail(mergeData.customerEmail) ||
    sanitizeCustomerEmail(payload?.customerEmail) ||
    sanitizeCustomerEmail(stripeObject.customer_email) ||
    sanitizeCustomerEmail(customerDetails.email);

  const mergedCustomerNameRaw =
    sanitizeText(mergeData.customerName) ||
    sanitizeText(payload?.customerName) ||
    sanitizeText(stripeObject.customer_name) ||
    sanitizeText(customerDetails.name);

  const mergedCustomerCompany =
    sanitizeText(mergeData.customerCompany) ||
    sanitizeText(payload?.customerCompany) ||
    sanitizeText(customerDetails.business_name);

  const mergedBillingAddressRaw =
    sanitizeText(mergeData.customerBillingAddress) ||
    sanitizeText(payload?.customerBillingAddress) ||
    formatAddress(stripeObject.customer_address) ||
    formatAddress(customerDetails.address);

  const mergedCustomerName = sanitizeCustomerName(mergedCustomerNameRaw, {
    email: mergedCustomerEmail,
    billingAddress: mergedBillingAddressRaw
  });

  const mergedBillingAddress = sanitizeCustomerBillingAddress(mergedBillingAddressRaw, {
    email: mergedCustomerEmail,
    name: mergedCustomerNameRaw
  });

  return {
    ...payload,
    customerEmail: mergedCustomerEmail,
    customerName: mergedCustomerName,
    customerCompany: mergedCustomerCompany,
    customerBillingAddress: mergedBillingAddress,
    stripeObject: {
      ...stripeObject,
      customer_email: mergedCustomerEmail,
      customer_name: mergedCustomerName,
      customer_address: stripeObject.customer_address || customerDetails.address || null,
      customer_details: {
        ...customerDetails,
        email: mergedCustomerEmail,
        name: mergedCustomerName,
        address: customerDetails.address || stripeObject.customer_address || null,
        business_name: mergedCustomerCompany
      }
    }
  };
}

function hasCustomerIdentity(payload) {
  const customer = extractCustomerContext(payload);
  return Boolean(customer.email || customer.name || customer.company || customer.billingAddress);
}

async function enrichBillingPayloadWithStripeCustomer(payload, env) {
  const stripeObject = payload?.stripeObject || {};
  const stripeCustomerId =
    typeof stripeObject.customer === "string"
      ? stripeObject.customer
      : stripeObject.customer?.id;
  const paymentIntentId =
    typeof stripeObject.payment_intent === "string"
      ? stripeObject.payment_intent
      : stripeObject.payment_intent?.id;

  const hasFullDetails =
    Boolean(stripeObject.customer_details?.name) ||
    Boolean(stripeObject.customer_details?.address?.line1) ||
    Boolean(stripeObject.customer_name) ||
    Boolean(stripeObject.customer_email);

  const enrichmentSources = [];

  if (hasFullDetails) {
    return {
      ...payload,
      enrichmentDebug: {
        sources: ["stripe-event"],
        resolved: true
      }
    };
  }

  let enriched = payload;

  if (paymentIntentId) {
    const paymentProfile = await getPaymentProfile(env, paymentIntentId);
    if (paymentProfile) {
      enriched = mergeCustomerIntoPayload(enriched, {
        customerEmail: sanitizeText(paymentProfile.email),
        customerName: sanitizeText(paymentProfile.name),
        customerCompany: sanitizeText(paymentProfile.company),
        customerBillingAddress: sanitizeText(paymentProfile.billingAddress)
      });
      enrichmentSources.push("payment-profile-cache");
    }
  }

  if (stripeCustomerId) {
    const cachedProfile = await getCustomerProfile(env, stripeCustomerId);
    if (cachedProfile) {
      enriched = mergeCustomerIntoPayload(enriched, {
        customerEmail: sanitizeText(cachedProfile.email),
        customerName: sanitizeText(cachedProfile.name),
        customerCompany: sanitizeText(cachedProfile.company),
        customerBillingAddress: sanitizeText(cachedProfile.billingAddress)
      });
      enrichmentSources.push("customer-profile-cache");
    }

    const customer = await fetchStripeCustomer(stripeCustomerId, env);

    if (customer) {
      const companyFromMetadata =
        sanitizeText(customer.metadata?.company) ||
        sanitizeText(customer.metadata?.company_name) ||
        sanitizeText(customer.metadata?.organization);

      enriched = mergeCustomerIntoPayload(enriched, {
        customerEmail: sanitizeText(customer.email),
        customerName: sanitizeText(customer.name),
        customerCompany: companyFromMetadata,
        customerBillingAddress: formatAddress(customer.address)
      });
      enrichmentSources.push("stripe-customer-api");
    }

    const checkoutSession = await fetchLatestCheckoutSessionForCustomer(stripeCustomerId, env);
    if (checkoutSession) {
      enriched = mergeCustomerIntoPayload(enriched, {
        customerEmail: sanitizeText(checkoutSession.customer_details?.email),
        customerName: sanitizeText(checkoutSession.customer_details?.name),
        customerCompany: sanitizeText(checkoutSession.customer_details?.business_name),
        customerBillingAddress: formatAddress(checkoutSession.customer_details?.address)
      });
      enrichmentSources.push("checkout-session-lookup");
    }
  }

  const invoiceId = sanitizeText(stripeObject.id);
  const isInvoiceObject = sanitizeText(stripeObject.object) === "invoice";

  if (isInvoiceObject && invoiceId) {
    const invoice = await fetchStripeInvoice(invoiceId, env);
    const expandedCustomer = invoice?.customer;
    const latestCharge = invoice?.payment_intent?.latest_charge;
    const billingDetails = latestCharge?.billing_details;

    const invoiceCompany =
      sanitizeText(expandedCustomer?.metadata?.company) ||
      sanitizeText(expandedCustomer?.metadata?.company_name) ||
      sanitizeText(expandedCustomer?.metadata?.organization);

    enriched = mergeCustomerIntoPayload(enriched, {
      customerEmail:
        sanitizeText(expandedCustomer?.email) || sanitizeText(billingDetails?.email),
      customerName: sanitizeText(expandedCustomer?.name) || sanitizeText(billingDetails?.name),
      customerCompany: invoiceCompany,
      customerBillingAddress:
        formatAddress(expandedCustomer?.address) || formatAddress(billingDetails?.address)
    });
    enrichmentSources.push("invoice-expanded-charge");

    if (!hasCustomerIdentity(enriched)) {
      const matchedSession = await findMatchingCheckoutSessionForInvoice(invoice || stripeObject, env);
      if (matchedSession) {
        enriched = mergeCustomerIntoPayload(enriched, {
          customerEmail: sanitizeText(matchedSession.customer_details?.email),
          customerName: sanitizeText(matchedSession.customer_details?.name),
          customerCompany: sanitizeText(matchedSession.customer_details?.business_name),
          customerBillingAddress: formatAddress(matchedSession.customer_details?.address)
        });
        enrichmentSources.push("checkout-session-item-match");
      }
    }
  }

  return {
    ...enriched,
    enrichmentDebug: {
      sources: enrichmentSources,
      resolved: hasCustomerIdentity(enriched)
    }
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

  const paymentLinkId = sanitizeText(session?.payment_link);
  if (paymentLinkId) {
    const paymentLink = await fetchStripePaymentLink(paymentLinkId, env);
    const paymentLinkMetadata = paymentLink?.metadata || {};

    const paymentLinkPolicyId = parseMetadataField(paymentLinkMetadata, "keygen_policy_id");
    if (paymentLinkPolicyId) {
      return {
        policyId: paymentLinkPolicyId,
        planCode: parseMetadataField(paymentLinkMetadata, "plan_code") || "custom",
        source: "payment-link-metadata"
      };
    }

    const paymentLinkLookup = parseMetadataField(paymentLinkMetadata, "plan_lookup_key");
    const fromPaymentLinkLookup = resolveFromLookupKey(paymentLinkLookup, mapping);
    if (fromPaymentLinkLookup) {
      return { ...fromPaymentLinkLookup, source: "payment-link-lookup-key" };
    }

    const paymentLinkPrice = parseMetadataField(paymentLinkMetadata, "price_id");
    const fromPaymentLinkPrice = resolveFromPriceId(paymentLinkPrice, mapping);
    if (fromPaymentLinkPrice) {
      return { ...fromPaymentLinkPrice, source: "payment-link-price-id" };
    }

    const paymentLinkProduct = parseMetadataField(paymentLinkMetadata, "product_id");
    const fromPaymentLinkProduct = resolveFromProductId(paymentLinkProduct, mapping);
    if (fromPaymentLinkProduct) {
      return { ...fromPaymentLinkProduct, source: "payment-link-product-id" };
    }
  }

  const paymentIntentId = sanitizeText(session?.payment_intent);
  if (paymentIntentId) {
    const paymentIntent = await fetchStripePaymentIntent(paymentIntentId, env);
    const paymentIntentMetadata = paymentIntent?.metadata || {};

    const paymentIntentPolicyId = parseMetadataField(paymentIntentMetadata, "keygen_policy_id");
    if (paymentIntentPolicyId) {
      return {
        policyId: paymentIntentPolicyId,
        planCode: parseMetadataField(paymentIntentMetadata, "plan_code") || "custom",
        source: "payment-intent-metadata"
      };
    }

    const paymentIntentLookup = parseMetadataField(paymentIntentMetadata, "plan_lookup_key");
    const fromPaymentIntentLookup = resolveFromLookupKey(paymentIntentLookup, mapping);
    if (fromPaymentIntentLookup) {
      return { ...fromPaymentIntentLookup, source: "payment-intent-lookup-key" };
    }

    const paymentIntentPrice = parseMetadataField(paymentIntentMetadata, "price_id");
    const fromPaymentIntentPrice = resolveFromPriceId(paymentIntentPrice, mapping);
    if (fromPaymentIntentPrice) {
      return { ...fromPaymentIntentPrice, source: "payment-intent-price-id" };
    }

    const paymentIntentProduct = parseMetadataField(paymentIntentMetadata, "product_id");
    const fromPaymentIntentProduct = resolveFromProductId(paymentIntentProduct, mapping);
    if (fromPaymentIntentProduct) {
      return { ...fromPaymentIntentProduct, source: "payment-intent-product-id" };
    }
  }

  const lineItemInfo = await fetchStripeSessionLineItemInfo(session.id, env);

  const fromLineLookup = resolveFromLookupKey(lineItemInfo?.lookupKey, mapping);
  if (fromLineLookup) return { ...fromLineLookup, source: "stripe-line-item-lookup" };

  const fromLinePrice = resolveFromPriceId(lineItemInfo?.priceId, mapping);
  if (fromLinePrice) return { ...fromLinePrice, source: "stripe-line-item-price" };

  const fromLineProduct = resolveFromProductId(lineItemInfo?.productId, mapping);
  if (fromLineProduct) return { ...fromLineProduct, source: "stripe-line-item-product" };

  const defaultPolicyId = sanitizeText(env.DEFAULT_KEYGEN_POLICY_ID);
  if (defaultPolicyId) {
    return {
      policyId: defaultPolicyId,
      planCode: sanitizeText(env.DEFAULT_PLAN_CODE) || "default",
      source: "default-policy-fallback"
    };
  }

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

async function getCustomerProfile(env, customerId) {
  if (!env.BILLING_EVENTS_KV || !customerId) return null;

  const key = `customer:${customerId}`;
  const value = await env.BILLING_EVENTS_KV.get(key);
  if (!value) return null;

  return parseJsonSafe(value, null);
}

async function setCustomerProfile(env, customerId, profile) {
  if (!env.BILLING_EVENTS_KV || !customerId || !profile) return;

  const key = `customer:${customerId}`;
  await env.BILLING_EVENTS_KV.put(key, JSON.stringify(profile), {
    expirationTtl: 60 * 60 * 24 * 365
  });
}

async function getPaymentProfile(env, paymentIntentId) {
  if (!env.BILLING_EVENTS_KV || !paymentIntentId) return null;

  const key = `payment:${paymentIntentId}`;
  const value = await env.BILLING_EVENTS_KV.get(key);
  if (!value) return null;

  return parseJsonSafe(value, null);
}

async function setPaymentProfile(env, paymentIntentId, profile) {
  if (!env.BILLING_EVENTS_KV || !paymentIntentId || !profile) return;

  const key = `payment:${paymentIntentId}`;
  await env.BILLING_EVENTS_KV.put(key, JSON.stringify(profile), {
    expirationTtl: 60 * 60 * 24 * 365
  });
}

function getAutoRetryConfig(env) {
  const enabledRaw = sanitizeText(env.AUTO_RETRY_PLAN_UNRESOLVED).toLowerCase();
  const enabled = enabledRaw === "" || enabledRaw === "1" || enabledRaw === "true";

  const maxAttempts = Math.max(1, Math.min(20, Number(env.AUTO_RETRY_MAX_ATTEMPTS) || 6));
  const baseDelaySeconds = Math.max(
    30,
    Math.min(24 * 60 * 60, Number(env.AUTO_RETRY_BASE_DELAY_SECONDS) || 300)
  );

  return {
    enabled,
    maxAttempts,
    baseDelaySeconds
  };
}

async function getPlanUnresolvedRecord(env, sessionId) {
  if (!env.BILLING_EVENTS_KV || !sessionId) return null;

  const key = `unresolved:${sessionId}`;
  const value = await env.BILLING_EVENTS_KV.get(key);
  if (!value) return null;

  return parseJsonSafe(value, null);
}

async function setPlanUnresolvedRecord(env, sessionId, record) {
  if (!env.BILLING_EVENTS_KV || !sessionId || !record) return;

  const key = `unresolved:${sessionId}`;
  await env.BILLING_EVENTS_KV.put(key, JSON.stringify(record), {
    expirationTtl: 60 * 60 * 24 * 30
  });
}

async function deletePlanUnresolvedRecord(env, sessionId) {
  if (!env.BILLING_EVENTS_KV || !sessionId) return;

  const key = `unresolved:${sessionId}`;
  await env.BILLING_EVENTS_KV.delete(key);
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

function findEmailInKeygenPayload(keygenPayload) {
  const payload = keygenPayload || {};
  const innerPayload = getInnerKeygenPayload(payload);
  const meta = payload?.meta || {};
  const data = payload?.data || {};
  const attributes = data?.attributes || {};
  const innerMeta = innerPayload?.meta || {};
  const innerData = innerPayload?.data || {};
  const innerAttributes = innerData?.attributes || {};

  const directCandidates = [
    attributes?.email,
    attributes?.customer_email,
    innerAttributes?.email,
    innerAttributes?.customer_email,
    meta?.email,
    meta?.customerEmail,
    meta?.customer_email,
    innerMeta?.email,
    innerMeta?.customerEmail,
    innerMeta?.customer_email,
    payload?.customerEmail,
    payload?.customer_email,
    meta?.customer?.email,
    meta?.user?.email,
    innerMeta?.customer?.email,
    innerMeta?.user?.email
  ];

  for (const candidate of directCandidates) {
    const normalized = sanitizeCustomerEmail(candidate);
    if (looksLikeEmail(normalized)) {
      return normalized;
    }
  }

  const included = Array.isArray(payload?.included) ? payload.included : [];
  const innerIncluded = Array.isArray(innerPayload?.included) ? innerPayload.included : [];
  for (const item of [...included, ...innerIncluded]) {
    const includedEmail = sanitizeCustomerEmail(item?.attributes?.email);
    if (looksLikeEmail(includedEmail)) {
      return includedEmail;
    }
  }

  return "";
}

function parseMaybeJsonObject(value) {
  if (value && typeof value === "object") {
    return value;
  }

  if (typeof value === "string") {
    return parseJsonSafe(value, {});
  }

  return {};
}

function getInnerKeygenPayload(keygenPayload) {
  const payload = keygenPayload || {};
  const wrapperPayload = parseMaybeJsonObject(payload?.data?.attributes?.payload);

  if (wrapperPayload && typeof wrapperPayload === "object" && Object.keys(wrapperPayload).length > 0) {
    return wrapperPayload;
  }

  return payload;
}

function extractKeygenLicenseId(candidate) {
  const payload = candidate || {};
  const data = payload?.data || {};
  const dataType = sanitizeText(data?.type).toLowerCase();

  if (dataType === "licenses" && sanitizeText(data?.id)) {
    return sanitizeText(data.id);
  }

  const relationId = sanitizeText(data?.relationships?.license?.data?.id);
  if (relationId) {
    return relationId;
  }

  const attrId = sanitizeText(data?.attributes?.licenseId) || sanitizeText(data?.attributes?.license_id);
  if (attrId) {
    return attrId;
  }

  return "";
}

async function fetchKeygenWebhookEventPayload(env, webhookEventId) {
  if (!env.KEYGEN_ACCOUNT_ID || !env.KEYGEN_API_TOKEN || !webhookEventId) {
    return {};
  }

  try {
    const keygenBase = env.KEYGEN_API_BASE_URL || "https://api.keygen.sh";
    const url = `${keygenBase}/v1/accounts/${env.KEYGEN_ACCOUNT_ID}/webhook-events/${webhookEventId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/vnd.api+json",
        authorization: `Bearer ${env.KEYGEN_API_TOKEN}`
      }
    });

    if (!response.ok) {
      return {};
    }

    const body = parseJsonSafe(await response.text(), {});
    const payload = parseMaybeJsonObject(body?.data?.attributes?.payload);
    return payload && typeof payload === "object" ? payload : {};
  } catch (error) {
    console.error("keygen-webhook-event-lookup-failed", error);
    return {};
  }
}

function resolveKeygenLicenseId(keygenPayload) {
  const innerPayload = getInnerKeygenPayload(keygenPayload);
  return sanitizeText(innerPayload?.data?.id);
}

async function resolveKeygenLicenseContext(env, keygenPayload) {
  const payload = keygenPayload || {};
  const innerPayload = getInnerKeygenPayload(payload);
  const innerData = innerPayload?.data || {};
  const innerAttributes = innerData?.attributes || {};
  const innerRelationships = innerData?.relationships || {};

  const context = {
    licenseId: extractKeygenLicenseId(innerPayload),
    licenseKey: sanitizeText(innerAttributes?.key),
    expiry:
      formatTimestampIso(innerAttributes?.expiry) ||
      formatTimestampIso(innerAttributes?.expiresAt) ||
      formatTimestampIso(innerAttributes?.exp),
    customerEmail: findEmailInKeygenPayload(payload),
    customerCompany:
      sanitizeText(innerAttributes?.metadata?.customer_company) ||
      sanitizeText(innerAttributes?.metadata?.company),
    productId: sanitizeText(innerRelationships?.product?.data?.id),
    licenseType:
      sanitizeText(innerAttributes?.metadata?.plan_code) ||
      sanitizeText(innerRelationships?.policy?.data?.id)
  };

  if (!context.licenseId) {
    const webhookEventId = sanitizeText(payload?.data?.id);
    const eventPayload = await fetchKeygenWebhookEventPayload(env, webhookEventId);
    const nested = getInnerKeygenPayload(eventPayload);
    const nestedData = nested?.data || {};
    const nestedAttrs = nestedData?.attributes || {};
    const nestedRels = nestedData?.relationships || {};

    context.licenseId = extractKeygenLicenseId(nested);
    context.licenseKey = context.licenseKey || sanitizeText(nestedAttrs?.key);
    context.expiry =
      context.expiry ||
      formatTimestampIso(nestedAttrs?.expiry) ||
      formatTimestampIso(nestedAttrs?.expiresAt) ||
      formatTimestampIso(nestedAttrs?.exp);
    context.customerEmail = context.customerEmail || findEmailInKeygenPayload(eventPayload);
    context.customerCompany =
      context.customerCompany ||
      sanitizeText(nestedAttrs?.metadata?.customer_company) ||
      sanitizeText(nestedAttrs?.metadata?.company);
    context.productId = context.productId || sanitizeText(nestedRels?.product?.data?.id);
    context.licenseType =
      context.licenseType ||
      sanitizeText(nestedAttrs?.metadata?.plan_code) ||
      sanitizeText(nestedRels?.policy?.data?.id);
  }

  if (!env.KEYGEN_ACCOUNT_ID || !env.KEYGEN_API_TOKEN || !context.licenseId) {
    return context;
  }

  try {
    const keygenBase = env.KEYGEN_API_BASE_URL || "https://api.keygen.sh";
    const query = new URLSearchParams({ include: "user,owner,policy,product" });
    const url = `${keygenBase}/v1/accounts/${env.KEYGEN_ACCOUNT_ID}/licenses/${context.licenseId}?${query.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/vnd.api+json",
        authorization: `Bearer ${env.KEYGEN_API_TOKEN}`
      }
    });

    if (!response.ok) {
      return context;
    }

    const body = parseJsonSafe(await response.text(), {});
    const licenseData = body?.data || {};
    const licenseAttrs = licenseData?.attributes || {};
    const included = Array.isArray(body?.included) ? body.included : [];

    context.licenseKey = context.licenseKey || sanitizeText(licenseAttrs?.key);
    context.expiry =
      context.expiry ||
      formatTimestampIso(licenseAttrs?.expiry) ||
      formatTimestampIso(licenseAttrs?.expiresAt) ||
      formatTimestampIso(licenseAttrs?.exp);
    context.licenseType =
      context.licenseType ||
      sanitizeText(licenseAttrs?.metadata?.plan_code) ||
      sanitizeText(licenseData?.relationships?.policy?.data?.id);
    context.productId =
      context.productId || sanitizeText(licenseData?.relationships?.product?.data?.id);

    for (const item of included) {
      const itemType = sanitizeText(item?.type);
      const itemAttrs = item?.attributes || {};

      if (!context.customerEmail && ["users", "user", "owners", "owner"].includes(itemType)) {
        const email = sanitizeCustomerEmail(itemAttrs?.email);
        if (looksLikeEmail(email)) {
          context.customerEmail = email;
        }
      }

      if (!context.customerCompany && ["users", "user", "owners", "owner"].includes(itemType)) {
        context.customerCompany =
          sanitizeText(itemAttrs?.metadata?.company) ||
          sanitizeText(itemAttrs?.metadata?.customer_company) ||
          sanitizeText(itemAttrs?.company);
      }

      if (!context.licenseType && ["policies", "policy"].includes(itemType)) {
        context.licenseType = sanitizeText(itemAttrs?.name) || sanitizeText(item?.id);
      }
    }
  } catch (error) {
    console.error("keygen-license-context-lookup-failed", error);
  }

  return context;
}

async function resolveKeygenCustomerEmail(env, keygenPayload) {
  const payloadEmail = findEmailInKeygenPayload(keygenPayload);
  if (looksLikeEmail(payloadEmail)) {
    return payloadEmail;
  }

  if (!env.KEYGEN_ACCOUNT_ID || !env.KEYGEN_API_TOKEN) {
    return "";
  }

  const licenseId = resolveKeygenLicenseId(keygenPayload);
  if (!licenseId) {
    return "";
  }

  try {
    const keygenBase = env.KEYGEN_API_BASE_URL || "https://api.keygen.sh";
    const query = new URLSearchParams({ include: "user,owner" });
    const url = `${keygenBase}/v1/accounts/${env.KEYGEN_ACCOUNT_ID}/licenses/${licenseId}?${query.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/vnd.api+json",
        authorization: `Bearer ${env.KEYGEN_API_TOKEN}`
      }
    });

    if (!response.ok) {
      return "";
    }

    const body = parseJsonSafe(await response.text(), {});
    const included = Array.isArray(body?.included) ? body.included : [];

    for (const item of included) {
      const includedEmail = sanitizeCustomerEmail(item?.attributes?.email);
      if (looksLikeEmail(includedEmail)) {
        return includedEmail;
      }
    }
  } catch (error) {
    console.error("keygen-email-lookup-failed", error);
  }

  return "";
}

function resolveKeygenEventType(payload) {
  const keygenPayload = payload?.keygenPayload || payload || {};
  const innerPayload = getInnerKeygenPayload(keygenPayload);
  const keygenMeta = keygenPayload?.meta || {};
  const keygenData = keygenPayload?.data || {};
  const keygenAttributes = keygenData?.attributes || {};
  const innerMeta = innerPayload?.meta || {};
  const innerData = innerPayload?.data || {};
  const innerAttributes = innerData?.attributes || {};

  return (
    sanitizeText(payload?.keygenEventType) ||
    sanitizeText(innerMeta?.event) ||
    sanitizeText(innerAttributes?.event) ||
    sanitizeText(innerAttributes?.name) ||
    sanitizeText(innerPayload?.event) ||
    sanitizeText(keygenMeta?.event) ||
    sanitizeText(keygenAttributes?.event) ||
    sanitizeText(keygenAttributes?.name) ||
    sanitizeText(keygenPayload?.event) ||
    "unknown"
  );
}

function sanitizeText(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function normalizeIdentityValue(value) {
  return sanitizeText(value)
    .toLowerCase()
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isFixtureEmail(value) {
  const normalized = sanitizeText(value).toLowerCase();
  return normalized === "stripe@example.com";
}

function isFixtureCustomerName(value) {
  return normalizeIdentityValue(value) === "jenny rosen";
}

function isFixtureCustomerBillingAddress(value) {
  return normalizeIdentityValue(value) === "354 oyster point blvd south san francisco ca 94080 us";
}

function sanitizeCustomerEmail(value) {
  const normalized = sanitizeText(value);
  if (!normalized) return "";
  return isFixtureEmail(normalized) ? "" : normalized;
}

function sanitizeCustomerName(value, context = {}) {
  const normalized = sanitizeText(value);
  if (!normalized) return "";

  if (isFixtureEmail(context.email)) return "";

  if (
    isFixtureCustomerName(normalized) &&
    isFixtureCustomerBillingAddress(context.billingAddress)
  ) {
    return "";
  }

  return normalized;
}

function sanitizeCustomerBillingAddress(value, context = {}) {
  const normalized = sanitizeText(value);
  if (!normalized) return "";

  if (isFixtureEmail(context.email)) return "";

  if (
    isFixtureCustomerBillingAddress(normalized) &&
    isFixtureCustomerName(context.name)
  ) {
    return "";
  }

  return normalized;
}

function escapeHtml(value) {
  return sanitizeText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHttpUrl(value) {
  const candidate = sanitizeText(value);
  if (!candidate) return "";
  return /^https?:\/\//i.test(candidate) ? candidate : "";
}

function formatAddress(address) {
  if (!address || typeof address !== "object") return "";

  const parts = [
    sanitizeText(address.line1),
    sanitizeText(address.line2),
    sanitizeText(address.city),
    sanitizeText(address.state),
    sanitizeText(address.postal_code),
    sanitizeText(address.country)
  ].filter(Boolean);

  return parts.join(", ");
}

function extractCustomerContext(payload) {
  const stripeObject = payload?.stripeObject || {};

  const email =
    sanitizeCustomerEmail(payload?.customerEmail) ||
    sanitizeCustomerEmail(stripeObject.customer_email) ||
    sanitizeCustomerEmail(stripeObject.customer_details?.email);

  const rawName =
    sanitizeText(payload?.customerName) ||
    sanitizeText(stripeObject.customer_name) ||
    sanitizeText(stripeObject.customer_details?.name);

  const company =
    sanitizeText(payload?.customerCompany) ||
    sanitizeText(stripeObject.customer_details?.business_name);

  const rawBillingAddress =
    sanitizeText(payload?.customerBillingAddress) ||
    formatAddress(stripeObject.customer_address) ||
    formatAddress(stripeObject.customer_details?.address);

  const name = sanitizeCustomerName(rawName, {
    email,
    billingAddress: rawBillingAddress
  });

  const billingAddress = sanitizeCustomerBillingAddress(rawBillingAddress, {
    email,
    name: rawName
  });

  return { email, name, company, billingAddress };
}

function renderEmailHtml({ title, subtitle, accentColor, rows, footer }) {
  const safeTitle = escapeHtml(title);
  const safeSubtitle = escapeHtml(subtitle);
  const safeFooter = escapeHtml(footer);
  const color = sanitizeText(accentColor) || "#0f6cbd";

  const rowsHtml = (rows || [])
    .map((row) => {
      const label = escapeHtml(row.label);
      const value = escapeHtml(row.value);
      const href = sanitizeHttpUrl(row.href);
      const linkLabel = escapeHtml(row.linkLabel || "Open link");
      const valueHtml = href
        ? `<a href="${escapeHtml(href)}" style="color:#0f6cbd;text-decoration:underline;font-weight:600;">${linkLabel}</a>`
        : value;

      return `<tr><td style="padding:8px 0;color:#5f6b7a;font-size:13px;vertical-align:top;width:160px;">${label}</td><td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;word-break:break-word;">${valueHtml}</td></tr>`;
    })
    .join("");

  return [
    "<html><body style=\"margin:0;padding:0;background:#f3f6fb;font-family:Segoe UI,Arial,sans-serif;\">",
    "<table role=\"presentation\" style=\"width:100%;border-collapse:collapse;\"><tr><td align=\"center\" style=\"padding:28px 16px;\">",
    "<table role=\"presentation\" style=\"max-width:640px;width:100%;background:#ffffff;border:1px solid #dbe4f0;border-radius:12px;overflow:hidden;border-collapse:separate;\">",
    `<tr><td style=\"background:${color};padding:16px 20px;color:#ffffff;font-size:20px;font-weight:700;\">Audit Toolkit Labs</td></tr>`,
    `<tr><td style=\"padding:20px 20px 8px 20px;color:#111827;font-size:22px;font-weight:700;\">${safeTitle}</td></tr>`,
    `<tr><td style=\"padding:0 20px 16px 20px;color:#4b5563;font-size:14px;\">${safeSubtitle}</td></tr>`,
    `<tr><td style=\"padding:0 20px 12px 20px;\"><table role=\"presentation\" style=\"width:100%;border-collapse:collapse;\">${rowsHtml}</table></td></tr>`,
    `<tr><td style=\"padding:12px 20px 20px 20px;color:#6b7280;font-size:12px;border-top:1px solid #e5e7eb;\">${safeFooter}</td></tr>`,
    "</table></td></tr></table>",
    "</body></html>"
  ].join("");
}

function looksLikeEmail(value) {
  const normalized = sanitizeText(value);
  return normalized.includes("@") && normalized.includes(".");
}

function getOpsEmail(env) {
  return sanitizeText(env.BILLING_OPS_EMAIL) || "support@audittoolkitlabs.com";
}

function getSalesEmail(env) {
  return sanitizeText(env.BILLING_SALES_EMAIL) || "license@audittoolkitlabs.com";
}

function isOpsEventType(eventType) {
  return [
    "billing.plan_unresolved",
    "billing.plan_unresolved_retry_exhausted",
    "billing.invoice_payment_failed",
    "billing.customer_subscription_deleted",
    "billing.customer_subscription_updated",
    "billing.keygen_event",
    "billing.resend_inbound_event"
  ].includes(sanitizeText(eventType));
}

function getInternalNotificationEmail(env, eventType) {
  return isOpsEventType(eventType) ? getOpsEmail(env) : getSalesEmail(env);
}

function getInternalSubjectPrefix(eventType) {
  return isOpsEventType(eventType) ? "[Ops]" : "[Sales]";
}

function getEscalationEmail(env) {
  return sanitizeText(env.BILLING_ESCALATION_EMAIL) || getOpsEmail(env);
}

function formatMinorAmount(amount, currency) {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return "N/A";

  const normalizedCurrency = sanitizeText(currency).toUpperCase() || "USD";
  return `${(numeric / 100).toFixed(2)} ${normalizedCurrency}`;
}

function trimTrailingSlash(value) {
  return sanitizeText(value).replace(/\/+$/, "");
}

function toAbsoluteUrl(base, path) {
  const normalizedBase = trimTrailingSlash(base);
  const normalizedPath = sanitizeText(path).replace(/^\/+/, "");
  if (!normalizedBase || !normalizedPath) return "";
  return `${normalizedBase}/${normalizedPath}`;
}

function getLegalLinks(env) {
  const siteBase = trimTrailingSlash(env.PUBLIC_SITE_BASE_URL || "https://audittoolkitlabs.com");

  const licensingUrl =
    sanitizeText(env.LICENSE_TERMS_URL) || toAbsoluteUrl(siteBase, "licensing.html");
  const supportUrl = sanitizeText(env.SUPPORT_URL) || toAbsoluteUrl(siteBase, "support.html");
  const privacyUrl = sanitizeText(env.PRIVACY_URL) || toAbsoluteUrl(siteBase, "privacy.html");

  return {
    licensingUrl,
    supportUrl,
    privacyUrl
  };
}

async function fetchStripePaidCheckoutSessionsSince(env, sinceUnix) {
  if (!env.STRIPE_API_SECRET) return [];

  const sessions = [];
  let startingAfter = "";

  for (let page = 0; page < 5; page += 1) {
    const query = new URLSearchParams();
    query.append("limit", "100");
    if (startingAfter) {
      query.append("starting_after", startingAfter);
    }

    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions?${query.toString()}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${env.STRIPE_API_SECRET}`
        }
      }
    );

    if (!response.ok) break;

    const payload = parseJsonSafe(await response.text(), {});
    const data = Array.isArray(payload?.data) ? payload.data : [];

    if (data.length === 0) break;

    for (const session of data) {
      const created = Number(session?.created);
      if (Number.isFinite(created) && created >= sinceUnix) {
        if (
          sanitizeText(session?.status) === "complete" &&
          sanitizeText(session?.payment_status) === "paid"
        ) {
          sessions.push(session);
        }
      }
    }

    const oldestCreated = Number(data[data.length - 1]?.created);
    if (Number.isFinite(oldestCreated) && oldestCreated < sinceUnix) {
      break;
    }

    if (!payload?.has_more) break;
    startingAfter = sanitizeText(data[data.length - 1]?.id);
    if (!startingAfter) break;
  }

  return sessions;
}

async function listIssuedLicensesSince(env, sinceIso) {
  if (!env.BILLING_EVENTS_KV) return [];

  const records = [];
  let cursor;

  for (let page = 0; page < 30; page += 1) {
    const pageResult = await env.BILLING_EVENTS_KV.list({
      prefix: "session:",
      cursor,
      limit: 100
    });

    const keys = Array.isArray(pageResult?.keys) ? pageResult.keys : [];
    if (keys.length === 0) {
      if (!pageResult?.list_complete) {
        cursor = pageResult?.cursor;
        continue;
      }
      break;
    }

    for (const key of keys) {
      const value = await env.BILLING_EVENTS_KV.get(key.name);
      const parsed = parseJsonSafe(value, null);
      if (!parsed?.issuedAt) continue;

      if (parsed.issuedAt >= sinceIso) {
        records.push(parsed);
      }
    }

    if (pageResult?.list_complete) break;
    cursor = pageResult?.cursor;
    if (!cursor) break;
  }

  return records;
}

function formatTimestampIso(value) {
  const normalized = sanitizeText(value);
  if (!normalized) return "N/A";
  return normalized;
}

async function sendWeeklyReconciliationReport(env, options = {}) {
  const days = Math.max(1, Math.min(30, Number(options.days) || 7));
  const now = Date.now();
  const sinceUnix = Math.floor(now / 1000) - days * 24 * 60 * 60;
  const sinceIso = new Date(sinceUnix * 1000).toISOString();

  const [stripeSessions, issuedLicenses] = await Promise.all([
    fetchStripePaidCheckoutSessionsSince(env, sinceUnix),
    listIssuedLicensesSince(env, sinceIso)
  ]);

  const stripeBySessionId = new Map();
  for (const session of stripeSessions) {
    if (session?.id) stripeBySessionId.set(session.id, session);
  }

  const keygenBySessionId = new Map();
  for (const license of issuedLicenses) {
    const sessionId = sanitizeText(license?.stripeSessionId);
    if (sessionId) keygenBySessionId.set(sessionId, license);
  }

  const missingLicenses = [];
  for (const session of stripeSessions) {
    if (!keygenBySessionId.has(session.id)) {
      missingLicenses.push({
        stripeSessionId: session.id,
        created: session.created,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: sanitizeCustomerEmail(session?.customer_details?.email)
      });
    }
  }

  const orphanLicenses = [];
  for (const license of issuedLicenses) {
    const sessionId = sanitizeText(license?.stripeSessionId);
    if (sessionId && !stripeBySessionId.has(sessionId)) {
      orphanLicenses.push({
        stripeSessionId: sessionId,
        keygenLicenseId: sanitizeText(license?.keygenLicenseId),
        planCode: sanitizeText(license?.planCode),
        issuedAt: sanitizeText(license?.issuedAt)
      });
    }
  }

  const status = missingLicenses.length === 0 ? "Aligned" : "Action required";
  const opsEmail = getOpsEmail(env);
  const subject = `[Ops] Weekly Billing Reconciliation - ${status}`;

  const topMissing = missingLicenses.slice(0, 20);
  const topOrphans = orphanLicenses.slice(0, 20);

  const textBody = [
    "Billing reconciliation summary",
    "",
    `Window: last ${days} days`,
    `From: ${sinceIso}`,
    `Paid Stripe sessions: ${stripeSessions.length}`,
    `Issued Keygen licenses: ${issuedLicenses.length}`,
    `Missing licenses: ${missingLicenses.length}`,
    `Orphan licenses: ${orphanLicenses.length}`,
    "",
    "Missing licenses (Stripe paid without Keygen):",
    ...topMissing.map(
      (item) =>
        `- ${item.stripeSessionId} | ${item.customerEmail || "(no-email)"} | ${formatMinorAmount(item.amountTotal, item.currency)} | ${new Date(Number(item.created) * 1000).toISOString()}`
    ),
    "",
    "Orphan licenses (Keygen issued without Stripe paid in window):",
    ...topOrphans.map(
      (item) =>
        `- ${item.keygenLicenseId || "(no-license-id)"} | ${item.stripeSessionId} | ${item.planCode || "(no-plan)"} | ${formatTimestampIso(item.issuedAt)}`
    ),
    "",
    "If missing licenses are non-zero, treat as operational incident and reconcile immediately."
  ].join("\n");

  const htmlRows = [
    { label: "Window", value: `Last ${days} days` },
    { label: "From", value: sinceIso },
    { label: "Paid Stripe Sessions", value: String(stripeSessions.length) },
    { label: "Issued Keygen Licenses", value: String(issuedLicenses.length) },
    { label: "Missing Licenses", value: String(missingLicenses.length) },
    { label: "Orphan Licenses", value: String(orphanLicenses.length) },
    { label: "Status", value: status }
  ];

  const html = renderEmailHtml({
    title: "Weekly billing reconciliation",
    subtitle: "Stripe paid sessions vs Keygen issued licenses.",
    accentColor: missingLicenses.length === 0 ? "#107c10" : "#b91c1c",
    rows: htmlRows,
    footer: "Review missing/orphan counts in the text section of this email and investigate non-zero discrepancies immediately."
  });

  const sendResult = await sendResendEmail(env, {
    to: opsEmail,
    subject,
    text: textBody,
    html
  });

  return {
    sent: sendResult.sent,
    recipient: opsEmail,
    days,
    sinceIso,
    status,
    paidStripeSessions: stripeSessions.length,
    issuedKeygenLicenses: issuedLicenses.length,
    missingLicenses: missingLicenses.length,
    orphanLicenses: orphanLicenses.length,
    previewMissing: topMissing,
    previewOrphans: topOrphans,
    email: sendResult
  };
}

async function sendResendEmail(env, message) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return { sent: false, reason: "resend-not-configured" };
  }

  const toList = Array.isArray(message.to) ? message.to : [message.to];
  const to = toList.map((entry) => sanitizeText(entry)).filter(Boolean);
  if (to.length === 0) {
    return { sent: false, reason: "missing-recipient" };
  }

  const payload = {
    from: sanitizeText(env.RESEND_FROM_EMAIL),
    to,
    subject: sanitizeText(message.subject),
    text: sanitizeText(message.text)
  };

  if (message.html) {
    payload.html = String(message.html);
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const bodyText = await response.text();
  const body = parseJsonSafe(bodyText, { raw: bodyText });

  if (!response.ok) {
    console.error("resend-send-failed", {
      status: response.status,
      to,
      subject: payload.subject,
      from: payload.from,
      response: body
    });

    return {
      sent: false,
      reason: `resend-send-failed:${response.status}`,
      response: body
    };
  }

  console.log("resend-send-succeeded", {
    to,
    subject: payload.subject,
    from: payload.from,
    id: body?.id || null
  });

  return {
    sent: true,
    provider: "resend",
    id: body?.id || null
  };
}

async function sendResendForBillingEvent(env, eventType, payload) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return { sent: false, reason: "resend-not-configured" };
  }

  const internalEmail = getInternalNotificationEmail(env, eventType);
  const subjectPrefix = getInternalSubjectPrefix(eventType);
  const timestamp = new Date().toISOString();

  if (eventType === "billing.license_issued") {
    const customer = extractCustomerContext(payload);
    const customerEmail = customer.email;
    const legalLinks = getLegalLinks(env);
    const amountPaid = formatMinorAmount(payload?.amountTotal, payload?.currency);
    const customerRows = [
      { label: "Plan", value: sanitizeText(payload?.planCode) || "N/A" },
      { label: "License Classification", value: "Software license only" },
      { label: "License Key", value: sanitizeText(payload?.keygenLicenseKey) || "N/A" },
      { label: "License ID", value: sanitizeText(payload?.keygenLicenseId) || "N/A" },
      { label: "Stripe Session", value: sanitizeText(payload?.stripeSessionId) || "N/A" }
    ];

    if (legalLinks.licensingUrl) {
      customerRows.push({
        label: "License Terms",
        value: "View terms",
        href: legalLinks.licensingUrl,
        linkLabel: "View license terms"
      });
    }

    if (legalLinks.supportUrl) {
      customerRows.push({
        label: "Support",
        value: "Get support",
        href: legalLinks.supportUrl,
        linkLabel: "Contact support"
      });
    }

    const customerHtml = renderEmailHtml({
      title: "Your license is ready",
      subtitle: "Payment has been confirmed and your Audit Toolkit license has been issued.",
      accentColor: "#0f6cbd",
      rows: customerRows,
      footer:
        "This transaction grants software license rights only and does not transfer intellectual property ownership. Indemnity, liability limitations, and warranty terms are governed by your applicable license terms."
    });

    const customerMessage = looksLikeEmail(customerEmail)
      ? await sendResendEmail(env, {
          to: customerEmail,
          subject: `Your Audit Toolkit license key (${sanitizeText(payload?.planCode) || "plan"})`,
          text: [
            "Your Audit Toolkit license has been issued.",
            "",
            `Plan: ${sanitizeText(payload?.planCode)}`,
            "License Classification: Software license only",
            `License Key: ${sanitizeText(payload?.keygenLicenseKey)}`,
            `License ID: ${sanitizeText(payload?.keygenLicenseId)}`,
            legalLinks.licensingUrl ? `License Terms: ${legalLinks.licensingUrl}` : "",
            legalLinks.supportUrl ? `Support: ${legalLinks.supportUrl}` : "",
            "",
            "This transaction grants software license rights only and does not transfer intellectual property ownership.",
            "Indemnity, liability limitations, and warranty terms are governed by your applicable license terms.",
            "If you need help, reply to this email and our team will assist."
          ]
            .filter(Boolean)
            .join("\n"),
          html: customerHtml
        })
      : { sent: false, reason: "invalid-customer-email" };

    const receiptRows = [
      { label: "Plan", value: sanitizeText(payload?.planCode) || "N/A" },
      { label: "Amount", value: amountPaid },
      { label: "Payment Status", value: sanitizeText(payload?.paymentStatus) || "paid" },
      { label: "Stripe Session", value: sanitizeText(payload?.stripeSessionId) || "N/A" },
      { label: "Stripe Event", value: sanitizeText(payload?.stripeEventId) || "N/A" }
    ];

    if (legalLinks.supportUrl) {
      receiptRows.push({
        label: "Support",
        value: "Get support",
        href: legalLinks.supportUrl,
        linkLabel: "Contact support"
      });
    }

    const receiptHtml = renderEmailHtml({
      title: "Payment confirmation",
      subtitle: "We received your payment and processed your order.",
      accentColor: "#107c10",
      rows: receiptRows,
      footer: "This confirmation is provided for your records."
    });

    const receiptMessage = looksLikeEmail(customerEmail)
      ? await sendResendEmail(env, {
          to: customerEmail,
          subject: `Your Audit Toolkit payment confirmation (${sanitizeText(payload?.planCode) || "plan"})`,
          text: [
            "Your payment has been confirmed.",
            "",
            `Plan: ${sanitizeText(payload?.planCode) || "N/A"}`,
            `Amount: ${amountPaid}`,
            `Payment Status: ${sanitizeText(payload?.paymentStatus) || "paid"}`,
            `Stripe Session: ${sanitizeText(payload?.stripeSessionId) || "N/A"}`,
            `Stripe Event: ${sanitizeText(payload?.stripeEventId) || "N/A"}`,
            legalLinks.supportUrl ? `Support: ${legalLinks.supportUrl}` : ""
          ]
            .filter(Boolean)
            .join("\n"),
          html: receiptHtml
        })
      : { sent: false, reason: "invalid-customer-email" };

    const opsSubject = customerMessage.sent
      ? `${subjectPrefix} License issued - ${sanitizeText(payload?.planCode)} - ${customerEmail}`
      : `${subjectPrefix} License issued but customer email not sent - ${sanitizeText(payload?.planCode)}`;

    const opsBody = [
      "License issuance event processed.",
      "",
      `Customer Email: ${customerEmail || "(missing)"}`,
      `Customer Name: ${customer.name || "N/A"}`,
      `Customer Company: ${customer.company || "N/A"}`,
      `Billing Address: ${customer.billingAddress || "N/A"}`,
      `Plan: ${sanitizeText(payload?.planCode)}`,
      `License ID: ${sanitizeText(payload?.keygenLicenseId)}`,
      `License Key: ${sanitizeText(payload?.keygenLicenseKey)}`,
      `Stripe Session: ${sanitizeText(payload?.stripeSessionId)}`,
      `Stripe Event: ${sanitizeText(payload?.stripeEventId)}`,
      `Amount: ${amountPaid}`,
      "",
      `Customer Email Send Result: ${customerMessage.sent ? "sent" : customerMessage.reason}`,
      `Customer Receipt Send Result: ${receiptMessage.sent ? "sent" : receiptMessage.reason}`,
      `Timestamp: ${timestamp}`
    ].join("\n");

    const opsHtml = renderEmailHtml({
      title: "License issued",
      subtitle: "A paid checkout completed and license delivery has been processed.",
      accentColor: "#107c10",
      rows: [
        { label: "Customer Email", value: customerEmail || "(missing)" },
        { label: "Customer Name", value: customer.name || "N/A" },
        { label: "Customer Company", value: customer.company || "N/A" },
        { label: "Billing Address", value: customer.billingAddress || "N/A" },
        { label: "Plan", value: sanitizeText(payload?.planCode) || "N/A" },
        { label: "License ID", value: sanitizeText(payload?.keygenLicenseId) || "N/A" },
        { label: "License Key", value: sanitizeText(payload?.keygenLicenseKey) || "N/A" },
        { label: "Stripe Session", value: sanitizeText(payload?.stripeSessionId) || "N/A" },
        { label: "Stripe Event", value: sanitizeText(payload?.stripeEventId) || "N/A" },
        { label: "Amount", value: amountPaid },
        {
          label: "Customer Email Send",
          value: customerMessage.sent ? "Sent" : sanitizeText(customerMessage.reason)
        },
        {
          label: "Customer Receipt Send",
          value: receiptMessage.sent ? "Sent" : sanitizeText(receiptMessage.reason)
        },
        { label: "Timestamp", value: timestamp }
      ],
      footer: "Generated by audittoolkit-billing-worker"
    });

    const opsMessage = await sendResendEmail(env, {
      to: internalEmail,
      subject: opsSubject,
      text: opsBody,
      html: opsHtml
    });

    let licenseEmailFailureEscalation = { sent: false, reason: "not-applicable" };
    if (!customerMessage.sent) {
      const escalationEmail = getEscalationEmail(env);
      licenseEmailFailureEscalation = await sendResendEmail(env, {
        to: escalationEmail,
        subject: `[Ops][ACTION REQUIRED] CUSTOMER LICENSE EMAIL FAILED - ${sanitizeText(payload?.stripeSessionId) || "(no-session)"}`,
        text: [
          "License was issued, but customer delivery email was not sent.",
          "",
          `Customer Email: ${customerEmail || "(missing)"}`,
          `Failure Reason: ${sanitizeText(customerMessage.reason) || "unknown"}`,
          `Plan: ${sanitizeText(payload?.planCode) || "N/A"}`,
          `License ID: ${sanitizeText(payload?.keygenLicenseId) || "N/A"}`,
          `Stripe Session: ${sanitizeText(payload?.stripeSessionId) || "N/A"}`,
          `Stripe Event: ${sanitizeText(payload?.stripeEventId) || "N/A"}`,
          "",
          "Required Action: Contact customer manually and verify recipient email." 
        ].join("\n")
      });
    }

    return {
      sent:
        customerMessage.sent ||
        receiptMessage.sent ||
        opsMessage.sent ||
        licenseEmailFailureEscalation.sent,
      provider: "resend",
      customer: customerMessage,
      receipt: receiptMessage,
      escalation: licenseEmailFailureEscalation,
      ops: opsMessage
    };
  }

  const stripeObject = payload?.stripeObject || {};
  const customer = extractCustomerContext(payload);
  const enrichmentDebug = payload?.enrichmentDebug || null;
  const legalLinks = getLegalLinks(env);
  const readableEvent = eventType
    .replace("billing.", "")
    .replace(/_/g, " ")
    .toUpperCase();

  console.log("billing-customer-enrichment", {
    eventType,
    stripeEventId: sanitizeText(payload?.stripeEventId) || null,
    stripeObjectId: sanitizeText(stripeObject?.id) || null,
    sources: Array.isArray(enrichmentDebug?.sources) ? enrichmentDebug.sources : [],
    resolved: Boolean(enrichmentDebug?.resolved),
    customerEmail: customer.email || null,
    customerName: customer.name || null,
    customerCompany: customer.company || null,
    customerBillingAddress: customer.billingAddress || null
  });

  const summaryRows = [
    { label: "Event", value: eventType },
    { label: "Timestamp", value: timestamp }
  ];
  let recipientOverride = "";
  let subjectOverride = "";

  let customerInvoiceMessage = { sent: false, reason: "not-applicable" };

  if (eventType === "billing.keygen_event") {
    const keygenPayload = payload?.keygenPayload || {};
    const keygenInnerPayload = getInnerKeygenPayload(keygenPayload);
    const keygenMeta = keygenPayload?.meta || {};
    const keygenData = keygenInnerPayload?.data || keygenPayload?.data || {};
    const keygenAttributes = keygenData?.attributes || {};
    const keygenRelationships = keygenData?.relationships || {};
    const keygenEventType = resolveKeygenEventType(payload);
    const keygenContext = await resolveKeygenLicenseContext(env, keygenPayload);
    const keygenCompany = sanitizeText(keygenContext.customerCompany) || "N/A";
    const keygenCustomerEmail = sanitizeCustomerEmail(keygenContext.customerEmail);

    summaryRows.push({ label: "Keygen Event", value: keygenEventType });
    summaryRows.push({ label: "Signature Verified", value: payload?.verified ? "Yes" : "No" });

    if (payload?.verificationReason) {
      summaryRows.push({
        label: "Verification Detail",
        value: sanitizeText(payload.verificationReason)
      });
    }

    if (sanitizeText(keygenData?.id)) {
      summaryRows.push({ label: "License ID", value: sanitizeText(keygenData.id) });
    }

    if (sanitizeText(keygenData?.type)) {
      summaryRows.push({ label: "Resource Type", value: sanitizeText(keygenData.type) });
    }

    if (sanitizeText(keygenContext.licenseKey)) {
      summaryRows.push({ label: "License Key", value: sanitizeText(keygenContext.licenseKey) });
    }

    const expiryIso = sanitizeText(keygenContext.expiry);
    if (expiryIso) {
      summaryRows.push({ label: "License Expiry", value: expiryIso });
    }

    if (sanitizeText(keygenContext.licenseType)) {
      summaryRows.push({ label: "License Type", value: sanitizeText(keygenContext.licenseType) });
    }

    const environmentId = sanitizeText(keygenRelationships?.environment?.data?.id);
    if (environmentId) {
      summaryRows.push({ label: "Environment ID", value: environmentId });
    }

    const productId = sanitizeText(keygenRelationships?.product?.data?.id);
    if (productId) {
      summaryRows.push({ label: "Product ID", value: productId });
    }

    if (looksLikeEmail(keygenCustomerEmail)) {
      summaryRows.push({ label: "Customer Email", value: keygenCustomerEmail });
    }

    summaryRows.push({ label: "Customer Company", value: keygenCompany });

    const topLevelKeys = Object.keys(keygenPayload || {});
    if (topLevelKeys.length > 0) {
      summaryRows.push({ label: "Payload Keys", value: topLevelKeys.join(", ") });
    }

    const attributeKeys = Object.keys(keygenAttributes || {});
    if (attributeKeys.length > 0) {
      summaryRows.push({ label: "Attribute Keys", value: attributeKeys.join(", ") });
    }

    const relationshipKeys = Object.keys(keygenRelationships || {});
    if (relationshipKeys.length > 0) {
      summaryRows.push({ label: "Relationship Keys", value: relationshipKeys.join(", ") });
    }

    if (keygenEventType === "license.created") {
      recipientOverride = getSalesEmail(env);
      subjectOverride = `[Sales] KEYGEN LICENSE CREATED - ${looksLikeEmail(keygenCustomerEmail) ? keygenCustomerEmail : sanitizeText(keygenData?.id) || "license"}`;
      summaryRows.push({ label: "Action", value: "Informational success event. No action required." });
    }

    if (keygenEventType === "license.expiring-soon") {
      const expiryReminderEmail = keygenCustomerEmail;
      const expiryReminderAt = sanitizeText(keygenContext.expiry) || "N/A";

      if (looksLikeEmail(expiryReminderEmail)) {
        const reminderRows = [
          { label: "Customer", value: keygenCompany },
          { label: "Customer Email", value: expiryReminderEmail },
          { label: "License ID", value: sanitizeText(keygenData?.id) || "N/A" },
          { label: "License Key", value: sanitizeText(keygenContext.licenseKey) || "N/A" },
          { label: "License Type", value: sanitizeText(keygenContext.licenseType) || "N/A" },
          { label: "Expiry", value: expiryReminderAt },
          { label: "Product ID", value: sanitizeText(keygenContext.productId) || productId || "N/A" }
        ];

        if (legalLinks.supportUrl) {
          reminderRows.push({
            label: "Support",
            value: "Contact support",
            href: legalLinks.supportUrl,
            linkLabel: "Contact support"
          });
        }

        if (legalLinks.licensingUrl) {
          reminderRows.push({
            label: "License Terms",
            value: "View terms",
            href: legalLinks.licensingUrl,
            linkLabel: "View terms"
          });
        }

        const reminderHtml = renderEmailHtml({
          title: "License expiry reminder",
          subtitle: "Your Audit Toolkit license is approaching expiry.",
          accentColor: "#c19c00",
          rows: reminderRows,
          footer: "Please renew before expiry to avoid service interruption."
        });

        customerInvoiceMessage = await sendResendEmail(env, {
          to: expiryReminderEmail,
          subject: "Your Audit Toolkit license expires soon",
          text: [
            "Your Audit Toolkit license is nearing expiry.",
            "",
            `Customer: ${keygenCompany}`,
            `Customer Email: ${expiryReminderEmail}`,
            `License ID: ${sanitizeText(keygenData?.id) || "N/A"}`,
            `License Key: ${sanitizeText(keygenContext.licenseKey) || "N/A"}`,
            `License Type: ${sanitizeText(keygenContext.licenseType) || "N/A"}`,
            `Expiry: ${expiryReminderAt}`,
            `Product ID: ${sanitizeText(keygenContext.productId) || productId || "N/A"}`,
            legalLinks.supportUrl ? `Support: ${legalLinks.supportUrl}` : "",
            legalLinks.licensingUrl ? `License Terms: ${legalLinks.licensingUrl}` : "",
            "",
            "Please renew before expiry to avoid service interruption.",
            "Action: Renew your license or contact support before the expiry date."
          ]
            .filter(Boolean)
            .join("\n"),
          html: reminderHtml
        });
      } else {
        customerInvoiceMessage = { sent: false, reason: "missing-keygen-customer-email" };
      }

      summaryRows.push({
        label: "Customer Expiry Reminder",
        value: customerInvoiceMessage.sent ? "Sent" : sanitizeText(customerInvoiceMessage.reason)
      });
      summaryRows.push({
        label: "Action",
        value:
          customerInvoiceMessage.sent
            ? "Reminder delivered to customer."
            : "Customer email missing - update Keygen license metadata/user email."
      });

      if (looksLikeEmail(expiryReminderEmail)) {
        summaryRows.push({ label: "Reminder Recipient", value: expiryReminderEmail });
      }
    }
  }

  if (eventType === "billing.resend_inbound_event") {
    const resendEventType = sanitizeText(payload?.resendEventType) || "unknown";
    const resendWebhookId = sanitizeText(payload?.resendWebhookId) || "N/A";
    const resendPayload = payload?.resendEvent || {};
    const resendData = resendPayload?.data || {};

    summaryRows.push({ label: "Resend Event", value: resendEventType });
    summaryRows.push({ label: "Resend Webhook ID", value: resendWebhookId });

    if (sanitizeText(resendData?.from)) {
      summaryRows.push({ label: "From", value: sanitizeText(resendData.from) });
    }

    if (sanitizeText(resendData?.subject)) {
      summaryRows.push({ label: "Subject", value: sanitizeText(resendData.subject) });
    }

    const toList = Array.isArray(resendData?.to) ? resendData.to : [];
    const toLine = toList.map((entry) => sanitizeText(entry)).filter(Boolean).join(", ");
    if (toLine) {
      summaryRows.push({ label: "To", value: toLine });
    }

    summaryRows.push({
      label: "Action",
      value: "Inbound Resend webhook received and logged."
    });
  }

  if (Array.isArray(enrichmentDebug?.sources) && enrichmentDebug.sources.length > 0) {
    summaryRows.push({ label: "Identity Source", value: enrichmentDebug.sources.join(" -> ") });
  }

  if (enrichmentDebug && !enrichmentDebug.resolved) {
    summaryRows.push({ label: "Identity Status", value: "Missing in Stripe source data" });
  }

  if (payload?.stripeEventId) {
    summaryRows.push({ label: "Stripe Event", value: sanitizeText(payload.stripeEventId) });
  }

  if (stripeObject?.id) {
    summaryRows.push({ label: "Stripe Object ID", value: sanitizeText(stripeObject.id) });
  }

  if (stripeObject?.customer || stripeObject?.customer_email) {
    summaryRows.push({
      label: "Customer",
      value: customer.email || sanitizeText(stripeObject.customer)
    });
  }

  if (customer.name) {
    summaryRows.push({ label: "Customer Name", value: customer.name });
  }

  if (customer.company) {
    summaryRows.push({ label: "Customer Company", value: customer.company });
  }

  if (customer.billingAddress) {
    summaryRows.push({ label: "Billing Address", value: customer.billingAddress });
  }

  if (stripeObject?.status) {
    summaryRows.push({ label: "Status", value: sanitizeText(stripeObject.status) });
  }

  if (stripeObject?.amount_paid !== undefined || stripeObject?.amount_due !== undefined) {
    const amountPaid = formatMinorAmount(stripeObject.amount_paid, stripeObject.currency);
    const amountDue = formatMinorAmount(stripeObject.amount_due, stripeObject.currency);
    summaryRows.push({ label: "Amount Paid", value: amountPaid });
    summaryRows.push({ label: "Amount Due", value: amountDue });
  }

  if (stripeObject?.hosted_invoice_url) {
    summaryRows.push({
      label: "Invoice",
      value: "Open invoice",
      href: sanitizeText(stripeObject.hosted_invoice_url),
      linkLabel: "Open invoice"
    });
  }

  if (eventType === "billing.invoice_paid") {
    summaryRows.push({ label: "Transaction Classification", value: "Software license payment" });

    if (legalLinks.licensingUrl) {
      summaryRows.push({
        label: "License Terms",
        value: "View license terms",
        href: legalLinks.licensingUrl,
        linkLabel: "View license terms"
      });
    }

    if (legalLinks.supportUrl) {
      summaryRows.push({
        label: "Support",
        value: "Open support",
        href: legalLinks.supportUrl,
        linkLabel: "Open support"
      });
    }
  }

  if (eventType === "billing.invoice_paid" && looksLikeEmail(customer.email)) {
    const invoiceNumber = sanitizeText(stripeObject?.number) || sanitizeText(stripeObject?.id) || "N/A";
    const amountPaid = formatMinorAmount(stripeObject?.amount_paid, stripeObject?.currency);
    const paidAtUnix = Number(stripeObject?.status_transitions?.paid_at);
    const paidAt = Number.isFinite(paidAtUnix) && paidAtUnix > 0
      ? new Date(paidAtUnix * 1000).toISOString()
      : timestamp;

    const customerInvoiceRows = [
      { label: "Invoice", value: invoiceNumber },
      { label: "Transaction Classification", value: "Software license payment" },
      { label: "Amount Paid", value: amountPaid },
      { label: "Payment Date", value: paidAt }
    ];

    if (stripeObject?.hosted_invoice_url) {
      customerInvoiceRows.push({
        label: "Invoice Link",
        value: "View invoice",
        href: sanitizeText(stripeObject.hosted_invoice_url),
        linkLabel: "View invoice"
      });
    }

    if (legalLinks.licensingUrl) {
      customerInvoiceRows.push({
        label: "License Terms",
        value: "View terms",
        href: legalLinks.licensingUrl,
        linkLabel: "View license terms"
      });
    }

    if (legalLinks.supportUrl) {
      customerInvoiceRows.push({
        label: "Support",
        value: "Contact support",
        href: legalLinks.supportUrl,
        linkLabel: "Open support"
      });
    }

    if (legalLinks.privacyUrl) {
      customerInvoiceRows.push({
        label: "Privacy",
        value: "Privacy policy",
        href: legalLinks.privacyUrl,
        linkLabel: "View privacy policy"
      });
    }

    const customerInvoiceHtml = renderEmailHtml({
      title: "Payment confirmation",
      subtitle: "We have received your payment successfully.",
      accentColor: "#107c10",
      rows: customerInvoiceRows,
      footer:
        "This confirmation is for software license payment only. Indemnity, liability limitations, and other legal terms are governed by your applicable license terms and agreement."
    });

    customerInvoiceMessage = await sendResendEmail(env, {
      to: customer.email,
      subject: `Payment confirmation - Invoice ${invoiceNumber}`,
      text: [
        "This is a payment confirmation from Audit Toolkit Labs.",
        "",
        `Invoice: ${invoiceNumber}`,
        "Transaction Classification: Software license payment",
        `Amount Paid: ${amountPaid}`,
        `Payment Date: ${paidAt}`,
        stripeObject?.hosted_invoice_url
          ? `Invoice Link: ${sanitizeText(stripeObject.hosted_invoice_url)}`
          : "Invoice Link: Not available",
        legalLinks.licensingUrl ? `License Terms: ${legalLinks.licensingUrl}` : "",
        legalLinks.supportUrl ? `Support: ${legalLinks.supportUrl}` : "",
        legalLinks.privacyUrl ? `Privacy: ${legalLinks.privacyUrl}` : "",
        "",
        "Please retain this confirmation for your records.",
        "This confirmation is for software license payment only.",
        "Indemnity, liability limitations, and other legal terms are governed by your applicable license terms and agreement.",
        "If you did not authorize this payment, contact support immediately by replying to this email."
      ]
        .filter(Boolean)
        .join("\n"),
      html: customerInvoiceHtml
    });
  } else if (eventType === "billing.invoice_paid") {
    customerInvoiceMessage = { sent: false, reason: "missing-customer-email" };
  }

  if (eventType === "billing.invoice_paid") {
    summaryRows.push({
      label: "Customer Confirmation Email",
      value: customerInvoiceMessage.sent ? "Sent" : sanitizeText(customerInvoiceMessage.reason)
    });
  }

  let escalationMessage = { sent: false, reason: "not-applicable" };
  let suppressInternalOpsEmail = false;

  if (eventType === "billing.plan_unresolved") {
    summaryRows.push({ label: "Priority", value: "P1 - license issuance blocked" });
    summaryRows.push({ label: "Required Action", value: "Update plan mapping/metadata and reissue" });

    const escalationEmail = getEscalationEmail(env);
    if (sanitizeText(escalationEmail).toLowerCase() === sanitizeText(internalEmail).toLowerCase()) {
      suppressInternalOpsEmail = true;
    }

    escalationMessage = await sendResendEmail(env, {
      to: escalationEmail,
      subject: `[ACTION REQUIRED] PLAN UNRESOLVED - ${sanitizeText(payload?.stripeSessionId) || "(no-session)"}`,
      text: [
        "A paid checkout could not be mapped to a Keygen policy.",
        "",
        `Stripe Event: ${sanitizeText(payload?.stripeEventId) || "N/A"}`,
        `Stripe Session: ${sanitizeText(payload?.stripeSessionId) || "N/A"}`,
        "Priority: P1 - license issuance blocked",
        "Required Action: Update plan mapping/metadata and reissue immediately."
      ].join("\n")
    });
  }

  const defaultSubject =
    eventType === "billing.plan_unresolved"
      ? `[Ops][ACTION REQUIRED] ${readableEvent}`
      : `${subjectPrefix} ${readableEvent}`;
  const rawPayloadNote =
    eventType === "billing.keygen_event"
      ? "Keygen event details are summarized above."
      : "Raw payload omitted in email for readability. Check Stripe dashboard for full object details.";
  const defaultBody = [
    "Billing worker event.",
    "",
    ...summaryRows.map((row) => `${row.label}: ${row.value}`),
    "",
    rawPayloadNote
  ].join("\n");

  const defaultOpsHtml = renderEmailHtml({
    title: eventType === "billing.keygen_event" ? "Keygen webhook event" : "Billing event",
    subtitle:
      eventType === "billing.keygen_event"
        ? "Operational event received from Keygen."
        : "Operational event from the billing worker.",
    accentColor: "#5c2d91",
    rows: summaryRows,
    footer: rawPayloadNote
  });

  const opsMessage = suppressInternalOpsEmail
    ? { sent: false, reason: "suppressed-duplicate-recipient" }
    : await sendResendEmail(env, {
        to: recipientOverride || internalEmail,
        subject: subjectOverride || defaultSubject,
        text: defaultBody,
        html: defaultOpsHtml
      });

  return {
    sent: opsMessage.sent || customerInvoiceMessage.sent || escalationMessage.sent,
    provider: "resend",
    customer: customerInvoiceMessage,
    escalation: escalationMessage,
    ops: opsMessage
  };
}

async function dispatchBillingNotifications(env, eventType, payload) {
  const results = {
    eventType,
    resend: { sent: false, reason: "resend-not-attempted" },
    m365: { sent: false, reason: "m365-not-attempted" }
  };

  try {
    results.resend = await sendResendForBillingEvent(env, eventType, payload);
  } catch (error) {
    results.resend = {
      sent: false,
      reason: "resend-dispatch-error",
      error: error instanceof Error ? error.message : String(error)
    };
  }

  if (env.M365_FLOW_WEBHOOK_URL) {
    try {
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

      if (response.ok) {
        results.m365 = { sent: true };
      } else {
        results.m365 = { sent: false, reason: `m365-flow-post-failed:${response.status}` };
      }
    } catch (error) {
      results.m365 = {
        sent: false,
        reason: "m365-flow-post-error",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  } else {
    results.m365 = { sent: false, reason: "m365-flow-not-configured" };
  }

  console.log("billing-notification-dispatch", {
    eventType,
    resend: results.resend,
    m365: results.m365
  });

  return results;
}

async function processCheckoutSessionForLicense(session, env, context = {}) {
  const retryConfig = getAutoRetryConfig(env);
  const stripeEventId = sanitizeText(context?.stripeEventId) || `internal-${Date.now()}`;
  const origin = sanitizeText(context?.origin) || "stripe-webhook";
  const retryCount = Number(context?.retryCount);
  const paymentStatus = sanitizeText(session?.payment_status).toLowerCase();

  // Only issue/send licenses after Stripe marks the checkout session as paid.
  // For async methods, checkout.session.async_payment_succeeded will re-enter this path.
  if (paymentStatus !== "paid") {
    await dispatchBillingNotifications(env, "billing.checkout_not_paid", {
      stripeEventId,
      stripeSessionId: session?.id,
      paymentStatus,
      customerEmail: sanitizeCustomerEmail(session?.customer_details?.email),
      planMetadata: session?.metadata || {},
      origin
    });

    return {
      ok: true,
      action: "awaiting-payment-clearance",
      paymentStatus
    };
  }

  const existingLicense = await getExistingSessionLicense(env, session?.id);
  if (existingLicense?.keygenLicenseId) {
    await deletePlanUnresolvedRecord(env, session?.id);

    await dispatchBillingNotifications(env, "billing.license_already_exists", {
      stripeEventId,
      stripeSessionId: session?.id,
      existingLicense,
      origin
    });

    return {
      ok: true,
      action: "license-already-exists",
      keygenLicenseId: existingLicense.keygenLicenseId
    };
  }

  const resolvedPlan = await resolvePlanFromCheckoutSession(session, env);

  if (!resolvedPlan) {
    const existingRecord = await getPlanUnresolvedRecord(env, session?.id);
    const effectiveRetryCount = Number.isFinite(retryCount)
      ? retryCount
      : Number(existingRecord?.retryCount) || 0;

    const retryDelaySeconds = Math.min(
      retryConfig.baseDelaySeconds * Math.pow(2, Math.min(effectiveRetryCount, 6)),
      24 * 60 * 60
    );
    const nextRetryAt = new Date(Date.now() + retryDelaySeconds * 1000).toISOString();

    await setPlanUnresolvedRecord(env, session?.id, {
      stripeSessionId: session?.id,
      lastStripeEventId: stripeEventId,
      metadata: session?.metadata || {},
      paymentStatus,
      customerEmail: sanitizeCustomerEmail(session?.customer_details?.email),
      retryCount: effectiveRetryCount,
      nextRetryAt,
      exhaustedNotified: Boolean(existingRecord?.exhaustedNotified),
      firstSeenAt: sanitizeText(existingRecord?.firstSeenAt) || new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      origin
    });

    await dispatchBillingNotifications(env, "billing.plan_unresolved", {
      stripeEventId,
      stripeSessionId: session?.id,
      metadata: session?.metadata || {},
      retryCount: effectiveRetryCount,
      nextRetryAt,
      autoRetryEnabled: retryConfig.enabled,
      origin
    });

    return {
      ok: true,
      action: "no-license-created",
      reason: "plan-mapping-not-found",
      retryCount: effectiveRetryCount,
      nextRetryAt
    };
  }

  const keygenResult = await callKeygenCreateLicense(env, {
    policyId: resolvedPlan.policyId,
    metadata: {
      stripe_event_id: stripeEventId,
      stripe_session_id: session?.id,
      stripe_customer_id: session?.customer,
      stripe_subscription_id: session?.subscription,
      stripe_payment_intent: session?.payment_intent,
      customer_email: sanitizeCustomerEmail(session?.customer_details?.email),
      plan_code: resolvedPlan.planCode,
      mapping_source: resolvedPlan.source,
      issuance_origin: origin
    }
  });

  const issuedLicense = {
    keygenLicenseId: keygenResult?.data?.id,
    keygenLicenseKey: keygenResult?.data?.attributes?.key,
    stripeSessionId: session?.id,
    stripeEventId,
    planCode: resolvedPlan.planCode,
    issuedAt: new Date().toISOString(),
    origin
  };

  await setSessionLicense(env, session?.id, issuedLicense);
  await deletePlanUnresolvedRecord(env, session?.id);

  const normalizedCustomerEmail = sanitizeCustomerEmail(session?.customer_details?.email);
  const normalizedCustomerName = sanitizeCustomerName(
    sanitizeText(session?.customer_details?.name),
    {
      email: normalizedCustomerEmail,
      billingAddress: formatAddress(session?.customer_details?.address)
    }
  );
  const normalizedCustomerBillingAddress = sanitizeCustomerBillingAddress(
    formatAddress(session?.customer_details?.address),
    {
      email: normalizedCustomerEmail,
      name: sanitizeText(session?.customer_details?.name)
    }
  );

  if (session?.customer) {
    await setCustomerProfile(env, session.customer, {
      email: normalizedCustomerEmail,
      name: normalizedCustomerName,
      company: sanitizeText(session?.customer_details?.business_name),
      billingAddress: normalizedCustomerBillingAddress,
      updatedAt: new Date().toISOString(),
      source: "checkout-session"
    });
  }

  if (session?.payment_intent) {
    await setPaymentProfile(env, session.payment_intent, {
      email: normalizedCustomerEmail,
      name: normalizedCustomerName,
      company: sanitizeText(session?.customer_details?.business_name),
      billingAddress: normalizedCustomerBillingAddress,
      updatedAt: new Date().toISOString(),
      source: "checkout-session"
    });
  }

  if (origin === "auto-retry") {
    await dispatchBillingNotifications(env, "billing.plan_unresolved_recovered", {
      stripeEventId,
      stripeSessionId: session?.id,
      retryCount: Number.isFinite(retryCount) ? retryCount : null,
      planCode: resolvedPlan.planCode,
      keygenLicenseId: keygenResult?.data?.id
    });
  }

  await dispatchBillingNotifications(env, "billing.license_issued", {
    stripeEventId,
    stripeSessionId: session?.id,
    customerEmail: normalizedCustomerEmail,
    customerName: normalizedCustomerName,
    customerCompany: session?.customer_details?.business_name,
    customerBillingAddress: normalizedCustomerBillingAddress,
    planCode: resolvedPlan.planCode,
    keygenLicenseId: keygenResult?.data?.id,
    keygenLicenseKey: keygenResult?.data?.attributes?.key,
    amountTotal: session?.amount_total,
    currency: session?.currency,
    paymentStatus: session?.payment_status,
    origin
  });

  return {
    ok: true,
    action: "license-created",
    planCode: resolvedPlan.planCode,
    keygenLicenseId: keygenResult?.data?.id,
    origin
  };
}

async function retryPendingPlanUnresolvedSessions(env) {
  const retryConfig = getAutoRetryConfig(env);
  if (!retryConfig.enabled || !env.BILLING_EVENTS_KV) {
    return { enabled: retryConfig.enabled, attempted: 0, resolved: 0, failed: 0, exhausted: 0 };
  }

  const nowIso = new Date().toISOString();
  const listResult = await env.BILLING_EVENTS_KV.list({ prefix: "unresolved:", limit: 20 });
  const keys = Array.isArray(listResult?.keys) ? listResult.keys : [];

  let attempted = 0;
  let resolved = 0;
  let failed = 0;
  let exhausted = 0;

  for (const key of keys) {
    const sessionId = sanitizeText(key?.name).replace(/^unresolved:/, "");
    if (!sessionId) continue;

    const record = await getPlanUnresolvedRecord(env, sessionId);
    if (!record) continue;

    const nextRetryAt = sanitizeText(record.nextRetryAt);
    if (nextRetryAt && nextRetryAt > nowIso) {
      continue;
    }

    const currentRetryCount = Number(record.retryCount) || 0;
    if (currentRetryCount >= retryConfig.maxAttempts) {
      exhausted += 1;
      if (!record.exhaustedNotified) {
        await dispatchBillingNotifications(env, "billing.plan_unresolved_retry_exhausted", {
          stripeSessionId: sessionId,
          stripeEventId: sanitizeText(record.lastStripeEventId),
          retryCount: currentRetryCount,
          maxAttempts: retryConfig.maxAttempts,
          metadata: record.metadata || {}
        });

        await setPlanUnresolvedRecord(env, sessionId, {
          ...record,
          exhaustedNotified: true,
          lastSeenAt: new Date().toISOString()
        });
      }
      continue;
    }

    attempted += 1;
    const attemptNumber = currentRetryCount + 1;

    const session = await fetchStripeCheckoutSession(sessionId, env);
    if (!session) {
      failed += 1;
      const retryDelaySeconds = Math.min(
        retryConfig.baseDelaySeconds * Math.pow(2, Math.min(attemptNumber, 6)),
        24 * 60 * 60
      );
      await setPlanUnresolvedRecord(env, sessionId, {
        ...record,
        retryCount: attemptNumber,
        nextRetryAt: new Date(Date.now() + retryDelaySeconds * 1000).toISOString(),
        lastSeenAt: new Date().toISOString(),
        lastError: "stripe-session-not-found"
      });
      continue;
    }

    const result = await processCheckoutSessionForLicense(session, env, {
      stripeEventId: sanitizeText(record.lastStripeEventId) || `retry-${Date.now()}`,
      origin: "auto-retry",
      retryCount: attemptNumber
    });

    if (result?.action === "license-created" || result?.action === "license-already-exists") {
      resolved += 1;
      await deletePlanUnresolvedRecord(env, sessionId);
    } else {
      failed += 1;
    }
  }

  return {
    enabled: true,
    attempted,
    resolved,
    failed,
    exhausted
  };
}

async function handleCheckoutCompleted(event, env) {
  const session = event.data?.object || {};
  return processCheckoutSessionForLicense(session, env, {
    stripeEventId: event.id,
    origin: "stripe-webhook"
  });
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
      await dispatchBillingNotifications(
        env,
        `billing.${event.type.replace(/\./g, "_")}`,
        await enrichBillingPayloadWithStripeCustomer(
          {
            stripeEventId: event.id,
            stripeObject: event.data?.object || {}
          },
          env
        )
      );
      return { ok: true, action: "notifications-dispatched", eventType: event.type };

    default:
      return { ok: true, action: "ignored", eventType: event.type };
  }
}

function unauthorized() {
  return json({ ok: false, error: "unauthorized" }, 401);
}

function serverError(err) {
  console.error("worker-internal-error", err);
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
          resendEmailDispatch: Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL),
          resendWebhookValidation: Boolean(env.RESEND_WEBHOOK_SECRET),
          m365FlowForwarding: Boolean(env.M365_FLOW_WEBHOOK_URL),
          keygenWebhookValidation: Boolean(
            env.KEYGEN_WEBHOOK_PUBLIC_KEY || env.KEYGEN_WEBHOOK_SECRET
          ),
          idempotencyKv: Boolean(env.BILLING_EVENTS_KV),
          nvdBroker: true,
          nvdApiKeyConfigured: Boolean(env.NVD_API_KEY),
          nvdNoKeyFallback: toBoolean(env.NVD_ALLOW_NO_KEY, false),
          nvdQuotaEnabled: Boolean(env.BILLING_EVENTS_KV),
          nvdQuotaWindowSeconds: getNvdQuotaConfig(env).windowSeconds,
          nvdQuotaPerWindow: getNvdQuotaConfig(env).customerLimit,
          nvdAnonQuotaPerWindow: getNvdQuotaConfig(env).anonymousLimit,
          nvdQuotaRequiresCustomerId: getNvdQuotaConfig(env).enforceCustomerId
        },
        timestamp: new Date().toISOString()
      });
    }

    if (request.method === "GET" && url.pathname.startsWith("/nvd/cve/")) {
      if (!isAuthorizedForBroker(request, env)) {
        return unauthorized();
      }

      const hasNvdKey = Boolean(env.NVD_API_KEY);
      if (!hasNvdKey && !canUseNoKeyFallback(url, env)) {
        return json(
          {
            ok: false,
            error: "nvd_key_required",
            message:
              "NVD_API_KEY is missing and no-key mode is disabled. Set NVD_API_KEY or NVD_ALLOW_NO_KEY=true for low-volume local fallback."
          },
          503
        );
      }

      const quotaCheck = await enforceNvdCustomerQuota(request, env);
      if (!quotaCheck.ok) {
        return quotaCheck.response;
      }

      try {
        const response = await handleNvdCveLookup(request, env, url);
        return withNvdQuotaHeaders(response, quotaCheck.quota);
      } catch (err) {
        return serverError(err);
      }
    }

    if (request.method === "GET" && url.pathname === "/nvd/search") {
      if (!isAuthorizedForBroker(request, env)) {
        return unauthorized();
      }

      const hasNvdKey = Boolean(env.NVD_API_KEY);
      if (!hasNvdKey && !canUseNoKeyFallback(url, env)) {
        return json(
          {
            ok: false,
            error: "nvd_key_required",
            message:
              "NVD_API_KEY is missing and no-key mode is disabled. Set NVD_API_KEY or NVD_ALLOW_NO_KEY=true for low-volume local fallback."
          },
          503
        );
      }

      const quotaCheck = await enforceNvdCustomerQuota(request, env);
      if (!quotaCheck.ok) {
        return quotaCheck.response;
      }

      try {
        const response = await handleNvdSearch(request, env, url);
        return withNvdQuotaHeaders(response, quotaCheck.quota);
      } catch (err) {
        return serverError(err);
      }
    }

    if (request.method === "GET" && url.pathname.startsWith("/nvd/download/cve/")) {
      if (!isAuthorizedForBroker(request, env)) {
        return unauthorized();
      }

      const hasNvdKey = Boolean(env.NVD_API_KEY);
      if (!hasNvdKey && !canUseNoKeyFallback(url, env)) {
        return json(
          {
            ok: false,
            error: "nvd_key_required",
            message:
              "NVD_API_KEY is missing and no-key mode is disabled. Set NVD_API_KEY or NVD_ALLOW_NO_KEY=true for low-volume local fallback."
          },
          503
        );
      }

      const quotaCheck = await enforceNvdCustomerQuota(request, env);
      if (!quotaCheck.ok) {
        return quotaCheck.response;
      }

      try {
        const response = await handleNvdCveDownload(request, env, url);
        return withNvdQuotaHeaders(response, quotaCheck.quota);
      } catch (err) {
        return serverError(err);
      }
    }

    if (request.method === "GET" && url.pathname === "/nvd/download/search") {
      if (!isAuthorizedForBroker(request, env)) {
        return unauthorized();
      }

      const hasNvdKey = Boolean(env.NVD_API_KEY);
      if (!hasNvdKey && !canUseNoKeyFallback(url, env)) {
        return json(
          {
            ok: false,
            error: "nvd_key_required",
            message:
              "NVD_API_KEY is missing and no-key mode is disabled. Set NVD_API_KEY or NVD_ALLOW_NO_KEY=true for low-volume local fallback."
          },
          503
        );
      }

      const quotaCheck = await enforceNvdCustomerQuota(request, env);
      if (!quotaCheck.ok) {
        return quotaCheck.response;
      }

      try {
        const response = await handleNvdSearchDownload(request, env, url);
        return withNvdQuotaHeaders(response, quotaCheck.quota);
      } catch (err) {
        return serverError(err);
      }
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
        const autoRetry = await retryPendingPlanUnresolvedSessions(env);
        return json({ ok: true, eventId: event.id, result, autoRetry });
      } catch (err) {
        return serverError(err);
      }
    }

    if (request.method === "POST" && url.pathname === "/webhooks/keygen") {
      try {
        const rawBody = await request.text();
        const verification = await verifyKeygenWebhook(request, rawBody, env);
        if (!verification.ok && !String(verification.reason || "").startsWith("keygen-verification-runtime-error:")) {
          return json({ ok: false, error: verification.reason }, 401);
        }

        const event = parseJsonSafe(rawBody, {});
        let notification = { sent: false, reason: "not-attempted" };
        try {
          const keygenEventType = resolveKeygenEventType({ keygenPayload: event });
          notification = await dispatchBillingNotifications(env, "billing.keygen_event", {
            verified: verification.verified,
            verificationOk: verification.ok,
            verificationReason: verification.reason || null,
            keygenEventType,
            keygenPayload: event
          });
        } catch (notifyErr) {
          console.error("keygen-event-forwarding-failed", notifyErr);
          notification = {
            sent: false,
            reason: notifyErr instanceof Error ? notifyErr.message : String(notifyErr)
          };
        }

        return json({
          ok: true,
          received: true,
          verified: verification.verified,
          verificationOk: verification.ok,
          verificationReason: verification.reason || null,
          notification
        });
      } catch (err) {
        return serverError(err);
      }
    }

    if (request.method === "POST" && url.pathname === "/webhooks/resend") {
      try {
        const rawBody = await request.text();
        const verification = await verifyResendWebhook(request, rawBody, env);

        if (!verification.ok) {
          return json({ ok: false, error: verification.reason }, 401);
        }

        const event = parseJsonSafe(rawBody, {});
        const resendEventType = sanitizeText(event?.type) || "unknown";
        const resendWebhookId =
          sanitizeText(verification?.resendWebhookId) ||
          sanitizeText(request.headers.get("svix-id")) ||
          `resend-${Date.now()}`;

        const dedupe = await ensureNotDuplicateEvent(env, `resend:${resendWebhookId}`);
        if (dedupe.duplicate) {
          return json({
            ok: true,
            duplicate: true,
            resendWebhookId,
            resendEventType
          });
        }

        const notification = await dispatchBillingNotifications(
          env,
          "billing.resend_inbound_event",
          {
            resendWebhookId,
            resendEventType,
            resendEvent: event
          }
        );

        return json({
          ok: true,
          received: true,
          verified: true,
          resendWebhookId,
          resendEventType,
          notification
        });
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
        const payload = await request.json().catch(() => ({}));
        const stripeSessionId = sanitizeText(payload?.stripeSessionId);

        if (!stripeSessionId) {
          await dispatchBillingNotifications(env, "billing.manual_reissue_requested", {
            request: payload,
            status: "missing-stripe-session-id"
          });
          return json({ ok: false, error: "missing_stripe_session_id" }, 400);
        }

        const session = await fetchStripeCheckoutSession(stripeSessionId, env);
        if (!session) {
          return json({ ok: false, error: "stripe_session_not_found", stripeSessionId }, 404);
        }

        const result = await processCheckoutSessionForLicense(session, env, {
          stripeEventId: sanitizeText(payload?.stripeEventId) || `manual-reissue-${Date.now()}`,
          origin: "manual-reissue"
        });

        await dispatchBillingNotifications(env, "billing.manual_reissue_requested", {
          request: payload,
          stripeSessionId,
          result
        });

        return json({ ok: true, action: "manual-reissue-processed", stripeSessionId, result });
      } catch (err) {
        return serverError(err);
      }
    }

    if (request.method === "POST" && url.pathname === "/admin/reconciliation-report") {
      const adminToken = request.headers.get("x-admin-token");
      if (!env.ADMIN_API_TOKEN || adminToken !== env.ADMIN_API_TOKEN) {
        return unauthorized();
      }

      try {
        const payload = await request.json().catch(() => ({}));
        const report = await sendWeeklyReconciliationReport(env, {
          days: payload?.days
        });

        return json({ ok: true, action: "weekly-reconciliation-sent", report });
      } catch (err) {
        return serverError(err);
      }
    }

    if (request.method === "POST" && url.pathname === "/admin/nvd/refresh") {
      const adminToken = request.headers.get("x-admin-token");
      if (!env.ADMIN_API_TOKEN || adminToken !== env.ADMIN_API_TOKEN) {
        return unauthorized();
      }

      const hasNvdKey = Boolean(env.NVD_API_KEY);
      if (!hasNvdKey && !canUseNoKeyFallback(url, env)) {
        return json(
          {
            ok: false,
            error: "nvd_key_required",
            message:
              "NVD_API_KEY is missing and no-key mode is disabled. Set NVD_API_KEY or NVD_ALLOW_NO_KEY=true for low-volume local fallback."
          },
          503
        );
      }

      try {
        return await handleNvdCacheRefresh(request, env);
      } catch (err) {
        return serverError(err);
      }
    }

    if (request.method === "POST" && url.pathname === "/admin/nvd/prewarm") {
      const adminToken = request.headers.get("x-admin-token");
      if (!env.ADMIN_API_TOKEN || adminToken !== env.ADMIN_API_TOKEN) {
        return unauthorized();
      }

      const hasNvdKey = Boolean(env.NVD_API_KEY);
      if (!hasNvdKey && !canUseNoKeyFallback(url, env)) {
        return json(
          {
            ok: false,
            error: "nvd_key_required",
            message:
              "NVD_API_KEY is missing and no-key mode is disabled. Set NVD_API_KEY or NVD_ALLOW_NO_KEY=true for low-volume local fallback."
          },
          503
        );
      }

      try {
        return await handleNvdPrewarm(request, env);
      } catch (err) {
        return serverError(err);
      }
    }

    return json({ ok: false, error: "not_found" }, 404);
  }
};
