# 1. Document Purpose and Audience

## 1.1 Purpose

This document describes the service provided by the Security Audit
Toolkit when deployed on-premises within your environment. It covers
expected behaviour for end users, configuration responsibilities for
administrators, and operational obligations shared between you (the
customer) and the service provider (AuditAdmin Labs).

It is **not** a software design document; for engineering-level
specifications please refer to the internal `docs/` folder shipped with
the source distribution.

## 1.2 Intended audience

| Audience | What they will find here |
| --- | --- |
| End users and security analysts | How to access the application, run audits, and interpret dashboards and reports. |
| Application administrators | How to manage users, configure targets, deploy agents, and schedule audits. |
| IT operations and service-management staff | How the service fits into change, incident and backup processes. |
| Security and assurance teams | Authentication options, audit logging, access-control model, data-protection responsibilities. |
| Auditors and assessors | Mapping of features to ISO/IEC 20000-1:2018 clauses and the EULA acceptance evidence model. |
| Compliance officers | Licensing tier detail, evidence of OWASP Top 10 compliance, and security scorecard. |

## 1.3 Conventions used

- **Customer-specific values** appear in angle brackets, e.g.
  `<your support email>`. These refer to the **customer's own internal**
  contacts — your service desk, security team, or patch channel.
  Replace these in your local copy of the documentation if you publish
  it internally.
- **Vendor (AuditAdmin Labs) contacts** are fixed addresses listed in
  section 7 "Operations and Support Model".
- **ISO/IEC 20000-1 clause references** are shown in italics under each
  section heading.
- **Permanent identifiers** such as `LICENSE_TIER`, `tenant_id` and
  HTTP paths are shown in code style.

## 1.4 Document scope

This document covers the Security Audit Toolkit **core server**, the
**web administration console**, the **REST API**, and the **managed and
standalone agents**. It does not cover the host operating system,
network infrastructure, or third-party systems to which the toolkit
connects.

## 1.5 Related documents

| Document | Location | Audience |
| --- | --- | --- |
| End-User Licence Agreement | `customer-docs/LICENSE-EULA.md` | All |
| Privacy Policy | `PRIVACY.md` (repository root) | All |
| Frequently Asked Questions | `FAQ.md` (repository root) | All |
| Support Policy | `SUPPORT-POLICY.md` (repository root) | All |
| Security Overview | `SECURITY.md` (repository root) | Security, compliance |
| Managed Agent User Guide | `MANAGED-AGENT-USER-GUIDE.md` (root) | Administrators |
| Standalone Agent User Guide | `STANDALONE-AGENT-USER-GUIDE.md` (root) | Administrators |
| Changelog | `CHANGELOG.md` (repository root) | Administrators, operations |
