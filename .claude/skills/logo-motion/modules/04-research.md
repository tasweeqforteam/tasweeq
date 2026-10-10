# 04 · Inspiration Research Engine

**Purpose:** find and analyse real professional and Claude-made logo animations to inform (not dictate) concepts.
**Output:** a short reference table (in `concepts.md` or a Mode A answer) and new verified entries added to the library.
**Done when:** each cited reference has a real URL you actually reached (or is labelled snippet-only), a stated relevance, and an extracted principle.

## 0. Check access first (environments differ)
```bash
node oneshotted.mjs status                 # key + reachability of the Oneshotted MCP endpoint
curl -sS -o /dev/null -w "%{http_code}" https://www.behance.net/   # etc. — or try WebFetch
```
Status recorded on 2026-10-10 in the build environment (`library/sources.json`): **only GitHub (github.com, raw.githubusercontent.com) was reachable** through WebFetch/git; oneshotted.io, behance.net, dribbble.com, vimeo.com, motionographer.com, schoolofmotion.com, lottiefiles.com and remotion.dev failed DNS/proxy. WebSearch worked (US results, snippets only). Re-check in every new environment — do not assume.

## 1. Library first
`node refs.mjs search "<opportunity words>" [--technique …] [--attribution verified-claude]` → if ≥ 2 relevant, well-evidenced hits, stop researching.

## 2. Sources and how to use them
| source | best for | how to search |
|---|---|---|
| **Oneshotted** (oneshotted.io, MCP) | agent-made motion with creator prompts, model/framework metadata; has a *Logo reveal* category | `node oneshotted.mjs search "logo reveal <mechanism>" --framework gsap`; `recipe <id>`; `frames <id>`. Only *creator-verified full* prompts may be adapted (credit @creator + URL). Needs `ONESHOTTED_API_KEY` (from oneshotted.io/mcp-docs) or a sign-in via the creator's skill (github.com/Codesaz-Company/oneshotted-skill). Never ask for a key in chat. |
| Behance | full branding + motion case studies, rationale | behance.net/search/projects/logo%20animation; filter by "Motion", look for "case study", "identity system" |
| Dribbble | short reveals, construction ideas, micro-loops | dribbble.com/tags/logo-animations, /tags/logo_reveal; note: GIF previews, little rationale |
| Vimeo | full-length idents with sound; timing study | channels (e.g. /channels/1807430 as given; also /channels/74752 seen in search), search "logo ident", "logo sting" |
| Motionographer | studio-level art direction, case studies | site search "logo reveal", "rebrand", "ident" |
| School of Motion | principles, technique tutorials (timing, transitions) | blog: transitions, morph/match cut, logo animation tutorials |
| LottieFiles | vector micro-animations, loops, Lottie-safe techniques | search "logo", filter animations; check licences |
| GitHub | Claude skills, source code, prompts, failure notes | topics `claude-skill motion`, "logo animation skill", "remotion logo", "gsap logo svg" |
| WebSearch | discovery when sites are unreachable | quote exact titles; mark results "search snippet only" |

## 3. What to capture per reference
Use the library schema (06). Minimum: title, creator, direct URL, attribution class (05), verification status + method, techniques, reveal mechanism, framework, observations tagged observed/inferred, transferable principles, weaknesses, licence, date verified.

## 4. Rules
- Never invent URLs, creators, prompts, or implementation claims. If you could not open it, say "search snippet only".
- Don't claim to have watched a video or read code you couldn't access.
- Research serves the decision: stop when you can justify the direction.
- Browsing does not "train" the model; value persists only through `references.json`, `lessons.md` and project records.
