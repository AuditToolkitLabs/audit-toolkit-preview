<#
.SYNOPSIS
  Auto-publish releases from private Gitea to the public GitHub hub and the site.

.DESCRIPTION
  Runs on the Gitea host (the only machine that can reach loopback Gitea). One
  pass:
    1. Publish the newest `keep_releases` of each configured product to the
       GitHub Releases hub (idempotent — already-published tags are skipped),
       and prune anything outside the retention window.
    2. Refresh the source-free metadata JSON in releases/data/.
    3. Commit and push releases/data/ so GitHub Pages serves the update.

  Designed to run unattended from Windows Task Scheduler (see RELEASES-RUNBOOK.md).
  Because the binaries live on loopback Gitea, this MUST run on the Gitea host — a
  cloud runner or Power Automate cannot reach them.

.PARAMETER NoPush
  Do everything except git commit/push (dry run for the site side).

.PREREQUISITES
  - $env:GITEA_TOKEN  : read-only Gitea token.
  - gh CLI authenticated as an org admin (to bypass the block-all-tags ruleset).
  - git configured with push rights to the site repo.
#>
[CmdletBinding()]
param([switch]$NoPush)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if (-not $env:GITEA_TOKEN) { throw "GITEA_TOKEN is not set." }

$stamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
Write-Host "[$stamp] release auto-publish starting in $repoRoot"

# 1) Publish newest-N of each product (idempotent) + prune to retention window.
python ci/sync-releases.py --publish-github
if ($LASTEXITCODE -ne 0) { throw "publish step failed ($LASTEXITCODE)" }

# 2) Refresh all metadata + the hub index.
python ci/sync-releases.py
if ($LASTEXITCODE -ne 0) { throw "metadata sync failed ($LASTEXITCODE)" }

# 3) Commit + push only if the published metadata actually changed.
git add releases/data
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "No release metadata changes — nothing to publish to the site."
    exit 0
}

if ($NoPush) {
    Write-Host "Staged release metadata changes (NoPush set — not committing)."
    git --no-pager diff --cached --stat
    exit 0
}

git commit -m "chore(releases): sync release metadata from Gitea ($stamp)"
git push
Write-Host "[$stamp] release metadata committed and pushed."
