# 26. SIEM, ITSM and Webhook Payload Reference

*ISO/IEC 20000-1 clauses 8.1, 8.7, 9.1*

This reference defines recommended field mappings and payload handling
patterns for SIEM/ITSM/webhook integrations.

## 26.1 Common event fields

Recommended normalized fields:

- eventTimeUtc
- eventType
- severity
- actor
- target
- outcome
- sourceIp
- tenantOrWorkspace
- correlationId

## 26.2 SIEM mapping guidance

| Source field | SIEM normalized field |
| --- | --- |
| timestamp | eventTimeUtc |
| action | eventType |
| user/subject | actor |
| object/resource | target |
| status/result | outcome |

## 26.3 ITSM ticket mapping guidance

| Event severity | Ticket priority |
| --- | --- |
| Critical | P1 |
| High | P2 |
| Medium | P3 |
| Low | P4 |

## 26.4 Webhook delivery controls

- Authenticate webhook delivery with shared secret/token.
- Use retries with backoff and dead-letter handling.
- Implement idempotency key handling to prevent duplicate tickets.
- Track delivery success rate and failure reasons.

## 26.5 Payload validation checklist

- Required fields present.
- Timestamp in UTC.
- Tenant/workspace context present.
- Sensitive values redacted where required.
- Schema version tracked for downstream parsing.
