# Audit Assurance Node Transport Guide

## Purpose

Audit Assurance Node supports multiple execution and ingestion transports while
keeping downstream assurance processing consistent. This guide explains when to
use each transport and what customers should verify before enabling it.

## Transport Summary

| Transport | Best fit | Customer checks |
| --- | --- | --- |
| Local | Lab runs or host-local validation | Confirm local script path, execution policy, and evidence output path. |
| SSH | Approved Linux or Unix-like remote targets | Confirm network reachability, account scope, key handling, sudo policy, and logging. |
| WinRM | Approved Windows remote targets | Confirm PowerShell remoting, endpoint policy, credential scope, and event logging. |
| API | Platforms exposing structured management APIs | Confirm token scope, endpoint availability, rate limits, and API response contract. |
| Agent | Constrained or air-gapped environments | Confirm agent identity, output provenance, delivery path, and replay controls. |

## SSH Transport

The SSH adapter connects to an approved Linux target, executes an approved
script, captures standard output, standard error, exit code, target metadata,
and transport metadata, then returns the normalized adapter result object.

Before enabling SSH, confirm:

- The target owner has authorized audit execution.
- SSH keys or credentials are stored outside source control.
- The account can run only the approved audit commands.
- Any required sudo rules are documented and reviewed.
- Network and firewall paths are restricted to approved management sources.

## WinRM Transport

The WinRM adapter uses PowerShell remoting to execute approved scripts on
Windows targets. Where supported, customers should use constrained endpoints
such as Just Enough Administration to limit what the audit identity can run.

Before enabling WinRM, confirm:

- PowerShell remoting is enabled and governed by customer policy.
- The endpoint or configuration name is documented where constrained endpoints
  are used.
- Credentials are scoped to the approved audit role.
- Windows event logging and product run logs are retained for investigation.

## API Transport

The API adapter is intended for platforms that expose structured state through
an API, such as hypervisors, management consoles, appliances, or service
platforms. API workflows are usually more constrained than shell execution and
can be suitable where customers prefer token-based read access.

Before enabling API transport, confirm:

- The API token is read-only or audit-scoped where possible.
- The endpoint, tenant, organization, or platform scope is explicit.
- Rate limits and pagination are understood.
- API results are converted into the shared adapter result contract.

## Agent Transport

The agent adapter supports environments where the node should not initiate SSH
or WinRM connections. It can trigger an approved local agent process or ingest
a result file that an agent produced and delivered through another channel.

Before enabling agent transport, confirm:

- Agent identity and enrollment are trusted.
- Result files cannot be silently edited or replayed.
- Delivery paths are monitored and access-controlled.
- Agent output is translated into the same adapter result contract as other
  transports.

## Transport Selection Guidance

Use the least broad transport that satisfies the evidence requirement. Prefer
API or agent ingestion where shell access is not required. Use SSH or WinRM
when the audit requires host-local command execution and the customer has
approved the credential and network model.

## Related Guidance

- [Adapter model](adapters.md)
- [Authentication](authentication.md)
- [Logging and observability](logging-observability.md)
- [Operational limits](operational-limits.md)
