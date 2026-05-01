# 29. Tenant and Workspace Governance Guide

*ISO/IEC 20000-1 clauses 6.1, 7.5, 8.1, 8.7*

This guide defines governance controls for multi-tenant and workspace
operations.

## 29.1 Governance objectives

- Preserve strict data separation between workspaces.
- Apply least-privilege access by role and workspace.
- Ensure auditable lifecycle management for workspace changes.

## 29.2 Workspace lifecycle model

1. Create: approved request with owner assignment.
2. Operate: enforce role and access boundaries.
3. Change: controlled changes to mappings and integrations.
4. Retire: archive/export data and remove access safely.

## 29.3 Naming and ownership standards

- Use consistent workspace naming convention.
- Assign business owner and technical owner.
- Track ownership changes in change records.

## 29.4 Access governance controls

- Separate admin and operator roles.
- Require periodic access reviews.
- Revoke dormant or orphaned access promptly.
- Ensure API keys map to designated owners.

## 29.5 Audit and compliance checks

- Quarterly review of role assignments.
- Quarterly review of API key ownership.
- Verification of workspace-level data segregation.
- Evidence retention for governance and audit reviews.
