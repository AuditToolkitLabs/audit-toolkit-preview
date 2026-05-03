# 15. Quick Start — SIEM Integration

| Field | Value |
| --- | --- |
| Time to complete | 30–60 minutes |
| Prerequisites | Toolkit installed with scheduled runs; SIEM with JSON ingest capability; jq |

---

## Objective

Ingest audit report artefacts into your SIEM for:

- Host-level security posture trending over time.
- Alert rules on `[FAIL]` count spikes and coverage drops.
- Cross-fleet visibility and comparison.
- Compliance reporting dashboards.

## Step 1 — Verify report output

Confirm the toolkit is producing reports in the expected location:

```bash
ls -lth /var/log/audit-toolkit/
# Should show timestamped JSON files
```

## Step 2 — Normalise to a SIEM-friendly event

Extract the key fields using `jq` before shipping to avoid sending the
full inventory payload on every event:

```bash
#!/bin/bash
# siem-export.sh — extract posture summary from latest report

REPORT_DIR=/var/log/audit-toolkit
LATEST_REPORT=$(ls -t "${REPORT_DIR}"/report-*.json | head -n1)

jq '{
  event_type: "audit_posture_summary",
  tool: "audit-toolkit-linux-security-lite",
  tool_version: "1.1.0",
  generated_at: .generated_at,
  host: .host_identity.hostname,
  distro_id: .host_identity.distro_id,
  distro_version: .host_identity.distro_version,
  kernel: .host_identity.kernel_version,
  arch: .host_identity.arch,
  hardening_pass: (.hardening.pass // 0),
  hardening_warn: (.hardening.warn // 0),
  hardening_fail: (.hardening.fail // 0),
  hardening_skip: (.hardening.skip // 0),
  coverage_score: .completeness.coverage_score,
  confidence_score: .completeness.confidence_score,
  pending_security_updates: (.updates.pending_security // 0),
  vuln_high: (.vulnerabilities.summary.high // 0),
  vuln_critical: (.vulnerabilities.summary.critical // 0)
}' "${LATEST_REPORT}"
```

## Step 3 — Ship to your SIEM

### Option A — File-based log shipper (Filebeat, Fluentd, Splunk UF)

Configure your log shipper to monitor `/var/log/audit-toolkit/` for
new `.json` files and ship their contents to your SIEM index.

Filebeat example (`filebeat.yml`):

```yaml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/audit-toolkit/report-*.json
    json.keys_under_root: true
    json.add_error_key: true
    tags: ["audit-toolkit", "linux-security"]

output.elasticsearch:
  hosts: ["https://<your-elk-host>:9200"]
  index: "audit-toolkit-%{+yyyy.MM}"
```

### Option B — Direct HTTP shipping (Splunk HEC, Elastic API)

Ship the normalised summary event directly after each run:

```bash
#!/bin/bash
# Post the posture summary to Splunk HEC
SUMMARY=$(bash /opt/audit-toolkit/siem-export.sh)
curl -s -X POST \
  "https://<splunk-host>:8088/services/collector/event" \
  -H "Authorization: Splunk <your-hec-token>" \
  -H "Content-Type: application/json" \
  --data "{"sourcetype": "audit_toolkit", "event": ${SUMMARY}}"
```

### Option C — syslog forwarding

Send the normalised JSON as a syslog message using `logger`:

```bash
SUMMARY=$(bash /opt/audit-toolkit/siem-export.sh)
logger -t audit-toolkit -p local0.info "${SUMMARY}"
```

Configure your syslog daemon to forward `local0` to your SIEM.

## Step 4 — Build alert rules

Recommended alert rules in your SIEM:

| Alert | Condition | Severity |
| --- | --- | --- |
| FAIL findings present | `hardening_fail > 0` | Medium |
| FAIL spike | `hardening_fail increased by > 3 vs. prior run` | High |
| Coverage drop | `coverage_score < 70` | Medium |
| Missing report | No new event from a host in > 25 hours | High |
| Critical vulnerabilities | `vuln_critical > 0` | High |
| Pending security updates | `pending_security_updates > 10` | Medium |

## Step 5 — Build a dashboard

Suggested panels for a SIEM posture dashboard:

- **Fleet overview**: table of hosts with latest coverage score, FAIL count, and timestamp.
- **FAIL trend**: time-series chart of `hardening_fail` per host.
- **Coverage trend**: time-series chart of `coverage_score` per host.
- **Pending updates**: bar chart of `pending_security_updates` per host.
- **Top failing controls**: table of the most common `[FAIL]` check names across the fleet.

## Notes

- The full JSON report contains the complete `hardening.checks[]` array
  with per-check detail. Ship the full report for deep-dive forensic
  capability; use the summary event for alerting and trending.
- Always preserve the original report on the source host for at least
  90 days even after shipping to the SIEM.
- Redact `host_identity.hostname` and IP fields before shipping reports
  across security boundaries if required by your data-classification policy.
