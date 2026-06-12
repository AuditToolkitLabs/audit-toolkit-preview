# Audit-Tool Agent Deployment

## Purpose

Audit-Tool agents execute audit work on target hosts and return results to the
central application. Agents reduce the need to store broad SSH or WinRM
credentials on the central server and support local execution close to the
target system.

## Agent Modes

| Mode | Use case |
| --- | --- |
| Toolkit Agent direct mode | Single-host or simple deployments where the agent pushes directly to the Audit-Tool API. |
| Toolkit Agent coordinated mode | Fleet deployments coordinated by the built-in agent coordination service. |
| Hypervisor agent | On-hypervisor auditing for supported hypervisor platforms. |

## Prerequisites

Before deploying agents, confirm:

- Target host operating system is supported by the release.
- Required runtime is present or bundled in the release package.
- The central application is reachable from the target host on the approved
  HTTPS endpoint.
- An API key or registration token has been issued with the correct scope.
- TLS trust is configured for the target host.
- The customer has authorized audit execution on each target.

## Direct Mode Pattern

Direct mode is suitable when each host can be configured to push results to the
central API.

Customer steps:

1. Download or extract the correct agent package for the host platform.
2. Configure server URL, API key, agent identifier, and direct mode.
3. Install the agent as a Linux service or Windows service where supported.
4. Start the service.
5. Confirm the agent appears online in the administration console.

## Coordinated Mode Pattern

Coordinated mode is suitable for larger fleets where deployment and scheduling
are managed centrally.

Customer steps:

1. Configure agent coordination service settings in the administration console.
2. Confirm server URL, package source, and API access.
3. Select target hosts from inventory or approved import data.
4. Choose the deployment method supported for the target platform.
5. Deploy agents.
6. Confirm online status and recent heartbeat for every deployed agent.

## Hypervisor Agent Pattern

The hypervisor agent is used for approved hypervisor targets. It should be
installed only where the customer has confirmed authorization, platform support,
and maintenance-window requirements.

Customer steps:

1. Download the hypervisor package for the target platform.
2. Extract and run the platform-specific installer.
3. Register the agent with the provided registration token.
4. Confirm platform detection and online status.
5. Run a pilot audit before scheduling recurring activity.

## Upgrade Pattern

Agents should be upgraded through the product console where supported, or by a
controlled manual service stop, package replacement, and service restart.

Recommended controls:

- Pilot on a small target group first.
- Keep previous package and rollback steps available.
- Confirm agent logs after restart.
- Confirm online status and successful result push.

## Troubleshooting

| Symptom | First checks |
| --- | --- |
| Agent does not appear in console | Confirm network path, API key, server URL, and TLS trust. |
| Agent shows offline | Confirm service status and recent agent logs. |
| TLS error | Confirm the target trusts the issuing CA. |
| Unauthorized error | Reissue or verify the API key or registration token. |
| Results not received | Confirm execution logs, outbound HTTPS, and central ingest health. |

Do not send full API keys, tokens, private keys, or unredacted agent logs in
support requests.
