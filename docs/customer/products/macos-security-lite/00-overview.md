# AuditToolkit macOS Security Lite Overview

## Purpose

AuditToolkit macOS Security Lite is a lightweight, self-contained, single-host
macOS security audit tool. It performs read-only security checks against the
local macOS system and produces structured findings, scores, and a
human-readable report for governance, compliance, and operational review.

The tool requires only Python 3.10 or later and uses the standard library only.
No pip packages, no internet connection, and no external tooling are required
at run time. A local web report viewer is included for interactive report
review.

## Primary Outcomes

macOS Security Lite supports:

- Host security posture assessment on a single macOS system.
- Structured findings output with severity ratings, hardening index, and
  host profile context.
- Evidence-ready JSON artifacts for compliance review and audit workflows.
- Human-readable HTML report accessible from a local web viewer.
- Built-in online activation and offline licence import.

## Architecture

| Layer        | Component                                        | Purpose                                                          |
| ------------ | ------------------------------------------------ | ---------------------------------------------------------------- |
| CLI          | `audittoolkit-macos-security-lite`               | Primary execution, activation, status, import, and web viewer.  |
| Audit engine | `runtime/invoke_audittoolkit_macos.py`           | Coordinates module execution, scoring, and result assembly.     |
| Modules      | `runtime/modules/`                               | Individual read-only check implementations.                     |
| Profiles     | `runtime/profiles/default.json`                  | Controls which modules run and how results are grouped.         |
| Web viewer   | Local server on port 8766                        | Browser-based report review from the most recent audit run.     |

## Output Files

Each audit run produces the following files in the configured output path:

| File                       | Contents                                                           |
| -------------------------- | ------------------------------------------------------------------ |
| `macos-security-report.json` | Full audit result — findings, scores, host profile, hardening index. |
| `summary.html`               | Human-readable report with Hardening Index and category scores.   |

## Supported Deployment Models

Product releases support:

- macOS DMG installation on macOS 10.15 (Catalina) or later.
- macOS PKG installation for administrator or scripted deployment.

The DMG provides a drag-to-Applications install. The PKG places the app at
`/Applications/AuditToolkit-macOS-Security-Lite.app` and creates a CLI wrapper
at `/usr/local/bin/audittoolkit-macos-security-lite`.

**Important:** Pre-release builds are unsigned. macOS Gatekeeper will block the
app on first launch. Customers must allow the app via System Settings → Privacy
& Security → Open Anyway before the first run.

## Licence Model

macOS Security Lite includes a built-in activation model. Customers activate
with an online licence key or import a signed offline licence file. Licence
state is cached locally at `~/.audittoolkit/macos-security-lite/licence.json`
and does not require network access after activation.

For the full licensing policy see the
[Licensing Overview](../../../licensing/overview.md).

## Service Boundaries

The customer is responsible for the macOS host, Python runtime, Gatekeeper
approval for the product, licence activation, output path, report retention,
and any downstream use of findings.

AuditToolkitLabs provides product releases, bug fixes, security advisories,
documentation, and support guidance for confirmed product issues.

## Product-Specific Follow-Up Pages

- [Gatekeeper and First Audit](01-gatekeeper-and-first-audit.md)
- [Configuration and Scan Profiles](02-configuration.md)
- [Output Schema Reference](03-output-schema-reference.md)
