# 12. Appendices and Reference

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-01 |
| Product | AuditToolkit Linux Security Lite |

---

## Appendix A: Key installation paths

| Path | Purpose |
| --- | --- |
| `/opt/audit-toolkit/` | Primary installation directory. |
| `/opt/audit-toolkit/orchestrator/orchestrator.sh` | Main orchestrator script. |
| `/opt/audit-toolkit/orchestrator/discovery.sh` | Inventory / discovery script. |
| `/opt/audit-toolkit/audits/linux/` | Audit script library. |
| `/opt/audit-toolkit/lib/` | Compatibility shim library. |
| `/opt/audit-toolkit/schema/audit-report.v1.schema.json` | JSON report schema. |
| `/opt/audit-toolkit/ci/validate-report-schema.py` | Schema validation helper. |
| `/usr/local/bin/audit-toolkit` | Launcher symlink. |
| `/etc/audit-toolkit/config` | Optional configuration file. |
| `/var/log/audit-toolkit/` | Default report output directory. |

## Appendix B: Common run commands

```bash
# Full automated audit with JSON output
sudo audit-toolkit --auto --json /var/log/audit-toolkit/report-$(date +%Y%m%d-%H%M%S).json

# Platform baseline only
sudo audit-toolkit --domain platform --json /tmp/platform-audit.json

# Security preset
sudo audit-toolkit --preset security --json /tmp/security-audit.json

# Discovery / inventory only
sudo bash /opt/audit-toolkit/orchestrator/discovery.sh --json > /tmp/discovery.json

# Dry run — preview what would run
audit-toolkit --auto --dry-run

# Validate a report against the schema
python3 /opt/audit-toolkit/ci/validate-report-schema.py /tmp/audit.json

# Extract a summary with jq
jq '{host:.host_identity.hostname,fail:.hardening.fail,coverage:.completeness.coverage_score}' /tmp/audit.json
```

## Appendix C: Supported distributions summary

| Distribution | Versions | Notes |
| --- | --- | --- |
| Ubuntu | 22.04, 24.04 | Fully supported; CI-validated on every release. |
| Debian | 11, 12 | Fully supported. |
| RHEL / AlmaLinux / Rocky | 8, 9 | Fully supported via dnf/yum shims. |
| Fedora | 39, 40, 41 | Fully supported. |
| openSUSE Leap / Tumbleweed | 15.x | Supported via zypper shims. |
| Alpine Linux | 3.19, 3.20 | Supported; uses apk and OpenRC shims. |
| Arch Linux | Rolling | Supported; pacman shim. |
| Void Linux | Rolling | Supported; xbps shim. |
| Gentoo | Stable | Supported; emerge shim. |

For the detailed matrix including known limitations per distro, see
`docs/LINUX-DISTRO-COVERAGE-MATRIX.md`.

## Appendix D: Support escalation data package

Include all of the following when contacting
[Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com):

```bash
# Collect OS identity
uname -a
cat /etc/os-release

# Collect toolkit version
audit-toolkit --version

# Reproduce the failing command (exact command used)
# e.g. sudo audit-toolkit --auto --json /tmp/audit.json

# Collect the exit code
echo "Exit code: $?"

# Attach the JSON report (redact hostname/IP if needed)
# Attach the terminal output (stdout + stderr)
```

Summary checklist:

- [ ] Linux distribution name, version, and kernel.
- [ ] Toolkit version.
- [ ] Exact command and full terminal output.
- [ ] Exit code.
- [ ] JSON report file (redacted if sensitive).
- [ ] Recent changes to host environment or toolkit.

## Appendix E: Glossary

| Term | Definition |
| --- | --- |
| **Audit domain** | A logical grouping of related audit checks (e.g. `platform`, `web`, `storage`). |
| **Check** | An individual read-only test that produces a `[PASS]`, `[WARN]`, `[FAIL]`, or `[SKIP]` result. |
| **Coverage score** | Percentage of expected checks that ran (non-SKIP). Range 0–100. |
| **Confidence score** | Composite score reflecting how reliable the run result is given privilege level and coverage. Range 0–100. |
| **Shim** | A compatibility wrapper in `lib/` that provides a distro-agnostic interface to package managers, service managers, and firewall tools. |
| **Orchestrator** | The meta-runner (`orchestrator.sh`) that discovers, filters, executes, and aggregates audit scripts. |
| **Schema** | The JSON contract (`audit-report.v1.schema.json`) governing the structure of all report output. |
| **SKIP reason** | The explanation of why a check was not executed (e.g. insufficient privilege, missing tool). |

## Appendix F: Related internal technical documentation

The following documents are shipped in the `docs/` directory and provide
deeper engineering-level reference:

| Document | Purpose |
| --- | --- |
| `docs/OPERATOR-RUNBOOK.md` | Operational procedures for running and managing the toolkit. |
| `docs/REPORT-CONSUMER-GUIDE.md` | How to parse and consume the JSON report in downstream systems. |
| `docs/HARDENING-CONTROL-BASELINE.md` | Full mapping of checks to control frameworks. |
| `docs/LINUX-DISTRO-COVERAGE-MATRIX.md` | Per-distro check coverage and known limitations. |
| `docs/OWASP-SECURITY-SCORECARD.md` | The toolkit's own OWASP Top 10 assessment (score: 97/100). |
| `docs/DEPLOYMENT-GUIDE.md` | Detailed deployment and configuration reference. |
| `docs/TROUBLESHOOTING-GUIDE.md` | Common error conditions and resolution steps. |
| `docs/THREAT-MODEL.md` | Threat model for the toolkit and its audit environment. |
| `docs/CIS-COVERAGE-MATRIX.md` | CIS Benchmark alignment by check. |
| `docs/INCIDENT-RESPONSE-PLAYBOOK.md` | Response steps for security incidents involving the toolkit. |
