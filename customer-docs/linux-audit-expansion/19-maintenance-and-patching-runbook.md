# 19. Maintenance, Patching and Release Runbook

| Field | Value |
| --- | --- |
| Document version | 1.0 |
| Last updated | 2026-05-01 |
| Product | AuditToolkit Linux Security Lite |

---

## 19.1 Release channel

New versions are published to GitHub Releases at:

`https://github.com/AuditToolkitLabs/AuditToolkit-Linux-Security-Lite/releases`

Subscribe to release notifications:

- **GitHub**: watch the repository and select "Releases" in notification
  settings.
- **Email**: send `Subscribe to releases` to
  [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com).

Each release includes:

- Release notes (CHANGELOG.md section for the version).
- Signed release packages (tarball, .deb, .rpm).
- SHA-256 checksums for all packages.
- GPG-signed annotated Git tag.

## 19.2 Before upgrading — checklist

- [ ] Read the release notes for the new version in CHANGELOG.md.
- [ ] Check for schema changes; notify downstream consumers if schema
  additions are present.
- [ ] Identify any audit-script behaviour changes that may affect your
  FAIL/WARN thresholds.
- [ ] Back up the current configuration file:
  `cp /etc/audit-toolkit/config /etc/audit-toolkit/config.bak`
- [ ] Download the new package and verify the SHA-256 checksum (see
  [18 — Installation Guide](18-installation-guide.md) section 18.3).
- [ ] Schedule the upgrade during a maintenance window if running in
  a production environment.

## 19.3 Upgrade procedure

### Step 1 — Pilot upgrade (one host)

Apply the upgrade to a representative pilot host first:

```bash
# For .deb
sudo dpkg -i audit-toolkit-lite_<new-version>_all.deb

# For .rpm
sudo rpm -Uvh audit-toolkit-lite-<new-version>-1.noarch.rpm

# For tarball
tar -xzf audit-toolkit-lite-<new-version>.tar.gz
sudo bash audit-toolkit-lite-<new-version>/install.sh
```

### Step 2 — Verify the pilot upgrade

```bash
# Confirm new version is active
audit-toolkit --version

# Run a full audit
sudo audit-toolkit --auto --json /tmp/audit-upgrade-pilot.json

# Validate the report
python3 /opt/audit-toolkit/ci/validate-report-schema.py /tmp/audit-upgrade-pilot.json

# Compare summary with previous baseline
jq '{coverage:.completeness.coverage_score,fail:.hardening.fail,skip:.hardening.skip}'   /tmp/audit-upgrade-pilot.json
```

Confirm:

- Version string reflects the new release.
- Schema validation passes.
- Coverage score is comparable to pre-upgrade baseline (within ±5 points).
- No unexpected new `[FAIL]` findings introduced by the upgrade itself.

### Step 3 — Roll out to fleet

Once the pilot is verified, roll out to the remaining hosts using your
standard configuration management tooling (Ansible, Salt, Puppet) or
package manager.

```bash
# Ansible example: push .deb to Ubuntu/Debian fleet
ansible all -m apt -a "deb=/path/to/audit-toolkit-lite_<version>_all.deb" --become
```

## 19.4 Rollback procedure

If the upgrade produces unexpected results on the pilot host:

```bash
# Reinstall the last internally approved version from your artefact store
# For .deb:
sudo dpkg -i audit-toolkit-lite_<previous-version>_all.deb

# For .rpm:
sudo rpm -Uvh --oldpackage audit-toolkit-lite-<previous-version>-1.noarch.rpm

# For tarball:
tar -xzf audit-toolkit-lite-<previous-version>.tar.gz
sudo bash audit-toolkit-lite-<previous-version>/install.sh

# Restore the config backup if needed
sudo cp /etc/audit-toolkit/config.bak /etc/audit-toolkit/config
```

Do not roll back to superseded public releases affected by the licensing defect.

Verify rollback:

```bash
audit-toolkit --version
# Should reflect the previous version
```

Report artefacts generated before the upgrade are not affected by rollback.

## 19.5 Host OS maintenance

The toolkit requires no host OS maintenance beyond standard Linux updates.
Ensure the following are kept current on hosts running the toolkit:

- Bash (any update that fixes security issues in the 4.x line).
- coreutils, grep, sed, findutils, procps (standard system updates).
- Python 3 (if using schema validation — keep within the 3.8–3.12 range
  supported by the validation script).

## 19.6 Log and report file maintenance

Review and apply retention rules periodically:

```bash
# Archive reports older than 90 days
find /var/log/audit-toolkit -name "report-*.json" -mtime +90   -exec gzip {} \;

# Delete archives older than 365 days
find /var/log/audit-toolkit -name "report-*.json.gz" -mtime +365 -delete

# Rotate the cron log
logrotate -f /etc/logrotate.d/audit-toolkit
```

If using the installed `.deb` or `.rpm` package, a logrotate configuration
is included at `/etc/logrotate.d/audit-toolkit`.
