# Creative directions — تسويق Arabic wordmark

## References consulted
`node refs.mjs search "arabic kinetic type"` returned nothing specific (a library gap). `node refs.mjs search "letter reveal mask"` returned the line-reveal and per-letter patterns (ref-iart-motion-design-skills, ref-animated-logo-skill).
| ref id | why relevant | principle borrowed |
|---|---|---|
| ref-iart-motion-design-skills | per-letter reveal, one technique per logo | one dominant idea; reveals under about 2.5 s |
| ref-animated-logo-skill | per-letter physics patterns with concrete timings | stagger letters by reading order with explicit offsets |

## Direction A — "Kashida" (selected)
1. **Core idea:** the word first appears *stretched* along its own kashida strokes, then contracts into its true proportions, like a breath in. The dots are stamped last.
2. **Connection:** the joined-stroke band (y 325–398) and the two joined runs (تسو, يق). Kashida appears only inside runs, never across the و→ي break.
3. **Opening:** paper, empty.
4. **Movement:**
   - Two kashida lines draw right to left at the band height, in an elongated layout.
   - The letter bodies rise out of the line: a vertical clip opens up and down from the band, keeping letterforms intact. The order is right to left.
   - The word contracts to its natural spacing while the kashida strokes shorten into the joins.
5. **Reveal:** clip opening from the baseline band.
6. **Transition:** the contraction starts while the last letters are still opening (overlap).
7. **Final:** official wordmark, exact.
8. **Duration:** 4 s. Glyphs complete at about 2.2 s, dots at about 2.75 s, hold about 1.25 s.
9. **Techniques:** SVG + GSAP. Per-group translate in viewBox units, clip rects, kashida rects (attr tweens), dot stamps (scale 1.5→1 + opacity).
10. **Rationale:** it uses a behaviour that belongs only to Arabic script and resolves into exact typography.
11. **Feasibility:** high. Risk: kashida bars peeking outside letter ink at the end, so they fade out once covered.

## Direction B — "Qalam" (write the rasm, then the i'jam)
Follow each letter's ductus with a clip-masked broad pen (as in benchmark 01), then add the diamond dots. This is the most literal form of calligraphy. It needs hand-authored centre lines for 5 complex display glyphs, so fidelity of mid-states is risky, and it reuses benchmark 01's technique.

## Direction C — "Dots First"
The six rhombic dots fall onto the page first, and the letter bodies grow beneath them as if called by their dots, inverting the writing order. It is distinctive, but the meaning is weak (an invented metaphor) and mid-states read as random diamonds.

## Evaluation
| criterion | A | B | C |
|---|---|---|---|
| brand relevance (0-5) | 5 | 5 | 3 |
| originality — specific to this logo (0-5) | 5 | 4 | 4 |
| motion potential (0-5) | 5 | 4 | 3 |
| feasibility (0-5) | 4 | 2 | 4 |
| fidelity risk | low | high | low |
| works on any logo? | no (only joined Arabic runs) | no | partly |

**Selected:** A. Kashida is native Arabic motion and respects joining rules, and the final state is exact.
