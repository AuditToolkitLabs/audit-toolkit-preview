# 18. Quick Start — Managed Agent Onboarding

*ISO/IEC 20000-1 clauses 8.1, 8.5, 8.7*

Use this runbook to deploy and validate endpoint agents.

## 18.1 Prerequisites

- HTTPS endpoint for application is reachable from endpoints.
- Agent token/API key is generated and securely distributed.
- Endpoint deployment method is approved (software distribution tool).
- Host firewall rules allow outbound HTTPS to the app URL.

## 18.2 Platform requirements and permission model

Use the following baseline requirements for production onboarding.

| Platform | Minimum host requirements | Service account / permission level | Notes |
| --- | --- | --- | --- |
| Windows | Supported Windows Server or Windows client build; stable network; local disk for inventory cache (default `C:\ProgramData\CmdbAgent`) | Dedicated service account or LocalSystem. Minimum expected rights: service logon, read access to WMI/CIM data, registry read for software inventory, event-log read. | For complete inventory coverage (for example updates/drivers), local admin-equivalent read access may be required depending on host hardening policy. |
| Linux | Supported distribution with system service manager (systemd preferred), shell utilities used by collector, local disk for cache (`instance/agent_inventory_linux.json` by default) | Dedicated non-interactive service account with least privilege where possible; root may be required for full hardware/package/service visibility in hardened builds. | Use sudo elevation only for required read commands if your policy disallows root services. |
| macOS | Supported macOS version, launch/service management allowed, local disk for cache (`instance/agent_inventory_mac.json` by default) | Dedicated service context with read access to system profiling commands; elevated rights may be required for full inventory in managed enterprise profiles. | Ensure endpoint management profiles do not block required system command execution. |
| BSD (FreeBSD/OpenBSD/NetBSD/DragonFly) | Supported BSD host, required base tools present (`sysctl`, `df`, service/package commands), local disk for cache (`instance/agent_inventory_bsd.json` by default) | Dedicated service account with read permissions for system inventory commands; root may be required for full visibility of listening sockets/process ownership. | Validate command availability per BSD variant before mass rollout. |

## 18.3 Firewall and network rules

### Required rules

1. Allow endpoint outbound HTTPS (TCP 443) to the CMDB application
   hostname/load balancer.
2. Allow DNS resolution to your internal/public DNS resolvers.
3. Allow NTP to your approved time source.

### Optional rules (only if exposing local agent API endpoints)

If your operating model uses direct polling or health checks against the
agent's local API listener, allow inbound traffic from authorised
management networks only:

- Linux agent default port: TCP 9001
- macOS agent default port: TCP 9002
- BSD agent default port: TCP 9003
- Windows agent default port: TCP 8443

Do not expose agent listener ports to untrusted networks.

## 18.4 Pre-deployment checklist (per endpoint group)

1. Confirm host OS version is in your supported list.
2. Confirm required service account exists and has approved rights.
3. Confirm endpoint can resolve and reach CMDB URL over HTTPS.
4. Confirm firewall policy applied (required and optional rules).
5. Confirm TLS trust chain is valid for CMDB endpoint certificate.
6. Confirm token/API key distribution method is secure.
7. Confirm rollback plan (service stop/uninstall and key revoke).

## 18.5 Onboarding procedure

1. Register or issue agent credential.
2. Deploy agent package to target endpoints.
3. Configure agent with application URL and credential.
4. Start/restart agent service.
5. Confirm check-in in **Agents** view.
6. Verify first inventory upload timestamp.

## 18.6 Validation checklist

- Endpoints appear in expected workspace.
- Last-seen timestamp updates on schedule.
- Agent authentication errors are zero.
- Stale-agent alerting is enabled.
- Inventory fields expected for platform are populated.

## 18.7 Troubleshooting focus areas

- DNS/TLS trust to app endpoint.
- Token/API key validity and scope.
- Proxy configuration on endpoint.
- Local endpoint firewall and service status.
- Service account privilege is sufficient for required inventory depth.
