# Storage Intelligence Platform Overview

## Purpose

The Storage Intelligence Platform provides distributed file inventory,
classification, and change-tracking for enterprise storage estates. Lightweight
agents run directly on each storage node and publish scan results to a
self-hosted central control plane. No external services are required, and no
inventory data leaves your environment.

## Primary Outcomes

The platform supports:

- File inventory and classification across heterogeneous storage nodes.
- Incremental, checkpointed scanning so only changed files are re-examined
  after the first baseline scan.
- A central control plane with web UI, job scheduler, and real-time inventory.
- Classification breakdown, top-extension analytics, and 14-day job outcome
  trend charts in the dashboard.
- CSV and JSON export of full inventory and job history for downstream SIEM,
  ITSM, or reporting platforms.
- Configurable SMTP and webhook alerting for agent-offline, scan-job-failure,
  and licence-expiry events.

## Supported Storage Nodes

Scanner agents deploy on:

- RHEL 8/9, Rocky Linux 9, and AlmaLinux 9.
- Ubuntu 22.04/24.04 and Debian 12.
- Lustre, GPFS, and ZFS (OpenZFS) filesystems.
- Windows Server.

## Architecture

| Layer          | Component                              | Purpose                                                             |
| -------------- | -------------------------------------- | ------------------------------------------------------------------- |
| Storage node   | Scanner Agent                          | Runs locally on each node, scans the filesystem, and reports up.    |
| Control plane  | FastAPI service + PostgreSQL           | Receives results, stores inventory, schedules jobs, serves the UI.  |
| Web UI         | Dashboard · Jobs · Inventory · Settings | Operator interface for monitoring, scheduling, and configuration.   |
| Outputs        | CSV / JSON exports, SMTP / webhook alerts | Downstream delivery of inventory and operational events.         |

Agents always initiate the connection to the control plane over standard
HTTPS. The control plane never pulls data from agents, which keeps network
segmentation and firewall rules simple. Agents continue scanning even when the
server is temporarily unreachable, holding results until the connection
resumes.

## Operating Properties

- **Incremental by design.** The first scan of a node establishes a baseline.
  Every subsequent scan only processes new, modified, or deleted files. Large
  NAS, Lustre, and ZFS filesystems complete incrementally in minutes with no
  measurable I/O impact on production workloads.
- **Agents survive server outages.** Scanner agents never block on server
  availability. If the control plane is unreachable, scan jobs complete locally
  and results are held until the connection resumes.
- **Air-gap and offline ready.** Docker images for both server and agent are
  provided as loadable tarballs. The agent auto-update mechanism can serve
  packages from a local server path with SHA-256 verification, with no external
  package repository required during operation.

## Service Boundaries

The customer is responsible for the storage nodes, operating systems, control
plane host, network connectivity, licence activation, and any downstream use of
inventory data.

AuditToolkitLabs provides product releases, bug fixes, security advisories,
documentation, and support guidance for confirmed product issues.

For deployment formats and licensing tiers, see
[Deployment & Licensing](01-deployment-and-licensing.md).
