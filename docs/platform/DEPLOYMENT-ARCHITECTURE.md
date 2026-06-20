# AuditToolkit Platform — Deployment Architecture

## Component Connectivity Model

| Component | Network posture | Notes |
|-----------|----------------|-------|
| **audit-tool** (central) | Inbound HTTPS 443 (nginx → gunicorn 127.0.0.1:5000) | All management UI and API traffic through nginx reverse proxy |
| **cmdb-api-data-collection-tool** (central) | Inbound HTTPS 443 (nginx → gunicorn 127.0.0.1:5000) | Collector outbound to agent endpoints and API connectors |
| **switch-exposure-center** (central) | Inbound HTTPS 443 (nginx → gunicorn 127.0.0.1:5000) | Outbound to managed switch APIs |
| **asset-command-centre** (central) | Inbound HTTPS 443 (nginx → gunicorn 127.0.0.1:5000) | Outbound to discovery targets |
| **audit-assurance-node** (central) | Inbound HTTPS 443 (nginx → gunicorn 127.0.0.1:5000) | Outbound SSH/API to execution targets |
| **fleet-agent** (managed host) | No inbound ports required. Outbound HTTPS to audit-tool. | Agent polls central server; push-based result delivery |
| **standalone-agent** (standalone host) | Inbound HTTP 8088 (loopback by default). No outbound callback. | Serves local web UI; no central server connection |
| **cmdb-agent / Linux** (managed host) | Inbound HTTP 9001 (loopback by default). No outbound. | On-host pull-model inventory server, loopback-only, queried by the CMDB platform |
| **CmdbAgent / Windows** (managed host) | Inbound HTTP/HTTPS (loopback by default). No outbound. | Same pull model as Linux agent; MSI-installed Windows service |

## CmdbAgent Pull Model

The Linux and Windows CMDB agents are **on-host inventory servers**, not push agents. They:

1. Run on each managed host, collecting hardware, software, service, and network inventory on a configurable interval (default 30 minutes).
2. Serve inventory data via a local HTTP API authenticated with `X-Agent-Key`.
3. Default to binding `127.0.0.1` (loopback only). No inventory data leaves the host spontaneously.

The central CMDB platform pulls from registered agents by issuing an HTTP GET to the agent's configured host:port (registered by an administrator in the CMDB UI). `allow_private=True` in the collector SSRF guard permits private and loopback addresses for agent endpoints.

**Same-host deployments** (CMDB and agent on the same appliance): loopback default (`AGENT_HOST=127.0.0.1`) is correct and the most secure posture.

**Remote deployments** (CMDB on a separate host): the administrator must change `AGENT_HOST` in `/etc/audittoolkit/cmdb-agent/agent.conf` to the routable interface address. The firewall should restrict access to port 9001 to the CMDB server's IP only.

> **Note on interface mismatch (v1.0.0-rc.1):** The CMDB collector (`collect_agent_based` in `app/collectors.py`) currently calls `GET {base_url}/system-info` without an `X-Agent-Key` header. The Go Linux agent serves `/api/v1/inventory` and requires `X-Agent-Key`. These do not yet interoperate. The integration path is: update `collect_agent_based` to call `/api/v1/inventory` with `X-Agent-Key: {agent.api_key}` (a field to be added to the `Agent` model). Tracked as Phase G integration work.

## Fleet Agent vs. Standalone Agent

| Property | fleet-agent | standalone-agent |
|----------|-------------|-----------------|
| Callback to central server | Yes (AUDIT_SERVER_URL + AUDIT_API_KEY required) | No — no-callback mode by design |
| Inbound ports | None | 8088 (local web UI) |
| Push endpoint (`/api/config/push`) | Present | **Not present** — returns 404 |
| Config signing enforcement | Yes (MANAGED_ENFORCE_SIGNED_CONFIG=true by default) | N/A |
| Deployed via | deb / rpm / MSI | deb / rpm / MSI |

## Appliance (Air-Gapped) Notes

Central component debs bundle a Python wheelhouse for offline pip installation. The offline path requires the host Python minor version to match the appliance build Python (Ubuntu 22.04 = Python 3.10). On hosts with a different Python minor version, the postinst automatically falls back to network pip with a warning log. Air-gapped central-tier customers must take the appliance image — a standalone deb install is only offline-capable when the host Python matches the build Python.
