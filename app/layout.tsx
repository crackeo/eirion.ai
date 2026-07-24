import type { Metadata } from "next";
import { Sora, Manrope, Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { MotionProvider } from "@/components/providers/motion-provider";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = "https://eirion.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "eirion.ai | The AI Operating Layer for Healthcare",
  description:
    "The ELEANOR Platform is the intelligent AI Operating Layer for healthcare. Coordinated by ELLIE, our MCP-centered architecture connects your systems, teams, and genetic data to accelerate growth and unlock proactive care.",
  keywords: [
    "healthcare AI",
    "MCP",
    "Model Context Protocol",
    "RPM monitoring",
    "pharmacogenomics",
    "clinical intelligence",
    "ELEANOR Platform",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "eirion.ai",
    title: "eirion.ai | The AI Operating Layer for Healthcare",
    description:
      "Science. Better with Eleanor. The MCP-centered AI Operating Layer connecting healthcare systems, teams, and genetic data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "eirion.ai | The AI Operating Layer for Healthcare",
    description:
      "Science. Better with Eleanor. The MCP-centered AI Operating Layer for healthcare.",
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Eirion AI",
  url: siteUrl,
  description: "The AI Operating Layer for Healthcare",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${manrope.variable} ${spaceGrotesk.variable} ${ibmPlex.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-forest-950 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <MotionProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
