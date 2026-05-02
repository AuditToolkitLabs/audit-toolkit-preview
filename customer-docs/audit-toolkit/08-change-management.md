# 8. Change, Patch and Release Management

*ISO/IEC 20000-1 clauses 8.5, 8.6*

## 8.1 Release versioning

The Security Audit Toolkit uses **semantic versioning** (`MAJOR.MINOR.PATCH`):

| Component | When it changes |
| --- | --- |
| MAJOR | Incompatible API or schema changes requiring migration steps |
| MINOR | New features; backwards-compatible with the previous minor release |
| PATCH | Bug fixes and security patches; always safe to apply |

See `CHANGELOG.md` at the repository root for the current version and
full release history.

## 8.2 Release channels

| Channel | Description | Who should use it |
| --- | --- | --- |
| **Stable** | Fully tested, signed packages (DEB, RPM, MSI) | All production deployments |
| **Beta** | Feature-complete but under final test | Evaluation, staging environments |
| **Development (main branch)** | Latest code; may be unstable | Developers and contributors only |

## 8.3 Receiving update notifications

- **GitHub Releases**: Watch the repository at
  <https://github.com/AuditToolkitLabs/Audit-Tool-> — enable
  **Releases only** notifications.
- **Security advisories**: Follow the repository for security advisories,
  or subscribe to the mailing list via
  [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com).

## 8.4 Applying a patch or upgrade

### Linux (DEB / RPM)

```bash
# Ubuntu / Debian
sudo dpkg -i audit-toolkit_<new-version>_amd64.deb
sudo systemctl restart audit-toolkit

# RHEL / CentOS / Fedora
sudo rpm -Uvh audit-toolkit-<new-version>.x86_64.rpm
sudo systemctl restart audit-toolkit
```

Run database migrations after upgrading:

```bash
sudo -u audit-toolkit /opt/audit-toolkit/venv/bin/python -m flask db upgrade
```

### Windows (MSI)

Run the new MSI installer; it will upgrade the existing installation in
place. The service restarts automatically at the end of the wizard.

### VM appliance

1. Download the latest appliance update archive from the releases page.
2. Upload it to the appliance and run:

```bash
sudo /opt/audit-toolkit/scripts/update.sh /path/to/update.tar.gz
```

### Agents

Agents can be upgraded from the web console under
**Admin → Agents → Upgrade**, or re-deployed using your original
deployment method with the new agent archive.

## 8.5 Change management recommendations

Before applying any update to a production installation:

1. **Review the changelog** — check for breaking changes, migration
   steps, or manual actions required.
2. **Back up the database** — run a manual backup via
   `POST /api/backup` or `pg_dump`.
3. **Test in staging** — apply the update to a non-production
   environment first.
4. **Schedule a maintenance window** — coordinate with stakeholders.
5. **Document the change** — record the update in your change log.
6. **Validate after upgrade** — run through the acceptance tests in
   section 4.6.

## 8.6 Rolling back an upgrade

If an upgrade introduces a regression:

1. Restore the previous package:

```bash
# Debian / Ubuntu — reinstall the previous DEB
sudo dpkg -i audit-toolkit_<previous-version>_amd64.deb
```

1. Restore the database from the pre-upgrade backup (section 22).
1. Restart the service.

> **Important:** Rolling back a database migration (downgrading
> MAJOR or MINOR versions) may require manual schema changes. Contact
> [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com)
> before attempting a major-version rollback.

## 8.7 Emergency security patches

Security patches are released out-of-band when a critical
vulnerability is confirmed. The patch will be flagged in the GitHub
release notes with a **[SECURITY]** prefix. Apply security patches
within your organisation's vulnerability management SLA — recommended
within 72 hours for CVSS ≥ 7.0.
