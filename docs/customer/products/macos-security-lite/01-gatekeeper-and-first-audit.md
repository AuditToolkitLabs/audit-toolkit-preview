# AuditToolkit macOS Security Lite — Gatekeeper and First Audit

## Purpose

After installing the DMG or PKG, the primary customer workflow is: approve the
app through macOS Gatekeeper, activate the product, run an audit, and review
the results. This page covers those steps and the offline alternative for
air-gapped environments.

The Gatekeeper approval step applies to pre-release builds distributed without
Apple notarization and must be completed before the tool will run.

## Prerequisites

- `AuditToolkit-macOS-Security-Lite-<version>.dmg` or `.pkg` downloaded from
  the release bundle.
- macOS 10.15 (Catalina) or later.
- Python 3.10 or later installed (via Homebrew or system Python).
- For online activation: outbound HTTPS access to the AuditToolkitLabs
  licensing service.
- For offline activation: a signed offline licence file obtained from
  AuditToolkitLabs before the host is placed in an air-gapped environment.

## Installation

### From DMG

1. Open the DMG file.
2. Drag **AuditToolkit-macOS-Security-Lite.app** to `/Applications`.
3. Eject the DMG.

### From PKG

```bash
sudo installer -pkg AuditToolkit-macOS-Security-Lite-<version>.pkg -target /
```

The PKG places the app at `/Applications/AuditToolkit-macOS-Security-Lite.app`
and creates a CLI wrapper at `/usr/local/bin/audittoolkit-macos-security-lite`.

## Gatekeeper Approval (Required)

Pre-release builds are unsigned. macOS Gatekeeper will block the app on first
launch and display a security warning.

To approve the app:

1. Attempt to open the app or run `audittoolkit-macos-security-lite` — macOS
   will block it and show a warning.
2. Open **System Settings → Privacy & Security**.
3. Scroll to the security warning for AuditToolkit macOS Security Lite.
4. Click **Open Anyway** and confirm.

This step is required once per installation. Subsequent runs proceed without
the Gatekeeper prompt.

## Activation

```bash
audittoolkit-macos-security-lite activate --key <YOUR_LICENCE_KEY>
```

Licence state is cached at
`~/.audittoolkit/macos-security-lite/licence.json`. Network access is only
required for initial activation. Subsequent audit runs do not contact the
licensing service.

Confirm activation status:

```bash
audittoolkit-macos-security-lite status
```

## Offline Licence Import

For hosts without internet access:

```bash
audittoolkit-macos-security-lite import-license /path/to/licence.json
```

Offline licence files must not be edited, copied between hosts, or re-signed
locally. See [Licensing Overview](../../../licensing/overview.md) for the full
offline licence policy.

## Running an Audit

```bash
audittoolkit-macos-security-lite run
```

To specify a custom output path:

```bash
audittoolkit-macos-security-lite run --output-path /path/to/output
```

## Output Files

After a successful run, two files are written to the output path:

| File                         | Contents                                                                |
| ---------------------------- | ----------------------------------------------------------------------- |
| `macos-security-report.json` | Full audit result — findings, scores, host profile, hardening index.    |
| `summary.html`               | Human-readable report — open in any browser or via the web viewer.      |

The default output path is:
`~/Library/Application Support/AuditToolkitLabs/AuditToolkitLite/latest`

## Web Report Viewer

A local web server is included for report review in the browser:

```bash
audittoolkit-macos-security-lite web
```

This starts a local server at `http://127.0.0.1:8766` and reads the most
recent `macos-security-report.json` for status, scores, and findings. The
server serves only on localhost and does not expose findings to the network.

## Exit Codes

| Code | Meaning                                                      |
| ---- | ------------------------------------------------------------ |
| 0    | Audit completed — all checks passed.                         |
| 3    | Licence error — activate or import a licence before running. |
| 4    | Audit completed — one or more checks produced findings.      |

Exit code 4 is a normal audit outcome when findings exist. Review the report to
assess severity and remediation priority.

## Upgrade

Install the new `.pkg` or drag the new `.app` into `/Applications`, replacing
the existing copy. Configuration and cached licence state are preserved.

## Uninstall

```bash
sudo rm -rf /Applications/AuditToolkit-macOS-Security-Lite.app
sudo rm /usr/local/bin/audittoolkit-macos-security-lite
rm -rf ~/.audittoolkit/macos-security-lite
```

## Validation Checklist

After the first run:

- Confirm output files exist in the output path.
- Open `summary.html` and verify the host name, run timestamp, and Hardening
  Index are present.
- Confirm exit code matches the expected outcome.
- If exit code 3: complete activation or import-license before retrying.
- If the tool is blocked by Gatekeeper: complete the Privacy & Security
  approval step before retrying.
- Review any findings with severity `High` or `Critical` for priority action.

## Related Guidance

- [macOS Security Lite Overview](00-overview.md)
- [Licensing Overview](../../../licensing/overview.md)
- [Security Access And Data Protection](../../security/security-access-data-protection.md)
