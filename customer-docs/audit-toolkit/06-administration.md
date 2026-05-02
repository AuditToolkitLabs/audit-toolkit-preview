# 6. Application Administration Guide

*ISO/IEC 20000-1 clauses 8.3, 8.5*

## 6.1 User management

Navigate to **Admin → Users** to manage user accounts.

### Creating a user

1. Click **New User**.
2. Enter the username, display name, and email address.
3. Assign one or more roles (`admin`, `operator`, `reader`).
4. Set a temporary password or, if SSO is configured, link to the
   user's identity provider account.
5. Click **Save**. The user will be prompted to change their password
   on first login.

### Deactivating a user

Select the user and click **Deactivate**. Deactivated users cannot
sign in but their audit history is preserved.

### Resetting a password

Select the user and click **Reset Password**. A temporary password is
generated. Deliver it to the user via a secure channel.

## 6.2 API key management

API keys authenticate agents and automation pipelines to the REST API.

| Action | Location |
| --- | --- |
| Issue a new key | **Admin → API Keys → New Key** |
| Rotate a key | Select key → **Rotate** |
| Revoke a key | Select key → **Revoke** |
| View key activity | Select key → **Activity Log** |

Keys are shown in full only at creation time. Store them in your
organisation's secrets manager immediately. Keys are scoped to a role
(`operator` or `reader`) and optionally to one or more IP ranges.

## 6.3 Managing audit targets

Navigate to **Targets** to add and manage the servers and devices you
want to audit.

### Adding a Linux or Windows target

1. Click **New Target**.
2. Enter the hostname or IP address.
3. Choose the connection method:
   - **SSH** (Linux): enter credentials or select a stored SSH key.
   - **WinRM / JEA** (Windows): enter credentials and the WinRM
     endpoint.
   - **Agent-push**: the agent running on the target will push results
     to the server; no credentials are needed on the server side.
4. Assign the target to a group (optional).
5. Click **Test Connection** to validate access.
6. Click **Save**.

### Removing a target

Select the target and click **Delete**. All historical results are
retained. The server count used for licence enforcement is updated
immediately.

## 6.4 Agent deployment

See the [Quick Start — Agent Deployment](15-quick-start-agents) guide for
step-by-step instructions. After deployment, agents appear in
**Admin → Agents**.

Agents report their status (online/offline), last check-in time, and
version. Outdated agents can be upgraded from the console under
**Admin → Agents → Upgrade**.

## 6.5 Audit scheduling

Navigate to **Schedules** to create recurring audit runs.

| Field | Description |
| --- | --- |
| Name | Human-readable schedule name. |
| Targets | One or more targets or target groups. |
| Audit profile | The set of scripts to run. |
| Schedule | Cron expression or simple interval (daily, weekly). |
| Maintenance windows | Time windows during which the schedule is suppressed. |
| Alerts | Conditions that trigger notifications when the run completes. |

## 6.6 Configuring alerts and notifications

Navigate to **Admin → Alerts** to configure:

- **Email (SMTP)**: set SMTP host, port, TLS mode, and sender address.
- **Slack / Microsoft Teams**: enter an incoming webhook URL.
- **ServiceNow / Jira**: enter the REST API endpoint, credentials, and
  field mapping.
- **Generic webhook**: any HTTP endpoint accepting a JSON payload.

See section 18 and [Quick Start — SIEM and Webhook Integration](18-quick-start-siem-integration)
for payload schemas.

## 6.7 SSO and LDAP configuration

Navigate to **Admin → Authentication** to configure:

- **LDAP / Active Directory**: server, base DN, bind credentials,
  group-to-role mapping.
- **SAML 2.0**: IdP metadata URL or XML, attribute mapping.
- **OAuth 2.0 / OIDC** (Entra ID, Okta, Google): client ID, secret,
  discovery URL, claim mapping.

Detailed setup procedures are in [Quick Start — Authentication
Integration](17-quick-start-authentication-integration).

## 6.8 Licence administration

Navigate to **Admin → Licence** to:

- View the active licence tier, server limit, and expiry date.
- Enter a new or renewal licence key.
- Download the licence status report for your records.

The console displays a warning banner when the licensed server count
is within 10% of the limit, and a second warning 30 days before expiry.

## 6.9 Backup and restore

See section 22 and the [Backup, Restore and Disaster Recovery Runbook](22-backup-restore-and-disaster-recovery-runbook)
for full procedures.

Quick actions are available via:

```bash
# Trigger a manual backup via the API
curl -s -X POST https://<hostname>/api/backup \
  -H "X-API-Key: <key>" | jq .
```

## 6.10 Reviewing the audit log

Navigate to **Admin → Audit Log** to review security-relevant events:

- User sign-ins and sign-outs.
- Password changes and API key operations.
- Configuration changes.
- EULA acceptance events.
- Backup and restore operations.

The audit log is append-only and cannot be modified through the
application. Export the log via **Admin → Audit Log → Export** for
archiving or external SIEM forwarding.
