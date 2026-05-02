# 3. Roles, Responsibilities and Governance

*ISO/IEC 20000-1 clauses 5.3, 8.3*

## 3.1 Roles inside the application

The application ships with four built-in roles. Custom fine-grained
permissions can be layered on top by an administrator.

| Role | Typical permissions |
| --- | --- |
| **admin** | Full control: user management, SSO/LDAP configuration, API key issuance, target and agent management, audit scheduling, audit-log review, backup management, licence tier visibility. |
| **operator** | Read/write of audit targets and findings; can deploy agents, run on-demand audits, acknowledge findings, and manage schedules. Cannot create users or change global security configuration. |
| **reader** | Read-only access to dashboards, audit results, host detail pages, and reports. Suitable for auditors and assurance reviewers. |
| **api** | Used implicitly by API key consumers; never assigned to interactive users. |

## 3.2 Roles outside the application

| Role | Held by | Responsibility |
| --- | --- | --- |
| Service Owner | Customer | Owns the business outcomes the service delivers. |
| Application Administrator | Customer | Day-to-day administration: users, roles, targets, agents, schedules, API keys, integrations. |
| Infrastructure Owner | Customer | Host OS, database, network, TLS certificates, backups. |
| Security Officer | Customer | Reviews audit findings, drives remediation, accepts residual risk. |
| Service Provider | AuditAdmin Labs | Product roadmap, bug fixes, security advisories, licence management, documentation. |
| Auditor / Assessor | Customer or third party | Independent review of access, change and incident records. |

## 3.3 Escalation and decision authority

- Routine application usage questions: Application Administrator.
- Operational incidents (host unavailable, database corruption, network
  outage): Infrastructure Owner.
- Product defects, security advisories, licence questions: Service
  Provider — see the AuditAdmin Labs contact table in section 7.
- Disputes over scope of service or contractual matters: Service Owner
  on the customer side and the named commercial contact at AuditAdmin
  Labs.

## 3.4 Segregation of duties

The application supports separation of:

- **User administration** vs **audit administration** — assign the
  `admin` role to a small population; give the broader security team
  the `operator` role.
- **Read vs write** — give auditors and assessors the `reader` role.
- **Workspace boundaries** — under the Workgroup, MSP and OEM licence
  tiers, data is partitioned per workspace. Operators can be scoped to
  one or more workspaces.

Customers are responsible for designing role assignments to meet their
internal segregation-of-duties and least-privilege policies.

## 3.5 Licence governance

The Application Administrator is responsible for:

- Monitoring the server count reported in the administration console.
- Obtaining the appropriate commercial licence before exceeding 25
  managed servers.
- Keeping the licence key current and renewing it before expiry.
- Notifying the Service Provider if the deployment model changes in a
  way that affects the licence tier (e.g. moving from internal use to
  MSP service delivery).

See Appendix C in section 12 for a full description of licence tiers.
