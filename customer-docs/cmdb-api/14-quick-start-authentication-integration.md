# 14. Quick Start — Authentication Integration

*ISO/IEC 20000-1 clauses 7.6, 8.1, 8.7*

Use this runbook for LDAP/AD, SAML 2.0 or OpenID Connect integration.

## 14.1 Prerequisites

- One local break-glass `admin` account is enabled.
- NTP, DNS and TLS trust are healthy between app and IdP.
- A non-admin test account exists in the identity provider.
- A rollback owner is assigned for the change window.

## 14.2 Configuration procedure

1. Go to **Admin → SSO/Auth configuration**.
2. Select provider type: LDAP/AD, SAML 2.0 or OIDC.
3. Enter provider-specific endpoint and credential details.
4. Configure user attribute/claim mappings.
5. Configure role and workspace mapping defaults.
6. Save and run the built-in connection/authentication test.
7. Sign in with the non-admin test account.
8. Verify role and workspace assignment.

## 14.3 Validation checklist

- Test account can sign in successfully.
- Admin account can still sign in.
- Audit log captures auth configuration change.
- Failed sign-in events are visible in logs/SIEM.

## 14.4 Rollback

1. Revert to previous provider settings.
2. Confirm break-glass admin account access.
3. Re-run sign-in test and close change with evidence.
