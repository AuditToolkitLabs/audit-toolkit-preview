# Switch Exposure Center Overview

## Purpose

Switch Exposure Center collects switch inventory and exposure data, normalizes
it, correlates advisory and vulnerability metadata, and presents the results
through an operator console and API.

It is intended for customers who need a switch-centered view of network device
state, exposure priority, advisory impact, remediation status, and reporting.

## Primary Outcomes

Switch Exposure Center helps teams answer:

- What switch equipment is present?
- Which firmware or OS train is installed?
- Which advisories or CVEs apply?
- Which exposure items need remediation first?
- Which jobs, reports, or API outputs support operational review?

## Main Capabilities

- Inventory collection from common switch families.
- SAN switch handling alongside LAN switch families.
- Advisory, CVE, CVSS, and KEV correlation against device state.
- Exposure and remediation status tracking.
- API endpoints and browser console for operational workflows.
- Scheduler-backed advisory or collection jobs where configured.
- Controlled pentest and network-scanning workflow documentation.

## Runtime Components

| Component                 | Customer-facing role                                 |
| ------------------------- | ---------------------------------------------------- |
| Flask application         | Product runtime and API route registration.          |
| SQLAlchemy model          | Devices, advisories, exposures, jobs, and reports.   |
| Connector layer           | Vendor-specific collection and normalization.        |
| Advisory enrichment layer | Vendor bulletin and vulnerability metadata handling. |
| Static console            | Browser-based operator interaction.                  |

## Collection Pattern

The product prefers API-backed collection. SSH, SNMP, and NETCONF may be used
as fallback or extension paths when a vendor or customer environment requires
them. Customers should validate authorization, rate limits, and maintenance
windows before enabling recurring collection or scanning.

## Advisory Handling

Advisory sources may include public feeds, vendor account-backed feeds, or
customer-managed file exports for private feed delivery.

## Product-Specific Follow-Up Pages

Planned product pages include advisory refresh, scheduler, API usage, exposure
reporting, pentest and network scanning, and operational limits.
