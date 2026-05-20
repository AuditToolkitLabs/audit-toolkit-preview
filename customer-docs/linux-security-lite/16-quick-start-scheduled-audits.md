# 16. Quick Start — Scheduled Audits

| Field | Value |
| --- | --- |
| Time to complete | 15–20 minutes |
| Prerequisites | Toolkit installed; root or sudo access |

---

## Objective

Run regular, automated audits on Linux hosts with consistent output paths,
execution logging, and retention management.

## Option A — Cron (all distributions)

Add a cron entry for the root user:

```bash
sudo crontab -e
```

Add the following line (adjust schedule to match your policy):

```cron
# Run full security audit at 02:15 daily
15 2 * * * /usr/local/bin/audit-toolkit --auto --json /var/log/audit-toolkit/report-$(date +\%Y\%m\%d-\%H\%M\%S).json >> /var/log/audit-toolkit/cron.log 2>&1
```

**Note:** The `\%` escaping is required within cron. If editing the
crontab directly in a shell script, use `\%` instead.

Validate after adding:

```bash
sudo crontab -l
# Confirm the entry is present

# Check the log after the first scheduled run
tail -f /var/log/audit-toolkit/cron.log
```

## Option B — Systemd timer (systemd distributions)

The release package installs a pre-configured systemd service and timer
unit. To enable:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now audit-toolkit.timer
sudo systemctl status audit-toolkit.timer
```

Check the timer schedule:

```bash
systemctl list-timers audit-toolkit.timer
```

View execution output via the journal:

```bash
journalctl -u audit-toolkit.service -n 50 --no-pager
```

To customise the schedule, edit the timer unit:

```bash
sudo systemctl edit audit-toolkit.timer
```

Add an override (example: run at 03:00 daily):

```ini
[Timer]
OnCalendar=
OnCalendar=*-*-* 03:00:00
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart audit-toolkit.timer
```

## Option C — Configuration management (Ansible example)

For fleet deployments via Ansible:

```yaml
---
- name: Schedule AuditToolkit Linux Security Lite
  hosts: linux_fleet
  become: true
  tasks:
    - name: Create report directory
      ansible.builtin.file:
        path: /var/log/audit-toolkit
        state: directory
        mode: '0750'
        owner: root
        group: root

    - name: Add audit cron job
      ansible.builtin.cron:
        name: "AuditToolkit daily security audit"
        minute: "15"
        hour: "2"
        user: root
        job: >-
          /usr/local/bin/audit-toolkit --auto
          --json /var/log/audit-toolkit/report-$(date +%%Y%%m%%d-%%H%%M%%S).json
          >> /var/log/audit-toolkit/cron.log 2>&1
```

## Report retention

Add a retention cron job to prevent unbounded disk growth:

```bash
sudo crontab -e
```

```cron
# Delete reports older than 90 days at 03:00 daily
0 3 * * * find /var/log/audit-toolkit -name "report-*.json" -mtime +90 -delete
```

## Validating scheduled runs

After the first scheduled run completes:

```bash
# Check the most recent report
ls -lt /var/log/audit-toolkit/report-*.json | head -5

# Validate it against the schema
python3 /opt/audit-toolkit/ci/validate-report-schema.py \
  $(ls -t /var/log/audit-toolkit/report-*.json | head -1)

# Inspect the summary
jq '{host:.host_identity.hostname,coverage:.completeness.coverage_score,fail:.hardening.fail}' \
  $(ls -t /var/log/audit-toolkit/report-*.json | head -1)
```

## Alerting on missed runs

Configure your monitoring to alert if no new report file appears within
the expected window (e.g. no new file in `/var/log/audit-toolkit/` for
more than 25 hours on a daily schedule). This covers both job failures
and host-level outages.
