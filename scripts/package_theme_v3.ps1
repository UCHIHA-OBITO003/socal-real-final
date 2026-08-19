# Build a Shopify-valid theme zip for manual upload.
# Uses `shopify theme package` (not Compress-Archive).

$ErrorActionPreference = "Stop"
$themeDir = Join-Path $PSScriptRoot "..\shopify-theme-v3" | Resolve-Path
$outZip = Join-Path $PSScriptRoot "..\socal-labs-theme-v3.zip" | Resolve-Path

Push-Location $themeDir
try {
  shopify theme package | Out-Host
  $built = Get-ChildItem -Path $themeDir -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $built) { throw "shopify theme package did not produce a zip" }
  Copy-Item $built.FullName $outZip -Force
  Write-Host ""
  Write-Host "OK: $outZip ($([math]::Round((Get-Item $outZip).Length/1MB, 2)) MB)"
} finally {
  Pop-Location
}
