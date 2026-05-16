# CMDB API Data Collection Tool — v1.0.1 Release Documentation

**Release Version:** 1.0.1  
**Release Date:** May 15, 2026  
**Status:** General Availability (Patch Release)

---

## Overview

The CMDB API Data Collection Tool is a comprehensive, API-driven platform for collecting, correlating, and reporting on IT asset, configuration, and security data across on-premises environments.

This release is a patch update to v1.0 GA, addressing critical security hardening and webhook validation fixes discovered post-release. The platform remains a stable production-ready version with enterprise-grade features, integrations, and operational support.

---

## What's Included

### Core Components

- **API Server** — Flask-based REST API for CMDB operations
- **Web UI** — Dashboard and administration interface
- **Managed Agent** — Lightweight collection agent for remote systems (Windows/Linux)
- **Database** — SQLAlchemy ORM with SQLite/PostgreSQL backends
- **Connectors** — Pre-built integration modules for SIEM, ITSM, Service Bus, Event Hubs

### Key Features

| Feature | Details |
| --- | --- |
| **Data Collection** | API-based, agent-based, and manual data ingestion |
| **Integrations** | SIEM, ITSM, SSO/OAuth2, webhooks, Azure service connectors |
| **Security** | RBAC, API key auth, audit logging, TLS 1.2+, encrypted secrets |
| **Reporting** | Risk scoring, CVE correlation, compliance reports (PDF), dashboards |
| **Operations** | Automated backup/restore, certificate management, health monitoring |
| **Documentation** | Complete customer docs, ops runbooks, quick-start guides |

---

## Quick Links

### For Deployment

- [Installation Guide](20-core-server-installation-linux-windows.md) — Step-by-step deployment on Windows/Linux
- [Service Transition & Setup](04-service-transition.md) — Initial configuration and onboarding
- [Backup & Disaster Recovery](24-backup-restore-and-disaster-recovery-runbook.md) — Business continuity procedures

### For Operations

- [Operations & Support Model](07-operations-and-support.md) — Support framework and escalation
- [Change Management](08-change-management.md) — Patch, release, and change procedures
- [Maintenance Runbook](21-maintenance-patching-and-release-runbook.md) — Routine operational tasks

### For Integration

- [Integration Quick Starts](13-integration-quick-starts.md) — Overview of all integration options
- [Authentication Integration](14-quick-start-authentication-integration.md) — SSO/OAuth2 setup
- [SIEM Integration](15-quick-start-siem-integration.md) — Event forwarding and webhook configuration
- [API Consumer Guide](23-api-consumer-and-automation-guide.md) — Programmatic API usage
- [Managed Agent Onboarding](25-managed-agent-server-operations-guide.md) — Agent deployment and management

### For Security & Compliance

- [Security Guide](09-security.md) — Access controls, data protection, encryption
- [Security FAQ](33-security-faq.md) — Common security questions and answers
- [OWASP Security Scorecard](34-owasp-security-scorecard.md) — Compliance posture and findings
- [Detailed Security Assessment](35-detailed-security-assessment.md) — Comprehensive security review
- [Production Security Status Report](37-production-security-status-report.md) — Production-only security and quality evidence
- [Website Security Trust Brief](38-website-security-trust-brief.md) — Short website-ready security messaging
- [Certificate Lifecycle](27-certificate-and-key-lifecycle-runbook.md) — TLS certificate management

### For Administration

- [Administration Guide](06-administration.md) — User management, configuration, settings
- [End-User Guide](05-end-user-guide.md) — Using the web UI and dashboards
- [API Reference](../docs/02-api-specification.md) — Full API specification and endpoints

---

## System Requirements

### Minimum Recommended

| Component | Requirement |
| --- | --- |
| **OS** | Windows Server 2019+ or Linux (Ubuntu 20.04+, CentOS 8+) |
| **CPU** | 4 cores |
| **Memory** | 8 GB RAM |
| **Storage** | 50 GB (SSD recommended) |
| **Python** | 3.9+ (for source deployments) |
| **Database** | PostgreSQL 12+ (recommended for production) or SQLite |

### Network

- Outbound HTTPS (443) for cloud integrations
- Inbound HTTPS (443) for API and web UI
- Optional: Event Hubs or Service Bus connectivity (Azure integrations)

---

## Installation Methods

### Docker (Recommended)

```bash
docker-compose up -d
```

See [Installation Guide](20-core-server-installation-linux-windows.md) for detailed steps.

### Windows MSI Installer

Automated installer available for Windows Server environments.

### Linux Package

RPM and DEB packages available for CentOS/RHEL and Ubuntu/Debian.

### Source Deployment

Manual deployment from source code with Python virtual environment.

---

## Supported Platforms & Integrations

### Data Sources

- Windows event logs and WMI
- Linux syslog and system APIs
- SNMP-capable devices
- REST APIs (via connectors)
- CMDB APIs (ServiceNow, etc.)

### SIEM Platforms

- Splunk
- ArcSight
- QRadar
- Azure Sentinel
- Elastic Security

### ITSM Platforms

- ServiceNow
- Atlassian Jira Service Management
- BMC Remedy
- CA Service Management

### Cloud Integrations

- Microsoft Azure (Event Hubs, Service Bus, Log Analytics)
- AWS (optional via custom connectors)

---

## Licensing

This software is licensed under the **Business Source License 1.1 (BSL 1.1)**.

### Permitted Use

- Non-production evaluation, testing, and development
- Internal IT asset and security data collection
- Use within environments controlled by the Licensee

### Restricted Use

Without a commercial license, the software must NOT be:

- Used in production environments
- Offered as a service or managed service
- Embedded in other products
- Used for resale or OEM purposes
- Operated for third-party benefit

**Commercial production use requires a separate license agreement.**

See [LICENSE-EULA.md](../LICENSE-EULA.md) and [LICENSE](../LICENSE) for full terms.

---

## Support & Documentation

### Documentation Structure

This release includes 35+ customer documentation chapters covering:

1. **Service Overview** — Purpose, scope, and governance
2. **End-User Guide** — Using the application
3. **Administration** — User and system management
4. **Operations** — Running and maintaining the service
5. **Integration** — Connecting to external systems
6. **Security & Compliance** — Hardening and audit procedures
7. **Appendices & Reference** — API, payloads, troubleshooting

### Getting Help

- Refer to [Operations & Support Model](07-operations-and-support.md) for support channels
- Review [Security FAQ](33-security-faq.md) and [Support Engagement Guide](22-support-engagement-guide.md)
- Consult [Appendices](12-appendices.md) for troubleshooting and reference

---

## Release Notes & Version History

For detailed release notes and feature history, see:

- [CHANGELOG.md](CHANGELOG.md) — Complete version history and feature list
- [Release Marketing Details v0.2.6](14-release-marketing-details-v0.2.6.md) — Previous release summary

---

## Upgrading from Previous Versions

If upgrading from v0.2.x:

1. Review [CHANGELOG.md](CHANGELOG.md) for migration notes
2. Follow [Maintenance & Release Runbook](21-maintenance-patching-and-release-runbook.md)
3. Back up your database before upgrading (see [Backup & Recovery](24-backup-restore-and-disaster-recovery-runbook.md))
4. Test in non-production environments first

---

## Getting Started

### 1. Installation

Choose your deployment method and follow [Core Server Installation Guide](20-core-server-installation-linux-windows.md).

### 2. Initial Configuration

Work through [Service Transition & Setup](04-service-transition.md) to configure users, roles, and integrations.

### 3. Data Collection

Set up your first data source using the Web UI or API.

### 4. Integrations

Connect your SIEM, ITSM, or other systems using the relevant [Quick-Start Guide](13-integration-quick-starts.md).

### 5. Ongoing Operations

Follow [Operations & Support Model](07-operations-and-support.md) for regular maintenance and monitoring.

---

## What's New in v1.0

This is the first stable release of the CMDB API Data Collection Tool. Major highlights include:

- **Production-ready** stability and performance
- **Comprehensive integrations** with SIEM, ITSM, and cloud platforms
- **Enterprise security** features (RBAC, encryption, audit logging)
- **Managed agent** for distributed data collection
- **Complete documentation** for all roles and use cases
- **Compliance alignment** with ISO/IEC 20000-1:2018 and OWASP standards

See [CHANGELOG.md](CHANGELOG.md) for the complete feature list and changes.

---

## Feedback & Contributions

For security vulnerabilities, refer to [SECURITY.md](../SECURITY.md).

For other feedback or inquiries, see [Support Engagement Guide](22-support-engagement-guide.md).

---

**Last Updated:** May 13, 2026  
**Status:** General Availability (GA)  
**Prepared for:** Release Repository Distribution
