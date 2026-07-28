import { Building2, Users, Check } from "lucide-react";
import { GROWTH_ENGINES } from "@/constants/content";
import { Section, SectionHeading } from "@/components/layout/section";
import { SpotlightCard } from "@/components/cards/spotlight-card";
import { Stagger, StaggerItem } from "@/components/animations/reveal";

const icons = [Building2, Users];

/** "Two Growth Engines" — the platform's dual value proposition. */
export function GrowthEngines() {
  return (
    <Section id="platform" tone="light">
      <div className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_15%,transparent_65%)]" aria-hidden="true" />
      <div className="container-site relative">
        <SectionHeading
          title={GROWTH_ENGINES.title}
          paragraph={GROWTH_ENGINES.paragraph}
        />

        <Stagger className="grid gap-8 lg:grid-cols-2" staggerDelay={0.16}>
          {GROWTH_ENGINES.engines.map((engine, i) => {
            const Icon = icons[i];
            return (
              <StaggerItem key={engine.title}>
                <SpotlightCard className="h-full p-9 md:p-11" glow="rgba(51,161,99,0.10)">
                  <div className="flex items-start justify-between">
                    <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 text-white shadow-[0_10px_30px_-10px_rgba(31,107,65,0.6)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="font-labels rounded-full border border-gold-600/25 bg-gold-500/10 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.14em] text-gold-700 uppercase">
                      {engine.eyebrow}
                    </span>
                  </div>

                  <h3 className="font-heading mt-7 text-2xl font-semibold tracking-tight text-forest-950 md:text-[28px]">
                    {engine.title}
                  </h3>

                  <ul className="mt-7 space-y-4">
                    {engine.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[16px] leading-relaxed text-ink/70">
                        <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-forest-100 text-forest-700">
                          <Check className="size-3" aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#cta"
                    className="group/link font-labels mt-9 inline-flex items-center gap-2 text-[15px] font-semibold text-forest-700 transition-colors hover:text-forest-900"
                  >
                    {engine.cta}
                    <span className="transition-transform duration-300 group-hover/link:translate-x-1.5" aria-hidden="true">
                      →
                    </span>
                  </a>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
