# Audit Assurance Node

Audit Assurance Node is a remote assurance and elevation framework with SSH,
WinRM, API, and agent adapters, transport-neutral assurance contracts,
authentication controls, logging, observability, and parallel execution tracing.

Use this product guide when planning a standalone node deployment, enabling a
new execution transport, validating adapter output, or reviewing how evidence
is traced from target execution through bundle and report handling.

## Source Material

Audit Assurance Node does not currently have a `customer-docs/` folder. The
customer library uses `audit-assurance-node/README.md` and selected files under
`audit-assurance-node/docs/` as source material.

## Product-Specific Documents

- [Overview](overview.md)
- [Deployment](deployment.md)
- [Authentication](authentication.md)
- [Adapter model](adapters.md)
- [SSH WinRM API and agent transports](ssh-winrm-api-agent-transports.md)
- [Logging and observability](logging-observability.md)
- [Parallel tracing](parallel-tracing.md)
- [Runtime validation](runtime-validation.md)
- [Operational limits](operational-limits.md)

## Customer Responsibilities

Before running Audit Assurance Node against customer systems, confirm that:

- Target hosts and platforms are authorized for audit activity.
- SSH, WinRM, API, or agent credentials are scoped to the approved audit role.
- Production execution settings, parallelism, and maintenance windows have been
  approved by the customer change process.
- Evidence bundle storage, retention, and access control match customer policy.
- Logs are monitored for adapter failures, rejected results, and execution
  anomalies.

## Common Workflows

| Workflow                                       | Start with                                                              |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| Plan a new standalone node                     | [Deployment](deployment.md)                                             |
| Choose an execution transport                  | [SSH WinRM API and agent transports](ssh-winrm-api-agent-transports.md) |
| Review the normalized result boundary          | [Adapter model](adapters.md)                                            |
| Configure secrets and access                   | [Authentication](authentication.md)                                     |
| Investigate a failed run                       | [Logging and observability](logging-observability.md)                   |
| Confirm concurrent execution behaved correctly | [Parallel tracing](parallel-tracing.md)                                 |
| Validate UI and adapter quality gates          | [Runtime validation](runtime-validation.md)                             |

## Shared Guidance

- [Customer Documentation](../../index.md)
- [Deployment](../../deployment/index.md)
- [Operations](../../operations/index.md)
- [Integrations](../../integrations/index.md)
- [Security](../../security/index.md)
