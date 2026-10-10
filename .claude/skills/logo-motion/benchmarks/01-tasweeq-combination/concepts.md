# Creative directions — Tasweeq

## References consulted (`node refs.mjs search "draw-on write handwriting stroke" / "typographic letter reveal"`)
| ref id | why relevant | principle borrowed (not the sequence) |
|---|---|---|
| ref-repo-pixel2motion | draw-on of logo parts; documents round-cap stall/pop | split along semantic seams; final frame must equal the static SVG; avoid round-cap artefacts |
| ref-claudelog-vibe-animating | Claude animating named SVG parts in numbered order | name parts and choreograph them in an explicit order |
| ref-iart-motion-design-skills | logo reveals 0.8–2.5 s, one technique per logo | one dominant technique, short reveal, long enough hold |

---

## Direction A — "Two Scripts, One Mark" (selected)
1. **Core idea:** the symbol is *written*. The Arabic body (p2) is written right→left in one stroke and its two dots are tapped in. Then the Latin T (p1) is written left→right. Two writing directions meet in one mark, and the wordmark follows in the site's own line-reveal.
2. **Connection:** p2 + p3/p4 read as ت, and p1 reads as T. Both have stroke-like solidity (0.40/0.54). The p1.right = p4.left alignment gives the T bar a landing point.
3. **Opening state:** near-black frame (#0A0A0A), nothing visible.
4. **Main movement:** a broad-nib "pen" reveals p2 along its centre line: stub → heavy arc → base, moving right to left. Dot p4, then p3, land with a small settle in RTL order. The p1 bar writes left to right, then the stem drops.
5. **Reveal mechanism:** a stroke clipped by the official shape, so the final state is the true fill rather than a stroke approximation.
6. **Transition:** the T-bar stroke starts as the dots settle, an overlapping hand-off. The wordmark starts while the stem is still finishing.
7. **Final composition:** official lockup, exact, centred, 42% of the frame width.
8. **Duration:** 4.5 s; glyph complete at about 2.3 s, wordmark at about 3.1 s, hold 1.4 s.
9. **Techniques:** SVG + GSAP DrawSVG with a clip-path per shape, line-mask per letter, CustomEase (0.22, 1, 0.36, 1) from the site.
10. **Rationale:** it says "bilingual marketing studio" using only the logo's own anatomy and the brand's existing motion grammar.
11. **Feasibility:** high. Risk: clip-path anti-aliasing at the final state, checked by QA.

## Direction B — "Raw Idea, Compounding" (slot entry)
1. **Core idea:** one cyan dot falls through the slot in the symbol's top edge and splits into two (p3≈p4) inside the counter-space, while the T and bowl close around them. The verified copy reads "from raw idea to compounding growth".
2. **Connection:** the slot between p1.right and the p2 stub, and the identical dots.
3. **Opening:** a single dot above the frame centre.
4. **Movement:** the dot drops with gravity, passes through the slot, and divides with a spring.
5. **Reveal:** p1 and p2 wipe in as walls around the dots.
6. **Transition:** the split triggers the walls.
7. **Final composition:** official lockup.
8. **Duration:** 4 s.
9. **Techniques:** GSAP physics-like eases and MorphSVG for the split (circle → two circles).
10. **Rationale:** the brand promise as cause and effect.
11. **Feasibility:** medium. A bouncing dot risks reading playful for a precise studio.

## Direction C — "Operating System Boot" (construction)
1. **Core idea:** the symbol is constructed on its own grid. Shared top line, dot centre line and the p1.right = p4.left guide draw as hairlines, the dots are struck by compass, the bars extrude along the guides, and the wordmark types in.
2. **Connection:** measured alignments and the circle primitives; the copy says "operating system".
3. **Opening:** hairline guides crossing an empty frame.
4. **Movement:** guides draw, then shapes extrude along them.
5. **Reveal:** construction lines fade as fills complete.
6. **Transition:** the guides become the wordmark baseline.
7. **Final composition:** official lockup.
8. **Duration:** 4.5 s.
9. **Techniques:** SVG lines, DrawSVG, scaleX extrusions.
10. **Rationale:** systematic and precise.
11. **Feasibility:** high. Construction-line reveals are common in tech identities, so it is less specific to this mark.

---

## Evaluation
| criterion | A | B | C |
|---|---|---|---|
| brand relevance (0-5) | 5 | 4 | 3 |
| originality — specific to this logo (0-5) | 5 | 4 | 2 |
| motion potential (0-5) | 4 | 5 | 3 |
| feasibility in this environment (0-5) | 5 | 4 | 5 |
| fidelity risk | low (clip-based) | medium (morph) | low |
| generic test: works on any logo? | no | no | partly (any geometric mark) |

**Selected:** A, because it is the only direction that tells the bilingual story using nothing but the mark's anatomy, and it adopts the site's motion grammar.
**Simplest version that keeps the idea:** two writing gestures, two dot taps, one wordmark line-reveal. No camera, glow or particles.
