# 2. Service Overview

Asset Command Centre is a legacy-focused asset inventory and discovery
service.

Its active release direction in this repository is a standalone
collector and local reporting node for mixed estates where SSH, WinRM,
SNMP, IPMI, and related protocol-compatible access are the primary
collection methods.

## In-scope service behavior

- Inventory collection and reconciliation for hosts and network assets.
- Local storage of collected inventory and operational findings.
- Local reporting, snapshots, and operator-facing status views.
- Audit logging and role-based access for the application.
- Super-admin-only portal actions for certificate, SSH key, API-code,
  tuning, log, and encryption workflows.
- Optional upstream forwarding to a central Audit Toolkit deployment.

## Active operating profile

- Connector operating mode defaults to `legacy-only`.
- Collection profile defaults to `inventory-only`.
- Primary supported connector families are SSH, WinRM, SNMP, IPMI,
  `nmap-sweep`, and `ansible-unified`.

## Not part of the supported release scope

- Deprecated commerce, marketplace, or fulfillment workflows.
- Product claims inherited from broader CMDB or audit-platform
  materials that are not implemented for this release.
- Unsupported host-platform promises outside the documented Ubuntu
  single-node release target.

## Deployment role

In its primary supported form, the service is deployed close to the
managed network and acts as:

1. A collector for outbound management protocols.
2. A local inventory and reporting node.
3. An optional upstream sender when central aggregation is enabled.
