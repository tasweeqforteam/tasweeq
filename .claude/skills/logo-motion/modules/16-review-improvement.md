# 16 · Review & Improvement (Mode F)

**Purpose:** inspect an existing logo animation, name specific weaknesses with evidence, and improve it.

1. **Ingest:** `python3 qa.py <video> --reference <official-final.png at video size> [--background "#hex"]` → frames, contact sheet, motion graph, fidelity diff, checks (lossy-aware thresholds). Without a reference image the fidelity check is skipped — say so.
2. **Analyse the logo itself** (02) — the review judges the animation against what the logo offers.
3. **Look** at the contact sheet and transition frames; note timestamps.
4. **Write findings** as: *timestamp/frame → observed problem → why it matters (principle/brand) → specific fix*. Rank by impact. Typical: generic preset motion, no relationship to geometry, final-state distortion, short hold, lockstep motion, stall-then-pop, flashes, illegible mid-states, RTL violations.
5. **Improve:** if source exists, edit it; otherwise rebuild as a composition (scaffold with the official logo) implementing the fixes, render, and run QA on both.
6. **Compare** before/after with the same QA metrics and a side-by-side contact sheet; report what changed and what still falls short.
