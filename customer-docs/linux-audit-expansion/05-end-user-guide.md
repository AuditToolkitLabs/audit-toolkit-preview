# 5. End-User Guide

*ISO/IEC 20000-1:2018 clauses 8.1, 8.7*

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-01 |
| Product | AuditToolkit Linux Security Lite |

---

## 5.1 Overview

AuditToolkit Linux Security Lite is a command-line tool. There is no web
interface. All interaction is via the `audit-toolkit` command (installed to
`/usr/local/bin/audit-toolkit`) or by invoking the orchestrator directly:

```bash
audit-toolkit [OPTIONS]
# or equivalently:
bash /opt/audit-toolkit/orchestrator/orchestrator.sh [OPTIONS]
```

Root or sudo access is strongly recommended. The tool runs without root but
checks that require elevated privilege will be marked `[SKIP]` and excluded
from the coverage score.

## 5.2 Command reference

### Core options

| Option | Description |
| --- | --- |
| `--auto` | Detect installed software and run matching audits automatically. |
| `--domain <name>` | Run only audits in the named domain (`platform`, `web`, `data`, `apps`, `storage`, `network`, `automation`). |
| `--preset <name>` | Run a pre-defined audit selection (`baseline`, `security`, `full`). |
| `--match <pattern>` | Run only audit scripts whose path matches the pattern string. |
| `--exclude <pattern>` | Exclude audit scripts whose path matches the pattern. |
| `--json <path>` | Write the JSON report to the specified file path. |
| `--dry-run` | Print the audit scripts that would run, without executing them. |
| `--interactive` | Present an interactive selection menu (requires `fzf` or fallback menu). |
| `--path <dir>` | Run only audits under the specified directory path. |

### Common invocations

```bash
# Full automated run with JSON output
sudo audit-toolkit --auto --json /var/log/audit-toolkit/report-$(date +%Y%m%d-%H%M%S).json

# Platform baseline only (low noise, good for initial runs)
sudo audit-toolkit --domain platform --json /tmp/platform-audit.json

# Security-focused preset
sudo audit-toolkit --preset security --json /tmp/security-audit.json

# Dry run — see what would execute without running
audit-toolkit --auto --dry-run

# Discovery only (no hardening checks)
bash /opt/audit-toolkit/orchestrator/discovery.sh --json > /tmp/discovery.json

# Validate report against schema
python3 /opt/audit-toolkit/ci/validate-report-schema.py /tmp/platform-audit.json
```

## 5.3 Understanding audit output

Each check produces a one-line result with a severity marker:

| Marker | Meaning |
| --- | --- |
| `[PASS]` | Check completed and the control is satisfied. |
| `[WARN]` | Check completed but the control is partially or marginally satisfied. Investigate. |
| `[FAIL]` | Check completed and the control is not satisfied. Remediation recommended. |
| `[SKIP]` | Check could not run (insufficient privilege, missing tool, or inapplicable to this OS). |

At the end of each domain run, a summary table shows totals per marker.

## 5.4 Reading the JSON report

Review the JSON report in this recommended order:

1. **`completeness.confidence_score`** — overall confidence in the run.
   Below 60 suggests significant privilege or coverage gaps.
2. **`completeness.coverage_score`** — percentage of expected checks that
   ran (non-SKIP). Target ≥ 80 for a meaningful posture assessment.
3. **`hardening.fail`** — count of `[FAIL]` checks. Each represents a
   control gap that should be reviewed.
4. **`hardening.warn`** — count of `[WARN]` checks. Review against your
   risk tolerance.
5. **`updates.pending_security`** — count of pending security updates
   detected by the package manager.
6. **`vulnerabilities.summary`** — summary of CVE-related findings.
7. **`completeness.skip_reasons`** — list of reasons checks were skipped.
   Common causes: unprivileged execution, missing tool (e.g. `auditd`
   not installed), or check not applicable to this distribution.

Example: extract key summary fields with `jq`:

```bash
jq '{
  host: .host_identity.hostname,
  distro: .host_identity.distro_id,
  coverage: .completeness.coverage_score,
  confidence: .completeness.confidence_score,
  pass: .hardening.pass,
  warn: .hardening.warn,
  fail: .hardening.fail,
  skip: .hardening.skip,
  pending_updates: .updates.pending_security
}' /var/log/audit-toolkit/report-latest.json
```

## 5.5 Common tasks

### Run a quick check on this host

```bash
sudo audit-toolkit --domain platform --json /tmp/quick-check.json
cat /tmp/quick-check.json | jq '.hardening'
```

### Check for pending security updates

```bash
sudo audit-toolkit --match updates --json /tmp/updates.json
jq '.updates' /tmp/updates.json
```

### Review SSH hardening posture

```bash
sudo audit-toolkit --match ssh --json /tmp/ssh-audit.json
jq '.hardening.checks[] | select(.name | test("ssh"; "i"))' /tmp/ssh-audit.json
```

### List all available audit scripts

```bash
find /opt/audit-toolkit/audits -name "*.sh" | sort
```

## 5.6 Common issues

| Symptom | Likely cause | Action |
| --- | --- | --- |
| Most checks are `[SKIP]` | Running without root | Re-run with `sudo`; see section 5.2. |
| `Coverage score` is very low | Privilege gap or missing tools | Review `skip_reasons` in the JSON. |
| `command not found: audit-toolkit` | Toolkit not installed, or not in `PATH` | Confirm install with `ls /usr/local/bin/audit-toolkit`. |
| JSON report is empty or malformed | Write permission denied on output path | Check permissions on the output directory. |
| Report fails schema validation | Older schema consumer | Confirm `ci/validate-report-schema.py` matches the installed schema version. |
| `[FAIL]` on a control you believe is compliant | Check logic or distro-specific variation | Review the individual audit script and raise a support ticket if the logic is incorrect. |

If a problem persists after self-service steps, collect the diagnostic
package described in section 12 Appendix D and contact
[Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com).
