# Complete Feature Guide

**Version:** 1.0.3
**Last Updated:** February 16, 2026

This comprehensive guide covers all features and capabilities of the Audit Admin Toolkit, including the new Developer Script Studio.

---

## Table of Contents

1. [Core Audit Capabilities](#1-core-audit-capabilities)
2. [Web Dashboard](#2-web-dashboard)
3. [Server Management](#3-server-management)
4. [Compliance & Reporting](#4-compliance-reporting)
5. [Interactive Terminal](#5-interactive-terminal)
6. [Remediation System](#6-remediation-system)
7. [Storage & Backup](#7-storage-backup)
8. [API & Integrations](#8-api-integrations)
9. [Authentication & Security](#9-authentication-security)
10. [Advanced Features](#10-advanced-features)

---

## Capability Status Taxonomy

- **Available** — production-supported and operationally documented
- **Partial** — available with scope/surface limitations
- **Beta/Best-effort** — available with known constraints
- **Planned** — roadmap only

---

## 1. Core Audit Capabilities

### 1.1 Multi-Platform Support

The toolkit supports comprehensive security auditing across multiple platforms:

| Platform                      | Audit Types          | Coverage                       |
| ----------------------------- | -------------------- | ------------------------------ |
| Linux (All Major Distros)     | 100+ security checks | CIS Benchmarks, custom scripts |
| Windows Server                | 80+ security checks  | CIS, STIG, custom scripts      |
| Hypervisors (VMware, Hyper-V) | 40+ checks           | Virtualization security        |
| Network Devices               | 30+ checks           | Firewalls, switches            |

### 1.2 Audit Categories

**Platform Audits:**

- User account security
- Password policies
- File permissions
- Service hardening
- Network configuration
- Firewall rules
- Patch management

**Web Application Audits:**

- SSL/TLS configuration
- HTTP security headers
- Cookie security
- CORS policies

**Data / Storage Audits:**

- Encryption at rest
- Backup verification
- Access controls
- NFS/SMB share security

**Network Audits:**

- Open ports detection
- Service enumeration
- Firewall rule analysis
- Network segmentation

### 1.3 Audit Execution Modes

| Mode             | Description                 | Use Case               |
| ---------------- | --------------------------- | ---------------------- |
| **On-Demand**    | Run audits immediately      | Ad-hoc security checks |
| **Scheduled**    | Cron-based recurring audits | Continuous compliance  |
| **Differential** | Compare against baseline    | Change detection       |
| **Parallel**     | Multi-server concurrent     | Fleet-wide audits      |

---

## 2. Web Dashboard

### 2.1 Main Dashboard

The dashboard provides real-time visibility into your security posture:

**Key Widgets:**

- **Compliance Score Overview** - Aggregate pass/fail/warn metrics
- **Trend Analysis** - Historical compliance tracking
- **Server Health Grid** - At-a-glance status of all servers
- **Recent Audits** - Latest audit results with quick actions
- **Alert Timeline** - Critical findings requiring attention

### 2.2 Results Viewer

Comprehensive audit result analysis:

- **Grouped by Category** - Filter by audit domain
- **Severity Filtering** - Focus on Critical/High/Medium/Low
- **Search & Filter** - Find specific checks or servers
- **Drill-Down** - Click to see check details and evidence
- **Export Options** - PDF, Excel, JSON, CSV formats

### 2.3 Server Fleet View

Manage all monitored servers:

- **Grid/List/Map Views** - Multiple visualization options
- **Server Groups** - Organize by environment, location, or custom tags
- **Bulk Actions** - Run audits on multiple servers
- **Status Indicators** - Online/offline, last audit date, compliance %

### 2.4 Compliance Dashboard

Track compliance against multiple frameworks:

| Framework      | Coverage | Features                       |
| -------------- | -------- | ------------------------------ |
| CIS Benchmarks | 95%+     | Level 1 & 2, automated mapping |
| NIST 800-53    | 80%+     | Control family tracking        |
| SOC 2          | 70%+     | Trust services criteria        |
| PCI-DSS        | 60%+     | Requirement mapping            |
| HIPAA          | 50%+     | Safeguard tracking             |

---

## 3. Server Management

### 3.1 Server Registration

**Supported Connection Methods:**

- **SSH** - Key-based or password authentication
- **WinRM** - Windows Remote Management (HTTPS)
- **Agent-based** - Lightweight agent for air-gapped environments

**Registration Process:**

1. Navigate to Servers → Add Server
2. Enter hostname/IP and select OS type
3. Configure credentials (stored encrypted)
4. Test connection
5. Run initial audit

### 3.2 Server Groups

Organize servers for efficient management:

```
Production Environment
├── Web Servers (5 servers)
├── Database Servers (3 servers)
└── Application Servers (8 servers)

Development Environment
├── Dev Servers (4 servers)
└── CI/CD (2 servers)
```

**Group Features:**

- Apply audit policies to groups
- Group-wide reporting
- Permission inheritance
- Maintenance window scheduling

### 3.3 Credentials Management

Secure credential storage with:

- Fernet (AES-256) encryption at rest
- Just-in-time credential retrieval
- Credential rotation reminders
- SSH key management
- Secret scanning for exposed credentials

---

## 4. Compliance & Reporting

### 4.1 Report Types

| Report                  | Description                       | Formats         |
| ----------------------- | --------------------------------- | --------------- |
| **Executive Summary**   | High-level compliance overview    | PDF, HTML       |
| **Technical Detail**    | Full audit results with evidence  | PDF, Excel      |
| **Differential Report** | Changes since last audit          | PDF, JSON       |
| **Trend Analysis**      | Historical compliance trends      | PDF with charts |
| **Evidence Package**    | Compliance artifacts for auditors | ZIP archive     |

### 4.2 Scheduled Reports

Automate report generation and delivery:

**Configuration Options:**

- Frequency: Daily, Weekly, Monthly, Custom cron
- Recipients: Email, Slack, Teams, Webhook
- Filters: Server groups, severity levels, frameworks
- Retention: Configure report storage duration

### 4.3 Evidence Collection

For compliance audits, generate evidence packages containing:

- Audit timestamps and execution logs
- Configuration snapshots
- Screen captures (optional)
- Digital signatures
- Chain of custody metadata

### 4.4 Compliance Mapping

Automatic mapping of audit checks to compliance controls:

```
[CIS Ubuntu 22.04 - 1.1.1.1] Ensure mounting of cramfs is disabled
├── Maps to: CIS Benchmark - Level 1
├── Maps to: NIST 800-53 AC-3
└── Evidence: /proc/modules, /etc/modprobe.d/
```

---

## 5. Interactive Terminal

### 5.1 Overview

Secure web-based terminal access for server administration:

**Security Controls:**

- SuperAdmin role required
- Secondary authentication (MFA re-verify)
- Full session recording
- Command blacklisting
- Rate limiting
- Audit logging

### 5.2 Terminal Features

| Feature               | Description                            |
| --------------------- | -------------------------------------- |
| **SSH Terminal**      | Full SSH shell access to Linux servers |
| **WinRM PowerShell**  | PowerShell remoting to Windows servers |
| **Session Recording** | Complete I/O capture for playback      |
| **File Transfer**     | SFTP-based upload/download             |
| **Multi-Tab**         | Multiple terminals simultaneously      |

### 5.3 Session Playback

All terminal sessions are recorded and can be:

- Replayed in real-time
- Searched for specific commands
- Exported for compliance evidence
- Reviewed for incident investigation

### 5.4 Command Restrictions

Configurable command blocklist prevents dangerous operations:

```json
{
  "blocked_commands": ["rm -rf /", "dd if=/dev/zero", "mkfs", ":(){:|:&};:", "shutdown", "reboot"]
}
```

---

## 6. Remediation System

### 6.1 Overview

Automated and guided remediation for audit findings:

**Capabilities:**

- 320+ pre-built remediation scripts
- Platform-specific implementations
- Dry-run mode for preview
- Rollback support
- Batch remediation

### 6.2 Remediation Workflow

1. **Identify** - View failed audit checks
2. **Review** - Examine remediation script
3. **Preview** - Run in dry-run mode
4. **Apply** - Execute remediation
5. **Verify** - Re-run audit to confirm fix

### 6.3 Remediation Categories

| Category          | Scripts   | Platforms      |
| ----------------- | --------- | -------------- |
| User & Access     | 45        | Linux, Windows |
| File Permissions  | 38        | Linux, Windows |
| Network Security  | 42        | Linux, Windows |
| Service Hardening | 55        | Linux, Windows |
| Patch Management  | 28        | Linux, Windows |
| Encryption        | 22        | Linux, Windows |
| Logging & Audit   | 35        | Linux, Windows |
| Custom Scripts    | Unlimited | Any            |

### 6.4 Custom Remediation

Create custom remediation scripts:

```bash
#!/bin/bash
# Custom remediation: Enable audit logging
# Rollback: auditctl -D && systemctl stop auditd

auditctl -e 1
systemctl enable auditd
systemctl start auditd
```

---

## 7. Storage & Backup

### 7.1 Storage Backends

The toolkit supports multiple storage backends for reports and data:

| Backend   | Use Case                    | Features                        |
| --------- | --------------------------- | ------------------------------- |
| **Local** | Single-instance deployments | File-based, simple setup        |
| **NFS**   | Multi-instance, on-premise  | Shared storage, POSIX           |
| **SMB**   | Windows environments        | CIFS, AD integration            |
| **S3**    | Cloud deployments           | Scalable, versioning, lifecycle |

### 7.2 Configuration

**S3 Backend Example:**

```python
STORAGE_BACKEND = 's3'
AWS_BUCKET_NAME = 'audit-toolkit-storage'
AWS_ACCESS_KEY_ID = 'AKIA...'
AWS_SECRET_ACCESS_KEY = '...'
AWS_REGION = 'us-east-1'
```

**NFS Backend Example:**

```python
STORAGE_BACKEND = 'nfs'
NFS_MOUNT_POINT = '/mnt/audit-storage'
```

### 7.3 Backup & Recovery

**Automated Backups:**

- Database backups (PostgreSQL/SQLite)
- Configuration backups
- Report archive backups
- Credential vault backups

**Recovery Options:**

- Point-in-time recovery
- Full restore
- Selective restore (reports, configs, etc.)

### 7.4 Data Retention

Configure retention policies:

```json
{
  "audit_results": "365 days",
  "terminal_sessions": "90 days",
  "reports": "730 days",
  "logs": "90 days"
}
```

---

## 8. API & Integrations

### 8.1 REST API

Comprehensive REST API with 850+ endpoints:

**API Categories:**

- Authentication & Users
- Servers & Groups
- Audits & Results
- Reports & Compliance
- Scheduling
- Integrations
- Admin & Settings

**Authentication:**

```bash
# API Key authentication
curl -H "X-API-Key: your-api-key" https://audit-tool/api/v2/servers

# Session authentication (JWT)
curl -H "Authorization: Bearer <token>" https://audit-tool/api/v2/servers
```

### 8.2 Webhook Notifications

Configure webhooks for real-time notifications:

**Supported Events:**

- Audit completion (pass/fail/warning)
- Critical findings detected
- Server connectivity changes
- Scheduled job status
- User authentication events

### 8.3 SIEM Integration

Export security events to SIEM platforms:

| SIEM           | Integration Method                   |
| -------------- | ------------------------------------ |
| Wazuh          | Syslog or Webhook                    |
| Splunk         | HEC (HTTP Event Collector)           |
| Elastic        | Elasticsearch API                    |
| QRadar         | Syslog CEF format                    |
| Azure Sentinel | Log Analytics API                    |
| Graylog        | Syslog/GELF-compatible forwarding    |
| Datadog        | Webhook/syslog-compatible forwarding |

### 8.4 Ticketing Integration

Auto-create tickets for findings:

| Platform   | Features                          |
| ---------- | --------------------------------- |
| ServiceNow | Incident creation, CMDB sync      |
| Jira       | Issue creation, workflow triggers |

Connector and external-source ingest flows are also available through:

- `/api/admin/siem` for SIEM validation, connection tests, and environment templates
- `/api/external-sources` for producer registration, authentication state, and DLQ replay
- `/api/ingest/v1` for push ingest of findings and assets
- `/api/reporting/connectors/*` for connector contract validation and reference ingest health

### 8.5 Chat Integration

| Platform        | Features                                  |
| --------------- | ----------------------------------------- |
| Slack           | Audit notifications, interactive commands |
| Microsoft Teams | Adaptive cards, bot commands              |

---

## 9. Authentication & Security

### 9.1 Authentication Methods

| Method       | Description                           |
| ------------ | ------------------------------------- |
| **Local**    | Username/password with secure hashing |
| **LDAP/AD**  | Active Directory integration          |
| **Entra ID** | Azure AD OIDC/SAML                    |
| **Okta**     | Okta OIDC integration                 |
| **API Key**  | Machine-to-machine authentication     |

### 9.2 Multi-Factor Authentication

TOTP-based MFA (Google Authenticator, Microsoft Authenticator):

- QR code enrollment
- 10 backup codes (one-time use)
- Enforce MFA for admin roles
- MFA bypass for emergency access

### 9.3 Role-Based Access Control

| Role           | Capabilities                                    |
| -------------- | ----------------------------------------------- |
| **Viewer**     | View results, run reports                       |
| **Operator**   | Run audits, manage servers                      |
| **Analyst**    | All operator + compliance mapping               |
| **Admin**      | All analyst + user management                   |
| **SuperAdmin** | Full access including terminal, system settings |

### 9.4 Security Features

| Feature            | Description                         |
| ------------------ | ----------------------------------- |
| Session Management | Configurable timeout, forced logout |
| Account Lockout    | 5 attempts, 30-minute lockout       |
| Password Policy    | 12+ chars, complexity, history      |
| IP Allowlist       | Restrict access by IP range         |
| Audit Logging      | All actions logged with user/IP     |

---

## 10. Advanced Features

### 10.1 Differential Auditing

Compare current state against baseline:

```bash
# Create baseline
POST /api/v2/audits/baseline
{ "server_id": 1, "name": "Q1-2026-baseline" }

# Run differential audit
POST /api/v2/audits/differential
{ "server_id": 1, "baseline_id": "Q1-2026-baseline" }
```

**Output shows:**

- New failures (regressions)
- Resolved failures (improvements)
- Unchanged status

### 10.2 CVE Database Integration

Vulnerability correlation with CVE data:

- Automatic CVE matching for software versions
- CVSS scoring integration
- Exploitability metrics
- Patch availability tracking

### 10.3 Asset Discovery

Network reconnaissance integration:

- IP range scanning
- Port discovery
- Service fingerprinting
- Auto-registration of discovered assets

### 10.4 Developer Script Studio

**New in 1.0.3** - Full-featured script development environment integrated into the web console.

#### Overview

Developer Script Studio provides a professional-grade IDE for creating, editing, and testing security audit scripts directly in your browser. Access it at `/script-studio` after logging in (requires Analyst role or higher).

#### Core Features

**Visual Script Editor:**

- Monaco code editor (same engine as VS Code)
- Syntax highlighting for Bash, PowerShell, Python, and YAML
- IntelliSense autocomplete for common audit patterns
- Multi-tab editing with unsaved change indicators
- Dark/light theme support

**Real-Time Validation:**

- ShellCheck integration for Bash scripts
- PSScriptAnalyzer for PowerShell
- Pylint/Bandit for Python
- Instant feedback with inline error markers
- Severity classification (error, warning, info)

**Template Library:**

- 50+ pre-built audit script templates
- Categories: CIS Benchmarks, STIG, Custom Compliance
- Template customization wizard
- Community template sharing (Operations Pack add-on licence required)

**Compliance Mapping Tool:**

- Auto-map scripts to compliance controls
- Supported frameworks: CIS v8, NIST 800-53, PCI-DSS v4.0, ISO 27001, SOC 2
- Visual control coverage matrix
- Gap analysis reporting

**Test Runner:**

- Sandboxed execution environment
- Mock system state for safe testing
- Output comparison with expected results
- Performance profiling
- Cross-platform compatibility testing

**Version Control:**

- Git integration for script history
- Diff viewer for comparing versions
- Branch management
- Pull request workflow support (Operations Pack add-on licence required)

#### API Endpoints

| Endpoint                            | Method | Description                     |
| ----------------------------------- | ------ | ------------------------------- |
| `/api/script-studio/templates`      | GET    | List available templates        |
| `/api/script-studio/templates/<id>` | GET    | Get template content            |
| `/api/script-studio/validate`       | POST   | Validate script syntax          |
| `/api/script-studio/test`           | POST   | Test script in sandbox          |
| `/api/script-studio/save`           | POST   | Save script to audits directory |
| `/api/script-studio/compliance-map` | GET    | Get control mappings            |
| `/api/script-studio/export`         | POST   | Export script package           |

#### Example: Creating a Custom Audit

```bash
# 1. Open Script Studio at /script-studio
# 2. Click "New Script" → Select "Bash Audit Template"
# 3. Customize the template:

#!/bin/bash
set -euo pipefail

# Source audit framework libraries
. "$(dirname "$0")/../../lib/common.sh"
. "$(dirname "$0")/../../lib/distro.sh"

section "Custom Security Check"

# Check for specific vulnerability
if [ -f /etc/vulnerable-config ]; then
    register_check "VulnerableConfig" FAIL "Found vulnerable configuration"
else
    register_check "VulnerableConfig" PASS "No vulnerable configuration"
fi

print_summary
exit "$EXIT_CODE"

# 4. Click "Validate" to check syntax
# 5. Click "Test" to run in sandbox
# 6. Click "Save" to deploy to audits/custom/
```

#### Security

- **Sandboxed Execution:** Scripts run in isolated containers
- **No System Modification:** Read-only access during testing
- **Role Restriction:** Analyst role or higher required
- **Audit Trail:** All script changes logged
- **Code Review Workflow:** Optional approval process for production scripts

#### Platform Support

| Platform | Script Types       | Validation Tools         |
| -------- | ------------------ | ------------------------ |
| Linux    | Bash, Python       | ShellCheck, Pylint       |
| Windows  | PowerShell, Python | PSScriptAnalyzer, Pylint |
| macOS    | Bash, Python, Zsh  | ShellCheck, Pylint       |

### 10.5 Maintenance Windows

Schedule maintenance periods:

```json
{
  "name": "Weekly Patching",
  "server_group": "production",
  "schedule": "0 2 * * SUN",
  "duration": "4h",
  "skip_audits": true,
  "skip_alerts": true
}
```

### 10.6 Data Merge & Unified Inventory

Consolidate data from multiple sources:

- Cross-database inventory unification
- Deduplication
- Relationship mapping
- Single pane of glass view

### 10.7 Real-Time Monitoring

Server-Sent Events (SSE) for live updates:

```javascript
const evtSource = new EventSource("/api/v2/stream/audits");
evtSource.onmessage = (event) => {
  console.log("Audit update:", JSON.parse(event.data));
};
```

---

## Appendix A: System Requirements

### Minimum Requirements

| Component | Requirement                                  |
| --------- | -------------------------------------------- |
| CPU       | 2 cores                                      |
| RAM       | 4 GB                                         |
| Storage   | 20 GB                                        |
| OS        | Ubuntu 20.04+, RHEL 8+, Windows Server 2019+ |
| Python    | 3.9+                                         |
| Database  | SQLite (dev), PostgreSQL 13+ (prod)          |

### Recommended Production

| Component | Requirement                    |
| --------- | ------------------------------ |
| CPU       | 8+ cores                       |
| RAM       | 16+ GB                         |
| Storage   | 100+ GB SSD                    |
| Database  | PostgreSQL 15 with replication |
| Cache     | Redis 7+                       |

---

## Appendix B: Deployment Options

| Option             | Description                                 | Best For                                            |
| ------------------ | ------------------------------------------- | --------------------------------------------------- |
| **Docker Compose** | Development/test/staging container workflow | Non-production validation                           |
| **Kubernetes**     | Preview/best-effort orchestration path      | Controlled trials with explicit validation evidence |
| **Native Install** | Official production deployment path         | Air-gapped and regulated environments               |
| **Windows MSI**    | Windows installer package                   | Windows-only environments                           |
| **Debian Package** | apt-based installation                      | Debian/Ubuntu servers                               |

The server ships as native `.deb` (primary) and `.rpm` (secondary) packages; see the Deployment Guide for the supported install path.

---

## Appendix C: Quick Reference

### Common API Endpoints

| Action          | Endpoint                      | Method |
| --------------- | ----------------------------- | ------ |
| List servers    | `/api/v2/servers`             | GET    |
| Run audit       | `/api/v2/audits`              | POST   |
| Get results     | `/api/v2/audits/{id}/results` | GET    |
| Generate report | `/api/v2/reports`             | POST   |
| List users      | `/api/v2/admin/users`         | GET    |

### Default Ports

| Service        | Port           |
| -------------- | -------------- |
| Web UI (HTTP)  | 5000           |
| Web UI (HTTPS) | 5443           |
| API            | Same as Web UI |
| PostgreSQL     | 5432           |
| Redis          | 6379           |

---

_For detailed API documentation, see the API Guide._
_For installation instructions, see the Deployment Guide._
_For security details, see the Security Overview._
