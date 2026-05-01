# 3. Roles, Responsibilities and Governance

*ISO/IEC 20000-1 clauses 5.3, 8.3*

## 3.1 Roles inside the application

The application ships with a small number of built-in roles. Custom
roles can be defined by an administrator.

| Role | Typical permissions |
| --- | --- |
| **admin** | Full control: user management, SSO/LDAP configuration, API key issuance, connector setup, audit-log review, backup management. |
| **operator** | Read/write of inventory data; can manage agents, run reports, acknowledge findings, but cannot create users or change global configuration. |
| **reader** | Read-only access to dashboards, host detail and reports. Suitable for auditors and assurance reviewers. |
| **api** | Used implicitly by API key consumers; never assigned to interactive users. |

## 3.2 Roles outside the application

| Role | Held by | Responsibility |
| --- | --- | --- |
| Service Owner | Customer | Owns the business outcomes the service delivers. |
| Application Administrator | Customer | Day-to-day administration: users, connectors, agents, reports. |
| Infrastructure Owner | Customer | Host OS, database, network, backups. |
| Service Provider | Vendor | Product roadmap, fixes, security advisories, documentation. |
| Auditor | Customer / third party | Independent review of access, change and incident records. |

## 3.3 Escalation and decision authority

- Routine application questions: Application Administrator.
- Operational incidents (host down, database corruption, network
  outage): Infrastructure Owner.
- Product defects, security advisories, licence questions: Service
  Provider — see the AuditAdmin Labs contact table in section&nbsp;7.
- Disputes over scope of service or contractual matters: Service Owner
  on the customer side and the named contract owner on the provider
  side.

## 3.4 Segregation of duties

The application supports separation of:

- **User-administration** vs **inventory-administration** by assigning
  the `admin` role to a small population and `operator` to the wider
  team.
- **Read** vs **change** by giving auditors only the `reader` role.
- **Workspace boundaries**: under the Workgroup, MSP and OEM tiers,
  data is partitioned by `tenant_id` and operators can be limited to
  one or more workspaces.

Customers are responsible for designing the role assignments to meet
their internal segregation-of-duties policies.
