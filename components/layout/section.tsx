import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /** dark = deep forest, light = cream, tint = pale green */
  tone?: "dark" | "light" | "tint";
}

const tones = {
  dark: "bg-forest-950 text-white",
  light: "bg-cream text-ink",
  tint: "bg-forest-50 text-ink",
};

export function Section({ children, id, className, tone = "light" }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative overflow-hidden py-[100px] md:py-[140px]", tones[tone], className)}
    >
      {children}
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: readonly string[] | string;
  paragraph?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  paragraph,
  align = "center",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const lines = typeof title === "string" ? [title] : title;
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "mb-16 max-w-3xl md:mb-20",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <Reveal delay={0}>
          <p
            className={cn(
              "font-labels mb-5 text-[13px] font-semibold tracking-[0.22em] uppercase",
              dark ? "text-gold-500" : "text-forest-600"
            )}
          >
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-balance md:text-[56px]",
            dark ? "text-white" : "text-forest-950"
          )}
        >
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
      </Reveal>
      {paragraph && (
        <Reveal delay={0.18}>
          <p
            className={cn(
              "mt-6 text-lg leading-relaxed",
              dark ? "text-white/65" : "text-ink/65",
              align === "center" && "mx-auto max-w-2xl"
            )}
          >
            {paragraph}
          </p>
        </Reveal>
      )}
    </div>
  );
}
