# 9. Security and Access Model

Asset Command Centre is intended to run inside a customer-controlled
network with a hardened operating system, reverse proxy or HTTPS
termination path, and customer-managed secrets.

For production release evidence and scan results, see:

- `14-customer-security-assurance-report.md`
- `changelog.md`

## Security basics

- use HTTPS for the customer-facing UI
- keep privileged roles under MFA
- store target credentials only through the product's encrypted
  credential-management workflow
- restrict connector exposure to the active allowlist
- keep super-admin portal access limited and audited

## Access model

- the main application uses role-based access control
- the super-admin portal requires a separate MFA-verified session
- team and report-scope values are administrative metadata, not a hard
  tenancy boundary

## Sensitive operations

Sensitive actions include:

- applying license changes
- managing encrypted target credentials
- changing MFA requirements
- changing connector policy and tuning settings
- generating or applying certificates and SSH keys
- using API-code and log portal functions
