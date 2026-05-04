# 6. Application Administration Guide

*ISO/IEC 20000-1:2018 clauses 7.5, 7.6, 8.1*

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-03 |
| Product | AuditToolkit Linux Security Lite |

---

## 6.1 Administrative responsibilities

The Toolkit Administrator role is responsible for:

- Installing and upgrading the toolkit on all in-scope hosts.
- Keeping audit scripts and library shims current from the release channel.
- Validating schema compatibility before consumer-side changes.
- Configuring and monitoring scheduled execution.
- Managing report retention and access controls on report directories.
- Confirming CI/CD and SIEM integrations remain operational after each
  upgrade.
- Raising defect reports to the service provider with complete diagnostic
  data.

## 6.2 Configuration management

The toolkit does not use a central configuration file by default. Runtime
behaviour is controlled by command-line flags passed to the orchestrator.

Optional configuration file (`/etc/audit-toolkit/config`):

```bash
# /etc/audit-toolkit/config
# Source this file before running the orchestrator to set defaults.

# Default output directory for reports
AUDIT_OUTPUT_DIR=/var/log/audit-toolkit

# Default domain filter (leave blank for --auto)
AUDIT_DEFAULT_DOMAIN=

# Install directory override (default: /opt/audit-toolkit)
AUDIT_TOOLKIT_INSTALL_DIR=/opt/audit-toolkit
```

The launcher at `/usr/local/bin/audit-toolkit` automatically sources
`/etc/audit-toolkit/config` if it exists.

Environment variable overrides (highest precedence):

| Variable | Effect |
| --- | --- |
| `AUDIT_TOOLKIT_INSTALL_DIR` | Override the install directory. |
| `AUDIT_OUTPUT_DIR` | Override the default report output directory. |

## 6.3 Upgrade procedure

See [19 — Maintenance and Patching Runbook](19-maintenance-and-patching-runbook.md)
for the full procedure. In brief:

```bash
# For .deb installations
sudo dpkg -i audit-toolkit-lite_<new-version>_all.deb

# For .rpm installations
sudo rpm -Uvh audit-toolkit-lite-<new-version>-1.noarch.rpm

# For tarball installations
tar -xzf audit-toolkit-lite-<new-version>.tar.gz
sudo bash audit-toolkit-lite-<new-version>/install.sh
```

After upgrading, confirm the new version is active:

```bash
audit-toolkit --version
```

Re-run the pilot validation steps from section 4.4 on at least one host
before rolling the upgrade across the full fleet.

## 6.4 Report management

### Storage layout

| Path | Contents |
| --- | --- |
| `/var/log/audit-toolkit/` | Timestamped JSON report files and cron execution logs. |
| `/etc/audit-toolkit/` | Optional configuration file. |
| `/opt/audit-toolkit/` | Toolkit installation (scripts, libs, schema, orchestrator). |

### Retention

- Reports contain host identity and security posture data and must be
  treated as sensitive.
- Apply filesystem permissions: `chmod 750 /var/log/audit-toolkit/`
- Define a retention period aligned to your data-retention policy.
  A common approach is 90 days of daily reports; older files can be
  archived or deleted by cron:

```bash
# Retain reports for 90 days
find /var/log/audit-toolkit/ -name "report-*.json" -mtime +90 -delete
```

### Access controls

- Restrict access to the report directory to the user account that runs
  the audit and to users authorised to consume report data.
- Do not store reports on world-readable filesystems.
- Encrypt the report directory or volume if the host is subject to
  encryption-at-rest requirements.

## 6.5 Repository hygiene (source installations)

For teams running directly from the Git repository rather than a release
package:

```bash
# Pull latest changes from main
cd /opt/audit-toolkit
git pull origin main

# Lint all scripts after update
make lint

# Confirm CI tests pass
make test
```

Maintain the running version in `VERSION` and update `CHANGELOG.md` before
any production deployment.

## 6.6 How-to: remove a host from the audit scope

1. Remove or disable the cron entry or systemd timer unit for that host.
2. Archive any JSON reports that must be retained for governance.
3. Delete or stop the scheduled task.
4. Record the removal in your change log.

Uninstalling the toolkit from a host is described in
[18 — Installation Guide](18-installation-guide.md) section 18.8.

## 6.7 Core custom script sync (Enterprise)

Lite agents can pull Core-managed custom scripts under Enterprise license
gate. This supports centrally authored scripts without enabling local
authoring on the Lite host.

### HTML workflow

1. Open Settings in the local web console.
2. Configure Core Server URL and API key.
3. Under **Core Custom Script Sync**, set:
   - Core script API path (default `/api/agent/custom-scripts`)
   - Local target subdirectory (default `custom/core-synced`)
4. Enable sync and select **Pull Scripts**.

### CLI workflow

```bash
python3 /opt/audit-toolkit/agents/html-linux/cli.py core-sync-scripts --enable
```

Optional overrides:

```bash
python3 /opt/audit-toolkit/agents/html-linux/cli.py core-sync-scripts \
  --enable \
  --endpoint /api/agent/custom-scripts \
  --target-subdir custom/core-synced
```

### License and access model

- Requires Enterprise-level custom-audit feature gate.
- Requires Core Server integration settings (URL + API key).
- Pull-only model: Lite executes synced scripts but does not create or
  upload customer scripts locally.
