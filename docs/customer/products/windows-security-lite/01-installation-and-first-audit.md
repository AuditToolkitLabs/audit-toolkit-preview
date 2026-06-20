# AuditToolkit Windows Security Lite — Installation and First Audit

## Purpose

After installing the MSI, the primary customer workflow is: activate the
product, run an audit through the GUI or CLI, and review the results. This page
covers those steps and the offline alternative for air-gapped environments.

## Prerequisites

- `AuditToolkit-Windows-Security-Lite-<version>-x64.msi` downloaded from the
  release bundle.
- Windows 10 (1903+), Windows 11, or Windows Server 2019 or later.
- PowerShell 7.x (`pwsh`) recommended. Windows PowerShell 5.1 is also
  supported.
- For online activation: outbound HTTPS access to the AuditToolkitLabs
  licensing service.
- For offline activation: a signed offline licence file obtained from
  AuditToolkitLabs before the host is placed in an air-gapped environment.

## Installation

Run the MSI and follow the installer prompts. The installer:

- Places all files under `C:\Program Files\AuditToolkitLabs\AuditToolkitLite\`.
- Creates a Start Menu shortcut under **AuditToolkitLabs → AuditToolkit Security Lite**.
- Registers an Add/Remove Programs entry for clean uninstall.

No reboot is required.

## Activation

**CLI:**

```powershell
audittoolkit-windows-security-lite activate --key <YOUR_LICENCE_KEY>
```

Licence state is cached at
`%LOCALAPPDATA%\AuditToolkitLabs\AuditToolkitLite\licence.json`. Network
access is only required for initial activation. Subsequent audit runs do not
contact the licensing service.

## Offline Licence Import

For hosts without internet access:

```powershell
audittoolkit-windows-security-lite import-license C:\path\to\licence.json
```

Offline licence files must not be edited, copied between hosts, or re-signed
locally. See [Licensing Overview](../../../licensing/overview.md) for the full
offline licence policy.

## Running an Audit — GUI

Launch from the Start Menu: **AuditToolkitLabs → AuditToolkit Security Lite**

The GUI provides:

- A single **Run Audit** button to execute the default scan.
- A live status indicator during the run.
- A direct link to open the latest HTML report when the run completes.

The GUI is a thin wrapper over the CLI engine. All audit logic runs identically
through either interface.

## Running an Audit — CLI

```powershell
audittoolkit-windows-security-lite run
```

To specify a custom output path:

```powershell
audittoolkit-windows-security-lite run -OutputPath C:\path\to\output
```

To run a specific scan profile:

```powershell
audittoolkit-windows-security-lite run -Profile <profile-name>
```

## Output Files

After a successful run, four files are written to the output path:

| File               | Contents                                                              |
| ------------------ | --------------------------------------------------------------------- |
| `audit-result.json` | Full scan result — findings, scores, coverage, baseline references. |
| `metadata.json`     | Host identity, run timestamp, coverage percent.                      |
| `findings.csv`      | Flat findings export for dashboard import or Excel review.           |
| `summary.html`      | Human-readable report — open in any browser.                         |

When installed via MSI, the default output path is:
`%LOCALAPPDATA%\AuditToolkitLabs\AuditToolkitLite\latest`

## Exit Codes

| Code | Meaning                                                      |
| ---- | ------------------------------------------------------------ |
| 0    | Scan completed — all checks passed.                          |
| 1    | Execution error — review PowerShell output for detail.       |
| 3    | Licence error — activate or import a licence before running. |
| 4    | Scan completed — one or more checks produced findings.       |

Exit code 4 is a normal audit outcome when findings exist. Review the findings
and summary report to assess severity and remediation priority.

## Upgrade

Run the new MSI — it overwrites the existing installation in place.
Configuration and cached licence state are preserved.

## Uninstall

Settings → Apps → search for **AuditToolkit Security Lite** → Uninstall.

## Validation Checklist

After the first run:

- Confirm four output files exist in the output path.
- Open `summary.html` and verify the host name, run timestamp, and Hardening
  Index are present.
- Confirm exit code matches the expected outcome.
- If exit code 3: run the activation command before retrying.
- Review any findings with severity `High` or `Critical` for priority action.

## Related Guidance

- [Windows Security Lite Overview](00-overview.md)
- [Licensing Overview](../../../licensing/overview.md)
- [Security Access And Data Protection](../../security/security-access-data-protection.md)
