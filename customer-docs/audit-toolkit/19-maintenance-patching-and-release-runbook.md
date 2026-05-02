# 19. Maintenance, Patching and Release Runbook

## Overview

This runbook describes the routine maintenance tasks for a production
Security Audit Toolkit installation: applying patches, rotating
secrets, managing database size, and verifying service health.

---

## Routine maintenance schedule

| Task | Recommended frequency |
| --- | --- |
| Apply PATCH-level updates | Monthly or when released |
| Apply MINOR-level updates | Quarterly, after staging validation |
| Apply MAJOR-level updates | Annually, with planned migration window |
| Rotate API keys | Every 90 days |
| Rotate DB field encryption key | Annually or on suspected compromise |
| Review and purge inactive users | Quarterly |
| Review and rotate TLS certificates | Before expiry (set a 30-day reminder) |
| Purge old audit results beyond retention | Automated; verify monthly |
| Test backup restoration | Quarterly |

---

## Applying a PATCH update

1. **Review the changelog.**

   ```bash
   # Check what is new
   curl -s https://api.github.com/repos/AuditToolkitLabs/Audit-Tool-/releases/latest | jq .body
   ```

2. **Back up the database.**

   ```bash
   curl -s -X POST https://<hostname>/api/backup \
     -H "X-API-Key: <admin-key>" | jq .
   ```

3. **Install the new package.**

   ```bash
   # Ubuntu / Debian
   sudo dpkg -i audit-toolkit_<new>.deb
   sudo systemctl restart audit-toolkit audit-toolkit-worker

   # RHEL / Fedora
   sudo rpm -Uvh audit-toolkit-<new>.rpm
   sudo systemctl restart audit-toolkit audit-toolkit-worker
   ```

4. **Run database migrations (if any).**

   ```bash
   sudo -u audit-toolkit /opt/audit-toolkit/venv/bin/python -m flask db upgrade
   ```

5. **Validate the service.**

   ```bash
   curl -s https://<hostname>/api/health | jq .
   ```

---

## Rotating API keys

API keys should be rotated regularly and immediately if suspected of
compromise:

1. Navigate to **Admin → API Keys**.
2. Select the key to rotate.
3. Click **Rotate** — a new key is generated and the old key is
   immediately invalidated.
4. Update the new key in all agents, pipelines, and integrations.

---

## Rotating the database field encryption key

> **Warning:** This operation re-encrypts all sensitive fields and
> requires a maintenance window.

```bash
sudo -u audit-toolkit /opt/audit-toolkit/scripts/rotate-encryption-key.sh \
  --old-key "<current-key>" \
  --new-key "<new-fernet-key>"
```

Back up the database before rotating. The script is idempotent and
can be safely interrupted and restarted.

---

## Managing log retention

Log rotation is handled by systemd-journald or logrotate. To adjust
the application audit-result retention period:

1. Navigate to **Admin → Settings → Data Retention**.
2. Set the retention period (default: 90 days).
3. Click **Save**. The cleanup job runs overnight via the Celery
   scheduler.

---

## Verifying service health

```bash
# Check all services are running
systemctl is-active audit-toolkit audit-toolkit-worker nginx postgresql

# Check application health
curl -s https://<hostname>/api/health | jq .

# Check Celery queue depth
curl -s https://<hostname>/api/scheduler/status \
  -H "X-API-Key: <admin-key>" | jq .queue_depth
```

---

## Emergency restart procedure

If the application becomes unresponsive:

```bash
sudo systemctl restart audit-toolkit audit-toolkit-worker
sudo systemctl status audit-toolkit
journalctl -u audit-toolkit -n 50
```

If the restart does not resolve the issue, check:

- Database connectivity: `psql -U audittoolkit -h localhost audittoolkit -c '\conninfo'`
- Disk space: `df -h`
- Memory: `free -h`

---

## Post-maintenance checklist

After any maintenance activity:

- [ ] `GET /api/health` returns `"status": "ok"`
- [ ] Web UI loads and admin login succeeds
- [ ] Scheduled scans are still active (**Schedules** page)
- [ ] Agent connections show **Online**
- [ ] At least one on-demand audit completes successfully
- [ ] Alert integrations deliver a test notification
