# 33. Security FAQ — Procurement and Due Diligence

*For security reviewers, procurement teams, and information assurance assessors.*

This document provides concise answers to questions commonly raised during
vendor security assessment. For implementation detail, refer to the
[Security, Access and Data Protection](09-security) section of the full
service documentation and the [Deployment Guide](../docs/04-deployment-guide.md).

---

## Encryption at Rest

**Q: Is sensitive data encrypted at rest?**

Yes. The application applies field-level encryption to sensitive database
values before they are written to storage. This includes:

- Identity provider client secrets and LDAP bind passwords
- Infrastructure connector credentials (passwords, API tokens, service
  account keys — across 40+ provider types including vSphere, AWS, Azure,
  GCP, and network/storage platforms)
- Administrator-configured secret values in the application configuration
  store

Encryption uses AES-256 via the Fernet authenticated-encryption scheme
(HMAC-SHA256 integrity, 128-bit IV per value). No sensitive value is
written to the database in plaintext.

---

**Q: Does the application also support OS-level or database-level encryption?**

Yes, and it is required. Application-layer encryption is additive to, not
a replacement for, infrastructure controls. Recommended controls are:

| Layer | Control |
| --- | --- |
| Linux host | LUKS full-disk or volume encryption |
| Windows host | BitLocker on OS and data volumes |
| PostgreSQL (managed) | Provider TDE (Azure Database for PostgreSQL, AWS RDS) |
| PostgreSQL (self-hosted) | OS-level volume encryption; `pg_tde` (PG 17+) |
| SQLite (development/SMB) | OS-level encrypted volume; encrypted backup archives |
| Backups | Encrypted at the backup-tool level; keys stored separately |

---

## Encryption Key Management

**Q: How are encryption keys managed?**

Two keys are used and must be kept separate:

- `SECRET_KEY` — Flask session security. Controls cookie integrity and
  CSRF protection. Never used for data encryption.
- `ENCRYPTION_KEY` — Dedicated data-encryption key. A 32-byte random key
  encoded as Fernet format. Controls all field-level secret encryption.

Separation ensures that rotating a session key does not invalidate
encrypted database fields, and vice versa. If `ENCRYPTION_KEY` is not
set, the application emits a startup warning and falls back to a key
derived from `SECRET_KEY` for backward compatibility.

---

**Q: Where should encryption keys be stored?**

Keys must not be stored in source control, application config files, or
database rows. Approved storage options:

- HashiCorp Vault (supported natively — set `VAULT_ADDR`)
- AWS Secrets Manager (supported natively — set `AWS_SECRETS_PREFIX`)
- Host secret store / systemd credentials / environment variables sourced
  from an approved secrets backend

The application supports Vault and AWS Secrets Manager as first-class
secrets backends for connector credential references.

---

**Q: Can encryption keys be rotated without data loss?**

Yes. A dedicated rotation script re-encrypts all protected fields from
the old key to the new key atomically. The process:

1. Accepts old and new keys as explicit arguments.
2. Only replaces a value if it successfully decrypts under the old key.
3. Skips values that do not decrypt (protecting values already on the
   new key or not yet encrypted).
4. Supports a `--dry-run` mode to preview impact before writing.
5. Commits the full batch or rolls back on failure.

No encrypted value is blanked or deleted during rotation. Rotation should
be preceded by a database backup and validated with the dry-run flag.

---

## Credential and Secret Handling

**Q: Are credentials stored in the database?**

No credentials are stored in cleartext. All credential fields are
encrypted at the application layer before persistence (see above). The
database stores only ciphertext. An attacker with raw database access
obtains ciphertext, not usable credentials.

---

**Q: Are application secrets ever logged?**

No. Secret fields are never passed to log handlers. The application
uses structured logging; plaintext values are not interpolated into log
messages.

---

## Authentication and Access Control

**Q: What authentication methods are supported?**

- Local username/password with configurable policy (length, complexity,
  history, lockout)
- OIDC/OAuth 2.0 (Entra ID, Okta, Google Workspace, any RFC-8414
  discovery-URL provider)
- LDAP/Active Directory bind authentication
- API keys with per-key scope (read / write / admin) and revocation

---

**Q: Is multi-factor authentication supported?**

MFA is delegated to the configured identity provider for OIDC/LDAP
flows. For local accounts, MFA enforcement is a deployment-level
requirement (e.g. enforced at the reverse proxy or network layer).

---

**Q: Is there an audit trail of privileged actions?**

Yes. An append-only audit log records all create, update, delete and
administrative events, including: user creation and role changes, config
changes, connector operations, API key issuance and revocation. Audit
records include actor, timestamp, target, and outcome.

---

## Network and Transport Security

**Q: Is data in transit encrypted?**

The application does not serve plain HTTP to end users in a correctly
configured deployment. The core server binds to loopback only
(`127.0.0.1:5000`). A TLS-terminating reverse proxy (nginx or IIS ARR)
is required and is documented as a mandatory deployment step. TLSv1.2
and TLSv1.3 are supported; TLSv1.0/1.1 are disabled in the shipped
nginx configuration.

---

## Patch and Vulnerability Management

**Q: How is the application kept up to date against known vulnerabilities?**

- Dependency tree is scanned against NVD/OSV on every release.
- The release policy is zero Critical or High CVSS issues at general
  availability.
- CVE data is collected and correlated for customer environments as part
  of the tool's core function.
- Security advisory notifications: subscribe by emailing
  [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
  with subject `Subscribe`.
- Report vulnerabilities **only** to
  [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
  — not via public channels.

---

## Residual Risk Statement

The following residual risks are explicitly acknowledged:

| Risk | Residual exposure |
| --- | --- |
| Application host and key both compromised | Attacker can decrypt DB fields via running application |
| Key loss without backup | Encrypted fields become permanently unreadable |
| Backup captured before encryption enabled | Legacy backup may contain plaintext — encrypt backup storage |
| SQLite deployments | No native database-level TDE; full reliance on OS-level controls |

Customers operating at higher assurance levels should adopt enterprise key
management (Vault/KMS), database-level TDE, and immutable encrypted backup
storage as complementary controls.

---

For the full OWASP Top 10 code-audit results, findings register, and scan
evidence, see [OWASP Top 10 Security Scorecard](34-owasp-security-scorecard).

---

*AuditAdmin Labs — security enquiries: [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)*
