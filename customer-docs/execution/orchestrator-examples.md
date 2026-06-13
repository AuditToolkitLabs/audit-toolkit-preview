# Orchestrator Usage Examples

> Central authoritative copy. This page replaces the previously duplicated
> `docs/11-orchestrator-examples.md` files in `Audit-Tool-` and
> `audittoolkit-linux-security-lite`. Product repos should link here.

Quick reference for the enhanced orchestrator with automatic audit selection.

---

## Basic Examples

### 1. Interactive Selection (Easiest!)

```bash
bash orchestrator/orchestrator.sh --interactive
```

**What you'll see:**

```
Available audits:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[platform]
   1) audits/platform/baseline/hardware-info-audit.sh
   2) audits/platform/baseline/os-baseline-audit.sh
   3) audits/platform/baseline/svc-basics.sh
   4) audits/platform/baseline/updates.sh

[web]
   5) audits/web/servers/nginx-security-audit.sh
   6) audits/web/servers/php-fpm-audit.sh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Selection options:
  - Enter numbers separated by space (e.g., '1 3 5')
  - Enter ranges (e.g., '1-5 10-12')
  - Type 'all' to select all audits
  - Press Enter or type 'none' to cancel

Your selection: 1-4
```

**Selections you can make:**

- `1 3 5` - Run audits 1, 3, and 5
- `1-4` - Run audits 1 through 4 (inclusive)
- `1-4 6` - Run audits 1 through 4, plus audit 6
- `all` - Run every audit
- Enter/`none` - Cancel

---

### 2. Quick Presets (No Interaction!)

#### Minimal Daily Check

```bash
bash orchestrator/orchestrator.sh --preset minimal
```

Runs 4 essential audits:

- updates.sh
- svc-basics.sh
- firewall-state.sh
- hardware-info-audit.sh

#### Security Focused

```bash
bash orchestrator/orchestrator.sh --preset security
```

Runs all security-critical audits (firewall, SSH, updates, hardening).

#### Platform Audits Only

```bash
bash orchestrator/orchestrator.sh --preset platform
```

Runs all platform domain audits.

#### Web Stack Audits Only

```bash
bash orchestrator/orchestrator.sh --preset web
```

Runs all web server audits (nginx, apache, PHP-FPM, TLS).

#### Everything

```bash
bash orchestrator/orchestrator.sh --preset all
```

Runs every discovered audit.

---

### 3. Domain Filtering

```bash
# Platform audits only
bash orchestrator/orchestrator.sh --domain platform

# Web + data audits
bash orchestrator/orchestrator.sh --domain web --domain data

# Interactive selection from platform domain
bash orchestrator/orchestrator.sh --domain platform --interactive
```

---

### 4. Pattern Matching

```bash
# Run all nginx-related audits
bash orchestrator/orchestrator.sh --match nginx

# Run all firewall checks
bash orchestrator/orchestrator.sh --match firewall

# Run anything with "security" in the path
bash orchestrator/orchestrator.sh --match security
```

---

### 5. Excluding Audits

```bash
# Run all except database audits
bash orchestrator/orchestrator.sh --exclude "mysql|postgresql|oracle"

# Run platform audits except monitoring
bash orchestrator/orchestrator.sh --domain platform --exclude monitoring
```

---

## Saving and Reusing Selections

### Create Reusable Plan File

**Option 1: Save from interactive selection**

```bash
bash orchestrator/orchestrator.sh --interactive --save-plan my-audits.txt
```

**Option 2: Save from preset**

```bash
bash orchestrator/orchestrator.sh --preset security --save-plan security-baseline.txt
```

**Option 3: Save from domain filtering**

```bash
bash orchestrator/orchestrator.sh --domain web --save-plan web-stack.txt
```

### Reuse Saved Plan

```bash
bash orchestrator/orchestrator.sh --plan my-audits.txt
```

**Example plan file contents:**

```
audits/platform/baseline/updates.sh
audits/platform/baseline/svc-basics.sh
audits/network/firewall/firewall-state.sh
audits/web/servers/nginx-security-audit.sh
```

---

## Practical Workflows

### Workflow 1: Morning Health Check

```bash
# Create once
bash orchestrator/orchestrator.sh --preset minimal --save-plan morning-check.txt

# Run daily
bash orchestrator/orchestrator.sh --plan morning-check.txt
```

**What it checks:**

- Pending system updates
- Core services status
- Firewall state
- Hardware health

---

### Workflow 2: Weekly Security Review

```bash
# Create once
bash orchestrator/orchestrator.sh --preset security --save-plan weekly-security.txt

# Run weekly (manual or cron)
bash orchestrator/orchestrator.sh --plan weekly-security.txt
```

---

### Workflow 3: Pre-Deployment Validation

```bash
# Before deploying web app changes
bash orchestrator/orchestrator.sh \
  --domain web \
  --domain data \
  --interactive
```

Select what you want to check:

- Nginx config
- PHP-FPM security
- Database access
- TLS certificates

---

### Workflow 4: New Server Baseline

```bash
# After provisioning new server
bash orchestrator/orchestrator.sh --preset platform
```

Validates:

- OS baseline configured
- Services enabled
- Updates applied
- Hardware properly detected
- Firewall configured

---

### Workflow 5: Compliance Full Audit

```bash
# Run everything, save results
bash orchestrator/orchestrator.sh --preset all | tee audit-$(date +%Y%m%d).log
```

---

## Advanced Combinations

### Interactive + Domain + Save

```bash
# Pick from web audits, save selection
bash orchestrator/orchestrator.sh \
  --domain web \
  --interactive \
  --save-plan web-selection.txt
```

### Multiple Domains + Pattern Match

```bash
# Web and data audits that mention "security"
bash orchestrator/orchestrator.sh \
  --domain web \
  --domain data \
  --match security
```

### Preset + Exclude

```bash
# Security preset without database audits
bash orchestrator/orchestrator.sh \
  --preset security \
  --exclude "mysql|postgresql"
```

---

## Listing and Testing

### List What Would Run (No Execution)

```bash
# See what minimal preset includes
bash orchestrator/orchestrator.sh --preset minimal --list

# See your plan file contents
bash orchestrator/orchestrator.sh --plan my-audits.txt --list

# See discovered audits in a domain
bash orchestrator/orchestrator.sh --domain platform --list

# See what interactive selection would show
bash orchestrator/orchestrator.sh --interactive --list
```

### Dry Run

```bash
# Show what would run, then exit
bash orchestrator/orchestrator.sh --preset security --dry-run
```

---

## Automation Examples

### Cron Jobs

**Daily minimal check:**

```bash
# crontab -e
0 9 * * * cd /path/to/repo && bash orchestrator/orchestrator.sh --preset minimal
```

**Weekly security audit:**

```bash
# crontab -e
0 9 * * 1 cd /path/to/repo && bash orchestrator/orchestrator.sh --preset security
```

**Monthly full audit:**

```bash
# crontab -e
0 9 1 * * cd /path/to/repo && bash orchestrator/orchestrator.sh --preset all | mail -s "Monthly Audit" support@audittoolkitlabs.com
```

---

### CI/CD Integration

**Pre-deployment check:**

```bash
# .gitlab-ci.yml or .github/workflows/deploy.yml
before_deploy:
  - bash orchestrator/orchestrator.sh --preset web --preset security
```

**Scheduled compliance scan:**

```bash
# GitHub Actions (.github/workflows/weekly-audit.yml)
schedule:
  - cron: '0 9 * * 1'  # Every Monday at 9 AM
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: bash orchestrator/orchestrator.sh --preset all
```

---

## Output Examples

### Execution Summary

```
==> Planned scripts (4):
  audits/platform/baseline/updates.sh
  audits/platform/baseline/svc-basics.sh
  audits/network/firewall/firewall-state.sh
  audits/platform/baseline/hardware-info-audit.sh

==> Running audits/platform/baseline/updates.sh
 [PASS] OS detection: ubuntu
 [PASS] Package cache: refreshed
 [WARN] Pending updates: 5 packages
 Summary for updates.sh: PASS=2 WARN=1 FAIL=0 SKIP=0 (rc=0)

==> Running audits/platform/baseline/svc-basics.sh
 [PASS] SSH: running and enabled
 [PASS] cron: running and enabled
 Summary for svc-basics.sh: PASS=2 WARN=0 FAIL=0 SKIP=0 (rc=0)

==> Running audits/network/firewall/firewall-state.sh
 [PASS] Firewall: active
 Summary for firewall-state.sh: PASS=1 WARN=0 FAIL=0 SKIP=0 (rc=0)

==> Running audits/platform/baseline/hardware-info-audit.sh
 [PASS] CPU: 4 cores
 [PASS] Memory: 16 GB
 [PASS] Disk usage: 45%
 Summary for hardware-info-audit.sh: PASS=3 WARN=0 FAIL=0 SKIP=0 (rc=0)

+=================== OVERALL ===================+
 TOTAL=8 PASS=8 WARN=1 FAIL=0 SKIP=0
+===============================================+
```

### Exit Code

- `0` = All passed (only PASS/SKIP)
- `1` = Warnings present
- `2` = Failures detected

---

## Tips

1. **Start with `--list`** to see what would run before executing
2. **Use `--interactive`** when exploring available audits
3. **Create plan files** for repeated use (daily/weekly checks)
4. **Combine presets** for specific scenarios (`--preset security --domain web`)
5. **Use verbose** for debugging (`--verbose`)

---

## Common Issues

**Q: No audits discovered**

```bash
# Make sure you're in the repo root
cd /path/to/repo
bash orchestrator/orchestrator.sh --interactive
```

**Q: fzf not working**

```bash
# Install fzf (optional, but recommended)
sudo apt install fzf  # Ubuntu/Debian
brew install fzf      # macOS
apk add fzf          # Alpine

# Or just use the fallback menu (no fzf needed)
bash orchestrator/orchestrator.sh --interactive
```

**Q: Plan file not found**

```bash
# Use absolute path or ensure you're in repo root
bash orchestrator/orchestrator.sh --plan /full/path/to/my-plan.txt
```

---

## Summary

**No file editing required!** Just run:

```bash
bash orchestrator/orchestrator.sh --interactive
```

Pick what you want, run it, done.
