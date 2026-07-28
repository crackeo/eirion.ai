import type { Metadata } from "next";
import { Mail, MessageCircle, Clock, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/animations/reveal";
import { CONTACT } from "@/constants/content";

export const metadata: Metadata = {
  title: "Talk To An Expert | eirion.ai",
  description:
    "Speak to the team behind the ELEANOR Platform about connecting your EHR, diagnostics, monitoring devices and genetic data — in weeks, not months.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        {/* Header band */}
        <section className="bg-noise relative overflow-hidden bg-band pt-36 pb-20 text-white md:pt-40">
          <div
            aria-hidden="true"
            className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
          />
          <div className="container-site relative text-center">
            <p className="font-labels mb-4 text-[12px] font-semibold tracking-[0.22em] text-cream uppercase">
              Talk To An Expert
            </p>
            <h1 className="font-heading text-[clamp(34px,5vw,58px)] leading-[1.06] font-semibold tracking-tight text-balance">
              Let&apos;s map ELEANOR onto
              <br />
              <span className="text-gradient-gold animate-shimmer">your infrastructure.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-cream">
              Tell us what you run today and we&apos;ll show you what an MCP overlay
              looks like on top of it — no rip-and-replace.
            </p>
          </div>
        </section>

        {/* Form + direct channels */}
        <section className="bg-cream py-[90px] md:py-[110px]">
          <div className="container-site grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
            <Reveal>
              <ContactForm />
            </Reveal>

            <Reveal delay={0.12}>
              <div className="flex flex-col gap-4">
                <h2 className="font-heading text-[22px] font-semibold tracking-tight text-forest-950">
                  Or reach us directly
                </h2>

                <a
                  href={`mailto:${CONTACT.email}`}
                  className="group flex items-start gap-4 rounded-2xl border border-forest-800/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-500/40"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <Mail className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="font-labels block text-[12px] font-semibold tracking-[0.14em] text-ink/70 uppercase">
                      Email
                    </span>
                    <span className="mt-0.5 block truncate text-[15px] font-medium text-forest-700 group-hover:text-forest-600">
                      {CONTACT.email}
                    </span>
                  </span>
                </a>

                <a
                  href={`https://wa.me/${CONTACT.whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-forest-800/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-500/40"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <MessageCircle className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="font-labels block text-[12px] font-semibold tracking-[0.14em] text-ink/70 uppercase">
                      WhatsApp
                    </span>
                    <span className="mt-0.5 block text-[15px] font-medium text-forest-700 group-hover:text-forest-600">
                      {CONTACT.whatsappDisplay}
                    </span>
                  </span>
                </a>

                <div className="mt-2 space-y-3 rounded-2xl bg-forest-50 p-5">
                  <p className="flex items-start gap-3 text-[14.5px] leading-relaxed text-ink/70">
                    <Clock className="mt-0.5 size-4 shrink-0 text-forest-600" aria-hidden="true" />
                    We reply to every enquiry within one business day.
                  </p>
                  <p className="flex items-start gap-3 text-[14.5px] leading-relaxed text-ink/70">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-forest-600" aria-hidden="true" />
                    Nothing you type is stored on this site — your message goes
                    straight to your own mail or WhatsApp app.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
