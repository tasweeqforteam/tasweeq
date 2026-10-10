# Acceptance Criteria & Scorecard

Use for every completed project (and for evaluating this skill on the test projects). Scores must cite evidence: a screenshot, a report line, a test result, or a code reference. "Looks good" is not evidence.

## 1. Mandatory gates (binary — any FAIL means not done, regardless of score)

| # | Gate | How to verify |
|---|---|---|
| G1 | Core navigation and required functionality work | scripted/manual interaction pass; every CTA destination checked |
| G2 | No critical responsive failure at 390 / 768 / 1440 | visual-qa screenshots + overflow check = 0 |
| G3 | No critical accessibility blocker in tested flows | keyboard pass; labels; focus visible; body contrast ≥ 4.5:1; axe serious/critical = 0 if axe ran |
| G4 | No known critical runtime errors | visual-qa console/pageerror list empty (or only sandbox-blocked third parties, declared) |
| G5 | Essential content accessible without advanced animation | reduced-motion pass: no text left invisible; no-JS/failed-JS hidden states avoided |
| G6 | Reduced motion handled | `--reduced` screenshots + code review of motion opt-in |
| G7 | Required pages and interactions implemented | checklist against brief |
| G8 | Unverified tests explicitly reported | quality report §6 |

## 2. Weighted scorecard (100)

### Visual concept & art direction — 20
| Points | Evidence looks like |
|---|---|
| 17–20 | Concept sentence is specific; every section expresses it; one clear memorable move; no generic tells without reason; could not be mistaken for a template |
| 12–16 | Clear direction with a few generic sections or drifting details |
| 6–11 | Competent but interchangeable; several generic defaults |
| 0–5 | Template look; no identifiable concept |

### Layout, typography & composition — 20
| 17–20 | Strong hierarchy per viewport; consistent grid with deliberate breaks; varied section rhythm; refined type (scale, measure, breaks, tracking, numerals); Arabic set properly where present |
| 12–16 | Mostly solid; some weak breaks, uneven spacing, or a flat hierarchy section |
| 6–11 | Visible alignment/spacing problems; type defaults |
| 0–5 | Broken or chaotic |

### UI/UX & functional behavior — 15
| 13–15 | First-5-seconds clarity; CTA visible at 390/1440; all states designed (loading/empty/error/success); forms usable with validation; real links |
| 9–12 | Works, with gaps in states or clarity |
| 4–8 | Confusing flows or missing states |
| 0–3 | Key tasks fail |

### Animation & interaction quality — 15
| 13–15 | Purposeful motion budget (signature + feedback); good timing/easing; smooth (no jank observed); reduced-motion variant designed; nothing blocks content |
| 9–12 | Good but some decorative or slightly off-timed motion |
| 4–8 | Generic fade-ups everywhere or janky |
| 0–3 | Motion harms usability |
(If the brief calls for minimal motion, score on feedback quality and restraint.)

### Responsive design — 10
| 9–10 | Each viewport intentionally composed; no overflow; touch targets ≥ 44px for primary controls; images art-directed |
| 6–8 | Works everywhere with minor awkwardness |
| 3–5 | Desktop-stacked mobile; some clipping |
| 0–2 | Broken on a tested width |

### Code quality & maintainability — 10
| 9–10 | Tokens centralized; small components; follows repo conventions; no dead code; build + lint pass |
| 6–8 | Mostly clean; some duplication/hardcoding |
| 3–5 | Monolithic or inconsistent |
| 0–2 | Hard to change safely |

### Performance, accessibility & reliability — 10
| 9–10 | Clean console; no failed requests; semantic HTML; keyboard OK; axe clean (if run); assets sized; heavy features lazy/fallback |
| 6–8 | Minor issues |
| 3–5 | Several a11y/perf issues |
| 0–2 | Serious problems |

**Targets:** ≥ 85 standard completed project · ≥ 90 portfolio-grade / "award-level" requests.

## 3. Evaluating the *skill* (meta-criteria)

A test project run counts as **PASS** for the skill only if:
1. The agent produced the required artifacts for the task size (brief → direction → build → QA → report).
2. All gates pass with evidence.
3. Score ≥ 85 by an evaluator who did not build it (or, if the same agent, with screenshot evidence per line).
4. Across the test set, designs are visibly different from each other in concept, type, palette, layout and motion (adaptability).

Record runs in `results.md` with date, model/agent (as reported by the environment), tools available, and evidence paths.
