# 11. Continual Improvement

*ISO/IEC 20000-1:2018 clause 10*

| Field | Value |
| --- | --- |
| Document version | 1.1 |
| Last updated | 2026-05-01 |
| Product | AuditToolkit Linux Security Lite |

---

## 11.1 Improvement process

The improvement cycle operates at two levels:

**Product-level** (AuditToolkitLabs responsibility):

1. Monitor support tickets, GitHub issues, and security advisories.
2. Identify recurring defects, coverage gaps, and distro-compatibility issues.
3. Prioritise fixes and enhancements in the release backlog.
4. Validate changes across the full CI matrix (Ubuntu, Debian, RHEL,
   Fedora, Alpine, Arch, Void, Gentoo).
5. Publish release with CHANGELOG, signed packages, and updated
   documentation.

**Customer-level** (customer responsibility):

1. Collect run health metrics and FAIL/WARN trends from the SIEM or
   monitoring dashboard.
2. Review skip-reason distribution monthly to identify privilege or
   tooling gaps.
3. Maintain an exceptions register for findings that cannot be
   remediated and document the accepted risk.
4. Feed defects, false positives, and enhancement requests back to
   AuditToolkitLabs via the channels in section 7.4.

## 11.2 Backlog themes

Current improvement themes across toolkit releases include:

- Extended distro-specific hardening checks (Alpine, Arch, Void, Gentoo
  compared to Debian/RHEL baseline).
- Richer remediation hints in `[FAIL]` output to reduce mean-time-to-triage.
- Improved skip-reason metadata for privilege vs. missing-tool differentiation.
- Additional SIEM export helpers and dashboard templates.
- Extended CIS Benchmark coverage mapping for newer benchmark versions.
- Performance optimisation for large-fleet scheduled runs.

## 11.3 Review cadence

| Cadence | Activity |
| --- | --- |
| Per release | Review CHANGELOG, assess impact on coverage scores and integrations. |
| Monthly | Customer-doc refresh for accuracy and onboarding clarity. |
| Quarterly | Roadmap review aligned to support feedback and CIS/NIST benchmark updates. |
| Annual | Full OWASP security scorecard re-assessment. |

## 11.4 Feedback channels

| Channel | Use for |
| --- | --- |
| [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com) | Defects, incorrect results, how-to questions. |
| [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com) | Feature suggestions, commercial feedback, roadmap discussions. |
| GitHub Issues | Public bug reports and feature requests (non-sensitive). |
| GitHub Discussions | Community Q&A, deployment patterns, best-practice sharing. |

All feedback is reviewed and acknowledged. Enhancement requests that are
declined will receive an explanation; those accepted will be tracked to
a future release milestone.
