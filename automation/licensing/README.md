# Licensing Frontdoor Automation

This folder is the source of truth for website licensing and checkout content.
The live commercial frontdoor is Stripe for payment, Keygen for license
issuance, and the Cloudflare worker for Resend-backed customer/internal email
handling.

## Files

- `linux-security-lite.json`: canonical Linux Security Lite pricing, tier, add-on, Stripe, and Keygen policy data.
- `../../ci/render-licensing-pages.py`: renders website sections from this JSON.

## Why this exists

It keeps the public website aligned with:

- Stripe checkout links for automatic payment.
- Keygen policy IDs for automatic license issuing.
- Worker-driven email and notification flows layered on top of Stripe and Keygen.
- Manual fallback routes when checkout/license automation is not available.

## Update flow

1. Edit `linux-security-lite.json`.
2. Render pages:
   - `python ci/render-licensing-pages.py --write`
3. Validate no drift:
   - `python ci/render-licensing-pages.py --check`

## Manual fallback behavior

If a tier does not have an active `checkout_url`, the renderer uses the configured fallback URL/label/note, so users are routed to contact/invoice flows.
