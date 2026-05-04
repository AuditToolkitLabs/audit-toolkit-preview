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

## Not included

- installers
- appliance images
- release binaries
- customer bundles
- public Gumroad checkout links
- licensing or activation flow

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
