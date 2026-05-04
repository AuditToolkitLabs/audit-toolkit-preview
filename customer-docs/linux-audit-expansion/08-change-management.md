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
- Minor-version upgrades (e.g. 1.0.0 → 1.1.0) are backward-compatible
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
- For package upgrades, rollback is achieved by reinstalling the last
  internally approved release package from your artefact store.
- Do not roll back to superseded public releases affected by the licensing
  defect.
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

---

## 8.6 Pre-use organisational approval requirements

> **Mandatory requirement.** All use of AuditToolkit Linux Security Lite
> must be approved through the organisation's internal change control and
> governance process before first deployment, and before any material change
> in scope.

Use of the toolkit is entirely at the user's and organisation's discretion.
AuditToolkitLabs (the Provider) supplies the Software on an "as-is" basis
and accepts no responsibility for consequences arising from deployment
without appropriate internal authorisation.

### Minimum approvals before first deployment

| Approval | Owner | Requirement |
| --- | --- | --- |
| Change request raised and approved | Platform / Change Owner | Use your organisation's standard ITSM / RFC process. |
| Security team sign-off | Information Security | Confirm privilege model and data handling are acceptable for the target environment. |
| Platform team notification | Linux / Platform Administration | Agree scheduled execution windows and resource headroom. |
| Legal / Procurement review | Legal / Procurement | Required where the tool generates compliance evidence for regulated environments or customer SLAs. |
| Non-production validation | Toolkit Administrator | Run a full audit against a representative non-production host and confirm output before production deployment. |

### Change classification by activity

| Activity | Change type | Minimum governance |
| --- | --- | --- |
| Running scheduled audit scripts on already-approved hosts | Standard | No new approval required per run, provided initial deployment was approved and scope is unchanged. |
| Extending to new hosts or environments | Normal | New change request required before execution. |
| Running any remediation (`fix/`) script | Normal (minimum) | Change request, non-production validation, full backup, dry-run review, rollback procedure. |
| Emergency remediation without prior approval | Emergency | Execute, then ratify with Platform Owner and Security within 24 hours. |
| Major-version toolkit upgrade | Normal | New change request; review CHANGELOG and notify downstream consumers. |
| Enabling additional audit domains or presets | Normal | New change request to document extended scope. |

### User discretion and responsibility

Audit output produced by the toolkit is **advisory only**. It represents
system state at the time of the run. Findings must be interpreted and
acted upon by qualified personnel within the organisation's own risk and
control framework.

The use of any script output — whether for remediation decisions,
compliance assertions, or operational action — is entirely at the
discretion and responsibility of the user and their organisation. The
Provider does not direct, control, or take responsibility for actions
taken on the basis of audit findings.

For the complete legal terms governing use, indemnification, and liability,
see [23 — Licensing, Legal Terms, and Acceptable Use](23-licensing-and-legal.md),
`EULA.md`, `DISCLAIMER.md`, and `LICENSE` distributed with the product.
