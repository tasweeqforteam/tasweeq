# Workflow: Design Review & Refinement

Use after each build pass, and when asked to critique an existing site.

## 1. Gather evidence first

- Screenshots at 390 / 768 / 1440 (and RTL if bilingual) from `browser-testing.md`.
- The automated QA report.
- The design direction (tokens, principles, memorable move).
- If reviewing someone else's site: note what you could and couldn't inspect (evidence labels).

## 2. Review in this order

1. **Gates** (SKILL.md): anything failing is fixed before aesthetics.
2. **Concept fidelity:** does each page express the concept sentence? Which sections feel like they came from a template? (Check against the generic-tells table in `rules/art-direction.md`.)
3. **Hierarchy & composition:** one dominant element per viewport; alignment edges; spacing rhythm; section-to-section contrast.
4. **Typography:** scale steps, line lengths, headline breaks at each width, weight contrast, numerals, Arabic sizing/leading.
5. **Color & material:** accent used for one job; contrast; consistency of surfaces; dark mode parity.
6. **Imagery:** consistent system, crops survive mobile, no stock clichés, no AI artifacts.
7. **Interaction & motion:** purpose of each effect; timing; reduced-motion version; no blocked content; feedback on every action.
8. **UX:** first-5-seconds clarity, CTA visibility, forms and states, navigation clarity.
9. **Code & performance:** console clean, no heavy unused libs, images sized, fonts loaded.

## 3. Write findings as actions

Format each finding so it can be executed:

```
[SEV] where — what's wrong (evidence) → fix
[HIGH] /pricing @390 — plan cards overflow by 24px (report: overflowingElements .plans) → switch to 1-col below 640px
[MED] hero @1440 — headline breaks as "We build / brands that / move" leaving a 1-word line (screenshot) → set max-width 11ch, text-wrap: balance
[LOW] footer — 4 different link colors (screenshot) → use --ink-muted for all, --ink on hover
```

Severity: **HIGH** = gate failure or obvious breakage; **MED** = noticeably weakens quality/score; **LOW** = polish.

## 4. Refinement techniques (what usually moves the score)

- **Cut before adding.** Remove the weakest effect/section/decoration; the rest gains.
- **Exaggerate the hierarchy.** Make the dominant element bigger *and* the secondary ones quieter.
- **Fix the edges.** Reduce distinct alignment lines; snap to the grid.
- **Re-pace the page.** Alternate density/width/background; vary section padding by importance.
- **Upgrade the type details.** Balanced headlines, tightened display tracking, proper numerals, real quotes/dashes, consistent measure.
- **Make images work harder.** Crop tighter, bleed, overlap with type, unify color grading.
- **Tune motion.** Shorter, fewer, with better easing; one signature moment; exits faster than entrances.
- **Write better copy.** Specific, concrete, in the visitor's words; delete filler labels.

## 5. Score

Fill the scorecard in `templates/quality-report.md` with evidence per category. If two categories are below 60% of their weight, do another refinement pass before scoring again.

## 6. Know when to stop

Stop iterating when gates pass, the score target is met, and the remaining findings are LOW or require user input. List those remaining items in the report; don't hide them.
