# C · AI-assisted product campaign: record (PARTIAL)

**Status: partial.** The brief asks for human-created *and* AI-assisted references and an AI-assisted production.
In the build environment:
- References: the only AI-campaign records (REF-0001…0004, REF-0010) are leads or `search-verified`. **None was
  inspected**, so their production methods stay `unverified`.
- Image generation: Figma `generate_image` and Adobe generative tools appear in the tool roster but were **not
  exercised** (they need an authenticated account, and uploading assets needs the user's go-ahead).
  No raster image was generated.
What *was* tested: the campaign system, product fidelity across placements, recomposition per ratio, typeset copy.

**Concept:** "the product is the sundial". The tube in low sun throws a long shadow: shade you carry.

**System (fixed):** sand ground, sun disc device, ink type; NewBlack 700 headline + Inter; wordmark bottom
inline-start; **product from one SVG `<symbol>`**, so every placement shows the identical product (geometry,
label, colours). That is the fidelity mechanism a real run would get from compositing one approved packshot.
**Variation (free):** headline per placement; sun height/crop along the left edge; product scale.

**Image plan for a real AI-hybrid run (not executed):** generate the sand/sky ground per ratio, wider than the crop,
low-texture in the headline zone, light from the left at a low angle; composite the real packshot; match the
contact shadow to the generated light; reject any generation with lettering.

**Iterations:**
1. Contact-sheet review (not QA) caught a **light-logic failure**: in two placements the sun was on the right while
   the shadow still fell right. New fixed rule: light always from the left.
2. QA: sub-line over the sun disc at 3.68:1 and URL at 4.28:1 → moved the disc and darkened the muted colour.
3. Square: weight sat entirely left → product moved toward centre.

**QA:** PASS · 0 critical · 0 major · 2 minor (headline last line "shade." is a deliberate sense break; story headline's
font ascent area touches the top safe line, line box inside).

**Rubric (self-review):** concept 4 · hierarchy 5 · grid 4 · composition 4 · negative space 4 · typography 4 · text 5 ·
art direction 4 · brand 4 · craft 4 = **42/50** for the system as built. The AI-production requirement is **not met**.

## Update 2026-10-10: user font change (Alexandria / Inter Tight)

Headlines, wordmark and SVG label text switched to Inter Tight. Re-QA: PASS. Rubric scores above were given before the font change and were not re-scored.
