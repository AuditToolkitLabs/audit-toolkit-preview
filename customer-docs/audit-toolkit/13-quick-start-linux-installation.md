# 13. Quick Start — Linux Installation

## Overview

This guide walks through installing the Security Audit Toolkit core
server on a Linux host from a DEB or RPM package. Estimated time:
20–30 minutes.

## Prerequisites

| Requirement | Value |
| --- | --- |
| OS | Ubuntu 22.04 LTS / Debian 12 **or** RHEL 9 / CentOS Stream 9 / Fedora 40 |
| Python | 3.12+ (included in modern distro packages) |
| PostgreSQL | 15+ (recommended for production) |
| RAM | 2 GB minimum |
| Disk | 10 GB minimum |
| Open inbound port | 443 (HTTPS via reverse proxy) |

## Step 1 — Install the package

### Ubuntu / Debian

```bash
sudo dpkg -i audit-toolkit_<version>_amd64.deb
```

### RHEL / CentOS / Fedora

```bash
sudo rpm -ivh audit-toolkit-<version>.x86_64.rpm
```

### Script-based install (any distro)

```bash
bash install.sh
```

## Step 2 — Configure the database

Create the PostgreSQL database and user:

```sql
CREATE USER audittoolkit WITH PASSWORD '<strong-password>';
CREATE DATABASE audittoolkit OWNER audittoolkit;
```

Edit `/etc/audit-toolkit/.env` (or the `.env` file in the install
directory) and set:

```bash
DATABASE_URL=postgresql://audittoolkit:<password>@localhost:5432/audittoolkit
```

## Step 3 — Generate secrets

```bash
sudo -u audit-toolkit /opt/audit-toolkit/scripts/setup-secrets.sh
```

This creates `FLASK_SECRET_KEY` and `DB_FIELD_ENCRYPTION_KEY` in
your `.env` file if they are not already set.

## Step 4 — Run database migrations

```bash
sudo -u audit-toolkit /opt/audit-toolkit/venv/bin/python -m flask db upgrade
```

## Step 5 — Start and enable the service

```bash
sudo systemctl enable --now audit-toolkit
sudo systemctl enable --now audit-toolkit-worker   # Celery scheduler
```

## Step 6 — Configure the reverse proxy

The application listens on `127.0.0.1:5000` by default. Expose it
over HTTPS using Nginx:

```nginx
server {
    listen 443 ssl;
    server_name <your-hostname>;

    ssl_certificate     /etc/ssl/certs/<your-cert>.pem;
    ssl_certificate_key /etc/ssl/private/<your-key>.pem;

    location / {
        proxy_pass         http://127.0.0.1:5000;
        proxy_set_header   Host $host;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

Reload Nginx: `sudo systemctl reload nginx`

## Step 7 — First login

Open `https://<your-hostname>/` in your browser. Sign in with the
initial administrator credentials printed at the end of the installer
or displayed in `journalctl -u audit-toolkit -n 50`. **Change the
password immediately.**

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Service fails to start | `journalctl -u audit-toolkit -n 100` |
| Database connection error | Check `DATABASE_URL` in `.env`; confirm PostgreSQL is running |
| Port 5000 not listening | Check `FLASK_PORT` in `.env`; confirm the service is running |
| Web UI returns 502 | Check Nginx proxy_pass points to the correct port |

For further help see `docs/TROUBLESHOOTING-GUIDE.md` or open an issue
at <https://github.com/AuditToolkitLabs/Audit-Tool-/issues>.
