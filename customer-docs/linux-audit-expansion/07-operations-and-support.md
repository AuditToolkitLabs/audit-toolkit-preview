# 7. Operations and Support Model

*ISO/IEC 20000-1:2018 clauses 8.1, 8.6, 8.7*

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-01 |
| Product | AuditToolkit Linux Security Lite |

---

## 7.1 Support responsibilities

| Activity | Customer | AuditToolkitLabs |
| --- | --- | --- |
| First-line support to your operations team | ✓ | |
| Triage incidents to determine root cause | ✓ | |
| Diagnose and resolve host / OS / network issues | ✓ | |
| Investigate suspected product defects | guidance | ✓ |
| Supply product bug fixes, patches and advisories | | ✓ |
| Maintain audit script library and shim layer | | ✓ |
| Roadmap and major version upgrades | | ✓ |

Support requests to AuditToolkitLabs must be raised by a named Toolkit
Administrator or Security Owner. Provide the diagnostic package described
in Appendix D (section 12) with every support request.

## 7.2 Incident management

### Identification

Operational incidents may be identified by:

- Scheduled job failure (non-zero exit from cron or systemd timer).
- Missing or empty JSON report artefact.
- Schema validation failure in CI or SIEM ingestion pipeline.
- Unexpected drop in coverage or confidence score.
- SIEM alert on FAIL count spike.

### Severity guidance

| Severity | Definition | Initial response target |
| --- | --- | --- |
| **1 — Critical** | Toolkit completely unable to run on any host; confirmed data loss or security exposure linked to the tool. | Immediate — contact [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com). |
| **2 — High** | Audit runs failing consistently on a class of hosts; SIEM or CI gate broken with no workaround. | Same business day. |
| **3 — Medium** | Individual checks producing incorrect results; coverage degraded; workaround available. | Next business day. |
| **4 — Low** | Cosmetic output issue; documentation question; feature suggestion. | Within five business days. |

### First-line triage flow

1. Confirm command invocation and privilege level.
2. Confirm the JSON report file was created and is non-empty.
3. Validate the report: `python3 /opt/audit-toolkit/ci/validate-report-schema.py <report.json>`
4. Review `skip_reasons` in the report for privilege or tooling gaps.
5. Reproduce on a second host to rule out host-specific issues.
6. If the defect is reproducible and not host-specific, escalate to
   AuditToolkitLabs with the escalation data package.

### Escalation data package

Include with every escalation to the service provider:

- Linux distribution name, version, and kernel (`uname -a`, `cat /etc/os-release`).
- Exact command used and the full terminal output.
- Exit code from the command.
- The JSON report file (redact any sensitive hostname or IP data if needed).
- Recent changes to the host environment or toolkit installation.

## 7.3 Service continuity

The toolkit is a self-contained binary distribution. Continuity measures:

- Keep at least two prior release packages in your artefact repository.
- Test that rollback to the prior version produces valid reports before
  removing it.
- For fleet deployments, stagger upgrades — pilot on 10% of hosts first.
- Retain signed release checksums from GitHub Releases for integrity
  verification.

## 7.4 AuditToolkitLabs contact directory

**AuditToolkitLabs (Michael Churchill trading as AuditToolkitLabs)**
4th Floor, Silverstream House
45 Fitzroy Street, Fitzrovia
London W1T 6EB

Telephone: [+44 (0) 20 8090 9610](tel:+442080909610)

| Purpose | Contact address |
| --- | --- |
| General service-management, account and commercial queries | [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com) |
| Product support, incidents, defects, how-to questions | [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com) |
| Security advisories, suspected vulnerabilities, responsible disclosure | [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com) |
| Licensing, tier changes, and commercial contract queries | [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com) |

Guidance:

- Send security matters **only** to the Security address. Do not raise
  them in the public GitHub issue tracker or via the general Support inbox.
- Licensing and contractual matters must go to the License address; the
  Support team cannot vary licence terms.
- Always include the diagnostic data from section 7.2 when contacting Support.

## 7.5 GitHub channel

The product repository is at
[`AuditToolkitLabs/AuditToolkit-Linux-Security-Lite`](https://github.com/AuditToolkitLabs/AuditToolkit-Linux-Security-Lite).

| GitHub destination | Use it for |
| --- | --- |
| **Issues → Bug report** | Reproducible product defects with reproduction steps. |
| **Issues → Feature request** | Enhancement proposals and roadmap suggestions. |
| **Discussions** | Questions and deployment patterns. |
| **Security advisory (private)** | Private vulnerability reporting — visible to maintainers only. |
| **Releases** | Download signed release packages and verify SHA-256 checksums. |

**Do not** post customer-identifying data, production hostnames,
IP addresses, or audit report extracts to public GitHub issues.
**Do not** report suspected vulnerabilities in public Issues or Discussions.
