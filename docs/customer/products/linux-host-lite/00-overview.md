# Linux Host Lite — Overview

Linux Host Lite is a lightweight, self-contained security baseline auditing and
reporting tool for a single Linux host. It performs read-only security checks
against the local system and produces structured findings, category scores, and
a human-readable report for governance, compliance, and operational review.
Linux Host Lite is part of the AuditToolkit Lite add-on.

## What it does

The tool assesses the security posture of one Linux host and turns the results
into evidence you can act on and retain:

- Read-only posture assessment across host security categories such as accounts,
  firewall, and sudo.
- Structured findings with severity ratings, an overall Hardening Index, and
  baseline references.
- Evidence-ready JSON artefacts for compliance review and audit workflows.
- Flat CSV export for dashboard import or spreadsheet review.
- A human-readable HTML report with category scores and a coverage summary.
- Built-in online activation and offline licence import for air-gapped hosts.

## Lightweight by design

Linux Host Lite requires only Python 3.10 or later and uses the standard
library. There are no pip packages to install, no internet connection needed at
run time, and no external tooling to manage. The tool runs entirely on the local
host — no connection to a central server is required during an audit. This makes
it equally suitable for interactive use and for non-interactive execution inside
a CI/CD pipeline or scheduled job.

## Output files

Each audit run writes a complete, self-contained set of files to the configured
output path:

| File                | Contents                                                             |
| ------------------- | -------------------------------------------------------------------- |
| `audit-result.json` | Full audit result — findings, scores, coverage, baseline references. |
| `metadata.json`     | Host identity and run context.                                       |
| `findings.csv`      | Flat findings export for import or spreadsheet review.               |
| `summary.html`      | Human-readable report with Hardening Index and category scores.      |

## Supported deployment

Linux Host Lite ships as native Linux packages:

- DEB package for Debian 11+ and Ubuntu 20.04+.
- RPM package for RHEL 8+, Rocky Linux 8+, and AlmaLinux 8+.

## Licensing

Linux Host Lite includes a built-in activation model. You activate with an
online licence key or import a signed offline licence file. Licence state is
cached locally after activation and does not require network access for
subsequent audit runs, so the tool works in fully air-gapped environments.

## Service boundaries

You are responsible for the host, operating system, Python runtime, licence
activation, output path, report retention, and any downstream use of findings.
AuditToolkitLabs provides product releases, bug fixes, security advisories,
documentation, and support guidance for confirmed product issues.

## In this section

- [Capabilities](01-capabilities.md) — a summary of what the tool can do.
- [Feature Guide](02-feature-guide.md) — the full output schema reference for
  consuming results in dashboards, ticketing systems, and compliance workflows.
