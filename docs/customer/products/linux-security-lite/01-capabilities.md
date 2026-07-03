# Linux Security Lite — Capabilities

Linux Security Lite is a host-level Linux security auditing engine. This page summarises what the tool can do: the security control domains it checks, how audits are selected and scheduled, the reporting it produces, and how that output integrates with wider systems. Every check is **read-only** — the tool measures posture and produces evidence, it never changes state on the target host.

## Control coverage

Audit scripts are organised by domain under `audits/linux/<domain>/<category>/<name>.sh`. Coverage spans:

- **Platform** — OS package update posture, essential service state (SSH, cron, NTP, syslog), and OS baseline (kernel version, login banners, core dumps, ASLR).
- **Access control** — SSH daemon hardening, sudo configuration, user-account hygiene, SUID/SGID and world-writable inventory, and sensitive file/log permissions.
- **Network** — active firewall presence (ufw/iptables/nftables/firewalld), egress allowlisting, intrusion prevention (Fail2ban), and DNS resolver security.
- **Advanced controls** — kernel sysctl hardening, PAM password policy and account lockout, shadow-password aging, auditd, logging infrastructure, MAC frameworks (AppArmor/SELinux), file integrity monitoring (AIDE/Tripwire), umask, and cron access control.
- **Web, data, and applications** — web-server, database, container, Kubernetes, dependency, application-framework (Java, Node.js, PHP, Python, Ruby), and messaging audits.
- **Storage** — archive, backup/DR, object storage, and shares audits.
- **Virtualisation and cloud** — hypervisor audits (KVM/QEMU, Proxmox, Xen) and cloud-integration and EDR/SIEM agent audits.
- **Automation** — audits for automation and configuration tooling.

Controls are classified into three tiers: **required** (minimum baseline, always run first by `--preset security`), **recommended** (defence-in-depth, run after required), and **optional** (domain-specific audits run on demand). Each control is mapped to CIS, NIST SP 800-53, PCI DSS, and DISA STIG citations — see the Capability Matrix.

## Selecting and running audits

The tool offers several run modes so audits can be scoped to the task at hand:

- **Auto-plan** (`--auto`) — detects installed software and selects matching audit domains automatically. Recommended for general use.
- **Domain filter** (`--domain <name>`) — runs a single domain, e.g. `platform`, `web`, `data`.
- **Script match** (`--match <pattern>`) — runs audits whose path contains a given string.
- **Preset** (`--preset <name>`) — runs a pre-defined selection such as `baseline`, `security`, or `full`, plus domain-grouped presets (`apps`, `containers`, `kubernetes`, `dependencies`, `hypervisors`, `storage`).
- **Discovery only** — produces host inventory and installed-stack JSON without running hardening checks.
- **Dry run** (`--dry-run`) — prints which scripts would run without executing them.
- **Interactive** (`--interactive`) — presents a selection menu.

Root or `sudo` is recommended; checks needing elevated privilege are marked `[SKIP]` and excluded from the coverage score rather than failing the run. On distributions without full compatibility-shim support, individual checks `[SKIP]` rather than fail.

## Scheduling

Audits are designed for repeatable, unattended execution:

- Scheduled runs via cron, systemd timers, or configuration-management tooling (customer-operated).
- Predictable output paths and execution logging.
- Retention of timestamped JSON artefacts, supporting posture trending over time.

## Reporting and evidence

- Structured JSON reports governed by `schema/audit-report.v1.schema.json` (stable and backward-compatible within the 1.x line).
- Top-level report sections: host identity, inventory, vulnerabilities, pending security updates, hardening results (pass/warn/fail/skip with per-check detail), completeness (coverage and confidence scores, skip reasons, privilege level), and remediation references for FAIL findings.
- One-line `[PASS]` / `[WARN]` / `[FAIL]` / `[SKIP]` markers per check, with per-domain summary tables.
- A CI schema-validation helper (`ci/validate-report-schema.py`) to confirm reports conform to the contract.
- A lightweight local web console for operators, with tier-gated enterprise pages for compliance, trending, webhooks, and SIEM export.

## Integration

Linux Security Lite exports evidence; downstream automation is driven by that output:

- **CI/CD compliance gates** — block deployment when posture thresholds are not met (requires user-side scripting or an external system).
- **SIEM and ticketing** — ingest structured JSON that maps directly to host-level findings (requires user-side ingestion or the main AuditToolkit platform).
- **Central management** — feed evidence upstream to the main AuditToolkit platform when a central view, dashboards, or managed integration are required.

> Direct push, managed integration, and automated gating are **not** built into the standalone tool — they require user-side scripting or the main AuditToolkit platform.
