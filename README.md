# socal-real-final

Final **socal labs** Shopify theme v3 — source + zip only. Send this folder (or clone this repo) to deploy.

## Contents

| Path | Purpose |
|------|---------|
| `shopify-theme-v3/` | Live theme source (edit here) |
| `socal-labs-theme-v3.zip` | Client upload zip |
| `FINAL_WORK.md` | Full handoff: build marker, CTAs, deploy notes |
| `scripts/deploy_theme_v3_live.ps1` | Push + publish to live theme |
| `scripts/package_theme_v3.ps1` | Rebuild zip after edits |

## Latest build

View page source on the storefront:

```html
data-theme-build="2026-08-19-logo-strip-spacing"
```

File: `shopify-theme-v3/layout/theme.liquid`

## Deploy (CLI)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy_theme_v3_live.ps1
```

Store: `sarvs-store-nudaxw98.myshopify.com` · Theme ID: `149129429034`

## Rebuild zip

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package_theme_v3.ps1
```

Output: `socal-labs-theme-v3.zip` in this folder.

## Client zip upload

1. Shopify Admin → Online Store → Themes → Add theme → Upload zip  
2. Select `socal-labs-theme-v3.zip`  
3. **Publish** the uploaded theme (upload alone leaves it unpublished)

See `FINAL_WORK.md` for page templates, branding (`socal` lowercase), and session changelog.
