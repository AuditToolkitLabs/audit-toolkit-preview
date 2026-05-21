# 6. Administration Guide

The Admin page is the primary control surface for user management,
access settings, license state, identity-provider configuration
metadata, notification settings, backup policy metadata, and
super-admin handoff.

## Day-to-day administrative scope

Routine administration includes:

- creating and editing users
- assigning built-in roles
- setting team labels and report-scope filters
- reviewing the active license tier and enforced limits
- configuring administrator MFA policy and allowed MFA methods
- reviewing identity-provider settings shown in the Admin UI
- configuring SIEM and notification settings
- configuring central connectivity scheduling (Professional + central connectivity add-on only)

## Identity sources

The Admin UI includes `local`, `entra-id`, `ldap`, and `okta`
auth-source fields.

For this release, local authentication is the primary supported
baseline. If a customer enables another provider, that provider must be
validated as part of the customer's deployment testing and should not
be treated as automatically supported solely because a field exists in
the UI.

## MFA

The Admin UI supports:

- required or optional administrator MFA
- TOTP authenticator-app enrollment
- Email OTP as an additional allowed method
- per-user MFA-related settings in user forms

## Privileged collection execution

For connector jobs that require elevated command context on target
systems, administrators should configure credentials and elevation
flags before enabling recurring profiles.

- SSH collection can run with optional non-interactive sudo controls
  (`sudo` or `use_sudo`, with optional `sudo_password`)
- WinRM collection can enforce elevated token context using
  `require_elevated` (aliases: `elevated_powershell`, `run_as_admin`)
- scheduled profiles are worker-driven and do not pause for interactive
  prompt input

Where possible, use constrained least-privilege elevation policies on
targets (for example restricted sudo scopes or dedicated service
accounts) and validate behavior with a manual test run before enabling
automated schedules.

## License administration

License status is represented in the product by:

- current tier
- effective tier
- status
- masked key display
- resource limits
- feature entitlement flags

The product license view and Admin license form are the customer-facing
surfaces for applying and reviewing Asset Command Centre license data.

## Central connectivity scheduling gate

The Admin UI central connectivity scheduling and target-connectivity
settings are an advanced capability gated to:

- effective tier `professional`
- feature entitlement `central_connectivity_addon`

If either requirement is missing, the section remains unavailable and
save operations for those settings are rejected by the API.

## Super admin portal

Super-admin-only actions are deliberately separated from the main Admin
page. The portal provides restricted access to:

- tuning settings
- encryption management
- log viewing
- API-code route inspection and scaffold operations
- certificate generation and application
- SSH key-pair generation

The portal requires a separate MFA-verified session.
