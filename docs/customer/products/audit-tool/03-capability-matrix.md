# Product Capability Matrix

Version: 1.0.3
Last Updated: 2026-06-20
Audience: Product, Operations, Security, Customer Success

## Purpose

This matrix is the canonical source for what the Audit Admin Toolkit supports today, where it is available, what it depends on, and what the operational limits are.

Related canonical references:

- Deployment Guide

Use this document to answer:

- Is a capability available in my deployment mode?
- What dependencies must be in place?
- Is the capability production-ready or best-effort?
- Which document is the canonical implementation guide?

---

## Availability Key

- Available: Production-supported and operationally documented
- Partial: Implemented for a subset of modes/workflows, or validation is still being completed
- Beta/Best-effort: Available with known limitations and support constraints
- Planned: Roadmap-targeted or not yet canonicalized for broad production rollout
- N/A: Not available in that mode

Deployment modes used in this matrix:

- Core Web: Main web application/API runtime
- Asset Discovery: Dedicated asset discovery service
- Agent: Fleet Agent or Standalone Agent endpoint runtime
- Appliance: VM appliance packaging of platform components

## Capability Claim Rubric (Canonical)

Use this rubric for all VM/ASPM positioning and matrix claims in repository documentation.

| Claim Level         | Meaning                                                                                                   | Minimum Evidence Standard                                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Implemented         | Capability exists in shipped code paths (endpoint, workflow, audit/script, or UI path)                    | Merged implementation with discoverable path references                                                                          |
| Validated           | Implemented capability has repeatable operational evidence for declared scope                             | Automated tests and/or CI gates plus operational docs/runbook coverage for the same scope                                        |
| Full VM/ASPM parity | End-to-end VM/ASPM capability breadth is both implemented and validated across required workflow families | Release-validated parity gates completed for discovery, vulnerability, posture, reporting, integrations, and governance evidence |

### Status-to-Rubric Mapping

- Available: Use when capability is Implemented and Validated for the declared deployment mode.
- Partial: Use when implementation and/or validation is only complete for part of the declared scope.
- Beta/Best-effort: Use when implementation exists but operational constraints or validation gaps remain.
- Planned: Use when implementation is not yet present in canonical runtime paths.

**Guardrail:** Do not claim "full VM/ASPM parity" unless the Full VM/ASPM parity criteria above are met.

---

## Capability Summary

| Domain              | Capability                                                   | Core Web                   | Asset Discovery               | Agent                               | Appliance | Status                   | Canonical Guide                             |
| ------------------- | ------------------------------------------------------------ | -------------------------- | ----------------------------- | ----------------------------------- | --------- | ------------------------ | ------------------------------------------- |
| Audit Execution     | On-demand audits                                             | Available                  | N/A                           | Available                           | Available | Available                | [Feature Guide](02-feature-guide.md)        |
| Audit Execution     | Scheduled audits                                             | Available                  | N/A                           | Available (queued/polled workflows) | Available | Available                | Audit Scheduling guide                      |
| Audit Execution     | Least-privilege Linux execution                              | Available                  | N/A                           | Available                           | Available | Available                | SSH Audit Wrapper Deployment guide          |
| Audit Execution     | Least-privilege Windows execution (JEA)                      | Available                  | N/A                           | Available                           | Available | Available                | WinRM JEA Deployment guide                  |
| Asset Inventory     | Network/host discovery                                       | Partial (integrated UX)    | Available                     | Available (push/collection mode)    | Available | Available                | Direct API Asset Discovery guide            |
| Asset Inventory     | Business metadata on assets                                  | Partial (sync view)        | Available                     | N/A                                 | Available | Available                | Direct API Asset Discovery guide            |
| Vulnerability       | CVE correlation from software inventory                      | Partial (synced outcomes)  | Available                     | N/A                                 | Available | Beta/Best-effort         | Direct API Asset Discovery guide            |
| Vulnerability       | KEV tracking visibility                                      | Partial (synced outcomes)  | Available                     | N/A                                 | Available | Beta/Best-effort         | Direct API Asset Discovery guide            |
| Posture             | Posture control evaluation on discovered assets              | Partial (via sync/results) | Available                     | N/A                                 | Available | Beta/Best-effort         | Direct API Asset Discovery guide            |
| API                 | Main platform API                                            | Available                  | N/A                           | N/A                                 | Available | Available                | API Guide                                   |
| API                 | Asset Discovery API                                          | N/A                        | Available                     | N/A                                 | Available | Available                | API Guide                                   |
| API                 | Agent API endpoints                                          | Partial                    | Partial                       | Available                           | Partial   | Available                | Agent API Reference                         |
| Reporting           | Dashboard and compliance views                               | Available                  | Partial (discovery dashboard) | N/A                                 | Available | Available                | Enhanced Reporting guide                    |
| Integrations        | SIEM administration and connection testing                   | Available                  | N/A                           | N/A                                 | Available | Available / Partial docs | SIEM Integration Guide                      |
| Integrations        | External source ingest and connector normalization           | Available                  | N/A                           | Available (push/collection mode)    | Available | Available / Partial docs | API Guide                                   |
| Integrations        | Ticketing connectors (Jira / ServiceNow)                     | Available                  | N/A                           | N/A                                 | Available | Available / Partial docs | API Guide                                   |
| Security            | MFA and SSO/OIDC                                             | Available                  | N/A                           | N/A                                 | Available | Available                | MFA Setup guide                             |
| Security            | LDAP/AD integration                                          | Available                  | N/A                           | N/A                                 | Available | Available                | LDAP Integration guide                      |
| Security            | API key management                                           | Available                  | Available                     | Available                           | Available | Available                | API Key Management guide                    |
| Operations          | Backup and restore                                           | Available                  | Partial (service DB + config) | N/A                                 | Available | Available                | Backup & Recovery guide                     |
| Operations          | Monitoring and metrics                                       | Available                  | Partial                       | Partial                             | Available | Beta/Best-effort         | Monitoring guide                            |
| Hypervisor Auditing | Hypervisor Agent (Linux — Proxmox, KVM, XCP-ng, Nutanix AHV) | N/A                        | N/A                           | Available                           | N/A       | Available                | Hypervisors Guide                           |
| Hypervisor Auditing | Hypervisor Agent (ESXi — BusyBox POSIX sh)                   | N/A                        | N/A                           | Available                           | N/A       | Available                | Hypervisors Guide                           |
| Hypervisor Auditing | Hypervisor Agent daemon (heartbeat, command dispatch)        | N/A                        | N/A                           | Available                           | N/A       | Available                | Hypervisor Agent design reference           |
| Hypervisor Auditing | Hypervisor Agent key rotation                                | N/A                        | N/A                           | Available                           | N/A       | Available                | Hypervisor API Reference                    |

---

## Sprint 1 API Capability Matrix

This section makes the platform API surface easier to reason about during Sprint 1 planning and customer preview discussions.

| API Family                 | Representative Endpoints                                                                                                                         | Auth Model                              | Primary Users                             | Current State                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- | ----------------------------------------- | --------------------------------------- |
| Health & Runtime           | `/health`, `/ready`, `/metrics`, `/api/status`                                                                                                   | mixed                                   | operators, monitoring                     | Available                               |
| Server & Target Management | `/api/servers*`, `/api/servers/find`, `/api/servers/test/{id}`                                                                                   | API key                                 | admins, automation                        | Available                               |
| Audit Execution            | `/api/execute`, `/api/async/execute`, `/api/batch/*`                                                                                             | API key                                 | operators, orchestration                  | Available / Partial docs                |
| Scheduling & Maintenance   | `/api/schedules`, `/api/v2/schedules*`, maintenance windows                                                                                      | API key                                 | operations teams                          | Available / Partial docs                |
| Asset Discovery            | scan creation, status, results, enrichment endpoints                                                                                             | API key                                 | CMDB and discovery teams                  | Available                               |
| Admin Operations           | `/api/admin/users*`, `/api/admin/audit-log`, `/api/admin/security-settings*`, `/api/admin/api-keys*`, `/api/admin/ssh-keys*`, `/api/admin/siem*` | authenticated admin role                | security admins                           | Available / Expanded in Sprint 1        |
| Standalone Agent HTTP API  | `/api/setup`, `/api/config`, `/api/run*`, `/api/jobs*`, `/api/results*`, `/api/schedules*`, `/api/system`                                        | local session / agent registration flow | standalone and standalone agent operators | Beta/Best-effort / Expanded in Sprint 1 |
| Reporting & Export         | dashboard, report, history, export endpoints, `/api/reporting/connectors*`, `/api/external-sources*`, `/api/ingest/v1*`                          | API key / authenticated UI              | auditors, reporting users                 | Available / Partial docs                |

> Use this matrix with the API Guide when deciding whether the next Sprint 1 work item should focus on documentation expansion, auth cleanup, or UX polish.

## Dependency Matrix

| Capability                  | Required Dependencies                                     | Optional Dependencies     | Hard Requirements                                      |
| --------------------------- | --------------------------------------------------------- | ------------------------- | ------------------------------------------------------ |
| Core audits (Linux)         | SSH connectivity, target credentials, audit scripts       | Wrapper-based elevation   | Target host shell tools and expected audit command set |
| Core audits (Windows)       | WinRM connectivity, account with required rights          | JEA endpoint              | PowerShell remoting enabled on targets                 |
| Scheduled execution         | Task scheduler, worker runtime, persistent store          | Queue monitoring stack    | Reliable clock/time sync and worker availability       |
| Asset discovery (SSH/WinRM) | Asset Discovery service, PostgreSQL, network reachability | Credential profiles       | Connection test must pass before scan submission       |
| Asset discovery (agent)     | Agent package, API key, outbound HTTPS                    | Managed command queue     | Agent key and endpoint registration                    |
| Vulnerability correlation   | Software inventory collection, CVE dataset                | KEV enrichment feed       | Normalized package data with versions                  |
| Backup and restore          | Storage target, backup job, restore path                  | Offsite archive           | Periodic restore verification                          |
| Monitoring                  | Metrics endpoint and collector                            | Grafana dashboards/alerts | Health endpoint coverage across services               |

---

## Platform and Environment Coverage

| Area                    | Supported Baseline                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Linux target coverage   | Major distro families including Debian/Ubuntu, RHEL derivatives, SUSE, Arch, Alpine, Gentoo, Void, NixOS, Clear Linux, Solus, Slackware |
| Windows target coverage | Windows Server and modern Windows client coverage via WinRM/PowerShell collection paths                                                 |
| Deployment models       | Native host production paths (DEB/RPM/MSI/appliance/agent-first), Docker Compose dev/test/staging, Kubernetes preview path              |
| Data stores             | PostgreSQL primary persistence, Redis where queue/caching workflows require it                                                          |

For detailed host and runtime requirements, use the Server Requirements guide, the Target Host Requirements guide, and the Deployment Guide.

---

## Operational Limits and Guardrails

| Capability                    | Guardrail                                                                 |
| ----------------------------- | ------------------------------------------------------------------------- |
| CIDR-based discovery scans    | Host expansion capped per range to prevent accidental broad scan storms   |
| API payload ingestion         | Request size limits apply to protect service memory and stability         |
| Scheduled jobs                | Must be bounded by worker capacity and maintenance windows                |
| Backup retention              | Must be aligned with storage budget and compliance retention policy       |
| Credentialed remote execution | Must use least-privilege controls and approved credential handling policy |

---

## Known Constraints

- Some capabilities are integrated through cross-service sync and are partial in the consuming surface.
- Vulnerability and posture outcomes depend on inventory fidelity and scan scope.
- Monitoring depth varies by deployment model and enabled telemetry stack.

Use the Known Limitations guide as the rolling list until the dedicated compatibility matrix is created.

---

## Commercial and Support Classification

| Classification       | Description                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| Production-supported | Covered by active runbooks, tested deployment paths, and operational troubleshooting references |
| Best-effort          | Available but still maturing in performance, UX depth, or operational diagnostics               |
| Roadmap-targeted     | Planned in documentation roadmap but not yet canonicalized                                      |

---

## Change Control

When a feature changes behavior, update all three together in one PR:

1. This capability matrix
2. Canonical implementation guide for that feature
3. The documentation index if discoverability changes

This keeps product messaging, operations usage, and support playbooks aligned.
