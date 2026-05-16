# 37. Production Security Status Report (v1.0.1)

*Customer-facing security and quality summary for procurement, risk, and
technical assurance teams.*

---

## Executive Summary

The CMDB API Data Collection Tool v1.0.1 release passed the production
release security gate for deployable code and shipped artifacts.

- Release version: v1.0.1
- Security gate outcome: PASS
- Deployable-scope CodeQL findings: 0
- Deployable-scope Bandit findings (MEDIUM/HIGH): 0
- Release packaging outcome: PASS (artifacts published)

This report is intentionally limited to production-relevant code and customer
deliverables only.

---

## Scope Statement (Production Only)

This report covers only code and assets that customers download, install,
and run in production.

### In scope

- Runtime application paths:
  - `app/`
  - `db/`
  - `scripts/`
  - `managed_agent/`
  - `run.py`
  - `celery_worker.py`
- Installable release packages and update bundles
- Shipped agent binaries and installers

### Out of scope

- Unit/integration test files
- Local development environments and temporary build files
- CI helper files not present in shipped runtime artifacts
- Non-shipped repository content

---

## Customer-Installable Release Artifacts (v1.0.1)

The following artifacts are published for customer use:

- `cmdb-tool_1.0.1_amd64.deb`
- `cmdb-tool-1.0.1-1.x86_64.rpm`
- `cmdb-tool-windows-server-installer-x64-1.0.1.msi`
- `cmdb-agent-windows-installer-x64-1.0.1.msi`
- `cmdb-agent-windows-portable-x64-1.0.1.zip`
- `cmdb-agent-linux-x64-1.0.1.tar.gz`
- `cmdb-agent-macos-x64-1.0.1.tar.gz`
- `cmdb-agent-macos-arm64-1.0.1.tar.gz`
- `cmdb-agent-freebsd-x64-1.0.1.tar.gz`
- `cmdb-agent-openbsd-x64-1.0.1.tar.gz`
- `cmdb-tool-update-linux-1.0.1.tar.gz`
- `cmdb-tool-update-windows-1.0.1.zip`
- `apply_targeted_update.py`

---

## Security Verification for Production Scope

### Static analysis gates

- CodeQL: production scope evaluated and passed release gate
- Bandit: production scope evaluated and passed release gate
- Release policy enforcement: release blocked automatically on gate failure

### Result for v1.0.1

- Deployable-scope CodeQL blockers: 0
- Deployable-scope Bandit MEDIUM/HIGH blockers: 0
- Production release decision: APPROVED

---

## Production Security Controls Customers Receive

Customers receive the following production security attributes in the shipped
application:

- Encrypted handling of sensitive credential material
- API authentication and access control controls
- Input validation and guarded error handling for API operations
- Audit logging support for operational and administrative events
- TLS-ready deployment model via reverse-proxy termination pattern
- Release-time automated security gate for deployable code paths

---

## Quality and Release Integrity

- Test gate: release workflow runs test suite before packaging
- Security gate: release workflow enforces deployable-scope security checks
- Packaging gate: artifacts are built only after validation stages
- Published assets: installers, packages, and update bundles are generated
  from validated release workflows

---

## Customer Assurance Positioning (Website-Ready)

CMDB API Data Collection Tool v1.0.1 is released with a production-scoped,
evidence-backed security gate and validated installable artifacts.

Key assurance points:

- Security checks target what customers actually run
- Gate failures automatically prevent release publication
- The delivered package set is verified through CI release workflow
- Security and quality checks are repeatable and version-tied

---

## Usage Note for Procurement and Security Review

Use this report as the concise production-security summary for:

- Security questionnaires
- Procurement due-diligence packs
- Website trust and assurance messaging
- Customer onboarding security briefings

For additional technical detail, see:

- [Security FAQ — Procurement and Due Diligence](33-security-faq.md)
- [Detailed Security Assessment Report](35-detailed-security-assessment.md)
- [Release Deployable Security Gate](36-release-deployable-security-gate.md)
