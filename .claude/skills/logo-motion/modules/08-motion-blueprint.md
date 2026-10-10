# 08 · Production-Ready Motion Blueprint

**Purpose:** convert the chosen direction into an executable, checkable plan.
**Input:** selected direction (concepts.md), analysis part ids.
**Output:** `blueprint.json` that passes `node blueprint.mjs check`, plus `node blueprint.mjs timeline` for a visual sanity check.
**Done when:** a different animator could build the same animation from the blueprint alone.

## Required content
Top level: `concept`, `rationale` (with analysis evidence), `duration`, `fps`, `width`, `height`, `background`, `logo_rect`, `stages[]`, `key_poses[]`, `markers`, `export`, `fidelity.final_state_from`, `fidelity.compromises[]`.

Each stage: `name`, `type` (intro · build · transition · reveal · settle · hold · loop · outro · beat), `start`, `end`, `objects` (selectors / part ids), `initial_state`, `final_state`, `changes` (numbers: px/viewBox units, degrees, scale factors, opacity, path names), `easing` (GSAP names or cubic-bezier), plus `anticipation`, `follow_through`, `secondary`, `camera`, `sound` when used. Optional `tracks[]` are executable (`LM.fromBlueprint(bp)`):
```json
{ "target": "#p3", "at": 1.2, "duration": 0.5, "from": { "scale": 0, "transformOrigin": "50% 50%" }, "to": { "scale": 1 }, "ease": "back.out(2)" }
```

## Standards
- **Arc:** intentional opening → progression → reveal → settle → final hold. No unrelated scenes or decoration.
- **Key poses first:** define at least opening, transformation/peak, and final poses; motion is the path between poses.
- **Concrete language:** "p2 translates −40 → 0 viewBox units on x with power3.out over 0.7 s" — never "smooth dynamic reveal" (the checker flags vague words).
- **Overlap:** successive actions overlap 20–40 % of the shorter duration unless a deliberate beat (then mark the stage `"expect_motion": false`, type `beat`).
- **Final hold:** ≥ 0.8 s (1–2 s for intros/idents), exact official logo from `fidelity.final_state_from`.
- **Durations:** UI micro 0.3–0.8 s · splash 1.2–2 s · web hero / social sting 2–4 s · ident 4–8 s · loops 2–6 s with matched first/last state.
- **Frame rate:** 60 fps for fast motion and UI; 30 fps acceptable for social; same fps for all exports.
- **Determinism:** randomness only via `LM.random(seed)`; procedural behaviour as a function of `t`.
- **Promise-vs-render:** `qa.py --blueprint` checks that every non-hold stage shows motion in its window and the hold does not — the blueprint is a contract.
