import crypto from "node:crypto";
import { readFile } from "node:fs/promises";

function normalizeBaseUrl(value) {
  const base = (value || "http://127.0.0.1:8787").trim();
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

function normalizeBase64(value) {
  const normalized = String(value || "")
    .trim()
    .replace(/-/g, "+")
    .replace(/_/g, "/");
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

function printUsage() {
  console.log("Usage:");
  console.log("  node ./scripts/replay-resend-webhook-from-file.mjs <raw-payload-file>");
  console.log("");
  console.log("Required environment variables:");
  console.log("  RESEND_WEBHOOK_SECRET");
  console.log("");
  console.log("Optional environment variables:");
  console.log("  WORKER_BASE_URL (default: http://127.0.0.1:8787)");
  console.log("  RESEND_RAW_BODY_FILE (fallback when CLI arg is not provided)");
  console.log("  RESEND_WEBHOOK_ID (default: replay_<timestamp>)");
  console.log("  RESEND_WEBHOOK_TIMESTAMP (default: now, epoch seconds)");
  console.log("  RESEND_SIGNATURE_VERSION (default: v1)");
  console.log("  RESEND_CONTENT_TYPE (default: application/json)");
}

async function main() {
  const arg1 = String(process.argv[2] || "").trim();
  if (arg1 === "--help" || arg1 === "-h") {
    printUsage();
    return;
  }

  const payloadFile = arg1 || String(process.env.RESEND_RAW_BODY_FILE || "").trim();
  const webhookSecret = String(process.env.RESEND_WEBHOOK_SECRET || "").trim();

  if (!payloadFile) {
    console.error("Missing payload file. Provide CLI arg or RESEND_RAW_BODY_FILE.");
    printUsage();
    process.exit(1);
  }

  if (!webhookSecret) {
    console.error("Missing RESEND_WEBHOOK_SECRET.");
    process.exit(1);
  }

  const workerBaseUrl = normalizeBaseUrl(process.env.WORKER_BASE_URL);
  const resendWebhookId = String(process.env.RESEND_WEBHOOK_ID || "").trim() || `replay_${Date.now()}`;
  const resendTimestamp = String(process.env.RESEND_WEBHOOK_TIMESTAMP || "").trim() || String(Math.floor(Date.now() / 1000));
  const signatureVersion = String(process.env.RESEND_SIGNATURE_VERSION || "").trim() || "v1";
  const contentType = String(process.env.RESEND_CONTENT_TYPE || "").trim() || "application/json";

  const rawBody = await readFile(payloadFile, "utf8");
  const signedContent = `${resendWebhookId}.${resendTimestamp}.${rawBody}`;
  const signature = hmacSha256Base64(webhookSecret, signedContent);

  if (!signature) {
    console.error("Failed to generate signature from RESEND_WEBHOOK_SECRET.");
    process.exit(1);
  }

  const url = `${workerBaseUrl}/webhooks/resend`;
  console.log(`POST ${url}`);
  console.log(`payloadFile=${payloadFile}`);
  console.log(`svix-id=${resendWebhookId}`);
  console.log(`svix-timestamp=${resendTimestamp}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": contentType,
      "svix-id": resendWebhookId,
      "svix-timestamp": resendTimestamp,
      "svix-signature": `${signatureVersion},${signature}`
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
  console.error("Replay failed:", error);
  process.exit(1);
});
