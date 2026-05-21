# 8. Change and Release Management

Customers should manage Asset Command Centre changes as controlled
application releases.

Planned release version baseline for this cycle: 1.1.0.

## Minimum release procedure

1. review the target release notes
2. back up database and configuration data
3. confirm rollback material is available
4. apply the updated package or container image
5. restart the stack
6. validate UI access, connector readiness, reporting, and logging
7. record the change in customer change control

## Guardrails

- keep the deployment in `legacy-only` connector mode unless a broader
  connector policy has been explicitly approved
- avoid reintroducing deprecated commerce or issuance workflows in
  customer documentation or release operations

## Planned 1.1.0 feature-function validation

Before approving release creation, confirm that documentation and test
evidence align to these feature functions:

- agentless inventory and discovery paths (SSH, WinRM, SNMP, IPMI,
  Nmap, ansible-unified)
- local reporting and operational controls (snapshots, logs, license
  status, credential-managed operations)
- optional central forwarding flow through documented API controls
- Linux package and Windows MSI release packaging workflows

