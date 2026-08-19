# Deploy shopify-theme-v3 to the LIVE store theme (never an unpublished duplicate).
$ErrorActionPreference = "Stop"

$ThemeDir = Join-Path $PSScriptRoot "..\shopify-theme-v3" | Resolve-Path
$LiveThemeId = "149129429034"
$Store = "sarvs-store-nudaxw98.myshopify.com"

Write-Host "Deploying from: $ThemeDir"
Write-Host "Live theme ID:  $LiveThemeId"
Write-Host "Store:          $Store"
Write-Host ""

Push-Location $ThemeDir
try {
  shopify theme push --theme $LiveThemeId --allow-live --store $Store
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  shopify theme publish --theme $LiveThemeId --force --store $Store
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  Write-Host ""
  Write-Host "OK: Live theme updated and published."
  Write-Host "Verify: view page source on the storefront and check html[data-theme-build]."
  Write-Host "Editor: https://admin.shopify.com/store/sarvs-store-nudaxw98/themes/$LiveThemeId/editor"
}
finally {
  Pop-Location
}
