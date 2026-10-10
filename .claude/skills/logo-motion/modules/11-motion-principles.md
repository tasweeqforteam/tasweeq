# 11 · Professional Motion Principles

Concrete defaults to start from. They are calibrated to the brand, then verified on rendered frames (QA metrics in brackets).

| principle | default practice | evidence in QA |
|---|---|---|
| Timing | primary moves 0.4–0.9 s; secondary 0.2–0.5 s; small UI 150–300 ms | motion-graph peaks & widths |
| Spacing | big moves accelerate then decelerate; avoid linear except mechanical/constant motion | `motion.easing` (abrupt stops) |
| Easing | entrances `power3.out`/`expo.out`; exits `power2.in` ~2× faster; inOut for travel A→B | onset/stop shape in motion-graph |
| Anticipation | 8–15 % counter-move before a large action, only when weight matters | visible dip before peak |
| Follow-through / settle | overshoot 2–6 % then settle (`back.out(1.4–2)`), or spring (ζ 0.4–0.7) for playful marks | settle tail before hold |
| Overlap | next action starts at 60–80 % of the previous; stagger groups 40–120 ms (whole stagger < 0.5 s) | `motion.handoffs` (stall-then-pop) |
| Secondary motion | dots, accents, counters arrive last and lighter | late small peaks |
| Hierarchy | the most identity-bearing part moves first or most clearly | contact sheet reading order |
| Continuity | one dominant direction; transitions keep the motion vector | no `motion.pops` |
| Physical plausibility | heavy = slower start, small overshoot; light = quick, springy | — (visual judgement) |
| Exaggeration | only where it reads at playback speed; never distorting letterforms in the hold | fidelity checks |
| Final-state readability | hold ≥ 0.8 s; logo inside 5 % graphics-safe area; logo width ~25–45 % of a 16:9 frame | `hold.final`, `framing.safe_area`, `final_logo_width_share` |
| Comfort & safety | ≤ 3 flashes/second; avoid full-frame luminance strobing | `safety.flashes` |

## Brand adaptation (possibilities, not styles to apply)
- **Luxury / premium:** restraint, longer eases (`power2.inOut`, 0.8–1.4 s), minimal overshoot, precise alignment, slower holds.
- **Technology:** structured, grid-aligned motion, crisp `expo.out`, modular assembly, light glints only if earned.
- **Playful:** springs, squash/stretch on non-type parts, expressive timing, bigger anticipation.
- **Geometric:** construction lines, compass arcs, snapping to shared alignment lines.
- **Typographic:** letterform-driven — strokes in writing order, counters, ligature gestures; RTL for Arabic.
- **Healthcare / trust:** calm, even pacing, no harsh flashes, gentle settles.

The logo's own design decides. If analysis and the "brand adjective" disagree, follow the evidence and say why.
