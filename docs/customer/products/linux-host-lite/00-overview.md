# AuditToolkit Linux Host Lite Overview

## Purpose

AuditToolkit Linux Host Lite is a lightweight, self-contained, single-host
Linux security audit tool. It performs read-only security checks against the
local Linux host and produces structured findings, scores, and a human-readable
report for governance, compliance, and operational review.

The tool requires only Python 3.10 or later and uses the standard library only.
No pip packages, no internet connection, and no external tooling are required
at run time.

## Primary Outcomes

Linux Host Lite supports:

- Host security posture assessment on a single Linux system.
- Structured findings output with severity ratings, hardening index, and
  baseline references.
- Evidence-ready JSON artifacts for compliance review and audit workflows.
- Flat CSV export for dashboard import or manual review.
- Human-readable HTML report with category scores and coverage summary.
- Built-in online activation and offline licence import.

## Architecture

| Layer       | Component                                      | Purpose                                                          |
| ----------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| CLI         | `audittoolkit-linux-host-lite`                 | Primary execution, activation, status, and offline import.       |
| Audit engine | `src/core/audit_engine.py`                    | Coordinates module execution, scoring, and result assembly.      |
| Modules     | `src/modules/<name>.py`                        | Individual read-only check implementations.                      |
| Profiles    | `src/profiles/default.json`                    | Controls which modules run and how results are grouped.          |
| Baselines   | `src/baselines/mappings/check-mapping.json`    | Maps each check to baseline references and severity.             |

## Output Files

Each audit run produces the following files in the configured output path:

| File               | Contents                                                              |
| ------------------ | --------------------------------------------------------------------- |
| `audit-result.json` | Full audit result — findings, scores, coverage, baseline references. |
| `metadata.json`     | Host identity and run context.                                       |
| `findings.csv`      | Flat findings export for import or spreadsheet review.               |
| `summary.html`      | Human-readable report with Hardening Index and category scores.      |

## Supported Deployment Models

Product releases support:

- Linux DEB package deployment on Debian 11+ and Ubuntu 20.04+.
- Linux RPM package deployment on RHEL 8+, Rocky Linux 8+, and AlmaLinux 8+.

The tool runs entirely on the local host. No network connection to a central
server is required during audit execution.

## Licence Model

Linux Host Lite includes a built-in activation model. Customers activate with
an online licence key or import a signed offline licence file. Licence state is
cached locally and does not require network access after activation.

For the full licensing policy see the
[Licensing Overview](../../../licensing/overview.md).

## Service Boundaries

The customer is responsible for the host, operating system, Python runtime,
licence activation, output path, report retention, and any downstream use of
findings.

AuditToolkitLabs provides product releases, bug fixes, security advisories,
documentation, and support guidance for confirmed product issues.

## Product-Specific Follow-Up Pages

- [Activation and First Audit](01-activation-and-first-audit.md)
- [Configuration and Scan Profiles](02-configuration.md)
- [Output Schema Reference](03-output-schema-reference.md)
- [CI/CD Gate Integration](04-ci-cd-integration.md)
