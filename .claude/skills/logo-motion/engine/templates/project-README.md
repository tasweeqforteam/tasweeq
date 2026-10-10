# <brand> — logo motion

| | |
|---|---|
| Concept | *name — one line* |
| Duration / fps / size | *4.0 s · 60 fps · 1920×1080* |
| Final state | official logo, exact from *t* s (final-frame contract, see QA) |
| Engine | GSAP timeline on SVG, deterministic `seek(t)` (lm-runtime) |

## Why this movement
*2–4 sentences tying the motion to the logo's geometry/meaning (from analysis + concepts).*

## Files
- `logo/` — authoritative input (unchanged)
- `analysis/` — measurements, overview, part tree
- `concepts.md` — three directions + evaluation
- `blueprint.json` — executable motion plan
- `composition.html` — source of the animation
- `renders/` — MP4/GIF/stills (+ `qa/` evidence)

## Reproduce
```bash
cd .claude/skills/logo-motion/engine
node render.mjs <project-dir>/composition.html --formats mp4,gif --check-determinism
python3 qa.py <project-dir>/renders --blueprint <project-dir>/blueprint.json --review <project-dir>/review.json
node serve.mjs <project-dir>   # interactive preview with scrubber + onion-skin
```

## Iterations
| round | observed problem (evidence) | correction | result |
|---|---|---|---|
| 1 | | | |

## Known limitations / compromises
- 
