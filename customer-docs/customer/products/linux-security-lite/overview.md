# AuditToolkit Linux Security Lite Overview

## Purpose

AuditToolkit Linux Security Lite is a Linux-only command-line security audit
engine. It performs read-only checks against local Linux system state and
produces structured JSON evidence for governance, compliance, reporting, and
SIEM consumption.

## Primary Outcomes

Linux Security Lite supports:

- Host-hardening posture measurement across Linux fleets.
- Evidence-based control checking aligned to security benchmarks and controls.
- Scheduled audit execution with timestamped JSON artifacts.
- CI/CD compliance gates through customer-side scripting.
- SIEM and ticketing ingestion through structured report export.

The standalone tool exports data. Direct push, managed integration, and central
dashboards require customer-side integration or the main AuditToolkit platform.

## Architecture

| Layer | Component | Purpose |
| --- | --- | --- |
| Orchestrator | `orchestrator/orchestrator.sh` | Discovers, filters, runs, and aggregates audit scripts. |
| Audit library | `audits/linux/<domain>/<category>/<name>.sh` | Read-only checks organized by domain and category. |
| Compatibility shims | `lib/*.sh` | Distro-agnostic wrappers for package, service, firewall, and security detection. |

Supporting components include discovery, a stable JSON report schema, and a CI
schema validation helper.

## Supported Linux Scope

The product is intended for heterogeneous Linux estates. Supported families in
the source docs include Ubuntu, Debian, RHEL-derived distributions, Fedora,
openSUSE, Alpine, Arch, Void, and Gentoo, with service-manager differences
handled through compatibility shims where supported.

Checks that cannot apply to a distribution should skip rather than fail the
entire run.

## Run Modes

Common customer run modes include:

- Auto-plan runs based on detected host state.
- Domain-filtered runs.
- Script-name matching.
- Preset runs.
- Discovery-only inventory.
- Dry-run preview.
- Interactive selection where supported tooling is available.

## Output Contract

Reports are governed by the `audit-report.v1` schema. Typical sections include
host identity, inventory, vulnerabilities, updates, hardening results,
completeness, and remediation references.

## Product-Specific Follow-Up Pages

Planned product pages include installation, scheduled audits, CI/CD compliance
gates, SIEM integration, agent mode, STIG coverage, and Linux-only constraints.
