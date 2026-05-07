# 12. Appendices and Reference

*ISO/IEC 20000-1 clause 7.5*

## Appendix A — Glossary

| Term | Meaning |
| --- | --- |
| Agent | Program installed on a target host that runs audit scripts and pushes results to the application server. Available as Standalone Agent and Fleet Agent variants. |
| API key | Credential used by agents, automation pipelines, and API integrations to authenticate to the REST API. Issued and revoked by an administrator. |
| Audit log | Append-only record of security-relevant events stored in the application database. |
| Audit profile | A named set of audit scripts that are run together. Pre-built profiles include *CIS Level 1*, *CIS Level 2*, *Full*, and *Quick*. |
| Audit script | A single Bash or PowerShell script that checks one security domain. Scripts produce PASS / WARN / FAIL / SKIP output. |
| Developer Script Studio | In-browser editor for writing, testing and deploying custom audit scripts without leaving the application. |
| EULA | End-User Licence Agreement — the contract governing use of the software. Acceptance is recorded at first sign-in. |
| Fleet | All the audit targets registered in a single installation. |
| JEA | Just Enough Administration — a Windows PowerShell constrained endpoint used to run audits with least privilege on Windows targets. |
| Fleet Agent | A JRE agent coordinated by the Fleet Agent coordinator service; supports centralised deployment, scheduling, and result push. Formerly called Managed Agent. |
| Fleet Agent coordinator service | Optional coordinator service for managing a fleet of JRE agents. Formerly called Managed Agent Server. |
| Orchestrator | The meta-runner component that discovers, filters, and runs multiple audit scripts sequentially or in parallel. |
| Standalone Agent | A JRE agent that operates independently, pushing results directly to the application server's API without the Fleet Agent coordinator service. Formerly called Lightweight Agent. |
| Target | A server, workstation, or hypervisor registered in the application for auditing. |
| Workspace | Logical data partition inside an installation. Multi-workspace scope depends on your active licensing mode and any enabled commercial add-ons. |

## Appendix B — Architecture overview

A typical on-premises deployment:

```text
[browser] ── HTTPS ──▶ [reverse proxy (Nginx)] ── HTTP ──▶ [Flask app]
                                                               │
                                                               ├── PostgreSQL
                                                               ├── Celery worker(s)
                                                               └── Redis (broker)

[JRE agents on targets] ── HTTPS ──▶ [reverse proxy] ──▶ [Flask app]
           │
           └── SSH / WinRM ──▶ [audit scripts on target]
```

For detailed architecture diagrams see `docs/07-architecture.md`.

## Appendix C — Tenancy and licensing tiers

The toolkit ships with five licensing modes: one permanent free tier,
one time-limited trial, and three paid tiers. Enterprise functionality
is delivered through add-on packs instead of a separate Enterprise tier.

| Mode | `LICENSE_TIER` | Server limit | Annual price | Intended use |
| --- | --- | ---: | --- | --- |
| **Community** | `community` | 25 | Free | Personal use, evaluation, small organisations. Perpetually free. |
| **Trial** | `trial` | 150 | Free (14 days) | Evaluation with full Professional features; requires email registration; watermarked exports; machine-bound. |
| **Starter** | `starter` | 50 | £549 | Small business; basic email support. |
| **Professional** | `professional` | 150 | £1,099 | Small-to-medium business; 48-hour email support. |
| **Business** | `business` | 500 | £2,499 | Mid-market enterprise; priority email support. |

### Commercial add-on packs

Two commercial add-ons extend base paid subscriptions:

| Add-on pack | Typical capabilities |
| --- | --- |
| **Enterprise Integrations Pack** | Enterprise connector and integration capabilities for expanded identity, workflow, and automation scenarios. |
| **Advanced Operations Pack** | Advanced hypervisor modules, hypervisor CIS/compliance packs, bulk operations, and hypervisor scheduling workflows. |

Contact [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com) to
confirm pack eligibility, pricing, and entitlement scope.

> **Pricing notice.** Published prices are in GBP and subject to
> change. Commercial add-on availability and entitlement scope may vary
> by subscription and onboarding profile. For current terms see
> `LICENSE-EULA.md` or contact
> [License@audittoolkitlabs.com](mailto:License@audittoolkitlabs.com).
> **Community tier note:** The 25-server limit is a free, permanent
> entitlement — not a trial. It exists to ensure stability and to
> encourage thorough evaluation before scaling.

**What counts as a "server"?** Any unique endpoint you audit, identified
by hostname or IP address: Linux servers, Windows servers or
workstations, hypervisor hosts. VMs running on a hypervisor count
separately from the hypervisor host itself.

## Appendix D — Information to gather before raising a support case

When contacting the Service Provider, include:

- The product version (visible in the administrator console footer or
  in the `VERSION` file at the repository root).
- The licence mode currently configured and any enabled add-on packs.
- The host operating system and version.
- The database type and version.
- The reverse proxy in use (Nginx, Apache, IIS, or none).
- A clear description of the symptom and the steps to reproduce it.
- The relevant time window in UTC.
- Application log extracts for that time window (redact sensitive
  values such as credentials or hostnames if required).
- The output of `GET /api/health`.

## Appendix E — CIS and NIST control mapping

A full mapping of audit scripts to CIS Benchmark controls and NIST
SP 800-53 Rev 5 controls is maintained in
`docs/07-cis-nist-compliance-mapping.md`.

## Appendix F — Supported operating systems and platforms

| Category | Supported platforms |
| --- | --- |
| **Application host** | Ubuntu 22.04 LTS, Debian 12, RHEL 9, CentOS Stream 9, Fedora 40, Windows Server 2019 / 2022 |
| **Linux audit targets** | Ubuntu, Debian, RHEL, CentOS, Fedora, openSUSE, Arch Linux, Alpine Linux (systemd and OpenRC) |
| **Windows audit targets** | Windows 10, Windows 11, Windows Server 2019 / 2022 / 2025 |
| **Hypervisors** | VMware ESXi / vCenter 7+, Proxmox VE 7+, KVM / libvirt, Nutanix Prism |
| **Databases** | PostgreSQL 15+ (production); SQLite 3 (evaluation only) |
