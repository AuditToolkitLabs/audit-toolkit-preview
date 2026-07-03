# CMDB API Data Collection Tool — Capabilities

This page summarises what the CMDB API Data Collection Tool can do: how it collects estate data through APIs, what it stores and enriches, and how you consume the results. It is the "what this tool can do" reference; for full per-field coverage see the [Collector Capability Matrix](03-capability-matrix.md).

## API-only collection

The tool collects data **exclusively through APIs** — no agents on hosts, no legacy protocols (SSH, WinRM, SNMP, IPMI). This is what distinguishes it from Asset Command Centre, and makes it the right choice where API-based collection is preferred or mandated. It collects via:

- **API connectors** to virtualisation and cloud platforms — for example VMware vCenter, Nutanix Prism, KVM/libvirt and Google Cloud.
- **Direct REST API calls** from your own automation pipelines or scripts, using a documented canonical schema.

## Inventory and normalisation

- Ingests asset and configuration data from multiple sources and **normalises** it into a single configuration management database (CMDB).
- Normalises identity variants — hostname, FQDN, IP addresses and MAC — during core ingestion so records reconcile across sources.
- Applies **identity correlation** so snapshots from different sources describe one canonical host.
- Records **agent/collector metadata** (collector version, collection time, errors) with every record to support data-quality scoring.

## Data captured

Collected and exposed data groups include:

- **Identity** — hostname, FQDN, IP addresses, MAC.
- **Operating system** — family, name, version, build and kernel.
- **Hardware** — manufacturer, model, serial, CPU and memory.
- **Disk** — size, used, free, mount point and filesystem.
- **Network** — interfaces, IPv4/IPv6 addressing and link.
- **Software** — installed software and packages with versions.
- **Updates** — installed updates and patch identifiers.
- **Boot** — last boot and uptime.
- **Virtualisation placement** — hypervisor, cluster, datastore and VM power state (via connectors such as vCenter, Prism, OpenStack and KVM).
- **Cloud metadata** — account/subscription, region, instance type and tags (via cloud connectors).

Coverage varies by collector and source; some field groups are partial or planned. Always check the [Collector Capability Matrix](03-capability-matrix.md) for the current state of a specific field group.

## Enrichment

- Enriches inventory with **vulnerability information** for patch and posture reporting.
- Core enrichment pipeline is the source of **lifecycle** (end-of-life / support) metadata.

## Dashboards, host views and reporting

- **Dashboard** for overall estate health.
- **Host search and host detail** pages exposing hardware, software and vulnerabilities per asset.
- **Ad-hoc reports** — run inventory or vulnerability reports on demand.
- **Scheduled reports and subscriptions** — recurring delivery of report output.
- **Finding annotation** — acknowledge or add notes to vulnerabilities.

## Access, authentication and multi-tenancy

- Reached through a standard web browser at the administrator-provided URL.
- Three authentication mechanisms: **local accounts**, **LDAP / Active Directory**, and **single sign-on** (SAML 2.0 or OpenID Connect).
- **EULA acceptance** is enforced at first sign-in as part of the evidence model.
- Supports **multi-tenant** deployments with workspace selection.

## Data handling and retention

- All data you see and enter is owned by your organisation.
- Free-text fields are validated for length and stripped of HTML/script content.
- Inventory records are retained by policy (default: 365 days for closed or decommissioned hosts, indefinite for active hosts).
- Generated reports are kept until deleted or until the completed-report retention window elapses (default: 90 days).

## Direct REST connector model

Each direct REST connector provides a mapping document covering its source endpoints and authentication, source-to-canonical field mapping, per-field confidence and fallback rules, and last successful sync with partial-failure behaviour. Minimum connector output includes `schemaVersion`, `host.hostname` plus one stable identity attribute, the `host.os` object where available, and an `agent` metadata block.

## Automation and integration

- A documented **REST API** is available for customer automation, connectors and customer-side tooling.
- Integration quick starts cover authentication, SIEM, ITSM ticketing webhooks, cloud and virtualisation connectors, and general API integration.

## Governance and assurance

- Role-based administration with an **audit-log subsystem** recording administrator and operational activity.
- Feature mapping to **ISO/IEC 20000-1:2018** clauses supports internal audit and external assurance.
