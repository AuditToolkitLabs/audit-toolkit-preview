# 36. Release Deployable Security Gate and OWASP Note

*For release managers, customer security reviewers, and procurement assurance teams.*

| Field | Value |
| --- | --- |
| Document version | 1.0 |
| Assessment date | 2026-05-15 |
| Release scope | Deployable server bundle only |
| Service name | CMDB API Data Collection Tool |
| Deployment model | On-Site / On-Premises |
| Evidence artifacts | `reports/release-gate/RELEASE-GATE-SUMMARY.md`, `reports/SECURITY-COMBINED-REPORT.md` |

---

## Scope Definition (What Is Actually Shipped)

Release gate scope includes only Python paths staged into customer-installable
server artifacts:

- `app/`
- `db/`
- `scripts/`
- `managed_agent/`
- `run.py`
- `celery_worker.py`

Excluded from deployable gate scope:

- developer local virtual environments (for example `.venv/`)
- repository test code (`tests/`)
- transient build folders

These excluded paths remain visible in the full-workspace raw scan and are
reported separately for transparency.

---

## Release Gate Result (Deployable Scope)

> ✅ **PASS**
>
> CodeQL findings: **0**
>
> Bandit findings: **0** (no High / Medium / Low warnings in deployable scope)
>
> Release blockers: **0**

---

## OWASP Scorecard Release Note

This release-scope gate supports the OWASP Top 10 scorecard posture as follows:

- **A01–A10 status for deployable scope:** no open CodeQL findings
- **Operational SAST gate status:** no open Bandit findings in deployable scope
- **Release criterion met:** zero blocker findings in shipped code paths

Important governance note:

- Full-workspace scans may show additional findings in third-party package
  test code and local development paths.
- Those findings are retained for audit transparency and are not evidence of
  customer-shipped exploitability.

---

## Evidence for Customer Security Review

Provide these artifacts in release assurance packs:

1. `reports/release-gate/RELEASE-GATE-SUMMARY.md`
2. `reports/SECURITY-COMBINED-REPORT.md`
3. `reports/codeql_final.sarif`
4. `reports/release-gate/bandit_release.json`

These files together show:

- raw full-workspace visibility (unfiltered transparency)
- deployable-only gate status (customer-installable scope)
- OWASP-aligned release decision traceability
