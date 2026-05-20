# Cloudflare Billing Glue (Stripe + Keygen + Resend)

This worker provides the public commercial/licensing layer for:

- Stripe checkout and subscription events
- Keygen automatic license issuance
- Resend customer and internal email delivery
- Optional Microsoft 365 Power Automate forwarding

## Endpoints

- `GET /health`
- `POST /webhooks/stripe`
- `POST /webhooks/keygen`
- `POST /webhooks/resend`
- `POST /admin/reissue-license` (protected with `x-admin-token`)
- `POST /admin/reconciliation-report` (protected with `x-admin-token`)

## Flow Summary

1. Stripe sends an event to `/webhooks/stripe`.
2. Worker validates Stripe signature (`STRIPE_WEBHOOK_SECRET`).
3. Worker resolves plan mapping from session metadata or `PRICE_POLICY_MAP_JSON`.
4. If metadata is missing and `STRIPE_API_SECRET` is configured, worker fetches Stripe line items and resolves by lookup key/price/product.
5. Worker creates a Keygen license under the mapped policy.
6. Worker sends customer receipts, license emails, reminders, and internal ops notifications through Resend.
7. Worker can optionally forward the same event payload to a Power Automate HTTP flow.
8. Worker records event IDs and session-level issuance records in KV to prevent duplicate processing.

## Prerequisites

- Cloudflare account
- Stripe account with webhook support
- Keygen account and API token
- Resend account and API key
- Optional Microsoft 365 tenant with Power Automate
- Node.js 20+ and Wrangler CLI

## Setup

1. Install Wrangler:

   ```bash
   npm install -g wrangler
   ```

2. Authenticate:

   ```bash
   wrangler login
   ```

3. Create KV namespace:

   ```bash
   wrangler kv namespace create BILLING_EVENTS_KV
   wrangler kv namespace create BILLING_EVENTS_KV --preview
   ```

4. Update `wrangler.toml` with returned `id` and `preview_id`.

5. Build your plan map from `config/price-policy-map.example.json` and paste compact JSON into `PRICE_POLICY_MAP_JSON` in `wrangler.toml`.

6. Set secrets:

   ```bash
   wrangler secret put STRIPE_WEBHOOK_SECRET
   wrangler secret put KEYGEN_ACCOUNT_ID
   wrangler secret put KEYGEN_API_TOKEN
   wrangler secret put STRIPE_API_SECRET
   wrangler secret put KEYGEN_WEBHOOK_PUBLIC_KEY
   wrangler secret put RESEND_API_KEY
   wrangler secret put RESEND_FROM_EMAIL
   wrangler secret put RESEND_WEBHOOK_SECRET
   wrangler secret put ADMIN_API_TOKEN
   wrangler secret put M365_FLOW_WEBHOOK_URL
   ```

7. Run locally:

   ```bash
   wrangler dev
   ```

8. Deploy:

   ```bash
   wrangler deploy
   ```

## Stripe Webhook Configuration

Configure Stripe webhook endpoint to:

- `https://<your-worker-domain>/webhooks/stripe`

Enable at least these events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Important Stripe Metadata

Because Stripe checkout session events do not always include full line item detail by default, include one of these metadata keys in your checkout/session creation path:

- `keygen_policy_id` (preferred)
- `plan_lookup_key`
- `price_id`

Fallback behavior when metadata is missing:

- If `STRIPE_API_SECRET` is configured, the worker fetches first checkout session line item and resolves mapping using `lookup_key`, then `price.id`, then `product.id`.
- You can optionally provide `byProductId` in the plan map JSON.

## Keygen Webhook Configuration

Configure Keygen webhook endpoint to:

- `https://<your-worker-domain>/webhooks/keygen`

If you configure `KEYGEN_WEBHOOK_PUBLIC_KEY` with your Keygen account public key PEM, the worker validates webhook signatures and reports events to Microsoft 365 flow under `billing.keygen_event`.

## Resend Configuration

Set these secrets to enable customer-facing and internal email delivery:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_WEBHOOK_SECRET` (required for validating inbound Resend webhook signatures)

Configure your Resend webhook endpoint to:

- `https://<your-worker-domain>/webhooks/resend`

Run a signed inbound webhook smoke test from this repository:

- PowerShell:

   ```powershell
   $env:WORKER_BASE_URL="http://127.0.0.1:8787"
   $env:RESEND_WEBHOOK_SECRET="<your_resend_webhook_secret>"
   node .\scripts\send-resend-webhook-sample.mjs
   ```

- Bash:

   ```bash
   WORKER_BASE_URL="http://127.0.0.1:8787" \
   RESEND_WEBHOOK_SECRET="<your_resend_webhook_secret>" \
   node ./scripts/send-resend-webhook-sample.mjs
   ```

Optional overrides:

- `RESEND_EVENT_TYPE` (default `email.delivered`)
- `RESEND_WEBHOOK_ID`
- `RESEND_SAMPLE_FROM`
- `RESEND_SAMPLE_TO`
- `RESEND_SAMPLE_SUBJECT`
- `RESEND_SAMPLE_EMAIL_ID`

Replay a real raw webhook payload from file (for forensic validation):

- PowerShell:

   ```powershell
   $env:WORKER_BASE_URL="http://127.0.0.1:8787"
   $env:RESEND_WEBHOOK_SECRET="<your_resend_webhook_secret>"
   node .\scripts\replay-resend-webhook-from-file.mjs .\samples\resend-event.raw.json
   ```

- Bash:

   ```bash
   WORKER_BASE_URL="http://127.0.0.1:8787" \
   RESEND_WEBHOOK_SECRET="<your_resend_webhook_secret>" \
   node ./scripts/replay-resend-webhook-from-file.mjs ./samples/resend-event.raw.json
   ```

Replay script optional overrides:

- `RESEND_RAW_BODY_FILE` (fallback when no CLI file path is provided)
- `RESEND_WEBHOOK_ID`
- `RESEND_WEBHOOK_TIMESTAMP`
- `RESEND_SIGNATURE_VERSION` (default `v1`)
- `RESEND_CONTENT_TYPE` (default `application/json`)

Optional site/legal link variables used in outbound email content:

- `PUBLIC_SITE_BASE_URL`
- `LICENSE_TERMS_URL`
- `SUPPORT_URL`
- `PRIVACY_URL`

Current email flows handled directly by the worker include:

- license issued notifications to customers
- payment confirmations and invoice emails to customers
- license expiry reminders from Keygen webhook events
- internal sales, ops, and escalation notifications
- weekly reconciliation reports via `/admin/reconciliation-report`
- inbound Resend webhook capture and internal notification via `/webhooks/resend`

## Power Automate Pattern

Power Automate is optional. Use it only when you want a secondary internal automation sink alongside Resend.

Use one HTTP-triggered flow:

- Trigger: `When an HTTP request is received`
- Action: route by `eventType`
- Action: send customer/internal email via Outlook connector
- Optional: append item to SharePoint list for audit log

## Security Checklist

- Keep all secrets in Wrangler secret storage, not in source files.
- Restrict admin endpoint by long random token and optionally Cloudflare Access.
- Keep Stripe timestamp tolerance strict (worker uses 5 minutes).
- Keep idempotency on (KV event tracking is enabled).
- Log failures from Resend and any optional flow/SharePoint forwarding, and monitor retries.
- Configure `STRIPE_API_SECRET` so license issuance does not depend solely on checkout metadata.
- Configure `RESEND_API_KEY` and `RESEND_FROM_EMAIL` so license/customer notifications are delivered directly from this worker.

## Operational Notes

- If plan mapping fails, the worker emits `billing.plan_unresolved` through Resend and optionally forwards it to M365 so your team can intervene.
- Duplicate Stripe deliveries are ignored via KV event-id dedupe and session-level issuance record checks.
- For enterprise MSP/OEM paths, continue manual contract checks before policy assignment.

## Auto Retry Controls

The worker now supports automatic retry for unresolved paid sessions.

- Unresolved sessions are queued in KV under `unresolved:<stripe_session_id>`.
- Retry sweep runs after Stripe webhook processing.
- Retries use exponential backoff and capped attempts.
- On recovery, the worker emits `billing.plan_unresolved_recovered` and normal `billing.license_issued`.
- On max-attempt exhaustion, the worker emits `billing.plan_unresolved_retry_exhausted`.

Optional environment variables:

- `AUTO_RETRY_PLAN_UNRESOLVED` = `true|false` (default `true`)
- `AUTO_RETRY_MAX_ATTEMPTS` = integer (default `6`)
- `AUTO_RETRY_BASE_DELAY_SECONDS` = integer seconds (default `300`)
- `BILLING_OPS_EMAIL` = support destination (default `support@audittoolkitlabs.com`)
- `BILLING_SALES_EMAIL` = sales/commercial destination (default `license@audittoolkitlabs.com`)
- `BILLING_ESCALATION_EMAIL` = escalation recipient (fallback to `BILLING_OPS_EMAIL`)

## Ops Runbook

- See `BILLING-OPERATIONS-RUNBOOK.md` for incident handling, reconciliation, and response procedures.
