# Reference Directory

Master index of sources. Category files hold the detail. **Status was checked on 2026-10-10** from a sandboxed cloud environment whose egress policy blocked most design-gallery domains; "blocked here" means *we* could not reach it, not that the site is down. Re-check status in your own environment before relying on a source.

Status legend:
- `VERIFIED-LIVE` — fetched successfully (HTTP 200) during inspection.
- `VERIFIED-SOURCE` — repository cloned and read.
- `CORROBORATED` — not reachable here, but independent search results (2026) describe it as active; content claims are secondary.
- `UNVERIFIED` — not reachable and no reliable corroboration found.

## A. Premium website design & art direction → `premium-website-design.md`

| # | Source | URL | Status (2026-10-10) | Purpose |
|---|---|---|---|---|
| 1 | Awwwards | https://www.awwwards.com/ | blocked here · CORROBORATED (search results include current listing pages; SOTY 2025 badge on "Messenger" by abeto) | juried awards; filter by tech/category; site of the day/year; full-page studies |
| 2 | Awwwards — Animation | https://www.awwwards.com/websites/animations/ | blocked here · CORROBORATED (category listings indexed) | award sites tagged for animation |
| 3 | SiteInspire | https://www.siteinspire.com/ | blocked here · CORROBORATED (2026 roundups describe it as a long-running, well-filtered gallery; one result references a `siteinspire.net` domain — check which is canonical) | curated, filterable by style/type/subject; calmer, editorial/commercial work |
| 4 | Recent (formerly Godly) | https://recent.design/ | blocked here · CORROBORATED (described as the rebranded Godly; daily updates, weekly newsletter) | bold/experimental web design, with links to the live sites |
| 5 | CSS Design Awards | https://www.cssdesignawards.com/ | blocked here · CORROBORATED (WOTD program referenced in 2026 roundups and agency announcements) | juried awards, UI/UX/innovation scores |

## B. AI-built websites & coding-agent experiments → `ai-built-websites.md`

| # | Source | URL | Status | Purpose |
|---|---|---|---|---|
| 6 | Anthropic frontend-design plugin page | https://claude.com/plugins/frontend-design | VERIFIED-LIVE (200 → `/marketplace/plugins/frontend-design`) | official plugin listing |
| 7 | Anthropic frontend-design source | https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design | VERIFIED-SOURCE (commit 2301018, 2026-10-09; plugin v1.1.0) | official skill text: anti-generic calibration, plan→critique→build |
| 8 | Fable 5 Frontend Design Showcase | https://github.com/az9713/fable-5-frontend-design | VERIFIED-SOURCE (472c988, 2026-07-09); live Netlify demos UNVERIFIED here | 5 concept-driven single-file sites + per-site build guides |
| 9 | Fable 5 React + 3D showcase | https://github.com/codewithmuh/fable5-websites | VERIFIED-SOURCE (ad521d9, 2026-06-14) | R3F overlays; cautionary example (template prompt, hotlinked Pinterest images) |
| 10 | FABLE-SHOWCASE | https://github.com/elder-plinius/FABLE-SHOWCASE | VERIFIED-SOURCE (b340cce, 2026-07-07) | 57 generative/simulation demos from agent fleets |
| 11 | Anti-slop website prompts | https://github.com/mah-claude/anti-slop-website-prompts | VERIFIED-SOURCE (bfce6e5, 2026-08-03), MIT | specificity checklist + 15 build-prompts |
| 12 | Claude Code frontend design toolkit | https://github.com/acumenix/claude-code-frontend-design-toolkit | VERIFIED-SOURCE (2a6d095, 2026-04-11) | curated index of skills/MCPs/tools (April 2026) |
| 13 | Frontend design skill w/ visual feedback | https://github.com/wenkang-deepblue/frontend-design | VERIFIED-SOURCE (17bb943, 2026-07-03), MIT | human-in-the-loop HTML preview with token knobs + comment export |

## C. Production websites & framework examples → `open-source-projects.md`, `technical-documentation.md`

| # | Source | URL | Status | Purpose |
|---|---|---|---|---|
| 14 | Next.js Showcase | https://nextjs.org/showcase | blocked here · UNVERIFIED this session (long-standing official page) | production sites built with Next.js; note: source rarely public |
| 15 | GitHub topic: nextjs | https://github.com/topics/nextjs | GitHub web blocked here (403); git reads work · UNVERIFIED | discover inspectable Next.js projects (filter by stars/recent) |
| 16 | Codrops | https://tympanus.net/codrops/ | blocked here · CORROBORATED (official GitHub template repo `codrops/CodropsTemplate`, MIT) | tutorials with source for creative effects |
| 17 | Codrops demos | https://tympanus.net/codrops/demos/ | blocked here · CORROBORATED (as above) | demo index; each demo usually links a GitHub repo |
| 18 | Three.js Resources — R3F showcase | https://threejsresources.com/showcase/technologies/react-three-fiber | blocked here · UNVERIFIED (no search corroboration found) | R3F site showcase; use official R3F examples as fallback (below) |

## D. UI/UX patterns → `ui-ux-patterns.md`

| # | Source | URL | Status | Purpose |
|---|---|---|---|---|
| 19 | Mobbin | https://mobbin.com/ | blocked here · CORROBORATED (2026 pricing pages; freemium, paid tiers) | real app/web screens and flows; needs account |
| 20 | Refero | https://refero.design/ | blocked here · CORROBORATED (freemium; reportedly offers MCP access on paid plan — verify) | searchable web/app UI references and flows |

## E. Motion & micro-interactions → `animation-references.md`

| # | Source | URL | Status | Purpose |
|---|---|---|---|---|
| 21 | 60fps | https://60fps.design/ | blocked here · CORROBORATED (curated library of UI animation videos from iOS/web/Watch apps, tagged by interaction) | micro-interaction and transition study |
| 22 | Design Spells | https://www.designspells.com/ | blocked here · CORROBORATED (catalog + newsletter of micro-interactions/easter eggs) | delightful details; extract the principle |

## F. Additional sources (discovered; purpose-driven)

| Source | URL | Status | Why it's here |
|---|---|---|---|
| GSAP (npm package + repo) | https://github.com/greensock/GSAP · `npm view gsap` | VERIFIED-SOURCE (gsap@3.15.0 README/types; repo reachable via git) | authoritative API types; all plugins free incl. SplitText |
| Motion (React/JS) | https://github.com/motiondivision/motion · `motion` on npm | VERIFIED-SOURCE (motion@14.1.0 types: `useScroll`, `useInView`, `useReducedMotion`, `MotionConfig reducedMotion`) | React animation API reference |
| Lenis | https://github.com/darkroomengineering/lenis | VERIFIED-SOURCE (lenis@1.3.26 types: `autoRaf`, `syncTouch` default false, `anchors`, `prevent`) | smooth scroll used in this repo |
| React Three Fiber / drei | https://github.com/pmndrs/react-three-fiber · https://github.com/pmndrs/drei | repos reachable via git (2026-10-10) | official examples (replacement for #18) |
| three.js | https://github.com/mrdoob/three.js | reachable via git | examples folder = canonical technique library |
| WAI-ARIA Authoring Practices | https://github.com/w3c/aria-practices | reachable via git | accessible widget patterns (tabs, menus, carousels, sliders) |
| shadcn/ui · Radix Primitives | https://github.com/shadcn-ui/ui · https://github.com/radix-ui/primitives | reachable via git | accessible, inspectable component implementations |
| Next.js repo examples | https://github.com/vercel/next.js/tree/canary/examples | reachable via git | framework-correct patterns |
| Codrops template | https://github.com/codrops/CodropsTemplate | CORROBORATED (search) | Codrops demo structure, MIT |
| Awesome Creative Coding | https://github.com/terkelg/awesome-creative-coding | reachable via git | index of creative-coding techniques and libraries |

## How to add or retire a source

1. Add it only with a stated purpose (what question does it answer better than existing sources?).
2. Record URL, category, date checked, status, licence/usage limits.
3. Retire sources that are dead, paywalled beyond use, or consistently low-value; note the date and reason in `evaluations/results.md` changelog.
