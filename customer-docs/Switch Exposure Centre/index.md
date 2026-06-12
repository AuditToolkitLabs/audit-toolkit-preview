# Switch Exposure Center Customer Documentation Index

| Field | Value |
| --- | --- |
| Document version | 1.0 |
| Last updated | 2026-05-12 |
| Product | Switch Exposure Center |
| Scope | Customer-facing usage, administration, support, and security guidance |
| Source | Derived from the current product codebase and repository docs |

This index covers the customer-facing documentation set for Switch Exposure
Center. The documents are numbered in a suggested reading order, but they can
also be used independently as reference material.

## Offline reconciliation checklist

When documentation updates are made in this repository while central docs are
offline, follow this checklist:

1. Add or update an entry in `docs-sync-ledger.md`.
2. Classify the event type (`LOCAL_UPDATE`, `CENTRAL_SYNC`, or
   `RECONCILIATION`).
3. List all changed files under **Files Affected**.
4. Reconcile valid local updates to `F:/AuditProducts/AuditToolkit-Docs` when
   available.
5. Re-sync this repository from central and update the ledger status.

---

## Core product documents

| # | Document | Purpose |
| --- | --- | --- |
| 01 | [Purpose and Audience](01-purpose-and-audience.md) | Who the product is for, what it covers, and what it does not cover. |
| 02 | [Product Overview](02-product-overview.md) | Architecture, supported vendors, collection paths, and major workflows. |
| 03 | [Roles and Governance](03-roles-and-governance.md) | Operator roles, approvals, responsibilities, and change control. |
| 04 | [Service Transition](04-service-transition.md) | Onboarding steps, acceptance checks, and rollback planning. |
| 05 | [User Guide](05-user-guide.md) | Working with inventory, advisories, exposures, reports, and jobs. |
| 06 | [Administration](06-administration.md) | Configuration, connector management, advisory sources, and backups. |

## Operations and assurance documents

| # | Document | Purpose |
| --- | --- | --- |
| 07 | [Operations and Support](07-operations-and-support.md) | Health checks, logs, incidents, escalation, and support workflow. |
| 08 | [Change Management](08-change-management.md) | Safe updates, validation, maintenance windows, and rollback. |
| 09 | [Security](09-security.md) | Authentication, secrets handling, hardening, and data protection. |
| 10 | [Monitoring and Reporting](10-monitoring-and-reporting.md) | Health endpoints, alerts, audit events, and reporting cadence. |
| 11 | [Continual Improvement](11-continual-improvement.md) | Feedback loops, backlog themes, and release readiness learning. |
| 12 | [Appendices](12-appendices.md) | Glossary, key paths, troubleshooting, and support bundle guidance. |

## Quick starts and runbooks

| # | Document | Purpose |
| --- | --- | --- |
| 13 | [Integration Quick Starts](13-integration-quick-starts.md) | Overview of the available quick starts and when to use them. |
| 14 | [Quick Start - Advisory Refresh](14-quick-start-advisory-refresh.md) | Configure and run vendor advisory refresh and correlation. |
| 15 | [Quick Start - API Usage](15-quick-start-api-usage.md) | Common API calls for devices, advisories, exposures, and jobs. |
| 16 | [Quick Start - Scheduler](16-quick-start-scheduler.md) | Run recurring advisory checks with an external scheduler. |
| 17 | [Installation Guide](17-installation-guide.md) | Install, verify, and remove the product on a Linux host. |
| 18 | [Maintenance and Patching Runbook](18-maintenance-and-patching-runbook.md) | Upgrade, validation, and rollback steps for a stable release. |
| 19 | [Support Engagement Guide](19-support-engagement-guide.md) | How to contact support and what evidence to include. |
| 20 | [Operational Limits and Known Constraints](20-operational-limits-and-known-constraints.md) | Current boundaries, assumptions, and known gaps. |
| 21 | [Security FAQ](21-security-faq.md) | Procurement and due-diligence questions answered succinctly. |
| 22 | [Licensing and Legal](22-licensing-and-legal.md) | Licensing summary, acceptable use, and customer obligations. |
| 23 | [Enterprise Compliance Platform](23-enterprise-compliance-platform.md) | How the product fits broader enterprise reporting and governance workflows. |
| 24 | [Pentest and Network Scanning](24-pentest-and-network-scanning.md) | Manual pentest port scans, device recollection, and scan-reporting workflow. |
| 25 | [OWASP Security Scorecard](../SECURITY-SCORECARD.md) | Internal security scorecard and current scan summary. |
| 26 | [Security and Quality Assurance Report](26-security-and-quality-assurance-report.md) | Customer-facing consolidated report of security posture, tests undertaken, and usability confidence evidence. |
| 27 | [End User License Agreement](27-end-user-license-agreement.md) | Full EULA defining the terms of use, permitted uses, restrictions, intellectual property rights, and limitations of liability. |
| 28 | [Liability Disclaimer and Indemnity](28-liability-disclaimer-and-indemnity.md) | Comprehensive disclaimer stating use at customer's own risk, limitation of liability, indemnification obligations, and assumption of risk. |
