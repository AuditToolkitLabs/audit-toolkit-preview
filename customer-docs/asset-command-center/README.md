# Asset Command Center

Legacy-focused asset inventory and discovery service.

## Purpose

This service tracks hosts and network assets using protocol-compatible
methods for mixed and older environments where modern cloud/API coverage
is not the primary target.

## Planned release version and feature functions

Planned release version for this documentation set: 1.0.3.

Planned feature functions for version 1.0.3:

- Agentless collection and inventory through SSH, WinRM, SNMP, IPMI,
  Nmap sweep, and ansible-unified connector paths.
- Standalone local reporting and operations including snapshots, audit
  trails, credential-managed connector execution, and license view.
- Optional forwarding of collected assets to a central Audit Toolkit
  deployment using the documented API forwarding controls.
- Release-ready distribution through Linux package workflows and Windows
  MSI workflows aligned to this repository's release pipeline.

Primary production release security report for version 1.0.3:

- `14-customer-security-assurance-report.md`

Customer-facing release notes for version 1.0.3 are published in:

- `changelog.md`

## Operating Model

- Connector mode defaults to legacy-only
- Collection profile defaults to inventory-only
- Discovery prioritizes SSH, WinRM, SNMP, IPMI, and ansible-unified orchestration
- Agentless by design for this standalone release
- No commercial fulfillment subsystem is part of this service

## Agentless Positioning

This repository's standalone Asset Command Center release is intentionally
agentless. Data collection and reporting are performed using direct network
connectivity methods from the server to target systems.

Supported collection posture:

- SSH for Unix/Linux/macOS host inventory paths
- WinRM for Windows host inventory paths
- SNMP for network device inventory paths
- IPMI for optional out-of-band hardware inventory where enabled

No host-resident collector deployment is required for the supported model.

## Future Enhancement Direction

Agent-based collection is out of scope for the current standalone release
and should be treated as a future enhancement only.

If introduced later, integration should align to existing Audit Toolkit
components (for example Fleet agent capabilities in the separate toolkit
repository) and be documented as an optional extension path rather than a
baseline dependency for this service.

## Main Core Server API Forwarding

This standalone collector can push collected CMDB asset data to the main
Audit-Tool core server over API. The core server then performs database
ingest on its side.

Set these environment variables on the collector:

- `ASSET_MANAGEMENT_CENTRAL_URL` (for example `https://core.audit.local`)
- `ASSET_MANAGEMENT_CENTRAL_API_KEY` (operator-capable API key on core)
- `ASSET_MANAGEMENT_CENTRAL_ASSET_INGEST_PATH` (default `/api/v1/ingest/assets/bulk`)
- `ASSET_MANAGEMENT_CENTRAL_ASSET_SOURCE_SYSTEM` (optional label, default `asset-command-center-forwarder`)
- `ASSET_MANAGEMENT_CENTRAL_ASSET_CONNECTOR_KEY` (optional, default `ansible-unified`)
- `ASSET_MANAGEMENT_CENTRAL_TIMEOUT_SECONDS` (optional, default `20`)

Manual forward trigger endpoint on collector:

- `POST /api/v1/ingest/assets/forward`

Example request body:

```json
{
  "max_assets": 500,
  "forward_mode": "incremental",
  "include_inactive": false,
  "dry_run": false
}
```

Forward modes:

- `incremental` (default): sends only assets updated after the last
  successful forward watermark
- `full`: sends the latest selected assets regardless of watermark
- `auto`: uses policy mode from `system.central_push.asset_forward_mode`

Watermark behavior:

- Stored in settings at `system.central_push.last_assets_forwarded_at`
- Advanced only when an incremental push succeeds with no failed items
- Optional override: `ASSET_MANAGEMENT_CENTRAL_ASSET_WATERMARK_OVERRIDE`

This flow is API-based data transfer to the core server, not direct
database connectivity from the collector.

## Deployment Role

This service is deployed as a standalone collector and local reporting
node.

In standalone mode it:

- queries target servers and network equipment over outbound management
  protocols such as SSH, WinRM, SNMP, and IPMI
- stores collected inventory and findings locally on the same deployment
- exposes local reporting, snapshots, and operational status from that
  server
- can optionally forward collected data to a central Audit Toolkit deployment
  deployment for broader reporting and deeper analysis

The central Audit Toolkit platform is therefore optional for initial
deployment. This service is useful on its own and should be placed where
it has the best network reach to the managed estate.

## Deployment Recommendation

Customer-facing recommendation:

> Deploy Asset Command Center as a single Ubuntu LTS server on the
> management network. The server operates as a standalone collector and
> local reporting node, stores data locally, and optionally forwards data
> upstream to Audit Toolkit when central aggregation is enabled.

Recommended supported release target:

- Ubuntu Server 24.04 LTS x86_64
- Single-node deployment for the standalone collector release
- Outbound-only access to target management interfaces
- Optional outbound HTTPS to the central Audit Toolkit deployment

## Host OS Comparison

The server OS does not need to match the target OS. WinRM, SSH, SNMP,
and IPMI are outbound client protocols from this service to managed
systems.

Comparison matrix:

- Operational fit for this tool: Ubuntu Server is the better fit for a
  mixed-estate collector node; Windows Server is viable but not the
  natural fit for the runtime model.
- SSH-based collection: Ubuntu Server is a strong fit; Windows Server
  works but adds no real advantage.
- WinRM-based collection: Ubuntu Server is sufficient through Linux-side
  client libraries; Windows Server is supported but not materially
  easier.
- SNMP and IPMI collection: Ubuntu Server is a strong fit; Windows
  Server is supported but offers no host advantage.
- Ansible-unified orchestration: Ubuntu Server is the better fit;
  Windows Server is weaker for ongoing operations.
- Containerized deployment: Ubuntu Server is a strong fit for
  Docker-first packaging; Windows Server is possible but operationally
  heavier.
- Reverse proxy and service supervision: Ubuntu Server aligns with
  standard Linux patterns; Windows Server can do this with IIS and
  Windows services, but with more moving parts.
- Packaging direction: Ubuntu Server is the best base for a single
  supported release; Windows Server is better treated as a secondary
  option only.

Why Ubuntu is the preferred single-option release base:

1. This tool acts as a network-facing collector, not a Windows-native
   management console.
2. Mixed-protocol collection does not benefit from matching the server OS
   to the target OS.
3. Linux aligns better with Docker, Gunicorn, PostgreSQL, Redis, and
   Ansible-oriented operations.
4. Ubuntu reduces packaging and support variance if the product is
   intentionally narrowed to one supported base image.

## Reference Deployment Specification

Reference standalone deployment for the Ubuntu-based release:

- OS: Ubuntu Server 24.04 LTS x86_64
- Form factor: single VM or single physical server
- CPU: 4 vCPU minimum, 8 vCPU preferred
- Memory: 8 GB minimum, 16 GB preferred
- Storage: 100 GB SSD minimum, 200 GB preferred
- Database: local PostgreSQL by default; external PostgreSQL at scale
- Runtime: Docker Compose preferred
- Network: 1 Gbps NIC minimum
- Time sync: NTP, chrony, or equivalent
- Backup: daily database and configuration backup

Recommended network expectations from the collector server:

- outbound TCP 22 for SSH targets
- outbound TCP 5985/5986 for WinRM targets
- outbound UDP 161 and optional traps/related monitoring paths where used
- outbound UDP 623 for IPMI where enabled
- outbound TCP 443 for HTTPS-based connectors and optional upstream push
- inbound TCP 443 from administrators or a reverse proxy to the local UI

Sizing guidance:

- Small estate: up to 250 managed assets, 4 vCPU, 8 GB RAM, 100 GB SSD,
  local PostgreSQL
- Standard estate: 250 to 1,000 managed assets, 8 vCPU, 16 GB RAM,
  200 GB SSD, local or external PostgreSQL
- Larger estate: more than 1,000 managed assets, external PostgreSQL,
  separate sizing review, and staged connector scheduling

## Release Direction

If the product is narrowed to a single supported server option, the most
defensible release direction is:

- Ubuntu Server 24.04 LTS as the only supported host OS
- Docker-based deployment as the primary installation path
- Windows Server retained only as an internal or future exception path,
  not as a first-class release target

## Supported Platform Statement

Supported standalone collector server platform:

- Ubuntu Server 24.04 LTS x86_64

Supported deployment mode:

- single-node collector deployment
- local storage and local reporting enabled
- optional upstream forwarding to Audit Toolkit

Not part of the primary supported standalone server release:

- Windows Server as a first-class host platform
- multi-node clustering for the standalone release
- non-Ubuntu Linux variants as the default reference build target

## Ubuntu Single-Node Install Path

Recommended installation model for the standalone collector release:

1. Provision one Ubuntu Server 24.04 LTS host on the management network.
2. Give that host outbound reach to the required target management
   ports.
3. Run the application, worker, and local data services on that same
   node.
4. Keep local reporting enabled by default.
5. Enable upstream forwarding to Audit Toolkit only when a central
   repository is present.

Baseline host preparation:

1. Install Docker Engine and Docker Compose plugin.
2. Create a dedicated application directory such as
   `/opt/asset-command-center`.
3. Place application files, environment file, and persistent volumes
   under that path.
4. Terminate HTTPS either directly in the application stack or at a
   reverse proxy on the same host.
5. Enable time sync and daily backup of database and configuration
   material.

Recommended runtime layout:

- reverse proxy or HTTPS entrypoint
- web application service
- background worker service
- PostgreSQL service or external PostgreSQL endpoint
- Redis only if the chosen runtime path requires it

Deployment sequence:

1. Install the application files on the Ubuntu host.
2. Set runtime secrets and encryption keys.
3. Start the stack with Docker Compose.
4. Confirm UI access, worker health, and local data persistence.
5. Register credentials for SSH, WinRM, SNMP, or IPMI targets.
6. Limit enabled connectors to the required estate scope.
7. Run initial discovery and verify reporting output.
8. Optionally enable central forwarding after local validation is
   complete.

Operational defaults for the Ubuntu release:

- local storage and reporting are first-class, not fallback behavior
- outbound-only target access is preferred
- connector policy should stay `legacy-only` unless explicitly widened
- collection profile should stay `inventory-only` for the standalone
  release

## Example Docker Compose Layout

Example single-node layout for Ubuntu:

```yaml
services:
  postgres:
    image: postgres:15
    restart: unless-stopped
    environment:
      POSTGRES_DB: asset_command_center
      POSTGRES_USER: asset_command_center
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data

  app:
    image: asset-command-center:latest
    restart: unless-stopped
    depends_on:
      - postgres
    ports:
      - "443:5000"
    environment:
      SECRET_KEY: ${SECRET_KEY}
      ASSET_MANAGEMENT_ENCRYPTION_KEY: ${ASSET_MANAGEMENT_ENCRYPTION_KEY}
      DATABASE_URL: postgresql://asset_command_center:${POSTGRES_PASSWORD}@postgres:5432/asset_command_center
      ASSET_MANAGEMENT_CONNECTOR_OPERATING_MODE: legacy-only
      ASSET_MANAGEMENT_COLLECTION_PROFILE: inventory-only
      ASSET_MANAGEMENT_ALLOWED_CONNECTORS: ssh-host,ssh-network,winrm-host,snmp-network,ipmi-bmc,nmap-sweep,ansible-unified
      ASSET_MANAGEMENT_CENTRAL_PUSH_ENABLED: "false"
      ASSET_MANAGEMENT_CENTRAL_PUSH_MODE: disabled
    volumes:
      - ./data/app:/opt/asset-command-center/data
      - ./logs:/opt/asset-command-center/logs
      - ./.ssh:/opt/asset-command-center/.ssh
```

This example is intentionally minimal. Add reverse proxy, backup, and
certificate automation to match the target environment.

## Example Environment File

Example `.env` for the Ubuntu single-node deployment:

```dotenv
POSTGRES_PASSWORD=change-me
SECRET_KEY=change-me
ASSET_MANAGEMENT_ENCRYPTION_KEY=change-me

ASSET_MANAGEMENT_CONNECTOR_OPERATING_MODE=legacy-only
ASSET_MANAGEMENT_COLLECTION_PROFILE=inventory-only
ASSET_MANAGEMENT_ALLOWED_CONNECTORS=ssh-host,ssh-network,winrm-host,snmp-network,ipmi-bmc,nmap-sweep,ansible-unified

ASSET_MANAGEMENT_CENTRAL_PUSH_ENABLED=false
ASSET_MANAGEMENT_CENTRAL_PUSH_MODE=disabled
ASSET_MANAGEMENT_CENTRAL_PUSH_INTERVAL_SECONDS=300
ASSET_MANAGEMENT_CENTRAL_PUSH_MAX_RUNS=50
```

If central forwarding is enabled later, also set the upstream endpoint,
API key, signing key, and source identifier values.

## Runtime Profile

Recommended runtime settings:

- ASSET_MANAGEMENT_CONNECTOR_OPERATING_MODE=legacy-only
- ASSET_MANAGEMENT_COLLECTION_PROFILE=inventory-only

Optional connector allowlist override:

- ASSET_MANAGEMENT_ALLOWED_CONNECTORS=ssh-host,ssh-network,winrm-host
- ASSET_MANAGEMENT_ALLOWED_CONNECTORS=ssh-macos,ssh-bsd,ssh-esxi
- ASSET_MANAGEMENT_ALLOWED_CONNECTORS=snmp-network,ipmi-bmc
- ASSET_MANAGEMENT_ALLOWED_CONNECTORS=nmap-sweep,ansible-unified

## Local Run

From tools/asset-management:

1. Install dependencies:
   - pip install -r requirements.txt
2. Set required environment:
   - ASSET_MANAGEMENT_ENCRYPTION_KEY
   - SECRET_KEY
3. Start app:
   - python -m src.app

## Scope Boundaries

In scope:

- Asset inventory and reconciliation
- Connector jobs and discovery telemetry
- CMDB quality/risk reporting and snapshots
- Access control and audit logging

Out of scope:

- Commercial sales-channel or license-issuance workflows
- Legacy branch migration guidance from prior split phases

## Related Internal Docs

Internal architecture and implementation material now lives under
`docs/asset-command-center/`.
