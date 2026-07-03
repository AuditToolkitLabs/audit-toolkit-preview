# Asset Command Centre — Overview

Asset Command Centre is the agentless asset inventory and discovery collector in the AuditToolkit suite. It is a standalone, cut-down collector and local reporting node for mixed estates across all platforms. It gathers inventory using established host and network protocols — SSH, WinRM, SNMP, IPMI and related access — with no software installed on the target systems.

It is the deliberate counterpart to the CMDB API Data Collection Tool, which collects the same kind of data API-only. Choose Asset Command Centre where API access is not available or not preferred and traditional protocol-based collection is the practical route.

## Who it is for

The service and its documentation are written for the teams who deploy and run it:

- deployment owners
- administrators
- operators
- security reviewers
- customer support contacts

The scope is limited to the Asset Command Centre standalone collector and local reporting service.

## What it does

In its supported release, Asset Command Centre delivers a focused set of outcomes:

- **Inventory collection and reconciliation** for hosts and network assets.
- **Local storage** of collected inventory and operational findings.
- **Local reporting, snapshots, and operator-facing status views.**
- **Audit logging and role-based access** for the application.
- **Super-admin-only portal actions** for certificate, SSH key, API-code, tuning, log, and encryption workflows.
- **Optional upstream forwarding** to a central Audit Toolkit deployment.

## Deployment role

In its primary supported form, the service is deployed close to the managed network and acts as:

1. A collector for outbound management protocols.
2. A local inventory and reporting node.
3. An optional upstream sender when central aggregation is enabled.

The supported standalone target is a single-node Ubuntu Server deployment, with a Docker-based runtime preferred. Because collection is agentless, no host-resident software is required on the assets being inventoried — the collector reaches out to them directly over the network.

## Active operating profile

The release ships with a deliberately conservative default posture:

- Connector operating mode defaults to `legacy-only`.
- Collection profile defaults to `inventory-only`.
- Primary supported connector families are SSH, WinRM, SNMP, IPMI, `nmap-sweep`, and `ansible-unified`.

## How operators work with it

Users sign in to the local web interface and work with the pages their role permits, including:

- **Overview** — inventory totals, connector activity, and health summary
- **Hosts** — host inventory and detail views
- **Network** — network-oriented inventory and topology views
- **Scan Setup** — connector-driven collection jobs
- **Task Runs** — job history and execution state
- **Deployment** — onboarding and key management material
- **Reporting** — local reports, trends, and exports
- **License** — applied tier and effective limits
- **Admin** — account, settings, and access controls
- **Remote Discovery** — encrypted target credential management

Local credentials are the primary documented sign-in baseline, privileged users should complete MFA, and portal-only super-admin actions require a separate portal session.

## What it is not

Asset Command Centre is intentionally narrow. It does not cover deprecated commerce, marketplace, or fulfilment workflows; it does not carry broader CMDB or audit-platform claims that are not implemented for this release; and it does not promise host platforms outside the documented single-node release target. Its default collection intent is inventory gathering and reporting — not broad remediation or unrelated platform automation.
