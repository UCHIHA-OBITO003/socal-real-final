# Final work — socal labs Shopify theme v3

Handoff for the next machine / next chat. This is the **latest live work** from the Aug 7, 2026 session (CTA copy, hero images, Amazon dashboard, device showcase, branding, thumb-stack blur).

**Read this file first** before changing the theme.

---

## Source of truth (work here)

| What | Path |
|------|------|
| **Live theme source** | `socal-devices/shopify-theme-v3/` |
| **Client zip (in this git repo)** | `socal-devices/socal-labs-theme-v3.zip` |
| **Local package output folder** | `socal-final/` (nested git repo — not pushed as a submodule; copy zip from `socal-devices/` if missing) |
| **Deploy script** | `scripts/deploy_theme_v3_live.ps1` |
| **Package (zip) script** | `scripts/package_theme_v3.ps1` |
| **Client deploy notes** | `socal-devices/docs/CLIENT_DEPLOY_V3.md` |

**Do not** treat `socal-devices/shopify-theme/` or `shopify-theme-v1/` as current. Those are older.

**Do not** edit files under `scripts/node_modules/` (Playwright). It is gitignored.

---

## Latest build marker

View page source on the storefront. The live HTML must include:

```html
data-theme-build="2026-08-07-thumb-stack-blur"
```

File that holds this string: `socal-devices/shopify-theme-v3/layout/theme.liquid` (first `<html>` tag).

Bump this marker on every theme change so you can tell if the live store actually received the push.

---

## Shopify live store (dev store used in this chat)

| Item | Value |
|------|--------|
| Store | `sarvs-store-nudaxw98.myshopify.com` |
| Live theme name | SoCal Labs v3 — LIVE |
| Theme ID | `149129429034` |
| Editor | https://admin.shopify.com/store/sarvs-store-nudaxw98/themes/149129429034/editor |
| Config | `socal-devices/shopify-theme-v3/shopify.theme.toml` |

Client storefront may also be `socal-devices.myshopify.com`. Zip upload there **does not go live** until they **Publish**. Uploading a zip creates an unpublished copy.

CLI config currently points at the **sarvs** store, not the client store.

---

## Commands (run from repo root)

Rebuild zip after local edits:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\package_theme_v3.ps1"
```

Push + publish to the **sarvs live theme** (theme ID 149129429034):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\deploy_theme_v3_live.ps1"
```

Never `shopify theme push --unpublished` from the repo root — that created duplicate unpublished themes.

---

## Branding (locked)

Correct spelling on the site: **socal** (lowercase), e.g. **socal labs**, **socal BioMed**.

Wrong: `SoCal`, `soCal`, `Socal labs`, `SOCAL LABS` in customer-facing copy.

`settings_data.json` brand_name is `"socal labs"`.

---

## What the last session changed (in order)

Work newest at the bottom. **Last latest item = thumb-stack blur.**

### 1. CTA copy (replace “Start a project”)

Page-specific buttons. Contact still `/pages/contact`.

| Location | Label |
|----------|--------|
| Header / announcement / homepage hero | Let's Build Together |
| Websites | Build My Website |
| Web apps / mobile apps | Build My App |
| Marketplace growth / Amazon | Grow My Brand |
| Creative studio | Bring My Vision to Life |
| Paid media | Book a Strategy Call |
| Studio / work / expertise hero | Discuss Your Project |
| Bottom CTA on studio / work | Work With Us |
| Case studies | Discuss Your Project |
| Lead form kicker | Let's Talk |

Key files: `templates/page.*.json`, `sections/header-group.json`, `sections/cta-band.liquid`, `sections/page-hero.liquid`, `sections/header.liquid`, `sections/hero-lab.liquid`.

### 2. Mobile apps — “Apps we ship for” phones

File: `templates/page.mobile-apps.json` → section `signature` / `device-showcase`.

| Phone | Asset | Framing |
|-------|--------|---------|
| 1 Field / ops | `apphia-store-screen.png` (moved from 2nd) | default |
| 2 E-commerce companion (Apphia) | `apphia-site-path.png` | `image_pos_x: 70` (shifted **right** 20%) |
| 3 Consumer product (Brown Cows) | `brown-cows-hero.png` | **no zoom out** — leave at 100% |

Framing controls live in `sections/device-showcase.liquid` (`image_zoom`, `image_pos_x`, `image_pos_y`). CSS: `.device-showcase__phone .phone-screen img` uses `object-fit: cover` so the image fills the portrait phone (no black letterbox).

### 3. Page hero image cards (all service pages)

Problem: extra padded “card” larger than the image, and browser frames cropped with `object-fit: cover`.

Fix in `assets/components.css` + `sections/page-hero.liquid`:

- Plain heroes: card shrink-wraps image, centered, `object-fit: contain`
- Browser-frame heroes: **no fixed 16:10 crop**; image `contain`s; full screenshot visible (e.g. WAVERLY not cut to VERLY)

### 4. Marketplace growth Amazon dashboard

Not a static photo. Built component:

- Snippet: `snippets/amazon-growth-visual.liquid`
- CSS: `.amazon-growth-visual*` in `assets/components.css`
- Wired via `banner_visual: "amazon_growth"` on `page.marketplace-growth.json` and `page.amazon.json`

Looks like Seller Central: KPIs, dual area chart, Amazon / Walmart / Target+ bars, live pill.

### 5. Thumb-stack blur (**latest visual**)

Pattern: **blurred thumbnail fills the card; sharp image sits on top.**

| Piece | Path |
|-------|------|
| Shared snippet | `snippets/thumb-stack.liquid` |
| CSS | `.thumb-stack*` in `assets/components.css` |
| Homepage hero tiles | `sections/hero-lab.liquid` |
| Portfolio rail | `sections/portfolio-rail.liquid` |
| Work grid | `sections/work.liquid` |
| Page-hero browser | `sections/page-hero.liquid` |

If blur is too strong/weak, change `filter: blur(28px)` on `.thumb-stack__blur img`. Foreground size is `max-width/max-height: 90%` on `.thumb-stack__sharp img`.

---

## Files to open first on the other system

1. `FINAL_WORK.md` (this file)
2. `socal-devices/shopify-theme-v3/layout/theme.liquid` — confirm build marker
3. `socal-devices/shopify-theme-v3/assets/components.css` — almost all visual CSS
4. `socal-devices/shopify-theme-v3/sections/page-hero.liquid` — every inner-page hero
5. `socal-devices/shopify-theme-v3/snippets/thumb-stack.liquid` — last visual pattern
6. `socal-devices/shopify-theme-v3/snippets/amazon-growth-visual.liquid` — marketplace hero
7. `socal-devices/shopify-theme-v3/templates/page.mobile-apps.json` — phone showcase assets
8. `scripts/deploy_theme_v3_live.ps1` / `scripts/package_theme_v3.ps1`

---

## Page templates (Shopify admin)

If a URL looks like a plain text page, the **page template assignment** is wrong, not the zip.

| Handle | Template |
|--------|----------|
| `web-apps` | `web-apps` |
| `mobile-apps` | `mobile-apps` |
| `websites` | `websites` |
| `creative-studio` | `creative-studio` |
| `marketplace-growth` | `marketplace-growth` |
| `paid-media` | `paid-media` |
| `work` | `work` |
| `studio` | `studio` |

---

## Still open (not code, or next)

- Client must **Publish** uploaded zip on `socal-devices.myshopify.com` if they are not using CLI to that store
- Homepage hero tiles (`index.json` `t1`–`t4`) still have **taglines only** unless images are added in the theme editor — thumb-stack only shows once `asset_file` or `image` is set
- TRIPLE_REVIEW R1–R3 (positioning sign-off, domain, final quotes) still client-side
- Shopify Admin theme **library name** may still say “SoCal Labs v3 — LIVE”; on-site copy is `socal labs`
- After pulling on the new machine: `shopify theme list --store sarvs-store-nudaxw98.myshopify.com` to confirm you are logged into the right store before deploying

---

## Suggested next prompt for the other system

> Read FINAL_WORK.md. Work only in socal-devices/shopify-theme-v3. Latest live marker is data-theme-build="2026-08-07-thumb-stack-blur". Last visual is thumb-stack (blurred fill + sharp image). Deploy with scripts/deploy_theme_v3_live.ps1 and package with scripts/package_theme_v3.ps1. Branding is lowercase socal, not SoCal.
