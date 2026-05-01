# 30. Operational Limits and Known Constraints

*ISO/IEC 20000-1 clauses 8.1, 9.1, 9.4*

This guide describes practical operational limits and planning
considerations for production use.

## 30.1 Capacity planning inputs

Track and trend:

- Number of managed endpoints.
- Connector count and polling frequency.
- Report generation concurrency.
- API request volume and burst patterns.

## 30.2 Common operational constraints

- High connector concurrency may increase API throttling risk upstream.
- Large report bursts can increase response latency.
- Insufficient disk capacity can impact logs, backups and stability.
- Misconfigured retries in external automation can amplify load.

## 30.3 Recommended guardrails

- Use staged rollout for major configuration changes.
- Enforce polling/report concurrency limits.
- Monitor queue depth and error rates.
- Alert on backup failure, disk pressure and repeated auth failures.

## 30.4 What to do when limits are approached

1. Identify top load drivers (connectors, reports, API clients).
2. Reduce non-critical polling/report frequency.
3. Scale host/database resources according to demand.
4. Coordinate with support for sustained capacity issues.

## 30.5 Known integration constraints

- External platform API limits may throttle ingestion.
- Identity provider outages can affect sign-in paths.
- SMTP or webhook destination outages can delay notifications.

Maintain contingency plans for each dependency.
