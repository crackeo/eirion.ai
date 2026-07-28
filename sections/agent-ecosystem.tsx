"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Workflow,
  ShieldCheck,
  BarChart3,
  Bot,
  HeartHandshake,
  Activity,
  CalendarClock,
  Dna,
  MousePointer2,
} from "lucide-react";
import { ECOSYSTEM } from "@/constants/content";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";

const EcosystemScene = dynamic(
  () => import("@/components/ecosystem/ecosystem-scene"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="absolute inset-[15%] rounded-full bg-forest-300/10 blur-3xl"
      />
    ),
  }
);

const INTERNAL = [
  { label: "Workflow Agent", Icon: Workflow },
  { label: "Compliance Agent", Icon: ShieldCheck },
  { label: "Analytics Agent", Icon: BarChart3 },
  { label: "Assistant Agent", Icon: Bot },
] as const;

const EXTERNAL = [
  { label: "Health Coach", Icon: HeartHandshake },
  { label: "RPM Monitor", Icon: Activity },
  { label: "Care Coordinator", Icon: CalendarClock },
  { label: "Genetic Advisor", Icon: Dna },
] as const;

/** Warm the 3D chunk in the background on the user's first interaction —
 *  long before they scroll here — so mounting is instant. Keeps the module
 *  off the Lighthouse trace since it still requires real input. */
function usePrefetchScene() {
  useEffect(() => {
    const events = ["pointermove", "pointerdown", "scroll", "keydown", "touchstart"] as const;
    const warm = () => {
      const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 300));
      idle(() => {
        import("@/components/ecosystem/ecosystem-scene");
      });
      events.forEach((e) => window.removeEventListener(e, warm));
    };
    events.forEach((e) => window.addEventListener(e, warm, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, warm));
  }, []);
}

/** Mounts children's heavy content only once the wrapper nears the viewport,
 *  so the three.js chunk never loads for visitors who don't scroll here. */
function useNearViewport(margin = "400px") {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, near };
}

export function AgentEcosystem() {
  usePrefetchScene();
  const { ref, near } = useNearViewport("900px");

  return (
    <Section id="architecture" tone="dark" className="bg-noise">
      <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="animate-aurora pointer-events-none absolute top-0 left-1/4 h-[50vh] w-[40vw] rounded-full bg-forest-600/18 blur-[130px]"
      />

      <div className="container-site relative">
        <SectionHeading
          eyebrow={ECOSYSTEM.eyebrow}
          title={ECOSYSTEM.title}
          paragraph={ECOSYSTEM.paragraph}
          tone="dark"
        />

        {/* 3D solar system (desktop / tablet) */}
        <div ref={ref} className="relative mx-auto hidden aspect-[4/3] w-full max-w-[1150px] md:block">
          {near && <EcosystemScene />}
          <p className="font-labels pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[12px] tracking-[0.18em] text-cream uppercase">
            <MousePointer2 className="size-3.5" aria-hidden="true" />
            Drag to explore the ecosystem
          </p>
        </div>

        {/* Agent legend / mobile representation */}
        <Stagger className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-2 md:mt-14" staggerDelay={0.12}>
          {[
            { title: "Internal Agents", agents: INTERNAL, accent: "text-forest-300", ring: "border-forest-400/25" },
            { title: "External Agents", agents: EXTERNAL, accent: "text-cream", ring: "border-cream/25" },
          ].map((group) => (
            <StaggerItem key={group.title}>
              <div className={`glass-dark h-full rounded-3xl p-7 ${group.ring}`}>
                <h3 className={`font-labels text-[13px] font-semibold tracking-[0.2em] uppercase ${group.accent}`}>
                  {group.title}
                </h3>
                <ul className="mt-5 grid grid-cols-2 gap-3">
                  {group.agents.map(({ label, Icon }) => (
                    <li
                      key={label}
                      className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-3 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                    >
                      <Icon className={`size-4 shrink-0 ${group.accent}`} aria-hidden="true" />
                      <span className="text-[13.5px] font-medium text-cream">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.2}>
          <p className="font-labels mt-12 text-center text-[13px] tracking-[0.16em] text-cream uppercase">
            Every agent starts with <span className="text-cream">ELLIE</span> — orchestrated through the Model Context Protocol
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
