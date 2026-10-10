# 10 · Animation Implementation Engine

**Purpose:** build the blueprint as a deterministic composition the renderer can step through.
**Output:** `composition.html` that loads `/__lm/lm-runtime.js` and calls `LM.composition({...})`.
**Done when:** it renders without page errors, `--check-determinism` passes, and QA passes.

## Choose the engine (don't force one framework)
| need | engine | notes |
|---|---|---|
| vector reveal, draw, mask, morph, assembly (most logos) | **SVG + GSAP timeline** (default) | DrawSVG, MorphSVG, MotionPath, SplitText, CustomEase ship free with GSAP 3.15 (`/__lm/gsap/*.min.js`) |
| procedural / particles / many objects | **Canvas 2D** via `draw(t, ctx)` | seeded `LM.random(seed)`; finish by drawing/revealing the official SVG on top |
| justified 3D (extrusion, light, camera) | Three.js (vendor it into the project; not bundled) | render must still be `seek(t)`-pure; CPU-only containers are slow; keep the final hold 2D-exact |
| programmatic video in React | Remotion (if installed in the project) | follow the same final-frame contract; render via Remotion CLI |
| interactive web / app | export the same timeline as a web component; Lottie only for transform/opacity/trim-path motion | see 12 |
| After Effects handoff | blueprint.json + per-part SVG layers + timing table | the skill cannot run AE here; deliver an AE-ready spec |

## Composition contract (lm-runtime)
```html
<div id="stage"> <svg id="logo" class="logo" viewBox="…">…parts…</svg> </div>
<template id="official-logo"><svg viewBox="…">…untouched artwork…</svg></template>
<script src="/__lm/gsap/gsap.min.js"></script>
<script src="/__lm/lm-runtime.js"></script>
<script>
LM.composition({ width:1920, height:1080, fps:60, duration:4, background:'#0E0F13',
  logo:{ template:'#official-logo', rect:{x,y,w,h} }, markers:{ reveal:2.6 },
  build(ctx){ const tl = gsap.timeline(); /* absolute-time tweens */ return tl; },
  draw(t, ctx){ /* optional canvas layer, pure function of t */ } });
</script>
```
- `build` returns a paused GSAP timeline; the runtime seeks it. `draw(t)` runs after the seek each frame.
- `setup(ctx)` (optional, async) for pre-computation (path lengths, glyph splits).
- Preview: `node serve.mjs <proj>` → scrubber, frame-step, **onion-skin** (overlays the official logo in difference mode — any misalignment glows).
- Network is blocked during render: vendor fonts/assets into the project folder.

## Recipes (verified patterns; adapt, don't paste blindly)
**Draw-on of a stroked path:** `tl.fromTo(el, {drawSVG:'0%'}, {drawSVG:'100%', duration:1, ease:'power2.inOut'}, t)` (load DrawSVGPlugin).
**Draw-on of a *filled* shape:** duplicate the path as a stroke-only outline (`fill:none; stroke:brand; stroke-width:k`), draw it, then cross-fade/fill the original and remove the outline before the hold. Or reveal the fill with a `<clipPath>`/`<mask>` whose shape is animated.
**Mask reveal:** put the part in a `<g mask="url(#m)">`; animate the mask's white shape (rect/circle/path). For directional wipes along a part's orientation use `analysis.parts[].orientation_deg`.
**Negative-space entry:** a circle/rect mask grows from a `holes[]` bbox centre, or the background colour shape shrinks away from the counter.
**Assembly:** for each part, `fromTo` from an offset along its own direction (not all from the same side), stagger by hierarchy, end at identity. Use `transformOrigin` at meaningful pivots (shared corners, circle centres).
**Morph:** `MorphSVGPlugin` with `shapeIndex:'auto'`; equalise topology first (holes ↔ holes). For hole-count mismatches morph the outer contour and fade/mask the counter.
**Per-glyph Latin type:** outline with `outline-text.mjs --per-glyph`, animate `#g0…gN` by reading order.
**Arabic word:** keep joined glyph runs together; reveal right→left with a mask; animate dots/harakat as secondary actors; kashida stretch by scaling a connecting stroke segment and settling to the official length.
**Canvas particles converging into the logo:** sample target points from the official mask (rasterise the SVG offscreen in `setup`), move seeded particles with an ease-out function of `t`, then cross-fade to the exact SVG and stop drawing particles before the hold.

## Pitfalls (each has bitten a real render)
- GSAP `x/y` on SVG **children** are in **viewBox user units**, not CSS px (`x:-300` in a 120-wide viewBox is off-screen).
- `transformOrigin` on SVG elements is relative to the element's bbox; set `svgOrigin` for a shared pivot.
- Ending states must be identity; use `clearProps` only if the rendered hold still matches (`qa.py` will tell you).
- CSS `@keyframes`/transitions are not seekable → forbidden. `var()` inside keyframes silently breaks easing in Chromium.
- Filters (blur/glow) are expensive per frame and differ across browsers; never leave them on in the hold.
- `stroke-dasharray` draw-ons show a dot at the start with round caps; start at `drawSVG:'0% 0%'` with butt caps or fade in the first frames.
- Never letter-space Arabic; never split joined glyphs in the final state.
