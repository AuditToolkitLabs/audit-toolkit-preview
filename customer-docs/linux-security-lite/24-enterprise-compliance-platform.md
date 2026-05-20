# AuditToolkit Enterprise Compliance Platform

## Overview

AuditToolkit Linux Security Lite is an enterprise-grade compliance audit platform designed for organizations that need continuous, evidence-based security control verification across mixed Linux infrastructure.

Unlike point-in-time scanners, AuditToolkit provides:

- **Framework-aligned controls** — 27 required security controls mapped to CIS Benchmarks, NIST SP 800-53, PCI-DSS v4.0, and DISA STIG
- **Centralized management** (Professional+) — Deploy, schedule, and report on up to 150 agents (Professional) or unlimited (Enterprise) from a single Core Server
- **Compliance attestation** (Professional+) — Generate framework-aligned compliance reports for audit readiness
- **Automation integration** (Enterprise) — REST API and webhooks for SIEM, ticketing, and orchestration platforms

---

## Competitive Differentiation

### Why AuditToolkit over Nessus, Qualys, or Tenable

| Feature | AuditToolkit | Nessus | Qualys | Tenable |
| --- | --- | --- | --- | --- |
| **Compliance frameworks** | CIS, NIST, PCI-DSS, STIG | ✅ | ✅ | ✅ |
| **Multi-distro support** | ✅ All Linux variants | ❌ Limited | ❌ Limited | ❌ Limited |
| **Standalone deployment** | ✅ No cloud required | ❌ Cloud-first | ❌ Cloud-only | ❌ Cloud-centric |
| **Air-gap friendly** | ✅ Full offline operation | ❌ License check required | ❌ No offline mode | ❌ No offline mode |
| **Remediation scripts** | ✅ Fix automation included | ❌ Reports only | ❌ Reports only | ❌ Reports only |
| **Per-agent pricing** | £5–£5.33/agent/year | £45–£60/agent/year | £25–£40/agent/year | £40–£50/agent/year |
| **Custom audit creation** | ✅ Enterprise+ | ❌ | ⚠️ Limited plugins | ⚠️ Limited |
| **On-prem management** | ✅ Professional+ | ❌ | ❌ | ❌ |
| **No mandatory telemetry** | ✅ | ❌ | ❌ | ❌ |

### AuditToolkit Value Proposition

**For budget-conscious teams**: Enterprise-grade compliance at startup pricing (£799/yr for 150 servers).

**For regulated industries (Financial, Healthcare, Government)**: Auditable, air-gap-friendly, full remediation automation, and framework attestation in a single binary.

**For multinational ops**: Alpine/Ubuntu/Debian/RHEL/Fedora/Arch support = single tool across entire infrastructure; Nessus/Qualys require distro-specific plugins.

---

## Enterprise Capabilities by Tier

### Enterprise operator interfaces (implemented)

Enterprise features are available through all of the following surfaces:

- Web pages: `/enterprise/compliance`, `/enterprise/trending`, `/enterprise/webhooks`, `/enterprise/siem-export`
- API routes: `/api/reports/*`, `/api/webhooks*`, `/api/export/siem`, `/api/trends*`, `/api/core/custom-scripts/sync`
- CLI commands: `cli.py compliance`, `cli.py siem-export`, `cli.py webhooks`, `cli.py trends`, `cli.py core-sync-scripts`

All interfaces are license-gated and require authenticated access in web mode.

### Community Tier (Free)

Ideal for **DevOps teams, startups, and development environments**.

| Feature | Included |
| --- | --- |
| **Audit library** | ✅ All 27 required controls + optional extensions (platform, web, data, apps, storage, network, automation) |
| **Multi-distro** | ✅ Alpine, Ubuntu, Debian, RHEL, Fedora, Arch, CentOS, Rocky, openSUSE |
| **Deployment** | ✅ Single-server standalone, no cloud required |
| **Reporting** | ✅ HTML output, local storage, 30-day retention |
| **Scheduling** | ✅ Up to 3 scheduled audits |
| **License cost** | ✅ Free forever |

**Best for:** Compliance-aware teams who run their own infrastructure and want to understand their security posture locally.

---

### Professional Tier (£799/yr)

Ideal for **compliance teams, MSPs, and mid-market enterprises** with 20–150 Linux servers.

Includes everything in Community, plus:

| Feature | Benefit |
| --- | --- |
| **Centralized Core Server** | Manage and coordinate audits across up to 150 agents from a single dashboard |
| **Auto script updates** | Audit library automatically patched when security issues discovered—no manual updates needed |
| **Unlimited schedules** | Run audits hourly, daily, weekly—unlimited frequency across all agents |
| **Unlimited retention** | Findings stored indefinitely on Core Server; analyze trends across months/years |
| **Compliance attestation** | Generate CIS Benchmark, NIST SP 800-53, and PCI-DSS compliance reports for audit readiness |
| **Support** | 48-hour email support, bug fixes, feature requests |

**Value drivers:**

- **Compliance readiness** — Export audit results with framework mappings to demonstrate control implementation
- **Continuous monitoring** — Baseline comparisons show whether security posture improved or degraded since last audit
- **Incident response** — Identify when/how controls changed, trace findings to configuration decisions
- **Patch management** — Auto-updated audit library ensures new vulnerabilities are caught immediately

**Best for:** Organizations with established compliance requirements (SOC2, ISO 27001, PCI-DSS) that need evidence of continuous control verification.

---

### Enterprise Tier (£4,999/yr)

Ideal for **large enterprises, regulated industries, and security-first organizations** with unlimited Linux infrastructure.

Includes everything in Professional, plus:

| Feature | Benefit |
| --- | --- |
| **Unlimited agents** | Manage all 1,000+ servers under a single license; volume pricing makes per-server cost negligible |
| **Full REST API** | Integrate directly with SIEM (Splunk, Microsoft Sentinel, Elastic), ticketing (Jira, ServiceNow), and orchestration platforms |
| **Webhook notifications** | Trigger immediate alerts to Teams, Slack, custom webhooks when critical findings detected |
| **SIEM export** | CEF/syslog format for real-time ingestion into Security Operations Center |
| **Core custom script sync** | Pull Core-managed proprietary scripts to Lite agents for execution under central governance |
| **Priority support** | 4-hour response SLA, call-based troubleshooting, dedicated account manager |
| **Compliance + automation** | Combine compliance reporting with automated remediation workflows |

### Core-managed custom scripts (Enterprise)

Enterprise supports a pull-only custom script model on Lite agents:

- Author and approve scripts in the Core platform.
- Lite agents pull scripts from Core via configured API path.
- Pulled scripts are stored in the configured local sync subdirectory and
  become selectable in normal audit workflows.
- Local script authoring/upload in Lite remains out of scope by design.

**Value drivers:**

- **SOC integration** — Findings flow directly into your security operations tools; reduce mean-time-to-detection (MTTD)
- **Compliance automation** — Generate CIS/NIST reports on schedule; embed in annual compliance certifications
- **Multi-framework support** — Single audit runs against CIS, NIST, PCI-DSS, DISA STIG simultaneously
- **Regulatory confidence** — Demonstrate continuous control verification to auditors; evidence of ongoing compliance posture management

**Best for:** Large enterprises, financial institutions, healthcare organizations, and government agencies with formal compliance programs and security operations centers.

---

## Control Coverage & Framework Alignment

### Required Controls (27 baseline)

These controls run automatically in `--preset security` mode and cover the minimum hardening baseline for any Linux server:

| Control ID | Description | CIS | NIST | PCI-DSS | DISA STIG |
| --- | --- | --- | --- | --- | --- |
| PLT-001 | OS package updates, auto-update configuration | 4.1, 4.2 | SI-2, SI-3 | 6.2 | V-204450 |
| PLT-002 | Essential services (SSH, cron, NTP, syslog) | 5.1, 8.1 | AC-2, SI-2 | 2.2 | V-204396 |
| PLT-003 | OS baseline, kernel version, login banners | 4.2, 6.1 | SI-3, SC-39 | 2.2 | V-204397 |
| ACC-001 | SSH hardening: ciphers, key exchange, timeout | 5.1, 6.2 | AC-2, AC-6, SC-13 | 2.2, 7.1 | V-238200 |
| NET-001 | Active firewall, rules configured | 4.2, 12.3 | SC-7 | 1.2, 1.4 | V-204402 |
| ADV-001 | Kernel hardening: IP forwarding, SYN cookies, ASLR | 3.1–3.3 | SC-7, SC-8 | 1.4 | V-204399 |
| ADV-002 | Sudo configuration, NOPASSWD prevention | 5.3 | AC-6 | 7.1, 7.2 | V-204429 |
| ADV-003 | User account hygiene, UID 0 accounts, empty passwords | 6.2 | AC-2, AC-6 | 8.1 | V-204430 |
| ADV-004 | Shadow password suite, password aging | 5.5.1 | IA-5 | 8.2 | V-204431 |
| ADV-005 | PAM password quality, complexity requirements | 5.4.1 | IA-5 | 8.3 | V-204432 |
| ADV-006 | PAM account lockout, pam_faillock configuration | 5.4.2 | AC-7 | 8.1.6 | V-204433 |
| ADV-007 | Auditd daemon, audit rules for critical events | 4.1 | AU-2, AU-6, AU-9 | 10.2, 10.3 | V-204434 |

...and 15 additional recommended controls covering firewall rules, file permissions, MAC (SELinux/AppArmor), logging, services, and more. See [HARDENING-CONTROL-BASELINE.md](../docs/HARDENING-CONTROL-BASELINE.md) for full details.

### Optional Controls

Enterprise audits available via `--domain` or `--match`:

- **Web servers:** Nginx, Apache (configuration, TLS, headers, authentication)
- **Databases:** MySQL, PostgreSQL (access control, encryption, backups)
- **Container runtimes:** Docker, Podman (image security, runtime config)
- **Automation tools:** CI/CD (GitLab Runner, Jenkins), orchestration
- **SIEM/EDR agents:** Splunk, Elastic, CrowdStrike, Sentinel
- **Distro-specific:** Alpine, Debian, Ubuntu, RHEL (family-specific best practices)

---

## Compliance Attestation

### Generated Reports

Professional+ tiers can generate framework-aligned compliance attestation reports:

#### CIS Linux Distribution Benchmark Report

- Control mapping: Shows which audits verify each CIS control
- Compliance status: Pass/Fail/Not Applicable per control
- Remediation guidance: Links to fix scripts and hardening documentation
- Export format: PDF, HTML, JSON

#### NIST SP 800-53 Alignment Report

- Maps 27 required controls to NIST IA (Identification & Authentication), SC (System & Communications Protection), AC (Access Control), AU (Audit & Accountability)
- Evidence of continuous control verification
- Audit trail: When each control was verified, results, trend analysis

#### PCI-DSS v4.0 Compliance Report

- Controls 2.1–2.7 (system hardening), 6.2 (security testing), 8.1–8.7 (access control), 10.2–10.3 (logging)
- Compliance status: In-scope systems and control verification
- Remediation timeline: Track fixes from audit detection to verification

#### DISA STIG Compliance Report

- Severity levels: Critical (V-2xxxxx), High, Medium, Low
- Controls verified on each scan
- Deviation tracking: Systems not meeting STIG baseline

---

## Integration Examples

### Professional Tier (Core Server)

```bash
# Deploy agent, connect to Core Server, get centralized reporting
export CORE_SERVER_URL="https://auditcore.yourcompany.com"
export API_KEY="your-api-key-here"

# Agent auto-registers with Core Server
bash install.sh

# Core Server dashboard shows:
# - 150 agents, compliance status by framework
# - Trends: compliance improving/degrading
# - CIS Benchmark scorecard: X% of controls passing
```

### Enterprise Tier (SIEM Integration)

```bash
# Webhook notification on critical findings
POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL
{
  "text": "Critical: SSH weak ciphers detected on prod-db-01",
  "severity": "critical",
  "control_id": "ACC-001",
  "cis_control": "5.1",
  "remediation": "https://auditcore.yourcompany.com/fix/acc-001"
}

# SIEM ingest (CEF format)
CEF:0|AuditToolkit|Linux Agent|5.6.1|ACC-001|SSH Weak Ciphers|10|
  src=10.0.1.45 host=prod-db-01 msg=Weak SSH ciphers detected
  dvc=prod-db-01 cs1=CIS_5.1 cs1Label=Framework
```

---

## Pricing & ROI

| Tier | Cost (annual) | Agents | CIS Reports | Core Server | API | Use case |
| --- | --- | --- | --- | --- | --- | --- |
| Community | Free | Unlimited | ❌ | ❌ | ❌ | DevOps, development |
| Professional | £799 | 150 | ✅ | ✅ | ❌ | Mid-market, compliance teams |
| Enterprise | £4,999 | Unlimited | ✅ | ✅ | ✅ | Large enterprises, SOC |

**ROI calculation:**

- Professional: £799 ÷ 150 agents = **£5.33/agent/year** (vs. Nessus ~£50/agent/year, qualys ~£40/agent/year)
- Enterprise: £4,999 ÷ 1,000 agents = **£5/agent/year** (for unlimited infrastructure)

**Compliance attestation value:**

- Annual audit prep time: 40–80 hours (scanning, manual control verification, report generation)
- Professional tier reduces to: ~4 hours (auto-generated CIS/NIST reports)
- **Savings: 36–76 hours/year × £150/hour = £5,400–£11,400 per year**

---

## Support & SLAs

| Tier | Support | Response | Coverage |
| --- | --- | --- | --- |
| Community | Community forums, GitHub issues | Best-effort | Business hours |
| Professional | Email support | 48 hours | 9am–5pm GMT Mon–Fri |
| Enterprise | Phone + email, account manager | 4 hours | 24/5 (24h/5d/week) |

---

## Getting Started

### Community Tier

```bash
git clone https://github.com/AuditToolkitLabs/AuditToolkit-Linux-Security-Lite.git
cd AuditToolkit-Linux-Security-Lite
bash install.sh
```

### Professional / Enterprise Tier

1. Contact [sales@audittoolkitlabs.com](mailto:sales@audittoolkitlabs.com)
2. Provide:
   - Number of agents
   - Compliance frameworks required (CIS, NIST, PCI-DSS, DISA STIG)
   - Preferred deployment (on-prem Core Server, SaaS)
3. Receive license key and Core Server setup guide
4. Deploy agents with license activation

---

## Frequently Asked Questions

**Q: What happens if I outgrow my agent limit?**
A: Professional tier (150 agents) automatically upgrades to Enterprise (unlimited) if you exceed 150. No service interruption.

**Q: Can I mix tiers (some agents Professional, some Community)?**
A: Yes. License tier is per-agent; you can have mixed deployments.

**Q: Does the tool modify systems?**
A: No. AuditToolkit is read-only. For remediation, see [fix/](../fix/README.md) for optional remediation scripts (Professional+ only).

**Q: Do you offer custom compliance frameworks?**
A: Yes. Enterprise customers can author custom scripts in Core Server and
sync them to Lite agents for execution.

**Q: What if I need remediation automation?**
A: Enterprise customers can combine AuditToolkit with enterprise automation tools (Ansible, Puppet) via the REST API.

---

## Additional Resources

- [HARDENING-CONTROL-BASELINE.md](../docs/HARDENING-CONTROL-BASELINE.md) — Full control catalogue with framework mappings
- [Keygen License Portal](https://app.keygen.sh) — Manage license keys, track agent usage
- [API Documentation](../docs/14-api-usage-guide.md) — REST API reference for custom integrations
- [Support Portal](https://support.audittoolkitlabs.com) — Professional+ support, documentation, roadmap
