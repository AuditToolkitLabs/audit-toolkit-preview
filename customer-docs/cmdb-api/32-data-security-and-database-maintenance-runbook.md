# 32. Data Security and Database Maintenance Runbook

*ISO/IEC 20000-1 clauses 8.1, 8.6, 8.7, 9.1*

This runbook defines practical controls for securing CMDB data and
operating the database safely over time.

## 32.1 Objectives

- Protect confidentiality, integrity and availability of CMDB data.
- Maintain stable database performance and recoverability.
- Reduce risk of data loss, corruption and unauthorized access.

## 32.2 Data security baseline

Apply all controls below in production.

### Identity and access controls

- Use least-privilege database accounts for application runtime.
- Use separate accounts for application, operations and backup tasks.
- Enforce MFA and privileged access controls for DBA/admin access.
- Review and remove dormant accounts regularly.

### Secrets and credential handling

- Store database credentials in approved secret manager.
- Never store credentials in source control.
- Rotate credentials on schedule and after incidents.
- Use short-lived privileged credentials where possible.

### Encryption controls

- Encrypt data in transit using TLS for app-to-DB and admin access.
- Encrypt data at rest using platform-native disk/database encryption.
- Protect backup encryption keys with strict access separation.

### Network isolation

- Keep database on private network segment.
- Allow inbound DB access only from approved application/admin hosts.
- Deny all public internet exposure to database listener ports.

## 32.3 Database maintenance and upkeep schedule

| Activity | Recommended cadence | Owner |
| --- | --- | --- |
| Backup success verification | Daily | Operations |
| Restore validation (non-production) | Monthly (minimum) | Operations/DBA |
| Capacity review (size, growth, free disk) | Weekly | DBA |
| Index and query performance review | Monthly | DBA |
| Vacuum/reorg/statistics maintenance | Per engine best practice | DBA |
| Patch review for DB engine | Weekly | Security/DBA |
| DB engine patching window | Monthly or risk-based | Change authority |
| Access review (DB users/roles) | Quarterly | Security/DBA |

## 32.4 Backup, retention and recovery controls

- Use backup retention that meets compliance and business RPO.
- Keep at least one immutable/offline copy per policy.
- Verify backup integrity checks on creation.
- Record backup IDs, timestamps and encryption status.
- Test point-in-time recovery where supported.

## 32.5 Data lifecycle and minimization

- Define and enforce retention periods for operational and audit data.
- Remove obsolete data according to policy and legal requirements.
- Avoid storing unnecessary sensitive data in free-text fields.
- Document data classification and handling requirements.

## 32.6 Monitoring and alerting

Minimum alerts to configure:

- Database unavailable or high connection failure rate.
- Backup job failure or stale last-success timestamp.
- Rapid storage growth or low free disk threshold breach.
- Abnormal failed authentication attempts.
- Replication/HA lag where applicable.

## 32.7 Secure change procedure for database operations

1. Raise approved change ticket.
2. Capture pre-change performance and health baseline.
3. Take verified backup before major changes.
4. Apply change in non-production first.
5. Execute production change in maintenance window.
6. Validate application and data integrity post-change.
7. Close with evidence and lessons learned.

## 32.8 Data breach and integrity incident actions

1. Trigger security incident response process.
2. Contain access paths (credentials, network routes, sessions).
3. Preserve forensic evidence and logs.
4. Rotate affected secrets and keys.
5. Restore validated clean state from backups if required.
6. Notify stakeholders per legal/regulatory obligations.

## 32.9 Hardening checklist

- Unused DB features and network listeners disabled.
- Default accounts removed/disabled.
- Strong password and lockout policies enforced.
- Administrative actions fully logged and retained.
- Time synchronization enabled for all participating systems.
- Periodic vulnerability scanning completed with tracked remediation.

## 32.10 Evidence checklist for audits

Keep the following evidence current:

- Access review reports.
- Backup and restore test records.
- Patch and vulnerability remediation records.
- Security configuration baselines.
- Incident response records and post-incident actions.
