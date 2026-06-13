# Service Overview

## Suite Role

AuditToolkit is a suite of self-hosted and on-site tools for security audit,
asset discovery, infrastructure assurance, CMDB data collection, network
exposure review, reporting, and customer-controlled evidence generation.

The products share a common operating pattern:

- Customer-controlled deployment.
- Customer-owned target systems and data.
- Local administration and role assignment.
- Controlled collection or audit execution.
- Audit logging and evidence capture.
- Support escalation through AuditToolkitLabs.
- Central legal, licensing, and customer documentation authority.

## Product Roles

| Product                                                           | Role in the suite                                                                                                                  |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Audit-Tool                                                        | Core audit platform and broadest customer deployment model.                                                                        |
| Asset Command Centre                                              | Asset inventory, discovery, local reporting, and forwarding.                                                                       |
| AuditToolkit Linux Security Lite                                  | Linux-only audit execution and compliance evidence.                                                                                |
| CMDB API Data Collection Tool                                     | CMDB-oriented API and connector collection.                                                                                        |
| Switch Exposure Center                                            | Network switch exposure, advisory, and reporting workflows.                                                                        |
| [Audit Assurance Node](../products/audit-assurance-node/index.md) | Transport-neutral assurance execution, adapter-based evidence collection, parallel tracing, and standalone web runtime validation. |

## Deployment Model

Most products are designed for customer-managed environments. Depending on the
product and release, supported deployment forms may include:

- Linux packages.
- Windows MSI packages.
- Docker or Docker Compose.
- Local application runtime.
- Managed or standalone agents.
- API-driven integrations.

Product-specific deployment details are documented under
[Product Guides](../products/index.md) and the central
[Deployment](../deployment/index.md) section.

## Customer Responsibilities

Customers are responsible for:

- Obtaining authorization before auditing or collecting from target systems.
- Providing host, network, identity, database, and backup infrastructure.
- Protecting credentials, license keys, API keys, and offline license files.
- Assigning least-privilege roles and reviewing access periodically.
- Validating integrations before enabling recurring jobs.
- Maintaining local change, incident, and acceptance records.

## AuditToolkitLabs Responsibilities

AuditToolkitLabs is responsible for:

- Product releases, defect fixes, and security advisories.
- Central customer documentation, legal terms, and licensing guidance.
- Release-bundle documentation sync and validation tooling.
- Support guidance for reproducible product defects.
- Commercial licensing and entitlement support.

## Common Evidence Types

Across the suite, customer evidence may include:

- Audit results and reports.
- Inventory snapshots.
- Advisory and exposure records.
- API collection records.
- Scheduled job history.
- Audit logs and administrator actions.
- EULA acceptance records where supported by the product.
- License status and entitlement context.
