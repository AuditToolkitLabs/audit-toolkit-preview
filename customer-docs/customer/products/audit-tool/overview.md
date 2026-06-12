# Audit-Tool Overview

## Purpose

Audit-Tool is the full Security Audit Toolkit platform for self-hosted audit,
compliance, discovery, reporting, agent coordination, and automation workflows.
It is designed for customers who need a central web application, REST API,
managed audit execution, scheduled runs, and evidence collection across mixed
Linux, Windows, and hypervisor estates.

## Primary Outcomes

Audit-Tool supports:

- Continuous security posture assessment across server estates.
- Evidence collection for internal and external compliance audits.
- Misconfiguration reporting against hardening and best-practice expectations.
- Patch and vulnerability posture visibility.
- Recurring audit scheduling and alerting.
- Agent deployment and central result aggregation.
- Customer API and integration automation.

## In-Scope Components

| Component | Customer-facing role |
| --- | --- |
| Web application | Administration console, dashboards, reporting, user and role management, API key handling. |
| REST API | Machine and customer automation access for agents, connectors, and integrations. |
| Linux audit scripts | Read-only Linux security and hardening checks. |
| Windows audit scripts | Windows Server, workstation, Active Directory, and IIS audit checks. |
| Hypervisor audit scripts | ESXi, vCenter, Proxmox, KVM/libvirt, and related hypervisor checks. |
| Toolkit Agent direct mode | Local execution with direct HTTPS result push. |
| Toolkit Agent coordinated mode | Central policy and command polling with host-side execution. |
| Hypervisor agent | Platform-aware hypervisor audit package. |
| External ingest API | Machine-to-machine ingest for findings and assets. |
| Scheduler | Recurring audit runs, coordination, and alert delivery. |
| Script Studio | Customer-side script authoring, testing, and deployment. |
| Scanner workbench | Authorized network and host scanning workspace with report export. |

## Supported Deployment Models

Product releases may support:

- Linux DEB or RPM package deployment.
- Windows MSI deployment.
- VM appliance deployment.
- Source or Git install for evaluation and custom paths.
- Container-based development or staging workflows.

Production deployment should use the supported package or appliance path for
the release. Container or source installs should be treated as evaluation or
custom deployment modes unless a release explicitly states otherwise.

## Customer Responsibilities

Customers provide and operate the host, operating system, database, backups,
network access, TLS certificates, audit target authorization, user accounts,
agent deployment, audit scheduling, and remediation of findings.

AuditToolkitLabs provides product releases, bug fixes, security advisories,
documentation, and support guidance for confirmed product issues.

## Product-Specific Follow-Up Pages

Planned product pages include:

- Linux installation.
- Windows installation.
- Agent deployment.
- API integration.
- Authentication integration.
- SIEM and webhook integration.
- Backup restore and disaster recovery.
- Certificate and key lifecycle.
- First-login recovery.
- Operational limits.
