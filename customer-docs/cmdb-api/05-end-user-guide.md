# 5. End-User Guide

*ISO/IEC 20000-1 clauses 8.1, 8.7*

## 5.1 Access and authentication

The application is reached using a standard web browser at the URL
provided by your administrator (typically
`https://<your-cmdb-host>/`).

Three authentication mechanisms are supported, configured by your
administrator:

- **Local accounts** — username and password held in the application's
  own user store.
- **LDAP / Active Directory** — authentication against your existing
  directory.
- **Single sign-on** — SAML 2.0 or OpenID Connect via your identity
  provider.

On first sign-in you will be presented with the End-User Licence
Agreement. You must read and accept it before any further pages will
load. Declining the EULA signs you out.

## 5.2 Core user tasks

| Task | Where in the UI |
| --- | --- |
| Review the overall estate health | **Dashboard** |
| Look up a specific host or asset | **Hosts → search** |
| Inspect a host's hardware, software and vulnerabilities | **Host detail** |
| Run an ad-hoc inventory or vulnerability report | **Reports → New** |
| Subscribe to a scheduled report | **Reports → Subscriptions** |
| Acknowledge or annotate a finding | **Vulnerabilities → row → Notes** |
| Change your own password | **User pill (top right) → Profile** |

## 5.3 Data handling

- All data you see and enter is owned by your organisation.
- Free-text fields (notes, ticket references, asset descriptions) are
  validated for length and stripped of HTML/script content; do **not**
  paste secrets or personal data into them.
- Inventory records are retained according to the retention policy set
  by your administrator (default: 365 days for closed/decommissioned
  hosts, indefinite for active hosts).
- Reports you generate are kept until you delete them or until the
  retention window for completed reports elapses (default: 90 days).

## 5.4 Common user issues

| Symptom | Likely cause | Self-service action |
| --- | --- | --- |
| Cannot sign in | Wrong password, locked account, SSO outage | Use the password reset flow if local; contact your administrator otherwise. |
| Redirected to `/eula/` after sign-in | EULA version has been updated | Read and re-accept; this is expected behaviour. |
| Page shows "Workspace not selected" | Multi-tenant deployment with no default workspace | Pick a workspace from the selector at the top of the page. |
| Report fails with "rate limit reached" | Too many concurrent reports for your account | Wait for in-flight reports to finish, or ask your administrator to raise the limit. |
| Hosts not appearing | Agent or connector not reporting | Notify your administrator; do **not** restart agents yourself unless authorised. |

If self-service does not resolve the issue, follow your local incident
process to raise a ticket.
