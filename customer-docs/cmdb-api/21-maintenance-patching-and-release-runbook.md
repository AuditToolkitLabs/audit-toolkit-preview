# 21. Maintenance, Patching and Release Runbook (Core Server and Agents)

*ISO/IEC 20000-1 clauses 8.1, 8.5, 8.6, 8.7, 10*

This runbook defines how to plan, test, deploy and validate patching and
new releases for both the core server and managed agents.

## 21.1 Scope

Covers:

- Core server maintenance windows and release deployment.
- Database migration handling and rollback.
- Agent patching strategy (pilot then staged rollout).
- Post-release validation and operational monitoring.

## 21.2 Release intake and planning

1. Review release notes and security advisories from AuditAdmin Labs.
2. Classify release type:
   - security hot-fix,
   - maintenance patch,
   - minor feature release,
   - major release.
3. Raise a change record with risk, impact and rollback plan.
4. Define maintenance window and business communication plan.
5. Select pilot scope (one non-production environment and pilot endpoint
   group for agents).

## 21.3 Pre-change prerequisites

- Verified recent backup of database and instance data.
- Restore test completed in non-production recently.
- Rollback owner and approver assigned.
- Monitoring and alerting active (service health, errors, disk, backup).
- Installation media and checksums validated.
- Required credentials and secret access available.

## 21.4 Core server patching and release procedure

### Non-production first

1. Apply release to non-production environment.
2. Run schema migrations if included.
3. Perform smoke tests:
   - HTTPS reachability,
   - admin sign-in,
   - EULA path,
   - connector/agent check-in,
   - reporting and audit-log events.
4. Record defects and decide go/no-go.

### Production deployment

1. Announce maintenance start.
2. Take pre-change backup snapshot.
3. Stop application service.
4. Choose deployment method:
   - use the standard installer or OS package for first install,
     platform-aligned upgrade, or when change control requires native
     package records;
   - use the targeted update bundle from `v0.2.9` onward when patching
     an existing core server in place while preserving deployed
     database, configuration, and collected data paths.
5. Deploy new application version.
6. If using the targeted update bundle, run `apply_targeted_update.py`
   from the release asset against the existing install root; confirm the
   generated backup location is captured in the change record.
7. Run database migrations in order when required.
   The targeted updater performs this automatically as part of the patch
   process.
8. Start application service and validate health endpoint.
9. Perform production smoke test set.
10. Announce service restoration.

### Targeted updater command examples

Run the updater from the extracted release asset location.

Linux example:

```bash
python3 apply_targeted_update.py \
   --bundle cmdb-tool-update-linux-0.2.11.tar.gz \
   --install-root /opt/cmdb-tool \
   --config-path /etc/cmdb-tool/cmdb-tool.conf \
   --dry-run
```

After reviewing the dry-run output, rerun the same command without
`--dry-run` during the approved maintenance window.

Windows PowerShell example:

```powershell
python .\apply_targeted_update.py `
   --bundle .\cmdb-tool-update-windows-0.2.11.zip `
   --install-root "C:\Program Files\CmdbTool" `
   --config-path "C:\ProgramData\CmdbTool\cmdb-tool.env" `
   --dry-run
```

If the deployment uses PostgreSQL rather than the default SQLite path,
provide `--database-url` explicitly or confirm it is present in the
environment/config file before execution.

**Version guard (from v0.2.11):** The updater automatically detects the
currently installed version from `.cmdb-version` in the install root
(written on each successful apply). If the bundle version is the same as,
or older than, the installed version, the updater aborts with a warning.
Pass `--force` to override for re-apply scenarios.

**Non-SQLite deployments:** A warning is printed confirming that remote
database backups are not taken automatically. Ensure a database snapshot
exists via your DBA or cloud backup tooling before proceeding.

## 21.5 Core server rollback procedure

1. Trigger rollback if acceptance criteria fail.
2. Stop service.
3. Restore previous application version.
4. Restore database from pre-change backup if migration/data mismatch
   exists.
5. If the targeted updater was used, restore the generated updater
   backup for the SQLite database and configuration file alongside the
   normal platform or VM snapshot as appropriate.
6. Start service and re-run smoke tests.
7. Document incident and root cause.

## 21.6 Managed agent patching and release procedure

Use ring-based rollout to minimize risk.

### Agent rollout rings

- Ring 0: lab/test endpoints.
- Ring 1: pilot production endpoints (5 to 10 percent).
- Ring 2: broad rollout (remaining endpoints by business group).

### Agent deployment steps

1. Publish agent package to software distribution platform.
2. Deploy to Ring 0 and validate:
   - service starts,
   - endpoint check-in appears,
   - inventory timestamps update,
   - no abnormal CPU/memory behavior.
3. Deploy to Ring 1 and monitor for one business cycle.
4. Deploy Ring 2 in controlled waves.
5. Revoke superseded agent credentials if rotation is part of release.

## 21.7 Agent rollback procedure

1. Pause rollout immediately on high-severity fault.
2. Re-deploy prior known-good agent version to affected ring.
3. Confirm check-in and inventory stability restored.
4. Open defect record with evidence for vendor support.

## 21.8 Maintenance frequency guidance

| Activity | Recommended cadence |
| --- | --- |
| Security patch review | Weekly |
| Core server maintenance patching | Monthly or per advisory urgency |
| Agent package maintenance | Monthly or per advisory urgency |
| Major release planning review | Quarterly |
| DR restore validation | At least quarterly |

## 21.9 Security controls during patching

- Verify package integrity/checksum before deployment.
- Use privileged access only for the change window.
- Keep audit trail of who approved and executed each step.
- Rotate temporary credentials used during emergency maintenance.
- Reconfirm SIEM and alerting after release completion.

## 21.10 Post-change acceptance checklist

- Core server reports healthy status.
- No sustained increase in error rate.
- Connectors and agents report on expected schedule.
- Admin and operator workflows are functional.
- Audit log entries present for release actions.
- Change ticket closed with evidence and lessons learned.
