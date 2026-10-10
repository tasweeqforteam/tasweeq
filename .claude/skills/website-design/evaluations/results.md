# Evaluation Results

All results below were produced by tools actually run; anything not run is marked as such.

## Environment (2026-10-10)

- Claude Code cloud session (Linux container). Playwright 1.56.1 (global) with Chromium build 1194, headless. Node 22.22.
- Network: npm registry, GitHub git reads and Google Fonts reachable. Design galleries, documentation sites and image CDNs blocked by egress policy, so the evaluation builds could not use photography.

## Recipe test (references/motion-recipes.md)

Harness: `recipe-harness/` (Vite 8; gsap 3.15.0, @gsap/react 2.1.2, lenis 1.3.26, motion 14.1.0, three 0.186.1, @react-three/fiber 9.8.1, React 19.3). Command: `node test-recipes.mjs`.

**Result: 33/33 checks pass** (normal motion, `prefers-reduced-motion: reduce`, and RTL for R5), with no console errors. ESLint (this repo's Next.js config) is clean on the harness.

Defects found by testing and fixed in the recipes:

| Found | Evidence | Fix |
|---|---|---|
| SplitText's default `aria: "auto"` on `<span>` or `<p>` produces axe `aria-prohibited-attr` (serious) | axe-core 4.13 run against the harness | R3 now uses `aria: "auto"` only on headings and `"none"` elsewhere; also recorded in `rules/accessibility.md` |
| R11 read reduced motion with `useEffect(() => setState(matchMedia…))` | ESLint `react-hooks/set-state-in-effect` error | replaced with an SSR-safe `useSyncExternalStore` hook |

Not covered: Next.js-specific wrappers (`next/dynamic` with `ssr: false`), and browsers other than Chromium.

## Tooling test on a real site (this repo, Tasweeq)

`visual-qa.mjs --url http://localhost:3100 --paths /,/work/sakan --widths 390,768,1440 --full --reduced`, run against `next dev`:

- Screenshots rendered correctly for the Arabic RTL page (`lang=ar`, `dir=rtl`).
- **Real bug found:** with reduced motion emulated, the homepage throws a React hydration error. Root cause read in source: `src/components/ui/CountUp.tsx` initialises state from `useReducedMotion()`, which differs between server and client. The general lesson was added to `rules/animation.md` §6; the site fix was proposed as a separate task.
- Also reported: a React warning about `<script>` inside a component; tap targets under 24px on some text links; text under 12px on eyebrow labels. The analytics host (GTM) was blocked by the sandbox and filtered out with `--ignore`.
- False positives found and fixed in the script: next/font "Fallback" faces reported as failed fonts, and the Next.js dev-overlay portal flagged in the focus check.

## Evaluation runs (test-projects.md T1–T8)

**Status: in progress.** Eight builds are running, each done by a separate agent (a mid-tier model) that follows this skill without prior context. Each build is scored independently against `acceptance-criteria.md` by the agent that wrote the skill, using its own visual-qa runs and screenshot review. Scores, gate results and skill feedback will be recorded here when the runs finish. Until then, **no test project is marked as passed.**

## Changelog

- 2026-10-10 — Skill created; references verified as listed in `references/reference-directory.md`; recipe harness added; visual-qa tested on the Tasweeq site.
