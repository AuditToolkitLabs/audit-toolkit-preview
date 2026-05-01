# 25. Managed Agent Server Operations Guide

*ISO/IEC 20000-1 clauses 8.1, 8.5, 8.7*

This guide covers operation of the managed agent control plane and fleet
health oversight.

## 25.1 Operational responsibilities

- Maintain availability of managed agent server endpoints.
- Secure agent registration and credential handling.
- Monitor fleet health and stale/non-reporting endpoints.
- Coordinate staged agent rollout and rollback.

## 25.2 Daily operational checks

1. Agent registration backlog and failures.
2. Endpoint check-in freshness.
3. Credential/authorization failures.
4. API and webhook integration health.

## 25.3 Weekly operational checks

- Review failed/disabled agents by environment.
- Review stale endpoint trends.
- Verify alert routing for fleet incidents.
- Validate agent package distribution readiness.

## 25.4 Agent lifecycle controls

- Join: register and assign endpoint to correct workspace.
- Move: update workspace or role assignment as approved.
- Leave: disable endpoint, revoke credentials, archive evidence.

## 25.5 Incident triage workflow

1. Confirm scope (single endpoint vs fleet-wide).
2. Validate service endpoint reachability.
3. Validate credential and policy state.
4. Validate host-side service status.
5. Escalate with logs and timeline if unresolved.
