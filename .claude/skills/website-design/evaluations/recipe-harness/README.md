# Recipe harness

Executable test page for every recipe in `references/motion-recipes.md` (R1–R13). The code in `src/` is the recipe code verbatim, plus two test hooks: `window.__r` records R4 `setActive` calls, and `?rtl` sets the R5 gallery to `dir="rtl"`.

```bash
cd .claude/skills/website-design/evaluations/recipe-harness
npm install
npm run dev &            # http://localhost:5190
node test-recipes.mjs .  # 33 PASS/FAIL checks in normal, reduced-motion and RTL modes
```

Run it after upgrading GSAP, Motion, Lenis, three or R3F, and update the versions in `references/technical-documentation.md`. Last result: see `../results.md` → "Recipe test".

What it does **not** cover: the Next.js-specific wrappers in R6/R11 (`next/dynamic` with `ssr: false`, server/client boundaries) — those need a Next.js project; browsers other than Chromium.
