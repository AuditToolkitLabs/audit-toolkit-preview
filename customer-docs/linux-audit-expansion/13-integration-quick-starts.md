# 13. Integration Quick Starts

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-03 |
| Product | AuditToolkit Linux Security Lite |

---

## Overview

This section provides short, task-focused implementation paths for the most
common integration scenarios. Each quick start is self-contained and can be
completed in under 30 minutes once the toolkit is installed.

## Available quick starts

| # | Quick start | Goal |
| --- | --- | --- |
| [14](14-quick-start-ci-cd-compliance-gate.md) | CI/CD Compliance Gate | Block pipeline progression when posture thresholds are not met. |
| [15](15-quick-start-siem-integration.md) | SIEM Integration | Ingest audit findings into your SIEM for alerting and trending. |
| [16](16-quick-start-scheduled-audits.md) | Scheduled Audits | Run regular audits via cron or systemd timers with retention. |
| [17](17-quick-start-agent-mode.md) | Agent Mode | Run the lightweight local dashboard for operator status views. |

## Recommended integration order

For a typical deployment, implement integrations in this order:

1. **Scheduled audits** (Quick Start 16) — establish the continuous run
   cadence first. All other integrations depend on regular report output.
2. **Schema validation** — validate reports in the scheduler before
   downstream consumers ingest them.
3. **SIEM integration** (Quick Start 15) — centralise findings for
   alerting and long-term trending.
4. **CI/CD gate** (Quick Start 14) — add compliance checks to deployment
   pipelines for pre-production assurance.
5. **Agent mode** (Quick Start 17) — add local operator dashboards where
   needed.
6. **Enterprise operator interfaces** (Doc 24) — expose enterprise UI/API/CLI
   workflows for compliance attestations, trend tracking, SIEM export, and
   webhook automation.

```text
[Host audit run]
      |
      v
[JSON report /var/log/audit-toolkit/report-YYYYMMDD.json]
      |
      +---> [Schema validation (ci/validate-report-schema.py)]
      |
      +---> [SIEM collector / log shipper]
      |            |
      |            v
      |     [SIEM index / dashboard / alert rules]
      |
      +---> [CI/CD pipeline compliance gate]
      |            |
      |            v
      |     [Pass/Fail build gate]
      |
      +---> [Ticketing / remediation workflow]
```

## Prerequisites for all integrations

- Toolkit installed and producing valid JSON reports (confirm with
  `python3 /opt/audit-toolkit/ci/validate-report-schema.py <report>`).
- Report output directory configured with appropriate permissions.
- `jq` installed for JSON manipulation helpers.
- Python 3.8+ available for schema validation.
