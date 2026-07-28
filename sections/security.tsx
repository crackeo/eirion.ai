import { Check, FlaskConical, Lock, type LucideIcon } from "lucide-react";
import { SECURITY } from "@/constants/content";
import { Section, SectionHeading } from "@/components/layout/section";
import { Stagger, StaggerItem } from "@/components/animations/reveal";
import { Reveal } from "@/components/animations/reveal";

const CERT_META: Record<string, { Icon: LucideIcon; caption: string }> = {
  HIPAA: { Icon: Check, caption: "Compliant" },
  "ISO 15189": { Icon: FlaskConical, caption: "Certified" },
  GDPR: { Icon: Lock, caption: "Compliant" },
};

/** Deep-green badge shield with icon, cert name and micro caption. */
function ShieldBadge({ name }: { name: string }) {
  const { Icon, caption } = CERT_META[name];
  return (
    <div className="relative h-[104px] w-[88px] shrink-0 drop-shadow-[0_10px_18px_rgba(18,69,41,0.35)]">
      <svg viewBox="0 0 88 104" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`shield-${name.replace(/\s/g, "")}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="55%" stopColor="#10753a" />
            <stop offset="100%" stopColor="#124529" />
          </linearGradient>
        </defs>
        <path
          d="M44 2 82 14 v38 c0 24 -16 40 -38 50 C22 92 6 76 6 52 V14 Z"
          fill={`url(#shield-${name.replace(/\s/g, "")})`}
          stroke="#d2a92b"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
      </svg>
      <div className="relative flex h-full flex-col items-center justify-center gap-0.5 pb-2 text-white">
        <span className="grid size-7 place-items-center rounded-full border border-white/40">
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
        <p className="font-labels mt-1 text-[11px] leading-none font-bold tracking-wide whitespace-nowrap">
          {name}
        </p>
        <p className="font-labels text-[6.5px] tracking-[0.22em] text-gold-400 uppercase">
          {caption}
        </p>
        <div className="mt-0.5 flex gap-[3px]" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className="size-[3px] rounded-full bg-gold-500/80" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Compliance certifications — light cards matching the reference design. */
export function Security() {
  return (
    <Section tone="tint">
      <div className="container-site">
        <SectionHeading title={SECURITY.title} paragraph={SECURITY.paragraph} />

        <Stagger className="grid gap-8 lg:grid-cols-3" staggerDelay={0.14}>
          {SECURITY.certifications.map((cert) => (
            <StaggerItem key={cert.name}>
              <div className="group h-full overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-28px_rgba(18,69,41,0.35)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-26px_rgba(18,69,41,0.4)]">
                {/* Gradient top bar */}
                <div
                  aria-hidden="true"
                  className="h-1.5 w-full bg-gradient-to-r from-forest-600 via-forest-500 to-gold-600"
                />
                <div className="p-8 md:p-9">
                  <div className="flex items-start gap-6">
                    <div className="transition-transform duration-500 group-hover:scale-105">
                      <ShieldBadge name={cert.name} />
                    </div>
                    <div className="pt-2">
                      <h3 className="font-heading text-[24px] font-semibold tracking-tight text-forest-950">
                        {cert.name}
                      </h3>
                      <p className="mt-1.5 text-[15.5px] leading-snug text-ink/60">
                        {cert.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="mt-7 text-[15.5px] leading-relaxed text-ink/65">
                    {cert.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <p className="flex items-baseline gap-3 rounded-2xl bg-forest-50 px-5 py-3.5">
                      <span className="font-stats text-[22px] leading-none font-bold text-forest-700">
                        {cert.stat}
                      </span>
                      <span className="font-labels text-[12px] font-semibold tracking-[0.12em] text-ink/50 uppercase">
                        {cert.statLabel}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-[14px] font-medium text-ink/70">
                      <span className="size-2 rounded-full bg-forest-600" aria-hidden="true" />
                      Verified
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15}>
          <ul className="mt-16 flex flex-wrap items-center justify-center gap-y-4">
            {SECURITY.badges.map((badge, i) => (
              <li key={badge} className="flex items-center">
                {i > 0 && (
                  <span aria-hidden="true" className="mx-6 h-4 w-px bg-forest-800/15" />
                )}
                <span className="flex items-center gap-2.5 text-[15px] text-ink/65">
                  <Check className="size-4 text-forest-600" aria-hidden="true" />
                  {badge}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
