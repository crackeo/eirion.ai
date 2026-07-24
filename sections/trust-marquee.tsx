import { TRUSTED_BY } from "@/constants/content";
import { Reveal } from "@/components/animations/reveal";

/** Auto-scrolling partner marquee with edge fades; pauses on hover. */
export function TrustMarquee() {
  const row = [...TRUSTED_BY, ...TRUSTED_BY, ...TRUSTED_BY];

  return (
    <section aria-label="Trusted by" className="border-y border-forest-800/8 bg-forest-50 py-14">
      <div className="container-site">
        <Reveal blur={false}>
          <p className="font-labels mb-9 text-center text-[13px] font-semibold tracking-[0.24em] text-forest-700/60 uppercase">
            Trusted by forward-thinking organizations
          </p>
        </Reveal>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_16%,black_84%,transparent)]">
        <div className="animate-marquee flex w-max items-center gap-20 hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...row, ...row].map((name, i) => (
            <span
              key={`${name}-${i}`}
              aria-hidden={i >= row.length}
              className="font-heading text-xl font-semibold whitespace-nowrap text-forest-900/45 transition-colors duration-300 hover:text-forest-800 md:text-2xl"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
