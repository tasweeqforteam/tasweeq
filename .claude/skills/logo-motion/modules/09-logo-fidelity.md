# 09 · Logo Fidelity & Asset Handling

**Purpose:** protect the official artwork while allowing temporary transformation.
**Done when:** `qa.py` reports `fidelity.final_frame: pass` and no compromises are undisclosed.

## Rules
1. The supplied file is authoritative. Copy it to `logo/` and never edit it. Animation-specific geometry lives in the composition, separately.
2. Preserve silhouette, proportions, spelling, typography, colours, negative-space relationships, relative positions — in the final state exactly, and mid-animation unless the concept deliberately transforms them (and resolves).
3. **Final-frame contract:** `<template id="official-logo">` holds the untouched artwork; `logo.rect` places it. The renderer screenshots it as `reference.png`; QA compares it to `final.png`. Target IoU ≥ 0.998 and mean error < 1.5. Every tween must end at identity: no leftover `scale(1.0001)`, opacity 0.99, blur(0.1px), stroke widths or filters.
4. Prefer original vectors. Ask for the SVG/AI/PDF source when only a small raster exists and path-level motion is planned.

## SVG inspection checklist (from `analysis.auto.json` → `features`, `elements`)
viewBox present? · groups and `transform`s (flattened in `parts.svg`) · fills vs strokes (`strokes_only`) · `fill-rule` (evenodd holes) · masks / clipPaths (don't break them by moving children independently) · gradients (animate via their parent, check gradientUnits) · filters (expensive, not Lottie-safe) · `<text>` (outline it) · `<image>` (raster inside SVG) · `<use>`/symbols.
`parts.svg` is safe to animate only when `parts_svg_fidelity.mask_iou ≥ 0.995`; otherwise animate the sanitized source structure.

## Raster inputs
- Check `source_size` and warnings. < 400 px on the short side: whole-image or mask-based motion only.
- `--trace` produces `traced.svg` with an IoU score. It is an **approximation**: use it for masks, motion planning, or temporary states, and end on the original raster (or request vectors). Never present traced paths as the official artwork.
- Do not fabricate geometry: no "redrawn" letters presented as the logo.

## When the concept needs decomposition
Split along natural seams (parts/holes), keep each piece's original geometry, and reassemble exactly. Declare any necessary compromise in `blueprint.fidelity.compromises` and tell the user before rendering finals (e.g., "stroke-draw uses a centre-line approximation during 0–1.2 s; final state is the original fill").
