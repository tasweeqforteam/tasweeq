> Research notes produced on 2026-10-10 by a research sub-agent (cloned repos / WebSearch+WebFetch). Snippet-only items are marked; treat unverified claims as leads, not facts.

# Logo Motion Design Skill: Web Inspiration Research

Date of research: 2026-10-10. Tools: WebSearch (standard, extended x3) and WebFetch only.

## Method and environment limits (read first)

- WebFetch resolved only `github.com` and `raw.githubusercontent.com`. Every other host returned `getaddrinfo ENOTFOUND`: oneshotted.io, behance.net, lottiefiles.com, dribbble.com, vimeo.com, motionographer.com, schoolofmotion.com, remotion.dev, claudelog.com, mindstudio.ai, aiidelist.com. `api.github.com` returned 403 and `github.com/search` later returned 429.
- WebSearch results are model-written summaries of pages, and sometimes disagree with each other. Everything marked "search snippet only" below is a summary of an indexed page, not the page text. I treat such items as `partially-verified` at best.
- Fetched content was treated as data. No page contained instructions aimed at me.
- Classification rule applied: `verified-claude` only when the creator or docs explicitly say Claude or Claude Code made the piece. Skills and tools designed for Claude, with no proof that showcased outputs were Claude-made, are `claude-compatible`.

---

## A. Oneshotted (oneshotted.io)

### Verified by fetched page (GitHub README and raw SKILL.md of `Codesaz-Company/oneshotted-skill`; `GovarJabbar/oneshotted-skill` is a mirror with the same README)

- It is an agent skill, MIT licensed (third-party parts MIT or Apache-2.0). 4 commits, 0 stars, 0 forks at fetch time.
- It makes motion graphics and videos from code (Remotion by default, HyperFrames, GSAP, Three.js) and draws on a library of "5,000+ AI-made pieces and their prompts" from oneshotted.io.
- Install: `curl -fsSL https://oneshotted.io/install.sh | sh`, or `npx skills add Codesaz-Company/oneshotted-skill -g` followed by `python3 ~/.claude/skills/oneshotted/scripts/library.py login`. A free account works. Python 3.9+ is required.
- Sign-in can be skipped with `ONESHOTTED_API_KEY` (format `osk_...`), obtained at `https://oneshotted.io/mcp-docs`.
- `scripts/library.py` commands, from raw SKILL.md: `login`, `search "<query>" --limit 6`, `recipe <id>` (returns the creator's verified prompt), `frames <id> --count 3 --out research/frames`. `scripts/check.py` measures a render with ffmpeg and writes a contact sheet.
- Skill rules: only quote prompts the creator verified. Credit creators. Show the brand in the first and last 2-3 s. Bans include "Introducing...", bouncy overshoot, camera shake, RGB split, a slow first second, sparkles and particles.
- The SKILL.md category list names "logo reveals", along with product and feature videos, launch videos, promos, kinetic typography and social clips.
- The README and SKILL.md document no `framework`, `model` or `motion_type` fields, no MCP server, no MCP URL and no tool names.
- The README credits Cinetic, motion-video-kit, HyperFrames and product-launch-motion.

### Observed in WebSearch summaries only (oneshotted.io unresolvable here)

- Homepage title: "Oneshotted - AI-coded motion graphics and the prompts behind them". Tagline: a free directory of motion graphics built by coding agents in Remotion, GSAP, Three.js and more.
- The homepage lists a "Logo reveal" category beside Kinetic type, Product launch, Data viz and 3D scene.
- Filter URLs seen in results: `/?framework=threejs&motion_type=3d-scene&page=1` and `/?motion_type=data-viz&page=1`. Piece pages are `/v/<slug>` with the title format "<name> - prompt & recipe". Creator pages are `/c/<handle>` ("<name> (@handle): AI motion pieces and prompts").
- Counts seen in different snapshots: 3,778 prompts, 3,382 creators, 5,579 recipes.
- Piece pages show framework (for example GSAP, Three.js, Remotion) and model (for example "Opus 5.5", "Other"), plus engagement stats.
- Where a creator did not supply a prompt, the site rebuilds one from video frames with an open-weight vision model and labels it "our reconstruction... not the creator's words".
- A site-wide banner reads "Oneshotted MCP: give Claude Code, Cursor or Codex this whole library, prompts included", with a free key.
- Nav item "MCP Registry" ("Integrate external tools") appears in the GitHub page chrome of the skill repo.
- Entry titles seen: "We deleted After Effects, fired our motion designer, and tattooed 'Opus 5.5 4eve...'", "Remixed UI Morph Showreel" (GSAP, Opus 5.5), "Site-Based Promo Video by Opus 5.5", "Product demo video with a /brag skill", "Remotion Video Canvas Editor". None is a logo reveal.

### Not verifiable

- The MCP server URL and tool names. Only the `/mcp-docs` page is named, and I could not open it.
- Any MCP registry or Product Hunt listing, and any X/Twitter posts about Oneshotted. Searches for these returned nothing relevant.
- Whether any specific "Logo reveal" piece exists. Only the category label was seen.
- Who operates the site.

Inference: `library.py` and the MCP appear to wrap the same library API (prompt, frames and similar-piece lookup). I have no evidence for endpoint names.

---

## B. Platforms: how to research there

Full machine-readable detail is in `research-sources.json`. All fetch results below are from this environment.

| Platform | Fetch result | How to search | Signal |
|---|---|---|---|
| Behance | `ENOTFOUND` (www.behance.net, behance.net) | `/search/projects/logo%20animation`, also `logoanimation`, `2d logo animation`, `logo animation intro`; `/hire/services/logo-animation`; `/tags/animation`. WebSearch with `allowed_domains=["behance.net"]` returned indexed pages. | Medium. Many freelance service listings and AE templates. Case studies need manual curation. |
| Dribbble tag `logo-animations` | `ENOTFOUND` | `/tags/logo-animations` (200+ shots per summary), `/search/logo-animation`, user collections `/<user>/collections/<id>-Logo-Animations`. | Medium for aesthetics, low for process. |
| Vimeo channel 1807430 | `ENOTFOUND`. WebSearch found no page mentioning that ID. | Unverified. Other logo channels seen: `/channels/74752` (Logo Animations, ~31 videos, with breakdowns), `/channels/logo` (~55), `/channels/logomotion`, `/groups/63495`. | Unknown for 1807430. |
| Motionographer | `ENOTFOUND` | WebSearch with `allowed_domains=["motionographer.com"]` works well. Tag pages `/tag/logo-animation/`, `/tag/logo/`, `/tag/typography/`. | High for craft and rationale, low volume. |
| School of Motion | `ENOTFOUND` | WebSearch with `allowed_domains=["schoolofmotion.com"]`. Blog at `/blog`. | Medium-high for technique. No dedicated logo-principles article found. |
| LottieFiles | `ENOTFOUND` | Hub `/free-animations/logo-reveal`, individual pages `/<id>-<slug>`. Check licence per file. | Medium. Templated reveals, mixed licences. |
| GitHub | OK | `github.com/search?q=...&type=repositories` worked (then 429), `/topics/logo-animation`, raw SKILL.md files. | High and verifiable. |

The task note said Behance and LottieFiles were curl-blocked but might work through WebFetch. They did not: both were DNS failures through WebFetch.

---

## C. Claude / Claude Code motion work and tooling (24 items)

Verification column: F = fetched page (GitHub or raw), S = search snippet only.

### verified-claude (5)

| id | What | Evidence | V |
|---|---|---|---|
| ref-remotion-prompt-3d-svg-logo | Remotion prompt gallery "Spinning, glitching SVG Logo turned 3D" | Gallery lists Claude Code, Opus 4.5. Prompt starts "use remotion best practices. create a new composition with the following SVG in 3D." Metallic material, rotation clamped -90..90. First transparent export failed; user pointed to Remotion transparent-video docs. | S |
| ref-remotion-prompt-launch-video-x | "Launch Video on X" prompt, ~37 s, 1080x700, ASCII logo inside a Mac terminal scene | Gallery lists Claude Code, Opus 4.6 (submitter @ghumare64). | S |
| ref-claudelog-vibe-animating | ClaudeLog "Vibe Animating" | Author splits the ClaudeLog "C" logo into 8 named SVG parts (1 base + 7 accents). Claude animates them in numbered order with CSS. Author reports 20+ viable animations. | S |
| ref-yellowraincoat-remotion-logo | "Animate your Logo with Remotion and Claude Code" (Feb 2026) | SVG in `public/`, prompt Claude with the Remotion best-practices skill, name logo parts, render from Studio. Mismatch fix: describe it to Claude and re-render. | S |
| ref-sergei-chyrkov-opus-motion | "Claude Opus Motion with Remotion + Three.js" | Author claims a ~30 s app teaser in ~5 min with Claude Code and Remotion. Not logo-specific. | S |

### claude-compatible (19)

| id | What | Key facts | V |
|---|---|---|---|
| ref-oneshotted-skill | oneshotted skill | See section A. | F |
| ref-oneshotted-gallery | oneshotted.io gallery | See section A. | S |
| ref-remotion-skills | remotion-dev/skills | ~5.0k stars. 12 skills including remotion-best-practices and remotion-markup (animations, timing, typography). `npx skills add remotion-dev/skills`. | F |
| ref-hyperframes | heygen-com/hyperframes | Apache-2.0, ~60.3k stars, Claude Code plugin, 21 skills. `/motion-graphics` has a logo-reveal category (logo-outro block, SVG path-draw rules). | F |
| ref-iart-motion-design-skills | iart-ai/motion-design-skills | MIT, 106 stars. Logo-animation SKILL.md: one technique per logo, reveals 0.8-2.5 s, easing recipes, reduced-motion fallback, freeze harness. | F |
| ref-wiggle-claude-skill | talknerdytome-labs/wiggle-claude-skill | 26 stars. Logo to Lottie, GIF and MP4. Verbatim prompt "Animate my logo with a bounce entrance effect". README claims "Created for use with Claude Code by Anthropic"; unconfirmed. | F |
| ref-pixel2motion | nolangz/pixel2motion | MIT, 2.4k stars. Codex and Claude skill: raster to semantic SVG to CSS choreography to frame-capture QA. Documents several failure modes. | F |
| ref-animated-logo-skill | karlostoteles/animated-logo-skill | MIT, v0.1.0. 10 per-letter physics patterns with concrete timings. | F |
| ref-logo-3d-skill | marcogalluccio/logo-3d | MIT, macOS-only. Blender extrusion, WebGPU, pieces lock together, 1% front-view check. | F |
| ref-logo-intro-webgl | CJ10110425/logo-intro | MIT, 4 stars. Single GLSL fragment shader, about 5 s, frame equals pure function of time. | F |
| ref-diffusionstudio-lottie | diffusionstudio/lottie | MIT, 5.6k stars. "Generate production-ready Lottie animations with Claude Code or Codex". | F |
| ref-notedit-gsap-animation | notedit/happy-skills | MIT, 339 stars. gsap-animation skill; SKILL.md not read. | F (repo page) |
| ref-logo-designer-skill | neonwatty/logo-designer-skill | MIT, 147 stars. Static SVG logo design (upstream of animation). | F |
| ref-remotion-claude-video-starter | JJenglert1/remotion-claude-video | 49 stars. README prompt: "Using the Remotion skill, create a 10-second intro video with animated text that says "Hello World" with a gradient background." | F |
| ref-create-promo-video | alentodorov/create-promo-video | Archived 2026-04-01. Prompt: "hei claude let's make  a promo video for this project". | F |
| ref-anthropic-slack-gif-creator | anthropics/skills slack-gif-creator | Official Anthropic skill; named easings (ease_out, back_out, bounce_out, elastic_out), fps 10-30, emoji GIF under 3 s. | F |
| ref-claude-design-handoff | Anthropic "Claude Design" | Handoff bundle to Claude Code. Video export not confirmed. | S |
| ref-mindstudio-remotion-logo-reveals | MindStudio tutorial | 5 s particle logo reveal prompt sketch. A similar Apidog (pt/vi) tutorial with a 5 s logo intro prompt (fade in, bounce scale, tagline) was seen but not tracked as its own item. | S |
| ref-0xmovez-opus-motion-course | @0xMovez X article | Harness-over-prompt workflow (render contract, closed-form springs, beat grid, contact-sheet critique). Promotional; body unread. | S |

Of the five verified-claude items, none yielded a downloadable source repo for the logo itself. Source access exists only for Remotion prompt pages (SVG included on the page, per summary) and the skills above.

### Documented failures and corrections (observed)

- Remotion 3D SVG logo prompt: first transparent-video export did not work; corrected by pointing Claude at Remotion's transparent-videos docs (S).
- Yellow Raincoat: preview and exported render can differ; fix is to describe the mismatch to Claude and re-render (S).
- pixel2motion SKILL.md (F): stair-stepped trace passes high IoU but fails visually; `var()` inside `@keyframes` silently falls back to linear easing; round-cap stall and pop on draw-on; lockstep motion; mid-flight clipping by the viewBox; wall-clock screenshots are not valid QA.
- logo-3d README (F): Python 3.14 crashes the PNG tracer; logos with hairlines, gradients or many pieces are refused.
- Mejba Ahmed posts (S): first draft is rarely perfect, about 80% done; sandboxed environments can block Remotion's server.
- CVPR 2026 OmniLottie supplement (S): LLMs generating raw Lottie JSON fail via invented attribute names and misplaced attributes. This is not Claude-specific.
- Remotion docs advice (S, via search): without Remotion skills installed, generated code can be buggy.

---

## D. Professional inspiration (9 items)

All via search snippet only (sites not fetchable). Principles below are what the snippets said, plus my labelled inference.

1. Imaginary Forces, Thunderbolts* Marvel Studios logo reveal (Motionographer). Comic panels are projected onto a drifting 3D wordmark and the logo never fully resolves, dissolving to black. Sound is layered over the fanfare. Principle: a withheld resolution can carry story (inference: it inverts the usual "end on a clean lockup" rule).
2. Superexpresso, BAR SUPER BCN (Motionographer). A grid is derived from the logo's proportions and drives slot-machine scrolling between hand-drawn variants; "programmed spontaneity". Principle: build motion from the logo's own geometry.
3. School of Motion, Six Essential Motion Design Transitions. Morph is "particularly prevalent in logo animations"; match cut hides a hard cut by cutting on fastest movement.
4. School of Motion, Show-Stopping Sports MoGraph. Shape and scale contrast reveals team logos; design the end frame first and animate backward.
5. Motion Design School, animation principles in logo animation (a different organisation from School of Motion). Easing, arcs, squash and stretch, secondary motion. Its rough duration bands (0.3-0.8 s, 1-2 s, 2-4 s) came from a skill file and are a rule of thumb only.
6. Politecnico di Milano thesis on motion identity. Method for turning a static logo into animation, applied to The North Face and TelligWeb. Not examined beyond the summary.
7. Motionographer, Design For Motion Revisited (Austin Shaw Q&A). Design for sound-off; typography matters on social.
8. Vimeo "Logo Animations" channel (spinmylogo, `/channels/74752`). Entries with technical breakdowns. Mining source, unverified counts.
9. Motionographer, Animade Rebrand 2020. Circles tell a small story that resolves onto the logo. Thin evidence.

Transferable principles pulled together from the fetched skill sources (rules of thumb by their authors, not standards): anticipation/action/follow-through split of 20/50/30, stagger parts 10-20%, splash reveals 1.2-2.0 s and header reveals 0.3-0.8 s (pixel2motion), reveals 0.8-2.5 s with one technique per logo (iart-ai), final frame must equal the verified static logo, respect `prefers-reduced-motion`.

---

## Blocked / unverifiable

- oneshotted.io (all pages), www.oneshotted.io: DNS `ENOTFOUND`. MCP server URL, tool names, registry listing, X and Product Hunt presence: not found.
- behance.net, lottiefiles.com: DNS `ENOTFOUND` through WebFetch (not just curl).
- dribbble.com, vimeo.com, motionographer.com, schoolofmotion.com, remotion.dev, claudelog.com, mindstudio.ai, aiidelist.com, yellowraincoat.co.uk, sergeichyrkov.com, x.com: not fetchable. Contents known only via search summaries, which sometimes conflict (for example whether the Remotion 3D logo prompt text mentions spinning or glitch).
- Vimeo channel 1807430: identity not established.
- `github.com/lanzhu1993/_Logo_-Animations-Skills` (seen in a GitHub search result): fetch returned 404; excluded.
- raw SKILL.md for the oneshotted repo at an initial guessed path returned 404; the correct path was `skills/oneshotted/SKILL.md`.
- Claims by aggregators about "Opus 5.5" and other model names were not corroborated by an Anthropic source and are carried as "per author".
- No School of Motion article specifically on logo animation principles was found; item 3 and 4 are adjacent tutorials.
- Star counts differ across snapshots (pixel2motion reported 1.0k-2.4k).
- Vimeo, Behance and Dribbble results are portfolios; I did not verify any specific creator's work by viewing it.

## Counts

33 references in `research-web.json`: verified-claude 5, claude-compatible 19, professional-inspiration 9. Platforms in `research-sources.json`: 11.
