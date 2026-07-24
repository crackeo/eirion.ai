"use client";

import type { ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassStatCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  floatDuration?: number;
}

/** Frosted floating card used over the hero 3D scene. */
export function GlassStatCard({
  children,
  className,
  delay = 0,
  floatDuration = 7,
}: GlassStatCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.21, 0.65, 0.28, 0.99] }}
      className={cn("absolute", className)}
    >
      <m.div
        animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 2,
        }}
        className="glass-dark rounded-2xl p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)]"
      >
        {children}
      </m.div>
    </m.div>
  );
}
