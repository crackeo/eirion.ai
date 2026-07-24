"use client";

import { m, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FOOTER } from "@/constants/content";
import { Reveal } from "@/components/animations/reveal";

/* Brand icons were removed from lucide, so they live here as inline SVGs. */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.1.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.68 5.38-5.24 5.67.41.35.77 1.05.77 2.12v3.14c0 .3.2.66.8.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "LinkedIn", Icon: LinkedInIcon },
  { label: "X (Twitter)", Icon: XIcon },
  { label: "GitHub", Icon: GitHubIcon },
] as const;

export function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <footer className="relative overflow-hidden bg-forest-950 text-white">
      {/* Animated gradient divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-gold-500 to-transparent bg-[length:200%_auto]" />
      </div>

      {/* Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full bg-forest-500/20 blur-[140px]"
      />

      <div className="container-site relative py-20 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand + newsletter */}
          <Reveal>
            <div>
              <a href="#" className="inline-flex items-center" aria-label="eirion.ai home">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-dark.svg"
                  alt="eirion.ai"
                  width={1024}
                  height={358}
                  className="h-10 w-auto"
                />
              </a>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/55">
                {FOOTER.tagline}
              </p>

              <form
                className="mt-8"
                onSubmit={(e) => e.preventDefault()}
                aria-label="Newsletter signup"
              >
                <label
                  htmlFor="newsletter-email"
                  className="font-labels mb-3 block text-[13px] font-semibold tracking-[0.18em] text-gold-500 uppercase"
                >
                  Stay Informed
                </label>
                <div className="flex max-w-sm overflow-hidden rounded-full border border-white/15 bg-white/5 backdrop-blur-sm focus-within:border-gold-500/60">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="Work email"
                    className="w-full bg-transparent px-5 py-3 text-[15px] text-white placeholder:text-white/35 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="group m-1 grid shrink-0 place-items-center rounded-full bg-gradient-to-r from-gold-600 to-gold-500 px-4 text-forest-950 transition-transform hover:scale-105"
                  >
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </form>

              <div className="mt-8 flex gap-3">
                {SOCIALS.map(({ label, Icon }) => (
                  <m.a
                    key={label}
                    href="#"
                    aria-label={label}
                    whileHover={reduceMotion ? undefined : { y: -3, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 340, damping: 18 }}
                    className="grid size-10 place-items-center rounded-full border border-white/12 text-white/60 transition-colors hover:border-gold-500/50 hover:text-gold-500"
                  >
                    <Icon className="size-[17px]" />
                  </m.a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {FOOTER.columns.map((column, ci) => (
              <Reveal key={column.title} delay={ci * 0.08}>
                <div>
                  <h3 className="font-labels text-[13px] font-semibold tracking-[0.18em] text-white/40 uppercase">
                    {column.title}
                  </h3>
                  <ul className="mt-5 space-y-3.5">
                    {column.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="group relative text-[15px] text-white/65 transition-colors hover:text-white"
                        >
                          {link}
                          <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold-500/70 transition-transform duration-300 group-hover:scale-x-100" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-[14px] text-white/65">
            © {new Date().getFullYear()} Eirion AI. All rights reserved.
          </p>
          <ul className="flex gap-7">
            {FOOTER.legal.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-[14px] text-white/65 transition-colors hover:text-white"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
