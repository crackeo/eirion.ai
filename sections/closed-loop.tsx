"use client";

import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { CLOSED_LOOP } from "@/constants/content";
import { Section, SectionHeading } from "@/components/layout/section";
import { Stagger, StaggerItem } from "@/components/animations/reveal";

/** Six-step closed loop with a scroll-drawn connector line. */
export function ClosedLoop() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 78%", "end 45%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section tone="light">
      <div className="container-site">
        <SectionHeading
          title={CLOSED_LOOP.title}
          paragraph={CLOSED_LOOP.paragraph}
        />

        <div ref={trackRef} className="relative">
          {/* Connector spine (desktop) */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 bg-forest-800/10 lg:block"
          >
            <m.div
              className="h-full w-full origin-top bg-gradient-to-b from-forest-500 via-gold-500 to-forest-500"
              style={{ scaleY: lineScale }}
            />
          </div>

          <Stagger className="grid gap-6 lg:gap-y-10" staggerDelay={0.14}>
            {CLOSED_LOOP.steps.map((step, i) => (
              <StaggerItem
                key={step.number}
                className={`lg:w-[calc(50%-48px)] ${i % 2 === 1 ? "lg:ml-auto" : ""}`}
              >
                <div className="group relative rounded-3xl border border-forest-800/10 bg-white p-7 shadow-[0_16px_44px_-26px_rgba(26,81,51,0.22)] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-600/30 hover:shadow-[0_24px_60px_-24px_rgba(184,145,31,0.3)]">
                  {/* Node dot on the spine */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 hidden size-3.5 -translate-y-1/2 rounded-full border-[3px] border-cream bg-forest-600 shadow-[0_0_0_4px_rgba(51,161,99,0.15)] transition-colors duration-300 group-hover:bg-gold-600 lg:block ${
                      i % 2 === 1 ? "left-[-55px]" : "right-[-55px]"
                    }`}
                  />
                  <div className="flex items-center gap-5">
                    <span className="font-stats text-gradient-forest text-4xl font-semibold">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-heading text-xl font-semibold tracking-tight text-forest-950">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-ink/60">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
