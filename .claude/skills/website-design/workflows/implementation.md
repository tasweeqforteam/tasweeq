# Workflow: Architecture & Implementation

## Step 1 — Read the project

- `package.json` (framework, versions, scripts, existing animation/3D libs), framework config, global CSS/tokens, layout/root files, 2–3 representative components, i18n setup, analytics helper.
- Note conventions: file naming, component patterns, Tailwind vs CSS Modules, client/server component split, how motion is already done (shared variants? custom hooks?).
- If there is no project: choose the simplest stack that fits (below).

## Step 2 — Choose the stack (new projects)

| Need | Choose |
|---|---|
| Single marketing page / demo, no build tooling wanted | static HTML + CSS + small vanilla JS (ES modules); npm-installed libs copied or bundled with Vite |
| Multi-page marketing site, SEO, i18n, CMS later | Next.js (App Router) + Tailwind or CSS Modules |
| App-like product UI / dashboard | React (Next.js or Vite) + the team's component library |
| Heavy 3D | Vite or Next.js + React Three Fiber + drei (or vanilla Three.js for a single scene) |
| Content-heavy editorial | Next.js or Astro (static-first) |

Verify current versions (`npm view <pkg> version`) and APIs (installed `.d.ts` / official docs) before writing library code.

## Step 3 — Plan the build

Write a short architecture list:
- Routes/pages and their sections.
- Components (new vs reused), with their states.
- Tokens to add/extend.
- Data/content files (and both languages if bilingual).
- Assets (images, fonts, models) and where they live (`public/…`), sizes and formats.
- Motion inventory mapped to technology (`rules/animation.md` §4).
- Responsive plan per section.
- Risks (3D perf, font licence, missing content) and fallbacks.

## Step 4 — Build in this order

1. **Tokens + global styles** (type scale, colors, spacing, focus style, reduced-motion base).
2. **Static structure** — semantic HTML for every section with real copy, readable without CSS animation. Mobile-first CSS.
3. **Layout at all breakpoints** — get 390/768/1440 right *before* motion.
4. **Interactions and states** — nav/menu, forms, tabs, accordions, filters, errors, success, loading, empty.
5. **Motion** — signature moment first, then feedback; reduced-motion variant alongside each effect (not afterward).
6. **Media/3D** — progressive enhancement with poster/fallback first.
7. **SEO/meta** — titles, descriptions, OG image, `lang`/`hreflang`, structured data if the repo does it.

Run the app and take a first screenshot after step 3 — catching layout problems before motion is cheaper.

## Step 5 — Implementation rules (summary)

- Follow `rules/code-quality.md` (existing conventions, tokens, small components, no fake controls).
- Follow `rules/accessibility.md` as you build (semantic elements, labels, focus).
- Next.js specifics: animation libraries need `"use client"`; keep server components for content; use `next/image` and `next/font`; dynamic-import WebGL with `ssr: false`; don't read `window` during render.
- Keep animation setup idempotent and cleaned up (React Strict Mode mounts twice in dev).
- Make hidden-initial states JS-dependent (`html.js .reveal { opacity: 0 }`) so no-JS and failed-JS users see content.

## Step 6 — Run it

- Start the dev server (`npm run dev`, background) or serve static files (`npx serve`, `python3 -m http.server`).
- Wait until the URL responds (poll with `curl -s -o /dev/null -w '%{http_code}'`), then hand off to `workflows/browser-testing.md`.
- Also run the production build once before delivery (`npm run build`): many hydration and SSR issues only appear there.
