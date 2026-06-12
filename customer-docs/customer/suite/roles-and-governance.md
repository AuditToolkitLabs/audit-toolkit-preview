# Roles And Governance

## Application Roles

Product role names vary by release, but the customer operating model uses a
consistent set of responsibilities.

| Role | Typical scope |
| --- | --- |
| Administrator | Full or near-full application administration, including users, settings, targets, integrations, license view, and audit logs. |
| Operator | Day-to-day audit, collection, discovery, exposure, or reporting tasks without broad security configuration authority. |
| Reader | Read-only access to dashboards, results, reports, and evidence for review. |
| API consumer | Non-interactive API or integration access with scoped credentials. |
| Super administrator | Restricted break-glass or elevated product-specific administration where implemented. |

Customers should map these roles to internal least-privilege and
segregation-of-duties policies.

## Customer Governance Roles

| Role | Held by | Responsibility |
| --- | --- | --- |
| Service owner | Customer | Owns business outcome, acceptance, risk decisions, and operational scope. |
| Application administrator | Customer | Manages users, settings, license view, targets, integrations, schedules, and local support. |
| Infrastructure owner | Customer | Owns host OS, database, network, TLS, backups, monitoring, and disaster recovery. |
| Security owner | Customer | Reviews findings, authorizes audit scope, handles vulnerabilities, and accepts residual risk. |
| Integration owner | Customer | Owns API, SIEM, webhook, identity, ticketing, scheduler, and connector integrations. |
| Auditor or assessor | Customer or third party | Reviews evidence, access, change records, logs, and compliance outputs. |
| Service provider | AuditToolkitLabs | Provides product releases, documentation, advisories, licensing, and support guidance. |

## Decision Authority

- Routine use questions should go to the customer application administrator.
- Host, network, database, or backup incidents should go to the customer
  infrastructure owner.
- Security findings and audit scope decisions should go to the customer security
  owner.
- Product defects, licensing questions, and security advisories should be raised
  with AuditToolkitLabs through the documented email contacts.
- Contractual or entitlement disputes should be handled by the customer service
  owner and the AuditToolkitLabs commercial contact.

## Segregation Of Duties

Customers should separate:

- User administration from audit or collection execution.
- Read-only evidence review from configuration changes.
- API automation credentials from interactive user accounts.
- Production administration from test or evaluation environments.
- Security review from routine operations where local policy requires it.

Where products support tenant, workspace, team, or report-scope boundaries,
customers should align those boundaries with internal ownership and approval
models.

## Governance Cadence

Recommended recurring governance activities:

| Cadence | Activity |
| --- | --- |
| Before deployment | Confirm authorization, scope, license mode, backup model, and acceptance criteria. |
| Before recurring jobs | Validate target credentials, privilege model, schedules, and data destination. |
| Monthly | Review users, roles, API keys, integration failures, and audit logs. |
| Quarterly | Review license entitlement, operational limits, backup restore tests, and security posture. |
| Per release | Review release notes, checksums, documentation sync evidence, and rollback plan. |

## License Governance

License and entitlement policy is maintained centrally in
[Licensing Overview](../../licensing/overview.md). Application administrators
are responsible for monitoring license state in the product UI or runtime,
renewing before expiry, and confirming that actual deployment scope matches the
licensed tier and entitlement boundaries.
