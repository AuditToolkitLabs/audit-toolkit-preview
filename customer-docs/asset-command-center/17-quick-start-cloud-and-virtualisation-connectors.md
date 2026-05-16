# 17. Supported Connector Policy

The supported connector policy for the standalone release is anchored to
legacy-focused connector families.

## Agentless baseline

This release is agentless by design. The supported baseline requires
direct network collection only and does not require host-based agents.

Primary protocols for this posture are SSH, WinRM, SNMP, and optional
IPMI where enabled.

## Default operating mode

- `ASSET_MANAGEMENT_CONNECTOR_OPERATING_MODE=legacy-only`
- `ASSET_MANAGEMENT_COLLECTION_PROFILE=inventory-only`

## Primary connector allowlist

- `ssh-host`
- `ssh-network`
- `winrm-host`
- `snmp-network`
- `ipmi-bmc`
- `nmap-sweep`
- `ansible-unified`

## Release-ready documentation rule

This documentation set does not represent broader cloud or
virtualization connector coverage as part of the primary supported
standalone release, even if related code or historical artifacts exist
elsewhere in the repository.

Agent-based workflows are also not part of the primary supported
standalone release and should be treated as future enhancement work.
