# Quality Report — {{project name}}

_Date: {{YYYY-MM-DD}} · Build/commit: {{hash}} · Reviewer: {{agent}}_

## 1. What was delivered
- {{pages/components/features}}
- How to run: `{{commands}}`

## 2. Key decisions
- Concept: {{one sentence}}
- {{decision → reason}}

## 3. Testing actually performed
| Check | Tool / method | Scope | Result |
|---|---|---|---|
| Screenshots | visual-qa.mjs (Playwright Chromium {{version}}) | {{pages}} × 390/768/1440 | {{pass / issues}} |
| Reduced motion | visual-qa.mjs `--reduced` | | |
| Console/runtime errors | visual-qa.mjs | | |
| Interactions | {{script / manual}} | {{which}} | |
| Keyboard | {{Tab pass / script}} | | |
| axe-core | {{ran / not installed}} | | |
| Build | `npm run build` | | |
| Lint/types | `npm run lint` | | |
| Lighthouse | {{ran / not available}} | | |

## 4. Mandatory gates
| Gate | Status | Evidence |
|---|---|---|
| Core navigation & required functionality work | PASS / FAIL / NOT VERIFIED | |
| No critical responsive failure (390/768/1440) | | |
| No critical a11y blocker in tested flows | | |
| No known critical runtime errors | | |
| Essential content accessible without animation | | |
| Reduced motion handled | | |
| Required pages & interactions implemented | | |
| Unverified items listed | | |

## 5. Scorecard (evidence-based)
| Category | Weight | Score | Evidence |
|---|---|---|---|
| Visual concept & art direction | 20 | | |
| Layout, typography & composition | 20 | | |
| UI/UX & functional behavior | 15 | | |
| Animation & interaction quality | 15 | | |
| Responsive design | 10 | | |
| Code quality & maintainability | 10 | | |
| Performance, accessibility & reliability | 10 | | |
| **Total** | **100** | | Target: ≥ 85 (standard) / ≥ 90 (portfolio-grade) |

## 6. Known issues & not verified
- {{issue → severity → suggested fix}}
- Not verified: {{e.g. real iOS Safari, screen reader, slow 3G, CMS integration}}

## 7. Placeholders & assumptions
- {{placeholder content/assets that must be replaced}}
