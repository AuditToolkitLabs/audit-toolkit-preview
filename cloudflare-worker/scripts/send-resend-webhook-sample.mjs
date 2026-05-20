import crypto from "node:crypto";

function normalizeBaseUrl(value) {
  const base = (value || "http://127.0.0.1:8787").trim();
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

function normalizeBase64(value) {
  const normalized = String(value || "").trim().replace(/-/g, "+").replace(/_/g, "/");
  if (!normalized) return "";

  const paddingNeeded = (4 - (normalized.length % 4)) % 4;
  return normalized + "=".repeat(paddingNeeded);
}

function decodeSvixSecret(secret) {
  const normalized = String(secret || "").trim();
  if (!normalized) return null;

  if (normalized.startsWith("whsec_")) {
    const encoded = normalizeBase64(normalized.slice("whsec_".length));
    return Buffer.from(encoded, "base64");
  }

  return Buffer.from(normalized, "utf8");
}

function hmacSha256Base64(secret, payload) {
  const key = decodeSvixSecret(secret);
  if (!key) return "";

  return crypto.createHmac("sha256", key).update(payload, "utf8").digest("base64");
}

function buildSampleEvent() {
  const nowIso = new Date().toISOString();

  return {
    type: process.env.RESEND_EVENT_TYPE || "email.delivered",
    created_at: nowIso,
    data: {
      email_id: process.env.RESEND_SAMPLE_EMAIL_ID || `sample_${Date.now()}`,
      from: process.env.RESEND_SAMPLE_FROM || "billing@audittoolkitlabs.com",
      to: process.env.RESEND_SAMPLE_TO || "support@audittoolkitlabs.com",
      subject: process.env.RESEND_SAMPLE_SUBJECT || "Webhook smoke test",
      tags: ["smoke-test", "resend-inbound"]
    }
  };
}

async function main() {
  const workerBaseUrl = normalizeBaseUrl(process.env.WORKER_BASE_URL);
  const webhookSecret = String(process.env.RESEND_WEBHOOK_SECRET || "").trim();

  if (!webhookSecret) {
    console.error("Missing RESEND_WEBHOOK_SECRET.");
    process.exit(1);
  }

  const resendWebhookId =
    String(process.env.RESEND_WEBHOOK_ID || "").trim() || `msg_${Date.now()}`;
  const resendTimestamp = String(Math.floor(Date.now() / 1000));
  const payload = buildSampleEvent();
  const rawBody = JSON.stringify(payload);
  const signedContent = `${resendWebhookId}.${resendTimestamp}.${rawBody}`;
  const signature = hmacSha256Base64(webhookSecret, signedContent);

  if (!signature) {
    console.error("Failed to generate signature from RESEND_WEBHOOK_SECRET.");
    process.exit(1);
  }

  const url = `${workerBaseUrl}/webhooks/resend`;
  console.log(`POST ${url}`);
  console.log(`svix-id=${resendWebhookId}`);
  console.log(`svix-timestamp=${resendTimestamp}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "svix-id": resendWebhookId,
      "svix-timestamp": resendTimestamp,
      "svix-signature": `v1,${signature}`
    },
    body: rawBody
  });

  const responseText = await response.text();
  console.log(`status=${response.status}`);

  try {
    const parsed = JSON.parse(responseText);
    console.log(JSON.stringify(parsed, null, 2));
  } catch {
    console.log(responseText);
  }

  if (!response.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Smoke test failed:", error);
  process.exit(1);
});