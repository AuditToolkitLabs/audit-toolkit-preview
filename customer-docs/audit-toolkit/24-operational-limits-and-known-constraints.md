# 24. Operational Limits and Known Constraints

## Overview

This section documents the operational limits, performance
characteristics, and known constraints of the Security Audit Toolkit.

---

## Server count limits by licence tier

| Tier | Max managed targets | Notes |
| --- | --- | --- |
| Community | 25 | Free; no licence key required |
| Trial | 150 | Free; 14-day evaluation; Professional features; machine-bound; watermarked exports |
| Starter | 50 | £549/yr; best-effort email support |
| Professional | 150 | £1,099/yr; 48-hr email response target |
| Business | 500 | £2,499/yr; priority email support; Advanced Operations Pack add-on available |
| Enterprise | Unlimited | By separate agreement only; not publicly listed; support scope agreed case-by-case |

Targets that exceed the tier limit can still be viewed but cannot be
scheduled or have on-demand audits triggered until the licence is
upgraded.

> **Advanced Operations Pack add-on:** Business and Enterprise customers
> may purchase this add-on to unlock advanced hypervisor audit modules,
> CIS/compliance hypervisor packs, bulk operations, and scheduling
> workflows. Contact [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com).

---

## Performance and concurrency limits

| Parameter | Default | Configurable |
| --- | --- | --- |
| Maximum concurrent audit jobs | 10 | Yes — `CELERY_CONCURRENCY` in `.env` |
| Maximum SSH / WinRM connections per worker | 5 | Yes — `MAX_CONNECTIONS` in `.env` |
| API rate limit (Community) | 60 req / min | No |
| API rate limit (Starter / Professional) | 300 req / min | No |
| API rate limit (Business / Enterprise) | 1 000 req / min | No |
| Maximum result retention | 90 days (default) | Yes — Admin → Settings |
| Maximum audit script timeout | 300 seconds | Yes — per-target setting |
| Maximum file upload size (evidence) | 20 MB | Yes — web server config |

---

## Minimum system requirements

### Application server

| Resource | Minimum | Recommended |
| --- | --- | --- |
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Disk | 40 GB | 100 GB |
| OS | Ubuntu 22.04 / RHEL 9 / Windows Server 2019 | Latest LTS |

### PostgreSQL database server

| Resource | Minimum | Recommended |
| --- | --- | --- |
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Disk | 20 GB | 100 GB |

SQLite is only supported for evaluation (single user, ≤ 5 targets).
Do not use SQLite in production.

---

## Known constraints

### Hypervisor discovery

- ESXi direct-host discovery requires vSphere API access; it is not
  available on free ESXi licences.
- Nutanix Prism discovery requires Prism Central; individual Prism
  Element connections are not supported.
- Proxmox requires API token authentication; username/password
  authentication over the Proxmox API is not supported.

### Windows audit targets

- WinRM must be enabled on Windows targets (`Enable-PSRemoting`).
- Domain-joined targets require a domain service account with local
  administrator rights on the target.
- The CIS Level 2 Windows profile requires PowerShell 5.1 or later.

### Agent deployment

- The JRE managed agent requires Java 11 or later on the target host.
- Agents behind strict firewalls may require manual port-forwarding
  configuration; the managed agent server uses TCP 9000 for the
  control channel by default.
- Alpine Linux targets require the `bash` package to be installed;
  the agent installer will install it if not present.

### Scheduled audits

- The Celery scheduler is backed by Redis; if Redis restarts, all
  scheduled tasks are re-queued from the database on the next
  `audit-toolkit-worker` startup.
- Schedules with an interval shorter than the audit duration will
  queue overlapping jobs; enable **Skip if running** on schedules
  with short intervals.

### TLS and certificates

- Self-signed certificates will cause agent connection warnings; use
  a CA-signed certificate in production.
- TLS 1.0 and 1.1 are disabled by default; targets or browsers
  requiring old TLS versions are not supported.

---

## Scalability guidance

For environments exceeding 300 targets, distribute load across
multiple Celery workers:

```bash
# Start an additional worker on the same host
sudo systemctl start audit-toolkit-worker@2
sudo systemctl enable audit-toolkit-worker@2
```

For environments exceeding 500 targets (Enterprise tier), contact
[Support@audittoolkitlabs.com](mailto:Support@audittoolkitlabs.com)
for architecture guidance on distributed deployments.
