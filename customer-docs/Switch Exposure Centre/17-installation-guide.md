# Installation Guide

## Target environment

The primary release target is a direct Linux host. The deployment should have
working package installation, network access to the application, and a database
that the service can reach.

## Install goals

- Install the application
- Start the service
- Confirm health and readiness
- Confirm the UI and API are reachable

## Post-install checks

- The process starts successfully
- `/healthz` responds
- `/readyz` responds
- The browser console opens
- A test refresh or sample data review succeeds

## Removal or rollback

If the installation must be removed, revert the package and restore the prior
working configuration before applying a new change set.
