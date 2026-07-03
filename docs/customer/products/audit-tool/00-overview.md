# Audit Admin Toolkit — Overview

The Audit Admin Toolkit is a self-hosted security audit, compliance, discovery, and reporting platform. It provides cross-platform assessment and centralised evidence and reporting through a single web management interface, giving security and operations teams one place to audit their estate, track compliance, and produce audit-ready evidence.

## What it is

At its core the toolkit runs an extensive library of security audit checks against Linux, Windows, cloud, and hypervisor targets, aggregates the results, and turns them into dashboards, compliance mappings, and reports. It combines a large audit and remediation script library with a full web console, a REST API, and enterprise authentication.

| Metric | Value |
| --- | --- |
| Audit checks | 1,000+ across Linux, Windows and hypervisor targets |
| Remediation scripts | 800+ gated fix scripts (Linux, Windows, hypervisors) |
| API endpoints | 850+ |
| Security score | 100/100 (A+), OWASP compliant |
| SIEM integrations | 7 platforms |
| Cloud platforms | 4 (AWS, Azure, GCP, OCI) |
| Hypervisors | 5 (ESXi, Proxmox, KVM, Nutanix, Xen) |
| Compliance frameworks | 5 (PCI-DSS, SOC 2, ISO 27001, NIST, CIS) |
| Deployment modes | 4 (SSH/WinRM, JRE Agent Standalone, JRE Agent Managed, Direct Agent API) |

## Who it is for

The toolkit is built for security teams, system administrators, compliance and audit functions, and managed service providers who need to assess and evidence the security posture of a mixed fleet — on-premise, cloud, and virtualised — from a single console. It suits air-gapped and regulated environments as well as centrally managed agent fleets.

## Primary outcomes

- **Continuous compliance** — measure servers against CIS, NIST, SOC 2, PCI-DSS, and other frameworks, with automatic mapping of checks to controls.
- **Audit-ready evidence** — generate executive, technical, differential, and trend reports plus evidence packages for auditors.
- **Guided remediation** — move from finding to fix with a large library of gated, operator-reviewed remediation scripts.
- **Estate visibility** — discover, group, and monitor hosts, with trend analysis and differential auditing to catch drift.

## Key components

- **Multi-platform auditing** — Linux (Ubuntu, Debian, RHEL, Fedora, Arch, Alpine, openSUSE and more), Windows (Server 2016+, Windows 10/11), four cloud providers, and five hypervisor platforms.
- **Web management platform** — dashboards with 12 widget types, server and group management, scheduling with maintenance windows, reporting, history and analytics, and a recorded interactive terminal.
- **Remediation system** — gated fix scripts with dry-run preview, rollback, and batch execution.
- **API and integrations** — a comprehensive REST API, webhooks, SIEM export to 7 platforms, ticketing and chat connectors.
- **Enterprise authentication and security** — SSO via LDAP/Active Directory, Microsoft Entra ID and Okta, TOTP MFA, and RBAC with five roles.

## Deployment modes

Choose the connection model that fits your security requirements:

| Mode | Connection | Best for |
| --- | --- | --- |
| SSH/WinRM | Persistent remote access | Full control, real-time execution |
| JRE Agent (Standalone) | HTTPS push (no SSH/WinRM) | High-security and segmented environments |
| JRE Agent (Managed) | HTTPS poll + push | Centralised agent fleet operations |
| Direct Agent API (Lightweight Endpoint) | HTTPS pull to a discovery endpoint | On-demand host discovery and inventory |
| Hypervisor Agent | HTTPS outbound (no inbound ports) | On-hypervisor auditing for Proxmox, KVM, XCP-ng, Nutanix AHV, ESXi |

The server ships as native `.deb` (primary) and `.rpm` (secondary) packages, with a Windows MSI and appliance options; Docker Compose and Kubernetes are provided for non-production and preview use.

## Capability status taxonomy

Capabilities across the documentation use a consistent taxonomy:

- **Available** — production-supported and operationally documented
- **Partial** — available in scope-limited form or only on selected surfaces
- **Beta/Best-effort** — available with known operational constraints
- **Planned** — roadmap only

For a scannable summary of what the toolkit can do, see the Capabilities page. For full detail, see the Feature Guide and Capability Matrix.
