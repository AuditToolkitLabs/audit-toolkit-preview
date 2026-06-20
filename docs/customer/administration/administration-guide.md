# Administration Guide

Status: Authoritative
Date: 2026-06-12

## Purpose

This guide defines the common customer administration model for AuditToolkit
products. Product-specific screens, settings, and entitlement gates are covered
in the relevant product guide.

This page is centrally maintained in AuditToolkit-Docs and is the canonical
administration guide source for rendered documentation surfaces.

Presentation repositories must consume this content via controlled sync and
must not maintain independently authored administration-guide variants.

## Administrative Scope

Routine administration may include:

- Creating, editing, disabling, and reviewing users.
- Assigning built-in roles and product-specific scopes.
- Reviewing license state, effective tier, resource limits, and feature gates.
- Configuring authentication sources and access policy.
- Managing API keys, connectors, targets, jobs, schedules, and agents.
- Reviewing audit logs and administrator actions.
- Configuring notifications, SIEM, webhook, or ticketing destinations.
- Reviewing backup policy metadata and operational status.
- Managing product-specific super administrator or break-glass workflows.

## Identity Sources

Products may support a combination of local authentication, LDAP, Entra ID,
SAML, OIDC, Okta, or API-key based access. A visible field or configuration
option does not automatically make an identity source production-ready for a
specific customer deployment.

Customers should validate:

- Identity provider reachability.
- Claim and group mapping.
- Administrator recovery process.
- MFA behavior where supported.
- Session lifetime and sign-out behavior.
- Audit logging for successful and failed sign-in attempts.

## Privileged Operations

Some products run audits, collection jobs, or connector tasks against customer
systems. Administrators should configure least-privilege credentials and avoid
interactive elevation in recurring jobs.

Recommended controls:

- Use dedicated service accounts or scoped credentials.
- Prefer non-interactive and auditable elevation policies.
- Test elevated execution manually before scheduling recurring jobs.
- Store secrets only in supported protected configuration locations.
- Rotate credentials according to customer policy.
- Review failed authentication and authorization events.

## License Administration

The central licensing policy is maintained in
[Licensing Overview](../../licensing/overview.md). Administrators should use
the product UI, CLI, API, or status output to review:

- Current tier.
- Effective tier.
- License status.
- Masked key or offline license identifier.
- Expiry or renewal state.
- Resource limits.
- Feature entitlement flags.

Do not paste full license keys, offline license files, private keys, or admin
tokens into tickets or public issue trackers.

## Administrator Review Checklist

Recommended monthly review:

- Active users and roles.
- API keys and service accounts.
- Identity-provider configuration.
- Failed sign-ins and access-denied events.
- License state and resource usage.
- Integration destinations and delivery failures.
- Backup and retention status.
- Product-specific super administrator access.
