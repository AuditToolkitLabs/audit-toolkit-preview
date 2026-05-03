# 9. Security, Access and Data Protection

*ISO/IEC 20000-1:2018 clause 8.7*

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-01 |
| Product | AuditToolkit Linux Security Lite |

---

## 9.1 Security design principles

AuditToolkit Linux Security Lite is designed as a **read-only audit engine**.
Its core security properties are:

| Principle | Implementation |
| --- | --- |
| **Read-only by design** | Audit scripts inspect system state only. No package installations, no service restarts, no configuration changes are ever made. |
| **Least privilege by default** | Checks that require root are individually noted. Where root is unavailable, the check is marked `[SKIP]` rather than failing silently. |
| **No network egress** | All checks operate against local OS state. The toolkit makes no outbound network connections at runtime. |
| **Structured output** | JSON output is deterministic and schema-validated, enabling reproducible, auditable evidence. |
| **Minimal dependencies** | Runtime requires only Bash 4+, coreutils, grep, sed, and procps — all present in every supported distribution by default. |

## 9.2 Data classification

The JSON reports produced by the toolkit contain potentially sensitive
host information. Classify reports as **Restricted** or equivalent under
your data-classification policy:

| Data element | Category | Notes |
| --- | --- | --- |
| Hostname and IP metadata | Sensitive | May reveal network topology. |
| Installed package inventory | Sensitive | Reveals software versions and potential attack surface. |
| Running services and open ports | Sensitive | Reveals network-exposed services. |
| Security finding details | Sensitive | Reveals specific control gaps. |
| Kernel and OS version | Sensitive | May indicate unpatched systems. |
| User and group information | Sensitive | Listed where relevant to audit checks. |

## 9.3 Protecting report artefacts

| Control | Recommended setting |
| --- | --- |
| Directory permissions | `chmod 750 /var/log/audit-toolkit/` |
| Ownership | `chown root:audit-admins /var/log/audit-toolkit/` |
| Encryption at rest | Encrypt the filesystem volume or directory if required by policy. |
| Access logging | Enable OS-level audit logging (`auditd`) on the report directory. |
| Transport security | When shipping reports to SIEM or storage, use TLS 1.2+ encrypted channels. |
| Report redaction | Remove or hash hostnames and IPs before sharing report samples externally. |

## 9.4 Privilege model

| Execution model | Coverage impact | Risk |
| --- | --- | --- |
| **Root** | Full coverage; all checks run. | Report artefacts must be strictly access-controlled. |
| **Sudo (selected commands)** | Near-full coverage; some checks may SKIP if sudo rules do not cover them. | Reduced; good balance for most environments. |
| **Unprivileged** | Significantly reduced coverage; many hardening checks SKIP. | Acceptable for discovery-only or inventory-only runs. |

The coverage score in `completeness.coverage_score` reflects the effective
privilege level. Runs with a score below 60 should be reviewed for privilege
gaps before treating the output as a meaningful posture assessment.

## 9.5 Toolkit hardening (securing the tool itself)

Steps to harden the toolkit installation:

- **Verify release integrity**: check the SHA-256 of release packages
  against the published checksum before installation.
- **Restrict the install directory**: `chmod -R 755 /opt/audit-toolkit/`
  with root ownership; do not allow world-writeable paths.
- **Restrict the config directory**: `chmod 750 /etc/audit-toolkit/`
- **Use a dedicated service account** for scheduled runs rather than root
  where possible; document the sudo rules applied.
- **Audit the execution**: configure `auditd` to log executions of
  `/usr/local/bin/audit-toolkit`.
- **Do not expose reports over HTTP** unless they are access-controlled.

## 9.6 Vulnerability management

- AuditToolkitLabs monitors upstream advisories for the components used
  in the toolkit and issues patches accordingly.
- Subscribe to security advisories by emailing
  [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
  with the subject `Subscribe`.
- Report suspected vulnerabilities in the toolkit **only** to
  [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
  or via GitHub's private security-advisory workflow. Do not raise them
  in public GitHub issues.
- Each release is accompanied by a SHA-256 checksum for integrity
  verification; release packages are GPG-signed.

## 9.7 OWASP Top 10 and security assessment posture

The toolkit itself is a Bash-based tool, not a web application. Its OWASP
posture covers supply-chain integrity, code quality, and script security.
A full OWASP security scorecard is maintained by AuditToolkitLabs and
available at `docs/OWASP-SECURITY-SCORECARD.md` (current score: 100/100, A+).

For procurement and due-diligence enquiries, see
[22 — Security FAQ](22-security-faq.md).
