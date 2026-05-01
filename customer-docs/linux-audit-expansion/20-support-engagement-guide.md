# 20. Support Engagement Guide

| Field | Value |
| --- | --- |
| Document version | 1.0 |
| Last updated | 2026-05-01 |
| Product | AuditToolkit Linux Security Lite |

---

## 20.1 Overview

This guide describes when and how to engage AuditToolkitLabs for product
support, and what information to include to enable a fast response.

AuditToolkitLabs provides vendor-side support for product defects, security
advisories, and licensing. First-line operational support (host issues,
network issues, scheduling failures due to environment) is the customer's
responsibility.

## 20.2 When to contact AuditToolkitLabs

**Contact AuditToolkitLabs when:**

- A check produces incorrect results that cannot be explained by privilege
  or environment differences.
- The toolkit crashes or exits unexpectedly on a supported distribution.
- A newly released version introduces a regression.
- You have identified a potential security vulnerability in the toolkit.
- You need licensing, tier, or commercial contract assistance.

**Do not contact AuditToolkitLabs for:**

- Host OS maintenance, network configuration, or storage issues.
- Configuration of your SIEM, CI platform, or log shippers.
- Interpretation of `[FAIL]` findings (these reflect your host configuration;
  consult your Security Owner).
- Custom audit-script development (available as a paid engagement).

## 20.3 Contact directory

**AuditToolkitLabs (Michael Churchill trading as AuditToolkitLabs)**
4th Floor, Silverstream House
45 Fitzroy Street, Fitzrovia
London W1T 6EB

Telephone: [+44 (0) 20 8090 9610](tel:+442080909610)

| Purpose | Address | Notes |
| --- | --- | --- |
| General, commercial, account | [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com) | For account and commercial queries. |
| Product support and defects | [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com) | Include diagnostic package. |
| Security vulnerabilities | [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com) | **Only** for security disclosures. |
| Licensing and contracts | [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com) | For tier changes and EULA queries. |

## 20.4 Diagnostic data to include

Every support request to [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com)
must include the following:

```bash
# 1. OS identity
uname -a
cat /etc/os-release

# 2. Toolkit version
audit-toolkit --version

# 3. Exact command that failed (with all flags)
# e.g. sudo audit-toolkit --auto --json /tmp/audit.json

# 4. Complete terminal output (stdout + stderr)
# Redirect with: ... > /tmp/output.txt 2>&1

# 5. Exit code
echo "Exit code: $?"

# 6. JSON report (redact hostnames and IPs if required)

# 7. Description of what changed before the issue appeared
```

**Redaction guidance:** Remove or hash the following before sharing
a report externally:

- `host_identity.hostname` — replace with `REDACTED-HOSTNAME`
- `host_identity.ip_addresses` — replace with `["REDACTED"]`
- Any user or group names that are sensitive

## 20.5 Security vulnerability reporting

Report suspected vulnerabilities **only** via one of these channels:

1. **Email:** [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
   — include a clear description, reproduction steps, and affected version.
2. **GitHub private advisory:** Use GitHub's "Report a vulnerability"
   function in the Security tab of the repository. This creates a
   private discussion visible only to maintainers.

**Do not** report vulnerabilities in public GitHub issues or via the
general Support inbox.

AuditToolkitLabs will acknowledge security reports within 2 business days
and aim to publish a patch within 14 days of confirmation, depending on
severity.

## 20.6 GitHub channels (non-confidential)

| Channel | URL | Use for |
| --- | --- | --- |
| Bug reports | Issues → New issue → Bug report | Reproducible defects (non-sensitive). |
| Feature requests | Issues → New issue → Feature request | Enhancement suggestions. |
| Discussions | Discussions tab | Questions, patterns, community Q&A. |
| Security advisory | Security tab → Report a vulnerability | Private vulnerability disclosure. |
| Releases | Releases page | Download packages; verify checksums. |

GitHub interactions are best-effort and not subject to contractual
response targets. For incidents requiring a defined response time,
always use the email Support address.
