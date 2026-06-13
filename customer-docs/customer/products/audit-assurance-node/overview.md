# Audit Assurance Node Overview

## Purpose

Audit Assurance Node is a remote assurance and elevation framework for running
audits and collecting evidence through transport-specific adapters. It supports
local, SSH, WinRM, API, and agent-oriented execution patterns while keeping the
assurance contract separate from the transport layer.

The product is intended for environments where customers need controlled audit
execution, repeatable evidence collection, and traceable result handling across
mixed Windows, Linux, API, and agent-based targets.

## Primary Outcomes

Audit Assurance Node supports:

- Remote execution against approved hosts.
- Transport-neutral audit result handling.
- Parallel execution across multiple hosts.
- HMAC-backed bundle verification workflows where configured.
- Web UI execution and report review for standalone operation.
- Adapter contracts for SSH, WinRM, API, local, and agent execution modes.
- Structured per-run logging with correlation identifiers.
- Runtime validation gates for the web UI and adapter contract.

## In-Scope Components

| Component                     | Customer-facing role                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| Standalone web UI             | Browser console for login, dashboard review, audit launch, bundle history, and latest report access. |
| FastAPI runtime               | Web and API surface used by the standalone UI and runtime smoke checks.                              |
| PowerShell assurance pipeline | Executes configured audit workflows and coordinates result handling.                                 |
| Transport adapters            | Local, SSH, WinRM, API, and agent execution or ingestion boundaries.                                 |
| Adapter contract validator    | Rejects malformed transport results before evidence generation.                                      |
| Evidence bundle store         | Local evidence and report output path for completed runs.                                            |
| Logging subsystem             | Global and per-run JSON logs for operations and troubleshooting.                                     |
| Configuration profiles        | Environment-specific settings for development, test, and production operation.                       |

## Runtime Model

The product uses environment profiles for configuration. Profiles for
development, test, and production are stored under `config/environments/`, with
the active environment selected by runtime configuration or environment
variable override.

Parallel execution is controlled by configuration. A parallelism value of `1`
processes hosts sequentially. Higher values allow concurrent host execution
subject to customer approval, capacity, and operational controls.

## Standalone Web UI

The repository includes a standalone web UI for running audits and viewing
reports. In that mode, customers can launch the web application, run an audit,
and review the latest bundle or HTML report from the dashboard.

The hardened UI runtime uses FastAPI patterns, role-aware templates, signed
browser sessions, configurable UI settings, and an execution lock that prevents
overlapping audit runs from the web surface.

## Evidence And Bundle Handling

Audit bundles are stored locally under the configured evidence path. The source
README describes a verification script that locates the latest bundle, loads
production configuration, runs bundle verification, and reports verification
status.

Evidence processing depends on adapter results conforming to the shared result
contract. Invalid results are rejected before evidence generation, signing,
bundling, or reporting.

## Supported Deployment Scope

Audit Assurance Node can be run locally for development, as a standalone web
runtime, in a Docker container, with Docker Compose, or as a Windows service
using an approved service wrapper. Production deployments should use the
production environment profile, durable storage for configuration and evidence,
and customer-approved service supervision.

## Service Boundaries

Customers provide host infrastructure, network reachability, target
authorization, credential lifecycle, backup and retention controls, and
monitoring. AuditToolkitLabs provides product fixes, security patches,
documentation, and support guidance for confirmed product defects.

Audit Assurance Node does not replace customer change approval, privileged
access governance, security monitoring, or independent legal authorization for
target inspection.

## Licensing Relationship

When operated as part of the AuditToolkit suite, Audit Assurance Node inherits
parent entitlement from Audit-Tool. When operated standalone, it uses local
license validation aligned to the central commercial-tier policy.

For central licensing authority, see
[Licensing Overview](../../../licensing/overview.md).

## Product-Specific Pages

- [Deployment](deployment.md)
- [Authentication](authentication.md)
- [Adapter model](adapters.md)
- [SSH WinRM API and agent transports](ssh-winrm-api-agent-transports.md)
- [Logging and observability](logging-observability.md)
- [Parallel tracing](parallel-tracing.md)
- [Runtime validation](runtime-validation.md)
- [Operational limits](operational-limits.md)
