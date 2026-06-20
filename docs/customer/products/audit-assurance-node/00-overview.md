# Audit Assurance Node Overview

## Purpose

Audit Assurance Node is the remote execution and evidence coordination service
for the AuditToolkit suite. It dispatches audit scripts to target hosts through
transport-neutral adapters, validates results against a defined contract, and
produces structured evidence artifacts for compliance, governance, and reporting
workflows.

It operates either as an integrated execution tier under Audit-Tool or as a
standalone service with local licence validation.

## Primary Outcomes

Audit Assurance Node supports:

- Transport-neutral audit execution across SSH, WinRM, agent, and API delivery
  paths.
- Adapter contract validation to ensure all results meet a consistent,
  auditable structure before evidence is produced.
- Parallel execution across multiple target hosts within a single audit run.
- Structured JSON logging with run correlation IDs for full audit trail and
  per-run debugging.
- Signed evidence artifact generation from validated adapter results.
- Web console for run history, report review, and standalone operation.
- Standalone or suite-integrated operation with appropriate licence scope.

## In-Scope Components

| Component              | Customer-facing role                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------- |
| SSH adapter            | Read-only audit execution over approved SSH sessions to Linux and Unix targets.         |
| WinRM adapter          | Audit execution over WinRM to Windows Server and workstation targets.                   |
| Agent adapter          | Execution dispatch to registered AuditToolkit agents on managed hosts.                  |
| API adapter            | Audit dispatch and result retrieval through the Audit-Tool REST API.                    |
| Adapter contract layer | Validates all adapter results before evidence is produced or signed.                    |
| Evidence pipeline      | Produces structured, signed evidence artifacts from validated adapter results.          |
| Execution log          | JSON-structured per-run and global logs with RunId correlation for every audit event.   |
| Web console            | Browser interface for run history, latest report, bundle review, and status.            |
| CLI                    | `audit-assurance-node` command for direct orchestration and standalone execution.       |

## Operating Modes

| Mode               | Description                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------- |
| Suite-integrated   | Operates as an execution tier under Audit-Tool, inheriting platform entitlement and API key. |
| Standalone         | Operates independently with local licence validation and direct credential management.        |
| MSP / multi-tenant | Remote execution limits applied per tenant or managed-customer scope.                        |

## Supported Deployment Models

Product releases support:

- Linux DEB package deployment on Ubuntu and Debian-based distributions.
- Linux RPM package deployment on RHEL-derived, Fedora, and SUSE distributions.

The service host must have network reachability to all audit target systems on
the required management ports. Production deployment should use the supported
package path for the release.

## Service Boundaries

Customers provide and operate the host, operating system, network access, TLS
configuration, firewall rules, credential lifecycle, audit target authorization,
and evidence retention.

AuditToolkitLabs provides product releases, bug fixes, security advisories,
documentation, and support guidance for confirmed product issues.

Audit Assurance Node does not replace customer change approval, privileged
access governance, security monitoring, or independent legal authorization for
target inspection.

## Licensing Relationship

When operated as part of the AuditToolkit suite, Audit Assurance Node inherits
parent entitlement from Audit-Tool. When operated standalone, it uses local
licence validation aligned to the central commercial-tier policy.

For central licensing authority, see
[Licensing Overview](../../../licensing/overview.md).

## Product-Specific Follow-Up Pages

Planned product pages include execution adapters, credential configuration,
evidence pipeline, logging and observability, standalone operation, and
operational limits.
