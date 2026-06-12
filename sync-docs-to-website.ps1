param(
    [string]$CentralDocsRoot = "F:\AuditProducts\AuditToolkit-Docs",
    [string]$WebsiteRepoRoot = "$PSScriptRoot",
    [switch]$Mirror,
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-CentralCustomerDocsPath {
    param([string]$Root)

    $candidates = @(
        (Join-Path $Root "customer"),
        (Join-Path $Root "customer-docs")
    )

    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) {
            return $candidate
        }
    }

    throw "Could not find customer documentation folder under '$Root'. Expected one of: customer, customer-docs."
}

$destinationRoot = Join-Path $WebsiteRepoRoot "customer-docs"
if (-not (Test-Path -LiteralPath $destinationRoot)) {
    throw "Destination folder not found: $destinationRoot"
}

$sourceCustomerDocs = Resolve-CentralCustomerDocsPath -Root $CentralDocsRoot

$productFolders = @(
    "audit-toolkit",
    "cmdb-api",
    "asset-command-center",
    "linux-security-lite",
    "Switch Exposure Centre"
)

Write-Host "Central docs source: $sourceCustomerDocs"
Write-Host "Website destination: $destinationRoot"
Write-Host "Mode: $(if ($Mirror) { 'mirror' } else { 'copy-only' })"
Write-Host "WhatIf: $WhatIf"

$robocopyBaseArgs = @("/R:2", "/W:2", "/E", "/NFL", "/NDL", "/NP")
if ($Mirror) {
    $robocopyBaseArgs += "/MIR"
}
if ($WhatIf) {
    $robocopyBaseArgs += "/L"
}

$copiedAny = $false
foreach ($folder in $productFolders) {
    $source = Join-Path $sourceCustomerDocs $folder
    $destination = Join-Path $destinationRoot $folder

    if (-not (Test-Path -LiteralPath $source)) {
        Write-Warning "Skipping missing source folder: $source"
        continue
    }

    if (-not (Test-Path -LiteralPath $destination)) {
        New-Item -ItemType Directory -Path $destination | Out-Null
    }

    Write-Host "Syncing: $folder"
    $robocopyArgs = @($source, $destination) + $robocopyBaseArgs
    & robocopy @robocopyArgs | Out-Host

    $exitCode = $LASTEXITCODE
    if ($exitCode -ge 8) {
        throw "robocopy failed for '$folder' with exit code $exitCode"
    }

    $copiedAny = $true
}

if (-not $copiedAny) {
    throw "No product folders were synced. Check source structure under '$sourceCustomerDocs'."
}

Write-Host "Sync complete."
Write-Host "Next: record this event in docs-sync-ledger.md as CENTRAL_SYNC or RECONCILIATION."
