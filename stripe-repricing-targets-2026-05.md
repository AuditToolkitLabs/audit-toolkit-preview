# Stripe Repricing Targets (May 2026)

This file defines the target commercial pricing now reflected in the website pricing pages.

## Execution Notes

1. In Stripe, create new recurring prices for each product/amount pair listed in `stripe-repricing-targets-2026-05.csv`.
2. Do not edit existing Stripe prices in place; create new prices and move each payment link to the new price.
3. For products marked `create_new_recurring_price`, the current catalog uses legacy one-time or old recurring structures and should be normalized to annual recurring.
4. For products marked `no_public_checkout`, leave website CTA as direct contact and process by quote.
5. After payment links are updated, replace temporary contact CTAs on pricing pages with the refreshed checkout links.

## Website State

- Pricing pages now show market-aligned list pricing.
- Paid CTAs for repriced products currently route to licensing contact to avoid checkout mismatch while Stripe updates are pending.
- Linux licensing automation source was updated in [automation/licensing/linux-security-lite.json](automation/licensing/linux-security-lite.json).

## Key Pricing Anchors Applied

- Audit Core: Starter 1290, Professional 2990, Business 6490, Enterprise custom.
- Linux Module: Starter 349, Professional 999, Business 2490.
- Asset Command Center: Starter 990, Professional 2990, Business 6990.
- Secure Exposure Centre: Starter 2490, Professional 4990, Business 8990, Enterprise custom.
- CMDB API plan tier direction: Starter 1490, Professional 2990, Business 6990, Enterprise custom.
