# Maintenance and Patching Runbook

## Purpose

Use this runbook when applying a product update, changing runtime dependencies,
or validating a maintenance window.

## Maintenance steps

1. Review the release notes and expected changes.
2. Capture the current state and any open incidents.
3. Apply the update in a controlled window.
4. Run health checks and a targeted smoke test.
5. Review job history and any new warnings.
6. Roll back if the update breaks collection or reporting.

## Validation

- Service starts cleanly
- Health checks pass
- Main API routes still respond
- Existing user workflows still behave as expected

## Rollback discipline

Keep the previous known-good package and configuration ready until the new
version has been validated in the target environment.
