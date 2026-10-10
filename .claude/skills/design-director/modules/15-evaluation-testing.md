# 15 · Evaluation & Regression Testing

The skill is tested by building real designs through its own workflow and
measuring them. Briefs live in `tests/briefs/briefs.md`, built cases in
`tests/cases/<id>/` (`index.html` + `copy.json` + `NOTES.md`), and outputs in
`tests/results/`.

## Run

```bash
bash .claude/skills/design-director/scripts/selftest.sh      # structure + tool unit checks + all cases
```

`selftest.sh` checks:
1. **Loadability**: SKILL.md front matter (`name`, `description`), and that every module/script/template the entrypoint references exists.
2. **Tool unit checks**: `grid.py` (safe-area snapping up), `library.py validate`, `glyph_coverage.py` on the repo fonts, and `qa.mjs` against `tests/fixtures/defects.html`, which must detect each planted defect (a detector that silently passes is worse than none).
3. **Cases A–F**: render (PNG + grid overlay) and `qa.mjs --json` for each case. Results go to `tests/results/<id>/`, and the summary to `tests/results/SUMMARY.md`.

## Test matrix

| ID | Case | Primary requirements checked |
|---|---|---|
| A | Arabic advertising poster | RTL hierarchy, Arabic display + text faces render without fallback, focal point, controlled negative space, exact copy |
| B | English editorial brochure spread | multi-column + baseline grid, headline/body hierarchy, captions tied to images, margins, readable body, rhythm |
| C | AI-assisted product campaign (3 placements) | campaign consistency, product fidelity across variations, typeset copy, honest image sourcing |
| D | Bilingual social campaign (feed + story) | AR/EN parity, bidi isolation, safe zones, shared system |
| E | Brand identity presentation (5 slides) | narrative, layout variety on one grid, no fabricated results |
| F | Dense information layout | grid choice for density, grouping, readable small text, hierarchy |

## Scoring each case

For each case, record in `NOTES.md`: the research used (with library IDs and
their status), concept, layout spec, type plan, image plan, the `qa.mjs`
verdict, the rubric score (module 13) **with the reviewer named** (self-review
by the skill is labelled as such), and failures found plus fixes made.

## Regression rule

When a defect escapes (found by a user or in review), add it as a planted
defect to `tests/fixtures/defects.html` with its expected check id in
`tests/fixtures/defects.expect`, fix the skill or tool, and re-run. Automated
checks support judgement. They do not replace the module 13 critique.
