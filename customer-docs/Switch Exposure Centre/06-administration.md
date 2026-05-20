# Administration

## What administrators manage

Administrators are responsible for the settings that keep the product usable
and trustworthy over time.

## Administration areas

- Connector credentials and vendor definitions
- Advisory source settings and source mode
- Scheduler intervals and automation settings
- Pentest scanner policy, ports, and secondary credentials
- Data retention and cleanup choices
- Backup and restore preparation

## Connector management

Connector settings should be kept separate from advisory source settings.
This prevents device access credentials from being mixed with vendor feed
credentials and makes troubleshooting simpler.

## Advisory source management

Where a vendor offers multiple access methods, prefer the source mode that the
customer can support consistently. If a customer-managed file export is used,
record where the file comes from and how often it is refreshed.

## Pentest administration

The pentest port scanner is disabled until an administrator turns it on.
Administrators can control:

- Whether pentest scanning is enabled
- The maximum number of targets per run
- The connection timeout used for each port attempt
- The allowed ports that a scan may probe
- The secondary pentester credentials used to authorize the scan session

The scanner is intentionally manual and IP-based. It accepts a single IP,
CIDR block, or explicit IP range, then probes only the ports allowed by policy.

## Backups

Backups should be part of routine administration. The operator should be able
to confirm that the database and important configuration state can be restored.
