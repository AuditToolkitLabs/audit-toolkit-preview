# Customer Deployment Pack

## 1. Purpose

This document provides customers with the standard procedure for installing,
verifying, operating, upgrading, and removing the AuditToolkit platform from a
release bundle supplied by AuditToolkit.

The customer deployment pack covers customer-facing runtime components only. It
does not include AuditToolkit-Control-Centre, internal license issuance tooling,
build scripts, source repositories, signing keys, or operator-only automation.

## 2. Audience

Use this guide if you are responsible for one or more of the following tasks:

- Installing AuditToolkit on Linux or Windows servers
- Applying an online or offline license
- Starting, stopping, and checking platform services
- Confirming post-install health
- Upgrading to a newer release
- Gathering logs for support
- Removing the platform from a host

## 3. Deployment Model

AuditToolkit is delivered as native operating system packages:

| Platform                                | Package type | Installation method       |
| --------------------------------------- | ------------ | ------------------------- |
| Ubuntu / Debian                         | `.deb`       | `apt` or `dpkg`           |
| RHEL / Rocky / Alma / Fedora / openSUSE | `.rpm`       | `dnf`, `yum`, or `zypper` |
| Windows Server                          | `.msi`       | Windows Installer         |

Release archives such as `.zip` or `.tar.gz` are not the customer deployment
format. They may be used internally for build transport, but customers should
install only the signed MSI, DEB, or RPM package provided in the release bundle.

## 4. Standard Runtime Locations

### Linux Runtime Locations

| Purpose           | Path                                                 |
| ----------------- | ---------------------------------------------------- |
| Application files | `/opt/audittoolkit/<product>/`                       |
| Configuration     | `/etc/audittoolkit/<product>/`                       |
| Runtime data      | `/var/lib/audittoolkit/<product>/`                   |
| Logs              | `/var/log/audittoolkit/<product>/`                   |
| systemd units     | `/lib/systemd/system/` or `/usr/lib/systemd/system/` |

### Windows Runtime Locations

| Purpose                        | Path                                          |
| ------------------------------ | --------------------------------------------- |
| Application files              | `C:\Program Files\AuditToolkit\<Product>\`    |
| Configuration and runtime data | `C:\ProgramData\AuditToolkit\<Product>\`      |
| Logs                           | `C:\ProgramData\AuditToolkit\<Product>\logs\` |
| Service registration           | Windows Service Control Manager               |

Product-specific release notes may list additional paths for optional agents or
connectors. Do not move installed files manually after installation.

## 5. Pre-Installation Checklist

Before installation, confirm the following:

- The host operating system is supported by the release notes.
- You have local administrator or root privileges.
- The release bundle checksum has been verified.
- Required ports are approved in the local firewall.
- Required outbound access is available, unless using an offline license.
- The license file or online license key has been provided through an approved
  channel.
- Any previous AuditToolkit version has been backed up or is ready for upgrade.
- Time synchronization is working. License validation and audit evidence depend
  on accurate system time.

## 6. Verify the Release Bundle

Each customer release bundle includes a manifest and checksums. Verify the
bundle before installing any package.

Linux:

```bash
sha256sum -c manifest/SHA256SUMS.txt
```

Windows PowerShell:

```powershell
Get-FileHash .\packages\windows\*.msi -Algorithm SHA256
```

Compare the output with the values in `manifest/SHA256SUMS.txt`. If any value
does not match, stop and request a replacement bundle.

## 7. Linux Installation

### Debian or Ubuntu

```bash
sudo apt install ./packages/linux/deb/<package-name>.deb
```

If `apt` is unavailable, use:

```bash
sudo dpkg -i ./packages/linux/deb/<package-name>.deb
sudo apt-get install -f
```

### RHEL, Rocky, Alma, or Fedora

```bash
sudo dnf install ./packages/linux/rpm/<package-name>.rpm
```

If `dnf` is unavailable, use `yum`:

```bash
sudo yum install ./packages/linux/rpm/<package-name>.rpm
```

### openSUSE

```bash
sudo zypper install ./packages/linux/rpm/<package-name>.rpm
```

## 8. Windows Installation

Install the MSI from an elevated PowerShell prompt:

```powershell
msiexec /i .\packages\windows\<package-name>.msi /qn /L*v C:\ProgramData\AuditToolkit\install.log
```

For an interactive installation, omit `/qn`.

After installation, confirm the service exists:

```powershell
Get-Service -Name "AuditToolkit*"
```

## 9. License Installation

### Online License

If the deployment has outbound HTTPS access to the license service, enter the
provided license key through the product UI or product-specific CLI documented
in the release notes.

### Offline License

Offline licenses are signed `.offline.lic` files supplied by AuditToolkit for
approved restricted environments.

Copy the file to the product's configured license directory.

Linux example:

```bash
sudo install -d -m 0750 /var/lib/audittoolkit/<product>/data/licenses
sudo install -m 0640 ./licenses/<license-id>.offline.lic /var/lib/audittoolkit/<product>/data/licenses/
```

Windows example:

```powershell
New-Item -ItemType Directory -Force "C:\ProgramData\AuditToolkit\<Product>\data\licenses"
Copy-Item .\licenses\<license-id>.offline.lic "C:\ProgramData\AuditToolkit\<Product>\data\licenses\"
```

Restart the product service after installing or replacing a license.

## 10. Service Operation

### Linux Service Commands

```bash
sudo systemctl status <service-name>.service
sudo systemctl start <service-name>.service
sudo systemctl stop <service-name>.service
sudo systemctl restart <service-name>.service
sudo systemctl enable <service-name>.service
```

### Windows Service Commands

```powershell
Get-Service -Name "AuditToolkit*"
Start-Service -Name "<service-name>"
Stop-Service -Name "<service-name>"
Restart-Service -Name "<service-name>"
```

Use the exact service names from the product release notes or bundle manifest.

## 11. Post-Installation Verification

After installation, verify all of the following:

- The package manager reports the package as installed.
- The service is enabled and running.
- The health endpoint or product status command returns healthy.
- The license status is valid.
- Logs are being written to the standard log directory.
- The application can start after a host reboot.

Linux example:

```bash
systemctl is-enabled <service-name>.service
systemctl is-active <service-name>.service
journalctl -u <service-name>.service -n 50 --no-pager
```

Windows example:

```powershell
Get-Service -Name "<service-name>"
Get-ChildItem "C:\ProgramData\AuditToolkit\<Product>\logs" | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

## 12. Backups

Before upgrades, maintenance, or host migration, back up:

- `/etc/audittoolkit/<product>/` or `C:\ProgramData\AuditToolkit\<Product>\config\`
- `/var/lib/audittoolkit/<product>/` or `C:\ProgramData\AuditToolkit\<Product>\data\`
- Any customer-managed license files
- Product-specific databases or exported evidence stores

Do not back up transient package staging directories or installer caches as the
source of truth for recovery.

## 13. Upgrade Procedure

1. Review release notes for breaking changes and required operator actions.
2. Back up configuration, data, licenses, and product-specific databases.
3. Verify the new release bundle checksum.
4. Install the new MSI, DEB, or RPM over the existing version.
5. Restart services if the installer does not do so automatically.
6. Confirm service health, license status, and log output.
7. Retain the previous release bundle until rollback is no longer required.

Rollback support depends on the product and database migration state. If a
release note marks a migration as non-reversible, contact AuditToolkit support
before attempting a downgrade.

## 14. Uninstall Procedure

### Linux Uninstall

Debian or Ubuntu:

```bash
sudo apt remove <package-name>
```

RPM-based systems:

```bash
sudo dnf remove <package-name>
```

### Windows Uninstall

```powershell
msiexec /x {PRODUCT-CODE-GUID} /qn /L*v C:\ProgramData\AuditToolkit\uninstall.log
```

Uninstall removes application binaries and services. Customer data,
configuration, logs, and license files may be retained for audit and recovery
purposes unless the product-specific uninstall guide says otherwise.

## 15. Troubleshooting

| Symptom                     | First checks                                                                   |
| --------------------------- | ------------------------------------------------------------------------------ |
| Service does not start      | Check service logs, missing config, port conflicts, and file permissions.      |
| License rejected            | Confirm system time, license path, file permissions, and product match.        |
| Health endpoint unavailable | Confirm service state, firewall rules, bind address, and configured port.      |
| Package install fails       | Verify OS support, checksum, package architecture, and package-manager output. |
| Upgrade fails               | Restore backup if needed, capture installer logs, and contact support.         |

## 16. Support Package

When opening a support request, include:

- Product name and version
- Operating system and version
- Package filename and checksum
- Service status output
- Relevant logs from the standard log directory
- License status message, excluding secrets or private keys
- Steps already attempted

Do not send private signing keys, administrator passwords, API tokens, or raw
customer secrets in a support package.
