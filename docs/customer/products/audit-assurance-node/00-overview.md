# Audit Assurance Node Overview

## What it is

Audit Assurance Node produces **verifiable, tamper-evident audit evidence**. Its
value is assurance: not just running audits, but generating signed evidence
bundles that prove what was audited, when, and that the results have not been
altered since collection — a defensible chain of custody for compliance,
governance, and third-party audit.

To produce that evidence it acts as the remote execution and evidence-coordination
service for the AuditToolkit suite: it dispatches audit scripts to target hosts
through transport-neutral adapters, validates results against a defined contract,
and signs the validated results into structured evidence artefacts. See the
**Feature Guide** for the core capability.

It operates either as an integrated execution tier under Audit-Tool or as a
standalone service with local licence validation.

## Who it's for

Audit Assurance Node suits teams that must *demonstrate* audit integrity to
auditors, regulators, or customers — where running the audit is not enough and
the results themselves have to stand up to independent scrutiny. It fits
compliance and governance functions, managed service providers running audits
across customer estates, and platform teams coordinating fleet-scale audit
collection.

## Relationship to the suite

Audit Assurance Node **supports** the AuditToolkit suite; it does not replace any
part of it. It coordinates execution and packages assurance evidence — it does
not run audits on the host itself (the agents do), and it does not own reporting,
compliance scoring, asset inventory, scheduling, or multi-user/role
administration (those belong to Audit-Tool).

| Works with | Relationship |
| ---------- | ------------ |
| Audit-Tool | Central platform for reporting, scoring, scheduling, history, and identity. The node receives jobs from it and returns signed evidence — it never supersedes it. |
| Fleet / standalone / hypervisor agents | The on-host execution workers. The node dispatches jobs to them and collects their evidence; it does not replace them. |

## Primary outcomes

- Transport-neutral audit execution across SSH, WinRM, agent, and API delivery
  paths.
- Adapter contract validation to ensure all results meet a consistent, auditable
  structure before evidence is produced.
- Parallel execution across multiple target hosts within a single audit run.
- Structured JSON logging with run correlation IDs for a full audit trail and
  per-run debugging.
- Signed evidence artefact generation from validated adapter results.
- Focused operator console (single operator login) for an overview, connected
  machines, job dispatch, and assurance evidence review and export.
- Standalone or suite-integrated operation with appropriate licence scope.

## Key components

| Component | Customer-facing role |
| --------- | -------------------- |
| SSH adapter | Read-only audit execution over approved SSH sessions to Linux and Unix targets. |
| WinRM adapter | Audit execution over WinRM to Windows Server and workstation targets. |
| Agent adapter | Execution dispatch to registered AuditToolkit agents on managed hosts. |
| API adapter | Audit dispatch and result retrieval through the Audit-Tool REST API. |
| Adapter contract layer | Validates all adapter results before evidence is produced or signed. |
| Evidence pipeline | Produces structured, signed evidence artefacts from validated adapter results. |
| Execution log | JSON-structured per-run and global logs with RunId correlation for every audit event. |
| Operator console | Browser interface: overview, connected machines, job dispatch, and assurance evidence review/export. |
| CLI | `audit-assurance-node` command for direct orchestration and standalone execution. |

## Operating modes

| Mode | Description |
| ---- | ----------- |
| Suite-integrated | Operates as an execution tier under Audit-Tool, inheriting platform entitlement and API key. |
| Standalone | Operates independently with local licence validation and direct credential management. |
| MSP / multi-tenant | Remote execution limits applied per tenant or managed-customer scope. |

## Deployment and boundaries

Releases support Linux DEB (Ubuntu/Debian) and RPM (RHEL-derived, Fedora, SUSE)
packages, plus container and Windows-service runtimes. The service host must have
network reachability to all audit target systems on the required management
ports.

Customers provide and operate the host, operating system, network access, TLS
configuration, firewall rules, credential lifecycle, audit target authorisation,
and evidence retention. AuditToolkitLabs provides product releases, bug fixes,
security advisories, documentation, and support guidance for confirmed product
issues. The node does not replace customer change approval, privileged access
governance, security monitoring, or independent legal authorisation for target
inspection.
