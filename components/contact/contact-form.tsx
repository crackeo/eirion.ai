"use client";

import { useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Mail, MessageCircle, ArrowRight } from "lucide-react";
import { CONTACT } from "@/constants/content";
import { cn } from "@/lib/utils";

/** Enquiry form for a statically-hosted site.
 *
 *  There is no server to POST to, so instead of a backend the form composes
 *  the message and hands it to a channel the visitor already has: their mail
 *  client (mailto:) or WhatsApp (wa.me deep link). Both work from plain
 *  static hosting with no API key, no third party, and nothing to leak.
 */

interface Fields {
  name: string;
  email: string;
  org: string;
  message: string;
}

const EMPTY: Fields = { name: "", email: "", org: "", message: "" };

export function ContactForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const reduceMotion = useReducedMotion();

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!f.name.trim()) next.name = "Please tell us your name.";
    if (!f.email.trim()) next.email = "We need an email to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) next.email = "That email doesn't look right.";
    if (!f.message.trim()) next.message = "Let us know what you'd like to discuss.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /** One plain-text body, reused by both channels. */
  const compose = () =>
    [
      `Name: ${f.name}`,
      `Email: ${f.email}`,
      f.org.trim() && `Organisation: ${f.org}`,
      "",
      f.message,
      "",
      "— Sent from eirion.ai",
    ]
      .filter(Boolean)
      .join("\n");

  const sendEmail = () => {
    if (!validate()) return;
    const subject = `ELEANOR enquiry — ${f.name}${f.org.trim() ? ` (${f.org})` : ""}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(compose())}`;
  };

  const sendWhatsApp = () => {
    if (!validate()) return;
    window.open(
      `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(compose())}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const field =
    "w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-forest-950 transition-colors placeholder:text-ink/35 focus:outline-none";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendEmail();
      }}
      className="rounded-3xl border border-forest-800/10 bg-white p-7 shadow-[0_20px_50px_-30px_rgba(18,69,41,0.3)] md:p-9"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className="font-labels mb-2 block text-[12.5px] font-semibold tracking-[0.14em] text-forest-600 uppercase">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            value={f.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(field, errors.name ? "border-red-400" : "border-forest-800/15 focus:border-forest-500")}
            placeholder="Dr Jane Okafor"
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-[13px] text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="email" className="font-labels mb-2 block text-[12.5px] font-semibold tracking-[0.14em] text-forest-600 uppercase">
            Work email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={f.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(field, errors.email ? "border-red-400" : "border-forest-800/15 focus:border-forest-500")}
            placeholder="jane@clinic.org"
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-[13px] text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="org" className="font-labels mb-2 block text-[12.5px] font-semibold tracking-[0.14em] text-forest-600 uppercase">
            Organisation
          </label>
          <input
            id="org"
            value={f.org}
            onChange={set("org")}
            className={cn(field, "border-forest-800/15 focus:border-forest-500")}
            placeholder="Forward Health Network"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="font-labels mb-2 block text-[12.5px] font-semibold tracking-[0.14em] text-forest-600 uppercase">
            How can ELLIE help? <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            value={f.message}
            onChange={set("message")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={cn(field, "resize-y", errors.message ? "border-red-400" : "border-forest-800/15 focus:border-forest-500")}
            placeholder="We run a 40-clinician network and want to add RPM without replacing our EHR…"
          />
          {errors.message && (
            <p id="message-error" className="mt-1.5 text-[13px] text-red-600">{errors.message}</p>
          )}
        </div>
      </div>

      <p className="mt-6 text-[13.5px] leading-relaxed text-ink/55">
        Choose how you&apos;d like to send this. Both options open with your message
        already filled in — nothing is stored on this site.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <m.button
          type="submit"
          whileHover={reduceMotion ? undefined : { y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="group font-labels inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_28px_-10px_rgba(18,69,41,0.5)] transition-colors hover:bg-forest-600"
        >
          <Mail className="size-4" aria-hidden="true" />
          Send via email
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </m.button>

        <m.button
          type="button"
          onClick={sendWhatsApp}
          whileHover={reduceMotion ? undefined : { y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="font-labels inline-flex items-center gap-2 rounded-full border-2 border-forest-600 px-6 py-3 text-[15px] font-semibold text-forest-700 transition-colors hover:bg-forest-50"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Send via WhatsApp
        </m.button>
      </div>
    </form>
  );
}
