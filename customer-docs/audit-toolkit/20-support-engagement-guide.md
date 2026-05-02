# 20. Support Engagement Guide

## Overview

This guide describes how to engage support effectively, what
information to gather before raising a case, and what to expect from
the support process.

Full support policy: `SUPPORT-POLICY.md` at the repository root.

---

## Before raising a support case

Work through these steps to resolve common issues without opening a
ticket:

1. **Search existing GitHub Issues** — your problem may already be
   reported and resolved:
   <https://github.com/AuditToolkitLabs/Audit-Tool-/issues>

2. **Check the FAQ** — `FAQ.md` at the repository root covers the most
   common questions.

3. **Review the Troubleshooting Guide** — `docs/TROUBLESHOOTING-GUIDE.md`
   contains step-by-step diagnostic procedures.

4. **Check service health** — run `curl -s https://<hostname>/api/health`
   and `systemctl status audit-toolkit`.

5. **Check the application logs** — errors are usually explained clearly
   in the logs.

---

## Raising a GitHub Issue

For all tiers, the primary support channel is GitHub Issues:
<https://github.com/AuditToolkitLabs/Audit-Tool-/issues>

### Issue template

Include the following in your issue:

```markdown
**Environment**
- OS: (e.g. Ubuntu 22.04, RHEL 9, Windows Server 2022)
- Toolkit version: (from /api/health or the VERSION file)
- Installation method: (DEB, RPM, MSI, appliance, git)
- Database: (PostgreSQL 15, SQLite)
- Licence tier:

**Symptom**
A clear description of what is happening.

**Steps to reproduce**
1.
2.
3.

**Expected behaviour**
What should happen.

**Actual behaviour**
What actually happens.

**Logs**
Paste the relevant section of the application log:
journalctl -u audit-toolkit --since "2026-05-02 09:00:00" --until "2026-05-02 09:10:00"

**Health endpoint output**
curl -s https://<hostname>/api/health
```

### Security issues

Do **not** report security vulnerabilities via public GitHub Issues.
Email [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
with the details. See section 7.8 for the responsible disclosure policy.

---

## Emailing support (Starter tier and above)

Email [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com)
for Starter, Professional, Business, and Enterprise tiers.

Include everything listed in the GitHub Issue template above, plus:

- Your licence key reference.
- The contact name and organisation.
- Whether the issue is blocking production (P1 / P2 / P3 / P4 as
  defined in section 7.6).

Response targets by tier:

| Tier | Email response target |
| --- | --- |
| Starter | 2–5 business days |
| Professional | 1–3 business days |
| Business | 1–2 business days |
| Enterprise | 1 business day |

---

## Licensing and activation enquiries

Contact [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com)
for:

- Purchasing a licence or upgrading tiers.
- Requesting a renewal key.
- Requesting an offline (air-gapped) licence file.
- Reporting a licence key that is not activating.
- Clarifying what is covered by your current tier.

---

## What the Service Provider will and will not do

| Will do | Will not do |
| --- | --- |
| Investigate and fix confirmed product bugs | Advise on how to remediate security findings |
| Provide guidance on documented features | Write custom audit scripts or integrations |
| Issue licence keys and handle activation | Provide on-call or after-hours emergency support |
| Publish security advisories and patches | Attend customer calls or provide live training |
| Respond to responsible vulnerability disclosures | Provide consulting or architecture advice |

---

## Escalation

If a support issue is not being resolved within the target response
time, email [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com)
and reference the GitHub Issue number or original support email
thread.
