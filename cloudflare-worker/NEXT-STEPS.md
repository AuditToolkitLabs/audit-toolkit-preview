# Billing Worker — Next Steps

> ⚠ **Historical / superseded.** These notes date from 16 May 2026 and describe
> a one-off Power Automate activation and a £0 test purchase against an old
> checkout link. They are kept for context only. The worker source and the
> current deploy procedure live in the canonical repo
> `audittoolkitlabs/audittoolkit-billing-worker` (Gitea). Do not deploy from
> this directory — it has no worker source.

## Status (as of 16 May 2026)

All infrastructure is deployed and wired up. The only blocker is Power Automate licence propagation (up to 7 days from purchase).

---

## Immediate — When Power Automate Activates

1. **Edit and resave the PA flow**

   - Go to [flow.microsoft.com](https://flow.microsoft.com)
   - Open the licence issuance flow
   - Make any minor edit and **Save** — PA requires this after a new licence is applied

2. **Run the worker tail**

   ```powershell
   cd E:\repo-splits-2\audit-toolkit-preview\cloudflare-worker
   $env:PATH = "C:\Program Files\nodejs;$env:PATH"
   wrangler tail --format pretty
   ```

3. **Complete a £0 test purchase**

   - URL: `https://checkout.audittoolkitlabs.com/b/28EdR9b1Y6Lg73Y8zLfQI0o`
   - Test Keygen policy ID already embedded as payment link metadata: `b3655163-203f-4e08-94b7-a51b7e5c7e9b`
   - Use any real email address you can check

4. **Verify in the tail logs:**

   - `stripe-signature verified` — Stripe webhook accepted
   - `keygen license created` — Keygen API call succeeded
   - `billing.license_issued` posted to M365 Flow — email triggered
   - No `m365-flow-post-failed` errors

5. **Verify in your inbox:**

   - Customer email received with licence key
   - Admin copy/BCC received (if configured in the PA flow)

6. **Verify in Keygen dashboard:**

   - Licences → a new licence should appear under the Test Policy

---

## If the Test Fails

### Check Stripe delivery logs

Stripe Dashboard → Developers → Webhooks → "Audit Toolkit License Automation" → Recent deliveries

- HTTP 200 = worker accepted it
- HTTP 500 = worker threw an error (check wrangler tail output)

### Check worker logs

```powershell
wrangler tail --format pretty
```

Look for error messages — common ones:

- `m365-flow-post-failed:4xx` — PA flow URL is wrong or flow is disabled
- `keygen-create-license-failed` — Keygen API token invalid or policy ID wrong
- `signature-mismatch` — Stripe or Keygen secret mismatch

### Re-run secrets sync if secrets were changed

```powershell
gh workflow run "Sync Cloudflare Worker Secrets" --repo AuditToolkitLabs/audit-toolkit-preview
gh run list --workflow=cloudflare-worker-secrets-sync.yml --repo AuditToolkitLabs/audit-toolkit-preview
```

---

## After Successful Test — Production Wiring

Once the test purchase works end-to-end, wire up the real products:

1. **Build the `PRICE_POLICY_MAP_JSON` secret**

   For each real Stripe product/price, map it to its Keygen policy ID. The
   canonical map lives in the worker repo at `billing/price-policy-map.json`
   and is mirrored to the `PRICE_POLICY_MAP_JSON` dashboard variable — it is a
   plain-text variable, not a GitHub-synced secret.

2. **Add real Stripe payment links to pricing pages**

   Replace `Contact Licence Team` buttons with direct Stripe payment link URLs
   on the relevant pricing pages once the end-to-end flow is confirmed working.

3. **Confirm PA flow sends admin copy**

   Ensure the PA flow BCC's or sends a second email to your admin address
   (`License@audittoolkitlabs.com` or similar) on every `billing.license_issued` event.

---

## Reference

| Item                          | Value                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| Worker URL                    | `https://audittoolkit-billing-worker.billing-hooksaudittoolkitlabscom.workers.dev` |
| Stripe webhook destination ID | `we_1TSCvuF107vmGJKCgCkDfcgp`                                                      |
| Stripe webhook path           | `/webhooks/stripe`                                                                 |
| Keygen webhook path           | `/webhooks/keygen`                                                                 |
| KV namespace (production)     | `23253825a905423e90de008f824ddc7f`                                                 |
| GitHub environment            | `github-pages`                                                                     |
| Test payment link             | `https://checkout.audittoolkitlabs.com/b/28EdR9b1Y6Lg73Y8zLfQI0o`                  |
| Test Keygen policy ID         | `b3655163-203f-4e08-94b7-a51b7e5c7e9b`                                             |
