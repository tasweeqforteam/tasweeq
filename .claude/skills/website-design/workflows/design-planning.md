# Workflow: Design Planning (Art Direction)

Output: a filled `templates/design-direction.md` (large tasks) or a 10–20 line plan in the conversation (medium tasks). No UI code before this exists.

## Step 1 — Brief recap (5 lines)

Subject · audience · primary job · must-have content/features · constraints (stack, brand assets, languages, deadline, performance).

## Step 2 — World inventory and concept

Follow `rules/art-direction.md` §1–2: 8–12 nouns from the subject's world, then one concept sentence that could not describe a different client.

## Step 3 — Directions (when the brief is open)

When the user hasn't fixed a visual direction and the project is large, produce **2–3 genuinely different directions**. They must differ in concept, composition, typography, visual language, imagery, interaction and motion — not just palette swaps.

For each direction give:
- Name + concept sentence
- Palette (4–6 named hex values with roles)
- Type (families, roles, one display sample size)
- Layout concept + ASCII wireframe of the first viewport and one key section
- The memorable move
- Motion strategy (signature moment + feedback style)
- Risks (what could go wrong / who might dislike it)

ASCII wireframe example:

```
┌──────────────────────────────────────────────┐
│ logo                           work  contact │
│                                              │
│ WE MAKE                ┌───────────────────┐ │
│ BRANDS                 │  case video loop  │ │
│ IMPOSSIBLE TO          │  (bleeds right) ──┼─┼→
│ SCROLL PAST.           └───────────────────┘ │
│ [Book a call]   ↓ 42 brands since 2019       │
└──────────────────────────────────────────────┘
```

Then **recommend one** with reasons tied to the brief and audience. If the user is available and the choice is genuinely theirs (brand risk), ask; otherwise proceed with the recommendation and state it.

For small/medium tasks or when the brand already exists: skip directions; extend the existing system.

## Step 4 — Tokens and principles

Fill the token tables (color, type scale, spacing, radius, shadow/material, motion durations/easings) and 5–8 principles. Check contrast of text/background pairs now (compute ratios; WCAG AA ≥ 4.5:1 body).

Quick contrast computation (Node):

```js
const L = h => { const c = h.match(/\w\w/g).map(x => parseInt(x,16)/255).map(v => v <= 0.04045 ? v/12.92 : ((v+0.055)/1.055)**2.4); return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]; };
const ratio = (a,b) => { const [x,y] = [L(a),L(b)].sort((p,q)=>q-p); return ((x+0.05)/(y+0.05)).toFixed(2); };
console.log(ratio('16150f','fafaf6')); // ink on paper
```

## Step 5 — Page plan

- Section-by-section strip (purpose → content → layout → motion), following the persuasion order in `rules/ui-ux.md` §2 where relevant.
- Mobile composition notes for each section.
- Motion inventory (use the analysis table in `rules/animation.md` §2) — keep it short.
- Assets needed (real vs placeholder), with sources and licences.

## Step 6 — Critique the plan before building

1. **Genericness test:** would a similar brief produce the same plan? Revise those parts; write what you changed and why.
2. **Brief test:** does every must-have appear? Does the primary action appear in the first viewport?
3. **Feasibility test:** can each effect be built to the quality floor (reduced motion, mobile, performance) in this stack and time?
4. **Restraint test:** is there exactly one memorable move?

Only then go to `workflows/implementation.md`.
