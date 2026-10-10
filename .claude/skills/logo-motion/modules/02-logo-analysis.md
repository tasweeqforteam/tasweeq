# 02 · Logo Analysis Engine

**Purpose:** turn the supplied logo into facts and motion opportunities *before* any creative idea.
**Input:** the logo file (SVG preferred; PNG/JPG/WebP accepted), optional brand info.
**Output:** `analysis/analysis.md` completed (sections A–E), backed by `analysis.auto.json`, `overview.png`, `parts.png`.
**Done when:** every opportunity in section E cites concrete evidence, and every statement is tagged [measured] / [observed] / [interpreted] / [verified: source].

## 1. Measure
```bash
node analyze.mjs <logo> --out <proj>/analysis          # SVG
node analyze.mjs <logo.png> --out <proj>/analysis --trace   # raster (+ approximate trace)
```
Then **look** at `overview.png` (numbered parts, magenta holes, dashed construction lines, yellow symmetry axes) and `parts.png` (each part isolated). Read the console summary and warnings.

What the numbers mean:
| field | use it for |
|---|---|
| `parts[]` | addressable visual parts (outer contour + its holes). Animation targets. |
| `islands` vs `parts` | islands = visually separate blobs; if parts ≫ islands, parts overlap/touch |
| `holes[]` | enclosed negative space (counters, windows) → negative-space reveals, mask entry points |
| `symmetry` (IoU) | > 0.9 = strong axis → mirrored/converging motion is *earned*; < 0.6 = asymmetric → directional motion |
| `geometry.straight_ratio`, `circle_parts`, `polygon_parts` | construction logic: geometric (ruler/compass) vs organic (hand) |
| `repetition[]` | modules/repeats (with transform: flip, rot90…) → rhythm, cloning, kaleidoscopic or counting motion |
| `alignment[]` | shared edges/centres → construction grid, sliding along shared lines, snapping |
| `orientation_deg`, `elongation` per part | natural direction of travel, pivot axes |
| `solidity` | < 0.6 = linear/stroke-like → draw-on candidates; ≈ 1 = solid blob → mask/scale/morph candidates |
| `parts_svg_fidelity` | 1.0 ⇒ `parts.svg` is a faithful part tree you can animate directly |
| `palette` | exact brand colours of the final state |

## 2. Structure (A)
Classify (confirm visually, the heuristic is only a hint): symbol/pictorial · abstract · wordmark · lettermark/monogram · emblem (contained) · mascot · combination · geometric/modular system. Record components, layers, hierarchy (what reads 1st/2nd/3rd at a glance), and the **semantic grouping** of parts (e.g., p3+p4 = the two dots).

## 3. Geometry & construction (B)
Look for: primitives (circles, squares, arcs), grids and shared lines, proportions (golden/√2/simple ratios between part sizes), symmetry and its breaks, negative-space figures (the arrow in FedEx-type relationships), repeated modules, stroke thickness consistency, how one would *build* the mark with ruler and compass, natural draw paths (continuous contours, single-stroke possibility), assembly order (base → structure → detail → accent), and pivot points (shared corners, circle centres).

## 4. Typography (C)
For lettering: typeface character (geometric/humanist/grotesk/serif/script/Kufi/Naskh/Thuluth-inspired…), distinctive letterforms, ligatures, terminals, contrast, baseline/x-height, kerning rhythm, and which letters carry the identity. Note **risks**: per-letter motion that breaks reading order, scale changes that alter weight, transforms that distort letterforms.

**Arabic & RTL (mandatory checks):**
- Reading and motion direction is right-to-left; reveal order and sweeps should honour it unless the concept deliberately inverts it (and says why).
- Letters join; a "letter" is a contextual glyph form. Never split joined forms apart in the final state, and avoid animating isolated glyphs in a way that shows broken joins mid-word unless the break is the idea and resolves.
- Dots (نقاط) and diacritics (حركات) are identity-critical; never drop or misplace them. They are excellent secondary-motion actors (they can arrive last, settle with follow-through).
- Kashida/tatweel (ـ) elongation is a native Arabic motion vocabulary (stretch → settle).
- Never apply CSS letter-spacing to Arabic. If the logo is live text, outline it with `outline-text.mjs --verify` (fails on wrong shaping; opentype.js does not position harakat — keep designer outlines for vocalised text).

## 5. Meaning & personality (D)
Write *verified* facts with a source (brand site, guidelines, the user). Then *interpretation*, labelled as such ("the bowl and two dots read as Arabic ت — interpretation"). Note usage context: splash/app open (1–2 s), web hero (2–4 s), social intro (2–3 s), broadcast ident (4–8 s), loader (loop), UI micro-interaction (< 0.8 s).

## 6. Animation opportunities (E)
List 4–8 opportunities, each with evidence and a reason it belongs to *this* logo:

| opportunity type | look for |
|---|---|
| construction replay | circles/lines/grid present; geometric straight_ratio high or circle parts |
| negative-space protagonist | holes[] or figure-ground relationships |
| part relationship drama | repetition, near-symmetry, parts that interlock or orbit |
| directional energy | elongated parts, consistent orientation, arrows, asymmetry |
| typographic behaviour | distinctive letters, ligatures, script direction, kashida |
| transformation/morph | two parts with similar topology; a part that resembles a primitive |
| meaning metaphor | verified brand meaning that has a physical behaviour (growth, connection, flow, lock) |
| material/behaviour | weight, softness, rigidity implied by forms (stroke weight, roundness) |

A good opportunity is falsifiable: you can point at the pixels that justify it.
