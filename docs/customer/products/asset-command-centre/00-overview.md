# Asset Command Centre Overview

## Purpose

Asset Command Centre is a standalone asset inventory and discovery service for
mixed estates where local collection and local reporting are required. Its
active release direction is a legacy-focused collector and reporting node that
uses protocol-compatible access methods rather than assuming a central SaaS or
commerce workflow.

## Primary Outcomes

Asset Command Centre supports:

- Inventory collection and reconciliation for hosts and network assets.
- Local storage of collected inventory and operational findings.
- Local reporting, snapshots, and operator status views.
- Audit logging and role-based access.
- Credential-managed discovery operations.
- Optional upstream forwarding to a central AuditToolkit deployment.

## Active Operating Profile

| Area               | Supported direction                                                 |
| ------------------ | ------------------------------------------------------------------- |
| Product role       | Standalone collector and local reporting node.                      |
| Connector mode     | `legacy-only` by default.                                           |
| Collection profile | `inventory-only` by default.                                        |
| Primary target     | Ubuntu single-node release target unless a release says otherwise.  |
| Primary methods    | SSH, WinRM, SNMP, IPMI, Nmap sweep, and Ansible-unified collection. |

## In-Scope Behavior

- Discover and collect inventory from approved systems and network assets.
- Store results locally for reporting and operational review.
- Provide application-level audit logging and access control.
- Expose super-admin-only portal actions for certificate, SSH key, API-code,
  tuning, log, and encryption workflows where supported.
- Forward inventory upstream when central aggregation is explicitly enabled.

## Out Of Scope

The supported customer release scope excludes:

- Deprecated commerce, marketplace, or fulfillment workflows.
- Product claims inherited from broader CMDB or audit-platform material when
  not implemented in this product release.
- Unsupported host-platform promises outside the documented release target.

## Deployment Role

Asset Command Centre should be deployed close to the managed network. In its
primary customer model it acts as:

1. A collector for outbound management protocols.
2. A local inventory and reporting node.
3. An optional upstream sender when central aggregation is enabled.

## Product-Specific Follow-Up Pages

Planned product pages include discovery connectors, credential management,
upstream forwarding, API automation, managed agent operations, data collection
catalog, data security, and operational limits.
