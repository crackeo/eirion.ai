"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { FAQ } from "@/constants/content";
import { Section, SectionHeading } from "@/components/layout/section";
import { Stagger, StaggerItem } from "@/components/animations/reveal";
import { cn } from "@/lib/utils";

/** Flat accordion that blends into the section background: hairline dividers,
 *  green active question, and −/+ circle toggles. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section tone="tint">
      <div className="container-site">
        <SectionHeading title="Frequently Asked Questions" className="max-w-none" />

        <Stagger className="mx-auto max-w-3xl" staggerDelay={0.1}>
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <StaggerItem key={item.question}>
                <div
                  className={cn(
                    "border-b transition-colors duration-500",
                    isOpen ? "border-forest-700/60" : "border-forest-800/12"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span
                      className={cn(
                        "font-heading text-[17.5px] font-semibold tracking-tight transition-colors duration-300 md:text-[19px]",
                        isOpen
                          ? "text-forest-600"
                          : "text-forest-950 group-hover:text-forest-700"
                      )}
                    >
                      {item.question}
                    </span>
                    <m.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.25, 1] }}
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-300",
                        isOpen
                          ? "bg-forest-700 text-white"
                          : "border border-forest-800/25 text-forest-800/60 group-hover:border-forest-700/50 group-hover:text-forest-700"
                      )}
                    >
                      {isOpen ? (
                        <Minus className="size-4" aria-hidden="true" />
                      ) : (
                        <Plus className="size-4" aria-hidden="true" />
                      )}
                    </m.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-button-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 0.61, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-7 text-[16px] leading-relaxed text-ink/60">
                          {item.answer}
                        </p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
