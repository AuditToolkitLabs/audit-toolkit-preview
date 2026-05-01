# 10. Performance Monitoring and Reporting

*ISO/IEC 20000-1:2018 clauses 8.1, 9.1, 9.2*

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-01 |
| Product | AuditToolkit Linux Security Lite |

---

## 10.1 What to monitor

### Execution health

| Signal | How to collect | Healthy state |
| --- | --- | --- |
| Scheduled job success / failure | Exit code from cron or systemd | 0 (success) on every scheduled run. |
| Report file creation | File modification timestamp | New file present after each run. |
| Report file size | `ls -lh` on report directory | Non-zero; typically 10–500 KB depending on installed package count. |
| Audit run duration | `time audit-toolkit ...` or cron log timestamps | Consistent with baseline; spike may indicate host load or a hung check. |

### Report quality

| Signal | JSON path | Target |
| --- | --- | --- |
| Schema validation pass | (run `ci/validate-report-schema.py`) | 100% pass on all generated reports. |
| Coverage score | `.completeness.coverage_score` | ≥ 80 for privileged runs. |
| Confidence score | `.completeness.confidence_score` | ≥ 70 for meaningful posture assessment. |
| SKIP count trend | `.hardening.skip` | Stable or decreasing; investigate sudden increases. |

### Security outcome signals

| Signal | JSON path | Alert threshold |
| --- | --- | --- |
| FAIL count | `.hardening.fail` | > 0 triggers review; spike triggers P2 incident. |
| Pending security updates | `.updates.pending_security` | > 0 should generate a patch task. |
| High vulnerability count | `.vulnerabilities.summary.high` | Organisation-defined threshold. |
| Coverage score drop | `.completeness.coverage_score` | Drop > 15 points vs. prior run. |

## 10.2 Monitoring integration

### Systemd journal

If using a systemd timer for scheduled runs, execution output is captured
in the journal:

```bash
journalctl -u audit-toolkit.service --since "24 hours ago"
```

### Log file monitoring

Direct cron output to a log file and monitor with your standard log
management tooling:

```bash
# Example crontab entry
0 2 * * * audit-toolkit --auto --json /var/log/audit-toolkit/report-$(date +%Y%m%d-%H%M).json   >> /var/log/audit-toolkit/cron.log 2>&1
```

### SIEM integration

See [15 — SIEM Integration](15-quick-start-siem-integration.md) for the
full integration pattern. Key fields to index:

```
host_identity.hostname
host_identity.distro_id
host_identity.kernel_version
generated_at
hardening.pass
hardening.warn
hardening.fail
hardening.skip
completeness.coverage_score
completeness.confidence_score
updates.pending_security
```

## 10.3 Reporting cadence

| Cadence | Report type | Audience |
| --- | --- | --- |
| Daily | Execution health summary (run success, coverage score, FAIL count) | Operations Engineer |
| Weekly | Security posture summary (FAIL/WARN trends, pending updates) | Security Owner |
| Monthly | Governance review (control coverage, exception register, skip trends) | Platform Owner, Security Owner |
| Quarterly | Compliance evidence package (JSON artefacts, coverage scores, control mapping) | Auditor / Assessor |

## 10.4 Suggested KPIs

| KPI | Target |
| --- | --- |
| Scheduled run success rate | 100% |
| Schema validation pass rate | 100% |
| Coverage score (privileged runs) | ≥ 90 |
| Coverage score (sudo runs) | ≥ 80 |
| Platform baseline execution across fleet | 100% of in-scope hosts |
| Mean time to triage a `[FAIL]` finding | ≤ 2 business days |
| Open `[FAIL]` findings older than 30 days | 0 (or documented exceptions) |
