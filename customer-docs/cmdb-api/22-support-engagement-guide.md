# 22. Support Engagement Guide

*ISO/IEC 20000-1 clauses 8.1, 8.2, 8.6, 8.7*

This guide explains how to engage support, what information to collect
before contacting support, and how to route issues correctly.

## 22.1 When to contact support

Contact support when:

- A reproducible product defect is suspected.
- Core service functions are unavailable or degraded.
- Security-related concerns require vendor guidance.
- Licensing or entitlement clarification is needed.
- You need release/upgrade clarification for supported versions.

Do not contact support for routine internal service-desk tasks unless
first-line triage has been completed.

## 22.2 Support channels and purpose

| Purpose | Channel | Use for |
| --- | --- | --- |
| Product incidents and defects | [Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com) | Operational issues, bug reports, how-to support |
| Security concerns and vulnerability disclosure | [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com) | Suspected vulnerabilities, active security concerns |
| Licensing and commercial matters | [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com) | Licence tiers, contracts, entitlement questions |
| General account/admin queries | [admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com) | Non-incident service-management queries |

Telephone (business contact): [+44 (0) 20 8090 9610](tel:+442080909610)

## 22.3 Severity classification before contact

| Severity | Definition | Example |
| --- | --- | --- |
| Sev 1 (Critical) | Service unavailable, confirmed data loss, or active security incident | UI/API unavailable for all users |
| Sev 2 (High) | Major feature unavailable, no practical workaround | Inventory ingestion halted across multiple groups |
| Sev 3 (Medium) | Partial degradation with workaround | One connector type failing, others healthy |
| Sev 4 (Low) | Minor issue, question, cosmetic concern | Documentation clarification request |

Include proposed severity in your support request.

## 22.4 Information to gather before contacting support

Collect this minimum data set first:

1. Product version and deployment model.
2. Environment details:
   - OS version of application host,
   - database version,
   - reverse proxy/load balancer in use.
3. Exact problem statement and business impact.
4. UTC time window when issue occurred.
5. Reproduction steps (if repeatable).
6. Expected result vs actual result.
7. Relevant logs:
   - application logs,
   - reverse proxy logs,
   - audit-log extracts.
8. Error messages copied verbatim.
9. Recent changes (patches, config changes, cert changes, network
   changes).
10. Evidence that first-line checks were completed.

## 22.5 Security and privacy requirements when sharing data

- Redact secrets, API keys, tokens, passwords and private keys.
- Redact sensitive personal data unless explicitly required for
  diagnosis and approved by policy.
- Do not post sensitive production details in public channels.
- Use the Security contact for vulnerability details, not public issue
  trackers.

## 22.6 Support request template

Use this template when emailing support:

- Subject: `<CustomerName> <Environment> <Severity> <Short Summary>`
- Contact name and role: `<name>`
- Contact method and availability: `<email/phone/timezone>`
- Severity: `<Sev1/Sev2/Sev3/Sev4>`
- Affected service/component: `<core server/agent/connectors/reporting>`
- Start time (UTC): `<YYYY-MM-DD HH:MM UTC>`
- Business impact: `<impact summary>`
- Steps to reproduce: `<numbered steps>`
- Expected result: `<expected>`
- Actual result: `<actual>`
- Error text: `<exact error>`
- Change context (last 48 hours): `<changes>`
- Attachments/log references: `<file names or ticket links>`

## 22.7 Support engagement workflow

1. Raise incident internally via service desk.
2. Perform first-line triage and gather required evidence.
3. Route to correct vendor mailbox by issue type.
4. Provide complete data set in first message.
5. Respond promptly to follow-up questions.
6. Implement agreed mitigation or fix.
7. Confirm service restoration and close incident record.
8. Record lessons learned and preventive actions.

## 22.8 Escalation guidance

Escalate when:

- Severity is Sev 1 or Sev 2.
- There is a risk of SLA breach.
- There is customer-visible impact without workaround.
- A security issue is ongoing.

Escalation package should include:

- Current status and timeline.
- Actions already taken.
- Outstanding blockers.
- Decision needed from support.

## 22.9 Related references

- Change and release process: section 8.
- Operations and support model: section 7.
- Maintenance and release runbook: section 21.
- Information-gathering checklist: Appendix D (section 12).
