# 23. API Consumer and Automation Guide

*ISO/IEC 20000-1 clauses 7.5, 8.1, 8.7*

This guide explains how customer automation should consume the CMDB API
safely and reliably.

## 23.1 Authentication model

- API access uses X-API-Key header authentication.
- Use dedicated integration users and dedicated keys per integration.
- Use least-privilege key ownership and rotate keys on schedule.

## 23.2 API usage standards

1. Use HTTPS only.
2. Set request timeouts and retry with backoff.
3. Treat non-2xx responses as actionable errors.
4. Log request correlation data without logging secrets.
5. Respect tenant/workspace boundaries in all automation.

## 23.3 Suggested client behavior

- Timeout: 10 to 30 seconds per call.
- Retries: up to 3 attempts for transient failures.
- Backoff: exponential with jitter.
- Idempotency: design write operations to be replay-safe where possible.

## 23.4 Common error handling patterns

| HTTP status | Typical meaning | Consumer action |
| --- | --- | --- |
| 401 | Missing/invalid API key | Rotate or correct credential; verify header format |
| 403 | Permission denied | Verify user role and scope |
| 404 | Resource not found | Validate identifiers and tenant context |
| 429 | Rate limited | Backoff and retry later |
| 500 | Server-side error | Retry if transient, then escalate with evidence |

## 23.5 Key management controls

- Store keys in secret manager only.
- Never commit keys to source control.
- Assign owner and expiry date per key.
- Revoke keys immediately on role change or incident.

## 23.6 API integration checklist

- Integration user created.
- Scoped key issued and securely stored.
- Smoke tests passed in non-production.
- Error/timeout/retry policy implemented.
- Monitoring and alerting enabled for API failures.
