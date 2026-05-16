# 30. Operational Limits and Constraints

## Supported deployment direction

- small estate: up to roughly 250 managed assets
- standard estate: roughly 250 to 1,000 managed assets
- larger estate: external PostgreSQL, staged scheduling, and separate
  sizing review

## Key constraints

- this release is documented as a standalone single-node collector
- `legacy-only` and `inventory-only` remain the baseline operating
  profile
- strict multi-tenant isolation is not claimed by this documentation
- Windows is not the primary supported standalone host platform
- broad cloud/API-family connector promises are outside the primary
  release-ready scope
