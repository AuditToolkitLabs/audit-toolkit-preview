# 38. Website Security Trust Brief (Production Scope)

*Short-form customer messaging for website, sales, and procurement use.*

---

## CMDB API Data Collection Tool v1.0.1: Production Security You Can Verify

CMDB API Data Collection Tool v1.0.1 is released with a production-scoped
security gate tied directly to the artifacts customers install.

### What this means for customers

- Security validation targets shipped runtime code, not non-production files.
- Release publication is blocked automatically if production security checks fail.
- Installers and packages are produced only after test and security gates pass.
- Security and quality checks are repeatable and version-traceable.

---

## Production Scope Covered

This trust brief covers only customer-visible, installable deliverables and
runtime paths.

### Included runtime code scope

- `app/`
- `db/`
- `scripts/`
- `managed_agent/`
- `run.py`
- `celery_worker.py`

### Included installable artifacts (v1.0.1)

- Linux server packages (`.deb`, `.rpm`)
- Windows server installer (`.msi`)
- Windows agent installer and portable package
- Linux, macOS, and BSD agent packages
- Linux and Windows targeted update bundles

---

## Production Security and Quality Position

For v1.0.1 production scope:

- Deployable-scope CodeQL blockers: 0
- Deployable-scope Bandit MEDIUM/HIGH blockers: 0
- Release-gate decision: PASS

This is supported by CI-enforced test, security, and release packaging stages.

---

## Website Copy Snippet

CMDB API Data Collection Tool v1.0.1 is released through a production-scoped,
CI-enforced security gate that validates shipped runtime code and installable
artifacts. Releases are automatically blocked on production security failures,
providing customers with verifiable security and quality assurance at each
version.

---

## Reference Documents

- [Production Security Status Report](37-production-security-status-report.md)
- [Release Deployable Security Gate](36-release-deployable-security-gate.md)
- [Security FAQ — Procurement and Due Diligence](33-security-faq.md)
