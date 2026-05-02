# 4. Service Transition and Initial Setup

*ISO/IEC 20000-1 clauses 8.5, 8.6*

## 4.1 Pre-installation checklist

Before you begin installation, confirm that the following prerequisites
are in place:

| Item | Requirement |
| --- | --- |
| Host OS | Ubuntu 22.04 LTS, Debian 12, RHEL 9, or Windows Server 2019 / 2022 |
| Python | 3.12 or later (Linux installs only) |
| Database | PostgreSQL 15 or later (recommended for production) |
| RAM | 2 GB minimum; 4 GB recommended for 50+ targets |
| Disk | 10 GB minimum for application and logs; additional for audit result history |
| Network | Outbound HTTPS (443) from server to licence validation endpoint; inbound HTTPS from browsers and agents |
| TLS certificate | Valid certificate for the FQDN you will use; self-signed acceptable for evaluation |
| DNS / hostname | Stable FQDN resolvable from all client browsers and agent hosts |
| Licence key | Community and Trial tiers require no payment key; Trial requires email registration. Starter and above require a licence key from [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com) |

For a detailed server sizing guide see section 24.

## 4.2 Installation paths

Choose the installation path appropriate for your environment:

### Linux — DEB package (Ubuntu / Debian)

```bash
sudo dpkg -i audit-toolkit_<version>_amd64.deb
sudo systemctl enable --now audit-toolkit
```

### Linux — RPM package (RHEL / CentOS / Fedora)

```bash
sudo rpm -ivh audit-toolkit-<version>.x86_64.rpm
sudo systemctl enable --now audit-toolkit
```

### Linux — installation script (any distro)

```bash
bash install.sh
```

### Windows — MSI

Run `audit-toolkit-<version>.msi` as Administrator and follow the wizard.
Refer to the [Quick Start — Windows Installation](14-quick-start-windows-installation)
guide for the full walkthrough.

### VM appliance (OVA / OVF)

Import the OVA into your hypervisor. The application starts
automatically on first boot. The initial administrator credentials are
written to `/etc/audit-toolkit/initial-admin-credentials` on the
appliance. Change the password on first login.

## 4.3 First-run secrets setup

Before first production start, generate the required secrets:

```bash
# Linux
./scripts/setup-secrets.sh

# Windows
.\scripts\setup-secrets.ps1
```

This generates:

- A cryptographically secure `FLASK_SECRET_KEY` for session signing.
- A Fernet-formatted `DB_FIELD_ENCRYPTION_KEY` for field-level
  encryption.
- Sets `PRODUCTION_HARDENING_REQUIRED=true` to enforce startup
  validation.

The script is idempotent — existing secrets are never overwritten.

## 4.4 Environment profiles

| Profile | Use case | How to activate |
| --- | --- | --- |
| Development | Local testing, feature evaluation | `cp .env.dev .env` |
| Staging / test | Pre-production validation | `cp .env.test .env && ./scripts/setup-secrets.sh` |
| Production | Customer-facing deployments | `cp .env.production .env && ./scripts/setup-secrets.sh` |

## 4.5 Initial administrator account

On first start the application creates a built-in administrator account.
The randomly generated password is printed to the console or written to
the credentials file (appliance only). You **must** change this
password before making the application accessible to other users.

1. Sign in with the initial credentials.
2. Navigate to **Profile → Change Password**.
3. Set a strong password that meets your organisation's password policy.
4. Record the new password in your organisation's credential vault.

## 4.6 Acceptance testing after installation

Perform the following checks before handing the installation over for
production use:

| Check | Pass criterion |
| --- | --- |
| Web UI loads over HTTPS | Browser shows no certificate warning; page loads |
| Admin login succeeds | Dashboard is displayed |
| First audit run | At least one audit script runs and returns a result |
| Agent registration | A test agent registers and appears in the **Agents** list |
| Scheduled scan | A test schedule fires at the configured time |
| Backup | `POST /api/backup` returns a backup file |
| Email / SMTP | Test alert email is delivered to `<your test mailbox>` |

## 4.7 Licence activation

Community-tier installations (≤ 25 servers) require no key. For paid
tiers:

1. Obtain your licence key from
   [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com).
2. Navigate to **Admin → Licence** in the web console.
3. Enter the key and click **Activate**.
4. The console will display the active tier, server limit, and
   expiry date.

For air-gapped deployments that cannot reach the licence validation
endpoint, contact the Service Provider to request an offline licence
file.

## 4.8 Service transition responsibilities

| Activity | Customer | Service provider |
| --- | --- | --- |
| Provision host server | ✓ | |
| Install application packages | ✓ | guidance only |
| Configure database and run migrations | ✓ | guidance only |
| Configure TLS / reverse proxy | ✓ | guidance only |
| Create initial admin users | ✓ | |
| Deploy agents to audit targets | ✓ | guidance only |
| Validate installation and run acceptance tests | ✓ | |
| Provide installation documentation and guides | | ✓ |
| Supply licence key (paid tiers) | | ✓ |
