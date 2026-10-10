# 06 · Reference Library & Knowledge Retrieval

**Storage:** `library/references.json` (source of truth, versioned in git = persistent across sessions), `library/INDEX.md` (generated), `library/sources.json` (platform access notes), `library/research/*.md` (raw research notes).

## Entry schema
```json
{ "id": "ref-<kebab>", "title": "", "creator": "", "url": "",
  "attribution": "verified-claude|claude-compatible|professional-inspiration",
  "verification": { "status": "verified|partially-verified|unverified", "method": "", "last_verified": "YYYY-MM-DD" },
  "logo_category": [], "motion_techniques": [], "brand_personality": [], "reveal_mechanism": "", "motion_family": "",
  "production": "2d|3d|hybrid", "framework": [], "complexity": "low|medium|high", "concept": "",
  "prompt_available": false, "prompt_excerpt": null, "source_code_available": false,
  "observations": [{ "text": "", "type": "observed|inferred" }],
  "transferable_principles": [], "weaknesses": [], "license": null, "model": null, "agent": null, "tags": [] }
```
Canonical facets are derived automatically (`refs.mjs`): techniques — draw-on, mask-wipe, assembly, morph, kinetic-type, negative-space, particles, 3d, physics, light, glitch, scale-pop, fade, loop, liquid-organic, sound-sync, procedural; frameworks — remotion, gsap, svg-css, threejs, lottie, canvas, webgl, after-effects, hyperframes, python, blender.

## Commands
```bash
node refs.mjs search "geometric construction circles" --technique draw-on --limit 5
node refs.mjs search --attribution verified-claude
node refs.mjs principles "negative space"        # aggregated transferable principles
node refs.mjs show ref-repo-pixel2motion
node refs.mjs add new-refs.json                  # validates, dedupes by id/URL, regenerates INDEX.md
node refs.mjs validate                           # schema, duplicates, attribution rules, staleness (>180 d)
node refs.mjs stats
node oneshotted.mjs to-ref <id> > r.json && node refs.mjs add r.json   # when Oneshotted is reachable
```
Validation rules: `verified-claude` cannot be `unverified`; prompt excerpts ≤ 300 chars; URLs must look valid; duplicates rejected.

## Maintenance
- Add references found during projects (with verification method and date).
- Re-verify time-sensitive entries older than 180 days before relying on them.
- Remove broken or irrelevant entries rather than keeping noise.
- Persistence: the library is a git-tracked file. If the skill is copied elsewhere, copy `library/` with it; restore by checking out the file. No database is required.

## Known gaps (as of 2026-10-10)
No negative-space or construction-specific references with verified video; most professional-inspiration entries are snippet-only because portfolio sites were unreachable. Fill these when an environment can reach Behance/Vimeo/Oneshotted.
