# 6. Application Administration Guide

*ISO/IEC 20000-1 clauses 7.5, 7.6, 8.1*

## 6.1 Administrative roles

The `admin` role holds all permissions needed to operate the
application:

- Create, modify and disable user accounts.
- Configure SSO/LDAP providers.
- Issue, rotate and revoke API keys.
- Configure connectors and managed agents.
- Set retention, backup and reporting policies.
- View the full audit log.

Best practice is to keep the population of `admin` users small (two or
three named individuals) and to give a wider population the `operator`
role for routine work.

## 6.2 User lifecycle management

### Create users

Admins create users in **Admin → Users → New**. Each user is bound to
one workspace (technical tenant). Under MSP and OEM tiers a user can be
granted access to multiple workspaces.

### Modify access

Role and workspace assignments can be edited from the same screen.
Changes take effect at the user's next request; existing sessions are
not forcibly invalidated unless the user is disabled.

### De-provisioning

When a user leaves, an admin should:

1. Disable the user (preserves audit history).
2. Revoke any API keys the user owned.
3. If the user accepted an EULA on behalf of a role rather than as
   themselves, record this in your retention notes — the
   `eula_acceptance` row is preserved automatically.

Avoid hard-deleting users; this cascades to their audit records and
loses evidence. The application disables rather than deletes by
default.

## 6.3 Configuration management

Most configuration is set through environment variables at process
start, then can be overridden from **Admin → Config**. Notable
settings:

| Setting | Effect |
| --- | --- |
| `LICENSE_TIER` | Selects the licensing tier; controls the workspace cap. |
| `EULA_ENFORCEMENT_DISABLED` | Disables the EULA gate. **Do not set in production.** |
| Retention windows | Days to retain decommissioned hosts, completed reports and audit-log entries. |
| Rate limits | Per-user concurrency limits for reports and API calls. |
| Connector polling intervals | How often each cloud or hypervisor connector runs. |

Changes to any configurable setting are written to the audit log with
the changing user, the old value, the new value and a UTC timestamp.

## 6.4 Logging and audit

Three log streams are available:

- **Application log** — operational diagnostics, written to disk by
  the host process. Customer-managed.
- **Audit log** — security-relevant events (sign-in, sign-out, role
  change, configuration change, EULA acceptance, API key issuance and
  revocation, connector/agent registration). Held in the database and
  visible at **Admin → Audit Log**.
- **Reporting log** — start, completion and failure of scheduled or
  ad-hoc reports.

Audit-log entries are append-only from the application's point of
view; deletion is reserved for the database administrator following
documented retention policy.

## 6.5 How-to: add a new user

Use this runbook when onboarding a new person.

### Prerequisites

- You are signed in with the `admin` role.
- You know which workspace(s) the user needs.
- You know whether the user should be `operator` or `admin`.

### Procedure

1. Go to **Admin → Users → New**.
2. Enter username, email address and display name.
3. Select the initial role (`operator` for daily operations, `admin`
   only for authorised platform administrators).
4. Assign the user's workspace access.
5. If local authentication is in use, set a temporary password and
   require password change at first sign-in.
6. Save the user.
7. Ask the user to sign in and accept the EULA.
8. Verify a successful sign-in event appears in **Admin → Audit Log**.

### Validation checklist

- User can sign in successfully.
- User sees only the assigned workspace(s).
- User can access required pages for their role.
- Audit log records user creation and first sign-in.

## 6.6 How-to: update or remove user access

### Change role or workspace access

1. Go to **Admin → Users** and select the user.
2. Update role and workspace assignments.
3. Save changes.
4. Ask the user to sign out and back in.
5. Confirm access is now correct.

### Disable a user (recommended for leavers)

1. Open the user record.
2. Set the account to disabled.
3. Revoke any API keys owned by the user.
4. Record the ticket/reference in your internal joiner-mover-leaver log.

## 6.7 How-to: configure external authentication

Authentication integrations should be changed in a maintenance window,
with one break-glass local admin account retained.

### Shared preparation (all external auth methods)

1. Confirm time sync (NTP) on app host and identity provider.
2. Ensure DNS and TLS trust are valid between systems.
3. Keep one known-good local admin account enabled.
4. Export current authentication configuration for rollback.
5. Prepare a named non-admin test account.

### LDAP / Active Directory setup

1. Open **Admin → SSO/Auth configuration**.
2. Select **LDAP/AD** provider type.
3. Configure directory endpoint details (server URI(s), bind DN/service
   account, base DN and search filter).
4. Map directory attributes to username/email/display name.
5. Configure default role mapping and workspace assignment policy.
6. Use the built-in connection test.
7. Sign in with the test account.
8. Verify role/workspace mapping and audit-log entries.

Rollback: switch auth mode back to local and restore previous settings.

### SAML 2.0 setup

1. Open **Admin → SSO/Auth configuration**.
2. Select **SAML 2.0** provider type.
3. Enter IdP metadata (URL or XML), entity ID and SSO endpoint.
4. Upload/confirm IdP signing certificate.
5. Configure assertion mappings for username, email, display name and
  group/role claims.
6. Set ACS/redirect URLs exactly as generated by the application.
7. Test sign-in with the non-admin test account.
8. Confirm sign-in success, role mapping and audit entries.

Rollback: disable SAML config and re-enable the prior provider.

### OpenID Connect setup

1. Open **Admin → SSO/Auth configuration**.
2. Select **OpenID Connect** provider type.
3. Enter issuer URL, client ID and client secret.
4. Confirm callback/redirect URL in the IdP client app.
5. Configure scope set (minimum: `openid`, plus profile/email scopes as
  required).
6. Map token claims to username/email/display name and role/group.
7. Test sign-in with the non-admin test account.
8. Verify role mapping and audit-log events.

Rollback: disable OIDC and restore previous authentication provider.

## 6.8 How-to: configure integrations with external systems

This section covers common integration points used by customer
operations teams.

### Connector integrations (cloud and virtualisation)

Use **Admin → Connectors** to add and validate connectors.

Typical process:

1. Create a least-privilege read-only account in the target system.
2. Add the connector in the UI (for example AWS, Azure, GCP, vCenter,
  Nutanix, OpenStack or KVM).
3. Enter endpoint and credential details.
4. Set polling interval and scope.
5. Run initial connectivity test.
6. Run first collection and verify host records are created.
7. Review failures in logs and tune rate limits/timeouts if required.

### Managed agent integration

Use **Agents** to register endpoint agents.

1. Generate/register an agent token or API key.
2. Deploy the agent package to endpoints.
3. Configure agent URL to the application HTTPS endpoint.
4. Verify check-in and inventory timestamp in the UI.
5. Alert on stale/non-reporting agents.

### API integration (third-party automation)

Use **Admin → API keys**.

1. Create a dedicated integration user account.
2. Issue a scoped API key for that account.
3. Store the key in your secret manager.
4. Test read-only API call before enabling write operations.
5. Rotate keys on your defined schedule.

### Outbound notifications and webhooks

Where enabled, webhook subscriptions can be used to feed operational
platforms (for example SIEM, SOAR, ticketing or chatops relays).

1. Register destination endpoint URL.
2. Configure authentication/secret for webhook delivery.
3. Choose event categories to publish.
4. Send a test event and verify receipt at destination.
5. Configure retry/error monitoring for failed deliveries.

### Email/SMTP integration

Used for report delivery, digest notifications and admin messaging.

1. Configure SMTP host, port, sender and authentication details.
2. Send a test email from the admin console.
3. Verify SPF/DKIM/DMARC alignment if your policy requires it.
4. Monitor bounces and delivery failures.

## 6.9 Post-change verification template

Use this quick checklist after any authentication or integration change:

- Change recorded in your change ticket.
- Authentication test account sign-in successful.
- Least-privilege role mapping verified.
- Integration health check successful.
- Relevant events visible in audit log.
- Rollback steps confirmed and documented.
