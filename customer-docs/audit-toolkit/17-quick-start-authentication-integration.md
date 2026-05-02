# 17. Quick Start — Authentication Integration (LDAP / SSO / Entra)

## Overview

The Security Audit Toolkit supports external authentication providers
to integrate with your organisation's identity management:

| Method | Protocol | Typical use case |
| --- | --- | --- |
| Active Directory / LDAP | LDAPv3 | On-premises AD environments |
| SAML 2.0 | SAML | Most enterprise IdPs (ADFS, Okta, Ping) |
| OAuth 2.0 / OIDC | OpenID Connect | Microsoft Entra ID, Okta, Google Workspace |
| MFA (TOTP) | TOTP (RFC 6238) | Per-user second factor |

All configuration is in **Admin → Authentication**.

---

## LDAP / Active Directory

### Step 1 — Configure LDAP

Navigate to **Admin → Authentication → LDAP** and enter:

| Field | Example value |
| --- | --- |
| Server | `ldap://dc01.yourdomain.local` or `ldaps://dc01.yourdomain.local` |
| Port | `389` (LDAP) or `636` (LDAPS) |
| Base DN | `DC=yourdomain,DC=local` |
| Bind DN | `CN=svc-audittoolkit,OU=Service Accounts,DC=yourdomain,DC=local` |
| Bind password | `<service account password>` |
| User filter | `(sAMAccountName=%(user)s)` |
| Group search base | `OU=Groups,DC=yourdomain,DC=local` |

### Step 2 — Map groups to roles

| AD group | Toolkit role |
| --- | --- |
| `CN=AuditToolkit-Admins,...` | `admin` |
| `CN=AuditToolkit-Operators,...` | `operator` |
| `CN=AuditToolkit-Readers,...` | `reader` |

### Step 3 — Test

Click **Test Connection** to verify the bind credentials, then
**Test User Login** with a test account.

---

## Microsoft Entra ID (Azure AD) — OIDC

### Step 1 — Register an application in Entra ID

1. In the Azure portal, navigate to **Entra ID → App registrations →
   New registration**.
2. Set the redirect URI to
   `https://<your-hostname>/auth/oauth/callback`.
3. Under **Certificates & secrets**, create a new client secret.
4. Under **API permissions**, add `openid`, `profile`, and `email`
   from the Microsoft Graph delegated permissions.

### Step 2 — Configure the Toolkit

Navigate to **Admin → Authentication → OAuth / OIDC** and enter:

| Field | Value |
| --- | --- |
| Provider | Microsoft Entra ID |
| Tenant ID | `<your-entra-tenant-id>` |
| Client ID | `<application-client-id>` |
| Client secret | `<client-secret>` |
| Discovery URL | `https://login.microsoftonline.com/<tenant-id>/v2.0/.well-known/openid-configuration` |

### Step 3 — Map claims to roles

| Claim | Value | Toolkit role |
| --- | --- | --- |
| `groups` | `<admin-group-object-id>` | `admin` |
| `groups` | `<operator-group-object-id>` | `operator` |
| `groups` | `<reader-group-object-id>` | `reader` |

---

## Okta — OIDC

Follow the same pattern as Entra ID. Set the discovery URL to:

```
https://<your-okta-domain>/.well-known/openid-configuration
```

Detailed Okta setup: `docs/OKTA-SETUP.md`.

---

## SAML 2.0

Navigate to **Admin → Authentication → SAML** and enter:

| Field | Description |
| --- | --- |
| IdP Metadata URL | URL or uploaded XML from your identity provider |
| SP Entity ID | Your chosen entity ID (e.g. `https://<hostname>/auth/saml`) |
| ACS URL | `https://<hostname>/auth/saml/acs` |
| Attribute mapping | Map IdP attributes to `email`, `username`, `role` |

---

## Multi-factor authentication (TOTP)

Users can enrol TOTP-based MFA from **Profile → MFA → Enable**:

1. Scan the QR code with an authenticator app (Google Authenticator,
   Microsoft Authenticator, etc.).
2. Enter the 6-digit code to confirm enrolment.
3. Save the backup codes in a secure location.

Administrators can mandate MFA for all users or for specific roles
under **Admin → Security Settings → Require MFA**.

---

## Troubleshooting

| Symptom | Action |
| --- | --- |
| LDAP bind fails | Check service account credentials and network connectivity to the LDAP server on port 389/636 |
| OIDC redirect loop | Confirm the redirect URI in Entra ID / Okta exactly matches the one configured in the Toolkit |
| SAML assertion rejected | Check clock skew between IdP and Toolkit server (must be < 5 minutes); verify certificate on IdP metadata |
| User signs in but gets wrong role | Review group-to-role mapping; check group membership in the IdP |

Full guides: `docs/LDAP-INTEGRATION.md`, `docs/OKTA-SETUP.md`,
`docs/ENTERPRISE-AUTH.md`, `docs/ENTRA-ID-INTEGRATION.md`.
