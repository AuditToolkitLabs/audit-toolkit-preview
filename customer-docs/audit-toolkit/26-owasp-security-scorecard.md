# 26. OWASP Top 10 Security Scorecard

## Product summary

| Attribute | Value |
| --- | --- |
| Product | Security Audit Toolkit |
| Version | Current (see CHANGELOG) |
| Framework | OWASP Top 10 (2021) |
| OWASP score | 8.8 / 10 |
| Product quality score | 97.0 / 100 |
| Overall grade | A+ |
| Known critical vulnerabilities | 0 |
| Known high vulnerabilities | 0 |

---

## OWASP Top 10 (2021) scorecard

| # | Category | Status | Controls in place |
| --- | --- | --- | --- |
| A01 | Broken Access Control | PASS | RBAC with 4 roles; no privilege-escalation paths; all API endpoints require authentication; insecure direct object reference (IDOR) mitigations in place |
| A02 | Cryptographic Failures | PASS | TLS 1.2+ enforced; Fernet AES-128-CBC field encryption; bcrypt password hashing; no weak algorithms (MD5, SHA-1) in use |
| A03 | Injection | PASS | SQLAlchemy ORM with parameterised queries throughout; no raw SQL string construction; shell commands use `subprocess` with argument arrays |
| A04 | Insecure Design | PASS | Threat-model reviewed; least-privilege service account; secrets separated from application code via `.env` |
| A05 | Security Misconfiguration | PASS | Debug mode disabled in production; default credentials randomised on install; security headers enforced (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) |
| A06 | Vulnerable and Outdated Components | PASS | Automated dependency scanning via Bandit and GitHub Dependency Graph on every build; no known CVEs in current release |
| A07 | Identification and Authentication Failures | PASS | Secure session tokens; bcrypt passwords; TOTP MFA available; account lockout after 5 failed attempts; session expiry enforced |
| A08 | Software and Data Integrity Failures | PASS | Release artefacts are checksummed; no untrusted de-serialisation; integrity validation on agent-push payloads |
| A09 | Security Logging and Monitoring Failures | PASS | All user actions, API calls, and configuration changes written to tamper-evident audit log; log output structured for SIEM ingestion |
| A10 | Server-Side Request Forgery (SSRF) | PASS | Outbound webhook URLs validated against an allowlist; agent connection targets validated against the target registry; no user-controlled URLs are fetched server-side without validation |

---

## Detailed control notes

### A01 — Broken Access Control

- Every Flask route is decorated with a role-requirement decorator;
  unauthenticated access is denied by default.
- Object ownership is verified on all data-access operations.
- Horizontal privilege escalation between tenants is not possible —
  the product is single-tenant by design.

### A02 — Cryptographic Failures

- The `.env` secrets file is mode 600 (owner-read only).
- Fernet encryption keys are never logged.
- TLS certificates are validated on agent connections; self-signed
  certificates generate a warning in the UI.

### A03 — Injection

- All database queries use SQLAlchemy parameterised statements.
- Audit scripts receive target hostnames via environment variables,
  not string interpolation into commands.
- User-supplied input is HTML-escaped before rendering in the web UI.

### A05 — Security Misconfiguration

HTTP security headers (production defaults):

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### A07 — Authentication Failures

- Session tokens are 256-bit random values stored server-side;
  client holds only a signed cookie reference.
- TOTP MFA uses RFC 6238 TOTP with a 30-second window (±1 window
  allowed for clock skew).
- Brute-force lockout: 5 consecutive failures lock the account for
  15 minutes.

---

## Full report

The full internal security audit report is available to Enterprise
customers on request:
[Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)

Internal reference: `docs/OWASP-SECURITY-SCORECARD.md`
