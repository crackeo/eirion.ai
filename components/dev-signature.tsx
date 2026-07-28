"use client";

import { useEffect } from "react";
import { DEVELOPER } from "@/constants/content";

/** Developer credit printed to the browser console.
 *
 *  Client-side code cannot be hidden — the browser has to download and run it,
 *  so DevTools can always show it. What this does instead is make the *first*
 *  thing a curious inspector sees a deliberate credit rather than a wall of
 *  minified output. Production builds already ship no source maps and mangled
 *  names, so the original source is not recoverable.
 *
 *  Runs once, after paint, and logs nothing measurable to the performance
 *  budget. Skipped for reduced-motion users' benefit? No — console output is
 *  invisible to them either way, but we do skip it in dev to keep HMR output
 *  readable.
 */
export function DevSignature() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof console === "undefined") return;

    const banner = String.raw`
   ██████╗██████╗  █████╗  ██████╗██╗  ██╗    ███████╗ ██████╗
  ██╔════╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝    ██╔════╝██╔═══██╗
  ██║     ██████╔╝███████║██║     █████╔╝     █████╗  ██║   ██║
  ██║     ██╔══██╗██╔══██║██║     ██╔═██╗     ██╔══╝  ██║   ██║
  ╚██████╗██║  ██║██║  ██║╚██████╗██║  ██╗    ███████╗╚██████╔╝
   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚══════╝ ╚═════╝`;

    console.log(
      `%c${banner}`,
      "color:#f5b81c;font-family:ui-monospace,Menlo,monospace;font-size:10px;line-height:1.1"
    );

    console.log(
      `%c ${DEVELOPER.handle} %c ${DEVELOPER.role} `,
      "background:#f5b81c;color:#11562d;font-weight:800;padding:5px 11px;border-radius:5px 0 0 5px;font-size:13px;letter-spacing:.06em",
      "background:#11562d;color:#fbf9f1;padding:5px 11px;border-radius:0 5px 5px 0;font-size:13px;letter-spacing:.04em"
    );

    console.log(
      `%c✉  ${DEVELOPER.email}`,
      "color:#f6e3b0;font-size:12.5px;font-weight:600;padding:6px 0 0 2px"
    );

    console.log(
      "%cPoking around? Good instinct. Say hello — I take on work.",
      "color:#8fbfa2;font-size:11.5px;font-style:italic;padding:2px 0 8px 2px"
    );
  }, []);

  return null;
}
