"use client";

import { m, useReducedMotion } from "framer-motion";
import { Check, Dna, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

/** Overlay cards positioned over the ELLIE hero illustration
 *  (portrait crop, 970x1024).
 *
 *  The illustration has AI-generated card artwork baked in with garbled text,
 *  so each real card below sits exactly on top of one, covering it with crisp,
 *  correct copy. Sizing uses container-query (cqw) units so the overlays track
 *  the image precisely at every viewport width. They must render instantly
 *  (no entrance fade) or the garbled artwork would flash through.
 */

const card =
  "absolute overflow-hidden rounded-[2.6cqw] border border-forest-200/80 bg-white shadow-[0_2.6cqw_6cqw_-2cqw_rgba(18,69,41,0.3)]";
const label =
  "font-labels flex items-center gap-[1.3cqw] text-[2.3cqw] font-semibold tracking-[0.08em] text-slate-500 uppercase";

/** covers baked "Alneath Crach" plan card */
function PlanCard() {
  const items = ["Nutrition", "Activity", "Sleep", "Mindfulness"];
  return (
    <div className={`${card} left-[1.5%] top-[16%] w-[22.5%] p-[2.2cqw] -rotate-2`}>
      <p className={label}>
        <Sparkles className="size-[2.7cqw] text-forest-600" aria-hidden="true" />
        Health Coach
      </p>
      <p className="mt-[1cqw] text-[2.1cqw] text-slate-400">Personalized plan</p>
      <ul className="mt-[1.3cqw] space-y-[1.2cqw]">
        {items.map((item) => (
          <li key={item} className="flex items-center justify-between text-[2.4cqw] font-medium text-slate-700">
            {item}
            <Check className="size-[2.6cqw] text-emerald-500" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** covers baked "Paterd Heath Score" card */
function ScoreCard() {
  const reduceMotion = useReducedMotion();
  const r = 44;
  return (
    <div className={`${card} left-[63%] top-[11%] w-[25%] p-[2.2cqw] rotate-1`}>
      <p className={`${label} whitespace-nowrap`}>
        <HeartPulse className="size-[2.6cqw] shrink-0 text-forest-600" aria-hidden="true" />
        <span className="text-[1.15cqw] tracking-[0.02em]">Patient Health Score</span>
      </p>
      <div className="mt-[1.4cqw] flex items-center gap-[1.6cqw]">
        <div className="relative size-[8cqw] shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#d9f5e1" strokeWidth="10" />
            <m.circle
              cx="50" cy="50" r={r} fill="none" stroke="#16a34a" strokeWidth="10"
              strokeLinecap="round" strokeDasharray={2 * Math.PI * r}
              initial={{ strokeDashoffset: 2 * Math.PI * r }}
              whileInView={{ strokeDashoffset: 2 * Math.PI * r * (1 - 0.92) }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 1.6, delay: 0.4, ease: [0.22, 0.61, 0.25, 1] }}
            />
          </svg>
          <span className="font-stats absolute inset-0 grid place-items-center text-[2.5cqw] font-semibold text-slate-800">
            92
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[2.3cqw] font-semibold text-slate-700">Excellent</p>
          <p className="text-[1.8cqw] leading-snug text-forest-600">Improving trajectory</p>
        </div>
      </div>
      {/* Mini trend line */}
      <svg viewBox="0 0 100 26" className="mt-[1.3cqw] w-full" aria-hidden="true">
        <path d="M2 22 C14 20 18 14 28 15 S 46 20 56 13 74 6 98 4" fill="none" stroke="#3cc46b" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** additive — sits in the empty lower-left aura area */
function RpmCard() {
  return (
    <div className={`${card} left-[0.5%] top-[62%] w-[21%] p-[2.2cqw] -rotate-2`}>
      <p className={label}>
        <HeartPulse className="size-[2.6cqw] text-rose-500" aria-hidden="true" />
        RPM Monitoring
      </p>
      <p className="mt-[1.3cqw]">
        <span className="font-stats text-[4.4cqw] font-semibold text-slate-800">72</span>
        <span className="ml-[0.8cqw] text-[2.2cqw] text-slate-400">bpm</span>
      </p>
      <p className="mt-[1.1cqw] flex items-center gap-[1cqw] rounded-full bg-emerald-50 px-[1.6cqw] py-[0.7cqw] text-[2.1cqw] font-medium text-emerald-600">
        <span className="relative inline-flex size-[1.4cqw] rounded-full bg-emerald-500" />
        Stable
      </p>
    </div>
  );
}

/** covers baked "Cate Gap Closed" card */
function AdherenceCard() {
  return (
    <div className={`${card} left-[72.5%] top-[40.5%] w-[27%] p-[2.2cqw] rotate-1`}>
      <p className={label}>
        <ShieldCheck className="size-[2.6cqw] text-teal-500" aria-hidden="true" />
        Care Gap Closed
      </p>
      <p className="mt-[1.3cqw] text-[2.2cqw] text-slate-500">Medication Adherence</p>
      <p className="font-stats mt-[0.5cqw] text-[4cqw] font-semibold text-slate-800">100%</p>
      <div className="mt-[1cqw] h-[1.3cqw] overflow-hidden rounded-full bg-forest-100">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-forest-500 to-forest-400" />
      </div>
    </div>
  );
}

/** covers the baked glowing orb */
function McpOrb() {
  return (
    <div
      className="absolute left-[21.8%] top-[52.8%] grid size-[16.5cqw] place-items-center rounded-full bg-gradient-to-br from-forest-400 via-forest-600 to-forest-800 text-center shadow-[0_0_6.5cqw_1.3cqw_rgba(22,163,74,0.6)] ring-[0.45cqw] ring-white/70"
    >
      <div>
        <p className="font-heading text-[3.3cqw] leading-none font-bold text-white">MCP</p>
        <p className="font-labels mt-[0.8cqw] text-[1.65cqw] leading-tight font-semibold tracking-[0.06em] text-forest-100 uppercase">
          Intelligence
          <br />
          Layer
        </p>
      </div>
    </div>
  );
}

/** additive DNA badge — top-left empty space */
function DnaBadge() {
  return (
    <div className={`${card} left-[4%] top-[6.5%] flex items-center gap-[1.3cqw] p-[1.7cqw]`}>
      <Dna className="size-[2.9cqw] text-forest-600" aria-hidden="true" />
      <p className="text-[2.2cqw] font-semibold whitespace-nowrap text-slate-700">
        3.2M <span className="font-normal text-slate-400">markers processed</span>
      </p>
    </div>
  );
}

export function HeroCards() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <PlanCard />
      <ScoreCard />
      <RpmCard />
      <AdherenceCard />
      <McpOrb />
      <DnaBadge />
    </div>
  );
}
