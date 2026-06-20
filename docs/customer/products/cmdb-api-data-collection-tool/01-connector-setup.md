# CMDB API Data Collection Tool Connector Setup

## Purpose

Connectors collect asset and configuration metadata from approved platforms and
feed it into the CMDB data model. This guide defines the customer-facing setup
pattern for cloud, virtualization, and platform connectors.

## Supported Connector Pattern

The source customer docs describe connectors such as AWS, Azure, GCP, vCenter,
Nutanix, OpenStack, and KVM. Exact connector availability depends on the
product release and customer entitlement.

## Prerequisites

Before creating a connector, confirm:

- Read-only integration account exists in the target platform.
- Required API permissions are approved.
- Endpoint URL and network path are reachable from the app host.
- Scope boundaries are defined, such as accounts, subscriptions, projects,
  clusters, or tenants.
- Polling interval and timeout values fit platform rate limits.
- Data ownership and retention expectations are agreed.
- Credential rotation process is documented.

## Onboarding Procedure

1. Open connector administration.
2. Create a connector and select the platform type.
3. Enter endpoint and credential details.
4. Set collection scope.
5. Set polling interval and timeout values.
6. Run a connectivity test.
7. Run the first inventory collection.
8. Verify host and metadata ingestion in the UI.
9. Review logs for authentication, permission, or rate-limit failures.

## Validation Checklist

- Connector status is healthy after the first run.
- Collected asset counts are within expected range.
- Metadata fields are populated as expected.
- Error logs are clear of authentication and permission failures.
- Polling interval does not exceed API rate limits.
- Collected data appears in dashboards, host views, or reports as expected.

## Operational Notes

- Use least-privilege platform roles.
- Avoid personal accounts for recurring connector operation.
- Re-test after target platform API changes.
- Rotate credentials under customer policy.
- Disable connectors when platforms are decommissioned.
- Keep connector ownership visible to operations and security teams.

## Related Guidance

- [CMDB API Data Collection Tool Overview](overview.md)
- [Administration Guide](../../administration/administration-guide.md)
- [Security Access And Data Protection](../../security/security-access-data-protection.md)
