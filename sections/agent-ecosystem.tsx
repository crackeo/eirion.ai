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
  type LucideIcon,
} from "lucide-react";
import { ECOSYSTEM } from "@/constants/content";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/animations/reveal";

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

/** Mounts the heavy 3D chunk only once the wrapper nears the viewport, so
 *  visitors who never scroll here never download three.js. */
function useNearViewport(margin = "900px") {
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

/** Compact agent list that flanks the 3D model on wide screens. */
function AgentColumn({
  title,
  agents,
  accent,
  align,
}: {
  title: string;
  agents: readonly { label: string; Icon: LucideIcon }[];
  accent: string;
  align: "left" | "right";
}) {
  return (
    <div className={`lg:self-center ${align === "right" ? "lg:text-right" : ""}`}>
      <h3
        className={`font-labels text-[11.5px] font-semibold tracking-[0.2em] uppercase ${accent}`}
      >
        {title}
      </h3>
      <ul className="mt-3.5 grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-1.5">
        {agents.map(({ label, Icon }) => (
          <li
            key={label}
            className={`flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.08] ${
              align === "right" ? "lg:flex-row-reverse lg:text-right" : ""
            }`}
          >
            <Icon className={`size-3.5 shrink-0 ${accent}`} aria-hidden="true" />
            <span className="text-[12.5px] leading-tight font-medium text-cream">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Zoom/rotate hint. Shows the right modifier key for the visitor's platform. */
function InteractionHint() {
  // Platform detection must happen after mount: deciding this during render
  // would read navigator on the server and desync hydration.
  const [mod, setMod] = useState("Ctrl");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setMod("⌘");
  }, []);
  return (
    <p className="font-labels pointer-events-none absolute inset-x-0 bottom-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] tracking-[0.14em] text-cream/70 uppercase">
      <span className="inline-flex items-center gap-1.5">
        <MousePointer2 className="size-3" aria-hidden="true" />
        Drag to rotate
      </span>
      <span aria-hidden="true" className="text-cream/40">·</span>
      <span>
        Hold <kbd className="rounded border border-cream/30 px-1 font-sans">{mod}</kbd> + scroll to zoom
      </span>
    </p>
  );
}

export function AgentEcosystem() {
  usePrefetchScene();
  const { ref, near } = useNearViewport();

  return (
    <Section id="architecture" tone="dark" className="bg-noise !py-14 md:!py-16">
      <div
        className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="animate-aurora pointer-events-none absolute top-0 left-1/4 h-[50vh] w-[40vw] rounded-full bg-forest-600/18 blur-[130px]"
      />

      {/* Whole section is sized to sit inside one viewport on desktop */}
      <div className="container-site relative flex flex-col lg:min-h-[calc(100svh-8.5rem)] lg:justify-between">
        {/* Compact heading — this section trades heading height for model size */}
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-labels mb-3 text-[12px] font-semibold tracking-[0.22em] text-cream uppercase">
              {ECOSYSTEM.eyebrow}
            </p>
            <h2 className="font-heading text-3xl leading-[1.1] font-semibold tracking-tight text-balance text-white md:text-[42px]">
              {ECOSYSTEM.title}
            </h2>
            <p className="mx-auto mt-3.5 max-w-2xl text-[15.5px] leading-relaxed text-cream">
              {ECOSYSTEM.paragraph}
            </p>
          </div>
        </Reveal>

        {/* Legend · model · legend */}
        <div className="mt-5 grid items-center gap-6 lg:mt-3 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(150px,180px)_1fr_minmax(150px,180px)] lg:items-stretch lg:gap-7">
          <AgentColumn
            title="Internal Agents"
            agents={INTERNAL}
            accent="text-gold-400"
            align="left"
          />

          {/* 3D model — fixed aspect so the section height stays predictable */}
          <div
            ref={ref}
            className="relative hidden aspect-[16/10] w-full lg:block lg:aspect-auto lg:h-full lg:min-h-0"
          >
            {near && <EcosystemScene />}
            <InteractionHint />
          </div>

          <AgentColumn
            title="External Agents"
            agents={EXTERNAL}
            accent="text-cream"
            align="right"
          />
        </div>

        <Reveal delay={0.15}>
          <p className="font-labels mt-5 lg:mt-3 text-center text-[12px] tracking-[0.16em] text-cream/85 uppercase">
            Every agent starts with ELLIE — orchestrated through the Model Context Protocol
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
