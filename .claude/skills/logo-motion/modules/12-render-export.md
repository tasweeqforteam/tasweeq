# 12 · Rendering & Export

**Purpose:** reproducible renders and validated deliverables.

```bash
node render.mjs <proj>/composition.html [--out <proj>/renders] [--formats mp4,gif,webm,mov]
     [--fps 60] [--scale 1|2] [--transparent] [--check-determinism] [--motion-blur 4]
     [--gif-fps 25 --gif-width 720] [--crf 16] [--from t --to t] [--allow-network]
```
How it works: Chromium loads the composition at its exact size, waits for fonts and `__LM.ready`, seeks every frame (`t = i / fps`), screenshots losslessly, then encodes with ffmpeg. It also writes `first.png`, `final.png` (t = duration), `marker-*.png`, `reference.png` (official logo in its rect) and `render-manifest.json` (settings, ffprobe validation, determinism, page errors).

| format | settings | use |
|---|---|---|
| MP4 | H.264 yuv420p, CRF 16, BT.709 matrix + tags, faststart | default delivery, social, web |
| WebM | VP9 (yuva420p with `--transparent`) | web, alpha on web |
| MOV | ProRes 4444 (alpha with `--transparent`) / 422 HQ | editing handoff, broadcast |
| GIF | palettegen (diff) + sierra dithering, 25 fps, 720 px | previews, chat, email |
| PNG sequence | `renders/frames/` | compositing, QA |

Validation (automatic): size, fps, duration match the composition; decoded MP4/WebM brand colour vs lossless final (ΔE < 3); page errors fail the render; `--check-determinism` re-renders sample frames out of order and compares.

Rules: same fps across exports; ≥ 2 output formats when useful; never claim an output that isn't listed as validated in the manifest. Transparent renders need a composition `background: 'transparent'` and `--transparent`. Motion blur only when the critic sees strobing on fast moves (×K render time); never blur across a hard cut.

## Lottie status
Not implemented as an automatic exporter. When Lottie is required: keep motion to transforms, opacity and trim paths on the `parts.svg` part tree; hand-author or generate Lottie JSON from the blueprint; verify it by rendering with lottie-web (install it in the project) and comparing frames with the GSAP render via `qa.py` video mode. Report clearly if a technique (masks with animated paths, filters, MorphSVG) cannot be represented.

## After Effects handoff
Deliver `blueprint.json` + per-part SVGs (`analysis/parts.svg`, split as needed) + a timing table (stage, layer, property, from → to, ease as cubic-bezier). The skill cannot execute AE here.
