# website-design — Claude Code Skill

An operational skill for designing and building original, production-quality websites: research → art direction → implementation → browser-verified QA → refinement → honest delivery report.

It is a **research and instruction system** plus tooling (a Playwright QA script and tested motion recipes). It does not train or fine-tune any model.

## What's inside

```
website-design/
├── SKILL.md                    entry point: when to use, task sizing, workflow, gates, which file to load
├── README.md                   this file
├── rules/                      design & engineering rules (loaded on demand)
│   ├── art-direction.md        concept, tokens, generic tells & alternatives
│   ├── layout-and-grids.md     grids, rhythm, breaking the grid
│   ├── typography.md           choosing, scaling, setting, loading type
│   ├── rtl-arabic.md           Arabic typography, RTL, bilingual EN/AR
│   ├── responsive-design.md    viewports, fluid sizing, mobile composition
│   ├── ui-ux.md                IA, persuasion structure, forms, states, dashboards
│   ├── animation.md            motion budget, analysis table, tech decision tree, reduced motion
│   ├── accessibility.md        WCAG 2.2 AA checklist + testing
│   ├── performance.md          CWV targets, hero rules, JS/3D budgets
│   └── code-quality.md         conventions, tokens, components, dependencies
├── workflows/                  research, design-planning, implementation, browser-testing, design-review
├── templates/                  project-brief, design-direction, reference-analysis, quality-report
├── references/                 reference library with verification status + tested motion recipes
├── scripts/
│   ├── visual-qa.mjs           Playwright screenshots + automated checks (see below)
│   └── check-skill.mjs         validates this skill's structure and links
└── evaluations/                test projects, acceptance criteria/scorecard, results, recipe harness
```

## Installation

- **This repository:** already installed as a project skill at `.claude/skills/website-design/`. Claude Code discovers it automatically in this repo.
- **Personal (all projects):** copy the folder to `~/.claude/skills/website-design/`.
- **Other agents:** `SKILL.md` is plain Markdown with YAML frontmatter (`name`, `description`). Agents without native skills can be told: "Read `.claude/skills/website-design/SKILL.md` and follow it for website/UI work."

Validate after copying or editing:

```bash
node .claude/skills/website-design/scripts/check-skill.mjs
```

## Invocation

- **Automatic:** Claude Code loads the skill when a request matches its description (designing/building/redesigning/critiquing websites, landing pages, dashboards, product/e-commerce pages; web animation; Arabic/RTL sites; "make it less generic").
- **Explicit:** type `/website-design <request>` or say "use the website-design skill".
- Works alongside Anthropic's official `frontend-design` plugin (whose principles it cites and extends with research, motion engineering, RTL, QA tooling and scoring).

## Tools it uses (and what happens without them)

| Capability | Used for | Without it |
|---|---|---|
| Playwright + Chromium | screenshots at 390/768/1440, overflow/console/focus/axe checks, interaction scripts | the skill reports visual verification as **not done** and lists checks for the user |
| `@axe-core/playwright` (optional) | automated accessibility scan (`--axe`) | manual a11y checklist only |
| Web search / fetch | finding and inspecting references | curated reference library only; no `OBSERVED` claims |
| `git clone` of public repos, `npm view`/`npm pack` | reading real implementations and verifying library APIs | implementation claims limited to `INFERRED` |
| Browser MCPs (Chrome DevTools, Claude in Chrome) | interactive inspection | optional |

### visual-qa.mjs

```bash
node .claude/skills/website-design/scripts/visual-qa.mjs --url http://localhost:3000 \
  --paths /,/work/sakan --widths 390,768,1440 --full --reduced [--axe] [--ignore "googletagmanager"] --out ./qa-output
```

Resolves Playwright from the current project or the global npm root. Pass `--chromium <path>` if the bundled browser doesn't match the Playwright version. Outputs screenshots plus `report.md` / `report.json`.

## Evidence model

Every claim about references or results is labelled `VERIFIED` (code/docs/tool output), `OBSERVED` (seen rendered), `INFERRED`, or `UNKNOWN`. The skill forbids claiming to have opened, run or seen anything it didn't.

## Limitations

- **Reference access depends on the environment.** In the environment where this skill was built (2026-10-10), the design galleries (Awwwards, SiteInspire, Recent, CSSDA, Codrops, Mobbin, Refero, 60fps, Design Spells, Three.js Resources) and documentation sites were blocked by egress policy; their entries are marked `CORROBORATED`/`UNVERIFIED` from search results. GitHub repositories and npm packages were inspected directly.
- **No image generation built in.** Art direction for imagery is covered; producing images depends on available tools/assets.
- **Automated QA is a floor.** It catches overflow, errors, missing labels, stuck animations, focus visibility and axe issues — not taste. Screenshots must still be reviewed.
- **Single-engine testing.** The QA script uses Chromium; Safari/Firefox and real devices need separate checks.
- **Scores are judgments** anchored to evidence; they are not objective measurements.

## Maintenance

- Re-verify `references/reference-directory.md` statuses and `references/technical-documentation.md` versions periodically (record dates).
- Add references only with a defined purpose; retire dead or low-value ones (log in `evaluations/results.md`).
- Change rules only when evidence (an evaluation run, a bug, a verified API change) shows a better approach; re-run the affected test projects.
- Re-run the recipe harness after upgrading GSAP/Motion/Lenis/R3F: see `evaluations/recipe-harness/README.md`.
