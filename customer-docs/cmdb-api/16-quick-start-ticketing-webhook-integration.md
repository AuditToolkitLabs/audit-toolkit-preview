# 16. Quick Start — Ticketing and Webhook Integration

*ISO/IEC 20000-1 clauses 8.1, 8.6, 8.7*

Use this runbook to feed alerts/events into ITSM, ticketing or SOAR.

## 16.1 Prerequisites

- Destination endpoint URL and authentication method are approved.
- Webhook relay/transformation service is available.
- Event categories and routing rules are defined.
- Retry and dead-letter handling are designed.

## 16.2 Integration procedure

1. Configure webhook destination and shared secret/token.
2. Subscribe only to required event categories.
3. Transform payloads to target ticket schema in relay service.
4. Implement deduplication keys to prevent ticket floods.
5. Route priority events to on-call queues.
6. Send test events and verify ticket creation.

## 16.3 Validation checklist

- Successful delivery is visible in webhook logs.
- Failed deliveries are retried and alert correctly.
- Duplicate suppression works for repeat events.
- Ticket severity mapping matches SOC/ITSM policy.

## 16.4 Rollback

1. Disable webhook subscriptions.
2. Confirm no further outbound deliveries.
3. Re-enable only after root-cause correction.
