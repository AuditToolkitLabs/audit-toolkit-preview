# Cloudflare Billing Glue (Stripe + Keygen + Microsoft 365)

This worker provides the missing public webhook/API layer for:

- Stripe checkout and subscription events
- Keygen automatic license issuance
- Microsoft 365 Power Automate notifications

## Endpoints

- `GET /health`
- `POST /webhooks/stripe`
- `POST /webhooks/keygen`
- `POST /admin/reissue-license` (protected with `x-admin-token`)
- `POST /admin/reconciliation-report` (protected with `x-admin-token`)

## Flow Summary

1. Stripe sends an event to `/webhooks/stripe`.
2. Worker validates Stripe signature (`STRIPE_WEBHOOK_SECRET`).
3. Worker resolves plan mapping from session metadata or `PRICE_POLICY_MAP_JSON`.
4. If metadata is missing and `STRIPE_API_SECRET` is configured, worker fetches Stripe line items and resolves by lookup key/price/product.
5. Worker creates a Keygen license under the mapped policy.
6. Worker posts an event payload to a Power Automate HTTP flow for email and internal ops handling.
7. Worker records event IDs and session-level issuance records in KV to prevent duplicate processing.

## Prerequisites

- Cloudflare account
- Stripe account with webhook support
- Keygen account and API token
- Microsoft 365 tenant with Power Automate
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

## Power Automate Pattern

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
- Log failures to flow/SharePoint and monitor retries.
- Configure `STRIPE_API_SECRET` so license issuance does not depend solely on checkout metadata.

## Operational Notes

- If plan mapping fails, the worker emits `billing.plan_unresolved` to M365 flow so your team can intervene.
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
