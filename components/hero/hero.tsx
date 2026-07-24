"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { HERO } from "@/constants/content";
import { WordReveal } from "@/components/animations/word-reveal";
import { RotatingText } from "@/components/animations/rotating-text";
import { Magnetic } from "@/components/animations/magnetic";
import { Button } from "@/components/ui/button";
import { HeroCards } from "@/components/hero/hero-cards";

const HeroScene = dynamic(() => import("@/components/hero/hero-scene"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="absolute inset-0 rounded-full bg-forest-500/10 blur-3xl"
    />
  ),
});

/** Mount the WebGL scene on the user's first interaction (or after a quiet
 *  fallback delay), so the three.js chunk never competes with LCP, TBT or
 *  hydration on the critical path. Any pointer, scroll or key input — which
 *  real visitors produce almost immediately — triggers it. */
function useInteractionMount() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const events = ["pointermove", "pointerdown", "scroll", "keydown", "touchstart"] as const;
    const arm = () => setReady(true);
    events.forEach((e) => window.addEventListener(e, arm, { once: true, passive: true }));
    const fallback = setTimeout(arm, 14000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, arm));
      clearTimeout(fallback);
    };
  }, []);
  return ready;
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const sceneReady = useInteractionMount();

  return (
    <section className="bg-noise relative flex min-h-svh items-center overflow-hidden bg-forest-950 text-white [@media(min-height:1100px)]:min-h-[980px]">
      {/* ── Background system ─────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]" />
        {/* Aurora blobs */}
        <div className="animate-aurora absolute -top-1/4 left-[-10%] h-[65vh] w-[55vw] rounded-full bg-forest-600/25 blur-[130px]" />
        <div className="animate-aurora absolute right-[-12%] bottom-[-20%] h-[60vh] w-[50vw] rounded-full bg-forest-500/20 blur-[140px] [animation-delay:-6s]" />
        <div className="animate-aurora absolute top-[30%] right-[18%] h-[36vh] w-[26vw] rounded-full bg-gold-600/12 blur-[120px] [animation-delay:-11s]" />
        {/* Light rays */}
        <div className="absolute -top-32 left-1/2 h-[60vh] w-px -translate-x-40 rotate-[18deg] bg-gradient-to-b from-gold-500/35 to-transparent" />
        <div className="absolute -top-32 left-1/2 h-[50vh] w-px translate-x-52 rotate-[-14deg] bg-gradient-to-b from-forest-300/30 to-transparent" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,26,14,0.85)_100%)]" />
      </div>

      <div className="container-site relative grid items-center gap-16 pt-36 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-28">
        {/* ── Copy column (CSS-only entrances for instant LCP) ── */}
        <div className="max-w-2xl">
          <p
            className="anim-rise font-labels mb-7 inline-flex items-center gap-2.5 rounded-full border border-gold-500/25 bg-gold-500/8 px-4 py-2 text-[12px] font-semibold tracking-[0.2em] text-gold-500 uppercase"
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
            className="anim-rise font-labels mt-6 text-lg font-medium text-forest-300 md:text-xl"
            style={{ animationDelay: "0.4s" }}
          >
            <RotatingText phrases={[...HERO.taglines]} />
          </p>

          <p
            className="anim-rise mt-6 max-w-xl text-[17px] leading-relaxed text-white/60 md:text-lg"
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

        {/* ── Visual column: ELLIE illustration + overlay cards ── */}
        <div className="relative mx-auto w-full max-w-[460px] sm:max-w-[600px] lg:max-w-none">
          {/* Ambient 3D constellation behind the character */}
          <div className="absolute inset-[-14%]">
            {sceneReady ? (
              <HeroScene />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-forest-500/10 blur-3xl"
              />
            )}
          </div>
          {/* Soft halo grounding the character on the dark backdrop */}
          <div
            aria-hidden="true"
            className="absolute inset-x-[12%] top-[8%] bottom-[4%] rounded-full bg-forest-400/12 blur-[70px]"
          />
          {/* NOTE: width/height (x-descriptor srcset) instead of fill+sizes —
              responsive w-descriptor selection stalls in some Chrome contexts,
              and containment must not sit on the <img>'s own parent. */}
          <div className="anim-scale relative" style={{ animationDelay: "0.35s" }}>
            {/* Soft emerald glow grounding her where the fade begins */}
            <div
              aria-hidden="true"
              className="animate-pulse-soft absolute bottom-[2%] left-1/2 h-[16%] w-[46%] -translate-x-1/2 rounded-[50%] bg-forest-400/25 blur-[42px]"
            />
            <Image
              src="/ellie-hero-green.png"
              alt="ELLIE, the interactive AI health coach, holding a yoga mat and water bottle, surrounded by live patient monitoring cards"
              width={1536}
              height={1024}
              priority
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 600px, 46vw"
              className="h-auto w-full [mask-image:linear-gradient(to_bottom,black_72%,transparent_97%)]"
            />
            <div className="absolute inset-0 [container-type:inline-size]">
              <HeroCards />
            </div>
          </div>
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
            className="size-1.5 rounded-full bg-gold-500"
            animate={reduceMotion ? undefined : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </m.div>
    </section>
  );
}
