"use client";

import { useRef, useState } from "react";
import {
  m,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { FLOW } from "@/constants/content";
import { cn } from "@/lib/utils";

/** Data → Intelligence → Action → Outcome as a scroll-pinned word sequence.
 *  Each word recedes into a vanishing point (scale + rise + fade) as you keep
 *  scrolling, then the next word arrives from the foreground. All animation is
 *  transform/opacity driven by scroll position — no images, no layout work —
 *  so load time and interactivity are untouched. */
export function Flow() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.max(0, Math.min(FLOW.length - 1, Math.floor(v * FLOW.length))));
  });

  // Progress within the current step, 0 → 1
  const stepProgress = useTransform(scrollYProgress, (v) => {
    const clamped = Math.max(0, Math.min(0.9999, v));
    return (clamped * FLOW.length) % 1;
  });

  // Recede into the vanishing point over the second half of each step
  const scale = useTransform(stepProgress, [0, 0.45, 1], [1, 0.98, 0.3]);
  const y = useTransform(stepProgress, [0.45, 1], [0, -70]);
  const opacity = useTransform(stepProgress, [0, 0.45, 0.92], [1, 1, 0]);

  const step = FLOW[active];

  return (
    <section
      ref={ref}
      className="relative h-[350vh] border-y border-forest-800/8 bg-forest-50"
      aria-label="How data becomes outcomes"
    >
      {/* Screen-reader / SEO content: the full sequence, always present */}
      <ul className="sr-only">
        {FLOW.map((s) => (
          <li key={s.title}>
            {s.title} — {s.description}
          </li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden [perspective:900px]"
      >
        {/* Scroll-driven recede wrapper */}
        <m.div
          style={reduceMotion ? undefined : { scale, y, opacity }}
          className="will-change-transform"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <m.div
              key={step.title}
              className="flex flex-col items-center px-6 text-center"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.35, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.25, 1] }}
            >
              {/* Giant focused word */}
              <p className="font-heading text-[clamp(68px,13vw,190px)] leading-none font-bold tracking-tight text-forest-900 select-none">
                {step.title}
              </p>

              {/* Supporting line */}
              <p className="mt-6 text-[clamp(20px,2.6vw,34px)] font-medium text-forest-700/80">
                {step.description}
              </p>
            </m.div>
          </AnimatePresence>
        </m.div>

        {/* Progress indicator */}
        <div className="absolute bottom-10 flex items-center gap-3">
          {FLOW.map((s, i) => (
            <span
              key={s.title}
              className={cn(
                "h-1 w-12 rounded-full transition-colors duration-500 md:w-14",
                i === active ? "bg-forest-900" : "bg-forest-900/15"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
