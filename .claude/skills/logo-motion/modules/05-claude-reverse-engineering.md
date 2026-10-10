# 05 · Claude-Specific Reverse Engineering

**Purpose:** learn how successful Claude / Claude Code logo-motion work was produced — prompts, structure, pipeline, corrections — without copying it.

## Classification (required on every reference)
- **A · verified-claude** — the creator or reliable documentation explicitly states Claude or Claude Code was used for *that* output.
- **B · claude-compatible** — a skill/repo/tool designed for Claude, without proof that each showcased output was Claude-made.
- **C · professional-inspiration** — other artists/tools; transferable principles only.
Compatibility ≠ authorship. A README saying "built for Claude Code" does not make its demos Claude-made.

## Record (when available)
title & URL · creator · class · model & agent · original prompt (≤ 300-char excerpt) · input assets & logo format · framework & rendering · concept · sequence & transitions · timeline/easing/key poses · source & asset availability · iteration process · known issues · quality notes · licence · date verified. Tag every observation **observed** (seen) or **inferred**.

## Analysis questions
How did they describe the motion (names for parts? numbered order? timings?) · how was the logo structured (semantic parts, ids) · how were transitions implemented · how were previews generated and checked · what failed and how was it corrected · what made the result read as designed rather than generic.

## Findings to date (library snapshot 2026-10-10; see `library/research/*.md`, `node refs.mjs search --attribution verified-claude`)
Observed patterns across verified/compatible Claude work:
1. **Name the parts.** Successful Claude logo animations start by splitting the SVG into named semantic parts (ClaudeLog "Vibe Animating": base + 7 accents animated in numbered order; Yellow Raincoat: SVG in `public/`, parts named in the prompt; pixel2motion: one addressable element per semantic part, split along animation seams). → our `parts.svg` + analysis part ids.
2. **Skill-grounded prompting.** Remotion gallery prompts begin "use remotion best practices…" — the agent leans on a skill for framework rules. → this skill's modules play that role.
3. **Pure function of time + frame capture QA.** drawn-by-code (verified Claude Code, README) and pixel2motion require seekable time and judging captured frames, not wall-clock screenshots. → `lm-runtime` + `render.mjs`.
4. **Look-at-frames loop with a cap.** drawn-by-code: never sign off without rendering and looking; ≤ 3 automatic rounds, then human feedback recorded verbatim; lessons distilled into rules. → module 13 + `lessons.md`.
5. **Final-frame contract.** pixel2motion: the last frame must equal the verified static SVG (exact diff). → `qa.py fidelity.final_frame`.
6. **Blind critic.** Oneshotted skill: a fresh agent judges pixels without the builder's rationale; checker output shown only after the verdict. → module 13 §3.
7. **Promise vs implementation.** wiggle validates that the implementation delivers the stated motion philosophy. → `qa.py --blueprint` stage checks.
8. **Documented failures** (observed): Remotion 3D-logo transparent export failed first time (fixed via docs); preview ≠ render mismatches (Yellow Raincoat); `var()` in `@keyframes` silently linear; round-cap draw-on stall/pop; lockstep motion; viewBox clipping mid-flight; stair-stepped traces passing IoU but failing visually (pixel2motion).
Evidence strength: the five verified-Claude items are snippet-level (partially verified); repo-level findings (pixel2motion, drawn-by-code, wiggle, motion-promo, oneshotted-skill) were read from cloned source. Model versions are rarely stated — record `null` rather than guessing.

## Rules
Learn principles, not sequences. Do not reproduce a creator's complete sequence, branded assets or proprietary code. Adapting open-source code: verify the licence, keep attribution, document changes in the project README.
