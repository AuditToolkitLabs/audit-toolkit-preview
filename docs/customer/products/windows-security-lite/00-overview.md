# Windows Security Lite — Overview

Windows Security Lite is a lightweight, self-contained, single-host Windows
security audit tool. It performs read-only security checks against the local
Windows host and produces structured findings, scores, and a human-readable
report for governance, compliance, and operational review. It forms part of the
AuditToolkit Lite add-on range.

The tool is available as a command-line interface (CLI) and as a WinForms GUI,
and ships as an MSI installer for straightforward end-user and administrator
deployment.

## What it does

Windows Security Lite supports:

- Host security posture assessment on a single Windows system.
- Structured findings output with severity ratings, a hardening index, and
  baseline references.
- Evidence-ready JSON artifacts for compliance review and audit workflows.
- Flat CSV export for dashboard import or Excel-based review.
- A human-readable HTML report with category scores and a coverage summary.
- One-click audit execution through the optional GUI launcher.
- Built-in online activation and offline licence import.

All checks are strictly read-only: the tool inspects the host and reports on it,
but never changes configuration.

## Output files

Each audit run produces the following files in the configured output path:

| File                | Contents                                                            |
| ------------------- | ------------------------------------------------------------------- |
| `audit-result.json` | Full scan result — findings, scores, coverage, baseline references. |
| `metadata.json`     | Host identity, run context, coverage percent.                       |
| `findings.csv`      | Flat findings export for dashboard import or Excel review.          |
| `summary.html`      | Human-readable report with Hardening Index and category scores.     |

## Deployment

Windows Security Lite installs via a Windows MSI on Windows 10 (1903+),
Windows 11, and Windows Server 2019 or later. The installer places files under
`C:\Program Files\AuditToolkitLabs\AuditToolkitLite\` and creates a Start Menu
shortcut under **AuditToolkitLabs → AuditToolkit Security Lite**. No reboot is
required.

PowerShell 7.x (`pwsh`) is recommended. Windows PowerShell 5.1 is also
supported.

## Licensing

Windows Security Lite includes a built-in activation model. Customers activate
with an online licence key or import a signed offline licence file for
air-gapped hosts. Licence state is cached locally at
`%LOCALAPPDATA%\AuditToolkitLabs\AuditToolkitLite\licence.json` and does not
require network access after activation. Subsequent audit runs never contact the
licensing service, which makes the tool suitable for isolated and offline
environments.

## Service boundaries

The customer is responsible for the host, operating system, PowerShell runtime,
licence activation, output path, report retention, and any downstream use of
findings.

AuditToolkitLabs provides product releases, bug fixes, security advisories,
documentation, and support guidance for confirmed product issues.

## Related pages

- [Capabilities](01-capabilities.md)
- [Feature Guide](02-feature-guide.md)
