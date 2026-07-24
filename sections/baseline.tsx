import { Dna, FlaskConical, Activity, CircleCheck } from "lucide-react";
import { BASELINE } from "@/constants/content";
import { Section } from "@/components/layout/section";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";

const layerStyles = [
  { Icon: Dna, tile: "bg-forest-100/70 text-forest-700", check: "text-forest-600" },
  { Icon: FlaskConical, tile: "bg-gold-400/25 text-amber-brand", check: "text-amber-brand" },
  { Icon: Activity, tile: "bg-forest-100/70 text-forest-700", check: "text-forest-600" },
] as const;

/** "Every Journey Starts with a Baseline" — intro, pull quote and the
 *  three-layer clinical framework in a row. */
export function Baseline() {
  return (
    <Section id="diagnostics" tone="tint">
      <div className="container-site">
        {/* Intro */}
        <Reveal>
          <p className="font-labels flex items-center gap-4 text-[13px] font-semibold tracking-[0.22em] text-forest-600 uppercase">
            <span aria-hidden="true" className="h-px w-10 bg-forest-600/40" />
            {BASELINE.quoteAuthor}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-heading mt-6 max-w-3xl text-4xl leading-[1.08] font-semibold tracking-tight text-forest-950 md:text-[54px]">
            {BASELINE.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink/65">
            {BASELINE.paragraph}
          </p>
        </Reveal>

        {/* Pull quote */}
        <Reveal delay={0.22}>
          <figure className="mt-16 max-w-3xl border-l-2 border-forest-500/50 pl-7">
            <blockquote className="text-[19px] leading-relaxed text-forest-900/85 italic md:text-[21px]">
              {BASELINE.quote}
            </blockquote>
            <figcaption className="font-labels mt-5 text-[13px] font-semibold tracking-[0.18em] text-ink/50 uppercase">
              — {BASELINE.quoteAuthor}
            </figcaption>
          </figure>
        </Reveal>

        {/* Layer cards */}
        <Stagger className="mt-20 grid gap-8 md:grid-cols-3" staggerDelay={0.14}>
          {BASELINE.layers.map((layer, i) => {
            const { Icon, tile, check } = layerStyles[i];
            return (
              <StaggerItem key={layer.title}>
                <div className="group h-full rounded-lg bg-white p-8 shadow-[0_10px_34px_-26px_rgba(5,43,20,0.35)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_48px_-24px_rgba(5,43,20,0.35)] md:p-9">
                  <span className={`grid size-14 place-items-center rounded-xl transition-transform duration-500 group-hover:scale-105 ${tile}`}>
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <p className="font-labels mt-9 text-[12.5px] font-semibold tracking-[0.16em] text-ink/45 uppercase">
                    {layer.eyebrow}
                  </p>
                  <h3 className="font-heading mt-2.5 text-[23px] font-semibold tracking-tight text-forest-950">
                    {layer.title}
                  </h3>
                  <p className="mt-4 text-[15.5px] leading-relaxed text-ink/60">
                    {layer.description}
                  </p>
                  <ul className="mt-6 space-y-3.5">
                    {layer.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-[15px] text-ink/75">
                        <CircleCheck className={`mt-[3px] size-[18px] shrink-0 ${check}`} aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
