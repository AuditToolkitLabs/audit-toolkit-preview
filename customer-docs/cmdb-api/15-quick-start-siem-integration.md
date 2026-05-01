# 15. Quick Start — SIEM Integration

*ISO/IEC 20000-1 clauses 8.7, 9.1, 9.4*

Use this runbook to onboard CMDB API Data Collection Tool logs into
your SIEM/SOC platform.

## 15.1 Prerequisites

- SIEM ingestion endpoint and parser path are approved.
- Log forwarding agent is installed on app/proxy hosts.
- Required firewall egress is open to SIEM collector.
- SOC owner has defined severity and escalation policy.

## 15.2 Integration procedure

1. Forward application, proxy and relevant system logs.
2. Parse fields: timestamp, actor, action, target, outcome, source IP.
3. Normalize timestamps to UTC.
4. Create detection rules for:
   - repeated auth failures,
   - admin-role changes,
   - API key lifecycle events,
   - auth provider configuration changes.
5. Build dashboard views for daily operations and security review.
6. Trigger controlled test events and validate alert routing.

## 15.3 Validation checklist

- SIEM receives events within expected ingestion SLA.
- At least one test alert is generated and triaged.
- False positives are documented and tuned.
- On-call routing is verified.

## 15.4 Ongoing maintenance

- Revalidate parsers after each product release.
- Review detection thresholds monthly.
- Retain logs per your security policy.
