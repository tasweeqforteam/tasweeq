# QA report

**Verdict:** BELOW BAR (<75)

## Checks

| status | check | detail |
|---|---|---|
| pass | reveal.exists | Logo is not fully visible on frame 0 (IoU 0.00 with final). |
| pass | hold.final | Final hold 3.20s. |
| pass | motion.pops | No isolated single-frame jumps. |
| pass | motion.handoffs | No stall-then-pop handoffs. |
| pass | pacing.dead_air | No unintended static sections before the final hold. |
| pass | motion.easing | Motion segments decelerate into rest. |
| pass | safety.flashes | No general-flash violations detected (approximation of WCAG 2.3.1). |
| pass | fidelity.final_frame | Final frame matches the official logo (IoU 1.0, mean error 0.00). Final-frame contract holds. |
| pass | fidelity.color | Logo colour matches reference (ΔE 0.0). |
| pass | framing.safe_area | Final logo sits inside the 5% graphics-safe area. |
| pass | export.validation | Encoded outputs match composition size/fps/duration: mp4, mp4:color |

## Scorecard (0-10 per criterion)

| criterion | weight | score | source | evidence |
|---|---|---|---|---|
| logo_fidelity | 20% | 10 | auto (confirm mid-animation distortion visually) | final-frame IoU 1.0, mean error 0.0, SSIM 1.0 |
| creative_originality | 20% | 2 | same blind critic, round 3 packet | Blank at t=0.00s, then at t=0.50s the whole lockup (symbol and wordmark together) is already present at reduced opacity, and by t=1.00s it is at full brightness. That is a plain whole-logo fade-in that would fit any logo. Nothing in the motion comes from the T/D bracket, the two dot-eyes or the pill-shaped terminal. |
| motion_quality | 20% | 4 | same blind critic, round 3 packet | The only visible change is the fade between t=0.50s and t=1.00s. Everything from t=1.00s to t=4.48s is identical, so about 3.5s of the 4.5s clip is a dead hold with no secondary motion, settle or accent. The dim grey and teal mid-state at t=0.50s looks washed out, and the symbol and wordmark move in lockstep with no stagger. |
| brand_relevance | 15% | 3 | same blind critic, round 3 packet | A fade is safe but says nothing about 'Build Brands That Move Culture' or a next-generation studio. The mark's character-like dot eyes never get to react or blink, and no energy is conveyed. |
| visual_clarity | 10% | 8 | same blind critic, round 3 packet | The final lockup (t=1.00s onward) is crisp, centred, correctly coloured (cyan symbol, off-white wordmark) and legible. The W is slightly tight compared with official.png, where the letterspacing is more open. The faded t=0.50s frame is low-contrast but brief. |
| technical_quality | 10% | 10.0 | auto | export validation, page errors, determinism, flashes, pops, handoffs |
| delivery_completeness | 5% | 5 | auto | outputs ['composition.mp4']; files {'composition.html': True, 'blueprint.json': False, 'README.md': False, 'concepts.md': False} |

**Weighted total:** 57.0

## Key metrics

```json
{
  "analysis_width": 640,
  "frames": 270,
  "fps": 60,
  "duration_s": 4.5,
  "first_frame_ink": 0.0,
  "final_frame_ink": 0.0328,
  "first_vs_final_iou": 0.0,
  "final_hold_s": 3.2,
  "motion_end_s": 1.3,
  "median_active_motion": 0.1751,
  "stall_then_pop": [],
  "dead_air": [],
  "lead_in_s": 0.317,
  "abrupt_stops_t": [],
  "energy_by_third": [
    1.0,
    0.0,
    0.0
  ],
  "flash_windows_t": [],
  "fidelity": {
    "mask_iou": 1.0,
    "mean_rgb_error_in_logo": 0.0,
    "ssim_logo_region": 1.0,
    "max_abs_error": 0,
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
  "blueprint_stages": []
}
```

Visual evidence: `contact-sheet.png`, `motion-graph.png`, `fidelity-diff.png`. Automated checks do not replace looking at the frames.