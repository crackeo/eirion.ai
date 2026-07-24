import { Dna, FlaskConical, Radar, Check } from "lucide-react";
import { BASELINE } from "@/constants/content";
import { Section } from "@/components/layout/section";
import { SpotlightCard } from "@/components/cards/spotlight-card";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";

const layerIcons = [Dna, FlaskConical, Radar];

/** "Every Journey Starts with a Baseline" — the three-layer clinical framework. */
export function Baseline() {
  return (
    <Section id="diagnostics" tone="tint">
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          {/* Sticky intro + quote */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <h2 className="font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-forest-950 md:text-[54px]">
                {BASELINE.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/65">
                {BASELINE.paragraph}
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <figure className="relative mt-10 rounded-3xl border border-forest-800/10 bg-white p-8 shadow-[0_18px_50px_-28px_rgba(5,43,20,0.25)]">
                <span
                  aria-hidden="true"
                  className="font-heading absolute -top-5 left-7 text-7xl leading-none text-gold-600/30"
                >
                  “
                </span>
                <blockquote className="relative text-[17px] leading-relaxed text-forest-900 italic">
                  {BASELINE.quote}
                </blockquote>
                <figcaption className="font-labels mt-5 flex items-center gap-3 text-[14px] font-semibold text-forest-700">
                  <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-forest-500 to-forest-800 text-[13px] text-white">
                    PH
                  </span>
                  — {BASELINE.quoteAuthor}
                </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Layer cards */}
          <Stagger className="flex flex-col gap-7" staggerDelay={0.15}>
            {BASELINE.layers.map((layer, i) => {
              const Icon = layerIcons[i];
              return (
                <StaggerItem key={layer.title}>
                  <SpotlightCard className="p-8 md:p-9" glow="rgba(201,162,39,0.10)">
                    <div className="flex items-center gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-100 text-forest-700 transition-transform duration-500 group-hover:scale-110">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-labels text-[12px] font-semibold tracking-[0.18em] text-gold-600 uppercase">
                          {layer.eyebrow}
                        </p>
                        <h3 className="font-heading mt-1 text-[22px] font-semibold tracking-tight text-forest-950">
                          {layer.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-5 text-[15.5px] leading-relaxed text-ink/65">
                      {layer.description}
                    </p>
                    <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                      {layer.points.map((point) => (
                        <li key={point} className="flex items-center gap-2.5 text-[14.5px] text-ink/75">
                          <Check className="size-4 shrink-0 text-forest-600" aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
