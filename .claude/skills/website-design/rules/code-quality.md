# Code Quality & Maintainability

The site must be easy for the next person (or agent) to change without breaking the design.

## 1. Respect the existing project

- Read `package.json`, the framework config, global CSS/tokens, and 2–3 existing components before writing new ones. Match naming, file layout, styling approach (Tailwind / CSS Modules / CSS-in-JS), import style and comment density.
- Reuse existing primitives (buttons, reveal components, motion variants, tokens) before creating new ones. Extend tokens rather than hardcoding new colors.
- Change only what the task requires. Don't reformat unrelated files, rename things, or "upgrade" dependencies opportunistically.
- Preserve existing functionality (analytics hooks, i18n, SEO metadata, routes). Re-run the build and lint after changes.

## 2. Design tokens

- Colors, type scale, spacing, radii, shadows, z-index layers, durations and easings live in one place (CSS custom properties; Tailwind v4 `@theme`; or a tokens file) and are referenced everywhere.
- Name tokens by role (`--ink`, `--paper`, `--signal`, `--surface-raised`), not by value (`--blue-500`) — role names survive rebrands and theme switching.
- Dark mode / themes swap token values, not component code.

## 3. Components

- One component = one responsibility; split when a file mixes data fetching, layout and complex animation logic.
- Props describe content and variants, not styling escape hatches (`variant="primary"`, not `bgColor="#..."`).
- Content (copy, case studies, nav items) in data files or CMS, not hardcoded deep in JSX, especially for bilingual sites (follow the repo's i18n approach).
- Server components by default in Next.js App Router; add `"use client"` only to components that need browser APIs, state, or animation libraries, and keep those leaves small.

## 4. Styling hygiene

- Avoid specificity wars: one styling approach per component; no `!important` except for reduced-motion overrides and utility resets.
- Logical properties for direction-sensitive spacing (`rtl-arabic.md`).
- No magic numbers without a comment if they're not from the token scale (e.g. optical adjustments).
- Watch for classes that cancel each other (e.g. a section padding utility vs. a component's own padding) — check computed styles in the browser when spacing looks wrong.

## 5. Animation code

- Clean up: GSAP via `useGSAP()` (auto-reverts on unmount) or `gsap.context()` + `ctx.revert()`; IntersectionObservers disconnected; RAF loops cancelled; event listeners removed.
- Register GSAP plugins once (`gsap.registerPlugin(ScrollTrigger, SplitText)`) in a client module.
- Call `ScrollTrigger.refresh()` after fonts/images that change layout load (or rely on SplitText `autoSplit` + `onSplit`).
- Keep animation config (durations, eases) in shared constants/tokens.

## 6. Dependencies

- Before adding a dependency: can CSS or the platform do it? Is something already installed that does it? What's the bundle cost and licence?
- Verify library APIs against the installed version (read `node_modules/<pkg>/package.json` version and its `.d.ts` types or official docs) — never guess APIs from memory; APIs change between major versions.
- Pin to the repo's package manager and lockfile; don't mix npm/yarn/pnpm.

## 7. Real behavior only

- Links go somewhere real; buttons do something real; forms submit to something real or are clearly marked as stubs in the report.
- No placeholder `href="#"` in delivered work unless documented.
- Handle loading/empty/error/success states in code, not only in the design.

## 8. Before declaring done

- [ ] Build passes (`npm run build` or equivalent).
- [ ] Lint/typecheck passes for touched files (`npm run lint`, `tsc --noEmit` if configured).
- [ ] No console errors/warnings introduced (visual-qa script).
- [ ] No unused imports, dead components, or leftover debug code.
- [ ] Diff re-read once, adversarially: what would a reviewer flag?
