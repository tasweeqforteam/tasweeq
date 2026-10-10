# Technical Documentation & API Verification

Rule: **never write library code from memory alone.** Check the installed version and its types/docs. APIs change across majors (e.g. Motion moved to the `motion` package with a `motion/react` entry; GSAP made all plugins free and added `SplitText.create` with `autoSplit`/`mask` options).

## 1. How to verify an API quickly (works offline from the npm registry)

```bash
npm view gsap version                          # latest published
node -p "require('gsap/package.json').version" # installed in this project
ls node_modules/gsap/types/                    # .d.ts per plugin
grep -n "autoSplit\|mask" node_modules/gsap/types/split-text.d.ts
# not installed? read the published package without adding it:
mkdir -p /tmp/pkg && cd /tmp/pkg && npm pack motion@latest && tar -xzf motion-*.tgz
```

If documentation sites are reachable, also read the official docs page for the feature. If not, types + README + changelog in the package are the evidence (label `VERIFIED` with the version).

## 2. Versions verified for this skill (npm registry, 2026-10-10)

| Package | Version | Licence | Notes verified in package files |
|---|---|---|---|
| gsap | 3.15.0 | GSAP Standard no-charge | README: all plugins free incl. commercial use; `SplitText.create`, options `mask`, `autoSplit`, `onSplit`, `aria`; `gsap.matchMedia()` |
| @gsap/react | 2.1.2 | — | `useGSAP(func, { scope, dependencies, revertOnUpdate })` |
| motion / framer-motion | 14.1.0 | MIT | `motion/react`; `useScroll`, `useTransform`, `useSpring`, `useInView`, `useReducedMotion`; `MotionConfig reducedMotion` |
| lenis | 1.3.26 | MIT | options `autoRaf`, `anchors`, `prevent`, `syncTouch` (default false); CSS at `lenis/dist/lenis.css` |
| three | 0.186.1 | MIT | — |
| @react-three/fiber | 9.8.1 | MIT | React 19 line |
| @react-three/drei | 10.7.9 | MIT | — |
| next | 16.4.0 (this repo pins 16.2.6) | MIT | — |
| tailwindcss | 4.3.3 | MIT | v4: CSS-first config via `@theme` |
| playwright / @playwright/test | 1.64.0 latest; 1.56.1 preinstalled globally in the build sandbox | Apache-2.0 | browser build must match the Playwright version |
| @axe-core/playwright | 4.13.0 | MPL-2.0 | `new AxeBuilder({ page }).withTags([...]).analyze()` |
| lighthouse | 13.5.0 | Apache-2.0 | CLI lab audits |

Re-check before use; this table ages.

## 3. Platform features — check support before relying on them

| Feature | Use | Fallback |
|---|---|---|
| CSS scroll-driven animations (`animation-timeline: scroll()/view()`) | scroll-linked progress and reveals without JS | `@supports` guard; static state; or IntersectionObserver |
| View Transitions (same-document `document.startViewTransition`; cross-document `@view-transition`) | state/page transitions, shared elements | instant update |
| Container queries (`@container`) | component-level responsiveness | media queries |
| `:has()` | parent-state styling | JS class toggles |
| `text-wrap: balance / pretty` | headline and paragraph rag | manual breaks |
| Subgrid | aligned card internals | fixed internal heights |
| `@starting-style` + `transition-behavior: allow-discrete` | enter transitions for `display`/popover/dialog | JS class after mount |
| Popover API, `<dialog>` | menus, tooltips, modals with built-in top layer | ARIA patterns |
| `svh/dvh/lvh` units | mobile viewport heights | `vh` with JS correction |

Check status at caniuse.com or the MDN "Baseline" badge when reachable; otherwise test in the available Chromium and state that other engines were not tested.

## 4. Authoritative documentation (consult when reachable)

- GSAP docs: https://gsap.com/docs/v3/ · Motion: https://motion.dev/docs · Lenis README on GitHub
- three.js docs/examples: https://threejs.org/docs/ · R3F: https://r3f.docs.pmnd.rs/
- Next.js: https://nextjs.org/docs · Tailwind: https://tailwindcss.com/docs
- MDN Web Docs: https://developer.mozilla.org/ · web.dev / Chrome for Developers
- WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/ · WAI-ARIA APG: https://www.w3.org/WAI/ARIA/apg/
- Playwright: https://playwright.dev/docs/intro

(In the environment where this skill was built, these documentation hosts were blocked; versions above were verified from npm packages instead.)
