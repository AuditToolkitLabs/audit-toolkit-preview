# 11. Continual Improvement

*ISO/IEC 20000-1 clause 10*

## 11.1 Nonconformity handling

A nonconformity is any departure of the service from this
documentation, the EULA or applicable customer policy. When one is
identified:

1. Record it in your service-management system with date, scope and
   evidence (audit-log extracts, screenshots, log snippets).
2. Apply containment if user-impacting (disable a connector, revoke an
   API key, isolate an account).
3. Determine root cause; correlate with the audit log for any related
   activity.
4. Choose a corrective action with an owner and a target date.
5. Verify after implementation that the corrective action removed the
   cause; close the record.
6. Where the cause is a product defect, raise it with the service
   provider; for security causes use the security email rather than
   the standard channel.

## 11.2 Improvement feedback

We welcome improvement suggestions. Channels:

- Routine enhancement requests: AuditAdmin Labs Support
  (`Support@audittoolkitlabs.com`) with subject prefix `[Improvement]`.
- Documentation corrections: same address, prefix `[Docs]`.
- Licensing, tier or contractual change requests: AuditAdmin Labs
  License (`License@audittoolkitlabs.com`).
- Roadmap conversations: raise during the annual contractual review
  with AuditAdmin Labs Admin (`admin@audittoolkitlabs.com`).

Improvements accepted onto the roadmap are tracked publicly in the
release notes when delivered.

## 11.3 Lessons learned

After any Severity 1 or Severity 2 incident the customer should hold a
post-incident review covering:

- Timeline of detection, response and recovery.
- Whether monitoring or alerting could have detected the issue
  earlier.
- Whether the runbook used was correct and complete.
- Specific corrective actions, with owners.

Where the underlying cause involves the product itself, share the
write-up with the service provider so the same defect is prevented
elsewhere.
