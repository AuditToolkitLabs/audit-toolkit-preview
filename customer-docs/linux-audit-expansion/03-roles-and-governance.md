# 3. Roles, Responsibilities and Governance

*ISO/IEC 20000-1:2018 clauses 5.1, 7.1*

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-01 |
| Product | AuditToolkit Linux Security Lite |

---

## 3.1 Operating roles

| Role | Typical job title | Responsibilities |
| --- | --- | --- |
| **Platform Owner** | Head of Platform Engineering | Approves the supported distro profile and baseline control policy. Signs off exceptions. |
| **Security Owner** | CISO / Security Manager | Defines control expectations, acceptable risk thresholds, and escalation criteria for FAIL findings. |
| **Operations Engineer** | Linux Ops / SecOps Engineer | Schedules and runs audits, monitors run health, triages FAIL and WARN findings, maintains report retention. |
| **Integration Engineer** | DevSecOps / Automation Engineer | Integrates report artefacts into SIEM, CI/CD gates, and ticketing workflows. |
| **Auditor / Assessor** | Internal Audit / GRC | Consumes JSON evidence and control-mapping documents for assurance activities. |
| **Toolkit Administrator** | Linux Administrator | Installs, updates, and configures the toolkit. Manages execution environment and report storage. |

## 3.2 RACI matrix

R = Responsible, A = Accountable, C = Consulted, I = Informed

| Activity | Platform Owner | Security Owner | Operations Eng | Integration Eng | Toolkit Admin |
| --- | --- | --- | --- | --- | --- |
| Define baseline control policy | A | R | C | I | I |
| Select supported distributions | A | C | R | I | C |
| Install and upgrade toolkit | I | I | I | I | R/A |
| Schedule and run audits | I | I | R/A | I | C |
| Triage FAIL findings | I | A | R | I | C |
| Maintain SIEM/CI integrations | I | C | I | R/A | I |
| Review governance evidence | A | R | C | I | I |
| Manage report retention | I | A | R | I | R |
| Escalate defects to vendor | I | C | I | I | R/A |

## 3.3 Governance cadence

| Cadence | Activity |
| --- | --- |
| Daily | Monitor scheduled-run health and artifact generation success. |
| Weekly | Review FAIL/WARN trends. Validate coverage score has not degraded. |
| Monthly | Control-baseline review against operational realities and distro exceptions. |
| Quarterly | Schema and integration regression validation. Roadmap alignment review. |
| On release | Review CHANGELOG, update toolkit, re-validate CI gate thresholds. |

## 3.4 Evidence and traceability

Use these artefacts for governance evidence packages:

- **JSON audit reports** — timestamped output from every orchestrator run.
- **Hardening Control Baseline** (`docs/HARDENING-CONTROL-BASELINE.md`) —
  maps each `[PASS]`/`[FAIL]`/`[WARN]` check to its control reference.
- **CIS/NIST Coverage Matrix** (`docs/CIS-COVERAGE-MATRIX.md`) — shows
  alignment to CIS Benchmarks and NIST SP 800-53 controls.
- **CI execution history** — pipeline runs in `.github/workflows/ci.yml`
  provide a continuous test record across all supported distributions.
- **OWASP Security Scorecard** (`docs/OWASP-SECURITY-SCORECARD.md`) —
  vendor-maintained evidence of the toolkit's own security posture.

## 3.5 Policy framework

Recommended policy positions:

| Finding severity | Policy position |
| --- | --- |
| `[FAIL]` | Mandatory remediation ticket. Risk owner sign-off required to defer. |
| `[WARN]` | Advisory. Risk owner decision required within the next review cycle. |
| `[SKIP]` | Document the skip reason as a risk statement. Privilege or tooling gap is acceptable with evidence. |
| `[PASS]` | Evidence of control effectiveness. Retain for audit trail. |

Treat persistent `[SKIP]` patterns as a signal to review the execution
model (privileged vs. unprivileged) or to request an exception from the
Platform Owner.
