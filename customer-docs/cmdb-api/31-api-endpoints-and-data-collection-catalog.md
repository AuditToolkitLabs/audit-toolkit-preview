# 31. API Endpoints and Data Collection Catalog

*ISO/IEC 20000-1 clauses 7.5, 8.1, 8.7*

This catalog provides:

- Full REST API endpoint list currently implemented by the product API
  blueprint (`/api` prefix).
- Data entities returned or managed by each endpoint family.
- Data-collection coverage by integration and platform type.

## 31.1 Authentication and scope

- Base path: `/api`
- API authentication: `X-API-Key` header.
- Some operational endpoints (for example `/api/healthz`) are intentionally
  unauthenticated for infrastructure monitoring.

## 31.2 Full API endpoint list

### Host management

| Method | Endpoint | Purpose | Primary data entity |
| --- | --- | --- | --- |
| GET | `/api/hosts` | List hosts (query filters supported) | Host |
| POST | `/api/hosts` | Create host record | Host |
| GET | `/api/hosts/<host_id>` | Get host detail | Host |
| PUT | `/api/hosts/<host_id>` | Update host metadata | Host |
| DELETE | `/api/hosts/<host_id>` | Delete host | Host |

### Data collection and collected snapshots

| Method | Endpoint | Purpose | Primary data entity |
| --- | --- | --- | --- |
| POST | `/api/hosts/<host_id>/collect` | Trigger collection (`direct`, `custom`, or `agent`) | CollectedData |
| GET | `/api/hosts/<host_id>/data` | List collected snapshots for host | CollectedData |
| POST | `/api/hosts/<host_id>/scan` | Trigger vulnerability scan for host | VulnerabilityMatch summary |

### Custom API source definitions

| Method | Endpoint | Purpose | Primary data entity |
| --- | --- | --- | --- |
| GET | `/api/custom-apis` | List custom API definitions | CustomAPI |
| POST | `/api/custom-apis` | Create custom API definition | CustomAPI |
| GET | `/api/custom-apis/<api_id>` | Get custom API definition | CustomAPI |
| PUT | `/api/custom-apis/<api_id>` | Update custom API definition | CustomAPI |
| DELETE | `/api/custom-apis/<api_id>` | Delete custom API definition | CustomAPI |

### Managed agent definitions

| Method | Endpoint | Purpose | Primary data entity |
| --- | --- | --- | --- |
| GET | `/api/agents` | List managed agent definitions | Agent |
| POST | `/api/agents` | Create managed agent definition | Agent |
| GET | `/api/agents/<agent_id>` | Get managed agent definition | Agent |
| PUT | `/api/agents/<agent_id>` | Update managed agent definition | Agent |
| DELETE | `/api/agents/<agent_id>` | Delete managed agent definition | Agent |

### Licensing and entitlement checks

| Method | Endpoint | Purpose | Primary data entity |
| --- | --- | --- | --- |
| POST | `/api/license/keygen/validate` | Validate (and optionally activate) Keygen license | License payload |
| GET | `/api/license/keygen/info` | Read Keygen license information | License payload |

### Vulnerability operations

| Method | Endpoint | Purpose | Primary data entity |
| --- | --- | --- | --- |
| GET | `/api/vulnerabilities` | Query vulnerability matches with filters/pagination | VulnerabilityMatch |
| PUT | `/api/vulnerabilities/<match_id>/status` | Update vulnerability status | VulnerabilityMatch |

### Health and metrics

| Method | Endpoint | Purpose | Primary data entity |
| --- | --- | --- | --- |
| GET | `/api/healthz` | Aggregated service health (DB + connector summary) | Health payload |
| GET | `/api/metrics` | Prometheus metrics scrape endpoint (bearer token) | Metrics payload |

## 31.3 What data is collected (canonical categories)

Across agent and integration collection paths, the tool is designed to
collect the following data categories where available:

- Identity: hostname, FQDN, IP addressing, MAC data.
- Platform: OS family/name/version/build/kernel/architecture.
- Hardware: CPU, memory, manufacturer/model/serial where source supports it.
- Storage: disk/filesystem capacity and utilization.
- Network: interfaces, addressing and link data.
- Software and runtime inventory.
- Patch/update state and reboot indicators where available.
- Security and certificate posture where source supports it.
- Collector metadata: collector type, source, collection timestamps,
  validation and error context.

## 31.4 Collection paths and available data by integration type

| Collection path | How initiated | Typical data available |
| --- | --- | --- |
| Direct API (`type=direct`) | `/api/hosts/<host_id>/collect` | Source-dependent host/config data from host base URL |
| Custom API (`type=custom`) | `/api/hosts/<host_id>/collect` with `custom_api_id` | User-defined endpoint payloads mapped into collected snapshots |
| Agent-based (`type=agent`) | `/api/hosts/<host_id>/collect` with `agent_id` | Host inventory exposed by managed agent endpoint |

## 31.5 Covered platform and integration connector families

Implemented connector modules include the following families:

- Cloud and virtualization: AWS, Azure, GCP, Oracle OCI, OpenStack,
  KVM, Nutanix, vCenter, Hetzner, DigitalOcean.
- Network/security platforms: Cisco (IOS-XE, NX-OS, MDS, DNAC), Aruba,
  Arista (EOS, CloudVision), Juniper (Junos, Mist), Palo Alto,
  Fortinet (FortiOS, FortiManager), Check Point, F5, Citrix,
  HAProxy, Extreme, Brocade.
- Storage/data protection: NetApp ONTAP, Pure FlashArray,
  Dell PowerStore, Dell EMC Unity, HPE Primera, IBM Spectrum Protect,
  Veeam VBR.
- IPAM/monitoring/operations: Infoblox NIOS, BlueCat IPAM,
  SolarWinds NPM, Zabbix.

## 31.6 Data completeness expectations by platform type

| Platform type | Typical completeness |
| --- | --- |
| Windows agent path | Strong OS/hardware/software/update inventory coverage |
| Linux agent path | Strong core host/platform coverage; some fields source-dependent |
| macOS/BSD agent paths | Core host/platform coverage; depth depends on host command/profile permissions |
| Direct/custom API connectors | Source-dependent; field availability depends on upstream API capability |
| Network/storage/cloud connectors | Provider-dependent objects and metadata; normalize via connector mappings |

## 31.7 Consumer guidance

- Use this catalog as the contract for what endpoints exist today.
- Treat collected data as source-dependent: not every integration returns
  every field category.
- For onboarding a specific integration, pair this catalog with:
  - section 13 (integration quick starts),
  - section 26 (SIEM/ITSM/webhook payload reference),
  - section 30 (operational limits and known constraints).
