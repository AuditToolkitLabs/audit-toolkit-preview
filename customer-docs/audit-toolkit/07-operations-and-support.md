# 7. Operations and Support Model

*ISO/IEC 20000-1 clauses 8.7, 8.8*

## 7.1 Support model overview

The Security Audit Toolkit is developed and maintained by an
**independent developer** trading as **AuditAdmin Labs**. Support is
provided on a best-effort basis and is **not** equivalent to enterprise
vendor support with guaranteed SLAs.

> **Please set realistic expectations.** This is not a 24/7 support
> operation. Response times are targets, not guarantees. For
> business-critical deployments, establish internal ownership and
> escalation procedures before go-live.

## 7.2 What is supported

The following categories of request are in scope:

| Category | Examples |
| --- | --- |
| Bug reports | Crashes, incorrect audit results, installation failures, compatibility issues |
| Licence and activation | Key delivery questions, tier clarification, offline licence requests |
| Documentation questions | Clarification on documented features, suggestions for improvements |
| Security vulnerability reports | Responsible disclosure of security issues (use the security contact) |

## 7.3 What is not supported

| Category | Notes |
| --- | --- |
| Remediation assistance | The toolkit identifies findings; implementing fixes is your responsibility |
| Consulting and managed services | Architecture design, custom audit authoring, environment-specific tuning |
| Production emergencies | No on-call support; engage a qualified security professional for critical incidents |
| Phone or video calls | All support is asynchronous and in writing |
| Live training sessions | Documentation and examples are self-service |

## 7.4 Vendor contact directory (AuditAdmin Labs)

| Purpose | Contact |
| --- | --- |
| General / commercial enquiries | [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com) |
| Product support (all paid tiers) | [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com) |
| Security vulnerability disclosure | [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com) |
| Licensing and key delivery | [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com) |
| GitHub Issues (all tiers) | <https://github.com/AuditToolkitLabs/Audit-Tool-/issues> |

## 7.5 Support tiers

| Tier | Channel | Response target |
| --- | --- | --- |
| **Community (free, ≤ 25 servers)** | GitHub Issues only | Best effort |
| **Trial (14-day, ≤ 150 servers)** | GitHub Issues only | Best effort |
| **Starter (≤ 50 servers)** | Email + GitHub Issues | 2–5 business days |
| **Professional (≤ 150 servers)** | Email + GitHub Issues | 48 hours |
| **Business (≤ 500 servers)** | Priority email + GitHub Issues | 1–2 business days |
| **Enterprise (unlimited)** | Priority email + call scheduling | 1 business day |

Response times are targets only. Holiday and weekend coverage is
limited.

## 7.6 Incident management

### Raising an incident

If the application is unavailable or producing incorrect results:

1. Check the application and system logs:
   - Linux: `journalctl -u audit-toolkit -n 100`
   - Windows: Event Viewer → **Application** log
2. Review the [Troubleshooting Guide](../docs/TROUBLESHOOTING-GUIDE.md).
3. If the issue persists, open a GitHub Issue with the information
   listed in Appendix D of section 12.

### Severity definitions (internal)

| Severity | Definition | Your target resolution time |
| --- | --- | --- |
| P1 — Critical | Application completely unavailable; no workaround | 4 hours |
| P2 — High | Major feature unavailable; workaround exists | 1 business day |
| P3 — Medium | Degraded functionality; workaround exists | 5 business days |
| P4 — Low | Cosmetic issue or enhancement request | Next release |

These definitions are for your internal incident process. The Service
Provider does not commit to resolution times aligned to these severities
unless a written SLA has been agreed.

## 7.7 Known limitations and workarounds

See section 24 (Operational Limits and Known Constraints) for the
current list of known issues and their workarounds.

## 7.8 Security advisory process

When a security vulnerability is identified in the product:

1. The Service Provider will publish a security advisory on the GitHub
   repository.
2. Customers on paid tiers will receive an advisory email to the
   contact address on file.
3. A patched release will be made available as soon as possible.
4. The advisory will include the affected versions, CVE reference (if
   assigned), severity rating, and upgrade instructions.

To report a vulnerability, email
[Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com).
Do not disclose security issues publicly until the Service Provider has
confirmed remediation.
