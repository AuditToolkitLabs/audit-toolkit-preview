# CMDB API Data Collection Tool Overview

## Purpose

CMDB API Data Collection Tool gathers asset and configuration data from a
customer estate using endpoint agents, API connectors, and direct REST API
calls. Collected data is normalized, stored in a CMDB-oriented data model,
enriched where supported, and surfaced through dashboards, host detail pages,
scheduled reports, and automation endpoints.

## Primary Outcomes

The product supports:

- Continuous asset inventory and ownership tracking.
- Patch and vulnerability posture reporting.
- Evidence collection for internal audit and external assurance.
- Capacity and lifecycle planning.
- Connector-based collection from virtualization and cloud platforms.
- Managed agent onboarding for endpoint collection.

## In-Scope Components

| Component            | Customer-facing role                                                                   |
| -------------------- | -------------------------------------------------------------------------------------- |
| Web application      | Administration console, dashboards, reporting, user management, and operational views. |
| REST API             | Access for agents, connectors, and customer automation.                                |
| Windows agent        | Endpoint collection for supported Windows systems.                                     |
| Linux agent          | Endpoint collection for supported Linux systems.                                       |
| Managed agent server | Coordination point for fleet deployments.                                              |
| Database schema      | CMDB storage and migration model.                                                      |
| Audit log subsystem  | Evidence of administrator and operational activity.                                    |

## Supported Deployment Scope

The source customer docs describe support for Linux or Windows Server
application hosts, PostgreSQL for production, SQLite for evaluation, and modern
Windows and Linux endpoints under management. Exact support boundaries should
be confirmed against the release notes and product-specific install page.

## Service Boundaries

Customers provide and operate host infrastructure, OS patching, database,
backups, network access, endpoint agent maintenance, user administration, and
service monitoring. AuditToolkitLabs provides product fixes, security patches,
documentation, and support guidance for confirmed product defects.

## Out Of Scope

Unless a written agreement states otherwise, the product does not include host
hardware, OS support, network infrastructure, customer-specific connectors,
custom reports, bespoke integrations, or lifecycle management of inventoried
end-user devices.

## Product-Specific Follow-Up Pages

Planned product pages include connector setup, managed agent onboarding, API
data collection catalog, tenancy and workspace governance, database
maintenance, SIEM ITSM webhook reference, and operational limits.
