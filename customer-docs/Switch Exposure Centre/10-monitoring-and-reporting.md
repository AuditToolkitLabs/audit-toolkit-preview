# Monitoring and Reporting

## What to monitor

- Health endpoint responses
- Readiness checks
- Refresh job success and failure rates
- Stale advisory or inventory data
- Connector and source errors
- Unexpected drops in report coverage
- Pentest scan activity, denials, and port-policy failures

## Operational signals

The most useful signals are the ones that show whether the data is current and
whether the vendor feeds or device connections are still working.

## Reporting cadence

A practical cadence is:

- Daily review of failed jobs or stale sources
- Weekly review of exposure trends
- Monthly review of changes in coverage, remediation progress, and exceptions

## Reporting outputs

Reports should help answer:

- Which devices are exposed?
- Which advisories are most relevant?
- What changed since the last review?
- Which teams need to act next?

Pentest scans also produce action-log entries and a manual scan report. Those
results are useful for validating approved target lists and port exposure, but
they are not a substitute for a full vulnerability management program.
