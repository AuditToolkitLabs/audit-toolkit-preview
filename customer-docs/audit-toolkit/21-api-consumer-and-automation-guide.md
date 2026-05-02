# 21. API Consumer and Automation Guide

## Overview

This guide is for teams that consume the Security Audit Toolkit REST API
from automation pipelines, scripts, or integrations. It covers
authentication, common patterns, pagination, error handling, and
best practices.

Full OpenAPI specification: `docs/openapi.yaml`.
Interactive API browser: `https://<your-hostname>/api/docs/`

---

## API key management

API keys authenticate all automated calls. Issue a key per
integration or pipeline — do not share keys between systems.

| Do | Do not |
| --- | --- |
| Store keys in a secrets manager (Vault, AWS Secrets Manager, etc.) | Hard-code keys in source code or config files |
| Rotate keys every 90 days | Share one key between multiple systems |
| Scope keys to the minimum required role | Use `admin` role keys for read-only integrations |
| Restrict keys to IP ranges where possible | Leave keys unrestricted unless necessary |

---

## Common automation tasks

### Trigger and poll an audit

```bash
#!/usr/bin/env bash
API_BASE="https://<hostname>"
API_KEY="<your-key>"
TARGET_ID=1

# Start audit
JOB_ID=$(curl -s -X POST "${API_BASE}/api/audit/run" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"target_id": '"${TARGET_ID}"', "profile": "cis_level1"}' \
  | jq -r '.job_id')

# Poll until complete
while true; do
  STATUS=$(curl -s "${API_BASE}/api/audit/jobs/${JOB_ID}" \
    -H "X-API-Key: ${API_KEY}" | jq -r '.status')
  [ "${STATUS}" = "complete" ] && break
  [ "${STATUS}" = "failed"   ] && { echo "Audit failed"; exit 1; }
  sleep 10
done

echo "Audit complete. Job: ${JOB_ID}"
```

### Fetch all FAIL findings for a target

```bash
curl -s "${API_BASE}/api/audit/results?target_id=${TARGET_ID}&status=FAIL" \
  -H "X-API-Key: ${API_KEY}" | jq '.[].check'
```

### Export a result as PDF (for compliance archives)

```bash
curl -s "${API_BASE}/api/audit/results/${RESULT_ID}/export?format=pdf" \
  -H "X-API-Key: ${API_KEY}" \
  -o "audit-report-${RESULT_ID}.pdf"
```

### Register a new target

```bash
curl -s -X POST "${API_BASE}/api/targets" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "hostname": "new-server-01",
    "os_type": "linux",
    "connection_method": "ssh",
    "ssh_host": "10.0.1.50",
    "ssh_port": 22,
    "ssh_username": "auditor"
  }'
```

---

## Pagination

All list endpoints are paginated. Use `limit` and `offset`:

```bash
# Page 1 (items 1–50)
GET /api/audit/results?target_id=1&limit=50&offset=0

# Page 2 (items 51–100)
GET /api/audit/results?target_id=1&limit=50&offset=50
```

The response includes a `total` field indicating the total number of
matching records.

---

## GitHub Actions integration

Trigger an audit as part of your CI/CD pipeline:

```yaml
# .github/workflows/security-audit.yml
name: Security Audit

on:
  schedule:
    - cron: '0 6 * * 1'   # Every Monday at 06:00 UTC
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger audit
        run: |
          JOB=$(curl -s -X POST ${{ secrets.TOOLKIT_URL }}/api/audit/run \
            -H "X-API-Key: ${{ secrets.TOOLKIT_API_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"target_id": 1, "profile": "cis_level1"}' \
            | jq -r '.job_id')
          echo "JOB_ID=${JOB}" >> $GITHUB_ENV

      - name: Wait for completion
        run: |
          for i in $(seq 1 30); do
            STATUS=$(curl -s ${{ secrets.TOOLKIT_URL }}/api/audit/jobs/${JOB_ID} \
              -H "X-API-Key: ${{ secrets.TOOLKIT_API_KEY }}" | jq -r '.status')
            [ "$STATUS" = "complete" ] && exit 0
            [ "$STATUS" = "failed" ] && exit 1
            sleep 20
          done
          echo "Timed out waiting for audit"
          exit 1
```

---

## Error handling best practices

- **Always check the HTTP status code** before parsing the response body.
- **Implement exponential back-off** for `429 Too Many Requests` — wait
  2, 4, 8, 16 seconds before retrying.
- **Log the full response body** on unexpected errors to aid diagnosis.
- **Set a timeout** on all HTTP requests (recommended: 30 seconds).

---

## Webhook receiver example (Python)

```python
from flask import Flask, request, abort
import hmac
import hashlib

app = Flask(__name__)
WEBHOOK_SECRET = b"<your-webhook-secret>"

@app.route("/webhook/audit", methods=["POST"])
def audit_webhook():
    sig = request.headers.get("X-Toolkit-Signature", "")
    body = request.get_data()
    expected = "sha256=" + hmac.new(WEBHOOK_SECRET, body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected):
        abort(403)
    payload = request.get_json()
    print(f"Audit complete: {payload['target']['hostname']} score={payload['summary']['score']}")
    return "", 200
```
