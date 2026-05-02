# 9. Security, Access and Data Protection

*ISO/IEC 20000-1 clauses 6.6, 8.7*

## 9.1 Security posture summary

| Metric | Value |
| --- | --- |
| OWASP Top 10 (2021) compliance | 100% |
| OWASP application security score | 8.8 / 10 |
| Product quality / implementation score | 97.0 / 100 |
| Security grade | A+ |
| Known HIGH / MEDIUM vulnerabilities | 0 |
| Last security re-validation | March 20, 2026 |

Full scorecard: see section 26 and `SECURITY.md` at the repository
root.

## 9.2 Authentication

The application supports the following authentication methods:

| Method | Configuration location |
| --- | --- |
| Local username / password | Built-in; always available |
| LDAP / Active Directory | **Admin → Authentication → LDAP** |
| SAML 2.0 | **Admin → Authentication → SAML** |
| OAuth 2.0 / OIDC (Entra ID, Okta, Google) | **Admin → Authentication → OAuth** |
| Multi-factor authentication (TOTP) | **Profile → MFA** (per user) |

Local authentication uses bcrypt password hashing (cost factor 12).
Passwords must meet the strength policy configured in
**Admin → Security Settings**.

## 9.3 Authorisation and access control

Access is controlled by the role model described in section 3.1. The
API enforces:

- **Authentication on every endpoint** — unauthenticated requests
  return `401 Unauthorized`.
- **Role-based authorisation** — `reader` tokens cannot modify state;
  write operations require `operator` or `admin`.
- **Rate limiting** — all endpoints are rate-limited to prevent
  enumeration and brute force.
- **CORS policy** — cross-origin requests are restricted to
  configured origins.
- **IP allow-listing** — API keys can be scoped to one or more IP
  ranges.

## 9.4 Data protection

### Data that stays on-premises

The Security Audit Toolkit is designed for **fully on-premises
operation**. The following data never leaves your infrastructure:

- Audit results and security findings.
- Server hostnames, IP addresses, and configurations.
- User credentials and authentication tokens.
- API keys.
- Audit logs.

### Field-level encryption

Sensitive fields in the database (SSH passwords, API key secrets,
SMTP credentials) are encrypted at rest using **Fernet symmetric
encryption** with a key stored in your `.env` file. Ensure the
`DB_FIELD_ENCRYPTION_KEY` is stored securely and backed up separately
from the database.

### TLS in transit

All traffic between browsers, agents, and the application server must
be encrypted with TLS 1.2 or later. The application does not support
unencrypted HTTP in production mode
(`PRODUCTION_HARDENING_REQUIRED=true`).

### Database encryption

Database-level encryption (PostgreSQL `pgcrypto` or full-disk
encryption) is the responsibility of the Infrastructure Owner.

## 9.5 Audit logging

The application maintains an append-only audit log of
security-relevant events. Key events logged include:

- User sign-in and sign-out (success and failure).
- Password changes and MFA enrolment.
- API key issuance, rotation, and revocation.
- Changes to roles and user accounts.
- EULA acceptance.
- Backup and restore operations.
- Configuration changes.

The audit log is accessible to `admin` role users at
**Admin → Audit Log** and via `GET /api/audit-log`.

## 9.6 Vulnerability management

The Service Provider maintains a vulnerability management programme
covering the application code and its direct dependencies:

- Automated dependency scanning on every commit.
- Bandit static analysis of Python code.
- ShellCheck analysis of all audit scripts.
- Periodic manual penetration testing.

Customers are responsible for the vulnerability management of the
host operating system, the database, the network infrastructure, and
the endpoints being audited.

## 9.7 Responsible disclosure

To report a security vulnerability in the Security Audit Toolkit,
email [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com).
Please include:

- The version of the application affected.
- A description of the vulnerability and its potential impact.
- Steps to reproduce.
- Any proof-of-concept code (if safe to share).

Do not disclose security issues publicly until the Service Provider has
confirmed the issue and made a fix available. The Service Provider
commits to acknowledging reports within 5 business days.

## 9.8 Privacy

The Security Audit Toolkit does **not** collect telemetry or transmit
audit data outside your infrastructure. The only external communication
is licence key validation for paid tiers, which can be disabled for
air-gapped deployments.

Full privacy statement: `PRIVACY.md` at the repository root.

## 9.9 EULA and GDPR considerations

The EULA acceptance mechanism records the user identity, timestamp,
client IP address, and SHA-256 hash of the agreement text. This record
is stored in the application database and constitutes evidence of
consent. If your organisation is subject to GDPR, include this record
in your data-processing register as a legitimate-interest or
contractual-obligation entry.
