param(
    [Parameter(Mandatory = $true)]
    [string]$Product,

    [Parameter(Mandatory = $true)]
    [string]$Version,

    [Parameter(Mandatory = $true)]
    [string]$BundleRoot,

    [string]$ManifestPath = "release-bundles/bundle-docs-manifest.json",

    [switch]$AllowUnknownDocsCommit
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

function Convert-GlobToRegex {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Pattern
    )

    $escaped = [regex]::Escape($Pattern.Replace("\", "/"))
    $escaped = $escaped.Replace("\*\*", ".*").Replace("\*", "[^/]*")
    return "^$escaped$"
}

function Test-ExcludedPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$RelativePath,

        [Parameter(Mandatory = $true)]
        [string[]]$Patterns
    )

    $normalized = $RelativePath.Replace("\", "/")
    foreach ($pattern in $Patterns) {
        $regex = Convert-GlobToRegex -Pattern $pattern
        if ($normalized -match $regex) {
            return $true
        }

        if ($pattern.StartsWith("**/")) {
            $rootPattern = $pattern.Substring(3)
            $rootRegex = Convert-GlobToRegex -Pattern $rootPattern
            if ($normalized -match $rootRegex) {
                return $true
            }
        }
    }

    return $false
}

if (-not (Test-Path $BundleRoot)) {
    throw "Release bundle root not found: $BundleRoot"
}

if (-not (Test-Path $ManifestPath)) {
    throw "Bundle docs manifest not found: $ManifestPath"
}

$manifest = Get-Content -Path $ManifestPath -Raw | ConvertFrom-Json

foreach ($entry in $manifest.required) {
    if (-not (Test-ProductMatch -Entry $entry)) {
        continue
    }

    $destinationRelative = Resolve-TemplatePath -Path $entry.destination
    $destination = Join-Path $BundleRoot $destinationRelative
    if (-not (Test-Path $destination)) {
        throw "Required release-bundle documentation missing: $destinationRelative"
    }
}

$evidencePath = Join-Path $BundleRoot "manifest/docs-sync.json"
if (-not (Test-Path $evidencePath)) {
    throw "Release bundle docs sync evidence missing: manifest/docs-sync.json"
}

$evidence = Get-Content -Path $evidencePath -Raw | ConvertFrom-Json
if ($evidence.schema -ne "audittoolkit.bundle-docs-sync.v1") {
    throw "Unexpected docs sync evidence schema: $($evidence.schema)"
}

if ($evidence.product -ne $Product) {
    throw "Docs sync evidence product mismatch: expected $Product, got $($evidence.product)"
}

if ($evidence.version -ne $Version) {
    throw "Docs sync evidence version mismatch: expected $Version, got $($evidence.version)"
}

if (-not $evidence.docsCommit) {
    throw "Docs sync evidence is missing docsCommit"
}

if (($evidence.docsCommit -eq "unknown") -and (-not $AllowUnknownDocsCommit)) {
    throw "Docs sync evidence has unknown docsCommit"
}

$excludedPatterns = @()
if ($manifest.excludedPatterns) {
    $excludedPatterns = @($manifest.excludedPatterns)
}

$bundleRootItem = Get-Item -Path $BundleRoot
$forbidden = New-Object System.Collections.Generic.List[string]
Get-ChildItem -Path $BundleRoot -Recurse -File | ForEach-Object {
    $relative = $_.FullName.Substring($bundleRootItem.FullName.Length + 1).Replace("\", "/")
    if (Test-ExcludedPath -RelativePath $relative -Patterns $excludedPatterns) {
        $forbidden.Add($relative)
    }
}

if ($forbidden.Count -gt 0) {
    $joined = ($forbidden | Sort-Object) -join ", "
    throw "Release bundle contains internal or forbidden documentation: $joined"
}

Write-Host "Release bundle documentation validation passed for $Product $Version"