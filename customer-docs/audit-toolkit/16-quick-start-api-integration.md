# 16. Quick Start — API Integration

## Overview

The Security Audit Toolkit exposes a REST API with 390+ endpoints for
automation, reporting, and integration with external tools. This guide
covers the most common operations.

Full OpenAPI specification: `docs/openapi.yaml` and `docs/openapi.json`.
Interactive API browser: `https://<your-hostname>/api/docs/`

## Authentication

All API requests require an `X-API-Key` header:

```bash
curl -s https://<hostname>/api/health \
  -H "X-API-Key: <your-api-key>"
```

Issue API keys in **Admin → API Keys → New Key**. Keys are scoped to
a role (`operator` or `reader`) and optionally restricted by IP range.

## Core endpoints

### Health check

```bash
GET /api/health
```

Returns application status, database connectivity, and scheduler state.

### List targets

```bash
GET /api/targets
```

```json
[
  {
    "id": 1,
    "hostname": "web-server-01",
    "os_type": "linux",
    "last_audit": "2026-05-01T14:30:00Z",
    "score": 94.2
  }
]
```

### Trigger an on-demand audit

```bash
POST /api/audit/run
Content-Type: application/json

{
  "target_id": 1,
  "profile": "cis_level1"
}
```

Returns a job ID. Poll `GET /api/audit/jobs/<job_id>` for status.

### Retrieve audit results

```bash
GET /api/audit/results?target_id=1&limit=10
```

### Export findings as JSON

```bash
GET /api/audit/results/<result_id>/export?format=json
```

### List agents

```bash
GET /api/agents
```

### Get system metrics (Prometheus)

```bash
GET /metrics
```

Requires an `admin` role API key.

## Pagination

Endpoints that return lists support `limit` and `offset` query
parameters:

```bash
GET /api/audit/results?target_id=1&limit=50&offset=100
```

## Filtering and sorting

Most list endpoints support:

| Parameter | Example | Effect |
| --- | --- | --- |
| `status` | `?status=FAIL` | Filter by check result status |
| `since` | `?since=2026-04-01T00:00:00Z` | Results after this timestamp |
| `sort` | `?sort=score&order=asc` | Sort results |

## Webhooks (outbound)

The application can POST a JSON payload to any webhook URL when an
audit completes or when a finding threshold is exceeded. Configure
webhooks in **Admin → Alerts → Webhooks**.

Sample payload:

```json
{
  "event": "audit.complete",
  "target": "web-server-01",
  "timestamp": "2026-05-02T09:00:00Z",
  "score": 87.5,
  "fail_count": 3,
  "warn_count": 7,
  "result_url": "https://<hostname>/results/1234"
}
```

## Rate limits

The API enforces rate limits to prevent abuse:

| Tier | Requests per minute |
| --- | --- |
| Community | 60 |
| Starter / Professional | 300 |
| Business / Enterprise | 1 000 |

Requests that exceed the limit receive `429 Too Many Requests`.

## Error responses

All errors return a JSON body:

```json
{
  "error": "not_found",
  "message": "Target with id 99 does not exist.",
  "status": 404
}
```

Common status codes:

| Code | Meaning |
| --- | --- |
| `400` | Bad request — invalid parameters |
| `401` | Authentication required |
| `403` | Authorisation denied — insufficient role |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error — check application logs |

Full API consumer guide: section 21.
Full OpenAPI spec: `docs/openapi.yaml`.
