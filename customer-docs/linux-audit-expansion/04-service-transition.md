# 4. Service Transition and Initial Setup

*ISO/IEC 20000-1:2018 clauses 8.1, 8.3*

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-01 |
| Product | AuditToolkit Linux Security Lite |

---

## 4.1 Transition objectives

Move from ad hoc manual Linux security checks to repeatable,
evidence-based audits with a standardised JSON output contract.
The transition should achieve:

- A defined set of in-scope hosts with agreed privilege model.
- At least one full successful audit run on representative hosts.
- Validated downstream ingestion of the JSON report (SIEM, CI gate, or
  storage).
- Documented exception handling for expected `[SKIP]` findings.

## 4.2 Prerequisites

Confirm the following before installation:

| Prerequisite | Minimum version / requirement |
| --- | --- |
| Bash | 4.0 or later |
| coreutils | Any modern version (cat, date, mkdir, chmod, etc.) |
| grep | POSIX-compliant grep with `-E` flag |
| sed | POSIX-compliant sed |
| findutils | find, xargs |
| procps / procps-ng | ps command |
| Root or sudo access | Recommended for full coverage |
| Storage for reports | `/var/log/audit-toolkit/` (created at install) |
| Network | Not required — all checks are local |

Optional (for CI and schema validation):

| Prerequisite | Purpose |
| --- | --- |
| Python 3.8+ | Schema validation via `ci/validate-report-schema.py` |
| jq | Report filtering and SIEM export helpers |
| shellcheck | Development linting (not needed at runtime) |

## 4.3 Installation summary

Full installation instructions with all package-format options are in
[18 — Installation Guide](18-installation-guide.md). In brief:

```bash
# Debian/Ubuntu — .deb package
sudo dpkg -i audit-toolkit-lite_1.1.4_all.deb

# RHEL/Fedora/openSUSE — .rpm package
sudo rpm -ivh audit-toolkit-lite-1.1.4-1.noarch.rpm

# Any Linux — universal tarball
tar -xzf audit-toolkit-lite-1.1.4.tar.gz
sudo bash audit-toolkit-lite-1.1.4/install.sh
```

After installation the launcher is available at
`/usr/local/bin/audit-toolkit`.

## 4.4 Recommended transition stages

### Stage 1 — Pilot (week 1–2)

1. Install on two or three non-production hosts covering your primary
   distributions.
2. Run `audit-toolkit --auto --json /tmp/audit-pilot.json` and inspect
   the output.
3. Validate the report against schema:
   `python3 /opt/audit-toolkit/ci/validate-report-schema.py /tmp/audit-pilot.json`
4. Review `[SKIP]` reasons — identify privilege gaps and document them.
5. Confirm JSON can be ingested by your downstream tooling.

### Stage 2 — Integration validation (week 3)

1. Configure a scheduled run (cron or systemd timer — see
   [16 — Scheduled Audits](16-quick-start-scheduled-audits.md)).
2. Validate SIEM ingestion (see [15 — SIEM Integration](15-quick-start-siem-integration.md)).
3. Add a CI compliance gate (see [14 — CI/CD Gate](14-quick-start-ci-cd-compliance-gate.md)).
4. Confirm alert thresholds and escalation paths.

### Stage 3 — Fleet rollout (week 4+)

1. Install on all in-scope hosts using package management or
   configuration-management tooling (Ansible, Salt, Puppet).
2. Enable scheduled runs across the fleet.
3. Establish baseline FAIL/WARN counts and coverage scores.
4. Document exceptions where permanent `[SKIP]` results are expected.

## 4.5 Readiness checklist

- [ ] Bash 4+ confirmed on all target hosts.
- [ ] Installation method chosen and tested (tarball / .deb / .rpm).
- [ ] Privilege model agreed (root recommended; sudo or unprivileged noted as risk).
- [ ] Report storage path confirmed (`/var/log/audit-toolkit/` or custom).
- [ ] Downstream ingestion endpoint validated with sample report.
- [ ] Escalation path defined for `[FAIL]` findings.
- [ ] Retention and access controls applied to report directory.
- [ ] Integration test passed in pilot environment.

## 4.6 Rollback plan

If the rollout causes unexpected operational impact:

1. Restrict scope to `--domain platform` to reduce output noise.
2. Switch to discovery-only mode (`orchestrator/discovery.sh`) for
   inventory visibility without control enforcement.
3. Increase the `[SKIP]` tolerance temporarily by running without root
   and documenting the privilege gap.
4. Re-enable full `--auto` mode after rule tuning and stakeholder sign-off.

Uninstalling the toolkit does not modify any system configuration. All
changes are limited to the install directory (`/opt/audit-toolkit/`),
the launcher symlink (`/usr/local/bin/audit-toolkit`), the config
directory (`/etc/audit-toolkit/`), and the log directory
(`/var/log/audit-toolkit/`). See [18 — Installation Guide](18-installation-guide.md)
for uninstall instructions.
