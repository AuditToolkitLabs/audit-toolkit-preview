# Overview

Switch Exposure Centre is the AuditToolkit suite's tool for **network engineers**. It is a
switch-focused CMDB and exposure platform: it inventories your network switches and related
equipment, correlates them against vendor advisories and CVEs, audits their running
configuration against a hardening control library, and reports exposure and remediation
state — with a focus on **firmware and configuration risk** across the network estate.

## Who it is for

Network engineers and network security teams who need to know, across their switch estate:
what equipment they have, what firmware it runs, which advisories and vulnerabilities apply,
how well each device is hardened, and what to remediate first.

## Two halves of one audit

Switch Exposure Centre runs two complementary assessments over the same device inventory:

- **Vulnerability exposure.** Per-vendor REST/RESTCONF connectors collect firmware/OS
  version, modules, and interfaces. That inventory is then matched against advisory
  affected-version ranges and a CVE catalogue to produce device-level exposure findings.
- **Configuration hardening audit.** An SSH-based control engine evaluates each device's
  running configuration against a shipped hardening control library (Cisco IOS/IOS-XE/NX-OS
  and MDS, Juniper Junos, Arista EOS), surfacing a per-device hardening panel and a
  fleet-wide posture view.

## What makes it distinct

- **Network-only product boundary.** The collection and data model are deliberately narrowed
  to network switches and related equipment, rather than general servers.
- **API-first collection.** It prefers vendor APIs/REST endpoints per device, normalising data
  strongly before it is stored.
- **Advisory- and CVE-driven correlation.** Exposure is derived by correlating inventory
  against vendor security advisories and an ingested CVE catalogue.
- **NVD CVE ingestion.** CVE data is synced from the National Vulnerability Database — using
  the public feed, a shared broker, or your own NVD API key — with CISA KEV merged to flag
  known-exploited vulnerabilities.
- **Risk reporting centred on firmware, hardening, and remediation state**, presented through
  an operator-oriented web console with a left-hand collapsible sidebar.

## Vendor coverage

Vendor-specific connectors gather inventory over each vendor's REST/RESTCONF API for Cisco,
Cisco MDS, Juniper, Arista, Aruba, Dell, and Brocade. Vendor advisory sources are configured
per vendor on the Advisory Access page; where private account-backed access is not supplied,
the tool falls back to public advisory, CVE, CVSS, and CISA KEV data.

## Access and roles

The console enforces role-based access with three built-in roles — **viewer** (read-only
dashboard and inventory), **operator** (connectors, advisories, CVE catalogue, automation,
and settings), and **admin** (full access including user management, the NVD/CVE source, and
licensing). Single sign-on via OIDC is available as an Enterprise-identity entitlement.

## How it fits with the rest of the suite

Like the other suite collectors, it is a sellable, standalone data-collection and reporting
tool aimed at its own market (networking), and it can forward results to the main AuditToolkit
platform where a consolidated, cross-domain view is required.

## Where to go next

- **Capabilities** — a grouped summary of what the tool can discover, correlate, and report.
- **Feature Guide** — the architecture and component reference, including data flow and the
  full vendor coverage table.
