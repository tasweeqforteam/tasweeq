> Research notes produced on 2026-10-10 by a research sub-agent (cloned repos / WebSearch+WebFetch). Snippet-only items are marked; treat unverified claims as leads, not facts.

# Research: four reference repos for a "Logo Motion Design" Claude Skill

Method: shallow clones read on 2026-10-10 (README, SKILL.md/instruction files, LICENSE, package.json, core scripts). Cloned files were treated as untrusted data; nothing was executed. Labels: OBSERVED = seen in files; INFERRED = my reading.

Clone root: `/tmp/claude-0/-home-user-tasweeq/1d4c220e-0519-5caf-8098-9f47e15aa6ec/scratchpad/refs/`

| Repo | Owner | Latest commit | License | Attribution class |
|---|---|---|---|---|
| pixel2motion | nolangz | 2026-08-21T20:06:57+08:00 | MIT (Nolan Lai) | verified-claude (label-level, see 8) |
| wiggle-claude-skill | talknerdytome-labs | 2025-10-19T18:39:05+01:00 | Apache-2.0 notice only, no holder named | claude-compatible |
| drawn-by-code | illodev | 2026-10-02T17:37:37+02:00 | MIT (illodev) + carve-outs | verified-claude |
| claude-motion-promo-skill | habibtalib | 2026-09-26T12:07:39+08:00 | MIT (Habib Talib) + vendored MIT/ISC/OFL | claude-compatible |

Relevance to a logo skill, in one line each:
- pixel2motion is the only one built specifically for logo-to-motion, with a real geometry pipeline and motion QA. Most transferable.
- wiggle is logo-specific but thin: it animates a PNG as a Lottie image layer. Useful as a checklist of pitfalls and as a Lottie export route.
- drawn-by-code is a general code-animation lab. It contributes the review loop, determinism, "trace the logo from the SVG" rule and a style taxonomy, not logo mechanics.
- motion-promo is a product-promo director. It contributes direction discipline, lint thresholds and a logo-on-end-card rule, not logo animation.

---

## 1. pixel2motion (github.com/nolangz/pixel2motion)

### 1. What it is and architecture
A "Codex and Claude skill" (README) that turns a raster logo into a minimal smooth SVG, then into a CSS/JS-choreographed standalone HTML animation, with a QA evidence trail. OBSERVED files:
- `SKILL.md` (28 KB, "v2"): three phases, Pixel (brief), Vector (fit), Motion (choreograph), then Acceptance Criteria.
- `agents/openai.yaml`: UI metadata plus a long `default_prompt` (a Codex convention).
- `references/`: `twelve-principles-for-logos.md`, `motion-personality.md`, `reveal-patterns.md`, `html-delivery-template.md`, `ribbon-fitting.md`.
- `scripts/`: 11 helpers (trace, overlay, path audit, ribbon fit, showcase builder, frame capture, continuity probe, 4K video export).
- `docs/`: GitHub Pages showcase (`docs/index.html`, ~7.5k lines with base64-embedded iframes), GIFs, pixel sources, fitting-process strip.

How the agent is told what to do: the SKILL.md frontmatter `description` carries the triggers ("animate a logo, build a logo reveal / splash screen / brand intro, convert a logo image into animated SVG..."). The body is a strict phase pipeline with named hard gates, a numbered iteration budget, and "Completion requires evidence, not claims". References are loaded on demand by name ("Read `references/html-delivery-template.md` before building"). Defaults are explicit: "default to a splash-style reveal plus a static end state" and ask the user only if genuinely ambiguous.

### 2. Logo input handling
- Raster input (PNG/JPG/WebP/screenshot). Phase 1 inventories size, mode, alpha, foreground colours, background, and splits the mark into semantic parts (mark, wordmark, letters, dots, swooshes, containers, negative space).
- `scripts/raster_logo_trace.py`: colour-bucketed mask (alpha or border-median background), simplified contours, overlay images. SKILL.md calls the output "a measurement aid, never automatically final art".
- Segmentation is semantic and manual-by-agent: one element or `<g>` per part with stable ids (`#mark`, `#wordmark`, `#letter-a`, `#dot`), paths split along animation seams.
- "Complexity Ladder": primitives, composites, few-curve analytic paths, smoothed outlines, trace-derived paths last.
- Hard "Smoothness Gate": a jagged high-IoU trace is rejected; a smooth lower-IoU fit wins. `scripts/svg_path_audit.py` flags noisy handles, tangent jumps, stair-step runs.
- Closed self-crossing ribbons (infinity marks, scripts): `scripts/fit_ribbon_centerline.py` and `references/ribbon-fitting.md`, centerline scaffold plus edge snap.
- Prefer live SVG `<text>` for wordmarks unless exact letterforms are needed. Draw-on strokes get `pathLength="1"`.

### 3. Animation pipeline and frameworks
- Dependency-free: CSS `@keyframes` targeting part ids, or a bespoke JS act/phase timeline. No GSAP, Lottie, Remotion or Three.js.
- `scripts/animate_svg_showcase.py` rebuilds the SVG through JS DOM calls and wraps it in a showcase shell (replay, slow-mo, speed slider, atomic motion studies, principles strip).
- Timeline model: all part animations on one shared clock; golden-ratio shape "Anticipation : Action : Follow-through = 20% : 50% : 30%", parts staggered 10-20% of their own duration.
- Pattern library in `reveal-patterns.md`: draw-on (with a dash-math artifact table), split-fill draw-on across self-intersections (exact de Casteljau easing subdivision, tip glint), staggered assembly, scale-pop with overshoot, mask wipe, morph-from-primitive, letter cascade, idle loops, hover states.
- Reduced motion is mandatory (`prefers-reduced-motion` shows the final state).

### 4. Rendering, preview, export
- Deterministic seek hooks: `?t=<ms>` pauses at an exact time, `?static=1` shows the final state, `window.__p2mReady`. CSS keyframes must use `animation-fill-mode: both|forwards` so seeking is reliable.
- `scripts/capture_motion_frames.py` (Playwright) captures frames and builds a labelled strip; `--compare-final` diffs against the static render.
- `scripts/export_claude_videos.mjs`: 4K, 120 fps frame stepping from the showcase page, MP4 or transparent WebM/MOV. Hard-coded macOS Chrome path (OBSERVED, line 14).
- GIF previews in `docs/gifs/`. No Lottie export.

### 5. Quality evaluation and feedback loops
The strongest of the four, and it is quantitative:
- Geometry: cyan overlay of the vector on the raster, IoU plus pixel deltas per iteration, saved as `outputs/fit_iterations/NN_*.png`, with a default 10-iteration budget and a ranked "best-of-run" rule (smoothness, structure, IoU, boundary RMS, audit kinks, visual verdict, lowest complexity).
- Motion: frame strip inspected with multimodal vision; an easing probe (`probe_motion_continuity.py --probe`) reads computed values at seeked times to detect a silently dropped easing; an ink-delta sweep (`--ink-sweep 850:1010:10`) catches stall-then-pop at handoffs.
- "Final Frame Contract": the animation's final frame must equal the verified static SVG, with an exact 0-diff same-pipeline check.
- Loops are seam-checked by capturing frames just before and after the loop point.

### 6. Creative-direction guidance
Motion is derived from a brief, not taste. Brief = 3 personality words + usage context + choreography sketch. Taxonomy in `motion-personality.md`: two axes (Energy low-high, Tone serious-playful) plus six presets (Playful/Joyful, Elegant/Premium, Trustworthy/Professional, Energetic/Bold, Calm/Caring, Friendly/Approachable), each with a token set (duration, ease-enter, ease-settle, squash, overshoot). Usage-context duration bands: splash 1200-2000 ms, header reveal 300-800 ms, loading loop continuous, hover 150-300 ms.

Notable excerpts:
- `SKILL.md`: "**minimal smooth geometry IS animatable geometry**"
- `SKILL.md`: "never let all parts start or stop on the same frame (the #1 mechanical-motion mistake)"
- `references/motion-personality.md` (sanity check): "Would a competitor's logo wearing this exact motion feel the same? If yes, push one principle further toward the personality."
- `references/motion-personality.md`: "Never pick easing or duration by taste — derive them here, record the derivation in `motion_spec.md`."
- `references/motion-personality.md`: "Describe the finished animation in 3 words. Do they match the brand words from the brief?"

### 7. License
`LICENSE`: MIT, "Copyright (c) 2026 Nolan Lai". Attribution requirement: keep the copyright and permission notice in copies or substantial portions. No other attribution demanded. Third-party: README links a companion repo (Pixel2SVG-HTML) and a commercial site; not vendored.

### 8. Evidence about Claude
- `README.md`: "Pixel2Motion is an open-source Codex and Claude skill for logo animation, SVG animation, and AI-assisted brand motion."
- `docs/index.html` header: "raster logo to SVG animation · Claude / GPT motion studies". Each demo is a side-by-side column labelled "Claude" or "GPT" (`<figcaption>... Claude</figcaption>`, iframe title "Horizon — Claude"). README gallery alt text: "Claude Horizon logo motion preview", files `docs/gifs/claude-*.gif`. Two Claude cells carry the note "1 more round prompt after result".
- `scripts/export_claude_videos.mjs` exports "... — Claude" titled videos.
- Not stated: which Claude model, whether Claude Code or another harness, or the exact prompt. `SKILL.md` is "Codex-facing" per the README, and `agents/openai.yaml` is a Codex file.

Classification: **verified-claude** at the label level (creator explicitly labels the showcased outputs as Claude's, alongside GPT's). Confidence moderate: model and agent are unspecified, so record `model: null`, `agent: null`.

### 9. Weaknesses and limitations
- OBSERVED: heavy, long SKILL.md (28 KB) with many named rules; high cognitive load for an agent and the README itself says the pipeline needs a venv, Playwright and Chromium.
- OBSERVED: macOS-biased defaults (Chrome paths in `render_overlay.py` and `export_claude_videos.mjs`); `CHROME_BIN` override exists for the former.
- OBSERVED: README "Publishing Checklist" still says "Add a `LICENSE` file before publishing" although LICENSE exists (stale text). README foregrounds a commercial service and WeChat QR, so repo is partly marketing.
- OBSERVED: no raster-to-vector automation that is final-quality; the agent must hand-fit geometry (trace is only a starter). Quality depends on the model's ability to fit Béziers in at most 10 iterations.
- OBSERVED: no Lottie/After Effects export, so output is web-only HTML or video.
- OBSERVED: the Claude-labelled GIFs are the only evidence; prompts are not included (only a Codex `default_prompt`).
- INFERRED: chromium-specific behaviours (the `var()` in keyframes finding, `offset-path` glint) are tied to Chromium; cross-browser behaviour untested.
- INFERRED: the rigour is overkill for simple logos; a lightweight path is needed for single-shape marks.

### 10. Transferable principles
1. Structure the artwork for motion before animating: one addressable element per semantic part, split along animation seams, stable ids, draw-on paths normalised.
2. Derive motion parameters from a written brief (personality words, energy x tone axes, usage context) and record the derivation. Tokens hold the brand's single motion voice.
3. A final-frame contract: every animation must land exactly on the verified static logo; test it with a same-pipeline exact diff.
4. Evidence over claims: deterministic time-seek, frame strips viewed by vision, plus numeric probes for the failures the eye misses (dropped easing, handoff stalls).
5. Prefer smoothness and low geometric complexity over pixel-fit scores; cap fitting iterations and disclose residuals.
6. Timeline grammar: anticipation / action / settle (about 20/50/30), staggered overlaps, no two parts on identical start and end unless deliberate.

---

## 2. wiggle-claude-skill (github.com/talknerdytome-labs/wiggle-claude-skill)

### 1. What it is and architecture
"Wiggle - Logo Animation Skill for Claude Code". Turns PNG/SVG/JPG into Lottie JSON plus rendered GIF/MP4. OBSERVED structure:
- `SKILL.md` (frontmatter: name, description with trigger phrases, `license: Complete terms in LICENSE.txt`). Progressive disclosure: SKILL.md is the index; `references/` holds detailed examples, presets, anti-patterns, troubleshooting, text guide, Lottie spec, script usage.
- `scripts/`: `prepare_logo.py`, `extract_svg_elements.py`, `convert_logo_to_svg.py` (potrace), `validate_logo.py`, `validate_lottie.py`, `validate_loop.py`, `verify_animation.py`, `render_lottie.py`, `optimize_lottie.py`, `batch_export.py`, `check_dependencies.py`.
- `references/real-world-examples/`: nine third-party hover-animation Lottie JSONs (Reddit, Slack, Discord, Medium, Snapchat, SoundCloud, Flickr, Indie Hackers, Renren).
- `REORGANIZATION_SUMMARY.md`: the SKILL.md was cut from ~2,846 to ~608 lines.

Agent guidance: "When to Use" trigger list, then a numbered Core Workflow with two "MANDATORY (30 seconds)" steps (motion philosophy, logo analysis), a decision tree (text? multi-element? SVG or PNG?), an intent-classification table, a "Critical Warnings" list, and a pre-flight checklist. "Default: Provide animation rather than asking questions, unless user explicitly requests options."

### 2. Logo input handling
- SVG: `extract_svg_elements.py` (ElementTree) lists and extracts paths, groups, text elements (optional per-letter split), computes bbox/viewBox and writes one SVG per element.
- PNG/JPG: `prepare_logo.py` (Pillow) resizes (500-600 px full logo, 100-250 px elements), optimises PNG, emits a base64 text file. `convert_logo_to_svg.py` traces raster to SVG with the `potrace` binary (threshold-based, binary, single colour).
- Animated as Lottie image layers (`ty: 2`) referencing PNG assets; SKILL.md notes shape layers (`ty: 4`) exist but examples use images.
- Strong rule: text must be extracted, never recreated: "Using PIL ImageDraw to recreate logo text -> Creates DIFFERENT text, not your logo text".
- PNG logos are "Limited to single-logo animations".

### 3. Animation pipeline and frameworks
Hand-written Lottie JSON (v5.7.4 skeleton, 30 or 60 fps) with bezier keyframes. Rendering via the Python `lottie` library (Cairo for GIF, FFmpeg for MP4). Multi-element timing by layer delay (15/30/45 frames = subtle/noticeable/dramatic stagger). Motion types: Static/Corporate (8-12 keyframes, 30 fps), Organic/Continuous (25-45 keyframes, 60 fps), Bold, Cinematic. A table of easing bezier pairs (0.42/0.58, 0.25/0.75, 0.34/1.56, 0.6/-0.28).

### 4. Rendering, preview, export
`render_lottie.py` to GIF/MP4 with pre-render asset validation, output sanity check (blank/corrupt, <1 KB), `--preview-frames N`, `--test-render` (200x200, 15 fps with confirmation), `batch_export.py` for gif/mp4/json. Lottie JSON is itself a deliverable. Rendering is deterministic by nature (frame sampling by the library), no headless browser. Size guidance tables per use case (email signature 20-50 KB JSON, etc.).

### 5. Quality evaluation and feedback loops
Structural, not visual:
- `validate_lottie.py` (structure, big embedded assets), `validate_loop.py` (first vs last keyframe within tolerance), `verify_animation.py` (layer count, staggering actually present, size) to catch "promise-implementation mismatch".
- Process loop: philosophy first, preview render, then full render.
- OBSERVED: nothing instructs the agent to look at rendered frames or compare them to the source logo; grep for "view/look at/inspect/screenshot" in SKILL.md and references finds nothing relevant.

### 6. Creative-direction guidance
Philosophy-first, three questions: personality, emotion, motion metaphor. Named presets: Corporate Subtle, Startup Energetic, Luxury Elegant, Tech Glitch; use-case presets: Website Hero 0.8 s, Email Signature 3 s loop, Social Intro 2 s, Splash 2.5 s. Intent classification table (Subtle / Bold / Playful / Organic). Brand-metaphor examples (Flickr shutter, Discord wink) and "Metaphor-Based Animations Stand Out".
Excerpts:
- `SKILL.md`: "Philosophy: Trustworthy, established, competent / Expression: Slow ease-out fade ... + gentle scale (95%->100%)"
- `SKILL.md`: "**Never use linear easing** - always use curves for professional motion."
- `SKILL.md`: "Audio/Speech Brand ... Vertical waveform with dense keyframes (30-45 keyframes, 60fps)"
- `references/real-world-examples/README.md`: "5 out of 9 examples use pinch/squeeze - it's a safe, effective choice that works across industries."

### 7. License
`LICENSE.txt` (560 bytes): "Apache License 2.0 / Copyright 2025" plus the standard "Licensed under the Apache License, Version 2.0" notice. SPDX: Apache-2.0 (abbreviated notice only; the full license text is not included; no copyright holder is named). Attribution: Apache-2.0 normally requires preserving notices and a copy of the licence. README says "Part of the Anthropic Agent Skills collection" and "Created for use with Claude Code by Anthropic" (a relationship claim I could not verify from the files). Risk: `references/real-world-examples/*.json` are third-party brand animations (Reddit, Slack, Discord...) redistributed as "production Lottie JSON files from well-known brands". The Slack file's internal name is `wired-flat-2565-logo-slack` (INFERRED: this looks like a commercial icon-library asset); redistribution rights are unstated. Do not copy these.

### 8. Evidence about Claude
- `README.md`: "Wiggle - Logo Animation Skill for Claude Code"; "Created for use with Claude Code by Anthropic."
- `README.md`: "Claude Code handles all dependencies automatically."
- `references/anti_patterns.md` uses "Claude's implementation:" as an illustrative persona in examples.
- No showcased output (no GIF/MP4 in repo, no claim that a particular animation was made by Claude).

Classification: **claude-compatible** (written for Claude Code, but no showcased outputs and no statement that Claude produced any).

### 9. Weaknesses and limitations
- OBSERVED: `prepare_logo.py` imports only Pillow and has no SVG rasteriser, yet SKILL.md instructs `prepare_logo.py elements/icon.svg`. `requirements.txt` lacks cairosvg/rsvg, and `potrace` is an unlisted external binary. The SVG route is therefore likely broken without extra tooling (INFERRED from missing dependency).
- OBSERVED: animation is applied to rasterised image layers, so no per-path morphing or draw-on; text reveal beyond fade needs shape layers, and `text_animation_guide.md` says stroke reveal is "Not recommended for first-time users". It also points to "Pattern #9 in SKILL.md", but SKILL.md only defines multi-element Pattern 1 and 2 (dangling reference).
- OBSERVED: validation is structural only; no pixel or vision check of output against the logo.
- OBSERVED: GIF via Cairo breaks on embedded images over 100 KB, hence the external-reference workaround.
- OBSERVED: latest commit 2025-10-19 (shallow clone, so history not assessable); about a year old relative to the other three. Licence file is abbreviated with no holder.
- OBSERVED: README promises "Claude Code handles all dependencies automatically", which is unsupported by the files (Cairo/ffmpeg/potrace need system installs per SKILL.md).
- INFERRED: the dense keyframe counts (25-45, up to 120) imply the agent hand-writes large JSON, error-prone without a visual check.

### 10. Transferable principles
1. Make "motion philosophy" a mandatory 30-second step (personality, emotion, metaphor) before any keyframe.
2. Analyse the logo structure first and branch the workflow (text vs icon, single vs multi-element, vector vs raster).
3. Never recreate logo text; extract it from the source artwork.
4. Preview cheaply (first N frames, small test render) before full renders, and validate loops mathematically (first state equals last state).
5. Write a promise-vs-implementation verifier (is the stagger actually present? layer count right?). Add a visual check on top, which this repo lacks.
6. Keep SKILL.md as a lean index with heavy material in references (progressive disclosure), plus a size/format budget table per use case.

---

## 3. drawn-by-code (github.com/illodev/drawn-by-code)

### 1. What it is and architecture
"Animations and videos made with code by Claude" (README): a repo that is both a toolbox and a public test bench for code-drawn animation (JavaScript on `<canvas>`, 2D or WebGL2), rendered to MP4 via headless Chromium and ffmpeg. 543 files, mostly experiments. OBSERVED:
- `CLAUDE.md` (map, commands, "The loop (mandatory)", "The detail bar").
- `.claude/skills/`: `animate` (brief to MP4), `engine`, `review`, `sound`, `replicate`, `hands`, `transitions`, `new-style`, and one `style-*` per look (paper-cutout, 70s-poster, liquid-light, kaleidoscope, line, clay, clay3d, risograph, pixel-art, felt3d, engraving, comic, tabletop3d). `.claude/settings.json` has a SessionStart hook running `engine/setup.sh`.
- `engine/` (about 1.7k lines): `player.html`, `core.js`, `render.mjs`, `review.mjs`, `reference.mjs`, `detail.mjs`, `mix.mjs`, `tempo.mjs`, `transitions.js`, `gif.mjs`, `strip.mjs`.
- `styles/<style>/` (kit, template, README, strip), `sandbox/<date>-<name>/` (brief, scene, review, renders), `HANDOFF.md`, `CONTRIBUTING.md`.
Agent routing: CLAUDE.md map says "`.claude/skills/animate/` **Start here** for any video"; the animate skill's description lists triggers including "animated logo or 'a test' of a style".

### 2. Logo input handling
There is no logo pipeline. Logo handling is a rule inside the `animate` skill (OBSERVED):
- "**The brand's logo is traced, never drawn by eye.** Take the path from the site's SVG (sample its curves into points, keep its proportions and gaps) and cut that as paper."
- Wordmark rule: draw the whole lockup from the SVG in the brand colour, "never the mark plus the name typed in ink with the brand font".
- Logo shown big is re-cut at display scale (own sprite key per size). Client logo files live in gitignored `private/`, with committed code running on a placeholder brand.
- The review checklist: "put the logo next to the client's SVG at the same size."

### 3. Animation pipeline and frameworks
No animation library. "A scene is a pure function of time": `Motion.scene({ fps, duration, logical, uses, bpm, shots, draw(g, t, env) })`, no state between frames, no `Math.random`/`Date`. Easing helpers `Ease.seg/inOut/out/back/elastic`, `Motion.keys`, `Motion.cam`, shot dispatch by `Motion.shotAt`. Style kits supply look (torn paper, riso halftone, raymarched clay). "Animating on twos" (12 drawings/s). Large scenes split per shot/segment, often built by parallel agents with written briefs.

### 4. Rendering, preview, export
`render.mjs` drives `window.renderFrame(i)` in headless Chromium, pipes frames to ffmpeg (MP4, stills `--at`, `--frames`, `--from/--to`, `--gpu`); `gif.mjs`, `strip.mjs` for GIF and film-strip previews; `mix.mjs` for audio with cues aligned to frames; ElevenLabs used for music/SFX (README). Deterministic frame stepping is the core design.

### 5. Quality evaluation and feedback loops
Very developed:
- `review.mjs`: automatic critique (errors, non-determinism by painting frames in a different order and comparing hashes, flashes over 3 per second, transparent holes, flat frames, cuts off the beat, still stretches, speed), plus a contact sheet that the agent must open with Read.
- Mandatory loop in `CLAUDE.md`: "Never sign off on an animation without rendering it and looking at frames", up to 3 automatic rounds, then user feedback recorded verbatim in `review.md`, then lessons distilled into skills ("Write rules, not anecdotes").
- "Detail gate" (`engine/detail.mjs`) scores a replica against a reference zone by zone; `reference.mjs` measures colours, tracking, cuts.
- Use of adversarial review by parallel agents on the real render (animate skill lesson: found "~50 issues the author had stopped seeing").
- "Be harsh: ... If you hesitate between 'it reads' and 'it doesn't read', **it doesn't read**."

### 6. Creative-direction guidance
Style taxonomy (README table, 11+ styles with status approved / in testing). Script discipline in `animate/SKILL.md`:
- "Every shot, one action you can tell in a sentence with a verb ... not a look."
- "Density in layers: a moving background, secondary elements ... and a protagonist."
- "One evolving visual idea ... is worth more than a list of scenes."
- "Nothing still for more than 1 s except the ending: visual silence looks like a bug."
- Transitions lesson: continuous physical ones where "the same object [is] carried across" beat generic wipes.
Process: brief, shot table, 4-7 s style test at final quality, animatic, final. Lessons log per style skill.

### 7. License
`LICENSE`: MIT, "Copyright (c) 2026 illodev". Explicit carve-outs: fonts keep their own SIL OFL 1.1; `assets/sfx/` generated with ElevenLabs, "commercial use requires a paid ElevenLabs plan". Attribution: keep MIT notice. Replicas (`what-do-you-love`, `opus5-riso`) are studies of Kevin Ngo's videos; the README credits him and states "The original design and animation are his", so do not reuse those scenes. `references/` and `private/` are not in git.

### 8. Evidence about Claude
- `README.md`: "Animations and videos made **with code** by Claude."
- `README.md`: "The goal: push Claude's knowledge and visual limits as far as they go."
- `README.md`: "With Claude Code, just ask: 'make me a 10 s paper-cutout video for...'".
- `package.json` description: "Animation drawn by code with Claude"; `HANDOFF.md`: "a Claude Code session on the user's own computer"; `.claude/skills/` and a SessionStart hook; process logs `review.md` per experiment.
- No exact model version stated (the "opus5" in `opus5-riso` names a study of someone else's film, not a model claim).

Classification: **verified-claude** (creator explicitly states Claude made the showcased output; agent Claude Code; model unspecified).

### 9. Weaknesses and limitations
- OBSERVED: not logo-specific; no SVG-path ingestion code in `engine/` or `styles/` (grep finds `Path2D` only in the comic kit). The "trace the SVG" rule is prose; the tracing code lives in gitignored `private/`.
- OBSERVED: heavy token and wall-clock cost: the opus5 detail-gate round cites "~10 M tokens" for six card agents; cloud container had no GPU so one WebGL frame took minutes (`HANDOFF.md`).
- OBSERVED: several styles "in testing"; one experiment (felt-cats) "paused"; a final render of current code was "not made or reviewed yet" at handoff.
- OBSERVED: heavy emphasis on hand-drawn/illustrative looks (paper, clay, riso); little on clean brand-logo motion, geometric reveals or vector fidelity.
- OBSERVED: repo is large (543 files incl. many binaries); SFX/music depend on a paid third-party service.
- INFERRED: the process is tuned to one demanding human reviewer (the owner's verbatim feedback becomes rules), so the rules may over-fit one person's taste.

### 10. Transferable principles
1. Make the scene a pure function of time: deterministic, any frame renderable alone; verify by rendering frames out of order and comparing hashes.
2. Close the loop with an automatic review plus a contact sheet the agent must actually look at, capped at 3 rounds before escalating.
3. "The brand's logo is traced, never drawn by eye": use the client's SVG path, whole lockup including wordmark, and compare side by side at identical size.
4. Distil lessons from each round into reusable skill rules, written as imperatives, with a place for client-specific rules that must not leak into the generic skill.
5. Each shot needs a one-sentence verb action; one evolving idea beats a list of effects; transitions should carry an object across the cut.
6. Crop and inspect at full resolution; a downscaled sheet hides defects (lessons log: "The sheet at 480 px doesn't show facial details").

---

## 4. claude-motion-promo-skill (github.com/habibtalib/claude-motion-promo-skill)

### 1. What it is and architecture
"A Claude Code skill that turns one prompt into a directed motion video" (README): 3D isometric promos, explainers, narrated tutorials, kinetic type, music-synced reels. One skill (`motion-promo/SKILL.md`) routing between two engines (OBSERVED):
- Diorama engine: `template/` (`lib.js`, `scene.js`, `index.html`, `render.mjs`, `audio.py`, `make.sh`), Three.js r180+, toon-shaded isometric scenes.
- motion-video engine, vendored (v1.1.0 from farhan-syah/motion-video-skill, MIT) in `motion-video/`: HTML/CSS/SVG scenes, `scripts/video.mjs` CLI (`doctor`, `init`, `check`, `render`, `audit`, `speak`, `transcribe`...), references (`direction.md`, `concepts.md`, `styles.md`, `craft.md`, `building.md`, `narration.md`, `tts.md`), icon list (Lucide), sound synthesis.
- `examples/skill-promo/` (the 29 s demo scene), `media/` (demo MP4/GIF/contact sheet), `UPSTREAM.md` (vendoring notes and one local patch).
Routing: SKILL.md "Shared workflow": sweep (`doctor`), gather facts, ask at most 5 questions with defaults, route to an engine, direct (three concepts), build, check, render, review, deliver honestly.

### 2. Logo input handling
Minimal. OBSERVED:
- Logo is found in the repo (`public/img`, `assets`...), copied to `assets/logo.png` and placed as a raster `<img>`/canvas image (`drawContain`).
- Brand colours are sampled from the logo with a Pillow snippet ("sample from the logo, don't invent hex codes").
- No SVG parsing, vectorisation or segmentation. Logo animation is whole-image (caption-card badge, end-card pop and glow).
- motion-video rules: "Logo: on the end card"; "No logo-first intros"; if requested, "reveal it as a lockup right after the hook. Never open on it." Concept list includes "Logo reveal: The lockup builds with a burst, glow or light sweep" (`concepts.md`). "One brand on screen" and "Never a second brand".

### 3. Animation pipeline and frameworks
- Diorama: Three.js scene as pure `renderAt(t)`; helpers `pop()` (spring bounce-in), `cameraRig()` (ortho drifting shots), `captions()`, `outro()`, `beatGrid(bpm)`, `countUp`. Choreography rules: stagger 0.1-0.2 s, entrances animate 2-3 properties, exits ~2x faster, holds.
- motion-video: HTML/CSS/SVG with a seek contract (`window.__video.seek(ms)`, CSS animations set to frame time), optional GSAP 3.15, lottie-web 5.13, three 0.186 (from its `package.json`). Forbids rAF, timers, `Date.now`, CSS transitions and system fonts in scenes.

### 4. Rendering, preview, export
Frame-exact: headless Chromium (Playwright) screenshots per frame piped to ffmpeg (h264+aac, `-crf 16`, vignette, optional grain), synthesized SFX/music (`audio.py` numpy; motion-video's own synth), loudnorm to -14 LUFS, contact sheet, frames re-extracted from the final MP4 to verify the encode. Output MP4 only (plus draft and compressed copies). No Lottie or GIF export (GIF in README is a repo asset).

### 5. Quality evaluation and feedback loops
- Preview key frames cheaply (`render.mjs preview t1,t2,...`) and read them; contact sheet; frames from the final MP4; pre-delivery checklist (no linear motion, staggers, holds, caption not covering action, loudness).
- motion-video `check --scene N` lints measurable rules (text size, contrast, hold time, safe margin, covered text, flashes) and the `audit` command compares each sound cue with measured onsets and motion in the rendered video. Thresholds table in `craft.md` cites sources (EBU R 95, WCAG 2.2, ITU-R BT.1359, Material 3) and honestly labels others "Practice. Not sourced."
- Honest-reporting rule: "audio was checked by meters/waveform, not by ear"; list placeholders and fictional data.

### 6. Creative-direction guidance
- Direction before code: "Direct first, then build. Never turn a plain brief straight into code." Three concepts with different story shapes, pick one, write a sonic concept and energy arc.
- Prompt recipe (README): "Name the style, the camera, each prop and a physical metaphor for each feature" with a full template prompt ("3D isometric diorama in flat illustration style (like Storyset): toon shading, soft shadows ...").
- Style taxonomy (`styles.md`): Launch keynote, UI story, Isometric diorama, Flat illustration explainer, Kinetic typography, Data story, Dark tech, Editorial grid; "Blend at most two styles, one dominant."
- Verb moment: "Prove each feature with one physical action that shows the benefit."
Excerpts:
- `motion-promo/SKILL.md`: "stagger everything (0.1-0.2s between props...); ... exits ... ~2x faster than entrances; **holds**"
- `motion-video/references/direction.md`: "Hook: A strong image or line in the first 2 s. Motion from frame 0. No logo-first intros."
- `motion-video/WORKFLOW.md`: "Every feature is shown by a verb moment, never a bullet list."
- `motion-video/references/craft.md`: "Style drift between scenes -> Reuse the same tokens, radii, shadows and camera language."

### 7. License
Root `LICENSE`: MIT, "Copyright (c) 2026 Habib Talib". Vendored `motion-promo/motion-video/LICENSE`: MIT, "Copyright (c) 2026 Farhan Syah" (must be retained). Lucide icons: ISC (`templates/icons.LICENSE.txt`); Inter and JetBrains Mono fonts under SIL OFL (`templates/fonts/OFL.txt`). README credits motion-craft rules adapted from haidrrrry/claude-remotion-skill (licence not examined). TTS note: MMS-TTS models are non-commercial (SKILL.md says to flag it). Attribution: keep each MIT/ISC/OFL notice with any copied parts.

### 8. Evidence about Claude
- `README.md`: "A Claude Code skill that turns one prompt into a directed motion video"; badge "Claude Code Skill"; "Open Claude Code in your app's repo and ask:".
- `README.md`: "This whole video was made *by this skill, about this skill*." Demo outro text (`examples/skill-promo/scene.js`): "A Claude Code skill · this video was made with it".
- `motion-promo/SKILL.md`: "claude.ai web sandbox times out on long renders ... render via Claude Code".
- Not stated: that Claude (or a particular model) authored the demo scene; the statement is that the skill produced it. The vendored motion-video engine is agent-agnostic.

Classification: **claude-compatible**. The skill is built for Claude Code and the demo is said to be made by the skill, but no explicit statement that Claude generated the showcased output.

### 9. Weaknesses and limitations
- OBSERVED: no logo-specific pipeline (raster PNG only, no vector, no segmentation); logo motion is limited to pop, glow and card badge.
- OBSERVED: macOS bias: `render.mjs` launches Chromium with `--use-angle=metal`; default font "Avenir Next" is macOS-only (SKILL.md says drop in a woff2 elsewhere).
- OBSERVED: two incompatible runtimes (Diorama served over HTTP with import maps; motion-video over `file://`) bridged only via rendered footage ("Don't mix the two runtimes in one file").
- OBSERVED: vendored about 150 KB of reference docs plus about 30 library modules in `scripts/lib`; large surface, patch needed for Chrome 13x (`oklab()` colour crash), and re-vendoring is manual.
- OBSERVED: the demo is a single 29 s self-promo; no gallery of different brands, so effectiveness across logos is unproven.
- OBSERVED: the clone is shallow (1 commit visible), so project history and maintenance cadence could not be assessed; sound quality is only checked by meters, not by ear (admitted in SKILL.md).
- INFERRED: "1854 icons" and speech runtime (~500 MB download on first use) make setup heavy for a logo-only use case.

### 10. Transferable principles
1. Direct before building: gather facts and brand assets first, ask at most 5 questions each with a default, draft three concepts, then pick.
2. Sample brand colours from the logo (exact values), do not invent them; flag every invented item (tagline, URL, data) in the final report.
3. A logo reveal belongs after a hook or on the end card, held still long enough to read (at least 1.5 s); never open on it.
4. Choreography grammar: stagger, animate 2-3 properties per entrance, exits faster than entrances, deliberate holds; "constant jitter reads amateur".
5. Lint the measurable (text size, contrast, hold, safe margins, flashes), review the rest by looking at contact sheets and frames pulled from the final encoded file.
6. Report honestly what was verified by instrument vs by eye vs not at all.

---

## Cross-repo synthesis for the Logo Motion Design skill

Gaps none of the four fill (INFERRED): a pipeline that accepts an SVG logo and automatically builds an animatable part tree (flatten transforms, split compound paths, assign ids, compute path lengths and bboxes); stroke-to-fill logo handling; and Lottie export from path-level animation. pixel2motion comes closest on the structure and QA side; wiggle on the Lottie export side.

Recommended combination of ideas (principles, not code):
- Front end: brief with personality words + usage context (pixel2motion, wiggle), logo structure analysis before animating (wiggle), "trace from the brand's SVG" and never redraw (drawn-by-code).
- Core: addressable semantic parts, final-frame contract, deterministic time-seek (pixel2motion, drawn-by-code).
- QA: automated review script + contact sheet that must be viewed, 3-round cap (drawn-by-code); numeric probes for easing and handoffs (pixel2motion); loop and promise-vs-implementation validators (wiggle); lint thresholds for readability and end-card hold (motion-promo).
- Delivery: report what was verified and what is placeholder (motion-promo).

Licensing note: all four are permissive for ideas; do not copy wiggle's third-party brand Lottie files or drawn-by-code's Kevin Ngo replicas. Copying code requires keeping the respective MIT/Apache notices.
