# 19. Quick Start — API Integration

*ISO/IEC 20000-1 clauses 7.5, 8.1, 8.7*

Use this runbook for third-party automation and data extraction.

## 19.1 Prerequisites

- Dedicated integration user exists.
- API key scope is agreed (read-only or read/write).
- Secret storage location is approved.
- Consumer application timeout/retry policy is defined.

## 19.2 Integration procedure

1. Create/confirm dedicated integration user.
2. Issue scoped API key in **Admin → API keys**.
3. Store key in secret manager (never source control).
4. Execute API smoke tests (authentication, list query, detail query).
5. If needed, enable write operations and test non-production first.
6. Implement key rotation schedule and owner assignment.

## 19.3 Validation checklist

- API consumer authenticates successfully.
- Permission scope matches intended use.
- Rate-limit behaviour is handled in client logic.
- API failures are logged and alerted.

## 19.4 Security controls

- Use one key per integration, not shared keys.
- Revoke keys immediately on compromise or ownership change.
- Review key usage and last-used timestamps regularly.
