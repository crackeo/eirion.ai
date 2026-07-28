import { Sparkles, Activity, CalendarHeart } from "lucide-react";
import { INTELLIGENCE } from "@/constants/content";
import { Section, SectionHeading } from "@/components/layout/section";
import { SpotlightCard } from "@/components/cards/spotlight-card";
import { Counter } from "@/components/animations/counter";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";

const featureIcons = [Sparkles, Activity, CalendarHeart];

/** Healthcare-specific intelligence features + animated outcome stats. */
export function Intelligence() {
  return (
    <Section id="news" tone="light">
      <div className="container-site">
        <SectionHeading title={INTELLIGENCE.title} />

        <Stagger className="grid gap-7 md:grid-cols-3" staggerDelay={0.14}>
          {INTELLIGENCE.features.map((feature, i) => {
            const Icon = featureIcons[i];
            return (
              <StaggerItem key={feature.title}>
                <SpotlightCard className="h-full p-8 md:p-9" glow="rgba(22,163,74,0.10)">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-forest-100 text-forest-700 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-stats text-5xl font-semibold text-forest-950/8 transition-colors duration-500 group-hover:text-gold-600/25">
                      {feature.number}
                    </span>
                  </div>
                  <h3 className="font-heading mt-6 text-[21px] font-semibold tracking-tight text-forest-950">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-ink/65">
                    {feature.description}
                  </p>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Stats band */}
        <Reveal delay={0.1}>
          <div className="relative mt-20 overflow-hidden rounded-[32px] bg-forest-950 px-8 py-14 md:px-14">
            <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" aria-hidden="true" />
            <div
              aria-hidden="true"
              className="animate-pulse-soft absolute top-0 left-1/2 h-52 w-[560px] -translate-x-1/2 rounded-full bg-forest-500/18 blur-[100px]"
            />
            <div className="relative grid gap-12 text-center sm:grid-cols-3">
              {INTELLIGENCE.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-stats text-6xl font-semibold text-white md:text-7xl">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="font-labels mt-3 text-[14px] font-medium tracking-[0.12em] text-gold-500 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
