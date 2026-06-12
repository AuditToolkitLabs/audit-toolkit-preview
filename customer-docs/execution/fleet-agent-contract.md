# Fleet Agent Contract

This contract defines how managed and lightweight agents register with an
AuditToolkit control plane, receive work, and return results across the product
suite.

## 1. Registration

- Each agent registers with a unique identity and a scoped enrolment token.
- The control plane records agent identity, platform, version, and capabilities.
- Tokens are scoped to the minimum tenant/workspace and rotated on the documented
  schedule.

## 2. Work Assignment

- Agents poll or receive scheduled work units (audit plans, collectors).
- Work units carry the execution plan, not ad-hoc shell from untrusted input.
- Agents must reject work that exceeds their declared capabilities or scope.

## 3. Result Return

- Agents return marker-based results (`PASS/WARN/FAIL/SKIP`) plus a summary,
  matching the [Execution Standard](execution-standard.md).
- Results are transmitted over an authenticated, TLS-protected channel.
- No secrets or raw credentials are included in returned results.

## 4. Health And Lifecycle

| Phase | Requirement |
| --- | --- |
| Enrol | Authenticated registration with scoped token. |
| Heartbeat | Periodic liveness with version and capability report. |
| Update | Controlled upgrade path with rollback. |
| Retire | Revoke token and remove registration cleanly. |

## 5. Least Privilege

Agents run audit and collection work with the least privilege required. Elevation
is per-task, logged, and never standing. Product-specific agent setup guides
document the exact service account and permission model.

## 6. Product Mapping

- Audit-Tool and Linux Security Lite share the audit-execution agent model.
- Asset Command Centre and CMDB API Data Collection Tool use managed collection
  agents for discovery and inventory.
- Product repositories keep only product-specific enrolment commands and paths.
