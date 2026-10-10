# 15 · Brand Motion System (Mode E)

**Purpose:** reusable motion principles derived from the logo, for logo, type, graphic elements, transitions and applications.
**Input:** logo analysis (02), selected logo animation if any, brand context.
**Output:** `motion-system.md` (+ optional demo compositions rendered through the normal pipeline).

## Contents
1. **Motion DNA** — 3–5 behaviours extracted from the logo with evidence (e.g., "constructs from a circle + bar → elements enter by *drawing a line first*, then filling"). Each must be traceable to analysis facts.
2. **Tokens** — durations (xs 150 ms · s 250 · m 400 · l 700 · xl 1200), easing set as named curves with cubic-bezier values (enter, exit, travel, settle/spring), stagger steps, distance units (multiples of a logo module, e.g., dot diameter).
3. **Logo behaviours** — full reveal (ident), short sting, loader loop (seamless, matched first/last state), UI micro (hover/press), end card; each with duration, entry rule, and final-state rule.
4. **Typography motion** — Latin and Arabic rules (RTL direction, joined forms, dots as accents, no letter-spacing on Arabic), line/word stagger, emphasis.
5. **Graphic elements & transitions** — how shapes derived from the logo move, wipe directions, match cuts using logo geometry.
6. **Do / don't** — with reasons (e.g., don't bounce the wordmark: its slab serifs read heavy).
7. **Accessibility** — reduced-motion fallbacks (instant or 150 ms fade), no flashes > 3/s, motion-off final states.
8. **Implementation** — GSAP/CSS easing equivalents, Lottie-safe subset, file/naming conventions.

Verify by building at least one demo per behaviour with the normal render + QA pipeline when production is in scope.
