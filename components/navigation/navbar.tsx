"use client";

import { useState } from "react";
import {
  m,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants/content";
import { cn } from "@/lib/utils";

/** Floating glass navbar: hides on scroll down, reveals on scroll up. */
export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 260 && !menuOpen);
    setScrolled(latest > 24);
  });

  return (
    <m.header
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      animate={{ y: hidden && !reduceMotion ? "-130%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.22, 0.61, 0.25, 1] }}
    >
      <nav
        aria-label="Main navigation"
        className={cn(
          "flex w-full max-w-[1180px] items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 md:px-7",
          scrolled || menuOpen
            ? "border border-white/12 bg-forest-950/85 shadow-[0_16px_50px_-16px_rgba(22,69,44,0.7)] backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        )}
      >
        {/* Logo */}
        <a href="#" className="group flex items-center" aria-label="eirion.ai home">
          <m.img
            src="/logo-dark.svg"
            alt="eirion.ai"
            width={1024}
            height={358}
            className="h-9 w-auto"
            whileHover={reduceMotion ? undefined : { scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="group font-labels relative py-2 text-[14px] font-medium text-white/75 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-gold-500 to-forest-400 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="font-labels hidden text-[14px] font-medium text-white/75 transition-colors hover:text-white md:block"
          >
            Login
          </a>
          <m.a
            href="#cta"
            whileHover={reduceMotion ? undefined : { scale: 1.04 }}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            className="font-labels hidden rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 bg-[length:200%_auto] px-5 py-2.5 text-[14px] font-semibold text-forest-950 shadow-[0_6px_24px_-6px_rgba(184,145,31,0.6)] transition-[background-position] duration-500 hover:bg-right md:block"
          >
            Meet ELLIE
          </m.a>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-xl border border-white/15 text-white lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {menuOpen && (
          <m.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.25, 1] }}
            className="absolute inset-x-4 top-[84px] rounded-2xl border border-white/12 bg-forest-950/95 p-6 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <m.li
                  key={link.label}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-labels block rounded-lg px-3 py-3 text-[16px] font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {link.label}
                  </a>
                </m.li>
              ))}
              <li className="mt-3 border-t border-white/10 pt-4">
                <a
                  href="#cta"
                  onClick={() => setMenuOpen(false)}
                  className="font-labels block rounded-full bg-gradient-to-r from-gold-600 to-gold-500 px-5 py-3 text-center text-[15px] font-semibold text-forest-950"
                >
                  Meet ELLIE
                </a>
              </li>
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
}
