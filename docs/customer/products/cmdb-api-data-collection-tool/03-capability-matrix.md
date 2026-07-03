# Collector Capability Matrix

Version: 1.0  
Status: Implementation tracking baseline

## 1. Status Legend

- `implemented` = field is currently collected and exposed
- `partial` = field exists but is incomplete or uses placeholder values
- `planned` = not yet implemented

## 2. Platform Capability Matrix

| Category                 | Field Group                                       | Windows .NET Agent | Linux Go Agent   | Direct REST Connector | Notes                                          |
| ------------------------ | ------------------------------------------------- | ------------------ | ---------------- | --------------------- | ---------------------------------------------- |
| Identity                 | hostname, fqdn, IPs, MAC                          | implemented        | implemented      | source-dependent      | Core ingestion normalizes all variants         |
| OS                       | family, name, version, build, kernel              | implemented        | implemented      | source-dependent      | Windows uses WMI; Linux uses OS/proc           |
| Hardware                 | manufacturer, model, serial, CPU, memory          | partial            | partial          | source-dependent      | Manufacturer/serial in Linux remain planned    |
| Disk                     | size, used, free, mount, filesystem               | partial            | partial          | source-dependent      | Device type/health enrichment planned          |
| Network                  | interfaces, IPv4, IPv6, link                      | implemented        | implemented      | source-dependent      | Speed/link detail needs enhancement            |
| Software                 | installed software/packages + version             | implemented        | planned          | source-dependent      | Linux package-manager collectors pending       |
| Updates                  | installed updates/patch IDs                       | implemented        | planned          | source-dependent      | Linux update metadata pending                  |
| Boot                     | last boot and uptime                              | implemented        | implemented      | source-dependent      | Linux uses /proc uptime                        |
| Security Baseline        | firewall/encryption/EDR flags                     | planned            | planned          | source-dependent      | To be added in phase 2                         |
| Certificates             | local cert inventory/expiry                       | planned            | planned          | source-dependent      | Core-side cert lifecycle exists in design      |
| Lifecycle                | EOL/support metadata                              | planned            | planned          | planned               | Added by core enrichment pipeline              |
| Agent Metadata           | collector version, collection time, errors        | implemented        | implemented      | implemented           | Required for data quality scoring              |
| Virtualization Placement | hypervisor, cluster, datastore, VM power state    | source-dependent   | source-dependent | planned               | vCenter, Prism, OpenStack, KVM connector track |
| Cloud Metadata           | account/subscription, region, instance type, tags | source-dependent   | source-dependent | planned               | Azure and AWS connector track                  |

## 3. Required Fields Coverage (Current)

| Required Group     | Windows .NET | Linux Go | Gap                                  |
| ------------------ | ------------ | -------- | ------------------------------------ |
| Host identity      | yes          | yes      | none                                 |
| OS details         | yes          | yes      | none                                 |
| CPU and memory     | yes          | yes      | memory enrichment precision on Linux |
| Disk usage         | yes          | yes      | device-level health/type             |
| Network addresses  | yes          | yes      | interface role classification        |
| Installed software | yes          | no       | Linux package collector              |
| Installed updates  | yes          | no       | Linux update collector               |
| Boot and uptime    | yes          | yes      | none                                 |
| Agent metadata     | yes          | yes      | none                                 |

## 4. Direct REST Connector Coverage Model

Each direct REST connector must provide a mapping document:

1. Source endpoint(s) and auth method.
2. Source fields to canonical schema fields.
3. Confidence and fallback rules per field.
4. Last successful sync and partial failure behavior.

Minimum connector output requirements:

- `schemaVersion`
- `host.hostname` and one stable identity attribute
- `host.os` object if available
- `agent` metadata block (collector identity and collection time)

## 5. Immediate Engineering Backlog

### 5.1 Linux Agent (Go)

1. Add package inventory collector for dpkg/rpm/zypper/apk.
2. Add installed update collector and pending update count.
3. Add richer hardware details (vendor/serial where available).

### 5.2 Windows Agent (.NET)

1. Add disk health/type enrichment via WMI mappings.
2. Add security baseline collectors (firewall, Defender status).
3. Add certificate inventory export from local machine stores.

### 5.3 Core Connector Framework

1. Implement source-type abstraction for REST connectors.
2. Add per-connector mapping validators.
3. Persist connector confidence score per field group.
4. Add provider connector modules for vCenter, Prism, OpenStack, KVM, Azure, and AWS.
5. Add identity correlation keys to merge API-only and agent-based snapshots.

## 6. Definition of Done per Field Group

A field group is considered complete when:

1. It is collected on both Windows and Linux agents.
2. It is represented in canonical schema output.
3. It is validated by ingestion pipeline checks.
4. It is queryable in reporting endpoints.
5. It has test coverage for at least one success and one failure path.
