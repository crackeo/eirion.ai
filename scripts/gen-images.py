#!/usr/bin/env python3
"""Pre-generate responsive image variants for the static export.

Static export requires `images.unoptimized: true` in next.config.ts, and that
switches off next/image's srcset generation entirely — the `sizes` prop still
renders but has nothing to select from, so every device downloads the largest
file. These variants are committed to /public and referenced by an explicit
srcset in the markup instead.

Run after replacing any of the source images:

    python3 scripts/gen-images.py

Requires Pillow (pip install Pillow). Widths were chosen from actual rendered
sizes, not guessed:

  ellie-hero-big  hero slot is 88vw on mobile, 540px on tablet, 42vw on desktop.
                  420/560/720 cover phones through DPR 2; 970 (the original)
                  serves desktop and very high-DPR phones.
  logo-mark       rendered 36px tall in the navbar, 40px in the footer. 448w
                  covers the taller of the two at DPR 3.

Quality note: the hero source is already at its compression floor — re-encoding
970w at q72 saves only 4 KB — so only dimension reduction helps it.
"""

from PIL import Image

# (source, [widths], quality). The original file is left untouched and keeps
# serving as the largest srcset candidate.
TARGETS = [
    ("public/ellie-hero-big.webp", [420, 560, 720], 80),
    ("public/logo-mark.webp", [448], 75),
]


def generate(src: str, widths: list[int], quality: int) -> None:
    with Image.open(src) as im:
        im = im.convert("RGBA")
        width, height = im.size
        stem = src.rsplit(".", 1)[0]
        for w in widths:
            h = round(height * w / width)
            out = f"{stem}-{w}w.webp"
            im.resize((w, h), Image.LANCZOS).save(
                out, "WEBP", quality=quality, method=6
            )
            print(f"  {out}  {w}x{h}")


if __name__ == "__main__":
    for src, widths, quality in TARGETS:
        print(src)
        generate(src, widths, quality)
