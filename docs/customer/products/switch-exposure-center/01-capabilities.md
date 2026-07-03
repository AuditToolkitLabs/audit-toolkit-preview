# Capabilities

Switch Exposure Centre gives network teams a switch-focused view of exposure and posture. It
runs two complementary assessments over the same device inventory — vulnerability exposure and
a configuration-hardening audit — and reports the combined risk picture through an operator web
console and a JSON API. This page summarises what the tool can do, grouped by capability area.

## Exposure discovery and inventory

- **API-first collection.** Vendor-specific connectors gather firmware/OS version, modules, and
  interfaces over each vendor's REST/RESTCONF API and emit a common normalised contract.
- **Vendor coverage.** Cisco, Cisco MDS, Juniper, Arista, Aruba, Dell, and Brocade — spanning
  LAN switch families and SAN switches (Cisco MDS, Brocade).
- **Normalisation and reconciliation.** Raw payloads are normalised into a canonical switch
  device profile, then reconciled into device, interface, module, and firmware records with
  source attribution preserved.
- **Network-only boundary.** The collection scope and data model are deliberately narrowed to
  network switches and related equipment, not general servers.
- **Transport flexibility.** Collection prefers vendor APIs; each adapter owns its transport
  selection (for example NX-API, RESTCONF, NETCONF, eAPI, Junos REST) per vendor and platform.

## Advisory, CVE, CVSS, and KEV correlation

- **Advisory ingestion.** Vendor advisories are ingested and joined to devices by vendor,
  platform/OS family, and firmware version to produce device-level exposure records.
- **Per-vendor advisory sources.** Configured per vendor on the Advisory Access page, supporting
  account-backed (private) feeds, public fallback feeds, and customer-managed RSS/XML/CSV
  exports (with starter CSV templates for SAN-oriented onboarding such as Brocade and Cisco MDS).
- **NVD CVE ingestion in three modes.** Free public NVD (no key), the AuditToolkit shared NVD
  service (hosted broker holding the key), or your own NVD API key for a higher rate limit.
- **CISA KEV always merged.** Known-exploited vulnerabilities are flagged regardless of the
  chosen CVE source, so exploited exposures can be prioritised.
- **Scheduled or on-demand sync.** Automatic CVE sync with a configurable interval (60–10080
  minutes) and look-back window (1–120 days), plus a **Sync now** action; the panel shows
  last-run status and next-due time.
- **Public fallback.** Where private vendor advisory access is not supplied, correlation falls
  back to public advisory, CVE, CVSS, and CISA KEV data.

## Configuration hardening audit

- **SSH-based control engine.** Connects to a managed device, captures its running configuration,
  and evaluates it against a shipped hardening control library.
- **Platform coverage.** Controls cover Cisco IOS, IOS-XE, NX-OS and MDS, Juniper Junos, and
  Arista EOS; each control returns PASS/FAIL and results are stored for review.
- **Two views of posture.** A per-device hardening panel and a fleet-wide posture view, giving a
  configuration-hardening complement to the advisory/CVE exposure view.

## Reporting and risk views

- **Exposure summaries and high-risk device lists** aggregated across the estate.
- **KEV/CVSS risk views** to surface known-exploited and high-severity exposures first.
- **Hardening posture** reporting from the control-audit results.
- **EOS/EOL state** and a **remediation backlog** to drive prioritisation.
- **Dashboard trends** endpoint providing time-series data for the console's live visualisations.

## Automation and operations

- **Scheduler service** runs recurring scans and report snapshots on an hourly, daily, weekly, or
  monthly cadence with a configurable time of day.
- **Collection jobs** submit device targets; the connector registry selects the right adapter by
  vendor and platform.
- **Activity/audit log** records device and advisory operations and administrative changes, with
  structured output suitable for SIEM export.

## Access, identity, and administration

- **Role-based access control** with three built-in roles — viewer, operator, and admin —
  enforced in both the browser and the API.
- **OIDC single sign-on** available as an Enterprise-identity entitlement, mapping identity-
  provider groups to product roles.
- **Admin console** for local user management, the NVD/CVE source panel, and licensing.

## Deployment and integration

- **Packaged for Linux** as a `.deb`/`.rpm` with systemd units, served behind a reverse proxy,
  backed by PostgreSQL.
- **JSON API under `/api/v1`** exposing inventory, jobs, advisory and CVE catalogues, hardening,
  reports, and administration for integration and automation.
- **Suite interoperability.** Runs standalone or forwards results to the main AuditToolkit
  platform for a consolidated, cross-domain view.
