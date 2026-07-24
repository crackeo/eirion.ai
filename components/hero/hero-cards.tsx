"use client";

import { m, useReducedMotion } from "framer-motion";
import { Check, Dna, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

/** Overlay cards positioned over the ELLIE hero illustration.
 *
 *  The illustration has AI-generated card artwork baked in with garbled text,
 *  so each real card below sits exactly on top of one, covering it with crisp,
 *  correct copy. Sizing uses container-query (cqw) units so the overlays track
 *  the image precisely at every viewport width. They must render instantly
 *  (no entrance fade) or the garbled artwork would flash through.
 */

const card =
  "absolute overflow-hidden rounded-[2cqw] border border-forest-200/80 bg-white shadow-[0_2cqw_5cqw_-1.5cqw_rgba(5,43,20,0.3)]";
const label =
  "font-labels flex items-center gap-[1cqw] text-[1.75cqw] font-semibold tracking-[0.08em] text-slate-500 uppercase";

function PlanCard() {
  const items = ["Nutrition", "Activity", "Sleep", "Mindfulness"];
  return (
    <div className={`${card} left-[25%] top-[15.5%] w-[16.5%] p-[1.6cqw] -rotate-2`}>
      <p className={label}>
        <Sparkles className="size-[2cqw] text-forest-600" aria-hidden="true" />
        Health Coach
      </p>
      <p className="mt-[0.8cqw] text-[1.6cqw] text-slate-400">Personalized plan</p>
      <ul className="mt-[1cqw] space-y-[0.9cqw]">
        {items.map((item) => (
          <li key={item} className="flex items-center justify-between text-[1.8cqw] font-medium text-slate-700">
            {item}
            <Check className="size-[2cqw] text-emerald-500" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreCard() {
  const reduceMotion = useReducedMotion();
  const r = 44;
  return (
    <div className={`${card} left-[63%] top-[10%] w-[23%] p-[1.6cqw] rotate-1`}>
      <p className={`${label} whitespace-nowrap`}>
        <HeartPulse className="size-[2cqw] shrink-0 text-forest-600" aria-hidden="true" />
        <span className="text-[1.2cqw]">Patient Health Score</span>
      </p>
      <div className="mt-[1.1cqw] flex items-center gap-[1.2cqw]">
        <div className="relative size-[6cqw] shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#e8f3d4" strokeWidth="10" />
            <m.circle
              cx="50" cy="50" r={r} fill="none" stroke="#1f7a53" strokeWidth="10"
              strokeLinecap="round" strokeDasharray={2 * Math.PI * r}
              initial={{ strokeDashoffset: 2 * Math.PI * r }}
              whileInView={{ strokeDashoffset: 2 * Math.PI * r * (1 - 0.92) }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 1.6, delay: 0.4, ease: [0.22, 0.61, 0.25, 1] }}
            />
          </svg>
          <span className="font-stats absolute inset-0 grid place-items-center text-[1.9cqw] font-semibold text-slate-800">
            92
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[1.7cqw] font-semibold text-slate-700">Excellent</p>
          <p className="text-[1.35cqw] leading-snug text-forest-600">Improving trajectory</p>
        </div>
      </div>
      {/* Mini trend line */}
      <svg viewBox="0 0 100 26" className="mt-[1cqw] w-full" aria-hidden="true">
        <path d="M2 22 C14 20 18 14 28 15 S 46 20 56 13 74 6 98 4" fill="none" stroke="#46a071" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function RpmCard() {
  return (
    <div className={`${card} left-[7.5%] top-[46%] w-[17.5%] p-[1.6cqw] -rotate-2`}>
      <p className={label}>
        <HeartPulse className="size-[2cqw] text-rose-500" aria-hidden="true" />
        RPM Monitoring
      </p>
      <p className="mt-[1cqw]">
        <span className="font-stats text-[3.4cqw] font-semibold text-slate-800">72</span>
        <span className="ml-[0.6cqw] text-[1.7cqw] text-slate-400">bpm</span>
      </p>
      <p className="mt-[0.9cqw] flex items-center gap-[0.8cqw] rounded-full bg-emerald-50 px-[1.2cqw] py-[0.5cqw] text-[1.6cqw] font-medium text-emerald-600">
        <span className="relative inline-flex size-[1.1cqw] rounded-full bg-emerald-500" />
        Stable
      </p>
    </div>
  );
}

function AdherenceCard() {
  return (
    <div className={`${card} left-[69.5%] top-[41.5%] w-[20%] p-[1.6cqw] rotate-1`}>
      <p className={label}>
        <ShieldCheck className="size-[2cqw] text-teal-500" aria-hidden="true" />
        Care Gap Closed
      </p>
      <p className="mt-[1cqw] text-[1.7cqw] text-slate-500">Medication Adherence</p>
      <p className="font-stats mt-[0.4cqw] text-[3cqw] font-semibold text-slate-800">100%</p>
      <div className="mt-[0.8cqw] h-[1cqw] overflow-hidden rounded-full bg-forest-100">
        <div className="h-full w-full rounded-full bg-gradient-to-r from-forest-500 to-gold-500" />
      </div>
    </div>
  );
}

function McpOrb() {
  return (
    <div
      className="absolute left-[38.2%] top-[53.5%] grid size-[12.5cqw] place-items-center rounded-full bg-gradient-to-br from-forest-400 via-forest-600 to-forest-800 text-center shadow-[0_0_5cqw_1cqw_rgba(31,122,83,0.6)] ring-[0.35cqw] ring-white/70"
    >
      <div>
        <p className="font-heading text-[2.5cqw] leading-none font-bold text-white">MCP</p>
        <p className="font-labels mt-[0.6cqw] text-[1.25cqw] leading-tight font-semibold tracking-[0.06em] text-forest-100 uppercase">
          Intelligence
          <br />
          Layer
        </p>
      </div>
    </div>
  );
}

/** DNA badge — sits in empty space, purely additive. */
function DnaBadge() {
  return (
    <div className={`${card} left-[3%] top-[10%] flex items-center gap-[1cqw] p-[1.3cqw]`}>
      <Dna className="size-[2.2cqw] text-forest-600" aria-hidden="true" />
      <p className="text-[1.7cqw] font-semibold whitespace-nowrap text-slate-700">
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
