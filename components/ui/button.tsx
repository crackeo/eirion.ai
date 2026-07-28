"use client";

import type { ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "forest" | "ghost-dark" | "ghost-light";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  withArrow?: boolean;
  size?: "md" | "lg";
  className?: string;
  "aria-label"?: string;
}

const variantStyles: Record<Variant, string> = {
  gold: "bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 bg-[length:200%_auto] text-forest-950 shadow-[0_8px_30px_-6px_rgba(184,145,31,0.55)] hover:bg-right",
  forest:
    "bg-forest-700 text-white shadow-[0_8px_30px_-8px_rgba(31,107,65,0.6)] hover:bg-forest-600",
  "ghost-dark":
    "border border-white/20 text-white backdrop-blur-sm hover:border-gold-500/60 hover:bg-white/5",
  "ghost-light":
    "border border-forest-800/20 text-forest-900 hover:border-forest-600/50 hover:bg-forest-50",
};

/** Primary CTA button with lift, glow and arrow slide micro-interactions. */
export function Button({
  children,
  variant = "gold",
  href = "#",
  withArrow = false,
  size = "md",
  className,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.a
      href={href}
      whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className={cn(
        "group font-labels inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-[background-position,background-color,border-color,box-shadow] duration-500",
        size === "lg" ? "px-9 py-4 text-[16px]" : "px-7 py-3.5 text-[15px]",
        variantStyles[variant],
        className
      )}
      aria-label={ariaLabel}
    >
      {children}
      {withArrow && (
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </m.a>
  );
}
