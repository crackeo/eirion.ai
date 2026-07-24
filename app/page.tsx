import { Navbar } from "@/components/navigation/navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { Hero } from "@/components/hero/hero";
import { TrustMarquee } from "@/sections/trust-marquee";
import { GrowthEngines } from "@/sections/growth-engines";
import { AgentEcosystem } from "@/sections/agent-ecosystem";
import { Baseline } from "@/sections/baseline";
import { ClosedLoop } from "@/sections/closed-loop";
import { Naturalist } from "@/sections/naturalist";
import { SpeedAdvantage } from "@/sections/speed-advantage";
import { Intelligence } from "@/sections/intelligence";
import { Flow } from "@/sections/flow";
import { Testimonial } from "@/sections/testimonial";
import { Security } from "@/sections/security";
import { Faq } from "@/sections/faq";
import { Cta } from "@/sections/cta";
import { Footer } from "@/components/footer/footer";
import { FAQ } from "@/constants/content";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <TrustMarquee />
        <GrowthEngines />
        <AgentEcosystem />
        <Baseline />
        <ClosedLoop />
        <Naturalist />
        <SpeedAdvantage />
        <Intelligence />
        <Flow />
        <Testimonial />
        <Security />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
