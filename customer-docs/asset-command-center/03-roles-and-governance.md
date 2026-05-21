# 3. Roles and Governance

Asset Command Centre uses role-based access control in the main
application and a separate privileged portal for super-admin actions.

## Built-in roles

| Role | Intended use |
| --- | --- |
| `viewer` | Read-only review of inventory and reports. |
| `operator` | Day-to-day collection, review, and operational use. |
| `admin` | User administration, license review, settings, and reporting controls. |
| `security_admin` | Security-focused administration and review. |
| `super_admin` | Access to the separate portal and the most sensitive controls. |

## Governance guidance

- keep the `super_admin` population small
- require MFA for privileged roles
- use team and report-scope fields for administrative grouping only
- document any non-default provider or connector-policy changes through
  customer change control
