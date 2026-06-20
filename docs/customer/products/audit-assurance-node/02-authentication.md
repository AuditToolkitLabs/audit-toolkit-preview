# Audit Assurance Node Authentication

## Purpose

Audit Assurance Node separates credential handling from execution adapters so
that each transport can request approved credentials without hardcoding secrets
in scripts or source files.

## Authentication Architecture

The source product uses a central authentication module as the single handling
point for adapter credentials. That module loads authentication configuration,
retrieves secrets from approved sources, and supplies credential objects to the
execution adapters.

Adapters should not embed credentials. They should request credentials from the
shared authentication layer and then use them only for the approved connection
or ingestion action.

## Configuration Sources

Authentication settings may be supplied through a product configuration file or
environment variables. Environment variables take precedence and are preferred
for secrets in customer deployments.

Common secret inputs include:

| Secret            | Typical use                                               |
| ----------------- | --------------------------------------------------------- |
| `API_TOKEN`       | Bearer token or API credential for API adapter workflows. |
| `SSH_PRIVATE_KEY` | Path to the SSH private key used by approved SSH targets. |
| `WINRM_PASSWORD`  | WinRM password for approved Windows remoting targets.     |

The local authentication configuration file must not be committed to source
control. Treat it as a secret-bearing runtime file.

## Web UI Authentication

The hardened web UI uses signed browser sessions, bcrypt-hashed user
passwords, and role-based access control. The admin page is restricted to admin
users. Session signing configuration is read from runtime UI configuration.

Customer deployments should rotate default or bootstrap credentials before
production use and restrict administrator accounts to named operational users.

## Transport Access Controls

| Transport | Control expectation                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| SSH       | Use scoped accounts or keys approved for audit execution. Confirm sudo policy before running privileged checks. |
| WinRM     | Use scoped Windows credentials or constrained endpoints such as JEA where available.                            |
| API       | Use tokens with read-only or audit-specific privileges where the platform supports them.                        |
| Agent     | Validate agent identity and result provenance before ingesting outputs.                                         |

## Secure Practices

- Never hardcode credentials in scripts, templates, or source code.
- Never commit private keys, passwords, tokens, or local auth configuration.
- Use separate credentials for development, test, and production.
- Prefer short-lived or centrally managed secrets where available.
- Review access after staff changes, target ownership changes, and deployment
  mode changes.
- Align credential rotation with the customer change-management process.

## Related Guidance

- [Deployment](deployment.md)
- [SSH WinRM API and agent transports](ssh-winrm-api-agent-transports.md)
- [Security Access And Data Protection](../../security/security-access-data-protection.md)
