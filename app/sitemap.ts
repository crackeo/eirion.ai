import type { MetadataRoute } from "next";

// Required by `output: "export"` — renders sitemap.xml once at build time.
export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eirion.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      // Build date, since a static export has no request-time clock.
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
