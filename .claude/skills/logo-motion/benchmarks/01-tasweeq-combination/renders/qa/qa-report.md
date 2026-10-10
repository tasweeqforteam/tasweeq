# QA report

**Verdict:** PASS

## Checks

| status | check | detail |
|---|---|---|
| pass | reveal.exists | Logo is not fully visible on frame 0 (IoU 0.00 with final). |
| pass | hold.final | Final hold 1.07s. |
| pass | motion.pops | No isolated single-frame jumps. |
| pass | motion.handoffs | No stall-then-pop handoffs. |
| pass | pacing.dead_air | No unintended static sections before the final hold. |
| pass | motion.easing | Motion segments decelerate into rest. |
| pass | safety.flashes | No general-flash violations detected (approximation of WCAG 2.3.1). |
| pass | fidelity.final_frame | Final frame matches the official logo (IoU 1.0, mean error 0.21). Final-frame contract holds. |
| pass | fidelity.color | Logo colour matches reference (ΔE 0.0). |
| pass | framing.safe_area | Final logo sits inside the 5% graphics-safe area. |
| pass | blueprint.stages | All 6 blueprint stages show the promised motion/stillness. |
| pass | export.validation | Encoded outputs match composition size/fps/duration: mp4, gif, webm, mp4:color, webm:color |
| pass | export.determinism | Re-rendered sample frames are identical |

## Scorecard (0-10 per criterion)

| criterion | weight | score | source | evidence |
|---|---|---|---|---|
| logo_fidelity | 20% | 10 | auto (confirm mid-animation distortion visually) | final-frame IoU 1.0, mean error 0.211, SSIM 0.9997 |
| creative_originality | 20% | 8 | blind critic (fresh sub-agent, pixels only) — round 3 packet; round 4 fixed its top issue (mask slivers) and trimmed the hold, not re-reviewed | The symbol builds itself from its own geometry. An arc of the D appears at t=0.47s. By t=0.93s the lower rail and curve are drawn. The two dot-eyes pop in at t=1.40s, and the T-bracket block lands by t=1.87s. The wordmark then rises from the baseline, with slivers of T and a dash at t=1.87s and a masked reveal at t=2.32s. The construction order reads as the mark's anatomy, so it is specific to this logo. It stops short of a 9 because the T-bar arrival looks like a snap and the wordmark reveal is a fairly standard baseline mask. |
| motion_quality | 20% | 7 | blind critic (fresh sub-agent, pixels only) — round 3 packet; round 4 fixed its top issue (mask slivers) and trimmed the hold, not re-reviewed | Clear staging gives a readable sequence: contour, then eyes, then T-bracket, then wordmark. The symbol-to-wordmark overlap at t=1.87s and t=2.32s keeps momentum. Flaws: at t=2.32s the Q is clipped by the mask and a stray thin horizontal line sits under the last E, which looks like a mask artifact. The T-bracket seems to appear between t=1.40s and t=1.87s with little intermediate read. The hold from t=2.78s to t=4.18s is long, about 1.4s. |
| brand_relevance | 15% | 8 | blind critic (fresh sub-agent, pixels only) — round 3 packet; round 4 fixed its top issue (mask slivers) and trimmed the hold, not re-reviewed | Drawing the mark and letting the eyes appear gives the symbol personality, like a character waking up. A build-from-parts sequence suits a marketing studio about making things. The wordmark's rise suggests 'moving' without being aggressive. |
| visual_clarity | 10% | 8 | blind critic (fresh sub-agent, pixels only) — round 3 packet; round 4 fixed its top issue (mask slivers) and trimmed the hold, not re-reviewed | From t=2.78s the final lockup is clean, well framed and identical to the official logo (apart from slightly tighter tracking on the W). Mid-states are mostly readable, though the lone arc at t=0.47s is ambiguous and the clipped Q at t=2.32s is untidy for a moment. |
| technical_quality | 10% | 10.0 | auto | export validation, page errors, determinism, flashes, pops, handoffs |
| delivery_completeness | 5% | 10 | auto | outputs ['composition.mp4', 'composition.gif', 'composition.webm']; files {'composition.html': True, 'blueprint.json': True, 'README.md': True, 'concepts.md': True} |

**Weighted total:** 85.0

## Key metrics

```json
{
  "analysis_width": 640,
  "frames": 240,
  "fps": 60,
  "duration_s": 4.0,
  "first_frame_ink": 0.0,
  "final_frame_ink": 0.0325,
  "first_vs_final_iou": 0.0,
  "final_hold_s": 1.067,
  "motion_end_s": 2.933,
  "median_active_motion": 0.0208,
  "stall_then_pop": [],
  "dead_air": [],
  "lead_in_s": 0.267,
  "abrupt_stops_t": [],
  "energy_by_third": [
    0.062,
    0.932,
    0.006
  ],
  "flash_windows_t": [],
  "fidelity": {
    "mask_iou": 1.0,
    "mean_rgb_error_in_logo": 0.211,
    "ssim_logo_region": 0.9997,
    "max_abs_error": 59,
    "final_bbox": [
      416,
      463,
      1091,
      155
    ],
    "reference_bbox": [
      416,
      463,
      1091,
      155
    ],
    "bbox_offset_px": [
      0,
      0
    ],
    "bbox_scale": [
      1.0,
      1.0
    ],
    "interior_color_deltaE": 0.0,
    "lossy_source": false
  },
  "final_margins_lrtb": [
    0.217,
    0.215,
    0.429,
    0.428
  ],
  "final_logo_width_share": 0.568,
  "blueprint_stages": [
    {
      "stage": "write ta body (RTL)",
      "start": 0.15,
      "end": 1.25,
      "expect_motion": true,
      "frames_moving": 0.896,
      "mean_motion": 0.0158,
      "ok": true
    },
    {
      "stage": "dot taps (RTL)",
      "start": 1.0,
      "end": 1.55,
      "expect_motion": true,
      "frames_moving": 1.0,
      "mean_motion": 0.0119,
      "ok": true
    },
    {
      "stage": "write T bar (LTR)",
      "start": 1.3,
      "end": 1.9,
      "expect_motion": true,
      "frames_moving": 1.0,
      "mean_motion": 0.0414,
      "ok": true
    },
    {
      "stage": "write T stem",
      "start": 1.72,
      "end": 2.3,
      "expect_motion": true,
      "frames_moving": 1.0,
      "mean_motion": 0.3462,
      "ok": true
    },
    {
      "stage": "wordmark line reveal",
      "start": 1.78,
      "end": 2.95,
      "expect_motion": true,
      "frames_moving": 0.944,
      "mean_motion": 0.2267,
      "ok": true
    },
    {
      "stage": "final hold",
      "start": 2.95,
      "end": 4.0,
      "expect_motion": false,
      "frames_moving": 0.0,
      "mean_motion": 0.0,
      "ok": true
    }
  ]
}
```

Visual evidence: `contact-sheet.png`, `motion-graph.png`, `fidelity-diff.png`. Automated checks do not replace looking at the frames.