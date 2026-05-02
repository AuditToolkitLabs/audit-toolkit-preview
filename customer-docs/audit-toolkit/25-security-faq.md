# 25. Security FAQ

This document is intended for procurement, risk, and compliance teams
performing due diligence on the Security Audit Toolkit.

---

## General security posture

**Q: What is the overall security score of the product?**

A: The Security Audit Toolkit has achieved an OWASP score of 8.8/10,
an overall product quality score of 97.0/100, and an overall grade of
A+. It is 100% compliant with the OWASP Top 10 (2021). See
section 26 for the detailed scorecard.

**Q: Has the product been independently audited?**

A: An internal security audit report is available at
`docs/SECURITY-AUDIT-REPORT.md`. Customers who require a third-party
penetration test report may contact
[Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
to discuss available documentation.

**Q: What vulnerabilities are present in the current release?**

A: Zero known critical or high vulnerabilities are present in the
current production release. All dependency CVEs are scanned on every
build using Bandit (Python) and the GitHub Dependency Graph. Patches
are issued within 7 days of confirming a high/critical vulnerability.

---

## Data handling

**Q: Does the product send any data to the vendor?**

A: No. The product is fully self-hosted. No telemetry, licence
validation calls, or data is sent to the vendor. All audit data
remains on the customer's infrastructure.

**Q: What data is collected and stored?**

A: The product stores:

- Configuration (target host details, user accounts, schedules).
- Audit results (check names, PASS/WARN/FAIL/SKIP statuses, timestamps).
- Application logs (user actions, API calls, errors).
- Credentials used to connect to audit targets (stored encrypted).

No personal data beyond the administrator's email address and name is
collected. Refer to `PRIVACY.md` for the full data processing record.

**Q: Where is data stored?**

A: All data is stored in a PostgreSQL database on the customer's own
infrastructure. No external database or cloud storage is used.

**Q: Is sensitive data encrypted at rest?**

A: Yes. Credentials, API keys, and secrets stored in the database are
encrypted using Fernet symmetric encryption (AES-128-CBC with HMAC-SHA256).
The encryption key is held only in the customer's `.env` secrets file.

---

## Authentication and access control

**Q: What authentication methods are supported?**

A: Local accounts (bcrypt-hashed passwords), LDAP/Active Directory,
SAML 2.0, OAuth 2.0 / OIDC (Entra ID, Okta), and TOTP multi-factor
authentication.

**Q: Is multi-factor authentication (MFA) available?**

A: Yes. TOTP-based MFA can be enabled per-user or mandated by an
administrator for all users or specific roles.

**Q: What authorisation model is used?**

A: Role-based access control (RBAC) with four roles:
`admin`, `operator`, `reader`, `api`. No cross-role privilege
escalation paths are present.

**Q: Are there default credentials that must be changed?**

A: Yes. On first boot, a random initial admin password is generated
and written to `initial-admin-credentials.txt` (Linux:
`/opt/audit-toolkit/`; Windows:
`C:\ProgramData\AuditToolkit\`). Administrators are prompted to change
the password on first login. The initial credentials file is
read-protected to the `audit-toolkit` service account.

---

## Network and communication

**Q: What ports does the application use?**

A: The application listens on TCP 443 (HTTPS) via a reverse proxy
(Nginx or IIS). Internally it binds on TCP 5000 (Flask). The managed
agent control channel uses TCP 9000. No other inbound ports are
required.

**Q: Is all communication encrypted in transit?**

A: Yes. TLS 1.2 minimum is enforced for all inbound HTTPS connections.
SSH and WinRM connections to audit targets are encrypted by the
respective protocol. Agent control-channel traffic uses TLS.

---

## Vulnerability management

**Q: How quickly are security patches issued?**

A: Within 7 days for critical/high CVEs; within 30 days for medium
CVEs. See `SECURITY.md` for the full vulnerability management policy.

**Q: How do I report a vulnerability?**

A: Email [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
with "SECURITY ADVISORY" in the subject line. Do not report
vulnerabilities via public GitHub Issues. See section 7.8 for the
responsible disclosure policy.

---

## Compliance and certifications

**Q: What compliance frameworks does the product support?**

A: Audit scripts are mapped to CIS Benchmarks (v8) and NIST SP 800-53.
See `docs/07-cis-nist-compliance-mapping.md` for the full mapping table.
The documentation suite is aligned to ISO/IEC 20000-1:2018.

**Q: Is the product GDPR-compliant?**

A: The product is designed to minimise personal data collection.
See `PRIVACY.md` for the Data Processing Record and the rights of
data subjects. The vendor is UK-based; data is processed under UK GDPR.

---

## Licensing and vendor risk

**Q: What licence governs the software?**

A: Business Source License 1.1 (BSL 1.1). The software converts to
MIT licence on February 9, 2031. See `customer-docs/LICENSE-EULA.md`
for the full terms.

**Q: What pricing tiers are available?**

A: The toolkit offers a permanent free **Community** tier (≤ 25 managed
targets), a 14-day **Trial** (≤ 150 targets; Professional features;
registration required), and four paid modes:

| Mode | Server limit | Annual price |
| --- | ---: | --- |
| Starter | 50 | £549 |
| Professional | 150 | £1,099 |
| Business | 500 | £2,499 |
| Enterprise | Unlimited | By separate agreement only |

Business and Enterprise customers may additionally purchase the
**Advanced Operations Pack** add-on, which unlocks advanced hypervisor
audit modules, CIS hypervisor packs, bulk operations, and scheduling
workflows. Contact [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com)
for pricing. Published prices are in GBP and subject to change.
Enterprise is not publicly listed and is offered by separate agreement
only, based on support capacity and onboarding scope.

**Q: Is the source code available for review?**

A: Yes. The full source code is available at
<https://github.com/AuditToolkitLabs/Audit-Tool->
for audit and review purposes. The BSL 1.1 licence permits this.

**Q: What happens if the vendor ceases operations?**

A: The BSL 1.1 Change Date provision guarantees the software becomes
fully open-source (MIT) on February 9, 2031. The source code is
publicly available on GitHub, so customers can self-fork at any time.
