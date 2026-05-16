# Asset Command Center — Production Security Posture

**Release:** v1.0.3 · **Report date:** 15 May 2026
**Audience:** Security reviewers, procurement teams, IT leadership, website visitors
**Classification:** Public — approved for customer and marketing use

---

## Our commitment

Security is a first-class engineering concern in Asset Command Center, not
an afterthought. Every production build passes a multi-layer security gate
before it is signed, packaged, and made available to customers. This report
describes every control that runs against the code you deploy, provides
the measured outcomes for release v1.0.3, and explains the architecture
decisions that keep your environment protected at runtime.

---

## What is in scope

The production deliverables for v1.0.3 are:

| Deliverable | Platform | Format |
| --- | --- | --- |
| Asset Command Center Server | Linux (Debian/Ubuntu) | `.deb` package |
| Asset Command Center Server | Linux (RHEL/Rocky/Alma) | `.rpm` package |
| Asset Command Center Server | Windows Server | `.msi` full installer |
| Asset Command Center Server | Windows Server | `.msi` online (minimal) installer |
| Patch Kit | Linux | `.tar.gz` |
| Patch Kit | Windows | `.zip` |

All six deliverables are built from the same server-side codebase
(`tools/asset-management/src`). Every security control described in this
report is applied to that shared production scope.

---

## Release v1.0.3 security scan results at a glance

| Control | Tool | Scope | Result |
| --- | --- | --- | --- |
| Python static analysis | CodeQL | Production source | **0 findings** |
| CI/CD workflow security | CodeQL | GitHub Actions workflows | **0 findings** |
| JavaScript static analysis | CodeQL | UI assets | **3 advisory notes** (see below) |
| Repository live alert status | GitHub Code Scanning | `main` branch | **0 open alerts** |
| Python secure-coding gate | Bandit | Production source | **0 findings** |
| Third-party dependency CVEs | pip-audit | All Python dependencies | **0 vulnerable packages** |
| Hardcoded secret detection | Secrets gate | Release scope | **0 secrets detected** |

Every release-gating control is **passing** for v1.0.3.

### JavaScript advisory note

Three advisory findings (`js/xss-through-dom`) are present in the
JavaScript/TypeScript CodeQL scan. These are located in CI workflow tooling
assets that are **not shipped to customers** — they exist only in the
development pipeline. They do not affect any customer-deployed component and
are not release blockers under the defined production gate scope. They are
tracked for engineering backlog resolution.

---

## Static application security testing (SAST)

### CodeQL — GitHub's industry-leading SAST engine

Asset Command Center is analysed end-to-end using
[GitHub CodeQL](https://codeql.github.com/), the same engine that powers
GitHub Advanced Security. CodeQL performs deep semantic analysis and
data-flow tracking — it is not a simple pattern matcher. It finds real
exploitable conditions, not noise.

**What we analyse:**

- **Python** — the entire server-side application including API handlers,
  authentication, encryption, database access, SSH and cloud connectors,
  and job-scheduling logic.
- **GitHub Actions** — every CI/CD workflow in the repository, checked for
  injection, secret exposure, privilege escalation, and dependency tampering.
- **JavaScript/TypeScript** — UI and build tooling assets.

**How analysis is run:**

CodeQL runs on every push and pull request via GitHub Code Scanning. In
addition, a full local multi-language suite is executed as part of the
release gate before each production build is signed. Results are captured
as SARIF artefacts and retained with the release evidence.

**v1.0.3 Python CodeQL result:** `0 findings` across 100% of scanned files.

**v1.0.3 Actions CodeQL result:** `0 findings` across all 10 GitHub Actions
workflow files.

**GitHub Code Scanning open alerts (main branch):** `0`.

### Bandit — Python-specific secure-coding checks

[Bandit](https://bandit.readthedocs.io/) applies Python-specific security
heuristics covering:

- Hardcoded passwords and secret material
- Use of insecure cryptographic primitives
- Injection via shell expansion and `eval`/`exec`
- Insecure deserialization, XML, YAML loading
- Weak random number generation for security uses
- SQL injection patterns
- Insecure file and network operations

**v1.0.3 gating result:** `0 HIGH · 0 MEDIUM · 0 LOW` across the full
production source tree.

**Suppression transparency:** An additional Bandit run using `--ignore-nosec`
(which overrides all developer-applied suppressions) is retained alongside
the gating run. The transparency result (44 advisory items, predominantly
legacy protocol handling patterns) is reviewed during release approval. This
ensures that the gating pass is not artificially produced by blanket
suppression — every suppression is visible and on record.

---

## Dependency security

### pip-audit — Python dependency CVE scanning

All Python packages used at runtime are scanned against the
[PyPI Advisory Database](https://github.com/pypa/advisory-database) and
the [OSV database](https://osv.dev/) using
[pip-audit](https://pypi.org/project/pip-audit/) before each release.

**v1.0.3 result:** `0 vulnerable packages` in the production dependency tree.

Dependency scanning is a mandatory release-gate step. A build cannot be
promoted to the release artefact signing stage if pip-audit reports any
unresolved vulnerability with a known CVE.

---

## Secret and credential scanning

Before each release, the production source tree is scanned for hardcoded
credentials, API keys, tokens, and private key material using a dedicated
secrets-detection gate.

**v1.0.3 result:** `0 secrets detected`.

At the architecture level, no credentials are ever embedded in source code.
All sensitive configuration (database passwords, JWT signing keys, SMTP
credentials, licence keys) is loaded from environment variables or
customer-controlled configuration files at startup. This is enforced by
code review policy and the secrets gate.

---

## Installer integrity

Every release artefact is accompanied by a `checksums.txt` file containing
SHA-256 hashes for all deliverables. Customers can verify the integrity of
any downloaded package before installation.

A signing preflight and signing status record (`signing-preflight.txt`,
`signing-status.txt`) are published with each release to document the
artefact authentication chain.

---

## Runtime security architecture

Security does not end at the code scanner. The following architectural
controls protect the environment Asset Command Center runs in.

### Authentication and access control

- **Role-based access control (RBAC)** is enforced across every API endpoint
  and UI function. No endpoint is accessible without an authenticated,
  authorised session.
- **Multi-factor authentication (MFA)** is supported for all administrator
  accounts and is enforced by default for privileged roles.
- **Super-admin portal isolation** — highly privileged operations
  (certificate management, SSH key management, connector policy, licence
  management, API-code functions, log portal) are restricted to a
  physically separate super-admin portal that requires its own
  MFA-verified session. This creates a hard boundary between standard
  administration and sensitive platform control.

### Credential management

- Target system credentials (SSH keys, passwords, API tokens for monitored
  assets) are stored using the product's encrypted credential-management
  workflow. Credentials are never stored in plain text.
- Database credentials, JWT signing keys, and all service-level secrets are
  loaded from environment configuration, never from source code or migration
  scripts.

### Encryption

- All customer-facing communication is expected to operate over HTTPS with
  TLS termination at the customer's reverse proxy or directly at the
  application listener.
- Sensitive data at rest (credential store) uses application-layer
  encryption.

### Connector security

- The default connector exposure mode is `legacy-only` with a restricted
  allowlist. Connectors are not enabled by default; each must be explicitly
  activated by an administrator.
- Connector policy and tuning settings are restricted to the super-admin
  portal, preventing standard users from expanding the attack surface.

### Audit logging

- All privileged actions — login, MFA changes, role changes, connector
  configuration, licence operations, backup operations — are written to an
  audit log.
- The audit log is accessible through the admin portal and can be forwarded
  to external SIEM systems via the documented integration path.

---

## Secure development lifecycle

| Practice | Description |
| --- | --- |
| Automated SAST on every commit | CodeQL runs on every push and pull request via GitHub Code Scanning |
| Release gate | CodeQL full-suite + Bandit + pip-audit + secrets scan must pass before artefact signing |
| Suppression transparency | `--ignore-nosec` Bandit run reviewed at release approval |
| Dependency gate | pip-audit blocks promotion if any CVE is unresolved |
| Artefact signing | Release packages are accompanied by integrity hashes and a signing status record |
| Security documentation | SECURITY.md, customer security FAQ, OWASP control summary, and this report are maintained as first-class release artefacts |
| Responsible disclosure | A documented vulnerability reporting path is maintained in SECURITY.md |

---

## OWASP alignment

The product design directly addresses the OWASP Top 10 categories most
relevant to a server-side web application handling privileged infrastructure
access:

| OWASP Category | Control |
| --- | --- |
| A01 Broken Access Control | RBAC enforced on every endpoint; super-admin portal isolation |
| A02 Cryptographic Failures | Encrypted credential store; TLS required; no weak cipher use (CodeQL + Bandit verified) |
| A03 Injection | CodeQL data-flow analysis for SQL, command, and path injection; no dynamic `eval`/`exec` in production path |
| A04 Insecure Design | Connector allowlist; default-deny posture; least-privilege role model |
| A05 Security Misconfiguration | No secrets in source; environment-variable configuration model; connector mode gating |
| A06 Vulnerable Components | pip-audit dependency gate on every release |
| A07 Auth Failures | MFA enforcement; separate super-admin session; account management audit log |
| A08 Software Integrity Failures | SHA-256 checksums; artefact signing chain; CodeQL on CI workflows |
| A09 Logging Failures | Audit log covering all privileged actions; SIEM forwarding supported |
| A10 SSRF | Connector allowlist restricts outbound network access to declared targets |

---

## How to use this report

### For procurement and security questionnaires

This report may be cited directly as the security assurance statement for
Asset Command Center v1.0.3. The recommended response excerpt for
vendor security questionnaires is:

> "Asset Command Center release v1.0.3 is validated through automated
> static application security testing (CodeQL + Bandit), dependency
> vulnerability scanning (pip-audit), and hardcoded secret detection on
> every release build. All release-gating controls pass for v1.0.3.
> GitHub Code Scanning shows 0 open alerts on the main branch.
> Suppression transparency is maintained through a Bandit
> `--ignore-nosec` review pass at each release. Runtime security controls
> include RBAC, MFA, an isolated super-admin portal, encrypted credential
> storage, and a default-deny connector allowlist."

### For technical due diligence

Full scan evidence artefacts are available on request:

- `tmp/codeql-local/results-python.sarif` — CodeQL Python SARIF output
- `tmp/codeql-local/results-javascript-typescript.sarif` — CodeQL JS/TS SARIF output
- `tmp/codeql-local/results-actions.sarif` — CodeQL Actions SARIF output
- `tmp/release-evidence/bandit-release-v1.0.3.json` — Bandit gating run
- `tmp/release-evidence/bandit-release-v1.0.3-ignore-nosec.json` — Transparency run
- `tmp/security-gate/pip-audit-20260515T065711Z.json` — pip-audit results
- `tmp/security-gate/secrets-scan-20260515T065711Z.txt` — Secret scan output

### For installation and operational security

See the following companion documents in this documentation set:

- [09 — Security and Access Model](09-security.md)
- [33 — Security FAQ](33-security-faq.md)
- [34 — OWASP Security Control Summary](34-owasp-security-scorecard.md)
- [27 — Certificate and Key Lifecycle Runbook](27-certificate-and-key-lifecycle-runbook.md)
- [32 — Data Security and Database Maintenance Runbook](32-data-security-and-database-maintenance-runbook.md)

---

## Vulnerability reporting

Security issues should be reported via the responsible disclosure process
documented in `SECURITY.md` in the product repository. We target an initial
response within 2 business days and a remediation timeline communicated
within 5 business days for confirmed critical findings.

---

*This report is generated from live release evidence produced during the
v1.0.3 release gate process on 15 May 2026. Scan artefacts are retained
with the release for independent verification.*
