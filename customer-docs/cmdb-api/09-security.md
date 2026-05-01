# 9. Security, Access and Data Protection

*ISO/IEC 20000-1 clause 8.7*

## 9.1 Security principles

The application is designed for on-site deployment within a controlled
network. The following are assumed to be in place and are the
customer's responsibility:

- TLS termination by a reverse proxy or load balancer using a
  certificate trusted by the user population.
- Network segmentation between the application host, the database and
  the endpoints being inventoried.
- Operating-system hardening of the application host and of the
  database server.
- Time synchronisation via a trusted NTP source.
- Centralised collection of host and application logs.

## 9.2 Access-control model

- All interactive access requires authentication; anonymous access is
  not supported.
- Sessions are HTTP-only, cookie-based, and bound to the originating
  IP address by default.
- API access is by per-user API keys; keys can be scoped (read-only or
  read/write) and revoked at any time. API requests bypass the EULA
  gate by design — they assume the human operator has already accepted
  the agreement when their API key was issued.
- Role assignments are evaluated on every request; a role change takes
  effect on the user's next page load.
- Password policy is configurable: minimum length, complexity, history
  and lockout thresholds.

## 9.3 Data ownership and protection

- The customer is the controller and owner of all inventory, user and
  audit data held by the application.
- The service provider is not granted access to customer data under
  the on-site deployment model. Any support-led troubleshooting is
  performed by you or under your direct supervision.
- Sensitive secrets (database password, API keys, SSO client secrets)
  must be stored in the host's secret store or in environment
  variables sourced from such a store; never commit them to source
  control.
- The application encrypts cookies and, where supported, encrypts API
  keys at rest.

## 9.4 Vulnerability management

- The service provider monitors upstream advisories for the components
  listed in `NOTICE.md` and issues patches accordingly.
- Customers should subscribe to the AuditAdmin Labs security advisory
  list by emailing
  [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
  with the subject `Subscribe`.
- Vulnerabilities reported by customers should be sent **only** to
  [Security@audittoolkitlabs.com](mailto:Security@audittoolkitlabs.com)
  and not raised in the public ticketing system or via the general
  Support inbox.
- The application's own dependency tree is scanned by the service
  provider as part of every release; the policy is to ship no Critical
  or High CVSS issues at general availability.

## See also

For procurement and due-diligence enquiries, a one-page reference FAQ
is available at [Security FAQ — Procurement and Due Diligence](33-security-faq).

For the full OWASP Top 10 code-audit results and findings register, see
[OWASP Top 10 Security Scorecard](34-owasp-security-scorecard).
