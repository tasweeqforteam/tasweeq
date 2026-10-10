---
name: logo-motion
description: Expert logo motion design — analyse any supplied logo (SVG or raster, including Arabic/RTL wordmarks), research references, develop three original logo-specific creative directions, write an executable motion blueprint, implement it as a deterministic SVG/GSAP/Canvas composition, render MP4/GIF/WebM, and verify the rendered frames (final-frame fidelity, pacing, pops, flashes) before iterating. Use for logo animations, logo reveals/intros/stings, animated marks, brand motion systems, reviewing or improving an existing logo animation, or finding logo-animation inspiration (including Claude-made examples).
---

# Logo Motion Design

The goal is not to make the logo move. It is to discover **how this logo should move**, explain why that movement belongs to the brand, and deliver it at studio quality — proven by the rendered frames, not by the code.

## Non-negotiables
1. **Analyse before you imagine.** Run the analyser and LOOK at `overview.png` / `parts.png` before any concept. Concepts must cite evidence (part ids, measurements, observed relationships).
2. **No presets.** Never apply a stock fade/scale/bounce. Reject any concept that would work unchanged on another logo.
3. **Final-frame contract.** The animation ends on the official artwork, pixel-exact (`qa.py` checks IoU ≥ 0.998 against `reference.png`). Temporary decomposition is fine; the final hold is not negotiable.
4. **Deterministic.** Compositions are pure functions of `t` (`lm-runtime.js`): no wall clock, rAF timing, CSS transitions, or unseeded randomness.
5. **Look at the output.** After every render, read `qa/contact-sheet.png`, `qa/motion-graph.png` and `qa/fidelity-diff.png`. Automated checks support judgement; they never replace it.
6. **Honesty.** Never claim a capability, reference, prompt, video, score or file you have not verified. Separate *measured / observed / interpreted*. Never invent brand stories.
7. **Simplest strong idea wins.** 3D, particles, glow and camera moves need a reason rooted in the logo.

## Modes — infer from the request
| Mode | Trigger | Path through the modules |
|---|---|---|
| A Inspiration research | "find examples/inspiration/how others did…" | 04 → 05 → 06 |
| B Creative direction | "ideas/concepts/directions for this logo" | 02 → 07 (uses 04/06) → 03 |
| C Full production (default when a logo + "animate") | "animate this logo", "logo reveal" | 02 → 07 → 03 → 08 → 09/10/11 → 12 → 13 (loop) |
| D Technical implementation | "write the GSAP/Lottie/AE code for…" | 08 → 10 → 12 → 13 |
| E Brand motion system | "motion principles/system/guidelines" | 02 → 15 |
| F Review & improvement | an existing animation to critique/fix | 16 → 13 (→ 10 to fix) |

Ask the user only when an essential decision cannot be reasonably defaulted (e.g., which of three directions, when the stakes justify it). Otherwise state the default and proceed.

## Full-production pipeline (Mode C)
```
engine/                                    (run from .claude/skills/logo-motion/engine; first time: ./setup.sh)
node scaffold.mjs <proj> --logo <file> --name "Brand"     # copies logo, runs analyze.mjs, writes templates
  → LOOK at <proj>/analysis/overview.png, parts.png; complete analysis/analysis.md        (02)
node refs.mjs search "<opportunity words>" [--technique …]   # + 04 research if thin   (04, 06, 07)
  → write concepts.md: 3 directions, evaluate, select                                     (03, 07)
  → write blueprint.json; node blueprint.mjs check <proj>/blueprint.json                  (08)
  → implement composition.html (lm-runtime contract)                                       (09, 10, 11)
node render.mjs <proj>/composition.html --formats mp4,gif --check-determinism              (12)
python3 qa.py <proj>/renders --blueprint <proj>/blueprint.json                             (13)
  → LOOK at qa/*.png; fix every FAIL; blind-critic review → review.json; re-run qa with --review
  → iterate (max 3 autonomous rounds, then show the user), log rounds in README.md
```
Deliver: MP4 (+GIF/WebM as useful), `composition.html`, `blueprint.json`, `concepts.md`, `analysis/`, `README.md` with QA verdict, iteration log and limitations. Report unsupported outputs honestly.

## Modules (read the one you need, when you need it)
- `modules/00-capability-audit.md` — verify the environment (`node selftest.mjs`), report what works.
- `modules/02-logo-analysis.md` — structure, geometry, typography (Arabic/RTL), meaning, opportunities.
- `modules/03-creative-concepts.md` — concept generators, technique palette, anti-generic tests.
- `modules/04-research.md` — sources, access status, search patterns, Oneshotted adapter.
- `modules/05-claude-reverse-engineering.md` — classify Claude-made work; findings so far.
- `modules/06-reference-library.md` — schema, `refs.mjs`, persistence/restore.
- `modules/07-creative-direction.md` — reference → original direction workflow and selection.
- `modules/08-motion-blueprint.md` — executable plan, key poses, timing standards.
- `modules/09-logo-fidelity.md` — asset handling, SVG/raster rules, compromises.
- `modules/10-implementation.md` — engine choice, composition contract, technique recipes, pitfalls.
- `modules/11-motion-principles.md` — timing/easing/overlap numbers and brand adaptation.
- `modules/12-render-export.md` — render options, formats, transparency, validation, Lottie status.
- `modules/13-qa-iteration.md` — QA checks, blind critic, scorecard, corrective actions, round log.
- `modules/14-testing-benchmarks.md` — benchmark suite and how to extend it.
- `modules/15-brand-motion-system.md` — Mode E deliverable.
- `modules/16-review-improvement.md` — Mode F on existing videos.
- `lessons.md` — rules distilled from past rounds. Read before implementing; append after each project.

## Engine at a glance
| tool | purpose |
|---|---|
| `analyze.mjs` | measure logo: parts, holes, symmetry, repetition, alignment, palette; `parts.svg` part tree; raster `--trace` (approximate) |
| `outline-text.mjs` | text → outlined paths (`--per-glyph`, `--verify` vs browser shaping; Arabic contextual forms) |
| `refs.mjs` / `oneshotted.mjs` | reference library search/validate/add; optional Oneshotted MCP client |
| `blueprint.mjs` | validate the plan, print timeline |
| `runtime/lm-runtime.js` | composition contract, preview UI (scrubber, onion-skin), blueprint compiler, seeded random, easing |
| `render.mjs` | deterministic frames → MP4/WebM/GIF/MOV, stills, manifest, determinism check, motion blur |
| `qa.py` | rendered-output QA: fidelity, hold, pops, handoffs, dead air, easing, flashes, safe area, blueprint promises, exports, scorecard |
| `serve.mjs` | interactive browser preview |
| `selftest.mjs` | end-to-end environment check |
