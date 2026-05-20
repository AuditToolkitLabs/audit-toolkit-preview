# Security

## Security principles

The product is designed to reduce unnecessary exposure of credentials and to
keep customer data limited to the operational scope of switch management.

## Authentication and access

Access should be restricted to authorized users only. Admin-style actions,
source management, and support work should not be broadly available.

## Secret handling

- Connector credentials are stored separately from source settings.
- Secret values should not be echoed back in full.
- Write-only or masked handling is preferred for sensitive fields.

## Data handling

The product works with inventory, advisory metadata, and exposure status. It
should be deployed and operated in a way that limits unauthorized access to
that information.

## Security posture

The current repository maintains a clean Bandit result and a documented OWASP
scorecard. That scorecard is an internal assessment and should be read as a
governed summary, not a scanner artifact.
