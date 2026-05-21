# 29. Team Labels and Reporting-Scope Governance

Asset Command Centre exposes team labels and report-scope filters in
user administration.

## What these fields are for

- team: operator-facing user label
- report scope: filters such as owner, location, environment,
  criticality, asset kind, vendor, source type, and managed state

## What these fields are not

- they are not a guaranteed multi-tenant isolation model
- they are not a substitute for separate deployments where strict data
  separation is required
- they should not be described as workspace or tenancy controls unless
  separately validated and released for that purpose
