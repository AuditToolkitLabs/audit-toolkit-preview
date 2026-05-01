# 17. Quick Start — Cloud and Virtualisation Connectors

*ISO/IEC 20000-1 clauses 8.1, 8.5, 9.1*

Use this runbook to onboard connectors such as AWS, Azure, GCP,
vCenter, Nutanix, OpenStack and KVM.

## 17.1 Prerequisites

- Read-only integration account(s) created in target platform.
- Required endpoint URLs and API permissions approved.
- Connectivity from app host to connector endpoints verified.
- Polling intervals and data ownership agreed.

## 17.2 Integration procedure

1. Go to **Admin → Connectors**.
2. Create connector and select platform type.
3. Enter endpoint and credential details.
4. Set scope (accounts/projects/subscriptions/clusters) as needed.
5. Set polling interval and timeout values.
6. Run connectivity test.
7. Run first inventory collection.
8. Verify host and metadata ingestion in UI.

## 17.3 Validation checklist

- Connector status is healthy after first run.
- Collected asset counts are within expected range.
- Error logs are clear of auth/permission failures.
- Polling interval does not exceed API rate limits.

## 17.4 Operational notes

- Use least-privilege roles in each platform.
- Rotate connector credentials on your security schedule.
- Re-test after platform API version changes.
