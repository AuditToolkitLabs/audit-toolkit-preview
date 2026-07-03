# macOS Security Lite — Overview

macOS Security Lite is a lightweight, self-contained, single-host macOS security
audit tool. It performs read-only security checks against the local macOS system
and produces structured findings, scores, and a human-readable report for
governance, compliance, and operational review. It forms part of the
AuditToolkit Lite add-on.

## What it does

The tool assesses the security posture of a single macOS host and turns the
result into evidence you can act on:

- Host security posture assessment on a single macOS system.
- Structured findings output with severity ratings, a Hardening Index, and
  host profile context.
- Evidence-ready JSON artifacts for compliance review and audit workflows.
- A human-readable HTML report, viewable in any browser or through a built-in
  local web viewer.
- Built-in online activation and offline licence import.

## Runtime requirements

macOS Security Lite requires only Python 3.10 or later and uses the standard
library only. No pip packages, no internet connection, and no external tooling
are required at run time. Online access is needed only for initial licence
activation. A local web report viewer is included for interactive review.

## Architecture

| Layer        | Component                                        | Purpose                                                          |
| ------------ | ------------------------------------------------ | ---------------------------------------------------------------- |
| CLI          | `audittoolkit-macos-security-lite`               | Primary execution, activation, status, import, and web viewer.  |
| Audit engine | `runtime/invoke_audittoolkit_macos.py`           | Coordinates module execution, scoring, and result assembly.     |
| Modules      | `runtime/modules/`                               | Individual read-only check implementations.                     |
| Profiles     | `runtime/profiles/default.json`                  | Controls which modules run and how results are grouped.         |
| Web viewer   | Local server on port 8766                        | Browser-based report review from the most recent audit run.     |

## Output files

Each audit run produces the following files in the configured output path:

| File                         | Contents                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| `macos-security-report.json` | Full audit result — findings, scores, host profile, hardening index. |
| `summary.html`               | Human-readable report with Hardening Index and category scores.     |

## Deployment

Product releases support macOS 10.15 (Catalina) or later, installed via:

- **DMG** — drag-to-Applications install.
- **PKG** — administrator or scripted deployment. The PKG places the app at
  `/Applications/AuditToolkit-macOS-Security-Lite.app` and creates a CLI wrapper
  at `/usr/local/bin/audittoolkit-macos-security-lite`.

**Important:** Pre-release builds are unsigned. macOS Gatekeeper will block the
app on first launch. Approve it once via **System Settings → Privacy & Security →
Open Anyway** before the first run.

## Licensing

macOS Security Lite includes a built-in activation model. Activate with an online
licence key or import a signed offline licence file. Licence state is cached
locally at `~/.audittoolkit/macos-security-lite/licence.json` and does not
require network access after activation.

## Service boundaries

The customer is responsible for the macOS host, Python runtime, Gatekeeper
approval, licence activation, output path, report retention, and any downstream
use of findings. AuditToolkitLabs provides product releases, bug fixes, security
advisories, documentation, and support guidance for confirmed product issues.

## Related pages

- Capabilities
- Feature Guide — Gatekeeper approval and first audit
