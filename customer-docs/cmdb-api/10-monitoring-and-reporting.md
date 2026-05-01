# 10. Performance Monitoring and Reporting

*ISO/IEC 20000-1 clauses 9.1, 9.4*

## 10.1 Service metrics available in-product

The dashboard surfaces key indicators at a glance:

- Total active hosts, by operating system and by workspace.
- Hosts not seen within the configured stale window (default 7 days).
- Open critical / high vulnerability counts.
- Failed agent and connector check-ins in the last 24 hours.
- Backup status (most recent successful run, age, size).

The audit log can be queried by user, action type, target object and
time range.

## 10.2 Metrics suitable for external monitoring

The host operating system or your monitoring platform should track:

- Application process availability (HTTP probe to `/healthz`).
- Database availability and connection pool saturation.
- Disk usage on the application host and database volume.
- Certificate expiry on the public hostname.

## 10.3 Service reviews

We recommend the following review cadence:

| Review | Frequency | Attendees |
| --- | --- | --- |
| Operational | Weekly | Application Administrator, Infrastructure Owner |
| Service-management | Monthly | Service Owner, Application Administrator, internal stakeholders |
| Security and compliance | Quarterly | Service Owner, Security team, Auditor |
| Contractual | Annually | Service Owner, Service Provider |

Each review should consider:

- Incident counts by severity and root cause.
- Change volume and any failed or backed-out changes.
- Outstanding vulnerability findings and ageing.
- Capacity trends and forecast.
- Customer-side feedback and improvement opportunities (see
  section 11).

## 10.4 How-to: integrate with SIEM and SOC tooling

Most customers integrate this service with their SIEM by forwarding
application and audit logs from the host platform.

### Recommended event sources

- Application log files from the app host.
- Reverse-proxy access and error logs.
- Database authentication and availability alerts.
- Audit-log extracts for security-relevant actions.

### Priority events to alert on

- Repeated authentication failures and account lockouts.
- New admin-role grants and privilege changes.
- API key issuance, rotation failures and revocations.
- Authentication provider configuration changes.
- Connector/agent registration anomalies.
- Backup failures and unexpected retention changes.

### Integration procedure

1. Define event taxonomy and severity mapping with your SOC team.
2. Configure log forwarding agent(s) on the app and proxy hosts.
3. Parse logs into your SIEM schema (timestamp in UTC, host,
  actor, action, target and outcome).
4. Enable correlation rules for high-risk events listed above.
5. Create dashboards for daily operations and security review.
6. Test with controlled events (for example failed sign-in and role
  update) and confirm SIEM ingestion and alert routing.
7. Document runbooks for triage, escalation and false-positive tuning.

### Ongoing maintenance

- Revalidate parsers after every product upgrade.
- Review alert thresholds monthly.
- Keep SIEM access restricted to authorised SOC personnel.

## 10.5 How-to: integrate with ticketing and incident workflows

If your deployment uses webhook delivery, send selected events to your
ticketing/incident platform via an internal relay service.

1. Configure webhook destination and shared secret.
2. Subscribe only to required event categories.
3. Transform payloads in the relay to your ITSM ticket format.
4. Apply deduplication to avoid alert storms.
5. Route Sev-1/Sev-2 categories to on-call workflows.
6. Track delivery failures and retry outcomes.
