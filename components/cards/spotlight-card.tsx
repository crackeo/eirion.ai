"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { m, useMotionValue, useMotionTemplate, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Spotlight color, defaults to soft gold */
  glow?: string;
  tone?: "dark" | "light";
  lift?: boolean;
}

/** Card with a cursor-tracking radial spotlight and hover lift. */
export function SpotlightCard({
  children,
  className,
  glow = "rgba(210,169,43,0.14)",
  tone = "light",
  lift = true,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, ${glow}, transparent 72%)`;

  return (
    <m.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        mouseX.set(-400);
        mouseY.set(-400);
      }}
      whileHover={lift && !reduceMotion ? { y: -6 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl",
        tone === "dark"
          ? "border border-white/10 bg-forest-900/70 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.6)]"
          : "border border-forest-800/10 bg-white shadow-[0_18px_50px_-24px_rgba(18,69,41,0.18)]",
        className
      )}
    >
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <div className="relative">{children}</div>
    </m.div>
  );
}
