import { Turtle, Zap, X, Check } from "lucide-react";
import { SPEED } from "@/constants/content";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/animations/reveal";

/** Traditional AI vs ELEANOR Overlay deployment comparison. */
export function SpeedAdvantage() {
  return (
    <Section tone="tint" className="!py-[100px]">
      <div className="container-site">
        <SectionHeading title={SPEED.title} />

        <div className="mx-auto grid max-w-4xl gap-7 md:grid-cols-2">
          <Reveal direction="right" delay={0.05}>
            <div className="h-full rounded-3xl border border-forest-800/10 bg-white/60 p-9 opacity-80 grayscale-[0.3]">
              <span className="grid size-12 place-items-center rounded-2xl bg-ink/5 text-ink/40">
                <Turtle className="size-6" aria-hidden="true" />
              </span>
              <p className="font-labels mt-6 text-[13px] font-semibold tracking-[0.18em] text-ink/45 uppercase">
                {SPEED.traditional.label}
              </p>
              <p className="font-stats mt-2 text-4xl font-semibold text-ink/55 md:text-5xl">
                {SPEED.traditional.value}
              </p>
              <ul className="mt-6 space-y-3">
                {SPEED.traditional.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-[15px] text-ink/55">
                    <X className="size-4 shrink-0 text-red-400" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.15}>
            <div className="relative h-full overflow-hidden rounded-3xl bg-forest-950 p-9 shadow-[0_30px_80px_-30px_rgba(22,69,44,0.55)]">
              <div
                aria-hidden="true"
                className="animate-pulse-soft absolute -top-20 -right-20 size-56 rounded-full bg-gold-500/15 blur-3xl"
              />
              <span className="relative grid size-12 place-items-center rounded-2xl bg-gold-500/15 text-gold-500">
                <Zap className="size-6" aria-hidden="true" />
              </span>
              <p className="font-labels relative mt-6 text-[13px] font-semibold tracking-[0.18em] text-gold-500 uppercase">
                {SPEED.eleanor.label}
              </p>
              <p className="text-gradient-gold animate-shimmer font-stats relative mt-2 text-4xl font-semibold md:text-5xl">
                {SPEED.eleanor.value}
              </p>
              <ul className="relative mt-6 space-y-3">
                {SPEED.eleanor.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-[15px] text-white/80">
                    <Check className="size-4 shrink-0 text-forest-300" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
