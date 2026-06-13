# Audit Assurance Node Runtime Validation

## Purpose

Runtime validation confirms that the standalone web runtime and adapter
contract boundaries work before a deployment is used for customer assurance
activity.

## Validation Families

| Validation                    | Purpose                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------- |
| Health check                  | Confirms the web runtime is responsive.                                      |
| Login page smoke check        | Confirms the UI template path renders correctly.                             |
| Dashboard smoke check         | Confirms authenticated UI pages can render with shared context.              |
| Adapter contract tests        | Confirms transport adapters return the required normalized result object.    |
| Web runtime integration tests | Confirms the UI can trigger a run and serve bundles, summaries, and reports. |
| Parallel tracing tests        | Confirms concurrent execution evidence is complete and deterministic.        |

## Web Runtime Integration Tests

The product includes an integration test workflow that starts the web server,
waits for health, loads the dashboard, triggers an audit run, checks bundle
APIs, checks the latest summary endpoint, and verifies report delivery.

These tests validate the web runtime and control plane. They do not replace
separate validation of audit content, target authorization, or customer policy
alignment.

## Adapter Contract Tests

Adapter contract tests run valid and invalid fixtures through the shared
contract validator. Valid fixtures for local, SSH, WinRM, agent, and API
transports must pass. Malformed fixtures must fail.

Run contract tests before changing adapter output, adding a new transport, or
accepting a release candidate.

## Minimum Customer Acceptance Checks

Before production use, complete at least:

- Runtime health check returns success.
- Login page and authenticated dashboard render without template errors.
- Adapter contract tests pass.
- A controlled test run creates an evidence bundle.
- Latest bundle and report views resolve successfully.
- Logs contain the expected `RunId` and adapter lifecycle events.
- Production run confirmation and execution lock behavior are understood.

## CI And Release Use

The source product describes adapter contract tests and web runtime integration
tests as quality gates. A release candidate should not be promoted if the
runtime cannot start, the UI cannot render, contract validation fails, or the
runtime cannot serve generated evidence.

## Related Guidance

- [Deployment](deployment.md)
- [Adapter model](adapters.md)
- [Logging and observability](logging-observability.md)
