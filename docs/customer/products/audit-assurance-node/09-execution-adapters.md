# Audit Assurance Node Execution Adapters

## Purpose

Execution adapters are the transport layer of Audit Assurance Node. Each
adapter delivers audit scripts to a target host through a specific protocol and
returns a validated result object that conforms to the adapter contract. The
assurance pipeline is transport-neutral: it processes results without needing
to know which adapter was used.

## Supported Adapters

| Adapter | Protocol      | Primary targets                                     |
| ------- | ------------- | --------------------------------------------------- |
| SSH     | SSH           | Linux and Unix hosts with an approved SSH service.  |
| WinRM   | WinRM / HTTPS | Windows Server and workstation targets.             |
| Agent   | HTTPS         | Hosts running a registered AuditToolkit agent.      |
| API     | REST HTTPS    | Audit-Tool platform API endpoints.                  |

## Adapter Contract

All adapters must return a result object with the following required fields.
Results that do not meet the contract are rejected before evidence is produced.

| Field                | Description                                               |
| -------------------- | --------------------------------------------------------- |
| `target.host`        | Hostname or IP of the audit target.                       |
| `target.platform`    | Detected or declared platform identifier.                 |
| `target.transport`   | The adapter used for this execution.                      |
| `execution.operator` | The account or token executing the audit.                 |
| `execution.mode`     | Execution mode for this run.                              |
| `script.path`        | Path to the audit script that was executed.               |
| `status.success`     | Boolean outcome of the execution.                         |
| `status.exitCode`    | Exit code returned by the script.                         |
| `status.stdout`      | Captured standard output from the script.                 |
| `status.stderr`      | Captured standard error from the script.                  |

This contract ensures downstream evidence artifacts are complete and consistent
regardless of the transport used.

## Prerequisites

Before enabling any adapter:

- Written authorization must exist for every target host and management
  endpoint.
- Network reachability must be confirmed from the Audit Assurance Node host to
  each target on the required port.
- Least-privilege credentials must be in place for each transport: SSH key,
  WinRM account, API token, or agent registration token.
- TLS trust must be configured where HTTPS transports are used.
- Maintenance windows or rate limits should be defined where execution is
  recurring or fleet-wide.

## SSH Adapter Pattern

Use the SSH adapter for Linux and Unix hosts where an approved SSH service is
available and direct access is authorized.

Customer steps:

1. Confirm the target host is reachable on the approved SSH port from the
   Audit Assurance Node host.
2. Configure an SSH private key or approved credential in the product
   credential configuration.
3. Confirm the account has least-privilege read access sufficient for audit
   script execution.
4. Add the target host to the execution scope.
5. Run a pilot audit and review the returned result object and log entries.
6. Confirm no unexpected privilege escalation occurred and all contract fields
   are present.

## WinRM Adapter Pattern

Use the WinRM adapter for Windows Server and workstation targets where WinRM
is enabled and authorized under the customer change record.

Customer steps:

1. Confirm WinRM is enabled and reachable on the target host from the Audit
   Assurance Node host.
2. Confirm the account has least-privilege access sufficient for audit scripts.
3. Configure WinRM credentials in the product credential configuration.
4. Confirm HTTPS transport is in use where required by customer policy.
5. Add the target to the execution scope.
6. Run a pilot audit and confirm the result object, exit code, and log entries.

## Agent Adapter Pattern

Use the agent adapter where AuditToolkit agents are deployed on managed hosts
and execution should route through the agent rather than direct credential
access to the target.

Customer steps:

1. Confirm the agent is installed and registered on the target host.
2. Confirm the agent is reachable on the approved HTTPS endpoint from the Audit
   Assurance Node host.
3. Configure the agent registration token or API key in the adapter
   configuration.
4. Select agent execution mode.
5. Run a pilot dispatch and confirm the agent result is returned with a valid
   contract object and RunId.

## API Adapter Pattern

Use the API adapter when audit dispatch and result retrieval route through the
Audit-Tool REST API rather than direct host access.

Customer steps:

1. Confirm the Audit-Tool API endpoint is reachable on the approved HTTPS
   address.
2. Configure the API key with the required scope in the adapter configuration.
3. Select API execution mode.
4. Confirm an API key rotation policy is in place.
5. Run a pilot dispatch and confirm the result object is returned and passes
   contract validation.

## Credential Management

- SSH keys, WinRM passwords, and API tokens must be stored through the approved
  credential configuration path, not hardcoded in scripts or configuration
  files.
- Use environment variables to pass secrets at runtime where deployment policy
  supports it.
- Rotate credentials following the customer credential rotation schedule.
- Do not commit credential files to source control.
- Revoke and replace credentials immediately if compromise is suspected.

## Troubleshooting

| Symptom                       | First checks                                                              |
| ----------------------------- | ------------------------------------------------------------------------- |
| Adapter returns non-zero exit | Review per-run log for the RunId; check script exit code and stderr.      |
| Contract validation failure   | Confirm the adapter returned all required fields; check adapter log.      |
| SSH connection refused        | Confirm port, key permissions, account authorization, and network path.   |
| WinRM authentication failure  | Confirm credentials, WinRM configuration, and HTTPS policy.              |
| Agent not reachable           | Confirm agent service status, HTTPS endpoint, and registration token.     |
| API call unauthorized         | Confirm API key scope, expiry, and the correct endpoint URL.              |
| No output in evidence         | Confirm contract was met and the evidence pipeline ran without errors.    |

Do not send credentials, private keys, or unredacted log content in support
requests.

## Related Guidance

- [Audit Assurance Node Overview](00-overview.md)
- [Security Access And Data Protection](../../security/security-access-data-protection.md)
- [Operations And Support Model](../../operations/operations-and-support.md)
