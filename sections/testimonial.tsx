import { TESTIMONIAL } from "@/constants/content";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/animations/reveal";

/** Single flagship testimonial with oversized quote mark. */
export function Testimonial() {
  return (
    <Section tone="light" className="!py-[110px]">
      <div className="container-site">
        <Reveal>
          <figure className="glass-light relative mx-auto max-w-4xl rounded-[36px] p-10 text-center shadow-[0_30px_90px_-40px_rgba(5,43,20,0.3)] md:p-16">
            <span
              aria-hidden="true"
              className="font-heading pointer-events-none absolute -top-8 left-8 text-[120px] leading-none text-gold-600/20 md:left-12"
            >
              “
            </span>
            <blockquote className="font-heading relative text-2xl leading-snug font-medium text-balance text-forest-950 md:text-[30px]">
              {TESTIMONIAL.quote}
            </blockquote>
            <figcaption className="mt-8 flex items-center justify-center gap-4">
              <span
                aria-hidden="true"
                className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-forest-500 to-forest-800 text-[14px] font-semibold text-white"
              >
                FH
              </span>
              <span className="font-labels text-[15px] font-semibold text-forest-700">
                {TESTIMONIAL.author}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
