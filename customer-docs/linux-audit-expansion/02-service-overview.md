# 2. Service Overview and Scope

*ISO/IEC 20000-1:2018 clauses 4.1–4.4, 8.2*

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-04 |
| Product | AuditToolkit Linux Security Lite |
| Release | v1.1.2 |

---

## 2.1 Service purpose

AuditToolkit Linux Security Lite is a command-line security auditing engine
for Linux hosts. It performs read-only checks against local system state and
produces structured JSON evidence suitable for governance, compliance, and
SIEM consumption.

The tool supports the following business outcomes:

- Continuous host-hardening posture measurement across heterogeneous Linux
  fleets.
- Automated, evidence-based control checking aligned to CIS Benchmarks and
  NIST SP 800-53.
- Scheduled audit execution with retention of timestamped JSON artefacts.
- CI/CD compliance gating to block deployment when security posture
  thresholds are not met.
- SIEM and ticketing integration via structured output that maps directly to
  host-level findings.

## 2.2 Architecture overview

The toolkit is composed of three layers:

| Layer | Component | Purpose |
| --- | --- | --- |
| **Orchestrator** | `orchestrator/orchestrator.sh` | Discovers, filters, runs, and aggregates audit scripts. Produces the final JSON report. |
| **Audit library** | `audits/linux/<domain>/<category>/<name>.sh` | Individual read-only security checks, organised by domain (platform, web, data, apps, storage, network, automation). |
| **Compatibility shims** | `lib/*.sh` | Distro-agnostic wrappers for package managers, service managers, firewall tools, and security feature detection. |

Supporting components:

- `orchestrator/discovery.sh` — lightweight inventory and stack discovery.
- `schema/audit-report.v1.schema.json` — JSON schema contract for all
  consumer tooling.
- `ci/validate-report-schema.py` — schema validation helper used in CI
  gates.

## 2.3 Supported Linux distributions

| Distribution | Supported versions | Package manager | Service manager |
| --- | --- | --- | --- |
| Ubuntu | 22.04 LTS, 24.04 LTS | apt | systemd |
| Debian | 11 (Bullseye), 12 (Bookworm) | apt | systemd |
| RHEL / AlmaLinux / Rocky | 8, 9 | dnf / yum | systemd |
| Fedora | 39, 40, 41 | dnf | systemd |
| openSUSE Leap / Tumbleweed | 15.x | zypper | systemd |
| Alpine Linux | 3.19, 3.20 | apk | OpenRC |
| Arch Linux | Rolling | pacman | systemd |
| Void Linux | Rolling | xbps | runit |
| Gentoo | Stable | emerge | OpenRC / systemd |

Checks that require a specific package manager or service manager are
transparently routed through the compatibility shims in `lib/`. On
distributions without full shim support, individual checks are marked
`[SKIP]` rather than failing.

## 2.4 Run modes

| Mode | Command flag | Description |
| --- | --- | --- |
| **Auto-plan** | `--auto` | Detects installed software and selects matching audit domains automatically. Recommended for general use. |
| **Domain filter** | `--domain <name>` | Runs only the specified domain (e.g. `platform`, `web`, `data`). |
| **Script match** | `--match <pattern>` | Runs audits whose path contains the given string. |
| **Preset** | `--preset <name>` | Runs a pre-defined selection of audits (e.g. `security`, `baseline`). |
| **Discovery only** | N/A — use `orchestrator/discovery.sh` | Produces host inventory and installed-stack JSON without running hardening checks. |
| **Dry run** | `--dry-run` | Prints the audit scripts that would run without executing them. |
| **Interactive** | `--interactive` | Presents a selection menu (requires `fzf` or a fallback shell menu). |

## 2.5 Output contract

All JSON reports are governed by `schema/audit-report.v1.schema.json`.
Top-level sections:

| Section | Contents |
| --- | --- |
| `host_identity` | Hostname, OS release, kernel, architecture, distro ID. |
| `inventory` | Installed packages, running services, open ports. |
| `vulnerabilities` | Summary of CVE-related findings from package metadata. |
| `updates` | Pending security updates detected by the package manager. |
| `hardening` | Control check results with pass/warn/fail/skip counts and per-check detail. |
| `completeness` | Coverage score, confidence score, skip reasons, and privilege level. |
| `remediation` | Suggested remediation references for FAIL findings. |

Schema version 1.0 is stable and backward-compatible within the 1.x line.
Additive changes are communicated via the CHANGELOG before release.

## 2.6 Service boundaries

| Activity | Customer | AuditToolkitLabs |
| --- | --- | --- |
| Provide Linux host for auditing | ✓ | |
| Install and maintain the host OS | ✓ | |
| Install and upgrade the toolkit | ✓ | guidance only |
| Define which hosts are in scope | ✓ | |
| Schedule and operate audit runs | ✓ | |
| Triage and remediate FAIL findings | ✓ | |
| Maintain audit scripts and shim library | | ✓ |
| Release security patches and advisories | | ✓ |
| Provide product documentation | | ✓ |
| Support confirmed product defects | | ✓ |
| Diagnose host OS, network, and storage issues | ✓ | |

---

## 2.7 Licensing model

AuditToolkit Linux Security Lite is licensed under the Business Source
License 1.1 (BSL 1.1). The following table summarises the model; the
canonical terms are in the `LICENSE` file distributed with the product.

| Use case | License required |
| --- | --- |
| Internal security auditing within your organisation, on any number of hosts | Free — no commercial license required |
| Evaluation, testing, non-commercial research | Free |
| Offering audit services to third parties for compensation | Commercial license required |
| Embedding the tool in a commercial product | Commercial license required |
| Operating as a hosted or SaaS service | Commercial license required |

Five years from the date of first public GA release, the software automatically converts
to the MIT License. The Change Date will be published when a stable release is announced
(this software is currently in pre-release beta status).

Contact [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com)
for commercial licensing enquiries.

For the complete licensing terms, EULA, acceptable use requirements, and
pre-use change control obligations, see
[23 — Licensing, Legal Terms, and Acceptable Use](23-licensing-and-legal.md).
