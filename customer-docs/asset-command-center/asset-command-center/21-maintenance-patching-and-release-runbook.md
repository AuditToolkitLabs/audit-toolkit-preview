# 21. Maintenance and Patching Runbook

Planned release version baseline for this runbook cycle: 1.0.2.

## Before maintenance

- notify users
- back up database and configuration data
- verify rollback artifacts exist
- review the target release notes

## During maintenance

1. stop or drain the running stack
2. deploy the updated package or image set
3. restart the stack
4. validate UI access
5. validate connector readiness and local reporting
6. validate license view and administrative access
7. validate expected feature functions for the planned release scope:
   agentless connector operation, local reporting, and optional central
   forwarding behavior where enabled

## After maintenance

- review logs and task-run state
- confirm no stale onboarding keys remain exposed
- record the change outcome in customer change control
