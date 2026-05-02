# 10. Performance Monitoring and Reporting

*ISO/IEC 20000-1 clauses 8.9, 9.1*

## 10.1 Built-in reporting

The Security Audit Toolkit provides the following built-in report
types:

| Report | Description | Access |
| --- | --- | --- |
| **Host security summary** | Pass / warn / fail counts for a single target at a point in time | All roles |
| **Fleet posture report** | Aggregate scores across all targets | Operator, admin |
| **Findings drill-down** | All FAIL and WARN findings with remediation notes | Operator, admin |
| **Trend report** | Score changes over a configurable time window | Operator, admin |
| **Scheduled report** | Any of the above delivered on a schedule via email or webhook | Admin configures; all roles can receive |
| **Audit log export** | Export of security-relevant events for archiving | Admin only |

Reports can be exported as **PDF**, **CSV**, or **JSON**.

## 10.2 Application health monitoring

The application exposes a health endpoint that returns the current
operational status:

```bash
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "database": "connected",
  "scheduler": "running",
  "version": "<x.y.z>"
}
```

Use this endpoint with your monitoring tool (Nagios, Zabbix, Prometheus,
Uptime Kuma, etc.) to alert on application unavailability.

## 10.3 Prometheus metrics

The application exposes Prometheus-compatible metrics at
`/metrics` (requires `admin` API key). Key metrics:

| Metric | Description |
| --- | --- |
| `audit_runs_total` | Counter of completed audit runs |
| `audit_failures_total` | Counter of audits that returned at least one FAIL |
| `active_targets` | Gauge of registered audit targets |
| `scheduled_scans_pending` | Gauge of scans waiting to run |
| `api_requests_total` | HTTP request counter by endpoint and status code |
| `db_query_duration_seconds` | Histogram of database query latency |

A sample Grafana dashboard definition is available in the `grafana/`
directory of the repository.

## 10.4 Log locations

| Component | Log location |
| --- | --- |
| Web application (Linux) | `journalctl -u audit-toolkit` or `/var/log/audit-toolkit/app.log` |
| Web application (Windows) | `%ProgramData%\AuditToolkit\logs\app.log` and Event Viewer |
| Celery scheduler (Linux) | `journalctl -u audit-toolkit-worker` |
| Agent | `/var/log/audit-toolkit-agent/agent.log` (Linux), `%ProgramData%\AuditToolkitAgent\logs\` (Windows) |
| Nginx / reverse proxy | `/var/log/nginx/access.log`, `/var/log/nginx/error.log` |

Log rotation is configured by the installer. Default retention is
14 days for application logs.

## 10.5 Alerting thresholds

Alerts can be configured in **Admin → Alerts** on the following
conditions:

| Condition | Example threshold |
| --- | --- |
| Host security score drops below threshold | Score < 70 (grade C) |
| New FAIL finding on a target | Any FAIL on production servers |
| Agent offline for more than N minutes | 60 minutes |
| Scheduled scan did not complete | Any missed run |
| Database backup not completed within N hours | 25 hours |
| Licence server count within N% of limit | 90% |

## 10.6 Capacity planning

Monitor the following metrics to plan resource upgrades before limits
are reached:

| Metric | Warning threshold | Action |
| --- | --- | --- |
| Disk used for audit results | 80% of allocated disk | Reduce retention period or add storage |
| Memory usage | > 80% sustained | Increase host RAM |
| Database size | > 80% of available disk | Add tablespace or increase volume |
| Celery queue depth | > 100 pending tasks | Add a worker process |

See section 24 for the full operational limits table.
