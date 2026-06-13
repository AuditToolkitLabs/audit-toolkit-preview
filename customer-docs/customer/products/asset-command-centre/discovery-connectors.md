# Asset Command Centre Discovery Connectors

## Purpose

Asset Command Centre uses agentless discovery connectors for inventory and
local reporting. The supported standalone release posture is legacy-focused and
anchored to direct network collection rather than host-based agent workflows.

## Supported Baseline

| Area               | Baseline                             |
| ------------------ | ------------------------------------ |
| Connector model    | Agentless direct network collection. |
| Operating mode     | `legacy-only`.                       |
| Collection profile | `inventory-only`.                    |
| Primary protocols  | SSH, WinRM, SNMP, and optional IPMI. |

## Primary Connector Allowlist

The primary supported connector families are:

- `ssh-host`
- `ssh-network`
- `winrm-host`
- `snmp-network`
- `ipmi-bmc`
- `nmap-sweep`
- `ansible-unified`

## Customer Prerequisites

Before enabling collection, confirm:

- Network reachability from the Asset Command Centre host to approved targets.
- Written authorization for every subnet, host, and management endpoint.
- Least-privilege credentials for SSH, WinRM, SNMP, IPMI, or Ansible use.
- Maintenance windows or rate limits for discovery runs.
- Log and report retention expectations.
- Credential rotation and revocation process.

## Connector Onboarding Pattern

1. Confirm the connector family is in the supported allowlist.
2. Confirm the collection target is approved and reachable.
3. Add or update credentials in the supported product credential workflow.
4. Configure connector scope and schedule.
5. Run a small pilot collection.
6. Review inventory, logs, and any failed targets.
7. Expand scope only after pilot validation.

## Operational Rules

- Do not treat historical cloud, marketplace, or fulfillment artifacts as
  release-supported connector coverage.
- Do not represent agent-based workflows as part of the primary standalone
  release unless a release note explicitly adds support.
- Keep connector scope aligned to the customer change record.
- Use constrained accounts and non-interactive elevation where possible.
- Review failed authentication and unreachable target reports after every run.

## Validation Checklist

- Connector mode is `legacy-only`.
- Collection profile is `inventory-only`.
- Target counts match expected scope.
- Failed targets are reviewed and categorized.
- Credentials are stored and rotated under customer policy.
- Reports and snapshots show expected inventory data.

## Related Guidance

- [Asset Command Centre Overview](overview.md)
- [Security Access And Data Protection](../../security/security-access-data-protection.md)
- [Operations And Support Model](../../operations/operations-and-support.md)
