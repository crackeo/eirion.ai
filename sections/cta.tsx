import Image from "next/image";
import { ShieldCheck, Lock, Award, Dna, Stethoscope, Pill } from "lucide-react";
import { CTA } from "@/constants/content";
import { Reveal } from "@/components/animations/reveal";
import { Magnetic } from "@/components/animations/magnetic";
import { Button } from "@/components/ui/button";

const TRUST_BADGES = [
  { label: "HIPAA Compliant", Icon: ShieldCheck },
  { label: "SOC 2 Type II", Icon: Lock },
  { label: "ISO 15189", Icon: Award },
] as const;

/** Overlay cards covering the garbled AI-generated card artwork baked into
 *  the CTA illustration (the correctly-spelled baked cards are left visible).
 *  Positions/sizes use container-query units so they track the image exactly. */
function CtaCards() {
  const card =
    "absolute overflow-hidden rounded-[1.6cqw] border border-forest-200/80 bg-white/95 shadow-[0_1.6cqw_4cqw_-1.2cqw_rgba(5,43,20,0.35)]";

  return (
    <div aria-hidden="true" className="absolute inset-0">
      {/* covers "Genetic Tecing Syriem" */}
      <div className={`${card} left-[39.5%] top-[12%] flex w-[20%] -rotate-2 items-center gap-[1cqw] px-[1.4cqw] py-[1.2cqw]`}>
        <Dna className="size-[2.2cqw] shrink-0 text-forest-600" />
        <p className="text-[1.3cqw] font-semibold whitespace-nowrap text-slate-700">
          Genetic Testing System
        </p>
      </div>

      {/* covers "CCM / Cair Ceouraotion Asistants" */}
      <div className={`${card} left-[34.5%] top-[34%] flex w-[24.5%] -rotate-2 items-center gap-[1.2cqw] px-[1.5cqw] py-[1.4cqw]`}>
        <span className="grid size-[4cqw] shrink-0 place-items-center rounded-[1cqw] bg-forest-100 text-forest-700">
          <Stethoscope className="size-[2.2cqw]" />
        </span>
        <span className="min-w-0">
          <p className="text-[1.9cqw] leading-tight font-bold text-slate-800">CCM</p>
          <p className="text-[1.25cqw] leading-snug whitespace-nowrap text-slate-500">
            Care Coordination Assistants
          </p>
        </span>
      </div>

      {/* covers "Mededication Adflerence" */}
      <div className={`${card} left-[40.5%] top-[44.5%] w-[17.5%] -rotate-3 px-[1.5cqw] py-[1.3cqw]`}>
        <p className="flex items-center gap-[0.8cqw] text-[1.55cqw] font-semibold text-slate-700">
          <Pill className="size-[1.8cqw] shrink-0 text-forest-600" />
          Medication Adherence
        </p>
        <div className="mt-[0.9cqw] h-[0.9cqw] overflow-hidden rounded-full bg-forest-100">
          <div className="h-full w-[97%] rounded-full bg-gradient-to-r from-forest-500 to-gold-500" />
        </div>
      </div>
    </div>
  );
}

/** Final conversion section: copy left, ELLIE opening the data portal right. */
export function Cta() {
  return (
    <section id="cta" className="bg-noise relative overflow-hidden bg-forest-950 py-[110px] text-white md:py-[140px]">
      {/* Radiant background */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="animate-aurora absolute top-1/2 left-1/3 h-[70vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest-600/25 blur-[150px]" />
        <div className="animate-pulse-soft absolute top-[30%] right-[10%] h-64 w-[420px] rounded-full bg-forest-500/12 blur-[110px]" />
        <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_65%)]" />
      </div>

      <div className="container-site relative grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        {/* Copy column */}
        <div className="text-center lg:text-left">
          <Reveal>
            <h2 className="font-heading text-[clamp(38px,5.2vw,64px)] leading-[1.05] font-semibold tracking-tight text-balance">
              {CTA.title[0]}
              <br />
              <span className="text-gradient-gold animate-shimmer">{CTA.title[1]}</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-white/60 lg:mx-0">
              See how the AI Operating Layer connects your EHR, diagnostics,
              monitoring devices and genetic data — in weeks, not months. ELLIE
              will show you the way.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-10 flex justify-center lg:justify-start">
              <Magnetic>
                <Button href="#" size="lg" withArrow>
                  {CTA.button}
                </Button>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.32} blur={false}>
            <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-9 gap-y-4 lg:justify-start">
              {TRUST_BADGES.map(({ label, Icon }) => (
                <li key={label} className="flex items-center gap-2 text-[14px] text-white/45">
                  <Icon className="size-4 text-forest-300" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Visual column */}
        <Reveal direction="left" delay={0.15}>
          <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
            {/* Halo grounding the portal on the dark backdrop */}
            <div
              aria-hidden="true"
              className="animate-pulse-soft absolute inset-x-[2%] top-[18%] bottom-[8%] rounded-full bg-forest-400/12 blur-[80px]"
            />
            <div className="relative">
              <Image
                src="/ellie-cta-green.webp"
                alt="ELLIE opening a portal of connected healthcare systems: EHR, RPM monitoring, genetic testing, CCM and wearable sensors"
                width={1536}
                height={1024}
                loading="lazy"
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 560px, 50vw"
                className="h-auto w-full"
              />
              <div className="absolute inset-0 [container-type:inline-size]">
                <CtaCards />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
