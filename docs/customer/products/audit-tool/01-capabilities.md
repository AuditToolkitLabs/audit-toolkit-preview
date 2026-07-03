# Audit Admin Toolkit — Capabilities

A scannable summary of what the Audit Admin Toolkit can do, grouped by capability area. Availability follows the standard taxonomy: **Available** (production-supported), **Partial** (scope-limited), **Beta/Best-effort** (known constraints), **Planned** (roadmap). For full detail see the Feature Guide and Capability Matrix.

## Multi-platform auditing

- **Linux** — 100+ security checks across all major distributions, covering CIS Benchmarks and custom scripts.
- **Windows Server** — 80+ checks aligned to CIS, STIG, and custom scripts.
- **Hypervisors** — 40+ virtualisation-security checks for VMware, Hyper-V, Proxmox, KVM/libvirt, Nutanix AHV, and Xen/XCP-ng.
- **Network devices** — 30+ checks for firewalls and switches.
- **Audit domains** — platform hardening (accounts, passwords, permissions, services, firewall, patching), web applications (SSL/TLS, security headers, cookies, CORS), data and storage (encryption at rest, backup verification, NFS/SMB shares), and network (open ports, service enumeration, segmentation).

## Audit execution

- **On-demand** — run audits immediately for ad-hoc checks.
- **Scheduled** — cron-based recurring audits for continuous compliance.
- **Differential** — compare current state against a saved baseline to detect change and regressions.
- **Parallel** — concurrent multi-server, fleet-wide audits.
- **Least-privilege execution** — wrapper-based elevation on Linux and JEA on Windows.

## Web dashboard and results

- **Main dashboard** — 12 customisable widget types including compliance score, trend analysis, server health grid, recent audits, and alert timeline.
- **Results viewer** — group by category, filter by severity, search, drill down to check evidence, and export to PDF, Excel, JSON, and CSV.
- **Server fleet view** — grid, list, and map views with status indicators for connectivity, last audit, and compliance percentage.

## Server and credential management

- **Registration** — connect targets over SSH (key or password), WinRM (HTTPS), or a lightweight agent for air-gapped environments.
- **Server groups** — organise by environment, location, or custom tags; apply audit policies, reporting, permission inheritance, and maintenance windows at group level.
- **Credential security** — Fernet (AES-256) encryption at rest, just-in-time retrieval, rotation reminders, SSH key management, and secret scanning for exposed credentials.

## Compliance and reporting

- **Report types** — executive summary, technical detail, differential, trend analysis, and evidence packages for auditors.
- **Framework coverage** — CIS Benchmarks (95%+), NIST 800-53 (80%+), SOC 2 (70%+), PCI-DSS (60%+), HIPAA (50%+).
- **Compliance mapping** — automatic mapping of audit checks to controls, with evidence references.
- **Scheduled reports** — daily, weekly, monthly, or custom-cron delivery to email, Slack, Teams, or webhook, with configurable filters and retention.
- **Evidence collection** — timestamps, execution logs, configuration snapshots, optional screen captures, digital signatures, and chain-of-custody metadata.

## Remediation

- **Gated fix scripts** — a large library of pre-built, operator-reviewed remediation scripts spanning user and access, file permissions, network security, service hardening, patch management, encryption, and logging.
- **Workflow** — identify, review, preview (dry-run), apply, then verify by re-running the audit.
- **Controls** — dry-run preview, rollback support, batch remediation, and custom scripts.

## Interactive terminal

- **Web-based access** — SSH shell to Linux and PowerShell remoting to Windows, in-browser.
- **Security controls** — SuperAdmin role, MFA re-verification, command blacklisting, rate limiting, and audit logging.
- **Session recording** — full I/O capture with real-time replay, command search, and export for compliance evidence.
- **Additional** — SFTP file transfer and multi-tab sessions.

## Storage and backup

- **Storage backends** — Local, NFS, SMB/CIFS, and S3 for reports and data.
- **Automated backups** — database, configuration, report archive, and credential vault.
- **Recovery** — point-in-time, full, and selective restore.
- **Retention** — configurable per data type (audit results, terminal sessions, reports, logs).

## Asset discovery and vulnerability

- **Asset discovery** — network and host discovery with IP-range scanning, port discovery, service fingerprinting, and auto-registration of discovered assets. Business metadata can be attached to assets.
- **CVE correlation** — CVE matching for software versions with CVSS scoring, exploitability metrics, and patch tracking (Beta/Best-effort in synced surfaces).
- **KEV tracking and posture evaluation** — visibility on discovered assets (Beta/Best-effort).

## API and integrations

- **REST API** — 850+ endpoints across authentication, servers and groups, audits and results, reports and compliance, scheduling, integrations, and admin; API-key and JWT session authentication.
- **Webhooks** — real-time notifications for audit completion, critical findings, connectivity changes, job status, and authentication events.
- **SIEM export** — Wazuh, Splunk, Elastic, QRadar, Azure Sentinel, Graylog, and Datadog.
- **Ticketing** — ServiceNow (incident creation, CMDB sync) and Jira (issue creation, workflow triggers).
- **Chat** — Slack and Microsoft Teams notifications and commands.
- **External ingest** — connector normalisation, external-source registration, and push ingest of findings and assets.

## Authentication and security

- **Authentication methods** — local, LDAP/Active Directory, Microsoft Entra ID (OIDC/SAML), Okta OIDC, and API key.
- **MFA** — TOTP with QR enrolment, backup codes, and enforcement for admin roles.
- **RBAC** — five roles (Viewer, Operator, Analyst, Admin, SuperAdmin) with 25+ permissions.
- **Platform controls** — session management, account lockout, password policy, IP allowlist, and comprehensive audit logging. The toolkit itself is graded A+ (100/100) against OWASP standards.

## Advanced features

- **Developer Script Studio** — an in-browser IDE (Monaco editor) for authoring, validating, and testing audit scripts, with real-time linting (ShellCheck, PSScriptAnalyzer, Pylint/Bandit), a 50+ template library, compliance-mapping tools, a sandboxed test runner, and Git version control. Requires Analyst role or higher.
- **Maintenance windows** — schedule periods that suppress audits and alerts.
- **Data merge and unified inventory** — cross-database consolidation, deduplication, and a single pane of glass.
- **Real-time monitoring** — Server-Sent Events for live audit updates.

## Hypervisor auditing

- **Hypervisor Agent** — deployed directly on the hypervisor, auto-detects the platform (Proxmox, KVM, XCP-ng, Nutanix AHV on Linux; ESXi via BusyBox POSIX sh), registers over HTTPS, and pushes results via outbound polling — no inbound ports required. Includes a heartbeat and command-dispatch daemon plus key rotation.
