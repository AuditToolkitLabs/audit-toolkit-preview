# Product Overview

## Summary

Switch Exposure Center is a Flask-based product for collecting switch inventory
and exposure data, normalising it, and presenting the result through a static
console and API.

## Main capabilities

- Collect inventory from Cisco, Juniper, Arista, Aruba, Dell, Brocade, and Cisco MDS devices
- Scan SAN switches as first-class targets alongside LAN switch families
- Correlate advisories, CVEs, CVSS, and KEV status against device state
- Track exposures and remediation status in a SQLAlchemy-backed data model
- Expose operational views through API endpoints and a browser console

## Core runtime pieces

- Flask application factory and route registration
- SQLAlchemy models for devices, advisories, exposures, jobs, and reports
- Connector layer for vendor-specific collection and normalisation
- Advisory enrichment layer for vendor bulletins and vulnerability metadata
- Static HTML, CSS, and JavaScript UI for operator interaction

## Collection patterns

The product prefers API-backed collection. SSH, SNMP, and NETCONF are used as
fallback or extension paths when a vendor or customer environment needs them.
This keeps the collection model practical while still supporting mixed estates,
including SAN switch families that can be collected and scanned through the
same operational workflow.

## Advisory handling

Advisories can be sourced from public feeds, vendor account-backed feeds, or
customer-managed file exports where a private feed must be delivered as a
local file.

## Operational outcome

The intended outcome is a single switch-centred view that helps teams answer:

- What equipment do we have?
- Which firmware or OS train is installed?
- Which advisories apply?
- What is the remediation priority?
