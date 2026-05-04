# 18. Installation Guide

| Field | Value |
| --- | --- |
| Document version | 1.0 |
| Last updated | 2026-05-04 |
| Product | AuditToolkit Linux Security Lite |
| Release | v1.1.2 |

---

## 18.1 Prerequisites

Before installing, confirm the following on the target host:

| Requirement | Minimum | Notes |
| --- | --- | --- |
| Bash | 4.0+ | Verify: `bash --version` |
| coreutils | Any modern | cat, date, mkdir, chmod, find |
| grep | POSIX with -E | Standard on all supported distros |
| sed | POSIX | Standard on all supported distros |
| findutils | Any | find, xargs |
| procps / procps-ng | Any | ps command |
| Root or sudo | Recommended | Unprivileged runs produce reduced coverage |
| Disk space | 50 MB | Install dir + report storage |
| Network | Not required | All checks are local |

Optional (for CI validation):

- Python 3.8+ — for `ci/validate-report-schema.py`
- jq — for report parsing helpers

## 18.2 Choosing your installation method

Three installation formats are available in each GitHub Release:

| Format | File | Best for |
| --- | --- | --- |
| Universal tarball | `audit-toolkit-lite-<version>.tar.gz` | Any Linux distribution; manual or scripted installs. |
| Debian package (.deb) | `audit-toolkit-lite_<version>_all.deb` | Debian, Ubuntu, and derivatives; apt/dpkg managed installs. |
| RPM package (.rpm) | `audit-toolkit-lite-<version>-1.noarch.rpm` | RHEL, Fedora, openSUSE, and derivatives; rpm/dnf managed installs. |

Download from:
`https://github.com/AuditToolkitLabs/AuditToolkit-Linux-Security-Lite/releases`

## 18.3 Verify release integrity

Before installing, verify the SHA-256 checksum published alongside the
release artefacts:

```bash
# Download the release and checksum file
wget https://github.com/AuditToolkitLabs/AuditToolkit-Linux-Security-Lite/releases/download/v1.1.2/audit-toolkit-lite-1.1.2.tar.gz
wget https://github.com/AuditToolkitLabs/AuditToolkit-Linux-Security-Lite/releases/download/v1.1.2/SHA256SUMS

# Verify the checksum
sha256sum -c SHA256SUMS --ignore-missing
# Expected output: audit-toolkit-lite-1.1.2.tar.gz: OK
```

For RPM packages, verify the GPG signature:

```bash
rpm --checksig audit-toolkit-lite-1.1.2-1.noarch.rpm
```

## 18.4 Install via Debian package (.deb)

Applicable to: Debian 11/12, Ubuntu 22.04/24.04, and derivatives.

```bash
# Download the package
wget https://github.com/AuditToolkitLabs/AuditToolkit-Linux-Security-Lite/releases/download/v1.1.2/audit-toolkit-lite_1.1.2_all.deb

# Install
sudo dpkg -i audit-toolkit-lite_1.1.2_all.deb

# If dependency errors occur, resolve them with:
sudo apt-get install -f
```

Installed paths:

| Path | Contents |
| --- | --- |
| `/opt/audit-toolkit/` | Toolkit installation |
| `/usr/local/bin/audit-toolkit` | Launcher |
| `/etc/audit-toolkit/` | Configuration directory |
| `/var/log/audit-toolkit/` | Report output directory |

## 18.5 Install via RPM package (.rpm)

Applicable to: RHEL 8/9, AlmaLinux, Rocky Linux, Fedora 39/40/41,
openSUSE Leap/Tumbleweed.

```bash
# Download the package
wget https://github.com/AuditToolkitLabs/AuditToolkit-Linux-Security-Lite/releases/download/v1.1.2/audit-toolkit-lite-1.1.2-1.noarch.rpm

# Install
sudo rpm -ivh audit-toolkit-lite-1.1.2-1.noarch.rpm
# Or with dnf (RHEL/Fedora):
sudo dnf localinstall audit-toolkit-lite-1.1.2-1.noarch.rpm
# Or with zypper (openSUSE):
sudo zypper install audit-toolkit-lite-1.1.2-1.noarch.rpm
```

## 18.6 Install via universal tarball

Applicable to: any Linux distribution including Alpine, Arch, Void,
Gentoo, and distributions without dpkg or rpm.

```bash
# Download and extract
wget https://github.com/AuditToolkitLabs/AuditToolkit-Linux-Security-Lite/releases/download/v1.1.2/audit-toolkit-lite-1.1.2.tar.gz
tar -xzf audit-toolkit-lite-1.1.2.tar.gz
cd audit-toolkit-lite-1.1.2/

# Run the installer
sudo bash install.sh
```

The installer:

1. Copies the toolkit to `/opt/audit-toolkit/`.
2. Creates `/usr/local/bin/audit-toolkit` (launcher symlink).
3. Creates `/etc/audit-toolkit/` (configuration directory).
4. Creates `/var/log/audit-toolkit/` (report output directory).
5. Sets executable permissions on all `.sh` files.

## 18.7 Post-install verification

After installing by any method, verify the installation:

```bash
# Confirm the launcher is available
which audit-toolkit
# Expected: /usr/local/bin/audit-toolkit

# Confirm the version
audit-toolkit --version
# Expected: AuditToolkit Linux Security Lite v1.1.2

# Run a dry-run to confirm scripts are discovered
audit-toolkit --auto --dry-run

# Run a first audit
sudo audit-toolkit --auto --json /tmp/audit-first-run.json

# Validate the report
python3 /opt/audit-toolkit/ci/validate-report-schema.py /tmp/audit-first-run.json
# Expected: Report validation passed

# Inspect the summary
jq '{host:.host_identity.hostname,coverage:.completeness.coverage_score,fail:.hardening.fail}' /tmp/audit-first-run.json
```

## 18.8 Uninstall

### Uninstall .deb package

```bash
sudo dpkg -r audit-toolkit-lite
# Or purge (also removes config and log directories):
sudo dpkg -P audit-toolkit-lite
```

### Uninstall .rpm package

```bash
sudo rpm -e audit-toolkit-lite
```

### Uninstall tarball installation

```bash
sudo rm -rf /opt/audit-toolkit
sudo rm -f /usr/local/bin/audit-toolkit
# Optionally remove config and logs:
sudo rm -rf /etc/audit-toolkit /var/log/audit-toolkit
```

Uninstalling the toolkit does not modify any system configuration.
No host settings, packages, or services are changed by the install
or uninstall process.

## 18.9 Upgrade

To upgrade to a newer version, install the new package over the existing
installation. Package installs (`.deb` and `.rpm`) replace the previous
version. Tarball installs run the installer again; it overwrites the
install directory.

Full upgrade procedure: see
[19 — Maintenance and Patching Runbook](19-maintenance-and-patching-runbook.md).
