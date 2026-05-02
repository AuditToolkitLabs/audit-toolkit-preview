# 14. Quick Start — Windows Installation

## Overview

This guide walks through installing the Security Audit Toolkit core
server on Windows Server using the MSI installer. Estimated time:
20–30 minutes.

## Prerequisites

| Requirement | Value |
| --- | --- |
| OS | Windows Server 2019 / 2022 or Windows 10 / 11 (64-bit) |
| .NET | .NET 8 Runtime (included in MSI) |
| PostgreSQL | 15+ recommended; bundled SQLite acceptable for evaluation |
| RAM | 2 GB minimum |
| Disk | 10 GB minimum |
| Open inbound port | 443 (HTTPS via IIS or Nginx for Windows) |
| Browser | Modern browser (Chrome, Edge, Firefox) |

## Step 1 — Run the MSI installer

1. Download `audit-toolkit-<version>.msi` from the releases page.
2. Right-click the MSI and select **Run as administrator**.
3. Follow the installer wizard:
   - Accept the End-User Licence Agreement.
   - Choose the installation directory (default:
     `C:\Program Files\AuditToolkit\`).
   - Enter the database connection string when prompted.
   - Click **Install**.
4. The installer creates:
   - A Windows service **AuditToolkit** (web application).
   - A Windows service **AuditToolkitWorker** (Celery scheduler).
   - A Start Menu shortcut to the admin console.

## Step 2 — Generate secrets

Open PowerShell as Administrator and run:

```powershell
& "C:\Program Files\AuditToolkit\scripts\setup-secrets.ps1"
```

## Step 3 — Configure HTTPS

The application listens on `localhost:5000` by default. Expose it over
HTTPS using IIS as a reverse proxy, or install Nginx for Windows:

### IIS reverse proxy

1. Install the **Application Request Routing** and **URL Rewrite**
   IIS modules.
2. Create a new IIS site bound to port 443 with your TLS certificate.
3. Add a URL Rewrite reverse proxy rule forwarding to
   `http://localhost:5000`.

### Nginx for Windows

Download Nginx for Windows, configure `nginx.conf` equivalently to the
Linux example in section 13, and start Nginx as a service.

## Step 4 — First login

Open `https://<your-hostname>/` in your browser. The initial
administrator password is displayed in the MSI installer log and
written to
`C:\ProgramData\AuditToolkit\initial-admin-credentials.txt`. **Delete
this file and change the password immediately after first login.**

## Step 5 — Windows firewall

Allow inbound HTTPS through Windows Defender Firewall:

```powershell
New-NetFirewallRule -DisplayName "AuditToolkit HTTPS" `
    -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
```

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Service fails to start | Check Event Viewer → **Application** log |
| Database connection error | Verify `DATABASE_URL` in `C:\ProgramData\AuditToolkit\.env` |
| Web UI returns 502 | Check that the **AuditToolkit** service is running; check IIS ARR configuration |
| TLS certificate error | Ensure the certificate is bound to port 443 in IIS; check the certificate chain |

Full Windows deployment guide: `WINDOWS-DEPLOYMENT-QUICK-START.md`
at the repository root.

For further help see `docs/WINDOWS-SETUP.md` or open an issue at
<https://github.com/AuditToolkitLabs/Audit-Tool-/issues>.
