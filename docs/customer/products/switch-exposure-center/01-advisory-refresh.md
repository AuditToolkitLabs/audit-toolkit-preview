# Switch Exposure Center Advisory Refresh

## Purpose

Advisory refresh loads vendor advisory data and correlates it with collected
switch state so operators can review applicable exposures and remediation
priority.

## Source Modes

Advisory sources may use:

- Public vendor feeds.
- Vendor account-backed feeds.
- Customer-managed file exports.
- Sample data for evaluation where explicitly shown by the product.

Customers should use live or approved customer-managed sources for production
evidence.

## Setup Pattern

1. Open advisory source settings.
2. Select the vendor or platform family.
3. Choose the source mode that matches customer access.
4. Enter feed URL, file path, and credentials where required.
5. Save the source settings.
6. Run a refresh for the vendor.
7. Confirm source status and refresh result.
8. Review correlated exposure changes.

## Validation Checklist

- Refresh completes without error.
- Product clearly indicates whether live, file, or sample data was used.
- Advisory records match the expected vendor and platform family.
- Exposure views change when new applicable advisories are introduced.
- Failed credentials, network blocks, or file path errors are visible in logs.
- Refresh timing and frequency align to customer change policy.

## Common Issues

| Issue               | First checks                                                          |
| ------------------- | --------------------------------------------------------------------- |
| Bad feed URL        | Confirm URL, TLS trust, proxy, and outbound network policy.           |
| File path error     | Confirm path, permissions, and file freshness.                        |
| Missing credentials | Confirm vendor account, secret storage, and rotation status.          |
| Sample fallback     | Confirm production source mode and source status.                     |
| No exposure change  | Confirm inventory data, platform mapping, and advisory applicability. |

## Operating Rules

- Treat advisory credentials as secrets.
- Validate feed changes before relying on production reports.
- Record refresh failures in operational monitoring.
- Review exposure priority after each material advisory update.
- Keep customer-managed file exports under documented ownership.

## Related Guidance

- [Switch Exposure Center Overview](overview.md)
- [Security Access And Data Protection](../../security/security-access-data-protection.md)
- [Operations And Support Model](../../operations/operations-and-support.md)
