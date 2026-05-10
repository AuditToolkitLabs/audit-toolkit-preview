# 27. Login Recovery and First-Login Reset Runbook

## Overview

This runbook is a customer-facing knowledge base article for recovering from appliance login failures after install, especially when:

- the shown credentials do not work,
- login returns a generic error,
- login works with an unexpected old password,
- the user is not forced through first-login password change/disclaimer,
- the initial credential hint is missing.

Use this procedure to return the appliance to a known-good first-login state with:

- username: `admin`
- temporary password: `ChangeMe123!`
- forced redirect to password change on first successful login
- login hint shown on the login page

---

## Applies To

- VM appliance deployments (OVA/OVF/VMDK)
- Linux package installs where web runtime is under `/opt/audit-toolkit`
- PostgreSQL-backed deployments

---

## Symptoms and Likely Cause

| Symptom | Most likely cause |
| --- | --- |
| `Invalid username or password` for expected default password | Built-in admin password hash in DB is not aligned with current default |
| `An error occurred during login` | Session write failed due invalid/missing `DB_FIELD_ENCRYPTION_KEY` |
| Old password (for example `TestPass123!`) still works | Database row was not reset to first-login state |
| No redirect to `/auth/change-password` | `must_change_password` is false in DB |
| No credential hint on login page | Built-in admin not in first-login state or hint candidate password does not match live hash |

---

## Prerequisites

- SSH access to the appliance host
- sudo privileges
- PostgreSQL local access as `postgres`
- Service account password for sudo if prompted

Recommended before changes:

1. Snapshot the VM.
2. Capture current state:

```bash
sudo -u postgres psql -d audit_toolkit -Atqc "select id,username,is_builtin_admin,must_change_password,is_active,auth_provider,coalesce(disclaimer_version,''),disclaimer_accepted_at from users order by id;"
systemctl is-active nginx audit-toolkit-web audit-toolkit-discovery
```

---

## Step 1: Confirm Core Services Are Healthy

```bash
sudo systemctl restart audit-toolkit-web audit-toolkit-discovery nginx
systemctl is-active audit-toolkit-web audit-toolkit-discovery nginx
```

Expected result: all show `active`.

If nginx fails with duplicate site config, remove stale files and retry:

```bash
sudo rm -f /etc/nginx/sites-enabled/audit-toolkit.conf /etc/nginx/sites-available/audit-toolkit.conf
sudo nginx -t
sudo systemctl daemon-reload
sudo systemctl restart nginx audit-toolkit-web audit-toolkit-discovery
```

---

## Step 2: Verify Encryption Key Requirements

When `PRODUCTION_HARDENING_REQUIRED=true`, login session writes require a valid database field encryption key.

Check key-related env values:

```bash
grep -nE '^DB_FIELD_ENCRYPTION_KEY=|^PRODUCTION_HARDENING_REQUIRED=|^FLASK_ENV=|^ENVIRONMENT=' /opt/audit-toolkit/web/.env
```

### Important format requirement

`DB_FIELD_ENCRYPTION_KEY` must be a Fernet key (URL-safe base64, 44 chars, ending with `=`), not a hex string.

Valid shape:

```text
^[A-Za-z0-9_-]{43}=$
```

### If key is missing or invalid, regenerate and restart

```bash
NEWKEY=$(python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
sudo cp /opt/audit-toolkit/web/.env /opt/audit-toolkit/web/.env.bak.$(date +%Y%m%d%H%M%S)
sudo sed -i '/^DB_FIELD_ENCRYPTION_KEY=/d;/^ENCRYPTION_KEY=/d' /opt/audit-toolkit/web/.env
sudo bash -lc "echo DB_FIELD_ENCRYPTION_KEY=${NEWKEY} >> /opt/audit-toolkit/web/.env"
sudo systemctl restart audit-toolkit-web
systemctl is-active audit-toolkit-web
```

---

## Step 3: Force First-Login State in Database (Authoritative Fix)

This step resets password hash and first-login/disclaimer flags directly in PostgreSQL.

### 3.1 Set runtime default password values in env

```bash
sudo sed -i 's/^INITIAL_ADMIN_PASSWORD=.*/INITIAL_ADMIN_PASSWORD=ChangeMe123!/' /opt/audit-toolkit/web/.env
sudo sed -i 's/^ADMIN_PASSWORD=.*/ADMIN_PASSWORD=ChangeMe123!/' /opt/audit-toolkit/web/.env
sudo sed -i 's/^AUDIT_TOOLKIT_RANDOMIZE_INITIAL_ADMIN_PASSWORD=.*/AUDIT_TOOLKIT_RANDOMIZE_INITIAL_ADMIN_PASSWORD=0/' /opt/audit-toolkit/web/.env
```

If keys do not exist, append them:

```bash
grep -q '^INITIAL_ADMIN_PASSWORD=' /opt/audit-toolkit/web/.env || echo 'INITIAL_ADMIN_PASSWORD=ChangeMe123!' | sudo tee -a /opt/audit-toolkit/web/.env >/dev/null
grep -q '^ADMIN_PASSWORD=' /opt/audit-toolkit/web/.env || echo 'ADMIN_PASSWORD=ChangeMe123!' | sudo tee -a /opt/audit-toolkit/web/.env >/dev/null
grep -q '^AUDIT_TOOLKIT_RANDOMIZE_INITIAL_ADMIN_PASSWORD=' /opt/audit-toolkit/web/.env || echo 'AUDIT_TOOLKIT_RANDOMIZE_INITIAL_ADMIN_PASSWORD=0' | sudo tee -a /opt/audit-toolkit/web/.env >/dev/null
```

### 3.2 Update built-in admin row directly

Note: `!` in shell strings can trigger history expansion in interactive bash. `set +H` prevents that.

```bash
set +H
HASH=$(/opt/audit-toolkit/venv/bin/python -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('ChangeMe123'+chr(33)))")
sudo -u postgres psql -d audit_toolkit -v ON_ERROR_STOP=1 -c "UPDATE users SET password_hash='${HASH}', must_change_password=true, disclaimer_accepted_at=NULL, disclaimer_version=NULL, is_active=true, auth_provider='local' WHERE username='admin' AND is_builtin_admin=true;"
```

### 3.3 Verify DB state

```bash
sudo -u postgres psql -d audit_toolkit -Atqc "select id,username,is_builtin_admin,must_change_password,is_active,auth_provider,coalesce(disclaimer_version,''),disclaimer_accepted_at from users where username='admin' order by id;"
```

Expected result includes:

- `admin|t|t|t|local||`

---

## Step 4: Restart Web and Validate Behavior

```bash
sudo systemctl restart audit-toolkit-web
systemctl is-active audit-toolkit-web
```

### 4.1 Validate hint is shown

```bash
curl -k -s https://127.0.0.1/auth/login | grep -n 'Initial admin credentials\|Username admin\|Password ChangeMe123!'
```

Expected output includes all three lines.

### 4.2 Validate old password fails

```bash
tmp=$(mktemp -d)
curl -k -s -c "$tmp/cookies.txt" https://127.0.0.1/auth/login >/dev/null
curl -k -s -i -b "$tmp/cookies.txt" -c "$tmp/cookies.txt" -X POST https://127.0.0.1/auth/login -H 'Content-Type: application/x-www-form-urlencoded' --data 'username=admin&password=TestPass123%21' | sed -n '1,20p'
```

Expected: login page returned (no first-login redirect success).

### 4.3 Validate default password succeeds and forces first-login flow

```bash
tmp2=$(mktemp -d)
curl -k -s -c "$tmp2/cookies.txt" https://127.0.0.1/auth/login >/dev/null
curl -k -s -i -b "$tmp2/cookies.txt" -c "$tmp2/cookies.txt" -X POST https://127.0.0.1/auth/login -H 'Content-Type: application/x-www-form-urlencoded' --data 'username=admin&password=ChangeMe123%21' | sed -n '1,20p'
```

Expected: `HTTP/2 302` with `location: /auth/change-password?next=`.

---

## Optional: Re-arm Appliance First-Boot Markers (Image Capture Workflow)

Only do this when preparing a reusable appliance image, not for normal in-place recovery.

```bash
sudo rm -f /var/lib/audit-toolkit/.setup-complete
sudo rm -f /var/lib/audit-toolkit/.first-boot-complete
sudo rm -f /var/lib/audit-toolkit/.first-login-wizard-complete
sudo rm -f /var/lib/audit-toolkit/initial-admin-credentials.txt
```

After this, the next boot/setup process will re-run first-boot initialization.

### SSH recovery after re-arming first-boot markers

On older appliance images, resetting first-boot state could leave SSH unavailable after reboot.

Most common symptom:

- SSH connection is refused immediately after the appliance reboots into first-boot state.

Most likely cause:

- the appliance image had its SSH host keys removed during image preparation, but the running `sshd` service was not restarted after those keys were regenerated on next boot.

Read-only validation:

```bash
sudo ls -l /etc/ssh/ssh_host_*_key /etc/ssh/ssh_host_*_key.pub
systemctl status ssh --no-pager
sudo journalctl -u ssh -b --no-pager | tail -n 50
```

Recovery:

```bash
sudo ssh-keygen -A
sudo systemctl restart ssh
systemctl is-active ssh
```

If `ssh` is not the unit name on the target image, use:

```bash
sudo systemctl restart openssh-server
```

Expected result:

- `systemctl is-active ssh` returns `active`
- key-based or password SSH access works again on port `22`

This issue is fixed in updated appliance build scripts so future images regenerate host keys and restart `sshd` automatically during first boot.

---

## Troubleshooting Notes

### A) `An error occurred during login` persists

1. Re-check `DB_FIELD_ENCRYPTION_KEY` format.
2. Confirm `audit-toolkit-web` is reading `/opt/audit-toolkit/web/.env` from unit file:

```bash
systemctl cat audit-toolkit-web
```

1. Check latest logs:

```bash
sudo journalctl -u audit-toolkit-web -n 80 --no-pager
```

### B) Password resets but flips back

Usually caused by startup sync logic reading `INITIAL_ADMIN_PASSWORD` / `ADMIN_PASSWORD` and reconciling while first-login is pending.

Keep these aligned with your desired default in `/opt/audit-toolkit/web/.env`, then repeat DB reset and restart.

### C) Hint not shown even when login works

Hint is shown only when:

- built-in admin is active,
- `must_change_password=true`, and
- hint password candidate matches the current password hash.

If needed, rerun Step 3 and Step 4.

---

## Recovery Completion Checklist

- [ ] `audit-toolkit-web`, `audit-toolkit-discovery`, and `nginx` are active
- [ ] Login hint displays `admin / ChangeMe123!`
- [ ] Old password is rejected
- [ ] `ChangeMe123!` redirects to change-password flow
- [ ] `must_change_password=true` in database
- [ ] disclaimer fields cleared in database

---

## Escalation Data to Capture

If recovery still fails, attach this data to support:

```bash
systemctl status audit-toolkit-web --no-pager
sudo journalctl -u audit-toolkit-web -n 200 --no-pager
sudo -u postgres psql -d audit_toolkit -Atqc "select id,username,is_builtin_admin,must_change_password,is_active,auth_provider,coalesce(disclaimer_version,''),disclaimer_accepted_at from users order by id;"
grep -nE '^DB_FIELD_ENCRYPTION_KEY=|^PRODUCTION_HARDENING_REQUIRED=|^INITIAL_ADMIN_PASSWORD=|^ADMIN_PASSWORD=|^AUDIT_TOOLKIT_RANDOMIZE_INITIAL_ADMIN_PASSWORD=' /opt/audit-toolkit/web/.env
```

Reference this runbook section in the support case.
