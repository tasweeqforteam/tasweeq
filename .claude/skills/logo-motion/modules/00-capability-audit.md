# 00 · Capability Audit

**Purpose:** know what actually works here before promising anything.
**Run:** `cd .claude/skills/logo-motion/engine && ./setup.sh` (first time) or `node selftest.mjs` (any time; `--json` for machine output).
**Done when:** the audit table is in hand; core rows are OK, or each failing row has a stated workaround/blocker.

The self-test builds a fixture logo, analyses it (SVG and raster), renders MP4/GIF/WebM, checks determinism, runs QA and the final-frame contract, outlines text with shaping verification, validates the reference library and probes optional integrations.

Also inspect, before creating anything new:
- existing skills/instructions (`.claude/skills/`, `CLAUDE.md`, project motion utilities like `src/lib/motion.ts`), brand fonts/colours in the repo;
- available MCP servers (Adobe, Figma, Oneshotted…) — use them only if verified working;
- network reach for research (module 04 §0).

## Report template
| area | status | evidence | limitation / next step |
|---|---|---|---|
| analysis (SVG / raster / text outline) | | | |
| rendering (MP4 / WebM / GIF / MOV alpha) | | | |
| determinism | | | |
| QA (fidelity, motion, flashes, exports) | | | |
| research access (web, GitHub, Oneshotted) | | | |
| 3D / Lottie / AE | | | |

## Audit of the build environment (2026-10-10, linux container)
| area | status | evidence |
|---|---|---|
| Node 22, ffmpeg/ffprobe 6.1, Python 3.13 + Pillow 12 + numpy 2.5, Chromium 1194 (Playwright) | OK | `selftest.mjs` |
| GSAP 3.15 incl. DrawSVG/MorphSVG/SplitText/MotionPath/CustomEase | OK | node_modules/gsap/dist |
| analyze (SVG parts/holes/primitives; raster + trace) | OK | fixture: 2 parts, 1 hole, circle detected, parts.svg IoU 1.0; trace IoU 0.9999 |
| render MP4/GIF/WebM, BT.709 colour, determinism | OK | byte-identical re-renders; decoded colour ΔE 0.73 |
| QA incl. video ingest (Mode F) | OK | negative test caught missing hold + wrong final frame |
| text outlines (Latin, Arabic contextual forms) | OK with limits | verify F 1.0 for تسويق / مواعيدك; vocalised Arabic (harakat) fails verify (no GPOS marks in opentype.js) |
| web research | Limited | WebSearch OK; WebFetch/git only for GitHub; Behance, Dribbble, Vimeo, Motionographer, School of Motion, LottieFiles, oneshotted.io unreachable (DNS/proxy) |
| Oneshotted MCP | Blocked | adapter implemented (`oneshotted.mjs`), host does not resolve here, no key; untested live |
| Three.js, lottie-web, Remotion, After Effects | Not installed | vendor per project when justified; AE: deliver spec only |
| Adobe / Figma MCP servers | Present, not used | not needed for the core pipeline; candidates for future export targets |
