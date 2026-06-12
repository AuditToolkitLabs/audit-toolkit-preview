# Service Transition And Initial Setup

## Purpose

This guide describes the customer-facing transition pattern used when moving an
AuditToolkit product from evaluation or staging into operational use.

Product-specific installation commands and package names remain in the relevant
[Product Guides](../products/index.md). This page defines the common customer
transition controls.

## Pre-Deployment Prerequisites

Before deployment, confirm:

| Area | Requirement |
| --- | --- |
| Authorization | Written approval exists for the systems, networks, tenants, or data sources in scope. |
| Host platform | The target OS, VM, container host, or appliance model is supported for the product release. |
| Network | Required inbound and outbound paths are approved, including identity, API, connector, agent, or license endpoints where used. |
| Identity | Local, LDAP, SSO, Entra, Okta, or other identity configuration has an owner and test plan. |
| TLS | Customer-approved TLS certificates and hostnames are available where HTTPS is used. |
| Database and storage | Required database, data directories, retention, and backup locations are defined. |
| Secrets | Product secrets, API keys, credentials, and license files have a protected storage model. |
| Monitoring | Health checks, logs, job failures, and support escalation paths are monitored. |
| Rollback | A rollback or uninstall procedure is approved before production use. |

## Initial Setup Pattern

Use this high-level sequence for customer deployments:

1. Confirm product, version, release bundle, and checksum evidence.
2. Confirm the central documentation sync evidence in `manifest/docs-sync.json`
   where a release bundle is used.
3. Provision the host, VM, container, or appliance boundary.
4. Install package or runtime dependencies required by the product release.
5. Configure database, data directories, logs, and backup locations.
6. Configure product secrets and license material.
7. Configure TLS and reverse proxy or service exposure where needed.
8. Start the service and confirm health endpoints or service status.
9. Complete first sign-in, EULA acceptance, and administrator setup where
   supported.
10. Configure identity, users, roles, targets, connectors, jobs, or agents.
11. Run a pilot collection or audit against approved non-critical scope.
12. Review logs, evidence, permissions, and backup state before production use.

## Acceptance Criteria

A service is ready for operational use when:

- The application or toolkit is reachable by the intended administrator group.
- A named application administrator has completed first setup.
- License state is visible and matches expected entitlement.
- At least one approved target, connector, job, or audit has completed
  successfully where applicable.
- Logs and audit events show expected administrator and execution activity.
- Backup and restore responsibilities are documented.
- Security owner has approved scope, privilege model, and data destinations.
- Support contacts and escalation package requirements are known.

## Transition Evidence

Keep the following evidence with the customer change record:

- Product name and version.
- Release bundle checksum or package checksum.
- Documentation sync evidence where available.
- Installation date and installer identity.
- License mode and non-secret status output.
- First administrator setup record.
- Pilot run result or health check evidence.
- Backup configuration and first successful backup where applicable.
- Known constraints and accepted residual risks.

## Rollback Readiness

Before production handoff, confirm:

- Previous package or snapshot is available where rollback is supported.
- Database backup or VM snapshot is available where stateful migration occurs.
- Service stop, uninstall, and re-install steps are documented.
- Credentials and license files can be restored without exposing secrets.
- Customers know which changes are reversible and which require support.
