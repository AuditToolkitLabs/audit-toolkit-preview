# Quick Start - API Usage

## Goal

Use the API to pull the main operational data needed for automation or
integration.

## Common API areas

- Devices
- Advisories
- Exposures
- Reports
- Jobs
- Connectors
- Administration and pentest helpers where enabled

## Example workflow

1. Query the device list.
2. Select a specific device record.
3. Review matching advisories or exposures.
4. Pull a report for a summary view.
5. Check job status if the data looks stale.

## Integration guidance

Use API responses as the source of truth for automation. The UI is useful for
operator review, but downstream systems should integrate with the structured
API output where possible.
