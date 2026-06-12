# Audit Assurance Node Logging And Observability

## Purpose

Audit Assurance Node records structured operational logs so customers can trace
each audit run, diagnose adapter failures, and preserve execution evidence for
support and assurance review.

## Log Structure

Logs are structured as JSON records. Core fields include:

| Field | Purpose |
| --- | --- |
| `Timestamp` | ISO 8601 event time. |
| `Level` | Severity such as `INFO`, `WARN`, `ERROR`, or `DEBUG`. |
| `Component` | Runtime component such as pipeline, SSH, WinRM, API, or agent. |
| `Message` | Human-readable event description. |
| `Data` | Structured context, including the run correlation identifier. |

Every pipeline execution receives a `RunId`. Use that identifier to trace a
single run across adapter events, result validation, evidence generation, and
report handling.

## Log Locations

The product writes logs under `data/logs/` by default:

| Path | Purpose |
| --- | --- |
| `data/logs/audit.log` | Global appended runtime log. |
| `data/logs/audit-<RunId>.log` | Per-run log for one pipeline execution. |
| `data/logs/archive/` | Rotated global logs. |
| `data/logs/web-audit.log` | Web UI security and operational events where enabled. |

Production deployments should collect or back up these paths according to the
customer retention policy.

## Adapter Events

Each adapter should log its lifecycle:

- Target host or platform.
- Transport type.
- Command, API action, or ingestion action being attempted.
- Start and end times.
- Exit code or success status.
- Exception details when a failure occurs.
- Contract validation result where available.

## Debugging A Failed Run

1. Identify the `RunId` from the failed run or UI event.
2. Open the matching per-run log or filter the global log by `RunId`.
3. Search for `ERROR` entries.
4. Trace backwards to the adapter start event for the affected target.
5. Confirm whether the failure was connection, execution, API response,
   ingestion, or contract validation.
6. Preserve the logs and bundle path before retrying if support review may be
   required.

## Monitoring Recommendations

Monitor for:

- Repeated login failures.
- Audit start, completion, and failure events.
- Adapter failures by transport.
- Contract validation rejections.
- Unexpected production run attempts.
- Missing or delayed evidence bundle creation.
- Log rotation and disk-capacity pressure.

## Related Guidance

- [Parallel tracing](parallel-tracing.md)
- [Runtime validation](runtime-validation.md)
- [Operations And Support Model](../../operations/operations-and-support.md)
