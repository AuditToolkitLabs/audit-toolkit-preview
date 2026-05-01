# 4. Service Transition and Initial Setup

*ISO/IEC 20000-1 clauses 6.3, 8.5*

## 4.1 Pre-deployment prerequisites

Before installing the application, ensure the following are in place.

### Hardware / virtual machine

- 4 vCPU, 8 GB RAM and 50 GB disk for environments up to ~5 000
  endpoints. Larger estates require proportional sizing — contact
  AuditAdmin Labs Support (see section&nbsp;7) for guidance.
- Out-of-band management or console access for break-glass scenarios.

### Software

- A supported host operating system (see section 2.2).
- Python 3.12 or later with `pip`.
- PostgreSQL 15+ for production deployments.
- A reverse proxy or load balancer terminating TLS in front of the
  application (recommended).

### Network

- Inbound HTTPS from the administrator and end-user populations.
- Inbound HTTPS from agents on the endpoints being inventoried.
- Outbound connectivity to the systems being polled by API connectors
  (e.g. vCenter on TCP/443).
- Outbound connectivity to your identity provider (LDAP/AD, SAML or
  OIDC) if SSO is enabled.

### Security controls

- A TLS certificate (commercial, internal CA or ACME) for the
  application's public hostname.
- A backup solution for the database and the `instance/` directory.
- A monitored time source (NTP); the audit log relies on accurate UTC
  timestamps.

## 4.2 Initial configuration overview

High-level steps. Detailed technical procedures are provided in the
deployment guide shipped to your engineering team.

1. Provision the host and OS.
2. Install PostgreSQL and create the application database and user.
3. Install the application and its Python dependencies into a virtual
   environment.
4. Apply the schema migrations from `db/migrations/`.
5. Set the environment variables required for first run, including:
   - `LICENSE_TIER` — set to `standard`, `workgroup`, `msp` or `oem`.
   - `SECRET_KEY` — a long random string.
   - Database connection string.
6. Start the application behind your reverse proxy.
7. Sign in for the first time — you will be presented with the EULA.
   Reading and accepting it records the evidence required by section 7
   of the EULA. The acceptance is stored with your user account, the
   originating IP, the User-Agent string and a SHA-256 hash of the
   licence text.
8. Create your administrator users, configure SSO/LDAP if used, and
   issue API keys for any automation.

## 4.3 Service acceptance criteria

The service is considered ready for operational use when **all** of the
following are true:

- The application is reachable over HTTPS from the intended user
  populations.
- An administrator has signed in, accepted the EULA and confirmed the
  licence tier.
- At least one connector or agent is reporting inventory successfully.
- A scheduled database backup has run and been verified.
- The audit log shows expected entries for sign-in, configuration
  change and EULA acceptance events.
- A nominated Application Administrator on the customer side has
  signed off the deployment.
