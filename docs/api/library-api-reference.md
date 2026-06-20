# Library API Reference

> Central authoritative copy. This page replaces the previously duplicated
> `docs/06-library-api-reference.md` files in `Audit-Tool-` and
> `audittoolkit-linux-security-lite`. Product repos should link here.

Complete API documentation for all exported functions in `lib/` for use in audits.

## Overview

The library is organized into functional modules:

- **common.sh** — Logging, checks, and framework utilities (REQUIRED in all audits)
- **distro.sh** — OS detection and feature probes
- **pkg.sh** — Package manager shims
- **svc.sh** — Service manager shims
- **firewall.sh** — Firewall detection and rules
- **security_stack.sh** — SELinux/AppArmor status
- **paths.sh** — Standard distro-specific paths

---

## common.sh — Core Framework

**Required in all audits.** Provides logging, check registration, and summary generation.

### setup_colors()

Initialize color variables for terminal output.

```bash
setup_colors
# Sets: RED, GREEN, YELLOW, BLUE, CYAN, BOLD, NC (no color)
# Automatically respects NO_COLOR environment variable and terminal type
```

**Environment Variables:**

- `NO_COLOR=true` — Disable all colors (POSIX standard)
- Auto-detects non-TTY output and disables colors

---

### register_check(name, result, [message])

Register a single check result and update counters.

```bash
register_check "Check Name" PASS "optional message"
register_check "Another Check" FAIL "error details here"
register_check "Third Check" WARN "warning details"
register_check "Skipped Check" SKIP "reason for skip"
```

**Parameters:**

- `name` (string) — Check description (shown in output)
- `result` (PASS|WARN|FAIL|SKIP) — Outcome
- `message` (optional) — Details appended after name

**Behavior:**

- Prints `[PASS]`, `[WARN]`, `[FAIL]`, or `[SKIP]` prefix
- Updates internal counters: `$TOTAL_CHECKS`, `$PASSED_CHECKS`, `$FAILED_CHECKS`, `$WARNING_CHECKS`, `$SKIPPED_CHECKS`
- Sets `$EXIT_CODE` to highest severity (0=PASS, 1=WARN, 2=FAIL)
- Logs to `$LOG_FILE` if set (silently ignored if write fails)

**Exit Code Semantics:**

- PASS → EXIT_CODE remains 0 (or higher if already set)
- WARN → EXIT_CODE becomes 1 (if currently 0)
- FAIL → EXIT_CODE becomes 2 (always)
- SKIP → EXIT_CODE unchanged

---

### section(title)

Print a formatted section header for grouping related checks.

```bash
section "OS Baseline Configuration"
# Prints a bold, colored divider with title
register_check "Check 1" PASS
register_check "Check 2" FAIL
```

**Output:**

```
============================================================
 OS Baseline Configuration
============================================================
```

---

### print_summary()

Generate and display the audit summary table.

**Must be called at the end of every audit before `exit`.**

```bash
print_summary
exit "$EXIT_CODE"
```

**Output Example:**

```
+==========================================================+
 AUDIT SUMMARY
+==========================================================+
 Hostname: example.local
 Date:     2026-02-04 15:30:45
+----------------------+----------------------+----------------------+
 ✔ PASSED:    5       ✘ FAILED:    2
 ⚠ WARNINGS:  1       ◌ SKIPPED:   0
+----------------------+----------------------+----------------------+
 TOTAL CHECKS: 8
+==========================================================+
```

**Orchestrator Integration:**
The orchestrator scrapes `[PASS]`, `[WARN]`, `[FAIL]`, `[SKIP]` markers from output, so `print_summary` must be called for aggregation to work.

---

### \_log(level, message)

Internal logging function (discouraged; use standard functions below instead).

```bash
_log ERROR "Something went wrong"
_log WARN "Configuration issue detected"
_log DEBUG "Detailed info (only shown with VERBOSE=true)"
_log TRACE "Very detailed info (only shown with VERY_VERBOSE=true)"
```

**Levels:**

- `ERROR`, `WARN` — Sent to stderr, always shown (unless QUIET=true)
- `INFO`, `DEBUG` — Sent to stdout, DEBUG only shown if VERBOSE=true
- `TRACE` — Sent to stdout, only shown if VERY_VERBOSE=true
- All levels appended to `$LOG_FILE` if set

**Environment Variables:**

- `QUIET=true` — Suppress console output
- `VERBOSE=true` — Show DEBUG messages
- `VERY_VERBOSE=true` — Show TRACE messages
- `LOG_FILE=/path/to/file` — Append all logs here

---

## distro.sh — OS Detection

Detect Linux distribution and probe system features.

### detect_distro()

Detect the running Linux distribution.

```bash
distro=$(detect_distro)
# Returns: ubuntu, debian, rhel, fedora, centos, almalinux, rocky, sles, suse, opensuse*, arch, manjaro, alpine, unknown
```

**Behavior:**

- Reads `/etc/os-release` (POSIX standard)
- Returns lowercase ID
- Returns "unknown" if unrecognized

**Example:**

```bash
. "$(dirname "$0")/../../lib/distro.sh"
case "$(detect_distro)" in
  ubuntu|debian) echo "Debian-based" ;;
  rhel|fedora)   echo "RedHat-based" ;;
esac
```

---

### is_systemd()

Check if systemd is the init system.

```bash
if is_systemd; then
  systemctl enable nginx
fi
```

**Returns:** 0 (true) if systemd is available and running, 1 (false) otherwise.

---

### is_openrc()

Check if OpenRC is the init system.

```bash
if is_openrc; then
  rc-service nginx start
fi
```

**Returns:** 0 (true) if OpenRC is available, 1 (false) otherwise.

---

### has_selinux()

Check if SELinux is available on the system.

```bash
if has_selinux; then
  status=$(selinux_status)
  register_check "SELinux status" PASS "$status"
fi
```

**Returns:** 0 (true) if `getenforce` command exists, 1 (false) otherwise.

---

### has_apparmor()

Check if AppArmor is available on the system.

```bash
if has_apparmor; then
  aa-status --summary
fi
```

**Returns:** 0 (true) if AppArmor modules/tools are present, 1 (false) otherwise.

---

## pkg.sh — Package Manager Shims

Abstract package manager operations across distros. **Requires:** `distro.sh`

### pkg_refresh()

Update package index (cache).

```bash
if pkg_refresh; then
  register_check "Package index refresh" PASS
else
  register_check "Package index refresh" FAIL
fi
```

**Commands by Distro:**

- Ubuntu/Debian: `apt -qq update`
- RHEL/Fedora: `dnf -q makecache` (or `yum` fallback)
- openSUSE: `zypper -q refresh`
- Arch: `pacman -Sy --noconfirm`
- Alpine: `apk update`

**Returns:** 0 on success, non-zero on failure (or on unknown distro).

---

### pkg_installed(package)

Check if a package is installed.

```bash
if pkg_installed curl; then
  register_check "curl package installed" PASS
else
  register_check "curl package installed" FAIL
fi
```

**Parameters:**

- `package` (string) — Package name (distro-specific; e.g., `curl`, `openssh-client`)

**Returns:** 0 (installed), 1 (not installed)

**Commands by Distro:**

- Ubuntu/Debian: `dpkg -s`
- RHEL/Fedora: `rpm -q`
- openSUSE: `rpm -q`
- Arch: `pacman -Q`
- Alpine: `apk info -e`

---

### pkg_list_upgrades()

List available package upgrades.

```bash
upgrades=$(pkg_list_upgrades)
if [[ -n "$upgrades" ]]; then
  count=$(echo "$upgrades" | wc -l)
  register_check "Upgradable packages" WARN "$count pending"
else
  register_check "Upgradable packages" PASS "none"
fi
```

**Returns:** Multi-line output (one package per line), or empty if none available.

**Commands by Distro:**

- Ubuntu/Debian: `apt list --upgradable`
- RHEL/Fedora: `dnf -q check-update`
- openSUSE: `zypper list-updates`
- Arch: `pacman -Qu`
- Alpine: `apk version -l '<'`

---

## svc.sh — Service Manager Shims

Abstract service manager operations across init systems. **Requires:** `distro.sh`

### svc_is_enabled(service)

Check if a service is enabled to start at boot.

```bash
if svc_is_enabled sshd; then
  register_check "SSH auto-start" PASS
else
  register_check "SSH auto-start" WARN "disabled"
fi
```

**Parameters:**

- `service` (string) — Service name (e.g., `sshd`, `nginx`, `postgresql`)

**Returns:** 0 (enabled), 1 (not enabled)

**Commands by Init:**

- systemd: `systemctl is-enabled --quiet <service>`
- OpenRC: `rc-update show | grep <service>`

---

### svc_is_active(service)

Check if a service is currently running.

```bash
if svc_is_active nginx; then
  register_check "Nginx running" PASS
else
  register_check "Nginx running" FAIL
fi
```

**Parameters:**

- `service` (string) — Service name

**Returns:** 0 (active), 1 (not active)

**Commands by Init:**

- systemd: `systemctl is-active --quiet <service>`
- OpenRC: `rc-status | grep <service> \[ *started *\]`

---

### svc_reload(service)

Reload a service configuration without restarting.

```bash
if svc_reload nginx; then
  register_check "Nginx config reload" PASS
else
  register_check "Nginx config reload" FAIL
fi
```

**Parameters:**

- `service` (string) — Service name

**Returns:** 0 on success, non-zero on failure

**Commands by Init:**

- systemd: `systemctl reload <service>`
- OpenRC: `rc-service <service> reload`

---

## firewall.sh — Firewall Shims

Detect and interact with firewall configurations. **No dependencies.**

### fw_state()

Get human-readable firewall state string.

```bash
state=$(fw_state)
echo "Firewall: $state"
```

**Returns:** One of:

- `Status: active` (ufw)
- `running` (firewalld)
- `nftables present` (nft)
- `no firewall tooling found`

---

### fw_is_active()

Check if any firewall is actively running.

```bash
if fw_is_active; then
  register_check "Firewall active" PASS
else
  register_check "Firewall active" WARN
fi
```

**Returns:** 0 (active), 1 (inactive or not found)

**Supported Tools (in order of preference):**

- ufw: `ufw status | grep "Status: active"`
- firewall-cmd: `firewall-cmd --state | grep running`
- nftables: `nft list tables`

---

### fw_list_rules()

List active firewall rules (format varies by tool).

```bash
rules=$(fw_list_rules)
echo "$rules" | head -20
```

**Returns:** Firewall rules (format depends on available tool):

- ufw: `ufw status numbered`
- firewall-cmd: `firewall-cmd --list-all`
- iptables: `iptables -L -n`
- nftables: `nft list ruleset`
- None found: `"No firewall rules found"`

---

## security_stack.sh — Security Features

Probe mandatory access control systems. **No dependencies.**

### selinux_status()

Get SELinux enforcement mode.

```bash
status=$(selinux_status)
case "$status" in
  enforcing) register_check "SELinux mode" PASS "enforcing" ;;
  permissive) register_check "SELinux mode" WARN "permissive (not enforced)" ;;
  disabled) register_check "SELinux mode" WARN "disabled" ;;
  *) register_check "SELinux" SKIP "not installed" ;;
esac
```

**Returns:** One of:

- `enforcing` — Violations are blocked
- `permissive` — Violations logged but allowed
- `disabled` — SELinux not active
- `not present` — `getenforce` not found

---

### apparmor_status()

Get AppArmor profile status.

```bash
status=$(apparmor_status)
register_check "AppArmor" PASS "$status"
```

**Returns:** Output from `aa-status` or `not present`.

---

## paths.sh — Standard Paths

Distro-specific path helpers. **Requires:** `distro.sh`

### path_logrotate_conf()

Get path to logrotate main configuration.

```bash
logrotate_conf=$(path_logrotate_conf)
# Returns: /etc/logrotate.conf (standard across all distros)
```

---

### path_logrotate_d()

Get path to logrotate.d directory.

```bash
logrotate_d=$(path_logrotate_d)
# Returns: /etc/logrotate.d (standard across all distros)
```

---

### path_pkg_conf_dir()

Get distro-specific package manager configuration directory.

```bash
pkg_conf=$(path_pkg_conf_dir)
case "$(detect_distro)" in
  ubuntu|debian)  echo "$pkg_conf" # /etc/apt/apt.conf.d
    ;;
  rhel|fedora)    echo "$pkg_conf" # /etc/dnf
    ;;
  opensuse*)      echo "$pkg_conf" # /etc/zypp
    ;;
  arch)           echo "$pkg_conf" # /etc/pacman.d
    ;;
  alpine)         echo "$pkg_conf" # /etc/apk
    ;;
esac
```

**Returns:** Distro-specific path (or `/etc` as fallback).

---

## Environment Variables Reference

### Global Variables (set by framework)

```bash
EXIT_CODE         # Overall audit exit code: 0 (PASS), 1 (WARN), 2 (FAIL)
TOTAL_CHECKS      # Total checks registered
PASSED_CHECKS     # Count of PASS results
FAILED_CHECKS     # Count of FAIL results
WARNING_CHECKS    # Count of WARN results
SKIPPED_CHECKS    # Count of SKIP results
```

### Configuration Variables (set by caller)

```bash
QUIET=true|false        # Suppress console output (default: false)
VERBOSE=true|false      # Show DEBUG-level logs (default: false)
VERY_VERBOSE=true|false # Show TRACE-level logs (default: false)
NO_COLOR=true|false     # Disable colored output (default: false, POSIX standard)
LOG_FILE=/path/to/file  # Append logs here (optional)
```

---

## Usage Patterns

### Pattern 1: Basic Audit

```bash
#!/usr/bin/env bash
set -euo pipefail

. "$(dirname "$0")/../../lib/common.sh"
. "$(dirname "$0")/../../lib/distro.sh"
. "$(dirname "$0")/../../lib/pkg.sh"

section "Package Updates"
if pkg_refresh; then
  register_check "Package index refresh" PASS
else
  register_check "Package index refresh" FAIL
fi

upgrades=$(pkg_list_upgrades || true)
if [[ -n "$upgrades" ]]; then
  register_check "Upgradable packages" WARN "$(echo "$upgrades" | wc -l) available"
else
  register_check "Upgradable packages" PASS "none"
fi

print_summary
exit "$EXIT_CODE"
```

### Pattern 2: Distro-Specific Logic

```bash
#!/usr/bin/env bash
set -euo pipefail

. "$(dirname "$0")/../../lib/common.sh"
. "$(dirname "$0")/../../lib/distro.sh"
. "$(dirname "$0")/../../lib/svc.sh"

section "Service Status"

distro=$(detect_distro)
case "$distro" in
  ubuntu|debian)
    if svc_is_active ssh; then
      register_check "SSH service" PASS "active"
    else
      register_check "SSH service" WARN "inactive"
    fi
    ;;
  rhel|fedora)
    if svc_is_active sshd; then
      register_check "SSHD service" PASS "active"
    else
      register_check "SSHD service" WARN "inactive"
    fi
    ;;
esac

print_summary
exit "$EXIT_CODE"
```

### Pattern 3: Using Firewall Shims

```bash
#!/usr/bin/env bash
set -euo pipefail

. "$(dirname "$0")/../../lib/common.sh"
. "$(dirname "$0")/../../lib/firewall.sh"

section "Firewall Configuration"

if fw_is_active; then
  register_check "Firewall active" PASS
  rules=$(fw_list_rules)
  register_check "Rules present" PASS "$(echo "$rules" | wc -l) rules"
else
  register_check "Firewall active" WARN "inactive"
fi

print_summary
exit "$EXIT_CODE"
```

---

## Best Practices

1. **Always source common.sh** — Required for logging and checks
2. **Use shims, don't hardcode commands** — Ensures portability
3. **Call print_summary before exit** — Required for orchestrator aggregation
4. **Use section() to group checks** — Improves readability
5. **Set VERBOSE=true in development** — Helps debug audit logic
