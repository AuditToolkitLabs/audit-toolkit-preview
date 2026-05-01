# 20. Core Server Installation Guide (Linux and Windows)

*ISO/IEC 20000-1 clauses 6.3, 7.5, 8.1, 8.7*

This guide provides a customer-facing installation standard for the core
CMDB API Data Collection Tool server on Linux or Windows.

## 20.1 Scope

This guide covers:

- Supported platform baseline.
- System requirements.
- Permission and account model.
- Networking and firewall rules.
- Security controls required before go-live.

This guide does not replace your internal OS hardening standards,
backup standards or change-management process.

## 20.2 Supported platform baseline

Use a supported server-grade operating system and keep it fully patched.

| Platform family | Recommended baseline | Architecture |
| --- | --- | --- |
| Linux | Enterprise Linux distribution with vendor support (for example Ubuntu LTS, RHEL, Rocky, Debian stable) | x86_64 |
| Windows | Windows Server supported by Microsoft under current support lifecycle | x86_64 |

Baseline software requirements:

- Python 3.12 or later.
- PostgreSQL 15 or later for production.
- Reverse proxy or load balancer for TLS termination.
- Time synchronization (NTP).

## 20.3 System requirements

### Minimum (pilot or small estate)

- 4 vCPU
- 8 GB RAM
- 50 GB disk (OS + app + logs + working space)

### Recommended (production starting point)

- 8 vCPU
- 16 GB RAM
- 150 GB disk minimum, with separate growth allowance for logs and backups

### Storage and performance guidance

- Place PostgreSQL data on low-latency storage.
- Separate OS, app logs and database backup locations where possible.
- Monitor disk free space with alerting (warn at 20 percent, critical at
  10 percent).

## 20.4 Service account and permissions model

Apply least privilege and avoid interactive admin use for runtime.

### Linux permissions model

1. Create a dedicated non-login service account for the application
   process.
2. Grant read/write only to required application paths (for example
   instance data and logs).
3. Run the service with systemd under the service account.
4. Keep database credentials in a secrets store or protected environment
   file readable only by the service account.
5. Do not run the application process as root except during controlled
   installation steps.

### Windows permissions model

1. Create a dedicated service account (or managed service account).
2. Grant Log on as a service right.
3. Grant least-privilege NTFS access to application, logs and data paths.
4. Restrict local administrator membership to break-glass use only.
5. Store secrets using approved secure storage and ACL-protected
   configuration paths.

### Database permissions

- Create a dedicated database role for the application.
- Grant only required privileges on the application schema.
- Block superuser use by the application connection account.
- Rotate database credentials according to policy.

## 20.5 Networking and firewall rules

Use deny-by-default and open only required flows.

### Required inbound rules (to application tier)

| Source | Destination | Port/Protocol | Purpose |
| --- | --- | --- | --- |
| User/admin networks | Reverse proxy or load balancer | TCP 443 | Web UI and API access |
| Endpoint agent networks | Reverse proxy or load balancer | TCP 443 | Agent check-in and data submission |

### Required east-west rules

| Source | Destination | Port/Protocol | Purpose |
| --- | --- | --- | --- |
| App server | PostgreSQL server | TCP 5432 | Database connectivity |

### Required outbound rules

| Source | Destination | Port/Protocol | Purpose |
| --- | --- | --- | --- |
| App server | Identity provider (LDAP/SAML/OIDC) | TCP 443 (and LDAP/LDAPS as used) | Authentication integration |
| App server | Connector targets (cloud, hypervisor APIs) | Typically TCP 443 | Inventory collection |
| App server | SMTP relay | TCP 587 or customer standard | Email and notifications |
| App server | DNS resolvers | UDP/TCP 53 | Name resolution |
| App server | NTP source | UDP 123 | Time synchronization |

### Firewall hardening notes

- Restrict management access (RDP/SSH) to privileged admin subnets only.
- Do not expose database port publicly.
- Do not expose internal service ports to untrusted networks.
- Use network segmentation between web, app and database tiers.

## 20.6 TLS and certificate requirements

1. Use TLS 1.2 or higher for all user and agent-facing endpoints.
2. Use certificates signed by a trusted internal or public CA.
3. Enforce certificate renewal monitoring and expiry alerts.
4. Disable insecure cipher suites per your security baseline.
5. Ensure hostnames in certificates match endpoint URLs used by users
   and agents.

## 20.7 Core installation workflow

1. Provision hardened server (Linux or Windows) from approved image.
2. Install Python runtime and required packages.
3. Install and configure PostgreSQL (local or remote managed instance).
4. Create application database and least-privilege database role.
5. Deploy application files and dependencies into an isolated runtime
   environment.
6. Configure environment variables and secrets.
7. Apply schema migrations.
8. Configure reverse proxy/load balancer and TLS certificate.
9. Start application service under dedicated service account.
10. Perform post-install smoke tests.

## 20.8 Post-install smoke tests

- Application reachable over HTTPS.
- Admin sign-in successful.
- EULA flow operates correctly.
- Database connectivity stable.
- Audit log records sign-in and configuration changes.
- Backup job configured and first backup verified.

## 20.9 Security controls before production go-live

- Host vulnerability scan completed with no unapproved critical findings.
- OS and package patch level current.
- Secrets not stored in source control.
- Central log forwarding enabled (application, reverse proxy, OS).
- Alerting configured for service downtime, backup failure and disk
  pressure.
- Break-glass access process documented and tested.
- Disaster recovery restore test completed in non-production.

## 20.10 Installation record template

Record the following in your change or implementation ticket:

- Server hostname(s), IPs and environment.
- OS version and patch level.
- Application version.
- Database version and endpoint.
- Service account identifier.
- Firewall rule references and approval IDs.
- TLS certificate subject and expiry date.
- Smoke test evidence and sign-off.
