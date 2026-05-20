# Billing Operations Runbook

This runbook covers day-to-day operations for the billing worker, focused on:

- `billing.plan_unresolved` incidents
- weekly Stripe to Keygen reconciliation
- fast triage for missing and orphan records

## Scope and Contacts

- Primary ops mailbox: `BILLING_OPS_EMAIL`
- Escalation mailbox: `BILLING_ESCALATION_EMAIL` (falls back to ops mailbox)
- Communication mode: email-based alerting and response

Incident documentation template:

- `BILLING-INCIDENT-TEMPLATE.md`

## Alerts You Will Receive

- Ops event: `[Ops][ACTION REQUIRED] PLAN UNRESOLVED`
- Escalation event: `[ACTION REQUIRED] PLAN UNRESOLVED - <stripe_session_id>`
- Weekly summary: `[Ops] Weekly Billing Reconciliation - Aligned|Action required`

## P1 Incident: PLAN_UNRESOLVED

Meaning:

- Stripe checkout was paid, but worker could not map transaction to a Keygen policy.
- License issuance is blocked for that session.

### Immediate Response (Target: <= 30 minutes)

1. Capture identifiers from alert email:
   - Stripe session id
   - Stripe event id
2. Retrieve checkout session in Stripe CLI:

   ```powershell
   stripe checkout sessions retrieve <stripe_session_id>
   ```

3. Verify metadata contains one of:
   - `keygen_policy_id` (preferred)
   - `plan_lookup_key`
   - `price_id`
   - `product_id`
4. If metadata missing or wrong, fix source of truth first:
   - Payment link/session creation metadata
   - Worker price map (`PRICE_POLICY_MAP_JSON`) if lookup-based mapping is required
5. Re-run transaction safely in test mode to confirm mapping resolves.

### Recovery Options

Option A (preferred): Correct metadata/mapping and run a new paid checkout.

Option B (manual intervention): Use admin reissue endpoint for internal workflow handoff.

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://audittoolkit-billing-worker.billing-hooksaudittoolkitlabscom.workers.dev/admin/reissue-license" `
  -Headers @{ "x-admin-token" = "<ADMIN_API_TOKEN>" } `
  -ContentType "application/json" `
  -Body '{"stripeSessionId":"<stripe_session_id>","reason":"plan_unresolved"}'
```

Note:

- `/admin/reissue-license` now attempts immediate session reprocessing using current mapping.
- If mapping remains unresolved, it emits unresolved alerting and retry queue state as normal.

### Close Criteria

1. Keygen license exists for impacted transaction/customer.
2. Customer received license email or manual fulfillment completed.
3. Root cause recorded (metadata gap, mapping gap, or Stripe fixture limitation).

## Weekly Reconciliation

Run cadence:

- Weekly (recommended every Monday)
- Also after any production incident involving mapping or issuance

Endpoint:

- `POST /admin/reconciliation-report`

Example command:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://audittoolkit-billing-worker.billing-hooksaudittoolkitlabscom.workers.dev/admin/reconciliation-report" `
  -Headers @{ "x-admin-token" = "<ADMIN_API_TOKEN>" } `
  -ContentType "application/json" `
  -Body '{"days":7}'
```

Response fields to review:

- `paidStripeSessions`
- `issuedKeygenLicenses`
- `missingLicenses`
- `orphanLicenses`
- `status`

Interpretation:

- `status = Aligned`: no paid sessions missing licenses in the selected window.
- `status = Action required`: at least one discrepancy exists.

## Fast Reconciliation Workflow

### If missingLicenses > 0

1. Prioritize by newest first and highest amount first.
2. For each missing session id:
   - Inspect Stripe session metadata and payment status.
   - Confirm mapping keys and plan policy id.
   - Issue license using corrected metadata flow or manual path.
3. Validate customer notification status after issuance.

### If orphanLicenses > 0

1. Check if issuance happened outside reconciliation window or from manual test.
2. Confirm associated Stripe session id validity.
3. Mark expected test/manual or investigate unauthorized/manual drift.

## Preventive Controls

1. Always include `keygen_policy_id` and `plan_code` in checkout metadata.
2. Keep `PRICE_POLICY_MAP_JSON` up to date for fallback resolution.
3. Keep `STRIPE_API_SECRET` configured for line-item fallback resolution.
4. Review reconciliation report weekly and after any deployment to billing logic.

## Auto Retry Behavior

The worker automatically retries unresolved paid sessions when retry is enabled.

- Queue key: `unresolved:<stripe_session_id>` in KV
- Default retry config:
- enabled: `true`
- max attempts: `6`
- base delay: `300s`
- Backoff: exponential, capped at 24h between attempts

Tunable env vars:

- `AUTO_RETRY_PLAN_UNRESOLVED`
- `AUTO_RETRY_MAX_ATTEMPTS`
- `AUTO_RETRY_BASE_DELAY_SECONDS`

Ops events to monitor:

- `billing.plan_unresolved`
- `billing.plan_unresolved_recovered`
- `billing.plan_unresolved_retry_exhausted`

Escalation routing:

- `BILLING_ESCALATION_EMAIL` if set
- otherwise `BILLING_OPS_EMAIL`
