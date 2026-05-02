# 23. Certificate and Key Lifecycle Runbook

## Overview

This runbook covers the lifecycle management of:

- TLS certificates used by the web application.
- Database field-level encryption keys (Fernet).
- API keys issued to users and integrations.

---

## TLS certificate lifecycle

### Check current certificate expiry

```bash
echo | openssl s_client -connect <hostname>:443 -servername <hostname> 2>/dev/null \
  | openssl x509 -noout -dates
```

### Using Let's Encrypt (Certbot)

Certbot renews certificates automatically when they are within 30 days
of expiry. To test renewal:

```bash
sudo certbot renew --dry-run
```

To force a renewal:

```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

### Using organisation-issued certificates

1. Obtain the new certificate and chain from your CA.
2. Copy the files to the server:

   ```bash
   sudo cp your-cert.pem /etc/ssl/audit-toolkit/cert.pem
   sudo cp your-chain.pem /etc/ssl/audit-toolkit/chain.pem
   sudo cp your-key.pem  /etc/ssl/audit-toolkit/key.pem
   sudo chmod 640 /etc/ssl/audit-toolkit/key.pem
   sudo chown root:audit-toolkit /etc/ssl/audit-toolkit/key.pem
   ```

3. Update the Nginx (or IIS) configuration to reference the new files.
4. Reload the web server:

   ```bash
   sudo systemctl reload nginx
   ```

5. Validate:

   ```bash
   echo | openssl s_client -connect <hostname>:443 2>/dev/null \
     | openssl x509 -noout -dates
   ```

---

## Fernet encryption key rotation

The Fernet key encrypts sensitive fields in the database
(credentials, secrets). Rotate the key annually or immediately if
it is suspected to have been exposed.

> **Warning:** Key rotation requires a maintenance window. All
> sensitive fields are re-encrypted in place. Back up the database
> before proceeding.

### Generate a new Fernet key

```bash
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

### Rotate the key

```bash
sudo systemctl stop audit-toolkit audit-toolkit-worker

sudo -u audit-toolkit /opt/audit-toolkit/scripts/rotate-encryption-key.sh \
  --old-key "<current-fernet-key>" \
  --new-key "<new-fernet-key>"
```

### Update the .env file

Replace `FIELD_ENCRYPTION_KEY` with the new key value:

```bash
sudo sed -i "s/^FIELD_ENCRYPTION_KEY=.*/FIELD_ENCRYPTION_KEY=<new-key>/" \
  /opt/audit-toolkit/.env
```

### Restart and validate

```bash
sudo systemctl start audit-toolkit audit-toolkit-worker
curl -s https://<hostname>/api/health | jq .
```

---

## API key rotation

API keys should be rotated every 90 days or immediately on:

- Suspected compromise.
- Departure of the team member who held the key.
- A key being committed accidentally to source control.

### Rotate via the web UI

1. Navigate to **Admin → API Keys**.
2. Select the key to rotate.
3. Click **Rotate**. The old key is immediately invalidated.
4. Update the new key in all integrations, agents, and CI/CD secrets.

### Emergency revocation

If a key may have been compromised, revoke it immediately:

1. Navigate to **Admin → API Keys**.
2. Select the key.
3. Click **Revoke**. The key is invalidated within seconds.

---

## Key storage best practices

| Key type | Recommended storage |
| --- | --- |
| Fernet encryption key | Secrets manager (Vault, AWS Secrets Manager, Azure Key Vault) |
| TLS private key | Server filesystem (mode 640, root:audit-toolkit) |
| API keys | Secrets manager or CI/CD secrets (never in source code) |
| Database password | `.env` file (mode 600) or secrets manager |

---

## Certificate and key inventory

Maintain an inventory of all keys and certificates:

| Item | Location | Expiry / rotation due | Owner |
| --- | --- | --- | --- |
| TLS certificate | `/etc/ssl/audit-toolkit/` | Per cert `notAfter` | Ops |
| Fernet key | `.env` → `FIELD_ENCRYPTION_KEY` | Annual | Admin |
| DB field key (secondary) | Secrets manager | Annual | Admin |
| API keys (integrations) | Per integration system | Every 90 days | Key owner |

Detailed procedure: `ENCRYPTION-KEY-ROTATION-PROCEDURE.md` (repo root).
API key management details: `docs/API-KEY-MANAGEMENT.md`.
