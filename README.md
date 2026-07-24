# eirion.ai — The AI Operating Layer for Healthcare

Premium single-page site for the ELEANOR Platform, orchestrated by ELLIE.

## Stack

- **Next.js 16** (App Router, fully static output)
- **Tailwind CSS v4** — design tokens in `app/globals.css` (`@theme`)
- **Framer Motion** via LazyMotion (`m.` components)
- **React Three Fiber** — hero constellation + MCP agent-ecosystem solar system
- **Lenis** smooth scrolling

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static)
npm start        # serve production build
```

## Performance

Lighthouse (desktop): **100 / 100 / 100 / 100** — CLS 0, TBT 0 ms.
Key techniques: CSS-first hero entrances for instant LCP, interaction-gated
3D chunks (never on the critical path), viewport-paused WebGL rendering,
responsive `next/image` variants, security headers + CSP.

## Structure

- `app/` — layout, page, globals, sitemap, robots
- `components/` — animations, cards, hero, ecosystem, navigation, footer, providers, ui
- `sections/` — page sections (growth engines, baseline, closed loop, security, FAQ, CTA…)
- `constants/content.ts` — all site copy (single source of truth)

Deployed on Vercel.
