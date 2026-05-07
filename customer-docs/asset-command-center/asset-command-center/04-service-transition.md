# 4. Deployment Transition and First-Time Setup

The supported customer deployment direction for this release is a
single Ubuntu Server 24.04 LTS host placed on the management network.

## First-time setup checklist

1. provision the Ubuntu host
2. install Docker Engine and the Docker Compose plugin
3. configure PostgreSQL, secrets, and encryption values
4. set connector policy to `legacy-only`
5. set collection profile to `inventory-only`
6. start the application stack
7. create the first privileged accounts
8. configure administrator MFA
9. load the local UI and validate reporting and connector readiness
10. enable upstream forwarding only if a central Audit Toolkit
    deployment is actually in use

This release documentation does not assume or require an in-product EULA
acceptance step during bootstrap.
