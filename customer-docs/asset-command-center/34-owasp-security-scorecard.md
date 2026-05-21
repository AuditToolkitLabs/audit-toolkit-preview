# 34. Security Control Summary

This section is an indicative customer summary of the main security
control areas in the current Asset Command Centre release. It is not a
formal certification, penetration test, or guaranteed security score.

## Control areas

| Area | Current position |
| --- | --- |
| Access control | Role-based access is central to the main UI and a separate portal protects super-admin functions. |
| Authentication | Local authentication with MFA is the documented baseline. |
| Sensitive operations | Certificate, SSH key, tuning, log, and API-code actions are restricted to the super-admin portal. |
| Secrets handling | Customers are expected to manage deployment secrets outside source control and protect database and configuration backups. |
| Connector exposure | The documented baseline is `legacy-only` connector mode with a restricted allowlist. |
| Deployment hardening | Customers remain responsible for host, reverse-proxy, database, and network hardening. |

## Customer action summary

1. keep the deployment on the documented Ubuntu single-node path
2. require MFA for privileged roles
3. review connector allowlists regularly
4. protect backups, secrets, and enrollment keys
5. limit super-admin access and review portal activity
