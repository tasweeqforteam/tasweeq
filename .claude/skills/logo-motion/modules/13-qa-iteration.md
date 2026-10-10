# 13 · Visual Quality Assurance & Iterative Refinement

**Purpose:** judge the *rendered* animation, fix what is wrong, and record each round.
**Input:** `renders/` from `render.mjs` (frames, stills, manifest), `blueprint.json`.
**Output:** `renders/qa/` (report, contact sheet, motion graph, fidelity diff), `review.json`, iteration log in the project README.
**Done when:** no FAIL checks, scorecard complete with evidence, weighted total ≥ 75 — or the remaining gap is reported honestly to the user.

## 1. Automated checks
```bash
python3 qa.py <proj>/renders --blueprint <proj>/blueprint.json
```
| check | catches |
|---|---|
| `reveal.exists` | frame 0 already shows the finished logo |
| `hold.final` | final hold < 0.8 s (warn) / < 0.4 s (fail) |
| `motion.pops` | isolated single-frame jumps (something pops in) |
| `motion.handoffs` | stall-then-pop: action stops, next starts abruptly |
| `pacing.dead_air`, `pacing.lead_in` | static gaps mid-animation; long nothing at start |
| `motion.easing` | motion that stops at full speed (no ease-out/settle) |
| `safety.flashes` | > 3 luminance flashes in 1 s (WCAG 2.3.1 approximation) |
| `fidelity.final_frame`, `fidelity.color`, `fidelity.last_frame` | final-frame contract vs `reference.png`, ΔE of dominant colour, video ends before settle |
| `framing.safe_area` | final logo within 5 % of the edge |
| `blueprint.stage.*` | promised motion not visible / hold not still |
| `export.*` | codec/size/fps/duration mismatch, page errors, non-determinism |

## 2. Look (mandatory)
Read `qa/contact-sheet.png` (12 frames), `qa/motion-graph.png` (energy per frame, ink coverage, stage bands — red band = broken promise) and `qa/fidelity-diff.png` (bright = mismatch). Then inspect specific frames around transitions (`renders/frames/NNNNNN.png`) and any flagged timestamp.

## 3. Blind critic (creative criteria)
Creative criteria are never auto-scored. Get them from a reviewer who has **not** seen your rationale:
- If sub-agents are available, give a fresh agent only: the official logo, the contact sheet, 4–6 transition frames, the brand context — not the concept text or QA verdict (so PASS cannot anchor it). Ask for 0–10 scores with evidence on creative originality, motion quality, brand relevance, visual clarity, plus the single most important fix.
- Otherwise do it yourself in a separate pass: look at frames first, write scores with evidence, *then* re-read the concept.
- Human feedback, when available, overrides; record it verbatim.
Write `review.json` and run `qa.py … --review <proj>/review.json` for the weighted total.

Default weights: fidelity 20 · originality 20 · motion 20 · brand relevance 15 · clarity 10 · technical 10 · delivery 5. Adjust per deliverable (e.g., UI micro-interaction: motion 30, originality 10) and state the change in `review.json.weights`.

## 4. Corrective actions
| observed problem | correction |
|---|---|
| final-frame mismatch | find the leftover transform/opacity/filter/stroke; end tweens at identity; check viewBox/rect alignment with onion-skin |
| distorted geometry mid-animation | animate parts, not the whole SVG non-uniformly; fix transformOrigin/svgOrigin; avoid non-uniform scale on type |
| pops | ease the entrance, add 2–4 frames of fade/scale, or overlap the hand-off |
| stall-then-pop / dead air | overlap actions (start next at 60–80 %), or make the pause a deliberate beat and mark it in the blueprint |
| abrupt stop | `power3.out`/`back.out`, or add a settle |
| weak reveal | revisit hierarchy: which part carries identity? Re-time so it lands on the beat; simplify competing motion |
| generic concept | go back to analysis E and generators (03); do not polish a generic idea |
| poor final readability | longer hold, larger logo rect, calmer last 0.5 s, remove secondary motion near the end |
| excessive complexity | delete effects that don't serve the one idea; fewer parts moving at once |
| flashes | slow the luminance change or reduce contrast/area |

## 5. Iterate and log
Max **3 autonomous rounds**; then show the user the best version with the evidence. Log every round in the project README table: *observed problem (with evidence path) → correction → result (metric before/after)*. Distil general lessons into `lessons.md` as imperatives ("Do X when Y"), keeping client-specific notes in the project.
