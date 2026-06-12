# Audit Assurance Node Deployment

## Purpose

This guide summarizes the supported customer deployment patterns for Audit
Assurance Node and the operational checks that should be completed before the
node is used against approved targets.

## Deployment Modes

| Mode | Customer use | Notes |
| --- | --- | --- |
| Local development | Developer or lab validation | Uses local Python runtime and environment profiles. |
| Standalone web runtime | Small standalone assurance node | Runs the FastAPI web UI and backing audit control plane. |
| Docker container | Isolated runtime packaging | Mount persistent `data/` and `config/` paths. |
| Docker Compose | Lab, test, or simple service composition | Uses repository compose configuration where supplied. |
| Windows service | Long-running Windows-hosted node | Use an approved service wrapper such as NSSM with `run-service.ps1`. |

## Environment Profiles

Runtime behavior is controlled by environment-specific configuration under
`config/environments/`. Common profiles are development, test, and production.
The active profile can be selected with an environment variable or runtime
configuration file depending on the deployment path.

Production deployments should use the production profile, customer-approved
network and credential settings, durable storage, and a documented rollback
path.

## Standalone Web Startup

The standalone web UI can be launched from the repository root with the product
startup script. The web application is expected to listen on the configured
local address and expose the dashboard, login page, health endpoint, bundle
history, and latest report view.

Before exposing the UI beyond localhost or a restricted management network,
confirm session secret configuration, TLS termination, administrator accounts,
firewall policy, and monitoring.

## Container Deployment

When running as a container, mount persistent paths for configuration, runtime
data, logs, and evidence. Do not rely on ephemeral container storage for audit
bundles or operational logs.

Minimum container planning items:

- Runtime profile set to production for production use.
- Persistent `data/` and `config/` volumes.
- Secret injection through environment or approved secret store.
- Health check wired to the runtime health endpoint.
- Log collection configured for the host or platform.

## Windows Service Deployment

For Windows-hosted operation, install the runtime as a managed service using an
approved wrapper and the product service startup script. The service account
should be scoped to the minimum rights needed to read configuration, write
logs and evidence, and access any approved local resources.

## Pre-Deployment Checklist

- Confirm the customer has approved the targets and transport methods.
- Confirm Python, PowerShell, and adapter dependencies are installed.
- Create or verify environment profile files.
- Configure authentication secrets outside source control.
- Confirm evidence and log paths are writable and backed up.
- Confirm health and runtime smoke checks pass.
- Confirm adapter contract tests pass before enabling new or changed adapters.
- Document the maintenance window, rollback path, and support contact.

## Related Guidance

- [Overview](overview.md)
- [Authentication](authentication.md)
- [Runtime validation](runtime-validation.md)
- [Operational limits](operational-limits.md)
