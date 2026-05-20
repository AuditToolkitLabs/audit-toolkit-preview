# Service Transition

## Purpose

Service transition covers the steps needed to bring a new environment into a
usable state and to hand it over to steady-state operations.

## Prerequisites

- A supported Linux host or deployment target
- Database connectivity
- Initial administrative access
- Device inventory sources identified
- Advisory source approach decided for each vendor

## Suggested transition stages

1. Install and verify the application.
2. Configure database and runtime settings.
3. Add connector credentials and device targets.
4. Enable advisory sources and validate feed access.
5. Run initial refresh and review the output.
6. Confirm the reporting and support workflow.

## Acceptance checks

Transition should not be considered complete until:

- The application starts cleanly
- Health and readiness checks pass
- The core test suite passes in the current release branch
- At least one inventory refresh succeeds
- At least one advisory refresh succeeds
- The operator can explain where reports are reviewed and exported

## Rollback thinking

Keep a rollback path for any transition that changes transport, source mode, or
scheduler behavior. A rollback should restore the prior working state before any
further changes are made.
