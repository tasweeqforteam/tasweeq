# Animation & Micro-interaction References

How to study motion references and turn them into original, accessible effects. Implementation patterns live in `motion-recipes.md`; rules in `../rules/animation.md`.

## 1. Sources and what each is good for

| Source | Good for | Access (2026-10-10) | Notes |
|---|---|---|---|
| **60fps** (60fps.design) | UI animation videos from real iOS/web/Watch apps, tagged by interaction type | blocked here; CORROBORATED by search | Study timing, easing, continuity in *product* UI. Mostly app UI, not marketing sites. |
| **Design Spells** (designspells.com) | micro-interactions, easter eggs, delightful details | blocked here; CORROBORATED | Extract the principle ("feedback proportional to action", "personality in empty states"); avoid gimmicks. |
| **Awwwards — Animation** | full-site motion systems on award sites | blocked here; CORROBORATED | Watch load sequences, page transitions, scroll storytelling end-to-end. |
| **Codrops** (tympanus.net/codrops) | tutorials *with source* for creative effects (WebGL distortions, text, grids, transitions) | blocked here; CORROBORATED | Best place to learn *how*; check each demo's licence (template repo is MIT). |
| **GSAP** (npm `gsap`, github.com/greensock/GSAP) | timelines, ScrollTrigger, SplitText, Flip, DrawSVG, MorphSVG | VERIFIED via npm package 3.15.0 | Read `types/*.d.ts` for exact options of the installed version. |
| **Motion** (npm `motion`, github.com/motiondivision/motion) | React gestures, layout animations, presence, springs, scroll hooks | VERIFIED via npm package 14.1.0 | `motion/react` entry; `framer-motion` is the same engine. |
| **three.js examples** (github.com/mrdoob/three.js `examples/`) | shaders, post-processing, loaders, particles | repo reachable via git | Canonical, maintained techniques. |
| **R3F / drei** (github.com/pmndrs) | declarative 3D in React; helpers (environment, text, scroll controls) | repos reachable via git | Use official examples for patterns. |
| **AI-built showcases** (`ai-built-websites.md`) | readable single-file implementations of velocity type, depth-scroll, GLSL backgrounds, Web Audio | VERIFIED-SOURCE | Study the code; no licence → don't copy. |
| **MDN / web.dev / Chrome for Developers** | CSS scroll-driven animations, View Transitions, `@starting-style`, Web Animations API | not reachable here | Authoritative platform docs; check browser support tables (caniuse/Baseline). |

## 2. Analysis protocol for a motion reference

1. Record it: screen recording (or Playwright `recordVideo`) at normal speed; then step through frames (DevTools Animations panel at 10–25% speed when available).
2. Fill the analysis table (`../rules/animation.md` §2): trigger, initial/final state, duration, delay, easing, stagger, properties, scroll relationship, feedback, cost, mobile, reduced motion.
3. Identify the **principle**: what does the motion communicate? (continuity, causality, hierarchy, state, personality, physicality).
4. Identify the **technique** with evidence labels: e.g. "OBSERVED: lines slide up behind masks; INFERRED: SplitText or manual line wrappers".
5. Note failure modes you observed: jank, layout shift, blocked input, unreadable text mid-animation, no reduced-motion variant.
6. Design your own effect from the principle for your concept; implement with the simplest tech (decision tree in `../rules/animation.md` §4).

## 3. Principle catalog (use to name what you see)

| Principle | Typical expression | Typical tech |
|---|---|---|
| **Continuity** — this is the same thing, moved | shared-element morph list → detail; FLIP | View Transitions, Motion `layoutId`, GSAP Flip |
| **Causality** — your action did this | button press compress + ripple; drag with inertia | CSS `:active`, Motion gestures, GSAP Draggable/Inertia |
| **Hierarchy** — look here first | staggered reveal in reading order; primary element first | CSS/GSAP stagger |
| **State change** — something is different now | toggle morph, success check draw, error shake (small!) | CSS, SVG stroke animation, DrawSVG |
| **Spatial model** — where things live | menus sliding from their trigger; drawers from edges | CSS transforms with logical direction |
| **Progress / time** | progress bar tied to scroll or upload | scroll-driven CSS, ScrollTrigger scrub |
| **Physicality / material** | springs, overshoot, weight | Motion springs, GSAP elastic/back eases (sparingly) |
| **Narrative pacing** | pinned sections advancing a story | ScrollTrigger pin + scrub, sticky CSS |
| **Expressiveness tied to input** | cursor velocity → type axes; scroll depth → color | rAF + CSS custom properties |
| **Ambient atmosphere** | slow shader gradient, particles | WebGL/GLSL, canvas — pause offscreen and on reduced motion |

## 4. Micro-interaction checklist (product UI)

- Every control has hover (fine pointer), focus-visible, active/pressed, disabled, loading states.
- Feedback within 100ms of input; durations 120–250ms.
- Toggles and checkboxes animate the *state*, not decoration.
- Toasts enter from a consistent place; errors don't bounce or shake more than once.
- Skeletons match final layout; spinners only for indeterminate waits < ~2s, progress beyond.
- Drag interactions show affordance (cursor/handle), drop targets, and allow keyboard alternatives.
