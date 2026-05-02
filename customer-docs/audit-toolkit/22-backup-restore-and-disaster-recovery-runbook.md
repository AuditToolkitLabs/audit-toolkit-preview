# 22. Backup, Restore and Disaster Recovery Runbook

## Overview

This runbook covers the full backup, restore, and disaster-recovery
procedures for a production Security Audit Toolkit installation.

---

## What to back up

| Component | Backup method | Critical |
| --- | --- | --- |
| PostgreSQL database | `pg_dump` / API backup endpoint | Yes |
| `.env` / secrets file | Encrypted off-site copy | Yes |
| TLS certificate and private key | Encrypted off-site copy | Yes |
| Fernet encryption key | Encrypted off-site copy (HSM recommended) | Yes |
| Audit scripts (if customised) | Git repository | Recommended |
| Nginx / reverse-proxy config | File copy | Recommended |
| Uploaded attachments / evidence | File copy | Recommended |

---

## Taking a backup

### Via the API (recommended)

```bash
curl -s -X POST https://<hostname>/api/backup \
  -H "X-API-Key: <admin-key>" | jq .
```

Returns the path to the backup file on the server filesystem.
Copy the file off-server immediately:

```bash
scp audit@<hostname>:/opt/audit-toolkit/backups/backup-YYYYMMDD.tar.gz \
    /your/backup/store/
```

### Manually via pg_dump

```bash
sudo -u postgres pg_dump audittoolkit \
  | gzip > /backups/audittoolkit-$(date +%Y%m%d-%H%M%S).sql.gz
```

### Automating backups (cron)

```bash
0 2 * * * audit-toolkit-user \
  curl -s -X POST https://localhost/api/backup \
    -H "X-API-Key: $(cat /etc/audit-toolkit/backup-api-key)" && \
  rsync -az /opt/audit-toolkit/backups/ /mnt/nas/audit-toolkit-backups/
```

---

## Restoring from backup

### Stop the application

```bash
sudo systemctl stop audit-toolkit audit-toolkit-worker
```

### Restore the database

```bash
# Drop the existing database (data loss — confirm before running)
sudo -u postgres dropdb audittoolkit
sudo -u postgres createdb -O audittoolkit audittoolkit

# Restore
sudo -u postgres psql audittoolkit < /backups/audittoolkit-YYYYMMDD.sql
```

### Restore the secrets file

```bash
sudo cp /backups/.env.bak /opt/audit-toolkit/.env
sudo chown audit-toolkit:audit-toolkit /opt/audit-toolkit/.env
sudo chmod 600 /opt/audit-toolkit/.env
```

### Start the application

```bash
sudo systemctl start audit-toolkit audit-toolkit-worker
sudo systemctl status audit-toolkit
```

### Validate

```bash
curl -s https://<hostname>/api/health | jq .
```

---

## Disaster recovery (new-server rebuild)

If the original server is lost:

1. **Provision a new server** matching the original specification.
2. **Install the same Toolkit version** using the DEB, RPM, or MSI
   package.
3. **Restore the `.env` secrets file** from the encrypted backup.
4. **Restore the database** (see Restoring from backup above).
5. **Restore TLS certificates** and update the reverse-proxy config.
6. **Update DNS** to point to the new server IP.
7. **Validate** with `GET /api/health` and a test audit.

Target recovery time objective (RTO): < 4 hours with a current backup.
Target recovery point objective (RPO): up to 24 hours (nightly backups).

---

## Backup storage recommendations

- Encrypt all backup files at rest (e.g. with `gpg --symmetric`).
- Store backups in a separate physical location or cloud storage bucket.
- Retain at least 7 daily backups and 4 weekly backups.
- Test restoration quarterly — do not assume backups are valid until
  tested.
- Never store the Fernet encryption key in the same backup as the
  database.

---

## Post-restore checklist

- [ ] `GET /api/health` returns `"status": "ok"`
- [ ] Agent connections show **Online**
- [ ] Schedules are active and next-run times are correct
- [ ] Alert integrations deliver a test notification
- [ ] Historical audit results are visible in the web UI
- [ ] Admin login succeeds
