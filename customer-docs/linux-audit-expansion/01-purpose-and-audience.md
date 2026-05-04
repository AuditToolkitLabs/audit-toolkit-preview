# 1. Document Purpose and Audience

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-04 |
| Product | AuditToolkit Linux Security Lite |
| Release | v1.1.2 |
| Deployment model | On-premises / self-hosted |

---

## 1.1 Purpose

This document describes the service provided by AuditToolkit Linux Security
Lite when deployed within your environment. It covers expected behaviour for
operators running the tool, configuration responsibilities for administrators,
and the operational and security obligations shared between your organisation
and AuditToolkitLabs as the service provider.

It is **not** a software engineering guide; for script-level specifications
and architecture decisions refer to the internal `docs/` folder shipped with
the source distribution or release package.

## 1.2 Intended audience

| Audience | What they will find here |
| --- | --- |
| Security operations engineers | How to run audits, interpret findings, and triage FAIL and WARN results. |
| Platform and Linux administrators | How to install, configure, schedule, and maintain the toolkit. |
| Governance and compliance staff | How findings map to control frameworks, evidence produced, and audit-trail artefacts. |
| SIEM and automation engineers | How to ingest report JSON, build alerting rules, and gate CI/CD pipelines. |
| Security and assurance assessors | Authentication model, read-only design, OWASP posture, and data-handling obligations. |
| Procurement and due-diligence reviewers | Vendor contacts, licensing model, vulnerability management, and security FAQ. |

## 1.3 Conventions used

- **Customer-specific values** appear in angle brackets, e.g. `<your-host>`.
  Replace these with your actual values; do not submit them to the service
  provider in support requests.
- **Commands** are shown in code blocks. Unless noted, commands are run as
  root or with `sudo`. Non-privileged execution is supported but reduces
  coverage; see section 5.2.
- **Paths** use the default installation layout under `/opt/audit-toolkit/`.
  If you installed to a custom location, substitute accordingly.
- **Severity markers** in audit output — `[PASS]`, `[WARN]`, `[FAIL]`,
  `[SKIP]` — are defined in section 5.3.
- **Vendor contacts** (AuditToolkitLabs) are fixed addresses listed in
  section 7.4. Do not substitute your own internal contacts for them.

## 1.4 Product scope and boundaries

**In scope:**

- Read-only security auditing of Linux hosts from local system state.
- Multi-distribution support via a compatibility shim layer.
- Structured JSON report output aligned to the audit-report schema v1.0.
- CI/CD compliance gates, SIEM ingestion, and scheduled execution.

**Out of scope:**

- Automatic remediation of any finding on the target host.
- Auditing of non-Linux endpoints (macOS, network devices).
- Cloud-infrastructure assessment (AWS/Azure/GCP resource posture).
- Network-based scanning or remote code execution.
- Database assessment or application-layer penetration testing.

## 1.5 Related documentation

| Document | Location |
| --- | --- |
| Operator Runbook | `docs/OPERATOR-RUNBOOK.md` |
| Hardening Control Baseline | `docs/HARDENING-CONTROL-BASELINE.md` |
| Linux Distro Coverage Matrix | `docs/LINUX-DISTRO-COVERAGE-MATRIX.md` |
| Report Consumer Guide | `docs/REPORT-CONSUMER-GUIDE.md` |
| OWASP Security Scorecard | `docs/OWASP-SECURITY-SCORECARD.md` |
| Deployment Guide | `docs/DEPLOYMENT-GUIDE.md` |
| Troubleshooting Guide | `docs/TROUBLESHOOTING-GUIDE.md` |
| Installation Guide (customer) | `customer-docs/18-installation-guide.md` |
| Security FAQ (customer) | `customer-docs/22-security-faq.md` |
