# Service Overview

Asset Command Centre is the **legacy/agentless** asset inventory and discovery collector in the AuditToolkit suite. It is a standalone, cut-down collector and local reporting node for **mixed estates across all platforms**, using established host and network protocols — **SSH, WinRM, SNMP, IPMI** and related access — as its primary collection methods, with no software installed on the targets.

It is the deliberate counterpart to the **CMDB API Data Collection Tool**, which collects the same kind of data **API-only**. Choose Asset Command Centre where API access is not available or not preferred and traditional protocol-based collection is the practical route.

## In-scope service behaviour

- Inventory collection and reconciliation for hosts and network assets.
- Local storage of collected inventory and operational findings.
- Local reporting, snapshots, and operator-facing status views.
- Audit logging and role-based access for the application.
- Super-admin-only portal actions for certificate, SSH key, API-code, tuning, log, and encryption workflows.
- Optional upstream forwarding to a central Audit Toolkit deployment.

## Active operating profile

- Connector operating mode defaults to `legacy-only`.
- Collection profile defaults to `inventory-only`.
- Primary supported connector families are SSH, WinRM, SNMP, IPMI, `nmap-sweep`, and `ansible-unified`.

## Not part of the supported release scope

- Deprecated commerce, marketplace, or fulfilment workflows.
- Product claims inherited from broader CMDB or audit-platform materials that are not implemented for this release.
- Unsupported host-platform promises outside the documented Ubuntu single-node release target.

## Deployment role

In its primary supported form, the service is deployed close to the managed network and acts as:

1. A collector for outbound management protocols.
2. A local inventory and reporting node.
3. An optional upstream sender when central aggregation is enabled.
