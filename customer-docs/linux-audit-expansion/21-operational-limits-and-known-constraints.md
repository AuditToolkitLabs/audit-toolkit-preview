# 21. Operational Limits and Known Constraints

| Field | Value |
| --- | --- |
| Document version | 1.0 |
| Last updated | 2026-05-01 |
| Product | AuditToolkit Linux Security Lite |

---

## 21.1 Supported distribution versions

The following distribution versions are validated in CI on every release:

| Distribution | Validated versions | Support status |
| --- | --- | --- |
| Ubuntu | 22.04 LTS, 24.04 LTS | Fully supported |
| Debian | 11 (Bullseye), 12 (Bookworm) | Fully supported |
| RHEL / AlmaLinux / Rocky Linux | 8, 9 | Fully supported |
| Fedora | 39, 40, 41 | Fully supported |
| openSUSE Leap | 15.5, 15.6 | Supported |
| Alpine Linux | 3.19, 3.20 | Supported (OpenRC shims) |
| Arch Linux | Rolling (current) | Supported |
| Void Linux | Rolling (glibc) | Supported |
| Gentoo Linux | Stable (systemd and OpenRC) | Supported |

Distributions not in this list may work but are not validated in CI.
Checks on unsupported distributions produce additional `[SKIP]` results
where package manager or service manager shims are absent.

## 21.2 Privilege-level impact on coverage

| Execution privilege | Typical coverage score | Affected check categories |
| --- | --- | --- |
| Root (`sudo -i` or direct) | 90–100 | None skipped due to privilege. |
| Sudo (broad rules) | 80–95 | Minor gaps in kernel parameter and sysctl checks. |
| Sudo (limited rules) | 60–80 | Gaps in firewall, service, and log-directory checks. |
| Unprivileged | 40–60 | Significant gaps; most hardening checks skip. |

A coverage score below 60 should not be treated as a meaningful posture
assessment. Review and extend sudo rules or run as root.

## 21.3 Performance characteristics

| Metric | Typical value | Notes |
| --- | --- | --- |
| Full `--auto` run duration | 60–180 seconds | Depends on installed package count and distro. |
| Platform baseline only | 15–45 seconds | Fastest meaningful run. |
| JSON report file size | 50–500 KB | Depends on installed package inventory size. |
| Disk I/O during run | Minimal | Read-only access to /etc, /proc, /sys, package databases. |
| CPU impact | Low | Single-threaded; well below 5% on modern hardware. |
| Memory usage | < 50 MB | Bash process stack plus subprocess spawning. |

## 21.4 Known limitations

| Limitation | Affected scenarios | Workaround / status |
| --- | --- | --- |
| Alpine/OpenRC service listing | `--domain network` and `--domain automation` may produce extra `[SKIP]` results on Alpine. | Use `is_openrc` branch in affected checks. Tracked for improvement in a future release. |
| Void Linux runit service checks | Some service-state checks are `[SKIP]` on Void due to runit differences. | Manual review of runit service directory. |
| No remote / SSH-based auditing | The toolkit audits only the local host. | Run on each host individually or via configuration management. Remote execution is on the roadmap. |
| No Windows or macOS support | The toolkit is Linux-only by design. | No workaround; by design. |
| No auto-remediation | The toolkit reports findings only; it does not fix them. | By design (read-only). Remediation scripts are a roadmap item. |
| Package CVE mapping depth | CVE data is derived from package manager metadata; depth varies by distro and metadata quality. | Supplement with a dedicated vulnerability scanner for deep CVE analysis. |
| Concurrent fleet runs | No built-in fleet coordination. Concurrent runs on many hosts share no state. | Orchestrate via Ansible, Salt, or similar; reports are independent per-host files. |
| Report schema version | Schema v1.0 is current. Consumers must use permissive JSON parsing (ignore unknown fields) to remain forward-compatible. | Consumer tooling should not hard-fail on unexpected fields. |

## 21.5 Out-of-scope capabilities

The following are explicitly not provided by this tool:

- Web-based management interface or multi-host dashboard.
- Centralised findings database or CMDB integration (reports are per-host
  JSON files; aggregation is left to the customer's SIEM).
- User authentication, access control, or multi-tenancy.
- Automated remediation of any finding.
- SLA-backed monitoring or alerting.
- Network or cloud infrastructure auditing.
- Application-layer (web app, API) security testing.
