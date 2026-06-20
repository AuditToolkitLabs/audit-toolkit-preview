# sync-docs-from-central.ps1
#
# Pulls customer-facing documentation from the central doc stores into the
# preview site's docs/ folder. Run this locally before committing and pushing
# to GitHub. The docs/ folder is never hand-edited — always re-generated here.
#
# Sources:
#   AuditToolkit-Docs       F:\AuditProducts\AuditToolkit-Docs
#   AuditToolkit-Control-Centre  F:\AuditProducts\AuditToolkit-Control-Centre
#
# Destination:
#   docs/   (relative to this script's parent directory)

[CmdletBinding()]
param (
    [string]$DocsSource    = "F:\AuditProducts\AuditToolkit-Docs",
    [string]$CCSource      = "F:\AuditProducts\AuditToolkit-Control-Centre",
    [string]$SiteRoot      = "$PSScriptRoot\.."
)

$dest = Join-Path $SiteRoot "docs"

# ── Preflight checks ──────────────────────────────────────────────────────────

if (-not (Test-Path $DocsSource)) {
    Write-Error "AuditToolkit-Docs not found at: $DocsSource"
    exit 1
}
if (-not (Test-Path $CCSource)) {
    Write-Error "AuditToolkit-Control-Centre not found at: $CCSource"
    exit 1
}

# ── Wipe and recreate destination ─────────────────────────────────────────────

Write-Host "Clearing docs/ ..."
if (Test-Path $dest) {
    Remove-Item $dest -Recurse -Force
}
New-Item $dest -ItemType Directory | Out-Null

# ── Copy customer-facing content from AuditToolkit-Docs ───────────────────────

$customerFacingDirs = @(
    "customer",
    "legal",
    "licensing",
    "api",
    "deployment",
    "platform",
    "releases",
    "validation"
)

foreach ($dir in $customerFacingDirs) {
    $srcDir = Join-Path $DocsSource $dir
    if (Test-Path $srcDir) {
        Write-Host "Syncing $dir/ ..."
        Copy-Item $srcDir (Join-Path $dest $dir) -Recurse
    } else {
        Write-Warning "  Skipped (not found): $srcDir"
    }
}

# Copy top-level index
$indexSrc = Join-Path $DocsSource "index.md"
if (Test-Path $indexSrc) {
    Copy-Item $indexSrc (Join-Path $dest "index.md")
}

# ── Copy customer-facing architecture docs from Control-Centre ────────────────

$ccArchSrc = Join-Path $CCSource "docs\architecture"
if (Test-Path $ccArchSrc) {
    Write-Host "Syncing architecture docs from Control-Centre ..."
    $archDest = Join-Path $dest "architecture"
    New-Item $archDest -ItemType Directory | Out-Null
    Get-ChildItem $ccArchSrc -Filter "*.md" | ForEach-Object {
        Copy-Item $_.FullName (Join-Path $archDest $_.Name)
    }
}

# ── Summary ───────────────────────────────────────────────────────────────────

$count = (Get-ChildItem $dest -Recurse -File).Count
Write-Host ""
Write-Host "Sync complete. $count files written to docs/"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Review docs/ content"
Write-Host "  2. git add docs/"
Write-Host "  3. git rm -r customer-docs/  (if not already removed)"
Write-Host "  4. git commit and push"
