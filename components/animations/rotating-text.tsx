"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RotatingTextProps {
  phrases: string[];
  interval?: number;
  className?: string;
}

/** Cycles through phrases with a vertical mask transition. */
export function RotatingText({
  phrases,
  interval = 2600,
  className,
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, interval);
    return () => clearInterval(id);
  }, [phrases.length, interval, reduceMotion]);

  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)}>
      {/* Widest phrase reserves layout space to avoid shifts */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {phrases.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={phrases[index]}
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={{ y: "105%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-105%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 0.61, 0.25, 1] }}
        >
          {phrases[index]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
