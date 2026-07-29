# EIRION Brand Assets

Logo, favicon set, and colour tokens for EIRION. Everything here is generated
from one script, so the SVGs, the PNGs and the colour tokens can never drift
apart.

```
brand/
├─ logo/          wordmark lockups + standalone DNA mark
├─ favicon/       browser/app icons, .ico, webmanifest, <head> snippet
├─ tokens/        colour + type tokens as JSON, CSS and SCSS
└─ tools/         generate_brand_assets.py — regenerates all of the above
```

---

## 1. Logo

| File | Use |
| --- | --- |
| `logo/eirion-logo.svg` | **Primary.** Full colour on white or very light backgrounds. |
| `logo/eirion-logo-reverse.svg` | Dark backgrounds. White wordmark, lightened helix green. |
| `logo/eirion-logo-mono-green.svg` | One-colour forest green — embroidery, single-plate print. |
| `logo/eirion-logo-mono-white.svg` | One-colour white — photography, dark video. |
| `logo/eirion-logo-mono-black.svg` | One-colour black — fax, newsprint, legal documents. |
| `logo/eirion-mark.svg` | DNA mark alone, no wordmark. Avatars, watermarks, loading states. |
| `logo/eirion-mark-reverse.svg` | DNA mark for dark backgrounds. |
| `logo/eirion-mark-512.png` | Raster mark with transparency, for slides and docs. |

The wordmark reads **E · DNA helix · R I O N** — the helix *is* the first I. It
is never decoration and must never be moved, duplicated, or dropped.

### Clear space

Keep a margin of **half the cap height of the E** clear on all four sides. At
the SVG's native scale the cap height is 160 units, so that is 80 units. A
quarter of it is already baked into the artboard; add the rest yourself.

### Minimum size

| Asset | Screen | Print |
| --- | --- | --- |
| Full logo | 140 px wide | 32 mm wide |
| DNA mark | 16 px | 6 mm |

Below 140 px the base pairs inside the helix close up. Use the mark instead.

### Don't

- Don't recolour the wordmark to anything outside the palette below.
- Don't put the full-colour logo on a mid-tone background — use reverse or mono.
- Don't stretch, skew, rotate, outline, or add effects (shadow, bevel, glow).
- Don't rebuild the wordmark by typing "EIRION" in a serif font; the shipped
  SVGs are outlined and letterspaced. Use the files.
- Don't place the logo over a busy photo without a solid or scrimmed panel.

---

## 2. Colour

Sampled directly from the original logo artwork — the green is the mean of
43,900 wordmark pixels, the gold the mean of 4,300 helix pixels.

### Core

| Token | Hex | Role | On white |
| --- | --- | --- | --- |
| Forest Green | `#033A12` | Primary. Wordmark, headers, primary buttons. | 12.98:1 ✅ AAA |
| Helix Green | `#00722A` | Secondary. Links, focus rings, success states. | 6.10:1 ✅ AA |
| Gold | `#E3AC18` | Accent only. Rules, highlights, chart accents. | 2.06:1 ❌ |
| Gold Light | `#E5C762` | Baseline rule, helix base pairs, dividers. | — |
| Ink | `#0E1A12` | Body text. | 17.87:1 ✅ AAA |
| Paper | `#FFFFFF` | Base surface. | — |

> **Gold is not a text colour.** At 2.06:1 on white it fails WCAG AA for any
> text size. Use it for rules, fills, icons and accents; for gold-coloured text
> use `gold-800` (`#916E0F`) on white, or Gold on Forest Green (6.29:1 ✅).

### Ramps

Each brand colour carries an 11-step scale, anchored at `600`.

| | 50 | 100 | 200 | 300 | 400 | 500 | **600** | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| forest | `#F0F3F1` | `#DEE5E0` | `#BDCCC1` | `#90A897` | `#597D63` | `#2B5A38` | **`#033A12`** | `#02300F` | `#02250C` | `#011A08` | `#011005` |
| helix | `#F0F7F2` | `#DEEDE3` | `#BDDAC8` | `#8FC1A1` | `#57A272` | `#29894C` | **`#00722A`** | `#005D22` | `#00491B` | `#003313` | `#00200C` |
| gold | `#FDFAF1` | `#FBF4E1` | `#F8E9C3` | `#F3DA99` | `#EDC867` | `#E7B93D` | **`#E3AC18`** | `#BA8D14` | `#916E0F` | `#664D0B` | `#403007` |
| slate | `#F5F6F5` | `#EAECEA` | `#D4D9D6` | `#B7BEB9` | `#939D96` | `#758379` | **`#5B6B60`** | `#4B584F` | `#3A443D` | `#29302B` | `#191E1B` |

### Semantic tokens

`tokens/eirion-brand.css` exposes a full light and dark set as
`--eirion-ui-*` custom properties (`bg`, `surface`, `border`, `text`,
`text-muted`, `brand`, `accent`, `focus`, `success`, `warning`, `danger`,
`info`). Dark mode is wired to both `prefers-color-scheme` and an explicit
`data-theme` attribute, so a theme toggle overrides the OS in either direction.

```css
@import url("/brand/tokens/eirion-brand.css");

.btn-primary {
  background: var(--eirion-ui-brand);
  color: var(--eirion-ui-text-inverse);
  border-radius: var(--eirion-radius-md);
}
```

SCSS consumers get `$eirion-forest-600` style variables plus `$eirion-light` /
`$eirion-dark` maps from `tokens/_eirion-brand.scss`.

---

## 3. Favicon & app icons

Copy `brand/favicon/` to your web root and paste `head-snippet.html`:

```html
<link rel="icon" href="/brand/favicon/favicon.ico" sizes="48x48">
<link rel="icon" href="/brand/favicon/eirion-icon.svg" type="image/svg+xml" sizes="any">
<link rel="apple-touch-icon" href="/brand/favicon/apple-touch-icon.png">
<link rel="manifest" href="/brand/favicon/site.webmanifest">
<meta name="theme-color" content="#033A12">
```

`favicon.ico` is a genuine multi-resolution icon — 16/24/32/48/64/128/256 —
and **each entry is drawn at its own size**, not downsampled from the largest.
Below 32 px the base pairs are dropped and the strands thickened, because a
faithful downsample turns to mud at tab size.

`icon-512-maskable.png` and `eirion-icon-maskable.svg` carry the 30% safe-area
padding Android requires; the others use the tighter optical padding.

---

## 4. Typography

| Role | Family | Notes |
| --- | --- | --- |
| Wordmark | Times New Roman Bold | Outlined in the SVGs; never re-set as live text. |
| Headings | Source Serif 4 → Georgia → serif | Echoes the wordmark. |
| Body | Inter → Segoe UI → system-ui | 16px / 1.55. |
| Mono | JetBrains Mono → Cascadia Code → Consolas | Code, IDs, hashes. |

---

## 5. Regenerating

```bash
python brand/tools/generate_brand_assets.py
```

Requires `fonttools` and `Pillow`, plus `C:\Windows\Fonts\timesbd.ttf`. Every
file outside `tools/` is output — edit the script, not the assets. The helix
geometry is parametric (two sine strands, two lobes, pinching at t = 0, ½, 1)
and is shared by the SVG writer and the PNG rasteriser, so the vector and
raster marks are the same shape by construction.

---

## 6. Provenance and open items

- The wordmark is a **vector reconstruction**, traced by matching the original
  raster (`apps/aina/src/app/core/assets/logos/EIRION-logo-transparent.png`)
  against installed serifs; Times New Roman Bold is a near-exact match. If the
  original vector artwork surfaces, replace `logo/*.svg` and re-derive.
- The wordmark uses Times New Roman outlines. Monotype's desktop licence
  generally permits outlined logo use, but confirm with legal before
  trademark filing.
- **Palette conflict:** `EIRION-Platform-Capabilities.html` at the repo root
  uses an unrelated teal system (`#0B6B74`, `#2BB7C2`). That is not the brand
  palette and should be migrated to these tokens or explicitly retired.
- The app currently ships its own `apps/aina/src/favicon.ico` and
  `favicon.png`; point them at `brand/favicon/` when you next touch the build.
