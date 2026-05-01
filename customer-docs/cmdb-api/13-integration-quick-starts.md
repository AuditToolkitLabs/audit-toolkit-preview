# 13. Integration Quick Starts

*ISO/IEC 20000-1 clauses 7.5, 8.1, 8.7, 9.1*

This section provides implementation-focused quick starts for common
integration points. Use these pages with your change-management process.

## 13.1 How to use this section

1. Start with the integration page that matches your use case.
2. Complete prerequisites before applying configuration.
3. Execute the validation checks listed in each quick start.
4. Record evidence in your change ticket and Appendix G worksheet.

## 13.2 Quick-start pages

1. [Authentication integration quick start](14-quick-start-authentication-integration)
2. [SIEM integration quick start](15-quick-start-siem-integration)
3. [Ticketing and webhook integration quick start](16-quick-start-ticketing-webhook-integration)
4. [Cloud and virtualisation connector quick start](17-quick-start-cloud-and-virtualisation-connectors)
5. [Managed agent onboarding quick start](18-quick-start-managed-agent-onboarding)
6. [API integration quick start](19-quick-start-api-integration)

## 13.3 Integration implementation standards

Apply these standards across all integrations:

- Use dedicated service accounts and least privilege.
- Store secrets in your approved secret manager.
- Keep UTC timestamps end to end for correlation.
- Define rollback steps before go-live.
- Verify alerts, logging and ownership before production use.
