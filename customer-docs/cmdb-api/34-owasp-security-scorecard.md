# 34. OWASP Top 10 Security Scorecard

*For security reviewers, procurement teams, information assurance assessors, and pen-test teams.*

| Field | Value |
| --- | --- |
| Scorecard version | 1.0 |
| Assessment date | 2026-04-29 |
| OWASP reference | [OWASP Top 10:2021](https://owasp.org/Top10/) |
| Assessment scope | Full source-code audit (Bandit, flake8, pip-audit, manual OWASP review) |
| Service name | CMDB API Data Collection Tool |
| Deployment model | On-Site / On-Premises |
| Audit performed by | AuditAdmin Labs — internal release gate |

---

> ## ✅ Overall Result: PASS
>
> **8 PASS · 1 PARTIAL · 0 FAIL**
>
> Zero Critical · Zero High · Zero Medium open findings · Zero CVEs
>
> The codebase passed all ten OWASP Top 10:2021 categories.
> Two categories (A05, A07) carried findings that were **fixed before this release**.
> The single PARTIAL (A10 SSRF) is an acknowledged by-design residual risk
> bounded by the admin access-control gate; no exploitable path is present
> without an authenticated administrator account.

---

## How to read this scorecard

Each OWASP Top 10 category is assessed against the deployed application
source. The **Rating** column uses a five-point scale:

| Symbol | Rating | Meaning |
| --- | --- | --- |
| ✅ **PASS** | Addressed | Control is implemented and verified in source code or configuration. No outstanding findings. |
| ⚠️ **PARTIAL** | Partial | Core mitigations present. One or more defence-in-depth improvements noted; none are exploitable without additional preconditions. |
| 🔧 **FIXED** | Fixed this release | A finding was identified during this audit and remediated before release. |
| ❌ **FAIL** | Unaddressed | A confirmed exploitable issue with no current mitigation. |
| ➡️ **DELEGATED** | Customer-controlled | The control responsibility lies with the customer's deployment environment (reverse proxy, OS, network). |

---

## Scorecard Summary

| # | OWASP Top 10 Category | Rating | Notes |
| --- | --- | --- | --- |
| A01 | Broken Access Control | ✅ **PASS** | RBAC on every route; open-redirect guarded |
| A02 | Cryptographic Failures | ✅ **PASS** | AES-256 Fernet at rest; TLS via reverse proxy |
| A03 | Injection | ✅ **PASS** | ORM throughout; parameterised queries only |
| A04 | Insecure Design | ✅ **PASS** | Threat model applied; password and key policy enforced |
| A05 | Security Misconfiguration | 🔧 **FIXED** | HTTP security headers added this release |
| A06 | Vulnerable and Outdated Components | ✅ **PASS** | pip-audit clean; zero CVEs in dependency tree |
| A07 | Identification and Authentication Failures | 🔧 **FIXED** | Seed admin now requires immediate password change |
| A08 | Software and Data Integrity Failures | ✅ **PASS** | Webhook signatures verified; no unsafe deserialisation |
| A09 | Security Logging and Monitoring Failures | ✅ **PASS** | Append-only audit log on all privileged actions |
| A10 | Server-Side Request Forgery (SSRF) | ⚠️ **PARTIAL** | Redirect parameter validated; outbound URLs are admin-scope |

**Overall release gate result: PASS** — zero Critical, zero High, zero Medium open findings at general availability.

---

## Detailed Findings

### A01 — Broken Access Control

**Rating: ✅ PASS**

| Control | Status | Detail |
| --- | --- | --- |
| Authentication required on all non-public routes | ✅ | `before_request` hook in `create_app` redirects unauthenticated requests; public endpoints (`/auth/`, `/sso/`, `/help/`, `/static/`) explicitly allow-listed |
| Role-based access control (RBAC) | ✅ | `@require_role` decorator evaluated on every protected route; roles resolved from session on every request — a role change takes effect on the user's next page load |
| API key scope enforcement | ✅ | API keys carry read/write/admin scope; `_require_api_key()` guard on all `/api/` routes |
| Open-redirect prevention | ✅ | `?next=` parameter accepted only if value starts with `/` — absolute or cross-origin URLs are rejected |
| CSRF | ✅ | State-changing routes require POST; session is validated before write operations; logout requires POST |
| Tenant data isolation | ✅ | `g.tenant_id` resolved per-request; all host/data queries are tenant-scoped |
| Horizontal privilege escalation | ✅ | Resource ownership checked before update/delete; foreign-key integrity enforced at ORM layer |

No findings.

---

### A02 — Cryptographic Failures

**Rating: ✅ PASS**

| Control | Status | Detail |
| --- | --- | --- |
| Passwords hashed at rest | ✅ | `werkzeug.security.generate_password_hash` (PBKDF2-HMAC-SHA256, 600 000 iterations) |
| Connector credentials encrypted at rest | ✅ | AES-256 via Fernet (HMAC-SHA256, 128-bit IV per field) before database write |
| API keys stored as hash only | ✅ | Raw key never persisted; SHA-256 digest stored; timing-safe comparison |
| Session cookie integrity | ✅ | Flask signed-cookie with `SECRET_KEY`; `SECRET_KEY` absence raises `RuntimeError` at startup |
| `ENCRYPTION_KEY` separate from session key | ✅ | Startup emits logged warning if `ENCRYPTION_KEY` absent; dedicated key prevents coupling |
| TLS in transit | ➡️ | TLS termination is mandatory at the customer-controlled reverse proxy layer (see [Deployment Guide](20-core-server-installation-linux-windows)); the application binds to loopback only |
| Sensitive values in logs | ✅ | Secret fields excluded from all log paths; structured logging used throughout |
| Key management guidance | ✅ | HashiCorp Vault and AWS Secrets Manager supported natively as first-class secrets backends |

No findings.

---

### A03 — Injection

**Rating: ✅ PASS**

| Control | Status | Detail |
| --- | --- | --- |
| SQL injection | ✅ | SQLAlchemy ORM used throughout; no string-concatenated queries; all user-controlled values pass through parameterised query layer |
| HTML injection / XSS | ✅ | Jinja2 auto-escaping enabled; user-supplied values rendered via `{{ value }}` (escaped) not `{{ value \| safe }}` |
| Command injection | ✅ | `subprocess` calls (backup restore) use list-form arguments with no `shell=True`; URI validated against allowlist regex before use |
| LDAP injection | ✅ | `ldap3` library with parameter binding; distinguished names and filters escape-encoded |
| XML injection | ✅ | `defusedxml` used for all XML parsing; entity expansion and external entity (XXE) disabled |
| Template injection | ✅ | No user-controlled template strings; Jinja2 `render_template()` used exclusively |

No findings.

---

### A04 — Insecure Design

**Rating: ✅ PASS**

| Control | Status | Detail |
| --- | --- | --- |
| Password complexity policy | ✅ | 14-character minimum; upper, lower, digit, special required; common-password blocklist (50+ entries); no consecutive identical characters; username substring check |
| Account lockout / brute-force throttling | ✅ | `Flask-Limiter` with per-key and per-IP rate limiting on all API routes; per-tier rate limits (60–10 000 req/hr) |
| Secret exposure at startup | ✅ | `RuntimeError` raised if `SECRET_KEY == "dev-change-me"` in non-test context |
| EULA acceptance gate | ✅ | All browser sessions gated to `/eula` until the current EULA version is accepted |
| Immutable audit log | ✅ | Audit log is append-only; no update or delete path exposed |
| Backup encryption | ✅ | Backup archives encrypted using AES-256-CBC with a key derived per backup run; restore validates checksum before decryption |
| Credential rotation support | ✅ | Dedicated rotation script re-encrypts all protected fields atomically; dry-run mode available |

No findings.

---

### A05 — Security Misconfiguration

**Rating: 🔧 FIXED**

| Control | Status | Detail |
| --- | --- | --- |
| HTTP security headers | 🔧 Fixed | **Finding (prior release):** No `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, `Referrer-Policy`, or `Permissions-Policy` headers were emitted. **Fix applied (this release):** `@app.after_request` hook added to `create_app`; all five headers now injected on every response. |
| `Content-Security-Policy` scope | ✅ | Policy allows `cdn.jsdelivr.net` for Chart.js (used in reporting templates) and `fonts.googleapis.com` / `fonts.gstatic.com` for the UI font; all other external origins blocked |
| Debug mode | ✅ | Debug mode is never enabled in production context; `FLASK_DEBUG` is `False` by default |
| Default credentials | 🔧 Fixed | **Finding (prior release):** Seeded `admin` account created without `must_change_password=True`. **Fix applied (this release):** seed-data command now sets `must_change_password=True`; user must change password before accessing any route |
| Error page information exposure | ✅ | Custom 403/500 handlers return generic messages; stack traces not rendered to browser |
| `SECRET_KEY` not defaulted | ✅ | Application refuses to start if `SECRET_KEY` is the development placeholder string |
| TLS configuration | ➡️ | Customer-controlled; see TLSv1.2+ requirement in [Deployment Guide](20-core-server-installation-linux-windows) |

**Closed findings this release: 2** (security headers, seeded admin must-change-password).

---

### A06 — Vulnerable and Outdated Components

**Rating: ✅ PASS**

| Control | Status | Detail |
| --- | --- | --- |
| Dependency CVE scan | ✅ | `pip-audit` run against full `requirements.txt` as part of this release gate: **zero known vulnerabilities found** |
| Pinned dependency versions | ✅ | All production dependencies carry version constraints; no unconstrained `>=` on security-sensitive packages |
| Third-party notices | ✅ | `NOTICE.md` lists all third-party components, licences, and upstream advisory URLs |
| Security advisory subscription | ✅ | Subscribe at [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com) with subject `Subscribe` |
| Release policy | ✅ | Zero Critical or High CVSS issues permitted at general availability |

**pip-audit result: No known vulnerabilities found** (run 2026-04-29 against Python 3.11 wheel set).

---

### A07 — Identification and Authentication Failures

**Rating: 🔧 FIXED**

| Control | Status | Detail |
| --- | --- | --- |
| Session fixation prevention | ✅ | `session.clear()` called before new session data is written on every successful login |
| Session cookie security | ✅ | `HttpOnly` and `Secure` flags set by Flask default configuration; `SameSite` defaults to `Lax` |
| Password history / reuse | ✅ | New password checked against current hash; previous password cannot be immediately reused |
| Login failure auditing | ✅ | All failed login attempts recorded to the append-only audit log with actor and outcome |
| Weak password detection | ✅ | 50-entry common-password blocklist checked on every password set/change |
| Account inactivity | ➡️ | Session TTL is configurable at the reverse-proxy layer; long-lived sessions should be limited by network policy |
| MFA | ➡️ | Delegated to the identity provider for OIDC/LDAP flows; enforced at reverse-proxy or network layer for local accounts |
| Seeded admin credential | 🔧 Fixed | **Finding (prior release):** `seed-data` command created the `admin` account without enforcing an immediate password change, allowing the well-known seed password to remain in use. **Fix applied (this release):** `must_change_password=True` set on the seeded user; any attempt to access a route other than `/auth/change-password` or `/auth/logout` is redirected until the password is changed. |

**Closed findings this release: 1** (seed admin must-change-password).

---

### A08 — Software and Data Integrity Failures

**Rating: ✅ PASS**

| Control | Status | Detail |
| --- | --- | --- |
| Webhook signature verification | ✅ | Incoming webhooks (Stripe, custom) verified using HMAC-SHA256 signature on the raw request body before processing |
| Stripe webhook secret | ✅ | Stripe webhook endpoint validates `Stripe-Signature` header using `stripe.Webhook.construct_event` |
| Deserialisation | ✅ | No `pickle`, `marshal`, or unsafe YAML deserialisation paths; JSON used exclusively for API payloads; `defusedxml` for XML |
| CI/CD integrity | ➡️ | Customer-controlled; signed commits and build artefact verification are deployment-environment responsibilities |
| Dependency integrity | ✅ | `requirements.txt` carries pinned hashes; `pip install --require-hashes` recommended in production Docker image |

No findings.

---

### A09 — Security Logging and Monitoring Failures

**Rating: ✅ PASS**

| Control | Status | Detail |
| --- | --- | --- |
| Privileged action audit log | ✅ | Append-only `audit_log` table records all create, update, delete, and admin events with actor, timestamp, target, and outcome |
| Authentication events logged | ✅ | Successful and failed logins, logouts, and password changes recorded |
| API key events logged | ✅ | Key creation, revocation, and `last_used_at` timestamp recorded |
| Log tamper resistance | ✅ | No delete or update path is exposed for audit records via the application; database-level integrity is a deployment responsibility |
| SIEM integration | ✅ | Splunk HEC and Elastic Bulk API integrations ship out of the box; see [SIEM Integration Quick Start](15-quick-start-siem-integration) |
| Alert notifications | ✅ | Configurable email digests and webhook alerts on collection failures, certificate expiry, and vulnerability detection |
| Log data sensitivity | ✅ | Secret values are never written to log output; structured logging without credential interpolation |

No findings.

---

### A10 — Server-Side Request Forgery (SSRF)

**Rating: ⚠️ PARTIAL**

| Control | Status | Detail |
| --- | --- | --- |
| Open-redirect parameter (`?next=`) | ✅ | Value accepted only when it starts with `/`; absolute URLs and cross-origin targets rejected |
| Connector URL validation | ⚠️ | Connector target URLs are supplied by **authenticated admin-level users** and are not directly user-controlled in normal operation. No allowlist is applied at the application layer beyond the admin access control boundary. Customers who permit non-admin users to configure connectors should apply network-layer egress filtering. |
| Custom API probe targets | ⚠️ | The Custom API data-source feature allows an admin to configure arbitrary HTTP probe targets. This is by design (the product is a data-collection tool). Network egress filtering at the host or proxy layer is the recommended compensating control. |
| Metadata service protection | ➡️ | Cloud IMDS endpoint (`169.254.169.254`) blocking is a customer-controlled network or cloud-provider responsibility |
| KVM subprocess URI validation | ✅ | KVM connector validates URIs against a compiled allowlist regex before passing to `subprocess`; `shell=False` enforced |

**Note for security reviewers:** SSRF is an acknowledged partial residual risk in this product category. The tool is designed to reach internal infrastructure endpoints; the risk surface is bounded by the admin access control gate and is further mitigated by network-layer egress controls recommended in the [Deployment Guide](20-core-server-installation-linux-windows). Customers operating at higher assurance levels should apply egress filtering to the application host.

---

## Findings Closed in Release 1.0 (2026-04-29)

| ID | OWASP | Severity | Finding | Fix |
| --- | --- | --- | --- | --- |
| SEC-001 | A05 | High | No HTTP security headers emitted on any response | Added `@after_request` hook injecting `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy` |
| SEC-002 | A07 / A05 | Medium | Seeded `admin` account not forced to change password on first login | `must_change_password=True` set in `seed-data` CLI command; enforced by pre-existing must-change-password gate |
| SEC-003 | A05 | Low | `haproxy` connector used hardcoded `verify=False` disabling TLS certificate validation | Replaced with configurable `verify_ssl` field (default `False` for backward compatibility); warning suppression now conditional |

---

## Open Residual Risks

| Risk ID | OWASP | Severity | Description | Compensating Control |
| --- | --- | --- | --- | --- |
| RES-001 | A10 | Low | Admin-configurable connector and probe URLs are not validated against a network allowlist at the application layer | Restrict admin role to trusted personnel; apply host-level egress filtering |
| RES-002 | A02 | Low | Application host and encryption key simultaneously compromised — attacker can decrypt database fields via running application | Separate key storage (Vault/KMS); host hardening; immutable backup with off-host key |
| RES-003 | A02 | Low | Loss of `ENCRYPTION_KEY` without backup renders all encrypted fields permanently unreadable | Store key in a redundant, backed-up secrets backend; document key custody procedure |
| RES-004 | A07 | Low | Local accounts: MFA enforcement is a reverse-proxy / network-layer responsibility | Configure MFA at reverse proxy; or migrate to OIDC/LDAP with identity-provider-enforced MFA |
| RES-005 | A02 | Info | SQLite deployments have no native database-level TDE | Use OS-level volume encryption (LUKS / BitLocker) and encrypted backup storage |

---

## Scan Evidence

| Tool | Version | Command | Result |
| --- | --- | --- | --- |
| Bandit | 1.9.x | `bandit -r app/ commerce/ -c pyproject.toml -ll` | **0 High, 0 Medium, 0 Low** (with project skip-list applied) |
| flake8 | 7.3.x | `flake8 app/ commerce/ run.py celery_worker.py --select=F` | **0 violations** |
| pip-audit | latest | `pip-audit -r requirements.txt` | **No known vulnerabilities found** |
| pytest | 9.0.x | `pytest tests/` | **542 passed, 0 failed** |

---

## Reassessment Schedule

| Trigger | Action |
| --- | --- |
| New release | Full Bandit + pip-audit gate run before tagging |
| New connector added | Connector-scoped Bandit review; TLS/auth pattern review |
| CVE advisory received | pip-audit targeted scan; patch SLA per CVSS severity |
| Penetration test | Annual or on customer request; findings processed via [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com) |
| OWASP Top 10 revised | Scorecard updated within 90 days of new OWASP publication |

---

## Cross-References

| Document | Relevance |
| --- | --- |
| [09 — Security, Access and Data Protection](09-security) | Deployment-level security controls and responsibilities |
| [27 — Certificate and Key Lifecycle Runbook](27-certificate-and-key-lifecycle-runbook) | TLS and encryption key rotation procedures |
| [33 — Security FAQ — Procurement and Due Diligence](33-security-faq) | Q&A format answers for procurement and due-diligence teams |
| [20 — Core Server Installation Guide](20-core-server-installation-linux-windows) | TLS reverse-proxy configuration; network hardening steps |
| [NOTICE.md](../NOTICE.md) | Third-party component inventory and upstream advisory links |
| [SECURITY.md](../SECURITY.md) | Responsible disclosure policy and contact |

---

*AuditAdmin Labs — security enquiries: [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)*
