# 7. Operations and Support Model

*ISO/IEC 20000-1 clauses 8.1, 8.6, 8.7*

## 7.1 Support responsibilities

| Activity | Customer | Service provider |
| --- | --- | --- |
| First-line support to your end users | ✓ | |
| Triage of incidents to determine cause | ✓ | |
| Diagnosis and remediation of host / OS / network issues | ✓ | |
| Diagnosis and remediation of database issues | ✓ | |
| Investigation of suspected product defects | guidance | ✓ |
| Supply of product fixes, patches and security advisories | | ✓ |
| Roadmap and major version upgrades | | ✓ |

Support requests to the service provider must be raised by a named
Application Administrator on the customer side. Use the appropriate
AuditAdmin Labs address from the table in section&nbsp;7.4.

## 7.4 AuditAdmin Labs contact directory

These are the **vendor-side** addresses for third-party support from
the AuditToolkitLabs team. They are not customer placeholders — use them
verbatim.

**AuditToolkitLabs (Michael Churchill trading as AuditToolkitLabs)**
4th Floor, Silverstream House
45 Fitzroy Street, Fitzrovia
London W1T 6EB

Telephone: [+44 (0) 20 8090 9610](tel:+442080909610)

| Purpose | Contact |
| --- | --- |
| General service-management, account and commercial queries | [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com) |
| Routine product support, incidents, defects, how-to questions | [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com) |
| Security advisories, suspected vulnerabilities, responsible disclosure | [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com) |
| Licensing, tier changes, MSP / OEM contracts, EULA queries | [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com) |

Guidance:

- Send security matters **only** to the Security address. Do not raise
  them via the Support inbox or in the public ticketing system.
- Send licensing or contractual matters **only** to the License
  address; the Support team does not have authority to vary licence
  terms.
- Always include the diagnostic information listed in Appendix&nbsp;D
  (section&nbsp;12) when contacting Support.

## 7.5 Reporting issues and requests via GitHub

The product source repository is hosted on GitHub at
[`AuditToolkitLabs/CMDB-API-DATA-COLLECTION-TOOL`](https://github.com/AuditToolkitLabs/CMDB-API-DATA-COLLECTION-TOOL).
Customers with a public-facing technical contact may use GitHub for
non-confidential interactions. The Help portal sidebar provides direct
links to:

| GitHub destination | Use it for |
| --- | --- |
| **Report a bug** (Issues → Bug report) | Reproducible product defects, error messages, regressions. Pre-filled with the `bug` label and the bug-report template. |
| **Request a feature** (Issues → Feature request) | Roadmap suggestions, enhancement proposals. Pre-filled with the `enhancement` label. |
| **Discussions** | Questions, deployment patterns, community Q&A. Not for incident handling. |
| **Security advisory** (private) | GitHub's private vulnerability reporting workflow. Visible only to maintainers. |
| **Releases** | Notes for each published version, including changelogs and signed checksums. |

Guidance:

- **Do not** paste customer-identifying data, hostnames from your
  estate, IP addresses, audit log extracts, or licence keys into a
  public GitHub issue. Use [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com)
  instead.
- **Do not** report suspected vulnerabilities in public Issues or
  Discussions. Use the **Security advisory** link (GitHub private
  reporting) or email
  [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com).
- GitHub channels are best-effort and **not** covered by the
  contractual response targets in section&nbsp;7.2. Contractual
  incidents must always be raised via the Support email so they are
  tracked against your SLA.
- Licensing and contractual matters are not handled on GitHub. Use
  [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com).

## 7.2 Incident management

### Identification

Incidents may be identified by:

- End-user reports (via your internal service desk).
- Application alerts visible on the dashboard or in the audit log.
- External monitoring (host, database or synthetic checks operated by
  the customer).

### Severity guidance

| Severity | Definition | Initial response target |
| --- | --- | --- |
| **1 — Critical** | Service unavailable to all users, or confirmed data loss / security breach. | Immediate (within working hours), out-of-hours per your contract. |
| **2 — High** | Major function unavailable, multiple users affected, no workaround. | Same business day. |
| **3 — Medium** | Single function impaired, workaround exists, small user population affected. | Next business day. |
| **4 — Low** | Cosmetic issue, query or feature request. | Within five business days. |

Targets above are guidance for an internal service-management process;
contractual SLAs, where present, take precedence.

### Escalation

Escalate to the service provider only after first-line triage has
ruled out host, OS, network, database and identity-provider causes,
and has gathered the information listed in Appendix D (section 12).

## 7.3 Backup and recovery

### Customer responsibility

- Daily backup of the application database (logical or physical).
- Backup of the `instance/` directory, which holds local secrets and
  cache data.
- Periodic test of restore into a non-production environment.

### Recovery expectations

- A restore of database + `instance/` to a clean host of equivalent
  size returns the service to its state at the backup point.
- Audit-log entries are part of the database and are restored with it.
- EULA acceptance records are preserved across a restore — this is
  important for evidence continuity.
- Agents will reconnect automatically once the application URL is
  reachable; no agent-side intervention should be required for a
  same-hostname restore.
