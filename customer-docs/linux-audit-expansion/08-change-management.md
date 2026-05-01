# 8. Change, Patch and Release Management

*ISO/IEC 20000-1:2018 clauses 6.1, 8.5, 10*

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-01 |
| Product | AuditToolkit Linux Security Lite |

---

## 8.1 Change types

| Type | Examples | Authority |
| --- | --- | --- |
| **Standard** | Scheduling an audit run, updating the config file, adjusting retention, rotating report storage. | Toolkit Administrator. |
| **Normal** | Upgrading to a new minor version, modifying CI gate thresholds, changing the privilege model. | Toolkit Administrator with Platform Owner notification. |
| **Emergency** | Applying a security hot-fix release, disabling a failing audit script causing outages. | Toolkit Administrator — ratify with Platform Owner within 24 hours. |

## 8.2 Patch and upgrade responsibilities

- AuditToolkitLabs publishes release notes and packages to GitHub Releases.
  Subscribe to release notifications by watching the repository or emailing
  [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com)
  with the subject `Subscribe to releases`.
- The customer is responsible for applying upgrades in line with their
  internal change process.
- Minor-version upgrades (e.g. 1.0.0 → 1.0.1) are backward-compatible
  with existing JSON consumers.
- Major-version upgrades may change the report schema; review the CHANGELOG
  and notify downstream consumers before upgrading.

## 8.3 Upgrade procedure

Full procedure is in [19 — Maintenance and Patching Runbook](19-maintenance-and-patching-runbook.md).
Summary:

1. Download the new release package from GitHub Releases.
2. Verify the SHA-256 checksum against the published value.
3. Run the upgrade on a pilot host first.
4. Confirm the schema validation passes on a fresh report.
5. Roll out to the fleet.

## 8.4 Rollback expectations

- For configuration changes (`/etc/audit-toolkit/config`), the previous
  value should be recorded in your change log before modification.
- For package upgrades, rollback is achieved by reinstalling the previous
  release package from your artefact store.
- Report artefacts from before the upgrade are not affected by rollback
  (they remain valid against the schema version they were produced under).
- Do not mix toolkit versions within a single host's scheduled audit cycle;
  this can produce inconsistent coverage trend data.

## 8.5 Schema change policy

- Top-level JSON schema fields will not be removed or renamed within a
  major version (1.x).
- New fields may be added; consumer tooling must use permissive parsing
  (ignore unknown fields) to remain forward-compatible.
- Any additive or breaking change is documented in CHANGELOG.md and
  communicated in the release notes before publication.
