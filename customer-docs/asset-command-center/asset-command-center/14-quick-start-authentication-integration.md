# 14. Authentication and Access-Source Notes

The Admin UI exposes user `auth_source` values and default-provider
settings for `local`, `entra-id`, `ldap`, and `okta`.

## Supported baseline

The documented and supportable baseline for this release is local
authentication with administrator MFA enabled.

## Customer validation rule

If a customer uses `entra-id`, `ldap`, or `okta`, that configuration
must be validated by the customer in their own environment before being
treated as production-ready. This documentation set does not claim a
fully documented, contractually supported end-to-end quick-start for
those providers in the standalone release.

## Administrative expectations

- keep at least one local break-glass administrator account
- require MFA for privileged roles
- review any non-local provider mappings during deployment validation
