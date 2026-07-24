import { Eye, GitBranch, Trees } from "lucide-react";
import { NATURALIST } from "@/constants/content";
import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";

const principleIcons = [Eye, GitBranch, Trees];

/** Philosophy section: naturalist principles mapped to ELLIE's behavior. */
export function Naturalist() {
  return (
    <Section id="philosophy" tone="dark" className="bg-noise">
      <div
        aria-hidden="true"
        className="animate-aurora pointer-events-none absolute right-[-8%] bottom-[-10%] h-[45vh] w-[38vw] rounded-full bg-forest-500/15 blur-[140px]"
      />

      <div className="container-site relative">
        {/* Einstein quote */}
        <Reveal>
          <figure className="mx-auto mb-24 max-w-3xl text-center">
            <span aria-hidden="true" className="font-heading text-8xl leading-none text-gold-500/25">
              “
            </span>
            <blockquote className="font-heading -mt-8 text-2xl leading-snug font-medium text-balance text-white/90 md:text-[32px]">
              {NATURALIST.quote}
            </blockquote>
            <figcaption className="font-labels mt-6 text-[14px] tracking-[0.2em] text-gold-500 uppercase">
              — {NATURALIST.quoteAuthor}
            </figcaption>
          </figure>
        </Reveal>

        <SectionHeading
          eyebrow={NATURALIST.eyebrow}
          title={NATURALIST.title}
          paragraph={NATURALIST.paragraph}
          tone="dark"
        />

        <Stagger className="grid gap-7 md:grid-cols-3" staggerDelay={0.14}>
          {NATURALIST.principles.map((principle, i) => {
            const Icon = principleIcons[i];
            return (
              <StaggerItem key={principle.title}>
                <div className="group glass-dark relative h-full overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-500/30">
                  <div
                    aria-hidden="true"
                    className="absolute -top-16 -right-16 size-40 rounded-full bg-gold-500/8 blur-3xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-0"
                  />
                  <span className="grid size-13 place-items-center rounded-2xl border border-gold-500/25 bg-gold-500/10 text-gold-500 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading mt-6 text-[22px] font-semibold tracking-tight text-white">
                    {principle.title}
                  </h3>

                  <div className="mt-5 space-y-5">
                    <div>
                      <p className="font-labels text-[11.5px] font-semibold tracking-[0.18em] text-forest-300 uppercase">
                        Naturalist Principle
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-white/65">
                        {principle.principle}
                      </p>
                    </div>
                    <div className="border-t border-white/10 pt-5">
                      <p className="font-labels text-[11.5px] font-semibold tracking-[0.18em] text-gold-500 uppercase">
                        How ELLIE Applies This
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-white/65">
                        {principle.application}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
