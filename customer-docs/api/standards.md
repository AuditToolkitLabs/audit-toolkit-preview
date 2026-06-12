# API Conventions

Common conventions for AuditToolkit product APIs. These rules apply to every
product that exposes an HTTP API, ingest endpoint, or webhook.

## 1. Versioning

- APIs are versioned in the path (for example `/api/v1/...`).
- Breaking changes require a new major version; additive changes do not.
- Deprecated endpoints remain available for a documented deprecation window.

## 2. Request And Response Format

- Requests and responses use JSON unless a binary payload is explicitly defined.
- Timestamps are ISO 8601 in UTC.
- Errors use a consistent envelope with a machine-readable `code`, a
  human-readable `message`, and an optional `details` object.

## 3. Pagination, Filtering, Sorting

- Collections support pagination with stable ordering.
- Filtering and sorting use documented query parameters.
- Responses include enough metadata to retrieve the next page deterministically.

## 4. Ingest Envelope

Producer-to-platform ingest uses the shared canonical envelope so findings from
different producers normalize consistently. The envelope carries producer
identity, schema version, target identity, and the canonical findings payload.
See product contract schemas for field-level definitions.

## 5. Webhooks

- Webhook deliveries are signed so receivers can verify authenticity.
- Deliveries are retried with backoff on transient receiver failure.
- Payloads follow the documented event schema and never include secrets.

## 6. Rate Limits

- APIs publish rate limits and return standard rate-limit headers.
- Clients must honour `Retry-After` on throttled responses.

## 7. Stability And Compatibility

Generated product API references must be produced from current product source.
Where a product publishes an OpenAPI document, that document is the source of
truth for that product's endpoint surface, governed by the conventions here.
