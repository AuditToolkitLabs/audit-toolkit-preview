# 31. API Surface and Collection Reference

## API surface

The customer-facing API surface for this release supports the product's
local UI and automation use cases. Customers should use the bundled
OpenAPI material and the running release as the authoritative contract.

Forwarding endpoint for main-core synchronization:

- `POST /api/v1/ingest/assets/forward` forwards collected local CMDB
  assets to the configured main core server ingest API.

Request options for `/api/v1/ingest/assets/forward`:

- `max_assets` (integer)
- `include_inactive` (boolean)
- `dry_run` (boolean)
- `forward_mode` (`incremental`, `full`, or `auto`)

## Collection categories

- host inventory via SSH and WinRM paths
- network inventory via SNMP and related discovery paths
- hardware or management access via IPMI where enabled
- discovery telemetry and task-run state

## Collection intent

The default collection intent for this release is inventory gathering
and reporting, not broad remediation or unrelated platform automation.

## Agentless release note

This standalone release is intentionally agentless. Collection APIs and
job workflows are designed around direct network protocol access from
the server to target systems.

Agent-based integration is not required for current operation and should
be treated as a future optional enhancement.

## Main-core data transfer contract

The collector transfers data to the main Audit-Tool server via API only.
Database writes occur on the core server side after API ingest.

Required collector environment for this operation:

- `ASSET_MANAGEMENT_CENTRAL_URL`
- `ASSET_MANAGEMENT_CENTRAL_API_KEY`

Optional:

- `ASSET_MANAGEMENT_CENTRAL_ASSET_INGEST_PATH` (default `/api/v1/ingest/assets/bulk`)
- `ASSET_MANAGEMENT_CENTRAL_ASSET_SOURCE_SYSTEM`
- `ASSET_MANAGEMENT_CENTRAL_ASSET_CONNECTOR_KEY`
- `ASSET_MANAGEMENT_CENTRAL_TIMEOUT_SECONDS`

Incremental watermark support:

- Policy key: `system.central_push.asset_forward_mode`
- Watermark key: `system.central_push.last_assets_forwarded_at`
- Env override: `ASSET_MANAGEMENT_CENTRAL_ASSET_WATERMARK_OVERRIDE`

License gate for central connectivity scheduling settings:

- effective tier must be `professional`
- feature entitlement `central_connectivity_addon` must be enabled

## Elevation and non-interactive execution contract

The collection worker is designed for unattended execution. Connector
jobs and scheduled profiles should be configured so remote commands can
complete without interactive prompt handling.

### SSH host connector

`ssh-host` supports optional non-interactive sudo controls in
`request_payload`:

- `sudo` or `use_sudo` (boolean)
- `sudo_password` (string, optional)

Execution behavior:

- with `sudo_password`: command wrapper uses `sudo -S`
- without `sudo_password`: command wrapper uses `sudo -n` (fail fast on
  prompt-required policies)

### WinRM host connector

`winrm-host` supports optional elevated-token enforcement:

- `require_elevated` (aliases: `elevated_powershell`, `run_as_admin`)

When enabled, the connector verifies that the WinRM session is running
with an administrator token before data collection proceeds.

`winrm-host` also supports JEA (Just Enough Administration) endpoint
connections via `pypsrp` (optional dependency):

- `jea_configuration_name` (alias: `jea_endpoint`) — named PowerShell
  session configuration registered on the target host

When `jea_configuration_name` is set, the connector uses PSRP to
connect directly to the named endpoint. The connecting account does not
need an administrator token; the JEA virtual account provides privilege.
`require_elevated` is ignored in this mode.

Note: without `pypsrp` installed, the standard pywinrm path opens a
cmd.exe shell and does not connect to a WinRM session configuration, so
JEA endpoint constraints are not applied.

### Scheduled profiles

Scheduled profiles are enqueued and executed by the background worker.
They do not pause for operator input, so required authentication and
elevation parameters must be supplied in the profile request payload.

Example profile body for `ssh-host` with non-interactive sudo:

```json
{
  "name": "linux-daily-inventory",
  "connector_key": "ssh-host",
  "target": "linux01.example.internal",
  "interval_minutes": 1440,
  "enabled": true,
  "request_payload": {
    "username": "svc_asset_scan",
    "password": "REDACTED",
    "use_sudo": true,
    "sudo_password": "REDACTED"
  }
}
```

Example profile body for `winrm-host` with elevated token enforcement:

```json
{
  "name": "windows-daily-inventory",
  "connector_key": "winrm-host",
  "target": "win01.example.internal",
  "interval_minutes": 1440,
  "enabled": true,
  "request_payload": {
    "username": "EXAMPLE\\svc_asset_scan",
    "password": "REDACTED",
    "transport": "ntlm",
    "require_elevated": true
  }
}
```

Example profile body for `winrm-host` with a JEA endpoint (least-privilege):

```json
{
  "name": "windows-daily-inventory-jea",
  "connector_key": "winrm-host",
  "target": "win01.example.internal",
  "interval_minutes": 1440,
  "enabled": true,
  "request_payload": {
    "username": "EXAMPLE\\svc_asset_scan",
    "password": "REDACTED",
    "transport": "ntlm",
    "jea_configuration_name": "AssetInventory"
  }
}
```

`svc_asset_scan` requires no administrator membership when using JEA.
Requires `pypsrp>=0.7.0` installed alongside `pywinrm`.
