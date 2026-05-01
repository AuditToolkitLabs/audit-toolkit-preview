# 28. SSO Claim and Attribute Mapping Cookbook

*ISO/IEC 20000-1 clauses 7.6, 8.1, 8.7*

This cookbook provides practical patterns for SSO attribute mapping.

## 28.1 Required identity attributes

Minimum identity set:

- Username (stable unique identifier)
- Email
- Display name
- Role/group claims used for authorization mapping

## 28.2 Mapping standards

- Prefer immutable identifiers for username mapping.
- Avoid display-name-based authorization mapping.
- Keep role mapping explicit and least privilege.
- Validate workspace mapping outcomes before production use.

## 28.3 Example role mapping policy

| Identity claim/group | Application role |
| --- | --- |
| cmdb-admins | admin |
| cmdb-operators | operator |

## 28.4 Validation runbook

1. Test with non-admin account.
2. Verify expected role and workspace assignment.
3. Verify denied access for non-entitled account.
4. Verify audit-log entries for SSO sign-in and mapping outcomes.

## 28.5 Break-glass guidance

- Keep at least one local admin account enabled.
- Document local-auth fallback procedure.
- Validate fallback access after every SSO change.
