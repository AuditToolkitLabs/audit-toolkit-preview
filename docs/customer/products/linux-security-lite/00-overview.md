# Linux Security Lite — Overview

Linux Security Lite is a lightweight, command-line **security auditing engine for Linux hosts** — in the same family of tools as Lynis. It runs locally on the host, performs read-only checks against local system state, and produces structured JSON evidence suitable for governance, compliance, and SIEM consumption.

It is aimed at Linux administrators and security teams who want fast, scriptable, host-level hardening checks without installing a heavy platform. When a central view is needed, it can feed its evidence upstream to the main AuditToolkit platform.

## What it delivers

- Read-only security auditing of Linux hosts from local system state.
- Multi-distribution support through a compatibility shim layer, so the same audit logic runs consistently across different package and service managers.
- Domain-based checks covering platform, access, network, advanced controls, web, data, applications, storage, and automation.
- Structured JSON reports aligned to the audit-report schema v1.0, ready for governance, compliance, and SIEM consumption.
- Standardised findings with `[PASS]`, `[WARN]`, `[FAIL]`, and `[SKIP]` markers, plus deterministic per-run summaries for repeatable reporting.

## Core principles

- **Read-only by design** — the tool never remediates or changes state on the target host.
- **Portable audit logic** — distro, service, and firewall differences are handled by shims, so checks behave predictably everywhere.
- **Reproducible output** — a consistent execution order and a stable output shape make results comparable over time.
- **Linux-only scope** — non-Linux endpoints, cloud-resource posture, and network-based scanning are out of scope.

## How it runs

Core interaction is via the `audit-toolkit` command, or by invoking the orchestrator directly:

```bash
audit-toolkit --auto --json /var/log/audit-toolkit/report.json
```

Root or `sudo` access is strongly recommended. The tool runs without root, but checks that require elevated privilege are marked `[SKIP]` and excluded from the coverage score.

Run modes include automatic auto-plan (`--auto`), domain filtering (`--domain`), pattern matching (`--match`), pre-defined presets (`--preset`), dry runs, and an interactive selection menu. A lightweight local web console is also available for operators.

## Output model

Each check emits a one-line result with a severity marker:

```text
[PASS] SSH PermitRootLogin is disabled
[WARN] package metadata refresh skipped without root
[FAIL] firewall not active
[SKIP] control not applicable on detected distro
```

The orchestrator aggregates these into a JSON report whose top-level sections cover host identity, inventory, vulnerabilities, pending updates, hardening results, completeness (coverage and confidence scores), and remediation references.

## Business outcomes

When integrated as described in the product documentation, Linux Security Lite supports:

- Continuous host-hardening posture measurement across heterogeneous Linux fleets.
- Automated, evidence-based control checking aligned to CIS Benchmarks and NIST SP 800-53.
- Scheduled audit execution with retention of timestamped JSON artefacts.
- CI/CD compliance gating and SIEM/ticketing integration via export of structured output (these require user-side scripting or integration with the main AuditToolkit platform).

## Licensing

Linux Security Lite is licensed under the Business Source License 1.1 (BSL 1.1). Internal security auditing within your organisation, on any number of hosts, is free. Offering audit services to third parties, embedding the tool in a commercial product, or operating it as a hosted service requires a commercial licence. Contact [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com) for commercial licensing enquiries.

> This is the platform **Linux Security Lite** engine (a full control catalogue across multiple audit domains), distinct from the Lite add-on "Linux Host Lite".
