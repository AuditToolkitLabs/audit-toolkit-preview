# 28. User Attributes and Access-Source Mapping Notes

The user-management UI stores account identity fields such as username,
display name, email, team label, role, auth source, and report-scope
filters.

## Documented scope

This section describes the application-side fields only. It does not
promise a full external-identity-provider claim-mapping framework for
the standalone release.

## Customer guidance

- keep usernames stable over time
- keep at least one local privileged account
- use team and report-scope fields as administrative metadata, not as
  hard tenancy boundaries
- validate any non-local access-source mapping before production use
