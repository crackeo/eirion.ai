import type { NextConfig } from "next";

/**
 * Static export configuration for Hostinger (LiteSpeed, no Node runtime).
 *
 * `next build` emits a fully static site into `out/`, whose contents are
 * deployed to `public_html`. Consequences of `output: "export"`:
 *
 *  - `headers()` is NOT supported. The security + caching headers live in
 *    `public/.htaccess` instead, which LiteSpeed applies at request time.
 *  - The image optimizer is unavailable, so `images.unoptimized` is required.
 *    Artwork is pre-compressed to WebP in `public/` (originals kept in
 *    `assets/source-artwork/`, which is not served).
 *  - `sitemap.ts` / `robots.ts` still work: they are rendered to static
 *    `sitemap.xml` / `robots.txt` files at build time.
 */
const nextConfig: NextConfig = {
  output: "export",
  // Emits directory-style routes (/path/index.html) so Apache/LiteSpeed can
  // resolve URLs with or without a trailing slash.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
};

export default nextConfig;
