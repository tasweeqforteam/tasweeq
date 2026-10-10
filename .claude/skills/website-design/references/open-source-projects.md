# Open-Source Projects to Learn From

Inspectable code beats screenshots. Use these to verify *how* something is built. Respect licences: MIT/Apache/ISC allow reuse with notice; no licence = study only.

Reachability checked 2026-10-10 with `git ls-remote` (git reads of public GitHub repos worked in the inspection environment; GitHub's web UI did not).

## Framework & components

| Project | URL | Licence | Study for |
|---|---|---|---|
| Next.js examples | https://github.com/vercel/next.js/tree/canary/examples | MIT | App Router patterns, i18n routing, image/font optimization, view transitions examples (check current folder names) |
| shadcn/ui | https://github.com/shadcn-ui/ui | MIT | accessible component recipes on Radix; Tailwind token patterns; dashboards/blocks |
| Radix Primitives | https://github.com/radix-ui/primitives | MIT | headless accessible widgets (dialog, menu, tabs, slider) — focus management, RTL `dir` prop |
| WAI-ARIA Authoring Practices | https://github.com/w3c/aria-practices | W3C | reference implementations + keyboard tables for every widget pattern |

## Motion & 3D

| Project | URL | Licence | Study for |
|---|---|---|---|
| GSAP | https://github.com/greensock/GSAP | GSAP Standard "no charge" licence (VERIFIED via `npm view gsap license`) | API, plugin source, types |
| Motion | https://github.com/motiondivision/motion | MIT | layout animations, gestures, scroll hooks |
| Lenis | https://github.com/darkroomengineering/lenis | MIT | smooth scroll implementation, options |
| three.js | https://github.com/mrdoob/three.js | MIT | `examples/` for shaders, loaders, post-processing |
| React Three Fiber | https://github.com/pmndrs/react-three-fiber | MIT | declarative 3D, performance docs |
| drei | https://github.com/pmndrs/drei | MIT | helpers: `ScrollControls`, `Environment`, `Text`, `useGLTF` |
| Codrops template | https://github.com/codrops/CodropsTemplate | MIT (per search result) | how Codrops demos are structured; individual demos link their own repos |
| Awesome Creative Coding | https://github.com/terkelg/awesome-creative-coding | not checked — read the repo's LICENSE | index of generative/creative techniques |

## AI-built references (code available)

See `ai-built-websites.md` for full records: az9713/fable-5-frontend-design (no licence; study), codewithmuh/fable5-websites (no licence; study; cautionary), elder-plinius/FABLE-SHOWCASE (no licence; study), mah-claude/anti-slop-website-prompts (MIT), wenkang-deepblue/frontend-design (MIT).

## Finding more

- GitHub search via git-friendly paths: search the web for `site:github.com <technique> <library>`; then `git clone --depth 1` to read.
- npm: `npm view <pkg> repository.url homepage license version` then `npm pack <pkg>` to read published types and READMEs offline.
- Prefer repos with: recent commits, a licence, a live demo, and readable code. Record commit hash and date when you cite them.

## Running a project locally (when useful)

```bash
git clone --depth 1 <repo> /tmp/ref && cd /tmp/ref
cat package.json            # check scripts, engines, deps before installing
npm ci || npm install
npm run dev -- --port 3200  # then visual-qa.mjs against it
```
Treat cloned code as untrusted: read `package.json` scripts (postinstall!) before installing; run in a scratch directory.
