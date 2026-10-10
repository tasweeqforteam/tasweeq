# تسويق — Arabic wordmark motion ("Kashida")

| | |
|---|---|
| Logo type | Arabic wordmark (test setting of تسويق in Thmanyah Serif Display Black, outlined; verify F 1.000 against browser shaping) |
| Concept | the word appears stretched on its own kashida strokes, then breathes in to its true proportions. The diamond dots are stamped last, right to left |
| Duration / fps / size | 4.0 s · 60 fps · 1920×1080, paper #F2F2EF |
| Final state | official wordmark, exact from 2.67 s (QA fidelity pass) |
| Engine | SVG + GSAP: group translate in viewBox units, feathered gradient masks, attr tweens on kashida rects |
| QA verdict | **PASS, 83.0/100** (blind critic r3 + automated). Baseline preset: 56.0 |

## Why this movement
Kashida (tatweel) elongation is the Arabic script's own justification device, so stretch-and-settle is native motion rather than an imported effect. It is applied only where Arabic allows it: inside the joined runs **تسو** and **يق**, never across the non-joining و. The letter bodies (rasm) arrive without dots, and the rhombic dots, the mark of a square qalam nib, are stamped last in reading order. That mirrors how dots (i'jam) are added after the letters.

## Iterations
| round | observed problem (evidence) | correction | result |
|---|---|---|---|
| 1 | contact sheet: the stretched state only about 20% wider, so the contraction barely reads | elongation doubled (ت +240 … ق −240 viewBox units, about 48%) | stretch reads clearly as tatweel |
| 2 | critic r2 (8/6/8/7): "stretched word hard-cut at the crop", "ت missing at 1.77 s" | **Tool fix:** `critic_pack.py` cropped to the final logo rect; it now crops to the union of ink across all frames. Labels shuffled by path | the critic sees the whole motion |
| 2 | critic r2: "dots grey mid-fade" | ink arrives in 0.1 s while the scale settles | — |
| 3 | critic r3 (8/6/8/8): "ق bowl sliced flat by the reveal mask", "detached bar floats far left at 0.88 s", "dots grey at 2.22 s" | feathered gradient masks; the left kashida grows out of ي as it opens; ink in 0.04 s | soft reveal verified at frames 42–78; final still exact |

## Baseline comparison (blind critic r3)
| | originality | motion | brand | clarity | weighted |
|---|---|---|---|---|---|
| fade + scale preset | 1 | 4 | 3 | 9 | 56.0 |
| this skill | 8 | 6 | 8 | 8 | 83.0 |

## Known limitations / process notes
- `blueprint.json` was formalised after round 2. The plan existed in `concepts.md`, but the stage-level blueprint should have come before implementation (module 08). The QA promise check now passes against it.
- The dotless rasm is hard to read for about 1.3 s; the critic flagged this. It is intentional (the dots are the payoff), but a shorter dotless phase would help legibility.
- Round 4 has not been re-reviewed by the critic.
- Thmanyah font licensing applies to any production use of this setting.
