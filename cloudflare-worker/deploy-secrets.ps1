# deploy-secrets.ps1
# Usage: Copy .env.secrets.example to .env.secrets, fill in values, then run this script
# This script reads from .env.secrets and sets Wrangler secrets

param(
    [string]$EnvFile = ".env.secrets"
)

if (-not (Test-Path $EnvFile)) {
    Write-Error "File not found: $EnvFile"
    Write-Host "1. Copy .env.secrets.example to .env.secrets"
    Write-Host "2. Fill in actual values in .env.secrets"
    Write-Host "3. Run this script again"
    exit 1
}

# Ensure Node.js is in PATH
$env:Path += ";C:\Program Files\nodejs"

# Read .env.secrets and set each secret
$secrets = @{}
Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Count -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim()
            $secrets[$key] = $value
        }
    }
}

Write-Host "Deploying $(($secrets.Count)) secrets to Wrangler..." -ForegroundColor Green
Write-Host ""

foreach ($secret in $secrets.GetEnumerator()) {
    Write-Host "Setting secret: $($secret.Key)" -ForegroundColor Cyan
    $secret.Value | wrangler secret put $secret.Key
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Secret deployed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to deploy secret" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Verify with: wrangler secret list"
