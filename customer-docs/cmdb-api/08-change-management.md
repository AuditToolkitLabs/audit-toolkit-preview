# 8. Change, Patch and Release Management

*ISO/IEC 20000-1 clauses 6.1, 8.5, 10*

## 8.1 Change types

| Type | Examples | Authority |
| --- | --- | --- |
| **Standard** | Adding a user, rotating an API key, adjusting a connector polling interval, scheduling a new report. | Application Administrator. |
| **Normal** | Upgrading to a new minor version, enabling SSO, changing the licence tier within an existing contract, adding a new connector type. | Customer change-advisory process, with notice to the service provider. |
| **Emergency** | Applying a security patch released as a hot-fix, isolating a compromised account, revoking all API keys after a suspected leak. | Application Administrator with after-the-fact ratification by the change authority. |

## 8.2 Patch and upgrade responsibilities

- The service provider publishes patches and version notes to the
  AuditAdmin Labs customer portal; subscribe to release notifications
  by emailing
  [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com)
  with the subject `Subscribe to releases`.
- The customer is responsible for applying patches in line with their
  internal change process.
- From `v0.2.9` onward, core-server maintenance releases can be applied
  either by standard platform installer/package upgrade or by the
  targeted update bundles (`cmdb-tool-update-linux-<ver>.tar.gz` and
  `cmdb-tool-update-windows-<ver>.zip`) when the objective is to patch
  application files in place without replacing deployed data paths.
- Major-version upgrades may require a database migration; always run
  the migration scripts from `db/migrations/` in order.
- The application records the running version in the footer of the
  administrator console and in the audit log on each start.

## 8.3 Rollback expectations

- For configuration changes made in-product, the audit log captures
  both the previous and the new value, allowing manual rollback by an
  administrator.
- For application-version upgrades, rollback is achieved by restoring
  the application files to the previous version **and** restoring the
  database from a backup taken immediately before the upgrade.
- The targeted updater creates its own pre-change backup of the active
  SQLite database and environment/config file, but this does not replace
  the customer's normal backup and snapshot controls before production
  maintenance.
- Migrations are forward-only; do not attempt to run a newer
  migration's `down` step against production data without an explicit
  procedure from the service provider.
- Rollback of a host- or OS-level change is the customer's
  responsibility.
