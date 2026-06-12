# Public Preview Publishing Folder

This folder is a **minimal, safe-to-publish preview package** for either:

1. **GitHub Pages**
2. a **separate public preview repository**

It is intentionally limited to **documentation and screenshots only**.

## Included

- `index.html` — static landing page for preview publication
- `.nojekyll` — allows simple static Pages hosting
- `PUBLISHING-SCREENSHOT-MANIFEST.md` — screenshot mapping reference
- `PUBLISHING-SCREENSHOT-MANIFEST.csv` — spreadsheet/storefront mapping export
- `customer-docs/<product>/screenshots/` — approved preview-safe screenshots by product

Customer documentation governance:

- `customer-docs/` is the local website documentation store in this repository.
- Primary baseline source repository path: `F:/AuditProducts/AuditToolkit-Docs`.
- Local, governed updates are allowed here when the baseline source is offline.
- Policy contract: `customer-docs/SOURCE-OF-TRUTH-POLICY.md`.
- Operating model: `OFFLINE-DOC-SYNC-RECONCILIATION-MODEL.md`.
- Mandatory ledger: `docs-sync-ledger.md`.
- Docs source config: `docs-source-config.json` (used by `doc-viewer.html` for
  local-first fetch with optional remote fallback).
- Canary remote-only toggle: set `enableCanaryRemoteOnly` in
  `docs-source-config.json` and open docs with `?canary=remote-only`.
- CI smoke workflow: `.github/workflows/docs-remote-canary-smoke.yml` validates
  remote doc availability with local `customer-docs/` temporarily disabled.

## Not included

- installers
- appliance images
- release binaries
- customer bundles
- public Gumroad checkout links
- licensing or activation flow
- unmanaged documentation changes outside the policy and audit contract in
  `customer-docs/SOURCE-OF-TRUTH-POLICY.md`

## How to use

### Option A — GitHub Pages

1. Copy the contents of this folder into the root of a dedicated preview repo.
2. Enable **GitHub Pages** from the default branch root.
3. Publish `index.html` as the preview landing page.
4. Verify the page exposes **docs and images only**.

### Option B — Separate preview repo

1. Create a new public repo for preview content.
2. Copy this folder's contents into that repo.
3. Keep the main product repo and private branches private.
4. Do not add release artifacts or Gumroad purchase links.

## Final manual checks before publication

- Confirm **no download buttons** are present.
- Confirm **Gumroad remains unpublished**.
- Confirm all Stripe-related checkout links use **[checkout.audittoolkitlabs.com](https://checkout.audittoolkitlabs.com/)** only.
- Confirm **main** and feature branches remain private.
- Confirm screenshots contain no secrets, internal hostnames, or customer data.

## Optional automation module

This repo now includes an optional Cloudflare Worker implementation under `cloudflare-worker/` that acts as the commercial/licensing glue between Stripe, Keygen, and Resend, with Microsoft 365 forwarding remaining optional.

- Worker source: `cloudflare-worker/src/index.js`
- Deployment config: `cloudflare-worker/wrangler.toml`
- Setup guide: `cloudflare-worker/README.md`

Use this module when you want automated license issuance and webhook handling while keeping the public site static.

## Stripe Catalog Reconciliation (Legacy Alignment Only)

Normal commercial operation should source product, pricing, payment link, and
license-issuance routing data directly from Stripe plus Keygen mappings. The
spreadsheet comparison tools below are retained only for historical cleanup or
one-off alignment work.

Use the validator script below to compare a spreadsheet of product IDs, payment
link URLs, prices, and durations against Stripe directly:

- `python ci/reconcile-stripe-catalog.py --xlsx "C:\\path\\to\\catalog.xlsx" --mode live`

Optional filters and outputs:

- `--family "Linux-Security-Lite"` (repeatable)
- `--json-out stripe-reconcile-report.json`

The script returns non-zero when mismatches are found.

## Stripe Direct Catalog Truth Export

Stripe is the single source of truth for catalog, payment, and commercial
details. Export the authoritative catalog directly from Stripe payment links
(no spreadsheet input):

- `python ci/export-stripe-catalog-truth.py --mode live --json-out stripe-catalog-truth.json`

Optional filters:

- `--url-host checkout.audittoolkitlabs.com`
- `--name-filter "AuditToolkit"` (repeatable)

## Stripe Spreadsheet Patch Artifacts (Legacy Backfill Only)

If you already have both the spreadsheet reconcile report and the Stripe truth
export, generate direct spreadsheet patch files from those two inputs:

- `python ci/generate-stripe-correction-patch.py --reconcile-json stripe-reconcile-report.json --truth-json stripe-catalog-truth.json --csv-out stripe-spreadsheet-corrections.csv --md-out stripe-spreadsheet-corrections.md --cell-csv-out stripe-spreadsheet-cell-updates.csv --cell-md-out stripe-spreadsheet-cell-updates.md`

Outputs:

- `stripe-spreadsheet-corrections.csv` and `.md` for row-level mismatch summaries
- `stripe-spreadsheet-cell-updates.csv` and `.md` for xlsx-safe cell updates with line, column, current value, and new value

These artifacts are not part of the normal live pricing/licensing flow.
