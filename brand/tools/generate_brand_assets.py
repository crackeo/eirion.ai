"""
Regenerates every file under brand/ from source geometry.

Run:  python brand/tools/generate_brand_assets.py

The wordmark is set in Times New Roman Bold and converted to outlines, so the
emitted SVGs carry no font dependency. Brand colours were sampled from
apps/aina/src/app/core/assets/logos/EIRION-logo-transparent.png (see PALETTE).
"""

import json
import math
import os
import struct

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw

# --------------------------------------------------------------------------
# Brand constants
# --------------------------------------------------------------------------

FOREST = "#033A12"   # wordmark green, sampled mean of 43.9k logo pixels
HELIX = "#00722A"    # DNA strand green
GOLD = "#E3AC18"     # DNA strand gold
GOLD_LIGHT = "#E5C762"  # baseline rule / rung gold
INK = "#0E1A12"      # near-black text
PAPER = "#FFFFFF"
HELIX_ON_DARK = "#6FCB8F"  # strand green lightened for dark fields

FONT = r"C:\Windows\Fonts\timesbd.ttf"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO_DIR = os.path.join(ROOT, "logo")
ICON_DIR = os.path.join(ROOT, "favicon")
TOKEN_DIR = os.path.join(ROOT, "tokens")

# --------------------------------------------------------------------------
# Colour helpers
# --------------------------------------------------------------------------


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgb_to_hex(rgb):
    return "#%02X%02X%02X" % tuple(max(0, min(255, round(c))) for c in rgb)


def mix(a, b, t):
    ra, rb = hex_to_rgb(a), hex_to_rgb(b)
    return rgb_to_hex([ra[i] + (rb[i] - ra[i]) * t for i in range(3)])


def relative_luminance(h):
    def chan(c):
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (chan(c) for c in hex_to_rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = relative_luminance(a), relative_luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return round((hi + 0.05) / (lo + 0.05), 2)


def ramp(base, name):
    """11-step tint/shade scale anchored on the brand colour at 600."""
    stops = {
        "50": mix(PAPER, base, 0.06), "100": mix(PAPER, base, 0.13),
        "200": mix(PAPER, base, 0.26), "300": mix(PAPER, base, 0.44),
        "400": mix(PAPER, base, 0.66), "500": mix(PAPER, base, 0.84),
        "600": base,
        "700": mix(base, "#000000", 0.18), "800": mix(base, "#000000", 0.36),
        "900": mix(base, "#000000", 0.55), "950": mix(base, "#000000", 0.72),
    }
    return {name: stops}


# --------------------------------------------------------------------------
# Helix geometry — one source of truth, used by both the SVG and PNG writers
# --------------------------------------------------------------------------

LOBES = 2          # two full lobes, pinching at t = 0, 0.5, 1
SAMPLES = 96


def strand_points(x, y, w, h, phase, inset):
    """Sample one DNA strand across the box (x, y, w, h)."""
    cx = x + w / 2
    amp = (w - inset) / 2
    pts = []
    for i in range(SAMPLES + 1):
        t = i / SAMPLES
        pts.append((cx + phase * amp * math.sin(math.pi * LOBES * t),
                    y + t * h))
    return pts


def rung_segments(x, y, w, h, inset, count=13):
    """Horizontal base-pair rungs, skipped near the pinch points."""
    cx = x + w / 2
    amp = (w - inset) / 2
    out = []
    for i in range(1, count + 1):
        t = i / (count + 1)
        dx = amp * math.sin(math.pi * LOBES * t)
        if abs(dx) < amp * 0.30:
            continue
        yy = y + t * h
        out.append(((cx - dx, yy), (cx + dx, yy)))
    return out


def catmull_path(pts):
    """Smooth cubic path through sampled points."""
    d = "M%.2f,%.2f" % pts[0]
    for i in range(len(pts) - 1):
        p0 = pts[max(i - 1, 0)]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[min(i + 2, len(pts) - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += "C%.2f,%.2f %.2f,%.2f %.2f,%.2f" % (c1 + c2 + p2)
    return d


def slice_pts(pts, t0, t1):
    lo = int(t0 * (len(pts) - 1))
    hi = int(t1 * (len(pts) - 1))
    return pts[lo:hi + 1]


def helix_svg(x, y, w, h, gold, green, rung, stroke=None):
    """Return SVG markup for the DNA mark inside the given box."""
    sw = stroke if stroke else w * 0.175
    inset = sw
    a = strand_points(x, y, w, h, +1, inset)   # gold
    b = strand_points(x, y, w, h, -1, inset)   # green
    cap = sw * 0.62

    parts = ['<g fill="none" stroke-linecap="round" stroke-linejoin="round">']
    # base pairs sit behind both strands
    parts.append('<g stroke="%s" stroke-width="%.2f" opacity="0.85">' % (rung, sw * 0.42))
    for (p, q) in rung_segments(x, y, w, h, inset):
        parts.append('<path d="M%.2f,%.2f L%.2f,%.2f"/>' % (p + q))
    parts.append("</g>")
    # gold behind, green over it, then gold's lower lobe back on top
    parts.append('<path stroke="%s" stroke-width="%.2f" d="%s"/>' % (gold, sw, catmull_path(a)))
    parts.append('<path stroke="%s" stroke-width="%.2f" d="%s"/>' % (green, sw, catmull_path(b)))
    parts.append('<path stroke="%s" stroke-width="%.2f" d="%s"/>'
                 % (gold, sw, catmull_path(slice_pts(a, 0.52, 1.0))))
    parts.append("</g>")
    # terminals
    cx = x + w / 2
    parts.append('<circle cx="%.2f" cy="%.2f" r="%.2f" fill="%s"/>' % (cx, y, cap, green))
    parts.append('<circle cx="%.2f" cy="%.2f" r="%.2f" fill="%s"/>' % (cx, y + h, cap, gold))
    return "\n  ".join(parts)


# --------------------------------------------------------------------------
# Wordmark outlines
# --------------------------------------------------------------------------

_font = TTFont(FONT)
_glyphs = _font.getGlyphSet()
_cmap = _font.getBestCmap()
UPEM = _font["head"].unitsPerEm
CAP = _font["OS/2"].sCapHeight if hasattr(_font["OS/2"], "sCapHeight") else 1465


def glyph_path(ch, size, pen_x, baseline):
    name = _cmap[ord(ch)]
    s = size / UPEM
    pen = SVGPathPen(_glyphs)
    _glyphs[name].draw(TransformPen(pen, (s, 0, 0, -s, pen_x, baseline)))
    return pen.getCommands(), _glyphs[name].width * s


HELIX_SLOT = 1.75    # advance reserved for the DNA "I", in "I" widths
HELIX_WIDTH = 1.15   # drawn width of the DNA "I", in "I" widths
HELIX_HEIGHT = 1.34  # drawn height, in cap heights
HELIX_DROP = 0.06    # descends below the baseline, in cap heights


def wordmark(size, baseline, start_x, tracking, colour, helix_kw=None):
    """Lay out E + [DNA] + RION. Returns (svg, total_width, helix_box)."""
    out = []
    x = start_x
    helix_box = None
    cap_h = size * (CAP / UPEM)
    _, i_adv = glyph_path("I", size, 0, 0)
    for ch in "E*RION":
        if ch == "*":
            hw = i_adv * HELIX_WIDTH
            hh = cap_h * HELIX_HEIGHT
            hx = x + (i_adv * HELIX_SLOT - hw) / 2
            hy = baseline - cap_h - (hh - cap_h) / 2 + cap_h * HELIX_DROP
            helix_box = (hx, hy, hw, hh)
            if helix_kw:
                out.append(helix_svg(hx, hy, hw, hh, **helix_kw))
            x += i_adv * HELIX_SLOT + tracking
            continue
        d, adv = glyph_path(ch, size, x, baseline)
        out.append('<path fill="%s" d="%s"/>' % (colour, d))
        x += adv + tracking
    return "\n  ".join(out), x - tracking - start_x, helix_box


# --------------------------------------------------------------------------
# Logo files
# --------------------------------------------------------------------------

SIZE = 224.0
BASELINE = 232.0
PAD = 40.0
RULE_GAP = 60.0
RULE_W = 5.0


def build_logo(path, word_colour, gold, green, rung, rule, bg=None, title="EIRION"):
    body, width, _ = wordmark(
        SIZE, BASELINE, PAD, 4.0, word_colour,
        helix_kw=dict(gold=gold, green=green, rung=rung))
    total_w = width + PAD * 2
    total_h = BASELINE + RULE_GAP + RULE_W + PAD * 0.6
    rule_y = BASELINE + RULE_GAP
    layers = []
    if bg:
        layers.append('<rect width="%.0f" height="%.0f" fill="%s"/>' % (total_w, total_h, bg))
    layers.append(body)
    if rule:
        layers.append('<rect x="%.2f" y="%.2f" width="%.2f" height="%.2f" fill="%s"/>'
                      % (PAD, rule_y, width, RULE_W, rule))
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.0f %.0f" '
        'width="%.0f" height="%.0f" role="img" aria-label="%s">\n  '
        '<title>%s</title>\n  %s\n</svg>\n'
        % (total_w, total_h, total_w, total_h, title, title, "\n  ".join(layers))
    )
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg)
    return total_w, total_h


MARK_ASPECT = 0.55   # helix width : height inside a square mark


def build_mark(path, gold, green, rung, bg=None, radius=0.0, pad_ratio=0.20):
    box = 512.0
    hw = box * (1 - 2 * pad_ratio) * MARK_ASPECT
    hh = box * (1 - 2 * pad_ratio)
    hx = (box - hw) / 2
    hy = (box - hh) / 2
    layers = []
    if bg:
        layers.append('<rect width="512" height="512" rx="%.0f" fill="%s"/>' % (radius, bg))
    layers.append(helix_svg(hx, hy, hw, hh, gold=gold, green=green, rung=rung))
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" '
           'width="512" height="512" role="img" aria-label="EIRION">\n  '
           '<title>EIRION</title>\n  %s\n</svg>\n' % "\n  ".join(layers))
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg)


# --------------------------------------------------------------------------
# Raster icons (PIL, 8x supersampled — no SVG rasteriser needed)
# --------------------------------------------------------------------------


def draw_helix_raster(draw, x, y, w, h, gold, green, rung, stroke_ratio=0.175):
    sw = w * stroke_ratio
    inset = sw
    a = strand_points(x, y, w, h, +1, inset)
    b = strand_points(x, y, w, h, -1, inset)
    if rung is not None:
        for (p, q) in rung_segments(x, y, w, h, inset):
            draw.line([p, q], fill=rung, width=max(1, int(sw * 0.42)))
    draw.line(a, fill=gold, width=int(sw), joint="curve")
    draw.line(b, fill=green, width=int(sw), joint="curve")
    draw.line(slice_pts(a, 0.52, 1.0), fill=gold, width=int(sw), joint="curve")
    r = sw * 0.62
    cx = x + w / 2
    for cy, col in ((y, green), (y + h, gold)):
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)
    # round the strand ends
    for pts, col in ((a, gold), (b, green)):
        for px, py in (pts[0], pts[-1]):
            draw.ellipse([px - sw / 2, py - sw / 2, px + sw / 2, py + sw / 2], fill=col)


def icon_optics(size):
    """Small icons need less padding and fatter strands to stay legible."""
    if size <= 32:
        return 0.09, 0.215
    if size <= 64:
        return 0.13, 0.195
    return 0.18, 0.175


def render_icon(size, bg, gold, green, rung, radius_ratio=0.22,
                pad_ratio=None, stroke_ratio=None):
    auto_pad, auto_stroke = icon_optics(size)
    pad_ratio = auto_pad if pad_ratio is None else pad_ratio
    stroke_ratio = auto_stroke if stroke_ratio is None else stroke_ratio
    ss = 8
    n = size * ss
    img = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if bg:
        d.rounded_rectangle([0, 0, n - 1, n - 1], radius=n * radius_ratio, fill=bg)
    hh = n * (1 - 2 * pad_ratio)
    hw = hh * MARK_ASPECT
    # base pairs turn to mud below ~32px, so drop them there
    draw_helix_raster(d, (n - hw) / 2, (n - hh) / 2, hw, hh,
                      gold, green, rung if size > 24 else None, stroke_ratio)
    return img.resize((size, size), Image.LANCZOS)


# --------------------------------------------------------------------------
# Tokens
# --------------------------------------------------------------------------


def build_tokens():
    palette = {}
    palette.update(ramp(FOREST, "forest"))
    palette.update(ramp(HELIX, "helix"))
    palette.update(ramp(GOLD, "gold"))
    palette.update(ramp("#5B6B60", "slate"))

    core = {
        "forest-green": FOREST, "helix-green": HELIX,
        "gold": GOLD, "gold-light": GOLD_LIGHT,
        "ink": INK, "paper": PAPER,
    }
    semantic_light = {
        "bg": "#FFFFFF", "bg-subtle": palette["forest"]["50"],
        "surface": "#FFFFFF", "surface-raised": palette["slate"]["50"],
        "border": palette["slate"]["200"], "border-strong": palette["slate"]["300"],
        "text": INK, "text-muted": palette["slate"]["700"],
        "text-inverse": "#FFFFFF",
        "brand": FOREST, "brand-hover": palette["forest"]["700"],
        "brand-subtle": palette["forest"]["100"],
        "accent": GOLD, "accent-hover": palette["gold"]["700"],
        "accent-subtle": palette["gold"]["100"],
        "focus": HELIX,
        "success": "#1E7B45", "warning": "#B4780C",
        "danger": "#A3231C", "info": "#0F6A78",
    }
    semantic_dark = {
        "bg": "#07130C", "bg-subtle": "#0C1D13",
        "surface": "#0C1D13", "surface-raised": "#12291B",
        "border": "#1E3D28", "border-strong": "#2C5638",
        "text": "#E8F1EA", "text-muted": "#A6BCAE",
        "text-inverse": INK,
        "brand": "#4FB878", "brand-hover": "#6FCB8F",
        "brand-subtle": "#12291B",
        "accent": GOLD, "accent-hover": GOLD_LIGHT,
        "accent-subtle": "#2A2311",
        "focus": "#6FCB8F",
        "success": "#4FB878", "warning": "#E0B341",
        "danger": "#E8776F", "info": "#4FC3D4",
    }

    tokens = {
        "$schema": "https://design-tokens.org/schema.json",
        "name": "EIRION Brand Tokens",
        "version": "1.0.0",
        "source": "Sampled from EIRION-logo-transparent.png",
        "color": {"core": core, "palette": palette,
                  "semantic": {"light": semantic_light, "dark": semantic_dark}},
        "typography": {
            "wordmark": {"family": "Times New Roman", "weight": "700",
                         "tracking": "0.018em", "case": "uppercase"},
            "heading": {"family": "'Source Serif 4', Georgia, 'Times New Roman', serif",
                        "weight": "600"},
            "body": {"family": "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
                     "weight": "400", "size": "16px", "lineHeight": "1.55"},
            "mono": {"family": "'JetBrains Mono', 'Cascadia Code', Consolas, monospace"},
            "scale": {"xs": "12px", "sm": "14px", "base": "16px", "lg": "18px",
                      "xl": "22px", "2xl": "28px", "3xl": "36px", "4xl": "48px",
                      "5xl": "64px"},
        },
        "radius": {"sm": "4px", "md": "8px", "lg": "12px", "xl": "20px", "pill": "999px"},
        "space": {"1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "24px",
                  "6": "32px", "7": "48px", "8": "64px"},
        "shadow": {
            "sm": "0 1px 2px rgba(3,58,18,.08)",
            "md": "0 4px 12px rgba(3,58,18,.10)",
            "lg": "0 12px 32px rgba(3,58,18,.14)",
        },
        "contrast": {
            "forest-on-white": contrast(FOREST, "#FFFFFF"),
            "helix-on-white": contrast(HELIX, "#FFFFFF"),
            "gold-on-white": contrast(GOLD, "#FFFFFF"),
            "gold-on-forest": contrast(GOLD, FOREST),
            "white-on-forest": contrast("#FFFFFF", FOREST),
            "ink-on-white": contrast(INK, "#FFFFFF"),
        },
    }

    with open(os.path.join(TOKEN_DIR, "eirion-brand.json"), "w", encoding="utf-8") as f:
        json.dump(tokens, f, indent=2)
        f.write("\n")

    # ---- CSS custom properties -------------------------------------------
    def block(d, prefix, indent="  "):
        return "\n".join("%s--eirion-%s-%s: %s;" % (indent, prefix, k, v)
                         for k, v in d.items())

    css = ["/* EIRION brand tokens — generated, do not edit by hand. */", ":root {"]
    css.append("  /* core brand */")
    css.append(block(core, "color"))
    css.append("\n  /* palette ramps */")
    for name, stops in palette.items():
        css.append(block(stops, name))
    css.append("\n  /* semantic (light) */")
    css.append(block(semantic_light, "ui"))
    css.append("\n  /* typography */")
    css.append("  --eirion-font-heading: %s;" % tokens["typography"]["heading"]["family"])
    css.append("  --eirion-font-body: %s;" % tokens["typography"]["body"]["family"])
    css.append("  --eirion-font-mono: %s;" % tokens["typography"]["mono"]["family"])
    css.append(block(tokens["radius"], "radius"))
    css.append(block(tokens["space"], "space"))
    css.append(block(tokens["shadow"], "shadow"))
    css.append("}")
    css.append("\n@media (prefers-color-scheme: dark) {\n  :root {")
    css.append(block(semantic_dark, "ui", "    "))
    css.append("  }\n}")
    css.append('\n:root[data-theme="dark"] {')
    css.append(block(semantic_dark, "ui"))
    css.append("}")
    css.append('\n:root[data-theme="light"] {')
    css.append(block(semantic_light, "ui"))
    css.append("}")
    with open(os.path.join(TOKEN_DIR, "eirion-brand.css"), "w", encoding="utf-8") as f:
        f.write("\n".join(css) + "\n")

    # ---- SCSS ------------------------------------------------------------
    scss = ["// EIRION brand tokens — generated, do not edit by hand.", ""]
    for k, v in core.items():
        scss.append("$eirion-%s: %s;" % (k, v))
    scss.append("")
    for name, stops in palette.items():
        for k, v in stops.items():
            scss.append("$eirion-%s-%s: %s;" % (name, k, v))
        scss.append("")
    scss.append("$eirion-light: (")
    scss += ["  '%s': %s," % (k, v) for k, v in semantic_light.items()]
    scss.append(");\n")
    scss.append("$eirion-dark: (")
    scss += ["  '%s': %s," % (k, v) for k, v in semantic_dark.items()]
    scss.append(");")
    with open(os.path.join(TOKEN_DIR, "_eirion-brand.scss"), "w", encoding="utf-8") as f:
        f.write("\n".join(scss) + "\n")

    return tokens


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------


def main():
    for d in (LOGO_DIR, ICON_DIR, TOKEN_DIR):
        os.makedirs(d, exist_ok=True)

    # --- logo lockups -----------------------------------------------------
    build_logo(os.path.join(LOGO_DIR, "eirion-logo.svg"),
               FOREST, GOLD, HELIX, GOLD_LIGHT, GOLD_LIGHT)
    build_logo(os.path.join(LOGO_DIR, "eirion-logo-reverse.svg"),
               "#FFFFFF", GOLD, HELIX_ON_DARK, GOLD, GOLD)
    build_logo(os.path.join(LOGO_DIR, "eirion-logo-mono-green.svg"),
               FOREST, FOREST, FOREST, FOREST, FOREST)
    build_logo(os.path.join(LOGO_DIR, "eirion-logo-mono-white.svg"),
               "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF")
    build_logo(os.path.join(LOGO_DIR, "eirion-logo-mono-black.svg"),
               "#000000", "#000000", "#000000", "#000000", "#000000")

    # --- marks ------------------------------------------------------------
    build_mark(os.path.join(LOGO_DIR, "eirion-mark.svg"), GOLD, HELIX, GOLD_LIGHT)
    build_mark(os.path.join(LOGO_DIR, "eirion-mark-reverse.svg"),
               GOLD, HELIX_ON_DARK, GOLD)
    # matches the 33-64px raster padding so the SVG favicon and the PNG
    # fallbacks look like the same icon in a browser tab
    build_mark(os.path.join(ICON_DIR, "eirion-icon.svg"),
               GOLD, HELIX_ON_DARK, GOLD, bg=FOREST, radius=112, pad_ratio=0.13)
    build_mark(os.path.join(ICON_DIR, "eirion-icon-maskable.svg"),
               GOLD, HELIX_ON_DARK, GOLD, bg=FOREST, radius=0, pad_ratio=0.30)

    # --- raster icons -----------------------------------------------------
    bg = hex_to_rgb(FOREST) + (255,)
    gold = hex_to_rgb(GOLD) + (255,)
    green = hex_to_rgb(HELIX_ON_DARK) + (255,)
    rung = hex_to_rgb(GOLD) + (170,)

    for size in (16, 32, 48, 64, 180, 192, 256, 512):
        render_icon(size, bg, gold, green, rung).save(
            os.path.join(ICON_DIR, "icon-%d.png" % size))
    render_icon(180, bg, gold, green, rung).save(
        os.path.join(ICON_DIR, "apple-touch-icon.png"))
    render_icon(512, bg, gold, green, rung, radius_ratio=0.0, pad_ratio=0.30).save(
        os.path.join(ICON_DIR, "icon-512-maskable.png"))
    # transparent-background mark for docs/slides
    render_icon(512, None, hex_to_rgb(GOLD) + (255,), hex_to_rgb(HELIX) + (255,),
                hex_to_rgb(GOLD_LIGHT) + (200,), pad_ratio=0.06).save(
        os.path.join(LOGO_DIR, "eirion-mark-512.png"))

    # each .ico entry is rendered at its own size so 16px gets the fat-strand
    # treatment rather than a blurry downsample of the 256px art
    # Pillow drops any requested size larger than the base image, so the
    # largest frame has to be the one we call save() on.
    ico_sizes = [256, 128, 64, 48, 32, 24, 16]
    frames = [render_icon(s, bg, gold, green, rung) for s in ico_sizes]
    frames[0].save(os.path.join(ICON_DIR, "favicon.ico"), format="ICO",
                   sizes=[(s, s) for s in ico_sizes],
                   append_images=frames[1:])

    # --- PWA manifest + head snippet --------------------------------------
    manifest = {
        "name": "EIRION",
        "short_name": "EIRION",
        "description": "EIRION platform",
        "start_url": "/",
        "display": "standalone",
        "background_color": PAPER,
        "theme_color": FOREST,
        "icons": [
            {"src": "/brand/favicon/eirion-icon.svg", "sizes": "any", "type": "image/svg+xml"},
            {"src": "/brand/favicon/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/brand/favicon/icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "/brand/favicon/icon-512-maskable.png", "sizes": "512x512",
             "type": "image/png", "purpose": "maskable"},
        ],
    }
    with open(os.path.join(ICON_DIR, "site.webmanifest"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")

    head = """<!-- EIRION favicon set — paste into <head> -->
<link rel="icon" href="/brand/favicon/favicon.ico" sizes="48x48">
<link rel="icon" href="/brand/favicon/eirion-icon.svg" type="image/svg+xml" sizes="any">
<link rel="apple-touch-icon" href="/brand/favicon/apple-touch-icon.png">
<link rel="manifest" href="/brand/favicon/site.webmanifest">
<meta name="theme-color" content="%s">
""" % FOREST
    with open(os.path.join(ICON_DIR, "head-snippet.html"), "w", encoding="utf-8") as f:
        f.write(head)

    tokens = build_tokens()

    print("brand assets written")
    for k, v in tokens["contrast"].items():
        print("  contrast %-20s %.2f:1" % (k, v))


if __name__ == "__main__":
    main()
