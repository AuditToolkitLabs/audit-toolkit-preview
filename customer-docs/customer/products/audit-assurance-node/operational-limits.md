# Audit Assurance Node Operational Limits

## Purpose

This page documents operational guardrails customers should apply when using
Audit Assurance Node in standalone or suite-connected deployments.

## Scope Limits

Audit Assurance Node coordinates audit execution and evidence handling. It does
not grant permission to inspect targets, replace customer privileged-access
governance, or validate that a target is legally in scope. Customers remain
responsible for authorization, change approval, and target ownership checks.

## Concurrency Limits

Parallelism increases load on the node, the network, and target systems. Treat
parallelism as an operational control, not just a performance setting.

Recommended practice:

- Start with sequential execution for new environments.
- Increase concurrency gradually after reviewing logs and target behavior.
- Do not run broad parallel audits without a maintenance window.
- Monitor target CPU, memory, service logs, and network capacity.
- Keep evidence that parallel runs did not drop or duplicate results.

## Transport Limits

| Transport | Limit                                                                                                            |
| --------- | ---------------------------------------------------------------------------------------------------------------- |
| SSH       | Requires network reachability and approved Linux credentials or keys. Privileged checks may require sudo policy. |
| WinRM     | Requires PowerShell remoting and approved Windows credentials or constrained endpoints.                          |
| API       | Depends on platform API availability, token scope, rate limits, and response stability.                          |
| Agent     | Depends on trusted agent enrollment, output delivery, and replay protection.                                     |

## Evidence And Storage Limits

Evidence bundles, reports, logs, and per-run traces consume local storage.
Customers should define retention, backup, restore, and secure deletion
procedures before production use.

Do not store evidence only inside ephemeral containers. Mount persistent
storage and include evidence paths in the customer backup plan.

## Security Limits

- Store secrets outside source control.
- Restrict administrator access to named users.
- Rotate credentials after deployment changes or personnel changes.
- Protect evidence bundles because they may include sensitive target output.
- Review failed login, production run, and adapter error events.

## Support Boundaries

AuditToolkitLabs support can assist with product defects, documented runtime
behavior, and supported configuration patterns. Customer-specific target
authorization, bespoke scripts, network design, identity-provider policy, and
third-party platform outages remain customer responsibilities unless a written
agreement states otherwise.

## Related Guidance

- [Deployment](deployment.md)
- [Authentication](authentication.md)
- [Parallel tracing](parallel-tracing.md)
- [Operations And Support Model](../../operations/operations-and-support.md)
