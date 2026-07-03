# Storage Intelligence Platform — Capabilities

This page summarises what the Storage Intelligence Platform can do, grouped by
capability area. It is the quick reference for "what does this tool actually
cover?" For the full detail on the classification engine, see the
**Feature Guide**.

## Inventory and discovery

- **Distributed scanning.** Lightweight agents scan file systems locally on each
  Linux or Windows host and push results to the control plane. All communication
  is outbound; there is no inbound access to agents.
- **Full and incremental scans.** The first scan of a node is always a full
  baseline. Every subsequent scan runs incrementally and processes only files
  that changed since the last run — keeping I/O impact and network usage low.
- **Targeted scans.** An extension filter restricts a scan to specific file
  types (for example `.sh .py .pem`). Non-matching files are skipped entirely,
  and every match is tagged `targeted_match` for easy reporting.
- **Software inventory (discovery only).** Detects installed binaries, libraries,
  scripts, and packages from file extension, path pattern, and file name, and
  records a source (`system`, `package_manager`, `custom`, `unknown`) with a
  confidence score. No CVE lookup or vulnerability analysis is performed.
- **Execution controls.** Scan windows, per-second file-rate limiting, upload
  throttling, batch sizing, and a per-tenant concurrency guard let operators cap
  the impact of scans on storage and network without stopping them.

## Classification

- **Two-stage engine.** Every file is classified by extension lookup (379
  built-in extensions across 17 categories) and, where the extension is missing
  or unrecognised, by magic-byte probing against 21 binary signatures (HDF5,
  NetCDF, FITS, DICOM, QCOW2, and more).
- **Category and sub-type.** Files resolve to a category (Scripts,
  Configuration, Data, Database, Scientific, Genomics, Medical, Documents,
  Media, Security, Executables, Archives, DiskImage, Backup, Logs, Fonts, and
  more) and a specific sub-type.
- **Research and HPC coverage.** Dedicated support for Genomics
  (FASTA/FASTQ/BAM/VCF), Medical (DICOM/NIfTI/EEG), Scientific
  (FITS/GRIB/ROOT/GROMACS), and machine-learning model formats.
- **Tagging.** Additive tags (`high_value`, `sensitive`, `script`,
  `research_data`, `bioinformatics`, `medical_imaging`, `executable`,
  `new_file_type`, and others) allow fast filtering without joining on category
  strings.
- **Structured extraction.** Files in the `full_metadata` tier receive
  lightweight header extraction (shebangs, JSON/YAML keys, notebook kernels,
  credential types, FASTA/FASTQ identifiers, and so on).
- **Custom file type registry.** Administrators can add organisation-specific
  extension overrides via the UI, the API, or agent YAML (for air-gapped
  deployments). Custom entries override built-in ones at scan time.

## Change-tracking

- **Incremental state model.** Each agent maintains a local SQLite state
  database of every file it has seen. Only changes are reprocessed, and hard
  limits on state size and tracked-file count trigger an automatic full-baseline
  reset when breached.
- **Software drift detection.** Each scan submits the full current software
  inventory; the server compares against the previous submission to surface new,
  changed, and removed items.
- **Scheduling.** A control-plane scheduler runs scans on a configurable
  cadence. Missed runs during downtime are skipped by design — the next
  incremental scan captures everything that changed in the interim.
- **Policy engine.** YAML-defined rules classify files and match on attributes
  (including software source), tagging records and raising alert events in the
  audit log.

## Reporting and outputs

- **Dashboard analytics.** Classification breakdowns, top-extension analytics,
  and job-outcome trend charts.
- **Inventory and job queries.** Filter inventory and jobs through the web UI,
  the `scanner-cli` command-line tool, or the REST API — including tag-based
  queries such as `GET /inventory?tag=targeted_match`.
- **Exports.** CSV and JSON export of the full inventory and job history for
  downstream SIEM, ITSM, and reporting platforms.
- **Alerting.** Configurable SMTP and webhook notifications for agent-offline,
  scan-job-failure, and licence-expiry events.
- **Audit logging.** An append-only log records every mutating API action, with
  retention controls.

## Governance and platform

- **Multi-tenant isolation.** Every record carries a `tenant_id`; tenant data is
  isolated at the query level, with admins able to manage across tenants.
- **Authentication and RBAC.** Static API keys for agents and JWT sessions for
  users, with admin / operator / viewer roles.
- **Release lifecycle.** Certified releases cover install, upgrade, and
  rollback, with SHA-256 checksums and multi-gate certification.

## What is out of scope

- **No CVE matching.** The software inventory layer is for discovery and drift
  detection only; vulnerability analysis requires external tooling.
- **No inbound agent access.** Agents never accept inbound connections, and
  there is no agent-to-agent communication.
