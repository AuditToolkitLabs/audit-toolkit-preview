# 2. Service Overview and Scope

*ISO/IEC 20000-1 clauses 4.1–4.4, 8.2*

## 2.1 Service purpose

The CMDB API Data Collection Tool gathers asset and configuration data
from your IT estate using a combination of:

- **Lightweight agents** running on Windows and Linux endpoints.
- **API connectors** to virtualisation and cloud platforms
  (e.g. VMware vCenter, Nutanix Prism, KVM/libvirt, Google Cloud).
- **Direct REST API calls** from your own automation pipelines or
  scripts.

Collected data is normalised, stored in a configuration management
database (CMDB), enriched with vulnerability information, and surfaced
through dashboards, host detail pages and scheduled reports. The
business outcomes typically supported are:

- Continuous asset inventory and ownership tracking.
- Patch and vulnerability posture reporting.
- Evidence collection for internal audit and external assurance.
- Capacity and lifecycle planning.

## 2.2 In-scope components

The service, as delivered, includes:

- The Flask web application (administration console, dashboards,
  reporting UI, user and role management).
- The REST API used by agents, connectors and customer-side tooling.
- The Windows agent (.NET 8) and Linux agent (Go).
- The managed agent server used to coordinate fleet deployments.
- The database schema and migration scripts for the CMDB.
- The audit-log subsystem.

Supported platforms at the time of writing:

- **Application host:** Linux (Ubuntu LTS, RHEL/CentOS-derived) or
  Windows Server with Python 3.12+.
- **Database:** PostgreSQL 15 or later for production; SQLite is
  available for evaluation only.
- **Endpoints under management:** Windows 10/11, Windows Server 2019+,
  modern Linux distributions with systemd.

## 2.3 Out-of-scope components

The following are **not** part of the supplied service unless covered
by a separate written agreement:

- Hardware on which the application or its database run.
- Operating-system support, patching and backup of the host server.
- Network infrastructure, firewalls and load balancers.
- Customer-specific connectors, custom reports or bespoke integrations.
- End-user devices being inventoried (their lifecycle remains the
  customer's responsibility).
- Production deployment under the standard licence — that requires the
  appropriate paid tier; see Appendix C in section 12.

## 2.4 Service boundaries

| Activity | Customer | Service provider |
| --- | --- | --- |
| Provide host hardware / cloud VM | ✓ | |
| Install and patch the host operating system | ✓ | |
| Install and configure the application | ✓ | guidance only |
| Provision the database and take database backups | ✓ | |
| Monitor application availability | ✓ | |
| Supply application bug fixes and security patches | | ✓ |
| Provide product documentation | | ✓ |
| Manage user accounts inside the application | ✓ | |
| Maintain endpoint agents on customer assets | ✓ | guidance only |
