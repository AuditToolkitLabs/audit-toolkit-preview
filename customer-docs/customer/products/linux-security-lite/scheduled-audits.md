# AuditToolkit Linux Security Lite Scheduled Audits

## Purpose

Scheduled audits run Linux Security Lite at regular intervals with predictable
output paths, logging, and retention. Scheduling is customer controlled and
should follow local change and monitoring policy.

## Scheduling Options

| Option | Use case |
| --- | --- |
| Cron | Broad Linux compatibility and simple recurring execution. |
| systemd timer | systemd distributions where package-provided units are available. |
| Configuration management | Fleet deployment through Ansible or similar tooling. |

## Cron Pattern

Use cron when the product is installed on a host where cron is the approved
scheduling mechanism.

Customer steps:

1. Create or confirm the report directory.
2. Add a root or approved service-account cron entry.
3. Write JSON reports to a predictable path.
4. Append command output to an execution log.
5. Validate the first scheduled report.

When using date expansion inside cron, escape percent characters according to
cron rules.

## Systemd Timer Pattern

Use systemd timers where the release package installs supported service and
timer units.

Customer steps:

1. Reload systemd units.
2. Enable and start the timer.
3. Confirm timer status and next execution time.
4. Review service output through the journal.
5. Use an override file for customer-specific schedules.

## Configuration Management Pattern

For fleets, deploy schedules through configuration management so report paths,
permissions, retention, and command arguments remain consistent.

Recommended controls:

- Create report directories with restrictive permissions.
- Use an approved account and privilege model.
- Keep schedules consistent by environment.
- Validate output schema after deployment.
- Alert on missing reports.

## Retention

Scheduled audits can create many JSON artifacts. Customers should define a
retention period and delete old reports through an approved scheduled task or
log-retention platform.

Recommended retention checks:

- Report directory exists and has expected permissions.
- Old reports are removed after the approved retention window.
- Current reports are backed up or shipped where required.
- Disk usage is monitored.

## Validation

After the first scheduled run:

- Confirm a new JSON report exists.
- Validate the report against the product schema.
- Review pass, warn, fail, skip, coverage, and confidence values.
- Confirm monitoring will detect a missed run.
- Confirm SIEM or downstream ingestion where configured.

## Alerting

Monitor for:

- No new report within the expected window.
- Non-zero command exit.
- Empty or invalid JSON report.
- Coverage or confidence drop.
- Unexpected spike in failed checks.

## Related Guidance

- [Linux Security Lite Overview](overview.md)
- [Operations And Support Model](../../operations/operations-and-support.md)
- [Security Access And Data Protection](../../security/security-access-data-protection.md)
