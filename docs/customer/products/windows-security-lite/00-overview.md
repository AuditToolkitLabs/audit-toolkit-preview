# AuditToolkit Windows Security Lite Overview

## Purpose

AuditToolkit Windows Security Lite is a lightweight, self-contained,
single-host Windows security audit tool. It performs read-only security checks
against the local Windows host and produces structured findings, scores, and a
human-readable report for governance, compliance, and operational review.

The tool is available as a CLI and as a WinForms GUI, and ships as an MSI
installer for end-user and administrator deployment.

## Primary Outcomes

Windows Security Lite supports:

- Host security posture assessment on a single Windows system.
- Structured findings output with severity ratings, hardening index, and
  baseline references.
- Evidence-ready JSON artifacts for compliance review and audit workflows.
- Flat CSV export for dashboard import or Excel-based review.
- Human-readable HTML report with category scores and coverage summary.
- One-click audit execution through the optional GUI launcher.
- Built-in online activation and offline licence import.

## Architecture

| Layer        | Component                                        | Purpose                                                           |
| ------------ | ------------------------------------------------ | ----------------------------------------------------------------- |
| CLI          | `audittoolkit-windows-security-lite`             | Primary execution, activation, status, and offline import.        |
| GUI launcher | `src\gui\Invoke-AuditToolkitGUI.ps1`             | Optional WinForms wrapper for users who prefer not to use the CLI.|
| Audit engine | `src\core\AuditEngine.psm1`                      | Coordinates module execution, scoring, and result assembly.       |
| Modules      | `src\modules\<Name>\<Name>.psm1`                 | Individual read-only check implementations.                       |
| Profiles     | `src\profiles\default.json`                      | Controls which modules run and how results are grouped.           |
| Baselines    | `src\baselines\mappings\check-mapping.json`      | Maps each check to baseline references and severity.              |

## Output Files

Each audit run produces the following files in the configured output path:

| File               | Contents                                                              |
| ------------------ | --------------------------------------------------------------------- |
| `audit-result.json` | Full scan result — findings, scores, coverage, baseline references. |
| `metadata.json`     | Host identity, run context, coverage percent.                        |
| `findings.csv`      | Flat findings export for dashboard import or Excel review.           |
| `summary.html`      | Human-readable report with Hardening Index and category scores.      |

## Supported Deployment Models

Product releases support:

- Windows MSI installation on Windows 10 (1903+), Windows 11, and Windows
  Server 2019 or later.

The MSI installer places files under
`C:\Program Files\AuditToolkitLabs\AuditToolkitLite\` and creates a Start Menu
shortcut under **AuditToolkitLabs → AuditToolkit Security Lite**.

PowerShell 7.x (`pwsh`) is recommended. Windows PowerShell 5.1 is also
supported.

## Licence Model

Windows Security Lite includes a built-in activation model. Customers activate
with an online licence key or import a signed offline licence file. Licence
state is cached locally at `%LOCALAPPDATA%\AuditToolkitLabs\AuditToolkitLite\licence.json`
and does not require network access after activation.

For the full licensing policy see the
[Licensing Overview](../../../licensing/overview.md).

## Service Boundaries

The customer is responsible for the host, operating system, PowerShell runtime,
licence activation, output path, report retention, and any downstream use of
findings.

AuditToolkitLabs provides product releases, bug fixes, security advisories,
documentation, and support guidance for confirmed product issues.

## Product-Specific Follow-Up Pages

- [Installation and First Audit](01-installation-and-first-audit.md)
- [Configuration and Scan Profiles](02-configuration.md)
- [Output Schema Reference](03-output-schema-reference.md)
- [CI/CD Gate Integration](04-ci-cd-integration.md)
