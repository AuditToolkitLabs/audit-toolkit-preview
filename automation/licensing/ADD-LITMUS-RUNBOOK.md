# Add Litmus to the Sales Stack — Runbook

End-to-end steps to make **Litmus** sellable through the existing commercial
frontdoor: **Keygen** (license issuance) → **Stripe** (payment) → **Cloudflare
worker** (glue/email) → **website** (pricing/checkout) → **releases** (download).

This consolidates the generic guides:
[KEYGEN_PROVISIONING_RUNBOOK](../../../../DISA%20STIG%20Complaince%20System/custom-doc/legal/KEYGEN_PROVISIONING_RUNBOOK.md),
`cloudflare-worker/README.md`, `automation/licensing/README.md`, and
`releases/RELEASES-RUNBOOK.md` — applied to Litmus.

> **Sequencing:** the website/release steps (5–6) are gated on a **full Litmus
> release** existing. Steps 1–4 can be done now.

## Litmus tier model (source of truth: `litmus.json`)

Licensed unit = **connected node** (an asset with a connection profile attached).
Flat price per band; `maxNodes 0` = unlimited.

| Tier | Connected nodes | Price (GBP/yr) | Stripe lookup key | Keygen policy `maxNodes` |
|---|---|---|---|---|
| Starter (free) | 5 | £0 | — (no key) | 5 |
| Pro | 25 | £349 | `litmus-pro` | 25 |
| Team | 100 | £990 | `litmus-team` | 100 |
| Business | 500 | £3,490 | `litmus-business` | 500 |
| Enterprise | 2,500 | £11,900 | `litmus-enterprise` | 2500 |

Add-ons: Air-Gapped Licensing Pack (£790), Priority Support (£490). Unlimited /
site licence: contact sales.

---

## Step 1 — Keygen (license issuance)

Templates: `automation/licensing/keygen/litmus/`.

1. Create the **product** (`product.template.json`) → record the product id.
2. Create **one policy per paid tier** (`policy.template.json`), substituting
   `<TIER_NAME>`, `<MAX_NODES>`, `allowAirGapped` (true for Business/Enterprise),
   and `<LITMUS_PRODUCT_ID>`. Also create a **Starter (free)** policy if you want
   the free tier tracked. Record each policy id.
3. Note the **Keygen account id** and an **API token** (worker secret).
4. (Offline/air-gapped) generate the vendor signing keypair used by the product's
   offline path — see Step 4.

Then write the real policy ids into:
- `litmus.json` → each tier's `keygen_policy_id`
- `cloudflare-worker/config` price→policy map (Step 3)

## Step 2 — Stripe (payment)

Create **one product, "Litmus", with one annual price per paid tier** (cleaner
than a product-per-tier; the worker resolves by lookup key / metadata, not by
product). The free Starter tier needs no Stripe price — it is keyless.

1. Create the Stripe product **`Litmus`**.
2. Add a **recurring annual price (interval = year, currency = GBP)** for each
   paid tier, each with its **`lookup_key`** and a **`metadata.keygen_policy_id`**:

   | Price | Amount (GBP/yr) | lookup_key | metadata.keygen_policy_id |
   |---|---|---|---|
   | Pro | 349 | `litmus-pro` | «Pro policy id» |
   | Team | 990 | `litmus-team` | «Team policy id» |
   | Business | 3490 | `litmus-business` | «Business policy id» |
   | Enterprise | 11900 | `litmus-enterprise` | «Enterprise policy id» |

   Add-ons (same product or a separate "Add-ons" product, your choice): Air-Gapped
   Licensing Pack **790**, Priority Support **490**.
3. `keygen_policy_id` on the price metadata is preferred resolution; `lookup_key`
   / `price_id` are accepted fallbacks (see `cloudflare-worker/README.md` →
   *Important Stripe Metadata*).
4. Create a **payment link** per price on `checkout.audittoolkitlabs.com`; record
   each URL.
5. Write each payment-link URL into `litmus.json` → tier `cta.checkout_url`.

## Step 3 — Cloudflare worker (glue)

1. Add the litmus entries (already stubbed in
   `cloudflare-worker/config/price-policy-map.example.json`) to the real
   **`PRICE_POLICY_MAP_JSON`** GitHub environment secret, with real price ids /
   lookup keys → real Keygen policy ids.
2. Re-run the secrets sync:
   `gh workflow run "Sync Cloudflare Worker Secrets" --repo AuditToolkitLabs/audit-toolkit-preview`
3. Confirm the Stripe webhook (`/webhooks/stripe`) and Keygen webhook are live
   (they already are for the account — no per-product change needed).
4. **Smoke test:** a £0 / test-price purchase → verify in `wrangler tail`:
   `stripe-signature verified`, `keygen license created`, `billing.license_issued`.

## Step 4 — Litmus product wiring (done in the litmus repo)

Already implemented in the litmus app:
- **Connected validation:** Settings → License accepts the **Keygen license key**
  (emailed on purchase) + Keygen account id; validates via Keygen and enforces the
  node cap.
- **Offline validation:** Settings → License accepts a signed licence file +
  vendor public key (air-gapped). Mint files with
  `litmus/scripts/mint_license.py` (and `mint_license.py keygen` for the vendor
  keypair). Ship the **public** key to customers.
- **Free tier:** 5 connected nodes with no licence.

Action: keep the Keygen **account id** consistent between the worker, the licences
issued, and what customers enter in Settings → License.

## Step 5 — Website (gated on release + final pricing)

1. Keep `litmus.json` current (policy ids + Stripe `checkout_url`s).
2. Add a Litmus pricing page + product card. **Note:** the current renderer
   (`ci/render-licensing-pages.py`) is hard-wired to the Linux pages/markers; to
   render Litmus the same way, generalise it to take a product key + page +
   markers, then add a `litmus-pricing.html` with the marker blocks. Until then,
   the Litmus pricing section is authored manually or via a follow-up renderer
   change. (Tracked as remaining work — not done in this branch.)
3. Replace "Contact Licensing Team" CTAs with the real Stripe links once Step 2 is
   confirmed working end-to-end.

## Step 6 — Releases (download hub) — gated on a full release

1. `releases/releases-sources.json` already has the litmus entry (this branch).
2. `litmus-releases.html` exists (this branch) and reads
   `releases/data/litmus.json`.
3. On the Gitea host, publish the litmus release:
   `python ci/sync-releases.py --product litmus --tag <vX.Y.Z> --publish-github`
   then commit `releases/data/`. The hub card appears once a release is mirrored.

---

## Status checklist

- [x] `litmus.json` licensing data (placeholder policy ids / checkout urls)
- [x] Keygen product + policy templates (`keygen/litmus/`)
- [x] Price→policy map litmus stubs (`price-policy-map.example.json`)
- [x] Litmus app: connected Keygen + offline + free, node-cap enforcement
- [x] `mint_license.py` for offline licences
- [x] `releases-sources.json` entry + `litmus-releases.html`
- [ ] **Keygen:** create product + policies, capture real ids *(dashboard)*
- [ ] **Stripe:** create products/prices/payment links + metadata *(dashboard)*
- [ ] **Cloudflare:** put real ids in `PRICE_POLICY_MAP_JSON`, sync, smoke test
- [ ] Fill real policy ids + checkout urls into `litmus.json`
- [ ] Website pricing page/render (generalise renderer) *(after release)*
- [ ] Publish the litmus release to the GitHub hub *(after release)*

Owner split: dashboard/account actions (Keygen, Stripe, Cloudflare secrets, the
test purchase) are operator tasks; the repo artifacts above are prepared on the
`add-litmus` branch.
