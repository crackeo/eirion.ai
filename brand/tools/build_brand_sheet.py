"""
Builds brand/brand-sheet.html — a self-contained specimen sheet.

Run after generate_brand_assets.py. Every logo is inlined as SVG and every
icon as a data URI, so the page shows the real generated files and works with
no network access.
"""

import base64
import io
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOKENS = json.load(io.open(os.path.join(ROOT, "tokens", "eirion-brand.json"),
                           encoding="utf-8"))
CORE = TOKENS["color"]["core"]
PALETTE = TOKENS["color"]["palette"]
CONTRAST = TOKENS["contrast"]


def svg(rel, width):
    """Inline an SVG, forcing a render width and stripping the fixed size."""
    s = io.open(os.path.join(ROOT, rel), encoding="utf-8").read()
    s = re.sub(r'\swidth="[\d.]+"\s+height="[\d.]+"', "", s, count=1)
    return s.replace("<svg", '<svg style="width:%s;height:auto;display:block"' % width, 1)


def uri(rel):
    with open(os.path.join(ROOT, rel), "rb") as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode()


def contrast_badge(ratio):
    if ratio >= 7:
        return '<span class="chip chip-aaa">%.2f:1 AAA</span>' % ratio
    if ratio >= 4.5:
        return '<span class="chip chip-aa">%.2f:1 AA</span>' % ratio
    if ratio >= 3:
        return '<span class="chip chip-lg">%.2f:1 large only</span>' % ratio
    return '<span class="chip chip-fail">%.2f:1 fails</span>' % ratio


CSS = """
:root {
  --paper: #F7F8F5;
  --surface: #FFFFFF;
  --ink: #0E1A12;
  --muted: #5B6B60;
  --line: #DCE2DD;
  --forest: #033A12;
  --helix: #00722A;
  --gold: #E3AC18;
  --gold-deep: #916E0F;
  --rule: #E5C762;
  --ok: #1E7B45;
  --warn: #B4780C;
  --bad: #A3231C;
  --swatch-ring: rgba(3,58,18,.14);
  --display: Georgia, "Times New Roman", "Liberation Serif", serif;
  --body: "Segoe UI", system-ui, -apple-system, "Helvetica Neue", sans-serif;
  --mono: "Cascadia Code", Consolas, "SF Mono", "Roboto Mono", monospace;
}
@media (prefers-color-scheme: dark) {
  :root {
    --paper: #07130C;
    --surface: #0C1D13;
    --ink: #E8F1EA;
    --muted: #9DB4A6;
    --line: #1E3D28;
    --forest: #4FB878;
    --helix: #6FCB8F;
    --gold-deep: #E7B93D;
    --ok: #4FB878;
    --warn: #E0B341;
    --bad: #E8776F;
    --swatch-ring: rgba(255,255,255,.16);
  }
}
:root[data-theme="dark"] {
  --paper: #07130C;
  --surface: #0C1D13;
  --ink: #E8F1EA;
  --muted: #9DB4A6;
  --line: #1E3D28;
  --forest: #4FB878;
  --helix: #6FCB8F;
  --gold-deep: #E7B93D;
  --ok: #4FB878;
  --warn: #E0B341;
  --bad: #E8776F;
  --swatch-ring: rgba(255,255,255,.16);
}
:root[data-theme="light"] {
  --paper: #F7F8F5;
  --surface: #FFFFFF;
  --ink: #0E1A12;
  --muted: #5B6B60;
  --line: #DCE2DD;
  --forest: #033A12;
  --helix: #00722A;
  --gold-deep: #916E0F;
  --ok: #1E7B45;
  --warn: #B4780C;
  --bad: #A3231C;
  --swatch-ring: rgba(3,58,18,.14);
}

* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: clamp(28px, 5vw, 72px) clamp(20px, 5vw, 48px) 96px;
  display: flex;
  flex-direction: column;
  gap: clamp(48px, 6vw, 80px);
}

/* the gold hairline under the wordmark, reused as the page's only divider */
.sec { display: flex; flex-direction: column; gap: 24px; }
.sec > header { display: flex; flex-direction: column; gap: 6px; }
.sec > header::after {
  content: "";
  height: 3px;
  background: var(--rule);
  margin-top: 14px;
}
.eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--muted);
}
h1, h2 { font-family: var(--display); font-weight: 700; margin: 0; text-wrap: balance; }
h1 { font-size: clamp(30px, 4.6vw, 46px); line-height: 1.1; letter-spacing: -.01em; }
h2 { font-size: clamp(21px, 2.6vw, 27px); line-height: 1.2; }
h3 {
  font-family: var(--mono); font-size: 11px; font-weight: 600;
  letter-spacing: .14em; text-transform: uppercase;
  color: var(--muted); margin: 0;
}
p { margin: 0; max-width: 66ch; }
.lede { font-size: 17px; color: var(--muted); }
.note { font-size: 14px; color: var(--muted); }
code, .mono { font-family: var(--mono); font-size: .88em; }
a { color: var(--helix); }

/* ---- masthead ---- */
.masthead {
  display: flex; flex-direction: column; gap: 28px;
}
.masthead-logo {
  background: #FFFFFF;
  border: 1px solid var(--line);
  padding: clamp(24px, 5vw, 48px) clamp(24px, 6vw, 64px);
}
.meta {
  display: flex; flex-wrap: wrap; gap: 8px 28px;
  font-family: var(--mono); font-size: 12px; color: var(--muted);
}
.meta b { color: var(--ink); font-weight: 600; }

/* ---- logo variants ---- */
.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
.tile { display: flex; flex-direction: column; gap: 10px; }
.tile .stage {
  border: 1px solid var(--line);
  padding: 26px 22px;
  display: flex; align-items: center; justify-content: center;
  min-height: 132px;
}
/* border stays var(--line) on every stage so dark tiles keep an edge
   against the dark page ground */
.stage-light { background: #FFFFFF; }
.stage-dark  { background: #033A12; }
.stage-ink   { background: #0E1A12; }
.tile figcaption { font-family: var(--mono); font-size: 11.5px; color: var(--muted); }
.tile figcaption b { display: block; color: var(--ink); font-weight: 600; letter-spacing: .04em; }

/* ---- clear space ---- */
.clearspace {
  background: #FFFFFF; border: 1px solid var(--line);
  padding: 32px; overflow-x: auto;
}
.cs-frame { position: relative; min-width: 420px; }
.cs-guide {
  position: absolute; inset: 0;
  outline: 1px dashed rgba(3,58,18,.35); outline-offset: 0;
}
.cs-pad { padding: var(--cs); }
.cs-tick {
  position: absolute; left: 0; top: 0; width: var(--cs); aspect-ratio: 1;
  background: rgba(227,172,24,.30);
  box-shadow: inset 0 0 0 1px rgba(227,172,24,.75);
}

/* ---- colour ---- */
.swatches { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px; }
.sw { display: flex; flex-direction: column; gap: 9px; }
.sw .chipbox {
  height: 92px; border-radius: 2px;
  box-shadow: inset 0 0 0 1px var(--swatch-ring);
}
.sw-name { font-weight: 600; font-size: 14.5px; line-height: 1.3; }
.sw-hex { font-family: var(--mono); font-size: 12.5px; color: var(--muted); text-transform: uppercase; }
.sw-role { font-size: 13px; color: var(--muted); line-height: 1.45; }
.chip {
  display: inline-block; font-family: var(--mono); font-size: 10.5px;
  letter-spacing: .04em; padding: 2px 7px; border-radius: 2px;
  border: 1px solid currentColor;
}
.chip-aaa, .chip-aa { color: var(--ok); }
.chip-lg { color: var(--warn); }
.chip-fail { color: var(--bad); }

.ramp { display: flex; flex-direction: column; gap: 7px; }
.ramp-row { display: flex; border-radius: 2px; overflow: hidden; box-shadow: inset 0 0 0 1px var(--swatch-ring); }
.ramp-cell { flex: 1; height: 54px; position: relative; }
/* the anchor is called out by width and by the bold label beneath, not by
   in-cell text that would sit at 1.7:1 on the gold ramp */
.ramp-cell[data-anchor] { flex: 1.6; }
.ramp-scale {
  display: flex; font-family: var(--mono); font-size: 10px; color: var(--muted);
}
.ramp-scale span { flex: 1; text-align: center; }
.ramp-scale span[data-anchor] { flex: 1.6; color: var(--ink); font-weight: 600; }
.ramp-label { font-family: var(--mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }

.callout {
  border-inline-start: 3px solid var(--gold);
  padding: 2px 0 2px 16px;
  font-size: 14.5px; color: var(--muted);
}
.callout b { color: var(--ink); }

/* ---- favicon ---- */
.pxrow { display: flex; align-items: flex-end; gap: 26px; flex-wrap: wrap; }
.pxitem { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.pxitem img { display: block; image-rendering: auto; border-radius: 2px; }
.pxitem span { font-family: var(--mono); font-size: 10.5px; color: var(--muted); }
.zoomrow { display: flex; gap: 18px; flex-wrap: wrap; }
.zoomrow img { width: 104px; height: 104px; image-rendering: pixelated; border-radius: 2px; }
.tabsim {
  display: inline-flex; align-items: center; gap: 9px;
  background: var(--surface); border: 1px solid var(--line);
  border-radius: 8px 8px 0 0; padding: 8px 16px 8px 12px;
  font-size: 13px; max-width: 260px;
}
.tabsim img { width: 16px; height: 16px; flex: none; }

/* ---- type specimen ---- */
.spec { display: flex; flex-direction: column; gap: 22px; }
.spec-row { display: grid; grid-template-columns: 128px 1fr; gap: 20px; align-items: baseline; }
.spec-row > .mono { color: var(--muted); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; }
.spec-display { font-family: var(--display); font-size: 34px; font-weight: 700; line-height: 1.15; }
.spec-body { font-size: 16px; line-height: 1.6; }
.spec-mono { font-family: var(--mono); font-size: 14px; }

/* ---- rules ---- */
.rules { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 28px; }
.rules ul { margin: 0; padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 9px; }
.rules li { display: grid; grid-template-columns: 18px 1fr; gap: 10px; font-size: 14.5px; line-height: 1.5; }
.mk { font-family: var(--mono); font-weight: 700; }
.mk-do { color: var(--ok); }
.mk-no { color: var(--bad); }

/* ---- files ---- */
.tablewrap { overflow-x: auto; border: 1px solid var(--line); }
table { border-collapse: collapse; width: 100%; min-width: 560px; font-size: 14px; }
th, td { text-align: left; padding: 11px 16px; border-bottom: 1px solid var(--line); vertical-align: top; }
th {
  font-family: var(--mono); font-size: 10.5px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--muted); font-weight: 600;
  background: var(--surface);
}
tr:last-child td { border-bottom: 0; }
td .mono { color: var(--ink); }
td:nth-child(2) { color: var(--muted); }

footer { font-size: 13px; color: var(--muted); border-top: 1px solid var(--line); padding-top: 20px; }

@media (max-width: 620px) {
  .spec-row { grid-template-columns: 1fr; gap: 6px; }
  .spec-display { font-size: 27px; }
}
@media (prefers-reduced-motion: no-preference) {
  .sec { animation: rise .5s ease-out both; }
  @keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
}
"""

CORE_SWATCHES = [
    ("Forest Green", CORE["forest-green"], "Primary. Wordmark, headers, primary actions.",
     CONTRAST["forest-on-white"]),
    ("Helix Green", CORE["helix-green"], "Secondary. Links, focus rings, success.",
     CONTRAST["helix-on-white"]),
    ("Gold", CORE["gold"], "Accent only. Rules, fills, highlights — never text on white.",
     CONTRAST["gold-on-white"]),
    ("Gold Light", CORE["gold-light"], "Baseline rule, helix base pairs, dividers.", None),
    ("Ink", CORE["ink"], "Body text on light surfaces.", CONTRAST["ink-on-white"]),
    ("Paper", CORE["paper"], "Base surface.", None),
]

LOGO_TILES = [
    ("logo/eirion-logo.svg", "Primary", "eirion-logo.svg", "stage-light", "100%"),
    ("logo/eirion-logo-reverse.svg", "Reverse", "eirion-logo-reverse.svg", "stage-dark", "100%"),
    ("logo/eirion-logo-mono-green.svg", "Mono — forest", "eirion-logo-mono-green.svg", "stage-light", "100%"),
    ("logo/eirion-logo-mono-white.svg", "Mono — white", "eirion-logo-mono-white.svg", "stage-ink", "100%"),
    ("logo/eirion-mark.svg", "Mark", "eirion-mark.svg", "stage-light", "84px"),
    ("logo/eirion-mark-reverse.svg", "Mark reverse", "eirion-mark-reverse.svg", "stage-dark", "84px"),
]

FILES = [
    ("logo/eirion-logo.svg", "Primary lockup, full colour"),
    ("logo/eirion-logo-reverse.svg", "Dark backgrounds"),
    ("logo/eirion-logo-mono-{green,white,black}.svg", "Single-colour lockups"),
    ("logo/eirion-mark{,-reverse}.svg", "DNA mark without wordmark"),
    ("logo/eirion-mark-512.png", "Raster mark, transparent"),
    ("favicon/favicon.ico", "16 / 24 / 32 / 48 / 64 / 128 / 256, each drawn at size"),
    ("favicon/eirion-icon.svg", "Scalable browser icon"),
    ("favicon/icon-{16..512}.png", "PNG icon set"),
    ("favicon/icon-512-maskable.png", "Android maskable, 30% safe area"),
    ("favicon/apple-touch-icon.png", "iOS home screen, 180px"),
    ("favicon/site.webmanifest", "PWA manifest"),
    ("favicon/head-snippet.html", "Copy-paste &lt;head&gt; block"),
    ("tokens/eirion-brand.json", "All tokens, machine-readable"),
    ("tokens/eirion-brand.css", "Custom properties, light + dark"),
    ("tokens/_eirion-brand.scss", "SCSS variables and maps"),
    ("tools/generate_brand_assets.py", "Regenerates everything above"),
]


def build():
    ramps = []
    for name in ("forest", "helix", "gold", "slate"):
        stops = PALETTE[name]
        cells = "".join(
            '<div class="ramp-cell" style="background:%s"%s></div>'
            % (v, ' data-anchor="1"' if k == "600" else "")
            for k, v in stops.items())
        scale = "".join(
            '<span%s>%s</span>' % (' data-anchor="1"' if k == "600" else "", k)
            for k in stops)
        ramps.append(
            '<div class="ramp"><div class="ramp-label">%s</div>'
            '<div class="ramp-row">%s</div><div class="ramp-scale">%s</div></div>'
            % (name, cells, scale))

    sw = "".join(
        '<div class="sw"><div class="chipbox" style="background:%s"></div>'
        '<div><div class="sw-name">%s</div><div class="sw-hex">%s</div></div>'
        '<div class="sw-role">%s</div>%s</div>'
        % (hexv, name, hexv, role, contrast_badge(c) if c else "")
        for name, hexv, role, c in CORE_SWATCHES)

    tiles = "".join(
        '<figure class="tile"><div class="stage %s">%s</div>'
        '<figcaption><b>%s</b>%s</figcaption></figure>'
        % (stage, svg(rel, width), label, fname)
        for rel, label, fname, stage, width in LOGO_TILES)

    px = "".join(
        '<div class="pxitem"><img src="%s" width="%d" height="%d" alt="EIRION icon at %dpx">'
        '<span>%dpx</span></div>' % (uri("favicon/icon-%d.png" % s), s, s, s, s)
        for s in (16, 32, 48, 64))
    zoom = "".join('<img src="%s" alt="EIRION icon at %dpx, magnified">'
                   % (uri("favicon/icon-%d.png" % s), s) for s in (16, 32, 48))

    files = "".join('<tr><td><span class="mono">%s</span></td><td>%s</td></tr>' % f
                    for f in FILES)

    # clear space = half the cap height; cap is 160 units in a 987-wide artboard
    cs_pct = 80.0 / 987.0 * 100.0

    html = """<title>EIRION Brand Assets</title>
<style>%s</style>
<div class="wrap">

  <header class="sec masthead">
    <div class="masthead-logo">%s</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <span class="eyebrow">Brand assets &middot; v1.0</span>
      <h1>The EIRION identity kit</h1>
      <p class="lede">Logo lockups, a browser and app icon set, and a colour system
      derived from the original artwork. Every file is generated from a single
      script, so the vectors, the rasters and the tokens are the same shapes and
      the same hexes by construction.</p>
      <div class="meta">
        <span><b>Wordmark</b> Times New Roman Bold, outlined</span>
        <span><b>Palette</b> sampled from source artwork</span>
        <span><b>Icons</b> 7 sizes, each drawn at size</span>
      </div>
    </div>
  </header>

  <section class="sec">
    <header>
      <span class="eyebrow">01 &middot; Lockups</span>
      <h2>Six ways to place the logo</h2>
    </header>
    <p class="note">The wordmark reads <b>E &middot; helix &middot; R I O N</b> &mdash; the
    double helix <i>is</i> the first I. It is structural, not ornamental, and is never
    moved, doubled or dropped.</p>
    <div class="tiles">%s</div>
  </section>

  <section class="sec">
    <header>
      <span class="eyebrow">02 &middot; Clear space</span>
      <h2>Half the height of the E, on every side</h2>
    </header>
    <div class="clearspace">
      <div class="cs-frame" style="--cs:%.2f%%">
        <div class="cs-tick"></div>
        <div class="cs-pad">%s</div>
        <div class="cs-guide"></div>
      </div>
    </div>
    <p class="note">The gold square marks the measure: half the cap height of the E.
    A quarter of it is already inside the artboard &mdash; add the remainder in layout.
    Minimum sizes: <span class="mono">140px</span> wide on screen and
    <span class="mono">32mm</span> in print for the full lockup,
    <span class="mono">16px</span> / <span class="mono">6mm</span> for the mark alone.</p>
  </section>

  <section class="sec">
    <header>
      <span class="eyebrow">03 &middot; Colour</span>
      <h2>Green carries, gold accents</h2>
    </header>
    <div class="swatches">%s</div>
    <p class="callout"><b>Gold is not a text colour.</b> At 2.06:1 on white it fails
    WCAG AA at every size. Use it for rules, fills and icons. For gold-toned text use
    <span class="mono">gold-800 &middot; #916E0F</span> on white, or Gold on Forest Green
    at 6.29:1.</p>
    %s
  </section>

  <section class="sec">
    <header>
      <span class="eyebrow">04 &middot; Icons</span>
      <h2>Legible at tab size, not just at 512</h2>
    </header>
    <p class="note">Shown at true pixel size. Each <span class="mono">.ico</span> entry is
    drawn at its own size rather than downsampled from the largest &mdash; below 32px the
    base pairs are dropped and the strands thickened, because a faithful downsample
    turns to mud in a browser tab.</p>
    <div class="pxrow">%s</div>
    <div class="zoomrow">%s</div>
    <div class="tabsim"><img src="%s" alt="">EIRION &mdash; Dashboard</div>
  </section>

  <section class="sec">
    <header>
      <span class="eyebrow">05 &middot; Typography</span>
      <h2>A serif that answers the wordmark</h2>
    </header>
    <div class="spec">
      <div class="spec-row"><div class="mono">Display</div>
        <div><div class="spec-display">Precision at population scale</div>
        <p class="note">Source Serif 4 &rarr; Georgia &rarr; serif</p></div></div>
      <div class="spec-row"><div class="mono">Body</div>
        <div><p class="spec-body">Genomic insight, delivered where care actually happens.
        The body face stays quiet so the wordmark and the data carry the page; set at
        16px on a 1.55 line, capped near 65 characters.</p>
        <p class="note">Inter &rarr; Segoe UI &rarr; system-ui</p></div></div>
      <div class="spec-row"><div class="mono">Data</div>
        <div><div class="spec-mono">rs4149056 &nbsp; CYP2C19*2 &nbsp; 0.0031 &nbsp; #033A12</div>
        <p class="note">JetBrains Mono &rarr; Cascadia Code &rarr; Consolas</p></div></div>
    </div>
  </section>

  <section class="sec">
    <header>
      <span class="eyebrow">06 &middot; Usage</span>
      <h2>Rules worth enforcing</h2>
    </header>
    <div class="rules">
      <div>
        <h3>Do</h3>
        <ul>
          <li><span class="mk mk-do">+</span><span>Use the supplied SVGs &mdash; they are outlined and letterspaced.</span></li>
          <li><span class="mk mk-do">+</span><span>Switch to reverse or mono on any mid-tone or dark ground.</span></li>
          <li><span class="mk mk-do">+</span><span>Drop to the mark alone below 140px.</span></li>
          <li><span class="mk mk-do">+</span><span>Pull colour from the tokens, not by eyedropper.</span></li>
        </ul>
      </div>
      <div>
        <h3>Don't</h3>
        <ul>
          <li><span class="mk mk-no">&times;</span><span>Re-set the wordmark by typing EIRION in a serif.</span></li>
          <li><span class="mk mk-no">&times;</span><span>Stretch, skew, rotate, outline or add shadow and glow.</span></li>
          <li><span class="mk mk-no">&times;</span><span>Recolour the wordmark outside the palette.</span></li>
          <li><span class="mk mk-no">&times;</span><span>Place the full-colour logo on a photo without a solid panel.</span></li>
        </ul>
      </div>
    </div>
  </section>

  <section class="sec">
    <header>
      <span class="eyebrow">07 &middot; Contents</span>
      <h2>What ships in <span class="mono" style="font-size:.8em">brand/</span></h2>
    </header>
    <div class="tablewrap"><table>
      <thead><tr><th>File</th><th>Purpose</th></tr></thead>
      <tbody>%s</tbody>
    </table></div>
  </section>

  <footer>
    <p>The wordmark is a vector reconstruction matched against the original raster
    artwork; Times New Roman Bold is a near-exact fit. Replace <span class="mono">logo/*.svg</span>
    and re-derive if the original vector surfaces. Regenerate everything with
    <span class="mono">python brand/tools/generate_brand_assets.py</span>.</p>
  </footer>

</div>
""" % (CSS, svg("logo/eirion-logo.svg", "100%"), tiles, cs_pct,
       svg("logo/eirion-logo.svg", "100%"), sw, "".join(ramps), px, zoom,
       uri("favicon/icon-16.png"), files)

    out = os.path.join(ROOT, "brand-sheet.html")
    with io.open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote %s (%.0f KB)" % (out, os.path.getsize(out) / 1024))


if __name__ == "__main__":
    build()
