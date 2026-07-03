# Asset Command Centre — Capabilities

Asset Command Centre collects asset inventory agentlessly and reports on it locally. Everything below reflects the supported standalone release: a legacy-focused collector running in `legacy-only` mode with an `inventory-only` collection profile by default. It is the protocol-based counterpart to the API-only CMDB API Data Collection Tool.

## Agentless discovery and collection

Collection reaches out to targets directly over the network — there is no host-resident software to install or maintain.

- Host inventory over SSH and WinRM paths.
- Network inventory via SNMP and related discovery paths.
- Hardware and management-plane access via IPMI where enabled.
- Sweep-based discovery via `nmap-sweep` and unified collection via `ansible-unified`.
- Discovery telemetry and task-run state captured alongside inventory.

### Supported connector families

The primary connector allowlist for the standalone release is:

- `ssh-host`
- `ssh-network`
- `winrm-host`
- `snmp-network`
- `ipmi-bmc`
- `nmap-sweep`
- `ansible-unified`

Cloud, virtualisation, and agent-based workflows are not part of the primary supported standalone release, even where related code or historical artifacts exist elsewhere.

## Inventory, reporting, and reconciliation

- Inventory collection and reconciliation for hosts and network assets.
- Local storage of collected inventory and operational findings.
- Local reports, trends, snapshots, and exports.
- Operator-facing status views for inventory totals, connector activity, and health.
- Host inventory and detail views, plus network-oriented inventory and topology views.

## Scheduling and unattended automation

Collection can run interactively or on a schedule, driven by a background worker.

- Scheduled collection-job submission and review.
- Schedule profiles execute without interactive prompts, so payloads must carry all required authentication and elevation values in advance.
- Inventory and snapshot/report export for downstream use.
- Onboarding-key rotation and cleanup as part of routine automation.

### Elevated, least-privilege execution

Elevation is designed to work unattended and to fail fast rather than hang on a prompt:

- **SSH / sudo** — `ssh-host` supports non-interactive sudo (`use_sudo`, optional `sudo_password`); with a password it runs via `sudo -S`, without one via `sudo -n`. The connector runs a fixed, read-only command set, so a targeted `NOPASSWD` sudoers rule can grant exactly what it needs.
- **WinRM elevated token** — `winrm-host` can require an elevated administrator token (`require_elevated`) and fails rather than silently downgrading collection.
- **Windows JEA** — via the optional `pypsrp` library, `winrm-host` can connect to a named Just Enough Administration endpoint (`jea_configuration_name`), so the connecting account needs no local-administrator membership; privilege is supplied by the JEA virtual account.

## Local API and automation surface

Asset Command Centre exposes a local API surface that backs the UI, collection workflows, licence views, and administrative functions.

- Inventory export.
- Collection-job creation and review.
- Licence-status review.
- Operational reporting and snapshot export.
- Key-scoped onboarding and scheduled collection workflows.

The bundled OpenAPI material shipped with the product is the authoritative API contract; validate usage against the running release and scope credentials and API keys to the minimum access required.

## Optional upstream forwarding

When central aggregation is enabled, the collector can forward local inventory to a central Audit Toolkit deployment.

- `POST /api/v1/ingest/assets/forward` forwards collected local CMDB assets to the configured main-core server ingest API.
- Forwarding options include `max_assets`, `include_inactive`, `dry_run`, and `forward_mode` (`incremental`, `full`, or `auto`), with incremental watermark support.
- Data transfer to the main core is API-only; database writes happen on the core server after ingest.
- Central connectivity scheduling requires the `professional` tier and the `central_connectivity_addon` feature entitlement.

## Access, identity, and governance

- Role-based access and application-level audit logging.
- Local authentication with administrator MFA is the documented, supportable baseline; keep at least one local break-glass administrator.
- Admin UI surfaces additional auth sources (`entra-id`, `ldap`, `okta`); these must be validated by the customer in their own environment before being treated as production-ready.
- Super-admin-only portal actions cover certificate, SSH key, API-code, tuning, log, and encryption workflows, and require a separate portal session.
- Remote Discovery provides encrypted target-credential management.

## Integration handoffs

Integration surfaces are described generically; the product does not ship vendor-specific, release-ready setup guides for named third-party systems.

- **SIEM and security webhooks** — Admin UI includes SIEM and notification fields and can emit security-event webhook output; customers own and validate the destination, transport security, and retention.
- **Ticketing and workflow handoff** — route local reports, exports, audit events, and webhook output into customer-owned middleware or API-driven automation; validate any ticket payload transformation in the target environment.
