# 26. Security Event and Export Reference

Asset Command Center produces operational and security-relevant data
through local views, exports, logs, and optional webhooks.

## Typical event categories

- authentication activity
- user and role changes
- connector and collection-job activity
- privileged portal activity
- license and settings changes

## Generic webhook guidance

Where a webhook destination is configured, customers should validate:

- authentication and secret handling
- retry and failure behavior
- retention and downstream storage
- any schema transformation performed outside the product
