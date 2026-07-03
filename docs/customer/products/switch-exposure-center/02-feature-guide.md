# Architecture

Switch Exposure Centre is a switch-focused CMDB and exposure platform with an
operator web console. Over the same inventory it performs two complementary
assessments: **vulnerability exposure** (API-collected firmware/OS inventory
correlated against vendor advisories and CVEs) and a **configuration-hardening
audit** (SSH evaluation of a device's running configuration against a shipped
control library).

## Technology

- Python **Flask** web application — a blueprint-structured JSON API under
  `/api/v1` plus a static operator console.
- **PostgreSQL** database accessed through SQLAlchemy. (SQLite is supported only
  as a local-development convenience.)
- Background **worker** and **scheduler** services for collection jobs and
  recurring runs.
- Packaged as a `.deb`/`.rpm` with systemd units, served behind a reverse proxy
  in production.

## Components

### Web API and console

The Flask service exposes device inventory, collection jobs, advisory and CVE
catalogues, risk and remediation reports, the hardening audit, the NVD/CVE source
configuration, licensing, and administration. A static operator console —
organised around a left-hand collapsible sidebar (Dashboard, Inventory,
Exposure, Activity Log, Automation, Administration) — renders these. Access is
gated by RBAC role: `viewer`, `operator`, `admin`.

### Connector layer

Vendor-specific collectors (Cisco, Cisco MDS, Juniper, Arista, Aruba, Dell,
Brocade) gather inventory — firmware/OS version, modules, and interfaces — over
each vendor's REST/RESTCONF API and emit a common normalised contract. Each
adapter owns its transport selection and vendor-specific parsing.

### Reconciliation layer

Normalised device profiles are reconciled into device, interface, module, and
firmware records, preserving source attribution.

### Advisory and CVE enrichment

Vendor advisories are ingested and joined to devices by vendor, platform/OS
family, and firmware version to produce exposure records. CVE data is synced
from the National Vulnerability Database in three source modes — the public NVD
feed (no key), a shared broker that holds the key on the customer's behalf, or a
customer-supplied NVD API key — with CISA KEV merged to flag known-exploited
CVEs. Ingestion can run on a schedule and is configured from the admin console.

### Hardening audit engine

An SSH-based (paramiko) control engine connects to a device, captures its
running configuration, and evaluates it against a shipped control library
(`hardening_controls.json`) covering Cisco IOS, IOS-XE, NX-OS and MDS, Juniper
Junos, and Arista EOS. Results surface as a per-device hardening panel and a
fleet-wide posture view under `/api/v1/hardening`.

### Reporting layer

Builds exposure summaries, high-risk device lists, hardening posture, KEV/CVSS
risk, EOS/EOL state, and remediation views for the console.

### Scheduling

A scheduler service runs recurring scans and report snapshots on an
hourly, daily, weekly, or monthly cadence with a configurable time of day.

## Data flow

1. A device target is submitted as a collection job.
2. The connector registry selects the adapter for the vendor and platform.
3. The adapter collects inventory over the vendor's REST/RESTCONF API.
4. Raw payloads are normalised into a canonical switch device profile.
5. The profile is reconciled into device, interface, module, and firmware records.
6. Advisory and CVE enrichment matches the device's firmware/OS against advisory
   ranges and the CVE catalogue to record exposures.
7. A configuration-hardening audit can be run against the device over SSH,
   evaluating its running configuration against the control library.
8. Reporting aggregates risk posture, KEV exposure, hardening posture, and the
   remediation backlog for the console.

## Vendor coverage

| Vendor    | Inventory transport      | Advisory source                                 |
| --------- | ------------------------ | ----------------------------------------------- |
| Cisco     | NX-API / RESTCONF / NETCONF | Cisco PSIRT feed or account-backed configured feed |
| Juniper   | NETCONF / Junos REST     | Account-backed configured feed or public fallback |
| Arista    | eAPI / REST              | Account-backed configured feed or public fallback |
| Aruba     | REST                     | Account-backed configured feed or public fallback |
| Dell      | REST                     | Account-backed configured feed or public fallback |
| Cisco MDS | REST (SAN)               | Account-backed configured feed or customer CSV    |
| Brocade   | REST (SAN)               | Account-backed configured feed or customer CSV    |

Vendor advisory sources are configured per vendor on the Advisory Access page;
where private access is not supplied, the tool falls back to public advisory,
CVE, CVSS, and CISA KEV data.
