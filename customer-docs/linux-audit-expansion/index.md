# AuditToolkit Linux Security Lite — Customer Documentation Index

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-03 |
| Product | AuditToolkit Linux Security Lite |
| Release | v1.1.0 |
| Vendor | AuditToolkitLabs |
| Vendor contact | [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com) |

This index covers all customer-facing documentation for AuditToolkit
Linux Security Lite version 1.1.0. Documents are numbered to reflect
the recommended reading order; you do not need to read every document
before using the toolkit.

---

## Core service documents

| # | Document | Purpose |
| --- | --- | --- |
| 01 | [Purpose and Audience](01-purpose-and-audience.md) | Who this toolkit is for; scope; conventions. |
| 02 | [Service Overview](02-service-overview.md) | Architecture; supported distributions; run modes; output contract. |
| 03 | [Roles and Governance](03-roles-and-governance.md) | Operating roles; RACI; governance cadence. |
| 04 | [Service Transition](04-service-transition.md) | Onboarding prerequisites; transition stages; rollback. |
| 05 | [End-User Guide](05-end-user-guide.md) | CLI reference; reading results; common tasks. |
| 06 | [Administration](06-administration.md) | Configuration; upgrade; retention; access controls. |

## Operations and security documents

| # | Document | Purpose |
| --- | --- | --- |
| 07 | [Operations and Support](07-operations-and-support.md) | Support RACI; incident management; contacts. |
| 08 | [Change Management](08-change-management.md) | Change types; upgrade responsibilities; rollback; schema policy. |
| 09 | [Security, Access and Data Protection](09-security.md) | Security principles; privilege model; hardening; OWASP. |
| 10 | [Monitoring and Reporting](10-monitoring-and-reporting.md) | Health signals; SIEM fields; KPIs; reporting cadence. |
| 11 | [Continual Improvement](11-continual-improvement.md) | Improvement cadence; feedback channels; backlog themes. |
| 12 | [Appendices](12-appendices.md) | Key paths; glossary; command reference; escalation package. |

## Integration quick starts

| # | Document | Purpose |
| --- | --- | --- |
| 13 | [Integration Quick Starts — Overview](13-integration-quick-starts.md) | Integration architecture; recommended order; prerequisites. |
| 14 | [Quick Start — CI/CD Compliance Gate](14-quick-start-ci-cd-compliance-gate.md) | Block pipeline on posture failure; threshold evaluation script; GitHub Actions example. |
| 15 | [Quick Start — SIEM Integration](15-quick-start-siem-integration.md) | Export, normalise, and ship audit events; Filebeat, Splunk HEC, syslog. |
| 16 | [Quick Start — Scheduled Audits](16-quick-start-scheduled-audits.md) | Cron, systemd timer, and Ansible scheduling examples; retention. |
| 17 | [Quick Start — Agent Mode](17-quick-start-agent-mode.md) | Standalone agent dashboard; SSH tunnel guidance. |

## Installation, maintenance, and support

| # | Document | Purpose |
| --- | --- | --- |
| 18 | [Installation Guide](18-installation-guide.md) | .deb, .rpm, and tarball install procedures; post-install verification; uninstall. |
| 19 | [Maintenance and Patching Runbook](19-maintenance-and-patching-runbook.md) | Upgrade checklist; pilot procedure; rollback; log retention. |
| 20 | [Support Engagement Guide](20-support-engagement-guide.md) | When and how to contact AuditToolkitLabs; diagnostic data; contact directory. |
| 21 | [Operational Limits and Known Constraints](21-operational-limits-and-known-constraints.md) | Distro support matrix; privilege-level impact; performance; known limitations. |
| 22 | [Security FAQ — Procurement and Due Diligence](22-security-faq.md) | Read-only design; data collected; OWASP posture; supply chain; vulnerability management. |
| 23 | [Licensing, Legal Terms, and Acceptable Use](23-licensing-and-legal.md) | Licensing model (free/commercial tiers); EULA summary; disclaimer; pre-use change control requirements; Provider contact. |
| 24 | [Enterprise Compliance Platform](24-enterprise-compliance-platform.md) | Enterprise feature model, UI/API/CLI controls, reporting and integration workflows. |

## Legal documents

| # | Document | Purpose |
| --- | --- | --- |
| L1 | [Software License](/documentation/legal-license) | Canonical BSL 1.1 license — legally binding. Free for all internal use; commercial license required for service-provision, SaaS, or embedded-product scenarios. |
| L2 | [End User Licence Agreement (EULA)](/documentation/legal-eula) | End-user legal agreement covering use rights, indemnification, warranty disclaimer, and limitation of liability. |
| L3 | [Disclaimer](/documentation/legal-disclaimer) | Warranty disclaimer, user responsibility for remediation scripts, limitation of liability. |
| 23 | [Licensing, Legal Terms, and Acceptable Use](23-licensing-and-legal.md) | Customer-facing summary: licensing model, acceptable use, pre-use approval requirements, Provider details. |

---

## Vendor support contacts

**AuditToolkitLabs**
4th Floor, Silverstream House, 45 Fitzroy Street, London W1T 6EB
Telephone: +44 (0) 20 8090 9610

| Purpose | Address |
| --- | --- |
| General / account / commercial | [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com) |
| Product support and defects | [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com) |
| Security vulnerabilities | [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com) |
| Licensing and contracts | [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com) |

Full engagement guide: [20 — Support Engagement Guide](20-support-engagement-guide.md)
