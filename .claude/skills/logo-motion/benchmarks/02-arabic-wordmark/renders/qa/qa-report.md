# QA report

**Verdict:** PASS

## Checks

| status | check | detail |
|---|---|---|
| pass | reveal.exists | Logo is not fully visible on frame 0 (IoU 0.00 with final). |
| pass | hold.final | Final hold 1.35s. |
| pass | motion.pops | No isolated single-frame jumps. |
| pass | motion.handoffs | No stall-then-pop handoffs. |
| pass | pacing.dead_air | No unintended static sections before the final hold. |
| pass | motion.easing | Motion segments decelerate into rest. |
| pass | safety.flashes | No general-flash violations detected (approximation of WCAG 2.3.1). |
| pass | fidelity.final_frame | Final frame matches the official logo (IoU 1.0, mean error 0.02). Final-frame contract holds. |
| pass | fidelity.color | Logo colour matches reference (ΔE 0.0). |
| pass | framing.safe_area | Final logo sits inside the 5% graphics-safe area. |
| pass | blueprint.stages | All 5 blueprint stages show the promised motion/stillness. |
| pass | export.validation | Encoded outputs match composition size/fps/duration: mp4, gif, webm, mp4:color, webm:color |
| pass | export.determinism | Re-rendered sample frames are identical |

## Scorecard (0-10 per criterion)

| criterion | weight | score | source | evidence |
|---|---|---|---|---|
| logo_fidelity | 20% | 10 | auto (confirm mid-animation distortion visually) | final-frame IoU 1.0, mean error 0.022, SSIM 0.9821 |
| creative_originality | 20% | 8 | blind critic (fresh sub-agent, pixels only), round-3 packet; round 4 addressed its top fixes (sliced bowls, floating bar, grey dots), not re-reviewed | The motion follows how the script works. At t=0.45 a baseline stroke starts at the right edge, the start of the Arabic line, and the word is revealed right-to-left (t=0.88, t=1.33). The joins are stretched like a kashida (the word is about 585px wide at t=1.33 against about 400px in the final) and then contract by t=2.22. The dots are held back until the rasm skeleton is complete and arrive in reading order: the ta dots first, then the ya dots grey at t=2.22, then the qaf dots by t=2.65. |
| motion_quality | 20% | 6 | blind critic (fresh sub-agent, pixels only), round-3 packet; round 4 addressed its top fixes (sliced bowls, floating bar, grey dots), not re-reviewed | The sequence is well structured: stroke, skeleton, elongation, contraction, dots, then a hold from t=3.10 to t=3.98. There are two rough mid-states. At t=0.88 a detached bar floats far left of the partial letters. At t=0.88 and t=1.33 the qaf bowl is sliced flat at the bottom by the reveal mask, which reads as a clipping glitch. The dots only fade in grey (t=2.22) rather than dropping or snapping in with any weight. |
| brand_relevance | 15% | 8 | blind critic (fresh sub-agent, pixels only), round-3 packet; round 4 addressed its top fixes (sliced bowls, floating bar, grey dots), not re-reviewed | Writing the line right-to-left, stretching with kashida and adding the i'jam dots last suits an Arabic wordmark. It reads as a studio that builds the word rather than a template. The contraction at t=1.77 to t=2.22 gives a confident settle. |
| visual_clarity | 10% | 8 | blind critic (fresh sub-agent, pixels only), round-3 packet; round 4 addressed its top fixes (sliced bowls, floating bar, grey dots), not re-reviewed | The final frames (t=3.10 to t=3.98) are crisp, centred and identical to the official logo, with all joins and dots in place. During t=0.45 to t=1.77 the letters have no dots, so ta, ya and qaf read ambiguously and the word is hard to read for about 1.3s. At t=1.33 the stretched word nearly fills the frame width. |
| technical_quality | 10% | 10.0 | auto | export validation, page errors, determinism, flashes, pops, handoffs |
| delivery_completeness | 5% | 10 | auto | outputs ['composition.mp4', 'composition.gif', 'composition.webm']; files {'composition.html': True, 'blueprint.json': True, 'README.md': True, 'concepts.md': True} |

**Weighted total:** 83.0

## Key metrics

```json
{
  "analysis_width": 640,
  "frames": 240,
  "fps": 60,
  "duration_s": 4.0,
  "first_frame_ink": 0.0,
  "final_frame_ink": 0.0399,
  "first_vs_final_iou": 0.0,
  "final_hold_s": 1.35,
  "motion_end_s": 2.65,
  "median_active_motion": 0.1167,
  "stall_then_pop": [],
  "dead_air": [],
  "lead_in_s": 0.183,
  "abrupt_stops_t": [],
  "energy_by_third": [
    0.24,
    0.76,
    0.0
  ],
  "flash_windows_t": [],
  "fidelity": {
    "mask_iou": 1.0,
    "mean_rgb_error_in_logo": 0.022,
    "ssim_logo_region": 0.9821,
    "max_abs_error": 43,
    "final_bbox": [
      582,
      385,
      756,
      310
    ],
    "reference_bbox": [
      582,
      385,
      756,
      310
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
    0.303,
    0.303,
    0.356,
    0.356
  ],
  "final_logo_width_share": 0.394,
  "blueprint_stages": [
    {
      "stage": "kashida strokes RTL",
      "start": 0.15,
      "end": 1.18,
      "expect_motion": true,
      "frames_moving": 0.937,
      "mean_motion": 0.1244,
      "ok": true
    },
    {
      "stage": "letters open from band",
      "start": 0.55,
      "end": 1.8,
      "expect_motion": true,
      "frames_moving": 0.934,
      "mean_motion": 0.2911,
      "ok": true
    },
    {
      "stage": "breathe in (contraction)",
      "start": 1.35,
      "end": 2.2,
      "expect_motion": true,
      "frames_moving": 0.942,
      "mean_motion": 0.5033,
      "ok": true
    },
    {
      "stage": "dot stamps RTL",
      "start": 2.05,
      "end": 2.67,
      "expect_motion": true,
      "frames_moving": 0.974,
      "mean_motion": 0.0897,
      "ok": true
    },
    {
      "stage": "final hold",
      "start": 2.67,
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