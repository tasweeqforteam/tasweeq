# AI-Built Websites & Coding-Agent Design Skills

Inspected 2026-10-10 by cloning each repository (`git clone --depth 1`) and reading the source. Live demos were **not** opened in a browser (the hosting domains were not reachable from the inspection environment), so visual claims below come from source code and the authors' own documentation, not from rendered pages.

## Classification key

| Class | Meaning |
|---|---|
| **AI-generated (claimed)** | The author states an AI model generated the site end-to-end. We can verify the code exists; we cannot verify the generation process or model. |
| **AI-assisted** | Humans and AI collaborated; authorship mixed. |
| **AI feature** | A normal website that integrates an AI product feature. |
| **AI experiment showcase** | Collections of generated demos (often art/simulation), not commercial sites. |
| **Agent skill / prompt** | Instructions that steer a coding agent's output; not a website itself. |

## About the model name "Fable 5"

Three repositories below credit "Claude Fable 5". Secondary news coverage (search, 2026-10-10) reports Anthropic released Claude Fable 5 on 2026-06-09 with API id `claude-fable-5`; no primary Anthropic page was retrieved during inspection, so treat the release details as `INFERRED` from secondary sources. Which model generated each repository is **self-reported by the repository authors** and is `UNKNOWN` (unverifiable) from the code. Do not repeat "built by model X" as fact.

---

## 1. Anthropic — Official `frontend-design` skill
- **URL:** https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design · marketplace page https://claude.com/plugins/frontend-design (HTTP 200, redirects to `claude.com/marketplace/plugins/frontend-design`)
- **Class:** Agent skill (official). Plugin version 1.1.0 (VERIFIED in `plugin.json`, commit 2301018, 2026-10-09).
- **What it is (VERIFIED, SKILL.md):** design-lead framing; ground design in the subject; hero shows "the most characteristic thing in the subject's world"; one or two type families with a clear scale; avoid single-word headline accents, ALL-CAPS labels, unnecessary labels; structural devices must encode information (numbers only for real sequences); sparing, purposeful motion — "a single orchestrated moment"; named list of current AI-design clusters (cream + serif + terracotta; near-black + acid accent; broadsheet hairlines; SaaS-card kit; template chrome); a two-pass process (token plan → critique against the brief → build); restraint ("remove one accessory"); writing guidance (user's words, active voice, CTA says what happens, errors don't apologize).
- **Strengths:** compact, opinionated, process-oriented; explicitly calls for screenshots during self-critique.
- **Limitations:** no research workflow, no motion engineering guidance, no QA tooling, no RTL coverage, no scoring.
- **Reused here:** the generic-cluster calibration, the plan→critique→build loop, copy rules. This skill extends it rather than replaces it; both can be active.
- **Licence:** "Complete terms in LICENSE.txt" (per frontmatter) — study and reference; don't redistribute text verbatim.

## 2. az9713 / fable-5-frontend-design
- **URL:** https://github.com/az9713/fable-5-frontend-design (commit 472c988, 2026-07-09)
- **Class:** AI-generated (claimed) — README states five sites were built "entirely autonomously by Claude (Fable 5)" from one prompt (`prompt2.txt`, VERIFIED present).
- **Live:** kilter-type.netlify.app, hadal-descent-218.netlify.app, kanoe-atelier.netlify.app, voltaic-vlt3.netlify.app, prisma-light.netlify.app — `UNKNOWN` status (not reachable from inspection environment).
- **Stack (VERIFIED):** five single-file HTML sites, no build step. HADAL loads three.js r128 from cdnjs with an `integrity` attribute; others are dependency-free. Google Fonts: Recursive (KILTER), Instrument Serif/Sans + IBM Plex Mono (HADAL), Shippori Mincho B1 + Zen Kaku Gothic New (KANOE), Space Grotesk/Mono (VOLTAIC), Unbounded + Manrope (PRISMA).
- **Techniques (VERIFIED in source + each `/guide` page):**
  - KILTER — pointer velocity, low-pass filtered (`vel += (target − vel) × 0.08`), mapped to `font-variation-settings` via CSS custom properties; one rAF loop; contenteditable type tester with range sliders; `mix-blend-mode: difference` nav that stays legible over light and dark sections.
  - HADAL — scroll progress mapped to a depth scalar (0 → 10,935 m) driving background color stops, three.js particles and a live HUD.
  - KANOE — generated photography with a shared lighting vocabulary, dissolved into layout with gradients; vertical Japanese type.
  - VOLTAIC — the product page is a playable Web Audio synth (knobs, sequencer, oscilloscope).
  - PRISMA — raw GLSL fbm aurora reacting to the cursor; SVG grain to reduce banding.
- **Quality floor (VERIFIED by grep):** all five include `prefers-reduced-motion` handling and `:focus-visible` styles.
- **Process (author-documented):** divergent concepting (no two sites share palette, type, or core tech), asset generation, **three browser iteration passes per site** (screenshot desktop + mobile, read console, fix), deploy, verify routes.
- **Lessons:** one idea per site, executed deeply; "one scalar drives everything"; product-as-demo; iteration passes catch real bugs (the README lists: HUD invisible over light water, square particles, mis-anchored hint, clipped mobile nav, cramped keyboard).
- **Limitations:** single-file architecture is not a production pattern for multi-page sites; demo brands are fictional; no CMS/content workflow.
- **Licence:** no LICENSE file found — study only; do not copy code.

## 3. codewithmuh / fable5-websites
- **URL:** https://github.com/codewithmuh/fable5-websites (commit ad521d9, 2026-06-14)
- **Class:** AI-generated (claimed) — "Every site in this repo was generated by Claude Fable 5 from a single prompt" (PROMPTS.md).
- **Stack (VERIFIED, package.json):** React 19, Vite 8, three 0.184, @react-three/fiber 9, @react-three/drei 10, react-router-dom 7 (HashRouter). 11 pages (~110–160 lines each; SolarSystem 356).
- **How it was made (VERIFIED, PROMPTS.md):** one **base template prompt** with four slots (hero photo, Three.js overlay, palette, content) reused for 10 industries, plus a shared "Animation Layer" prompt.
- **Findings from source (VERIFIED):**
  - Images hotlinked from `i.pinimg.com` (Pinterest) and Unsplash (`src/data/images.js`). Pinterest images are not licensed for reuse → **licensing risk**; hotlinking is also a reliability risk.
  - `Reveal` component starts content at `opacity: 0` with a 3D transform until IntersectionObserver fires, and the reduced-motion rule in `index.css` covers only hero classes → reduced-motion users still get scroll motion, and content depends on JS.
  - `useMouse` stores pointer position in React state on every `mousemove` → re-renders the consuming component per event (performance cost; refs/CSS variables are cheaper).
- **Lessons:** a shared template prompt produces fast variety in *skin* but sameness in *structure* (every industry page follows the same section order) — the opposite of concept-first design. Good source for R3F overlay patterns; poor model for asset licensing, reduced motion and render performance.
- **Licence:** no LICENSE file — study only.

## 4. elder-plinius / FABLE-SHOWCASE
- **URL:** https://github.com/elder-plinius/FABLE-SHOWCASE (commit b340cce, 2026-07-07)
- **Class:** AI experiment showcase — 57 single-file demos (generative art, simulations, instruments, procedural worlds) "designed, built, polished, and QA-verified" by parallel agent runs (README; ~275 sub-agent runs claimed).
- **Findings (VERIFIED):** 57 demo folders; 43 of 57 include `prefers-reduced-motion`; no external `<script src="http…">` (zero-dependency claim consistent); gallery `index.html` is 4.4 MB because thumbnails are inlined as data URIs.
- **Lessons:** a *design → build → enhance → QA* pipeline per artifact; headless-browser thumbnails as QA evidence; zero-dependency canvas/WebGL techniques worth studying for generative backgrounds. Not commercial websites — little to learn about IA, conversion or content.
- **Limitations:** a 4.4 MB gallery page is a performance anti-pattern for production; 14 demos lack reduced-motion handling.
- **Licence:** none found — study only.

## 5. mah-claude / anti-slop-website-prompts
- **URL:** https://github.com/mah-claude/anti-slop-website-prompts (commit bfce6e5, 2026-08-03)
- **Class:** Agent skill / prompt library (maintained by Meez, meez.design). **MIT licence** (VERIFIED).
- **Content (VERIFIED):** 15 full build-prompts (React/Tailwind/Framer Motion specs with named fonts, token colors, structural layout, motion specs, asset URLs) and a `SKILL.md` with five decisions: name real typefaces and pair them; color as tokens with one accent, gradients banned unless chosen; layout described structurally (asymmetry); specify motion (one entrance + one scroll behavior, with durations/easings); wire in real assets.
- **Lessons:** specificity is the cure for generic output — a prompt with zero design decisions yields the statistical average. Their checklist maps directly to this skill's design-direction template.
- **Limitations:** prompts specify *surface* (fonts, colors) more than *concept*; no QA loop; commercial upsell to a larger paid library.

## 6. acumenix / claude-code-frontend-design-toolkit
- **URL:** https://github.com/acumenix/claude-code-frontend-design-toolkit (commit 2a6d095, 2026-04-11)
- **Class:** Curated list (README only) — "70+ tools", April 2026: design skills, theming, animation, UI/UX intelligence, design-to-code, browser automation, docs/context MCPs, framework skills, deploy.
- **Use:** discovery index for agent tooling (e.g. UI/UX Pro Max skill, Taste Skill, Playwright/Chrome DevTools MCPs, Context7-style docs servers). Star counts and install commands in it are the author's claims as of April 2026 — re-verify before recommending.
- **Limitations:** no evaluation of quality; may be stale. No licence file.

## 7. wenkang-deepblue / frontend-design
- **URL:** https://github.com/wenkang-deepblue/frontend-design (commit 17bb943, 2026-07-03) · **MIT licence** (VERIFIED)
- **Class:** Agent skill (Claude Code / Codex). The repo also promotes a paid Chrome extension (FrontCap).
- **What it actually does (VERIFIED, SKILL.md/README):** generates a self-contained HTML *preview* with light/dark panes, design-token "knobs" (dropdowns, sliders, toggles), a DevTools-style element picker for comments, direct text edits, and one-click Markdown export that the user pastes back to the agent. It's a **human-in-the-loop** visual feedback loop — not automated screenshot QA.
- **Lessons:** structured feedback (selector + scope + comment) is easier for an agent to apply than prose; expose real project tokens as knobs; light/dark side-by-side review.
- **Limitations:** relies on the human to review; preview is a separate artifact from the real app (the skill insists it mirror the real routes).

---

## Cross-cutting lessons (applied in this skill)

1. **Concept-first beats template-first.** The strongest AI-built examples (az9713) start from one idea per site; the weakest pattern is one template prompt reused across industries.
2. **Iteration in a real browser is what separates demo from product.** Every high-quality example documents screenshot → fix passes.
3. **Quality floor must be explicit** (reduced motion, focus, responsive, fallbacks) or it is skipped — see the 14/57 and the codewithmuh `Reveal` findings.
4. **Asset provenance matters.** Generated images with consistent art direction or licensed photography; never hotlinked Pinterest images.
5. **Claims about which model built something are self-reported.** Evaluate the artifact, not the label.
