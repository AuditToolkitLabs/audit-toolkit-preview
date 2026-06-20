# Audit Assurance Node Adapter Model

## Purpose

Audit Assurance Node adapters isolate transport-specific execution from the
assurance pipeline. Each adapter connects to a target or evidence source,
executes or ingests audit output, and returns a normalized result object.

The assurance pipeline then validates the object and processes evidence without
needing to know which transport produced it.

## Supported Transport Families

| Transport | Customer use                                                                              |
| --------- | ----------------------------------------------------------------------------------------- |
| Local     | Execute directly on the operator or runtime host.                                         |
| SSH       | Execute scripts on approved remote Linux hosts.                                           |
| WinRM     | Execute scripts on approved remote Windows hosts through PowerShell remoting.             |
| API       | Query structured management APIs such as platforms, hypervisors, consoles, or appliances. |
| Agent     | Trigger or ingest agent-produced audit output where direct remote access is not desired.  |

## Adapter Contract

All adapters must return a normalized result object containing target,
execution, script, and status data. Required status fields include success,
exit code, standard output, and standard error.

The assurance pipeline validates incoming results before evidence generation,
signing, bundling, or reporting. Invalid objects are rejected.

The required result shape is:

```json
{
  "target": {
    "host": "string",
    "platform": "string",
    "transport": "string"
  },
  "execution": {
    "operator": "string",
    "mode": "string"
  },
  "script": {
    "path": "string"
  },
  "status": {
    "success": true,
    "exitCode": 0,
    "stdout": "string",
    "stderr": "string"
  }
}
```

Recommended optional fields include execution endpoint, start time, end time,
script arguments, and control identifiers when the transport can supply them.

## Transport Responsibilities

Adapters are responsible for:

- Connecting to the target or evidence source.
- Executing the script or querying the API.
- Capturing result data.
- Normalizing the result into the shared contract.
- Validating the result before returning it where supported.

Adapters are not responsible for:

- Compliance scoring.
- Evidence signing.
- Bundle creation.
- Report generation.
- Assurance policy decisions.

## SSH Pattern

The SSH adapter is used for remote Linux hosts. It connects, executes the
approved audit script, captures output, and returns a normalized result object.

Customers should confirm target authorization, account scope, sudo policy,
network reachability, and audit script path before using SSH transport.

## WinRM Pattern

The WinRM adapter is used for remote Windows hosts through PowerShell remoting.
Where supported, customers may use constrained endpoints such as JEA to limit
what an auditor can execute.

Customers should confirm PowerShell remoting policy, endpoint configuration,
credential scope, and audit logging before using WinRM transport.

## API Pattern

The API adapter is used where a platform exposes structured state through an
API. It is often more constrained than general-purpose remote shell access and
is suitable for hypervisors, management consoles, and appliances.

Platform-specific API logic should stay behind the adapter boundary while the
assurance result contract remains consistent.

## Agent Pattern

The agent adapter supports environments where SSH or WinRM is not feasible or
desired. It can trigger local agent execution or ingest a result file that an
agent produced through another delivery mechanism.

The adapter translates agent output into the same evidence model used by other
transports.

## Customer Controls

Before enabling an adapter, confirm:

- Target authorization and ownership.
- Credential or token scope.
- Transport logging and auditability.
- Network and firewall requirements.
- Expected output and evidence location.
- Failure handling and retry policy.

## Contract Testing

Audit Assurance Node includes adapter contract tests for valid and invalid
fixtures. The test suite verifies that local, SSH, WinRM, agent, and API result
objects satisfy the shared contract and that malformed objects are rejected.

Contract tests should run before adding or changing a transport adapter. A
failed contract test means the assurance layer cannot safely rely on that
adapter output for evidence processing.

## Extension Rules

Future adapters must construct the shared result object through the common
adapter contract helpers, validate the object before returning it, and keep all
transport-specific logic inside the adapter boundary. Scoring, signing,
bundling, report generation, and assurance policy decisions remain outside the
adapter.

## Related Guidance

- [Audit Assurance Node Overview](overview.md)
- [SSH WinRM API and agent transports](ssh-winrm-api-agent-transports.md)
- [Runtime validation](runtime-validation.md)
- [Security Access And Data Protection](../../security/security-access-data-protection.md)
- [Operations And Support Model](../../operations/operations-and-support.md)
