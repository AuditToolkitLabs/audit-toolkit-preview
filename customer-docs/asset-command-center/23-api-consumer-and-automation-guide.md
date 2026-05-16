# 23. Automation Operator Guide

Automation for this release should stay aligned to the standalone
collector operating model.

## Recommended automation patterns

- inventory exports from the local node
- scheduled collection-job submission and review
- report and snapshot export
- onboarding-key rotation and cleanup
- optional upstream forwarding after local validation

## Unattended scheduled scan behavior

Scheduled profiles are executed by the background worker and must run
without interactive prompts. Connector payloads should therefore include
all required authentication or elevation values in advance.

- create schedule profiles with complete `request_payload` data
- do not rely on interactive shell prompts during worker execution
- validate target host elevation policy before enabling recurring runs

## Elevated execution guidance

### SSH and sudo

For Linux/Unix inventory paths, `ssh-host` supports non-interactive sudo
execution through request payload flags:

- `sudo` or `use_sudo`: enable sudo wrapping for remote commands
- `sudo_password`: optional sudo password when passwordless sudo is not
  available

Behavior is intentionally non-interactive:

- with password: commands run via `sudo -S`
- without password: commands run via `sudo -n` and fail fast if target
  policy requires a prompt

For production schedules, configure target sudo policy for unattended
execution (for example restricted `NOPASSWD` command sets where approved).

### WinRM and elevated PowerShell

For Windows inventory paths, `winrm-host` supports explicit elevated
token enforcement:

- `require_elevated` (aliases: `elevated_powershell`, `run_as_admin`)

When enabled, the connector validates that the WinRM session token is in
the local Administrators role and fails if elevated context is not
present. This prevents silent downgraded collection during unattended
runs.

### Windows JEA (Just Enough Administration) endpoints

JEA lets you create a named WinRM PowerShell session configuration that:

- constrains which cmdlets the connecting account may call
- runs commands under a Virtual Account or GMSA — the connecting account
  does not need to be a local administrator
- transcripts all commands for audit purposes

The `winrm-host` connector supports JEA via the optional `pypsrp`
library (install `pypsrp>=0.7.0` in addition to `pywinrm`). Without
pypsrp the tool falls back to a standard cmd-based WinRM shell, which
bypasses JEA endpoint constraints.

Request payload fields for JEA:

- `jea_configuration_name` (aliases: `jea_endpoint`) — name of the JEA
  session configuration registered on the target host

When `jea_configuration_name` is set:

- the connector uses PSRP to connect directly to the named endpoint
- `require_elevated` is ignored (JEA virtual account handles privilege)
- hostname is resolved via `$env:COMPUTERNAME`

The commands the `winrm-host` connector actually runs against a JEA
endpoint are: `Get-CimInstance Win32_OperatingSystem`,
`Get-CimInstance Win32_ComputerSystemProduct`,
`Get-CimInstance Win32_BIOS`, and registry reads under
`HKLM:\Software\...\Uninstall`. Your JEA Role Capability file must
permit these.

### Linux sudoers least-privilege restriction

JEA has no single equivalent on Linux, but the same principle applies
with a targeted sudoers rule.  The `ssh-host` connector runs exactly
these commands over SSH:

```
uname -s
uname -r
awk -F= '/^PRETTY_NAME=/{print $2}' /etc/os-release
cat /sys/class/dmi/id/product_name
cat /sys/class/dmi/id/product_serial
cat /sys/class/dmi/id/bios_version
cat /sys/class/dmi/id/board_version
dpkg-query -W -f='${Package}\t${Version}\n'   (Debian/Ubuntu)
rpm -qa --qf '%{NAME}\t%{VERSION}-%{RELEASE}\n'   (RHEL/Fedora)
apk info -v   (Alpine)
pacman -Q   (Arch)
```

A minimal `/etc/sudoers.d/asset-scan` granting only what the connector
needs:

```sudoers
# Asset Command Center inventory service account — read-only commands only
Defaults:svc_asset_scan !requiretty
svc_asset_scan ALL=(root) NOPASSWD: \
    /usr/bin/cat /sys/class/dmi/id/product_name, \
    /usr/bin/cat /sys/class/dmi/id/product_serial, \
    /usr/bin/cat /sys/class/dmi/id/bios_version, \
    /usr/bin/cat /sys/class/dmi/id/board_version, \
    /usr/bin/dpkg-query -W -f=*, \
    /usr/bin/rpm -qa --qf *, \
    /sbin/apk info -v, \
    /usr/bin/pacman -Q
```

The DMI reads require root; `uname`, `awk`, and `os-release` do not.
Configure `use_sudo: true` in the job payload and omit `sudo_password`
when using NOPASSWD.

## Scheduled profile payload examples

Use the following JSON bodies when creating scheduled task profiles for
worker-driven execution.

### Linux target over SSH with sudo enabled

```json
{
  "name": "linux-hourly-inventory",
  "connector_key": "ssh-host",
  "target": "linux01.example.internal",
  "interval_minutes": 60,
  "schedule_note": "Hourly Linux inventory with unattended sudo",
  "enabled": true,
  "request_payload": {
    "username": "svc_asset_scan",
    "password": "REDACTED",
    "port": 22,
    "timeout_seconds": 10,
    "use_sudo": true,
    "sudo_password": "REDACTED"
  }
}
```

If the target is configured for passwordless sudo for approved commands,
omit `sudo_password` to force fail-fast behavior when a prompt would be
required.

### Windows target over WinRM with elevated token requirement

```json
{
  "name": "windows-hourly-inventory",
  "connector_key": "winrm-host",
  "target": "win01.example.internal",
  "interval_minutes": 60,
  "schedule_note": "Hourly Windows inventory with admin token enforcement",
  "enabled": true,
  "request_payload": {
    "username": "EXAMPLE\\svc_asset_scan",
    "password": "REDACTED",
    "port": 5985,
    "transport": "ntlm",
    "timeout_seconds": 10,
    "require_elevated": true
  }
}
```

This profile fails if the WinRM session does not have an elevated
administrator token at runtime.

### Windows target over WinRM with JEA endpoint

```json
{
  "name": "windows-jea-inventory",
  "connector_key": "winrm-host",
  "target": "win01.example.internal",
  "interval_minutes": 60,
  "schedule_note": "Hourly Windows inventory via JEA endpoint (least-privilege)",
  "enabled": true,
  "request_payload": {
    "username": "EXAMPLE\\svc_asset_scan",
    "password": "REDACTED",
    "port": 5985,
    "transport": "ntlm",
    "timeout_seconds": 10,
    "jea_configuration_name": "AssetInventory"
  }
}
```

`svc_asset_scan` does not need to be a local administrator. Privilege is
provided by the JEA virtual account at the endpoint level. The JEA Role
Capability file on the target must allow `Get-CimInstance`,
`Get-ItemProperty`, and `ConvertTo-Json`.

## Avoid in customer automation docs

- undocumented tenancy or workspace assumptions
- direct references to deprecated commerce or fulfillment logic
- broad platform claims not present in the active Asset Command Center
  release
