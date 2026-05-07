# 2. Service Overview and Scope

*ISO/IEC 20000-1 clauses 4.1–4.4, 8.2*

## 2.1 Service purpose

The Security Audit Toolkit is a production-ready, enterprise-grade
security auditing platform. It audits Linux servers, Windows systems,
and hypervisors for security misconfigurations, compliance violations,
and best-practice deviations. The business outcomes typically supported
are:

- Continuous security posture assessment across your server estate.
- Evidence collection for internal and external compliance audits.
- Detection and reporting of misconfigurations against CIS Benchmarks
  and NIST SP 800-53.
- Patch and vulnerability posture reporting.
- Automated scheduling of recurring audits with alerting.
- Fleet-wide agent deployment and centralised result aggregation.

## 2.2 In-scope components

The service, as delivered, includes:

| Component | Description |
| --- | --- |
| Flask web application | Administration console, audit dashboards, reporting UI, user and role management, API key issuance. |
| REST API | 390+ endpoints used by agents, connectors, and customer-side automation. OpenAPI specification included. |
| Linux audit scripts | 138 Bash scripts covering CIS Benchmarks, network, storage, platform and application hardening. |
| Windows audit scripts | 147 PowerShell scripts covering Windows Server, Active Directory, IIS and workstation hardening. |
| Hypervisor audit scripts | 12 scripts covering ESXi/vCenter, Proxmox and KVM/libvirt. |
| Hypervisor agent package | Platform-aware package for on-host hypervisor auditing (Proxmox, KVM/libvirt, XCP-ng/Xen, Nutanix AHV, ESXi) with outbound HTTPS heartbeat and command polling. |
| Fleet Agent (formerly Managed Agent) | Java-based agent suitable for centrally coordinated deployment; supports poll/push workflows via the Fleet Agent coordinator service. |
| Standalone Agent (formerly Lightweight Agent) | Same agent binary configured for direct HTTPS push without the Fleet Agent coordinator service. |
| External push ingest API | Machine-to-machine ingest endpoints for findings and assets (`/api/ingest/v1/*`) with producer registration, contract headers, and dead-letter replay. |
| Fleet Agent coordinator service (formerly Managed Agent Server) | Coordinator for multi-host agent deployments, scheduling, and result aggregation. |
| Developer Script Studio | In-browser editor for writing, testing and deploying custom audit scripts. |
| Scanner workbench | Active-discovery sub-tool for network and host scanning; supports configurable scan profiles, live progress, multi-format report export (Business / Technical / Combined), and a built-in demo mode for training and testing. Requires explicit authorisation before use against any target. |
| Scheduler | Celery-based task engine for scheduled audit runs and alert delivery. |

Supported platforms at the time of writing:

- **Application host:** Linux (Ubuntu LTS, RHEL/CentOS-derived,
  Debian, Fedora); Python 3.12+.
- **Database:** PostgreSQL 15 or later for production; SQLite is
  available for evaluation only.
- **Audit targets (Linux):** Ubuntu, Debian, RHEL, CentOS, Fedora,
  openSUSE, Arch, Alpine (systemd and OpenRC).
- **Audit targets (Windows):** Windows 10 / 11, Windows Server
  2019 / 2022 / 2025.
- **Hypervisors:** VMware ESXi / vCenter, Proxmox VE, KVM / libvirt,
  Nutanix Prism.

Agent architecture summary:

- **Standalone Agent (formerly Lightweight Agent):** local execution with direct result push to core APIs.
- **Fleet Agent (formerly Managed Agent):** central policy/control with host-side poll and push.
- **Hypervisor agent:** platform-aware deployment package for ESXi, Proxmox,
  KVM/libvirt, XCP-ng/Xen, and Nutanix AHV.

Terminology transition note:

- Older references to **Lightweight Agent** map to **Standalone Agent**.
- Older references to **Managed Agent** map to **Fleet Agent**.

## 2.3 Out-of-scope components

The following are **not** part of the supplied service unless covered
by a separate written agreement:

- Hardware or cloud virtual machines on which the application runs.
- Operating-system support, patching, and backup of the host server.
- Network infrastructure, firewalls, and load balancers.
- Customer-specific connectors, custom audit scripts, or bespoke
  integrations beyond what the Developer Script Studio provides.
- The security posture of the endpoints being audited — the toolkit
  identifies findings; remediation is the customer's responsibility.
- Production deployment beyond the Community tier — that requires
  the appropriate paid licence mode (see Appendix C in section 12).

## 2.4 Service boundaries

| Activity | Customer | Service provider |
| --- | --- | --- |
| Provide host hardware or cloud VM | ✓ | |
| Install and patch the host operating system | ✓ | |
| Install and configure the application | ✓ | guidance only |
| Provision the database and take database backups | ✓ | |
| Monitor application availability | ✓ | |
| Deploy and maintain agents on audit targets | ✓ | guidance only |
| Supply application bug fixes and security patches | | ✓ |
| Provide product documentation | | ✓ |
| Manage user accounts inside the application | ✓ | |
| Define audit schedules and scope | ✓ | |
| Remediate security findings reported by audits | ✓ | |

## 2.5 Deployment models

| Model | Description |
| --- | --- |
| **Linux server** | DEB or RPM package on Ubuntu/Debian or RHEL-derived host. Recommended for production. |
| **Windows server** | MSI installer on Windows Server 2019 / 2022. |
| **VM appliance** | Pre-built OVA/OVF virtual machine image with the application pre-installed. |
| **Git / source install** | Clone the repository and run `install.sh`. Suitable for evaluation and custom paths. |
| **Container** | Docker Compose stack for evaluation and development. Not the primary release method for production. |
