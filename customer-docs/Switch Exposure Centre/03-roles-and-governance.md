# Roles and Governance

## Operating roles

Typical operating roles for the product are:

- Operator: runs refreshes, reviews exposures, and checks device status
- Administrator: manages connectors, advisory sources, and retention settings
- Reviewer: validates reports and signs off remediation summaries
- Support analyst: investigates failures and collects diagnostic evidence

## Governance model

The product is designed for controlled operational use rather than ad-hoc
personal experimentation. Access should be limited to people who need to
configure the platform, update data sources, or interpret the resulting
security posture.

## Responsibilities

- Operators keep inventory and advisories current.
- Administrators manage credentials, source configuration, and retention.
- Reviewers check the accuracy of reports before they are shared.
- Support staff triage errors and confirm whether issues are data, network,
  or configuration related.

## Change approval

Significant changes should be reviewed before rollout, especially changes to:

- Advisory source mode
- Connector credentials
- Scheduled refresh intervals
- Collection transport settings
- Data retention or purge behavior

## Governance cadence

A practical governance cadence is:

- Daily review of refresh failures or stale data
- Weekly review of device and advisory completeness
- Monthly review of reporting quality, operational gaps, and support tickets
