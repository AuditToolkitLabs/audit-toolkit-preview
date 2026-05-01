# 24. Backup, Restore and Disaster Recovery Runbook

*ISO/IEC 20000-1 clauses 8.6, 8.7, 9.1*

This runbook defines backup, restore and disaster recovery procedures
for the CMDB core service.

## 24.1 Backup scope

Back up all of the following:

- Application database.
- Instance/state directory.
- Relevant application configuration and secrets references.
- Reverse proxy configuration for service endpoint continuity.

## 24.2 Backup cadence guidance

| Data type | Minimum frequency |
| --- | --- |
| Database | Daily (more frequent for high-change environments) |
| Instance/state files | Daily |
| Configuration snapshots | On every approved change |

## 24.3 Restore procedure (non-production validation first)

1. Provision clean host(s).
2. Restore database backup.
3. Restore instance/state files.
4. Reapply configuration and secrets bindings.
5. Start service and validate health.
6. Run smoke tests (login, API, connectors, agent check-in).

## 24.4 DR execution procedure

1. Declare incident and invoke DR process.
2. Select target recovery environment.
3. Restore latest valid backups.
4. Redirect traffic/DNS to recovered service endpoint.
5. Validate service function and data integrity.
6. Communicate recovery status to stakeholders.

## 24.5 RTO and RPO definitions

- RTO: maximum acceptable time to restore service.
- RPO: maximum acceptable data loss window.

Customer operations must define target RTO/RPO and validate against
quarterly DR tests.

## 24.6 DR test evidence checklist

- Backup set IDs and timestamps.
- Restore duration and outcome.
- Data integrity checks passed.
- Functional smoke tests passed.
- Lessons learned and action items tracked.
