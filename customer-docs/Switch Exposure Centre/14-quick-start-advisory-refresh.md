# Quick Start - Advisory Refresh

## Goal

Get a vendor advisory source configured and confirm that refresh and
correlation work end to end.

## Steps

1. Open advisory source settings.
2. Select the vendor you want to configure.
3. Choose the source mode that matches the customer access pattern.
4. Save the feed URL or file path and any required credentials.
5. Run a refresh for the vendor.
6. Confirm that the source status and refresh result are successful.

## What to verify

- The refresh completes without error
- The product shows whether sample data or live source data was used
- The advisory records match the expected vendor and platform family
- The exposure view changes when new advisories are introduced

## Common issues

- Bad feed URL or file path
- Missing credentials
- Source fallback to sample data
- Network restrictions from the runtime host
