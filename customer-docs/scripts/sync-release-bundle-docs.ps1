param(
    [Parameter(Mandatory = $true)]
    [string]$Product,

    [Parameter(Mandatory = $true)]
    [string]$Version,

    [Parameter(Mandatory = $true)]
    [string]$BundleRoot,

    [string]$ManifestPath = "release-bundles/bundle-docs-manifest.json",

    [string]$DocsRoot = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-TemplatePath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    return $Path.Replace("{product}", $Product).Replace("{version}", $Version)
}

function Test-ProductMatch {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Entry
    )

    if (-not $Entry.products) {
        return $true
    }

    return ($Entry.products -contains "*") -or ($Entry.products -contains $Product)
}

function Copy-ManifestEntry {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Entry,

        [Parameter(Mandatory = $true)]
        [bool]$Required
    )

    if (-not (Test-ProductMatch -Entry $Entry)) {
        return
    }

    $sourceRelative = Resolve-TemplatePath -Path $Entry.source
    $destinationRelative = Resolve-TemplatePath -Path $Entry.destination
    $source = Join-Path $DocsRoot $sourceRelative
    $destination = Join-Path $BundleRoot $destinationRelative

    if (-not (Test-Path $source)) {
        if ($Required) {
            throw "Required documentation source missing: $sourceRelative"
        }

        Write-Host "Optional documentation source missing: $sourceRelative"
        return
    }

    $destinationDirectory = Split-Path -Parent $destination
    if ($destinationDirectory -and -not (Test-Path $destinationDirectory)) {
        New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null
    }

    Copy-Item -Path $source -Destination $destination -Force
    Write-Host "Copied $sourceRelative -> $destinationRelative"
}

if (-not (Test-Path $ManifestPath)) {
    throw "Bundle docs manifest not found: $ManifestPath"
}

if (-not (Test-Path $BundleRoot)) {
    New-Item -ItemType Directory -Path $BundleRoot -Force | Out-Null
}

$manifest = Get-Content -Path $ManifestPath -Raw | ConvertFrom-Json

foreach ($entry in $manifest.required) {
    Copy-ManifestEntry -Entry $entry -Required $true
}

foreach ($entry in $manifest.optional) {
    Copy-ManifestEntry -Entry $entry -Required $false
}

$commit = "unknown"
try {
    $commit = (git -C $DocsRoot rev-parse HEAD 2>$null).Trim()
} catch {
    $commit = "unknown"
}

$evidence = [ordered]@{
    schema = "audittoolkit.bundle-docs-sync.v1"
    product = $Product
    version = $Version
    docsCommit = $commit
    syncedAtUtc = (Get-Date).ToUniversalTime().ToString("o")
}

$evidencePath = Join-Path $BundleRoot "manifest/docs-sync.json"
$evidenceDirectory = Split-Path -Parent $evidencePath
if (-not (Test-Path $evidenceDirectory)) {
    New-Item -ItemType Directory -Path $evidenceDirectory -Force | Out-Null
}

$evidence | ConvertTo-Json -Depth 5 | Set-Content -Path $evidencePath -Encoding utf8
Write-Host "Wrote docs sync evidence: manifest/docs-sync.json"
