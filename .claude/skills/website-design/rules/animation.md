# Website Animation

Motion is a design material with a job: show change, explain structure, give feedback, direct attention, or express the brand. Motion with no job is noise.

## 1. The motion budget

Decide up front:

- **One orchestrated moment** (load sequence, hero reveal, or scroll narrative) — the signature.
- **Feedback motion** everywhere the user acts (hover, press, open, close, submit, success, error) — fast and quiet.
- **Structural motion** where it clarifies (page transitions, shared-element morphs, sticky storytelling).
- **Ambient motion** (background loops, marquees, shaders) — at most one, pausable, off under reduced motion.

Fade-and-slide-up on every section and hover-lift on every card is the generic default; avoid it unless it serves the concept.

## 2. Analyze an effect before building it

For every effect (reference or your own), write:

| Field | Example |
|---|---|
| Trigger | load / enters viewport at 20% / scroll progress 0→1 over section / hover / click / cursor velocity |
| Initial → final state | `clip-path: inset(100% 0 0 0)` → `inset(0)`; `y: 110%` → `0` inside overflow mask |
| Duration, delay | 900ms, +80ms per line |
| Easing | `cubic-bezier(0.22, 1, 0.36, 1)` (expo-out-like) / `power3.out` / spring (stiffness 300, damping 30) |
| Stagger | 0.06s per word, from start |
| Properties | transform, opacity, clip-path (compositor-friendly) |
| Scroll relationship | none / triggered once / scrubbed (linked) / pinned for 200% viewport |
| Interaction feedback | what the user learns from it |
| Performance cost | low (CSS transform) / medium (many elements, filters) / high (WebGL, layout-triggering props) |
| Mobile behavior | same / simplified / disabled |
| Reduced motion | instant / crossfade only / static frame |

Use this table for both reference analysis (`templates/reference-analysis.md`) and your motion inventory.

## 3. Timing and easing defaults

| Kind | Duration | Easing |
|---|---|---|
| Hover / press feedback | 120–200ms | ease-out |
| Small UI (toggle, tooltip, dropdown) | 150–250ms | ease-out in, ease-in out (faster exit) |
| Panels, modals, menus | 250–400ms | strong ease-out (e.g. `cubic-bezier(0.22,1,0.36,1)`) |
| Page transitions | 300–700ms | ease-in-out; keep navigation responsive |
| Hero/editorial reveals | 700–1200ms | expo/quart-out; stagger 40–100ms |
| Scroll-scrubbed | tied to scroll; add 0.5–1s smoothing (`scrub: 0.5–1`) for weight | linear mapping, eased progress |

Exits are faster than entrances. Larger distance → longer duration. Stagger total should stay under ~800ms or it feels slow.

## 4. Technology decision tree

1. Can it be a **CSS transition/keyframe** (hover, focus, simple reveal, loader)? → CSS.
2. Is it **scroll-linked** and simple (progress bar, parallax, reveal tied to view)? → CSS scroll-driven animations (`animation-timeline: view()/scroll()`) behind `@supports`, with a static fallback; otherwise IntersectionObserver + CSS class.
3. Is it a **page/state transition** between DOM states? → View Transitions API (`document.startViewTransition`, or cross-document `@view-transition { navigation: auto; }`) with fallback = instant change. In React: Motion `layout`/`AnimatePresence`.
4. Is it a **React component** animation with gestures, presence, layout changes, springs? → **Motion for React** (`motion/react`; the `framer-motion` package is the same engine — use whichever the repo already has).
5. Is it a **complex timeline**, pinned scroll story, text splitting, SVG morph/draw, FLIP across layouts? → **GSAP** (+ ScrollTrigger, SplitText, Flip, DrawSVG, MorphSVG — all free including commercial use — VERIFIED in the gsap@3.15.0 package README; the plugins ship inside the `gsap` npm package). In React use `useGSAP` from `@gsap/react`.
6. Is it **3D / shaders / thousands of particles**? → Three.js or React Three Fiber (+ drei). Only if the concept needs it.
7. Is it **vector** (icons, illustrations, line drawing)? → SVG + CSS/GSAP; Lottie only for designer-made complex vector animations.

Don't add a library for one effect CSS can do. Don't mix GSAP and Motion on the *same element*. Don't add Lenis/smooth scroll unless the scroll narrative needs it (it can hurt accessibility and perceived responsiveness); if the repo already uses it, integrate correctly (see recipes).

## 5. Performance rules

- Animate `transform` and `opacity` (and `clip-path`, `filter` sparingly). Avoid animating `width/height/top/left/margin`, `box-shadow` size, and large `backdrop-filter` areas.
- Read layout once, write many: no `getBoundingClientRect()` inside scroll handlers per frame. Use IntersectionObserver, ScrollTrigger, or scroll-driven CSS.
- `will-change` only on elements about to animate; remove after.
- Large staggered text splits: cap element count (split by lines/words, not chars, for paragraphs).
- WebGL: cap DPR (`Math.min(devicePixelRatio, 2)`), pause when off-screen (`IntersectionObserver`) or tab hidden, `frameloop="demand"` in R3F for static scenes.
- Test with CPU throttling (4×) for jank; the visual-qa script can record a trace if needed.

## 6. Reduced motion (mandatory)

- Respect `prefers-reduced-motion: reduce`: replace movement with instant state or a short crossfade; stop autoplaying loops, parallax, scroll-jacking, shader animation (render one still frame), marquees.
- CSS: wrap motion in `@media (prefers-reduced-motion: no-preference) { … }` (opt-in) — safer than trying to undo everything afterward.
- GSAP: `gsap.matchMedia()` with a `reduceMotion` condition. Motion: `<MotionConfig reducedMotion="user">` or `useReducedMotion()`.
- Content must already be in its final, visible state when motion is off — never leave elements at `opacity: 0` waiting for an animation that won't run.
- Auto-playing motion lasting > 5s needs a pause control (WCAG 2.2.2).
- **SSR trap:** never derive the *initial render* from `useReducedMotion()` / `matchMedia` in server-rendered React. They return `null`/unknown on the server and a real value on the client, so text or attributes differ and hydration fails. Real example (VERIFIED in this repo, 2026-10-10): `useState(reduced ? value : 0)` in a count-up component produced "Hydration failed… server rendered text didn't match" only when reduced motion was on. Read the preference with `useSyncExternalStore` (server snapshot = a fixed value; React reconciles after hydration without a mismatch — hook in `references/motion-recipes.md` R11), or use `<MotionConfig reducedMotion="user">` / CSS media queries. Avoid `useEffect(() => setState(matchMedia(...).matches))` — React 19's `react-hooks/set-state-in-effect` lint rule rejects it (VERIFIED with this repo's eslint config). Always run one QA pass with reduced motion emulated (`visual-qa.mjs --reduced`).
- No flashing more than 3 times per second (WCAG 2.3.1).

## 7. Never block the user

- Content and navigation must work before animations finish; skip/disable long intros on repeat visits.
- Loading screens only when the experience genuinely needs preloading (3D assets); show real progress; keep < ~2s on a good connection; never on content pages.
- Scroll-jacking (taking over scroll speed/direction) is opt-in by concept and must still allow keyboard, anchor links, and find-in-page to reach content.
- Hidden-until-animated content must be visible without JS: initial hidden states are set by JS (e.g. add a `js` class on `<html>`) or by `@media (scripting: enabled)`.

## 8. Mobile

- Cursor effects, magnetic buttons, custom cursors: only on `(hover: hover) and (pointer: fine)`.
- Simplify pinned/horizontal scroll on narrow screens; prefer native swipe.
- Reduce particle counts and shader resolution; test on a mid-range device profile.

## 9. Motion principles to extract from references

When studying a reference, extract the *principle*, not the effect:
- "Velocity maps to expressiveness" (cursor speed → font axes) — KILTER.
- "One scalar drives everything" (scroll depth → color, particles, HUD) — HADAL.
- "Masks reveal, don't fade" (line masks, image clip-path wipes) — common in editorial/agency sites.
- "Continuity" (shared element morphs between list and detail).
- "Physicality" (springs, inertia, overshoot proportional to gesture).

Then design an original effect from the principle for your own concept. Copy-pasting a reference's effect produces a derivative site.

## 10. Implementation snippets

Tested, copy-ready patterns (with reduced-motion handling) are in `references/motion-recipes.md`.
