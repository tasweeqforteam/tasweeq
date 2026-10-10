# QA report

**Verdict:** BELOW BAR (<75)

## Checks

| status | check | detail |
|---|---|---|
| pass | reveal.exists | Logo is not fully visible on frame 0 (IoU 0.00 with final). |
| pass | hold.final | Final hold 2.70s. |
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
| creative_originality | 20% | 1 | same blind critic, round-3 packet | The whole idea is an opacity fade: t=0.00 empty, t=0.45 the complete wordmark in flat mid-grey, t=0.88 near-black, t=1.33 full black. Letters, dots and joins never move independently, so the same clip would fit any logo in any script. Nothing comes from the Arabic forms. |
| motion_quality | 20% | 4 | same blind critic, round-3 packet | The fade is clean and artefact-free, but it is over by about 1.33s. Frames t=1.77 to t=3.98 (roughly 2.6s, two thirds of the clip) are identical static holds. No easing, overlap or secondary motion is visible, and the dead tail makes the pacing feel unfinished. |
| brand_relevance | 15% | 3 | same blind critic, round-3 packet | Nothing contradicts a 'next-generation marketing studio', but nothing expresses it either. The fade is neutral and ignores right-to-left reading, the kashida stretch and the dot system. The wordmark appears all at once instead of being written or built. |
| visual_clarity | 10% | 9 | same blind critic, round-3 packet | Every frame from t=0.45 on shows the complete, correctly joined, correctly dotted word, centred with generous margins. The final frame matches official.png exactly. The only cost is the faint grey state at t=0.45. |
| technical_quality | 10% | 10.0 | auto | export validation, page errors, determinism, flashes, pops, handoffs |
| delivery_completeness | 5% | 5 | auto | outputs ['composition.mp4']; files {'composition.html': True, 'blueprint.json': False, 'README.md': False, 'concepts.md': False} |

**Weighted total:** 56.0

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
  "final_hold_s": 2.7,
  "motion_end_s": 1.3,
  "median_active_motion": 0.1985,
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
  "blueprint_stages": []
}
```

Visual evidence: `contact-sheet.png`, `motion-graph.png`, `fidelity-diff.png`. Automated checks do not replace looking at the frames.