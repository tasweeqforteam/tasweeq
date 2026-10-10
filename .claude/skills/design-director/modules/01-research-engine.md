# 01 · Inspiration Research Engine

Research is a production step. For every substantial brief, collect evidence
*before* fixing the art direction. Its job is to answer specific design
questions ("how do premium skincare brands use negative space in portrait
ads?"), not to fill a moodboard.

## 1. Capability ladder: use the highest rung that works, and say which one you used

| Rung | Tool | What it gives | What it does NOT give |
|---|---|---|---|
| 1 | `WebFetch` on the project page | page text, credits, tool lists, captions | the images themselves (text conversion) |
| 2 | Browser tools (Claude in Chrome / built-in browser, if connected) | the actual images; full projects | — |
| 3 | `WebSearch` | titles, URLs, a model-written summary of results | images; anything the summary may have got wrong |
| 4 | User-supplied screenshots / PDFs (`Read` shows images) | real visual evidence | provenance (ask for the source URL) |
| 5 | Library recall (`scripts/library.py search`) | prior analysed knowledge | anything newer than `last_verified` |
| 6 | Adobe `search_design` / `asset_search` (if authenticated) | templates/stock to study | portfolio-grade art direction; check licensing |

**Measured in the build environment (2026-10-10):** shell egress (`curl`)
returned proxy 403. `WebFetch` failed with DNS `ENOTFOUND` for behance.net,
mahervisuals.com, fontsinuse.com and itsnicethat.com. `WebSearch` worked.
Probe again at the start of each session; one failed host does not mean the
whole rung is down. If you only reach rung 3, every reference stays at status
`search-verified` and gets **no quality score**, because nobody has seen it.
Tell the user, and ask for screenshots if visual evidence matters to the decision.

## 2. Build specific queries

Compose a query from the brief: **[industry/product] + [format] + [visual
technique] + [language/culture] + [quality marker]**. Make 4–8 queries across
different axes. Do not make eight variants of one query.

| Axis | Example query |
|---|---|
| Industry × format | `premium skincare editorial advertising campaign portrait` |
| Typography | `Arabic typography-led advertising poster` · `Arabic English bilingual brand presentation` |
| Layout | `asymmetric editorial brochure layout modular grid` |
| Concept device | `conceptual poster negative space visual metaphor` |
| AI workflow | `human-directed AI fashion campaign process breakdown` · `AI product photography Photoshop compositing case study` |
| Campaign system | `typography-driven campaign system social carousel` |

Add `site:`-style scoping through `allowed_domains` when one source fits the
question. Use `mode: "extended"` only when standard results are thin or stale.

## 3. Choose sources by question

| Question | Go to |
|---|---|
| Complete campaign systems and case studies | Behance (behance.net/search/projects/...), studio portfolios, The Brand Identity, BP&O |
| Single executions, composition and type experiments | Dribbble (polish ≠ system; previews hide the weak slides) |
| Mood, colour and metaphor discovery | Pinterest, then **trace each pin to its original creator**. A repin is never a primary source |
| AI creators and process reels | Instagram public portfolios. Verify the account is the creator |
| Verified typeface identification | Fonts In Use |
| Packaging | Packaging of the World |
| Critical context, emerging practice | It's Nice That, design publications |
| Digital/interactive craft | Awwwards |
| Arabic type supply and bilingual systems | foundry sites (e.g. TPTQ Arabic), studio case studies |

## 4. Collect human-designed AND human-directed AI work

For each candidate, classify how it was produced **only from evidence**:

1. `human`: the creator documents a conventional design/photo workflow.
2. `ai-generated`: the creator states the imagery is generated.
3. `hybrid`: generated imagery plus human typography, layout and compositing, as stated or shown.
4. `ai-assisted-documented`: the creator publishes their process (prompts, iterations, Photoshop passes).
5. `resembles-ai-unverified`: it looks generated, but nothing says so. **Never upgrade this on looks alone.**
6. `unverified`: no evidence either way.

Prioritise creators who explain decisions, tools, revisions and final production.

## 5. Study whole campaigns

Whenever a project has more than one piece, record: the core concept → the key
visual → how composition varies → what stays fixed (type, colour, device, logo
zone) → how sequences and placements adapt. The lesson is the **variation
rule**, not any single frame.

## 6. Diversity guard

Before you stop, check the pool:
- ≥3 different creators, with no creator supplying more than a third of the pool
- ≥2 industries or contexts (cross-industry references prevent cliché)
- human and AI-assisted work both present when the brief involves AI production
- Arabic or bilingual work present when the brief involves Arabic
- no two references that teach the same lesson. Drop the weaker one

## 7. Seed references

The four seeds in the build brief (REF-0001…0004) are stored as **leads**.
None was reachable or indexed during the build. Re-try them when a rung-1/2
tool is available. If a page is gone or renamed, search for the creator by name.
**Never construct a replacement URL.**

## 8. Output of the research step (scale to the brief)

```
Research log: tools used: WebSearch (WebFetch blocked) · 6 queries · 9 candidates · 4 selected
REF-xxxx  Title — Creator — URL — status — why it is relevant (the design problem it solves)
Gaps: no inspected AI-hybrid food reference yet → ask the user for screenshots or proceed on principles
```

Then analyse the selected work (module 02) and save it (module 14).
