# Linux Security Lite — Capability Matrix

This catalogue defines the classified security controls in the Linux Security Lite framework. Each row maps a `CONTROL_ID` to its audit script, tier, description, and framework compliance citations (CIS Benchmarks, NIST SP 800-53, PCI DSS, and DISA STIG).

Controls are classified into three tiers:

- **required** — must run with `--preset security`; FAIL results are escalated findings.
- **recommended** — run with `--preset security` after all required controls; FAIL results are advisory findings.
- **optional** — domain-specific audits not included in `--preset security`.

---

## Required controls

These controls are always run first by `--preset security`. They cover the minimum baseline required for any Linux server hardening posture.

| CONTROL_ID | Script Path | Description | CIS | NIST SP 800-53 | PCI DSS | DISA STIG |
| ---------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------ | ----------------------- | ---------- | --------- |
| PLT-001 | `audits/linux/platform/baseline/updates.sh` | OS package update posture: pending upgrades, auto-update configuration, update recency | 4.1, 4.2, 16.11 | SI-2, SI-3 | 6.2 | V-204450 |
| PLT-002 | `audits/linux/platform/baseline/svc-basics.sh` | Essential service state: SSH, cron, NTP, syslog — running and enabled | 4.1, 5.1, 8.1 | AC-2, SI-2 | 2.2 | V-204396 |
| PLT-003 | `audits/linux/platform/baseline/os-baseline-audit.sh` | OS baseline: kernel version, hostname, login banners, core dump, ASLR | 4.2, 6.1 | SI-3, SC-39 | 2.2 | V-204397 |
| ACC-001 | `audits/linux/platform/access/ssh-hardening-audit.sh` | SSH daemon configuration: protocol, ciphers, key exchange, authentication, timeouts | 4.1, 5.1, 6.2, 8.1 | AC-2, AC-6, SC-7, SC-13 | 2.2, 7.1 | V-238200 |
| NET-001 | `audits/linux/network/firewall/firewall-state.sh` | Active firewall presence: ufw/iptables/nftables/firewalld active with rules configured | 4.2, 12.3 | SC-7 | 1.2, 1.4 | V-204402 |
| ADV-001 | `audits/linux/advanced-controls/kernel-hardening-audit.sh` | Kernel sysctl parameters: IP forwarding, ICMP redirects, SYN cookies, ASLR, exec shield | 3.1, 3.2, 3.3 | SC-7, SC-8 | 1.4 | V-204399 |
| ADV-002 | `audits/linux/advanced-controls/sudo-audit.sh` | Sudo configuration: sudoers permissions, NOPASSWD entries, use_pty, logfile, env_reset | 5.3 | AC-6 | 7.1, 7.2 | V-204429 |
| ADV-003 | `audits/linux/advanced-controls/user-account-audit.sh` | User account hygiene: UID 0 accounts, empty passwords, inactive accounts, shell assignments | 6.2 | AC-2, AC-6 | 8.1 | V-204430 |
| ADV-004 | `audits/linux/advanced-controls/shadow-password-audit.sh` | Shadow password suite: password aging, minimum/maximum days, warning period, hashing algorithm | 5.5.1 | IA-5 | 8.2 | V-204431 |
| ADV-005 | `audits/linux/advanced-controls/pam-password-policy-audit.sh` | PAM password quality: complexity requirements, pwquality module, history, minimum length | 5.4.1 | IA-5 | 8.3 | V-204432 |
| ADV-006 | `audits/linux/advanced-controls/pam-account-lockout-audit.sh` | PAM account lockout: pam_faillock/pam_tally2 configuration, lockout threshold and duration | 5.4.2 | AC-7 | 8.1.6 | V-204433 |
| ADV-007 | `audits/linux/advanced-controls/auditd-audit.sh` | Auditd daemon: running, log configuration, disk full action, audit rules for critical events | 4.1 | AU-2, AU-6, AU-9 | 10.2, 10.3 | V-204434 |

---

## Recommended controls

These controls run after required controls in `--preset security`. They provide defence-in-depth coverage that may not apply to every environment.

| CONTROL_ID | Script Path | Description | CIS | NIST SP 800-53 | PCI DSS | DISA STIG |
| ---------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------- | -------------- | ------------ | --------- |
| PLT-010 | `audits/linux/platform/firewall/firewall-ufw-audit.sh` | UFW-specific configuration: default policies, application profiles, rule review | 3.4, 12.3 | SC-7 | 1.2 | — |
| PLT-011 | `audits/linux/platform/firewall/egress-allowlist-audit.sh` | Egress allowlist: outbound rules restrict traffic to known-good destinations | 12.3 | SC-7 | 1.2 | — |
| ACC-010 | `audits/linux/platform/access/suid-sgid-audit.sh` | SUID/SGID binary inventory: deviations from known-good list, home-directory SUID | 6.1.13, 6.1.14 | CM-6, AC-6 | 2.2.4 | V-38497 |
| ACC-011 | `audits/linux/platform/access/world-writable-audit.sh` | World-writable files outside /tmp: sticky bit, writable scripts in PATH | 6.1.12 | CM-6 | 2.2 | V-38498 |
| ACC-012 | `audits/linux/platform/access/log-access-audit.sh` | Log file permissions: /var/log entries readable only by owner/group | 4.2.3 | AU-9 | 10.5 | V-204435 |
| ACC-013 | `audits/linux/platform/access/sensitive-permissions-depth-audit.sh` | High-risk path permissions: /etc/cron\*, /etc/hosts.allow, backup directories | 6.1 | CM-6 | 2.2 | — |
| ADV-010 | `audits/linux/advanced-controls/apparmor-comprehensive-audit.sh` | AppArmor MAC: loaded profiles, enforce mode, unconfined processes | 1.6.1 | SC-39, SI-7 | 6.2 | — |
| ADV-011 | `audits/linux/advanced-controls/selinux-comprehensive-audit.sh` | SELinux MAC: enforcing mode, policy type, unconfined processes, AVC denials | 1.6.2 | SC-39, SI-7 | 6.2 | V-204436 |
| ADV-012 | `audits/linux/advanced-controls/services-hardening-audit.sh` | Unnecessary service removal: X11, avahi, cups, inetd, NIS, rsh, talk, telnet | 2.1, 2.2 | CM-7 | 2.2.1 | V-204437 |
| ADV-013 | `audits/linux/advanced-controls/logging-audit.sh` | Logging infrastructure: rsyslog/syslog-ng configuration, remote forwarding, log rotation | 4.2.1, 4.2.2 | AU-2, AU-3 | 10.2, 10.3 | V-204438 |
| ADV-014 | `audits/linux/advanced-controls/file-permissions-audit.sh` | Critical file permissions: /etc/passwd, /etc/shadow, /etc/group, cron directories | 6.1.2–6.1.9 | CM-6 | 2.2 | V-204439 |
| ADV-015 | `audits/linux/advanced-controls/system-file-permissions-audit.sh` | System-wide permission audit: unowned files, world-writable files, no-user files | 6.1.11–6.1.14 | CM-6 | 2.2 | — |
| ADV-016 | `audits/linux/advanced-controls/file-integrity-audit.sh` | File integrity monitoring: AIDE/Tripwire installed, initialised, scheduled verification | 1.3 | SI-7 | 10.5.5, 11.5 | V-204440 |
| ADV-017 | `audits/linux/advanced-controls/umask-audit.sh` | Default umask: /etc/profile, /etc/login.defs, /etc/bashrc, PAM umask | 5.4.4 | AC-3 | — | V-204441 |
| ADV-018 | `audits/linux/advanced-controls/cron-permissions-audit.sh` | Cron access control: crontab permissions, cron.allow/deny, at.allow/deny | 5.1.1–5.1.9 | CM-6 | — | V-204442 |
| NET-010 | `audits/linux/network/intrusion-prevention/fail2ban-audit.sh` | Fail2ban IDS/IPS: running, SSH jail configured, ban time, max retry | 6.1 | SI-4 | 11.4 | — |
| NET-011 | `audits/linux/network/dns/dns-security-audit.sh` | DNS resolver security: stub resolver configuration, DNSSEC validation, /etc/resolv.conf | 3.4 | SC-20, SC-21 | — | — |

---

## Optional controls

All other audit scripts discovered under `audits/linux/` are classified as optional. They are not run by `--preset security` but can be run individually or via `--domain`, `--match`, or `--preset all`.

Optional controls include web server audits (`web/`), database audits (`data/`), container audits (`apps/containers/`), application dependency audits (`apps/deps/`), Kubernetes audits (`apps/orchestration/kubernetes-*`), application-framework audits (`apps/java/`, `apps/nodejs/`, `apps/php/`, `apps/python/`, `apps/ruby/`), messaging audits (`apps/messaging/`), cloud integration audits (`cloud/`), EDR/SIEM agent audits (`security/edr/`, `security/siem/`), storage audits (`storage/`, including `storage/archive/`, `storage/backup-dr/`, `storage/object/`, `storage/shares/`), hypervisor audits (`virtualization/`, including KVM/QEMU, Proxmox, Xen, Xen Orchestra), distro-specific audits (`platform/<distro>/`), and automation tool audits (`automation/`).

Domain-grouped presets are available for convenience: `--preset apps`, `--preset containers`, `--preset kubernetes`, `--preset dependencies`, `--preset hypervisors`, `--preset storage`.

---

## Control ID namespace

| Prefix | Domain |
| ------ | -------------------------------------------------------- |
| PLT | Platform (OS, services, firewall) |
| ACC | Access control (SSH, SUID, permissions) |
| NET | Network (firewall, VPN, IDS, DNS) |
| ADV | Advanced controls (kernel, PAM, audit, logging) |
| SVC | Service-specific (reserved for future web/data controls) |
