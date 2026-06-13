# API Authentication

Common authentication and authorization rules for AuditToolkit product APIs.

## 1. Authentication Methods

| Method                           | Use                                        |
| -------------------------------- | ------------------------------------------ |
| API key / token                  | Service-to-service and automation clients. |
| Session / bearer token           | Interactive UI and short-lived sessions.   |
| Mutual TLS or signed agent token | Managed and lightweight agents.            |

Product-specific setup guides document exact header names, token formats, and
key locations. The rules below are authoritative for how credentials behave.

## 2. Token Scope And Least Privilege

- Tokens are scoped to the minimum tenant, workspace, and capability needed.
- Read-only automation uses read-only tokens.
- Administrative tokens are never used for routine automation.

## 3. Transport Security

- All API traffic uses TLS. Plaintext API access is not supported in production.
- TLS verification is enabled by default and only relaxed by explicit,
  documented operator action in controlled environments.

## 4. Rotation And Revocation

- Tokens and keys are rotated on a documented schedule.
- Compromised or unused tokens are revoked promptly.
- Revocation takes effect without requiring a product restart where supported.

## 5. Identity Integration

Products that support enterprise identity integrate with LDAP, SSO (SAML/OIDC),
or Microsoft Entra ID. Claim and attribute mapping is documented per product;
the central [Authentication, LDAP, SSO, and Entra](../customer/integrations/authentication-ldap-sso-entra.md)
guide describes the shared integration pattern.

## 6. Secrets Handling

- API credentials are sensitive operational data.
- Credentials must never appear in logs, result output, support packages, or
  customer license directories.
