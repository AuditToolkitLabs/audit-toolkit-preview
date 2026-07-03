# CMDB API Data Collection Tool — Overview

The CMDB API Data Collection Tool is the **API-only** asset and configuration data collector in the AuditToolkit suite. It gathers estate data **exclusively through APIs** — with no agents and no legacy host protocols — making it the deliberate counterpart to **Asset Command Centre**, which collects from the same estate using legacy and agentless methods (SSH, WinRM, SNMP, IPMI). Choose this tool wherever API-based collection is preferred or mandated: modern, credential-scoped, network-friendly, and requiring no software on the hosts being inventoried.

## What it does

Data is collected via:

- **API connectors** to virtualisation and cloud platforms (for example VMware vCenter, Nutanix Prism, KVM/libvirt and Google Cloud).
- **Direct REST API calls** from your own automation pipelines or scripts.

Collected data is normalised, stored in a configuration management database (CMDB), enriched with vulnerability information, and surfaced through dashboards, host detail pages and scheduled reports.

## Business outcomes

The service typically supports:

- Continuous asset inventory and ownership tracking.
- Patch and vulnerability posture reporting.
- Evidence collection for internal audit and external assurance.
- Capacity and lifecycle planning.

## Who it is for

The documentation and application serve several audiences:

- **Business users** — access the application, perform routine tasks, and interpret dashboards and reports.
- **Application administrators** — manage users, configure data sources, set up connectors and schedule reports.
- **IT operations and service-management staff** — fit the service into change, incident and backup processes.
- **Security and assurance teams** — work with authentication options, audit logging, the access-control model and data-protection responsibilities.
- **Auditors and assessors** — map features to ISO/IEC 20000-1:2018 clauses and the EULA acceptance evidence model.

## Accessing the application

The application is reached with a standard web browser at the URL provided by your administrator (typically `https://<your-cmdb-host>/`). Three authentication mechanisms are supported and selected by your administrator:

- **Local accounts** — username and password held in the application's own user store.
- **LDAP / Active Directory** — authentication against your existing directory.
- **Single sign-on** — SAML 2.0 or OpenID Connect via your identity provider.

On first sign-in you are presented with the End-User Licence Agreement, which must be read and accepted before any further pages will load. Declining the EULA signs you out.

## Core user tasks

From the web console you can review overall estate health on the **Dashboard**, look up a specific host under **Hosts**, inspect a host's hardware, software and vulnerabilities on the **Host detail** page, run ad-hoc inventory or vulnerability reports, subscribe to scheduled reports, and acknowledge or annotate findings.

## What is included

As delivered, the service includes the Flask web application (administration console, dashboards, reporting UI, and user and role management), the REST API used by connectors and customer-side tooling, the managed agent server used to coordinate fleet deployments, the CMDB database schema and migration scripts, and the audit-log subsystem.

**Supported platforms** at the time of writing are a Linux (Ubuntu LTS, RHEL/CentOS-derived) or Windows Server application host running Python 3.12+, with PostgreSQL 15 or later for production (SQLite is available for evaluation only). Endpoints under management include Windows 10/11, Windows Server 2019+, and modern Linux distributions with systemd.

## What is out of scope

Unless covered by a separate written agreement, the service does not include host hardware, operating-system support and patching of the host, network infrastructure, customer-specific connectors or bespoke integrations, or the lifecycle of the end-user devices being inventoried. Production deployment under the standard licence requires the appropriate paid tier.

## Next steps

- See the [Capabilities](01-capabilities.md) summary for a grouped view of what the tool can collect and do.
- See the [Feature Guide](02-feature-guide.md) for the full service overview and scope.
- See the [Collector Capability Matrix](03-capability-matrix.md) for per-field, per-collector coverage.
