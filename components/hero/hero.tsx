"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { HERO } from "@/constants/content";
import { WordReveal } from "@/components/animations/word-reveal";
import { RotatingText } from "@/components/animations/rotating-text";
import { Magnetic } from "@/components/animations/magnetic";
import { Button } from "@/components/ui/button";
import { HeroCards } from "@/components/hero/hero-cards";
import { HeroOrbit } from "@/components/hero/hero-orbit";

/** Scroll-linked parallax for the hero visual.
 *
 *  Progress runs 0 -> 1 as the hero scrolls out of view. The ring drifts and
 *  grows faster than the character, which reads as depth; the character lags
 *  slightly so she lingers a beat longer. Transform/opacity only, so this
 *  stays on the compositor and never touches layout (CLS stays 0). */
function useHeroParallax(target: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end start"],
  });
  // smooth the raw progress so the drift feels weighted rather than twitchy
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 });

  return {
    ringY: useTransform(p, [0, 1], [0, 130]),
    ringScale: useTransform(p, [0, 1], [1, 1.14]),
    ringRotate: useTransform(p, [0, 1], [0, 26]),
    ringOpacity: useTransform(p, [0, 0.75, 1], [1, 0.55, 0.2]),
    girlY: useTransform(p, [0, 1], [0, 72]),
    girlScale: useTransform(p, [0, 1], [1, 1.05]),
  };
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { ringY, ringScale, ringRotate, ringOpacity, girlY, girlScale } =
    useHeroParallax(sectionRef);

  // both ring layers share one transform so the circle never splits in half
  const ringStyle = reduceMotion
    ? undefined
    : { y: ringY, scale: ringScale, rotate: ringRotate, opacity: ringOpacity,
        transformOrigin: "55% 48%" as const };
  const girlStyle = reduceMotion ? undefined : { y: girlY, scale: girlScale };

  return (
    <section
      ref={sectionRef}
      className="bg-noise relative flex min-h-svh items-center overflow-hidden bg-band text-white [@media(min-height:1100px)]:min-h-[980px]"
    >
      {/* ── Background system ─────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]" />
        {/* Aurora blobs */}
        <div className="animate-aurora absolute -top-1/4 left-[-10%] h-[65vh] w-[55vw] rounded-full bg-forest-600/25 blur-[130px]" />
        <div className="animate-aurora absolute right-[-12%] bottom-[-20%] h-[60vh] w-[50vw] rounded-full bg-forest-500/20 blur-[140px] [animation-delay:-6s]" />
        <div className="animate-aurora absolute top-[30%] right-[18%] h-[36vh] w-[26vw] rounded-full bg-forest-400/14 blur-[120px] [animation-delay:-11s]" />
        {/* Light rays */}
        <div className="absolute -top-32 left-1/2 h-[60vh] w-px -translate-x-40 rotate-[18deg] bg-gradient-to-b from-cream/35 to-transparent" />
        <div className="absolute -top-32 left-1/2 h-[50vh] w-px translate-x-52 rotate-[-14deg] bg-gradient-to-b from-forest-300/30 to-transparent" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(13,61,32,0.42)_100%)]" />
      </div>

      <div className="container-site relative grid items-center gap-16 pt-36 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-28">
        {/* ── Copy column (CSS-only entrances for instant LCP) ── */}
        <div className="max-w-2xl">
          <p
            className="anim-rise font-labels mb-7 inline-flex items-center gap-2.5 rounded-full border border-cream/25 bg-forest-300/10 px-4 py-2 text-[12px] font-semibold tracking-[0.2em] text-cream uppercase"
          >
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-gold-500" />
            </span>
            {HERO.eyebrow}
          </p>

          <h1 className="font-heading text-[clamp(46px,7.2vw,92px)] leading-[1.06] font-semibold tracking-tight">
            <WordReveal text={HERO.headlineTop} delay={0.1} />
            <br />
            {/* background-clip:text breaks with transformed children, so this line reveals as a whole */}
            <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
              <span
                className="anim-word text-gradient-gold animate-shimmer"
                style={{ animationDelay: "0.28s" }}
              >
                {HERO.headlineBottom}
              </span>
            </span>
          </h1>

          <p
            className="anim-rise font-labels mt-6 text-lg font-medium text-cream md:text-xl"
            style={{ animationDelay: "0.4s" }}
          >
            <RotatingText phrases={[...HERO.taglines]} />
          </p>

          <p
            className="anim-rise mt-6 max-w-xl text-[17px] leading-relaxed text-cream md:text-lg"
            style={{ animationDelay: "0.18s" }}
          >
            {HERO.paragraph}
          </p>

          <div
            className="anim-scale mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.5s" }}
          >
            <Magnetic>
              <Button href="#platform" size="lg" withArrow>
                {HERO.primaryCta}
              </Button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Button href="#architecture" variant="ghost-dark" size="lg">
                {HERO.secondaryCta}
              </Button>
            </Magnetic>
          </div>
        </div>

        {/* ── Visual column: ELLIE illustration + overlay cards ──
            Scaled up on wide screens so the character reads at full size */}
        <div className="relative mx-auto w-full max-w-[460px] sm:max-w-[600px] lg:max-w-none lg:scale-[1.14] xl:scale-[1.28] xl:translate-x-3">
          {/* Animated orbital ring — sits BEHIND her, drifts on scroll */}
          <m.div className="pointer-events-none absolute inset-0 z-0" style={ringStyle}>
            <HeroOrbit />
          </m.div>
          {/* Soft halo grounding the character on the dark backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[12%] top-[8%] bottom-[4%] rounded-full bg-forest-400/12 blur-[70px]"
          />
          {/* NOTE: a plain <img>, not next/image. Static export forces
              `images.unoptimized`, and that makes next/image emit no srcset at
              all — so every phone downloaded the full 970w / 224 KB file while
              the `sizes` prop sat inert. The variants are pre-generated into
              /public by scripts/gen-images.py so srcset actually ships.

              Deliberately no hand-written <link rel="preload"> alongside it: an
              imageSizes string that disagreed with `sizes` below would make the
              browser fetch two variants.

              And deliberately NO fetchPriority="high" here: the LCP element is
              the <h1> text, which is gated on the stylesheet. Measured on the
              same local setup, prioritising this image cost 3 mobile points
              (87 -> 84) because it stole bandwidth from that CSS.

              width/height stay at the 970x1024 intrinsic ratio so the box is
              reserved identically and CLS stays 0. */}
          {/* Character — lags slightly behind the ring on scroll */}
          <m.div style={girlStyle}>
            <div className="anim-scale relative" style={{ animationDelay: "0.35s" }}>
              {/* Soft emerald glow grounding her where the fade begins */}
              <div
                aria-hidden="true"
                className="animate-pulse-soft absolute bottom-[2%] left-1/2 h-[16%] w-[46%] -translate-x-1/2 rounded-[50%] bg-forest-400/25 blur-[42px]"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ellie-hero-big.webp"
                srcSet="/ellie-hero-big-420w.webp 420w, /ellie-hero-big-560w.webp 560w, /ellie-hero-big-720w.webp 720w, /ellie-hero-big.webp 970w"
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 540px, 42vw"
                alt="ELLIE, the interactive AI health coach, holding a yoga mat and water bottle, surrounded by live patient monitoring cards"
                width={970}
                height={1024}
                decoding="async"
                className="h-auto w-full [mask-image:linear-gradient(to_bottom,black_72%,transparent_97%)]"
              />
            </div>
          </m.div>

          {/* Lower arc of the same ring, IN FRONT of her legs so the ring
              wraps her body. Shares ringStyle with the back layer so the two
              halves stay welded together while scrolling. */}
          <m.div
            className="pointer-events-none absolute inset-0 z-20"
            style={ringStyle}
          >
            <HeroOrbit variant="front" />
          </m.div>

          {/* Stat cards. Box is pinned to the image's own aspect ratio rather
              than inset-0, so they stay pixel-aligned to the baked artwork
              even as a sibling — and they ride the same transform as her. */}
          <m.div
            className="absolute inset-x-0 top-0 z-30 aspect-[970/1024] [container-type:inline-size]"
            style={girlStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <HeroCards />
          </m.div>
        </div>
      </div>

      {/* Scroll hint */}
      <m.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <div className="flex h-9 w-5.5 items-start justify-center rounded-full border border-white/25 p-1.5">
          <m.div
            className="size-1.5 rounded-full bg-cream"
            animate={reduceMotion ? undefined : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </m.div>
    </section>
  );
}
