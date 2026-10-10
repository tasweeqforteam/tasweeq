#!/usr/bin/env python3
"""
qa.py — evidence-based QA of a RENDERED logo animation (not of its code).

    python3 qa.py <renders_dir> [--blueprint blueprint.json] [--review review.json]
                  [--project <dir>] [--out <renders_dir>/qa]
    python3 qa.py <existing_video.mp4|.mov|.gif|.webm> [--reference official_final.png]
                  [--background "#hex"] [--out <dir>]          (Mode F: review an existing animation)

Reads frames/ + render-manifest.json written by render.mjs and produces:
    qa/contact-sheet.png   key frames with timestamps (LOOK at it)
    qa/motion-graph.png    per-frame motion energy, ink coverage, markers, blueprint stages
    qa/fidelity-diff.png   final frame vs official logo (amplified difference)
    qa/qa-report.json / qa-report.md   checks (pass/warn/fail), metrics, scorecard

Automated checks cover what can be measured (fidelity, holds, pops, dead air,
flashes, safe area, promised-vs-rendered motion, export validity). Creative
criteria are NEVER scored automatically: they must come from a reviewer
(--review), each with written evidence. A weighted total is only reported
when every criterion has a score.
"""
import argparse, json, math, os, sys, glob
import numpy as np
from PIL import Image, ImageDraw, ImageFont

WEIGHTS = {
    "logo_fidelity": 0.20, "creative_originality": 0.20, "motion_quality": 0.20,
    "brand_relevance": 0.15, "visual_clarity": 0.10, "technical_quality": 0.10, "delivery_completeness": 0.05,
}
REVIEW_ONLY = ["creative_originality", "motion_quality", "brand_relevance", "visual_clarity"]

def font(size):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/System/Library/Fonts/Supplemental/Arial.ttf", "C:/Windows/Fonts/arial.ttf"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def load(path, width=None, mode="RGB"):
    im = Image.open(path).convert("RGBA")
    if width and im.width != width:
        im = im.resize((width, max(1, round(im.height * width / im.width))), Image.BILINEAR)
    a = np.asarray(im).astype(np.float32)
    if mode == "RGB":
        # composite on black so transparent renders still compare sensibly
        return a[..., :3] * (a[..., 3:4] / 255.0)
    return a

def hex_rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)

def bg_color(img, meta_bg):
    if meta_bg and meta_bg != "transparent" and meta_bg.startswith("#") and len(meta_bg) in (4, 7):
        if len(meta_bg) == 4:
            meta_bg = "#" + "".join(c * 2 for c in meta_bg[1:])
        return hex_rgb(meta_bg)
    if meta_bg == "transparent":
        return np.zeros(3, dtype=np.float32)
    c = np.concatenate([img[0, :], img[-1, :], img[:, 0], img[:, -1]])
    return np.median(c, axis=0)

def fg_mask(img, bg, tol=24):
    return np.abs(img - bg).sum(-1) > tol

def iou(a, b):
    u = np.logical_or(a, b).sum()
    return float(np.logical_and(a, b).sum() / u) if u else 1.0

def bbox(mask):
    ys, xs = np.nonzero(mask)
    if not len(xs):
        return None
    return [int(xs.min()), int(ys.min()), int(xs.max() - xs.min() + 1), int(ys.max() - ys.min() + 1)]

def ssim(a, b, win=8):
    """Mean SSIM on grayscale with uniform windows (dependency-free)."""
    C1, C2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    def box(x):
        c = np.cumsum(np.cumsum(np.pad(x, ((1, 0), (1, 0))), 0), 1)
        return (c[win:, win:] - c[:-win, win:] - c[win:, :-win] + c[:-win, :-win]) / (win * win)
    if min(a.shape) <= win:
        return 1.0 if np.allclose(a, b) else 0.0
    mu_a, mu_b = box(a), box(b)
    va, vb, cov = box(a * a) - mu_a ** 2, box(b * b) - mu_b ** 2, box(a * b) - mu_a * mu_b
    s = ((2 * mu_a * mu_b + C1) * (2 * cov + C2)) / ((mu_a ** 2 + mu_b ** 2 + C1) * (va + vb + C2))
    return float(s.mean())

def srgb_to_lab(rgb):
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ M.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)

def rel_lum(rgb):
    c = rgb / 255.0
    c = np.where(c > 0.03928, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]

def top_colors(img, mask, n=5):
    px = img[mask].astype(np.int32)
    if not len(px):
        return []
    q = (px // 8) * 8 + 4
    keys = (q[:, 0] << 16) | (q[:, 1] << 8) | q[:, 2]
    vals, counts = np.unique(keys, return_counts=True)
    order = np.argsort(-counts)[:n]
    tot = counts.sum()
    return [{"rgb": [int(vals[i] >> 16 & 255), int(vals[i] >> 8 & 255), int(vals[i] & 255)], "share": round(float(counts[i] / tot), 3)} for i in order if counts[i] / tot > 0.02]

def runs(bools):
    out, start = [], None
    for i, b in enumerate(bools):
        if b and start is None:
            start = i
        if not b and start is not None:
            out.append((start, i - 1)); start = None
    if start is not None:
        out.append((start, len(bools) - 1))
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("renders")
    ap.add_argument("--blueprint")
    ap.add_argument("--review")
    ap.add_argument("--project", help="project dir (for delivery completeness); default: parent of renders")
    ap.add_argument("--out")
    ap.add_argument("--width", type=int, default=640, help="analysis width for motion metrics")
    ap.add_argument("--reference", help="(video mode) image of the official final state at video size")
    ap.add_argument("--background", help="(video mode) background colour, default: estimated from frame 0")
    a = ap.parse_args()

    if os.path.isfile(a.renders):
        a.renders = ingest_video(a)
    R = os.path.abspath(a.renders)
    out = os.path.abspath(a.out or os.path.join(R, "qa"))
    os.makedirs(out, exist_ok=True)
    man = json.load(open(os.path.join(R, "render-manifest.json")))
    meta, fps = man["meta"], man["fps"]
    frames = sorted(glob.glob(os.path.join(R, "frames", "*.png")))
    if not frames:
        sys.exit("no frames/ in renders dir — render without --drop-frames")
    project = os.path.abspath(a.project or os.path.dirname(R))
    checks, metrics = [], {}
    def check(cid, status, msg, **kw):
        checks.append(dict(id=cid, status=status, message=msg, **kw))

    # ---------- per-frame series ----------
    W = a.width
    prev = None
    first = load(frames[0], W)
    bg = bg_color(first, meta.get("background"))
    diffs, changed, ink, lum_cells = [0.0], [0], [], []
    for i, f in enumerate(frames):
        img = load(f, W)
        ink.append(float(fg_mask(img, bg).mean()))
        L = rel_lum(img)
        h2, w2 = L.shape[0] // 2, L.shape[1] // 2
        lum_cells.append([float(L.mean())] + [float(L[y:y + h2, x:x + w2].mean()) for y in (0, h2) for x in (0, w2)])
        if prev is not None:
            d = np.abs(img - prev)
            diffs.append(float(d.mean()))
            changed.append(int((d.max(-1) > 6).sum()))   # pixels visibly changed (size-independent "is it moving")
        prev = img
    diffs, changed, ink, lum_cells = np.array(diffs), np.array(changed), np.array(ink), np.array(lum_cells)
    n = len(frames)
    t = np.arange(n) / fps
    EPS = 0.02          # mean abs diff (0-255): used for energy-relative checks only
    MIN_CHANGED = 3     # a frame "moves" if at least this many analysis pixels visibly change
    moving = changed >= MIN_CHANGED
    metrics["analysis_width"] = W
    metrics.update(frames=n, fps=fps, duration_s=round(n / fps, 3))

    # ---------- reveal / first frame ----------
    f_img, l_img = load(frames[0], W), load(frames[-1], W)
    m_first, m_last = fg_mask(f_img, bg), fg_mask(l_img, bg)
    metrics["first_frame_ink"] = round(float(m_first.mean()), 4)
    metrics["final_frame_ink"] = round(float(m_last.mean()), 4)
    sim = iou(m_first, m_last) if m_last.any() else 0
    metrics["first_vs_final_iou"] = round(sim, 3)
    if sim > 0.9:
        check("reveal.exists", "fail", "First frame already shows the finished logo (IoU %.2f with final) — there is no reveal." % sim)
    else:
        check("reveal.exists", "pass", "Logo is not fully visible on frame 0 (IoU %.2f with final)." % sim)

    # ---------- final hold ----------
    hold = 0
    for i in range(n - 1, 0, -1):
        if changed[i] < MIN_CHANGED:
            hold += 1
        else:
            break
    hold_s = (hold + 1) / fps if hold else 0.0
    metrics["final_hold_s"] = round(hold_s, 3)
    if hold_s < 0.4:
        check("hold.final", "fail", f"Final hold is {hold_s:.2f}s — the finished logo needs time to be read (>=0.8s typical, 1-2s for intros).")
    elif hold_s < 0.8:
        check("hold.final", "warn", f"Final hold is short ({hold_s:.2f}s). Consider >=0.8s unless this is a UI micro-animation or a loop.")
    else:
        check("hold.final", "pass", f"Final hold {hold_s:.2f}s.")
    motion_end = n - 1 - hold
    metrics["motion_end_s"] = round(motion_end / fps, 3)

    # ---------- pops / discontinuities ----------
    active = diffs[moving]
    med = float(np.median(active)) if len(active) else 0
    metrics["median_active_motion"] = round(med, 4)
    pops = []
    for i in range(1, n):
        d = diffs[i]
        nb = max(diffs[i - 1], diffs[i + 1] if i + 1 < n else 0)
        if d > max(6 * med, 1.5) and nb < d / 3:
            pops.append({"frame": i, "t": round(i / fps, 3), "diff": round(float(d), 3)})
    metrics["pops"] = pops
    if pops:
        check("motion.pops", "warn" if len(pops) <= 1 else "fail", f"{len(pops)} isolated jump(s) — something appears/changes in a single frame at t={[p['t'] for p in pops]}. Intentional cuts are fine; otherwise ease it.", frames=[p["frame"] for p in pops])
    else:
        check("motion.pops", "pass", "No isolated single-frame jumps.")

    # stall-then-pop: >=3 static frames immediately followed by a large jump (handoff without overlap)
    stalls = []
    for s, e in runs(~moving[1:motion_end + 1]):
        s += 1; e += 1
        if e - s + 1 >= 3 and e + 1 <= motion_end and diffs[e + 1] > max(4 * med, 1.0) and s > 1:
            stalls.append({"t": round(e / fps, 3), "static_frames": int(e - s + 1)})
    metrics["stall_then_pop"] = stalls
    if stalls:
        check("motion.handoffs", "warn", f"Stall-then-pop handoff(s) at t={[x['t'] for x in stalls]}: motion stops and the next move starts abruptly. Overlap actions or ease the onset.")
    else:
        check("motion.handoffs", "pass", "No stall-then-pop handoffs.")

    # dead air: static runs >= 0.5s between first motion and the final hold
    first_motion = int(np.argmax(moving)) if moving.any() else n
    dead = [(s / fps, (e - s + 1) / fps) for s, e in runs(~moving) if s > first_motion and e < motion_end and (e - s + 1) / fps >= 0.5]
    metrics["dead_air"] = [{"t": round(s, 3), "dur_s": round(d, 3)} for s, d in dead]
    metrics["lead_in_s"] = round(first_motion / fps, 3)
    if dead:
        check("pacing.dead_air", "warn", f"Static section(s) mid-animation: {metrics['dead_air']}. Fine if it is a deliberate beat; otherwise tighten.")
    else:
        check("pacing.dead_air", "pass", "No unintended static sections before the final hold.")
    if first_motion / fps > 0.6:
        check("pacing.lead_in", "warn", f"Nothing moves for the first {first_motion / fps:.2f}s.")

    # abrupt stops: motion that ends at full speed (no ease-out) — mechanical feel
    abrupt = []
    for s, e in runs(moving):
        seg = diffs[s:e + 1]
        if len(seg) >= 4 and seg[-1] > 0.45 * seg.max() and seg.max() > max(med, 0.3):
            abrupt.append(round((e) / fps, 3))
    metrics["abrupt_stops_t"] = abrupt
    if abrupt:
        check("motion.easing", "warn", f"Motion stops at high velocity at t={abrupt} (no ease-out / settle). Intentional impacts excepted.")
    else:
        check("motion.easing", "pass", "Motion segments decelerate into rest.")

    # energy distribution (pacing evidence)
    thirds = np.array_split(diffs, 3)
    tot = diffs.sum() or 1
    metrics["energy_by_third"] = [round(float(x.sum() / tot), 3) for x in thirds]

    # ---------- photosensitivity (WCAG 2.3.1-style general flash approximation) ----------
    flashes = []
    for c in range(lum_cells.shape[1]):
        L = lum_cells[:, c]
        ext, last_dir, last_val = [], 0, L[0]
        for i in range(1, n):
            dv = L[i] - last_val
            if abs(dv) >= 0.1 and min(L[i], last_val) < 0.8:
                d = 1 if dv > 0 else -1
                if d != last_dir:
                    ext.append(i); last_dir = d
                last_val = L[i]
        # a flash = pair of opposing transitions; count per 1s window
        for i in range(len(ext)):
            win = [x for x in ext if ext[i] <= x < ext[i] + fps]
            if len(win) // 2 > 3:
                flashes.append(round(ext[i] / fps, 3)); break
    metrics["flash_windows_t"] = sorted(set(flashes))
    if flashes:
        check("safety.flashes", "fail", f"More than 3 luminance flashes within 1s near t={metrics['flash_windows_t']} (photosensitivity risk, WCAG 2.3.1).")
    else:
        check("safety.flashes", "pass", "No general-flash violations detected (approximation of WCAG 2.3.1).")

    # ---------- final-frame contract (fidelity) ----------
    final_p = os.path.join(R, "final.png")
    ref_p = os.path.join(R, "reference.png")
    fid = {}
    if os.path.exists(ref_p):
        F, Rf = load(final_p), load(ref_p)
        bgf = bg_color(Rf, meta.get("background"))
        mF, mR = fg_mask(F, bgf), fg_mask(Rf, bgf)
        u = np.logical_or(mF, mR)
        err = float(np.abs(F - Rf).mean(-1)[u].mean()) if u.any() else 0.0
        bb = bbox(mR) or [0, 0, F.shape[1], F.shape[0]]
        pad = 12
        x0, y0 = max(0, bb[0] - pad), max(0, bb[1] - pad)
        x1, y1 = min(F.shape[1], bb[0] + bb[2] + pad), min(F.shape[0], bb[1] + bb[3] + pad)
        g = lambda im: im[y0:y1, x0:x1] @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
        fid = {"mask_iou": round(iou(mF, mR), 4), "mean_rgb_error_in_logo": round(err, 3), "ssim_logo_region": round(ssim(g(F), g(Rf)), 4),
               "max_abs_error": int(np.abs(F - Rf).max()), "final_bbox": bbox(mF), "reference_bbox": bb}
        bF = bbox(mF)
        if bF:
            fid["bbox_offset_px"] = [bF[0] - bb[0], bF[1] - bb[1]]
            fid["bbox_scale"] = [round(bF[2] / bb[2], 4), round(bF[3] / bb[3], 4)]
        # colour check (Lab ΔE between dominant colours)
        # colour check on interior pixels (eroded mask) so anti-aliased / chroma-subsampled edges don't dominate
        inner = np.logical_and(mF, mR)
        for _ in range(3):
            inner = inner & np.roll(inner, 1, 0) & np.roll(inner, -1, 0) & np.roll(inner, 1, 1) & np.roll(inner, -1, 1)
        if inner.any():
            de = float(np.linalg.norm(srgb_to_lab(F[inner].mean(0)) - srgb_to_lab(Rf[inner].mean(0))))
            fid["interior_color_deltaE"] = round(de, 2)
        # amplified diff heatmap
        d = np.clip(np.abs(F - Rf).mean(-1) * 6, 0, 255).astype(np.uint8)
        vis = np.stack([d, (mR * 60).astype(np.uint8), (mF * 60).astype(np.uint8)], -1)
        Image.fromarray(vis).save(os.path.join(out, "fidelity-diff.png"))
        lossy = bool(man.get("ingested_video"))
        fid["lossy_source"] = lossy
        pass_iou, pass_err, warn_iou = (0.97, 4.0, 0.94) if lossy else (0.998, 1.5, 0.98)
        if fid["mask_iou"] >= pass_iou and err < pass_err:
            check("fidelity.final_frame", "pass", f"Final frame matches the official logo (IoU {fid['mask_iou']}, mean error {err:.2f}). Final-frame contract holds.")
        elif fid["mask_iou"] >= warn_iou:
            check("fidelity.final_frame", "warn", f"Final frame is close but not identical to the official logo (IoU {fid['mask_iou']}, mean error {err:.2f}). Inspect fidelity-diff.png: leftover transforms, filters, strokes or opacity?")
        else:
            check("fidelity.final_frame", "fail", f"Final frame does NOT match the official logo (IoU {fid['mask_iou']}, mean error {err:.2f}). Fix before anything else.")
        if fid.get("interior_color_deltaE", 0) > 3:
            check("fidelity.color", "warn", f"Logo colour differs from reference by ΔE {fid['interior_color_deltaE']} (interior pixels).")
        elif "interior_color_deltaE" in fid:
            check("fidelity.color", "pass", f"Logo colour matches reference (ΔE {fid['interior_color_deltaE']}).")
        # last rendered frame should already be the final state
        lastF = load(frames[-1])
        if float(np.abs(lastF - F).mean()) > 0.5:
            check("fidelity.last_frame", "warn", "The last encoded frame differs from the state at t=duration (the video ends before the animation settles).")
    else:
        check("fidelity.final_frame", "warn", "No reference.png — composition lacks logo.template/rect, so the final-frame contract cannot be verified.")
    metrics["fidelity"] = fid

    # ---------- safe area / framing ----------
    F = load(final_p)
    bF = bbox(fg_mask(F, bg_color(F, meta.get("background"))))
    if bF:
        H_, W_ = F.shape[:2]
        margins = [bF[0] / W_, bF[1] / H_, (W_ - bF[0] - bF[2]) / W_, (H_ - bF[1] - bF[3]) / H_]
        metrics["final_margins_lrtb"] = [round(margins[0], 3), round(margins[2], 3), round(margins[1], 3), round(margins[3], 3)]
        metrics["final_logo_width_share"] = round(bF[2] / W_, 3)
        if min(margins) < 0.05:
            check("framing.safe_area", "warn", f"Final logo is within 5% of the frame edge (graphics-safe area) — margins {metrics['final_margins_lrtb']}.")
        else:
            check("framing.safe_area", "pass", "Final logo sits inside the 5% graphics-safe area.")

    # ---------- blueprint promise vs render ----------
    bp_eval = []
    if a.blueprint:
        bp = json.load(open(a.blueprint))
        if abs(bp.get("duration", meta["duration"]) - meta["duration"]) > 1e-3:
            check("blueprint.duration", "fail", f"Blueprint duration {bp.get('duration')}s != composition {meta['duration']}s.")
        for st in bp.get("stages", []):
            s, e = int(round(st["start"] * fps)), int(round(st["end"] * fps))
            lo, hi = max(1, s), min(n - 1, max(s + 1, e))
            seg_c = changed[lo:hi + 1]
            frac_moving = float((seg_c >= MIN_CHANGED).mean()) if len(seg_c) else 0.0
            energy = float(diffs[lo:hi + 1].mean()) if hi >= lo else 0.0
            expect = st.get("expect_motion", st.get("type") != "hold")
            # promised motion: something visibly changes in most of the window; hold: (almost) nothing does
            ok = (frac_moving >= 0.5) if expect else (frac_moving <= 0.05)
            bp_eval.append({"stage": st.get("name"), "start": st["start"], "end": st["end"], "expect_motion": expect, "frames_moving": round(frac_moving, 3), "mean_motion": round(energy, 4), "ok": bool(ok)})
            if not ok:
                check("blueprint.stage." + str(st.get("name")), "warn", f"Stage '{st.get('name')}' ({st['start']}-{st['end']}s) {'promised motion but only ' + format(frac_moving, '.0%') + ' of its frames move' if expect else 'should hold still but ' + format(frac_moving, '.0%') + ' of its frames move'}.")
        if bp_eval and all(x["ok"] for x in bp_eval):
            check("blueprint.stages", "pass", f"All {len(bp_eval)} blueprint stages show the promised motion/stillness.")
    metrics["blueprint_stages"] = bp_eval

    # ---------- export validity ----------
    vals = man.get("validation", [])
    bad = [v for v in vals if not v.get("ok")]
    if bad:
        check("export.validation", "fail", f"Encoded outputs failed validation: {bad}")
    elif vals:
        check("export.validation", "pass", "Encoded outputs match composition size/fps/duration: " + ", ".join(v["format"] for v in vals))
    perr = [e for e in man.get("page_errors", []) if not e.startswith("[console.warning]")]
    if perr:
        check("export.page_errors", "fail", f"{len(perr)} page error(s) during render: {perr[:3]}")
    det = man.get("determinism")
    if det is not None:
        check("export.determinism", "pass" if det.get("deterministic") else "fail", "Re-rendered sample frames are " + ("identical" if det.get("byte_identical") else "within anti-aliasing noise" if det.get("deterministic") else "DIFFERENT — composition depends on something other than t"))

    # ---------- visuals ----------
    contact_sheet(frames, fps, man, out)
    motion_graph(t, diffs, ink, man, bp_eval, hold, out)

    # ---------- scorecard ----------
    st = {c["id"]: c["status"] for c in checks}
    auto = {}
    if fid:
        i_ = fid["mask_iou"]
        auto["logo_fidelity"] = {"score": 10 if st.get("fidelity.final_frame") == "pass" else 8 if i_ >= 0.99 else 6 if i_ >= 0.98 else 3, "evidence": f"final-frame IoU {i_}, mean error {fid['mean_rgb_error_in_logo']}, SSIM {fid['ssim_logo_region']}", "source": "auto (confirm mid-animation distortion visually)"}
    tq = 10.0
    tq -= 4 * (st.get("export.validation") == "fail") + 2 * (st.get("export.page_errors") == "fail") + 2 * (st.get("export.determinism") == "fail")
    tq -= 5 * (st.get("safety.flashes") == "fail") + min(3, len(pops)) + 1 * (st.get("motion.handoffs") == "warn")
    auto["technical_quality"] = {"score": max(0, round(tq, 1)), "evidence": "export validation, page errors, determinism, flashes, pops, handoffs", "source": "auto"}
    have = {k: os.path.exists(os.path.join(project, k)) for k in ["composition.html", "blueprint.json", "README.md", "concepts.md"]}
    vids = [o for o in man.get("outputs", {}).values() if not o.get("error")]
    dc = 4 * bool(vids) + 2 * (len(vids) >= 2) + 1 * have["composition.html"] + 1 * have["blueprint.json"] + 1 * have["README.md"] + 1 * have["concepts.md"]
    auto["delivery_completeness"] = {"score": dc, "evidence": f"outputs {[o['file'] for o in vids]}; files {have}", "source": "auto"}

    review = json.load(open(a.review)) if a.review else {}
    weights = dict(WEIGHTS, **review.get("weights", {}))
    scores = {}
    for k in weights:
        r = (review.get("scores") or {}).get(k)
        if r is not None:
            if not r.get("evidence"):
                sys.exit(f"review score for {k} has no evidence — every score must be justified")
            scores[k] = dict(r, source=review.get("reviewer", "reviewer"))
        elif k in auto:
            scores[k] = auto[k]
    missing = [k for k in weights if k not in scores]
    total = None if missing else round(sum(weights[k] * scores[k]["score"] for k in weights) / sum(weights.values()) * 10, 1)
    hints = {
        "motion_quality": [c["message"] for c in checks if c["id"].startswith(("motion.", "pacing.", "hold.")) and c["status"] != "pass"],
        "visual_clarity": [f"final logo width share {metrics.get('final_logo_width_share')}", f"margins {metrics.get('final_margins_lrtb')}"],
    }
    fails = [c for c in checks if c["status"] == "fail"]
    warns = [c for c in checks if c["status"] == "warn"]
    report = {"renders": R, "checks": checks, "metrics": metrics, "scorecard": {"weights": weights, "scores": scores, "missing": missing, "weighted_total_out_of_100": total, "review_hints": hints},
              "verdict": "FAIL — fix failing checks" if fails else ("NEEDS VISUAL REVIEW" if missing else ("PASS" if total >= 75 else "BELOW BAR (<75)"))}
    json.dump(report, open(os.path.join(out, "qa-report.json"), "w"), indent=2)
    write_md(report, out)
    print(f"[qa] {len(checks)} checks: {len(fails)} fail, {len(warns)} warn  ->  {report['verdict']}")
    for c in fails + warns:
        print(f"  [{c['status'].upper()}] {c['id']}: {c['message']}")
    if missing:
        print(f"  scorecard incomplete — needs reviewer scores for: {', '.join(missing)}")
    else:
        print(f"  weighted total: {total}/100")
    print(f"  -> {out}/contact-sheet.png, motion-graph.png{', fidelity-diff.png' if fid else ''} (LOOK at them)")
    sys.exit(1 if fails else 0)

def ingest_video(a):
    """Extract frames + a minimal manifest from an existing video so the same checks apply."""
    import subprocess, shutil
    src = os.path.abspath(a.renders)
    R = os.path.abspath(a.out or os.path.splitext(src)[0] + "-qa")
    a.out = os.path.join(R, "qa")
    fr = os.path.join(R, "frames")
    shutil.rmtree(fr, ignore_errors=True); os.makedirs(fr, exist_ok=True)
    pr = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate,nb_frames", "-show_entries", "format=duration", "-of", "json", src]))
    st = pr["streams"][0]; n_, d_ = st["r_frame_rate"].split("/"); fps = float(n_) / float(d_ or 1)
    subprocess.check_call(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", src, "-vsync", "0", "-start_number", "0", os.path.join(fr, "%06d.png")])
    frames = sorted(glob.glob(os.path.join(fr, "*.png")))
    shutil.copy(frames[0], os.path.join(R, "first.png")); shutil.copy(frames[-1], os.path.join(R, "final.png"))
    if a.reference:
        im = Image.open(a.reference).convert("RGBA")
        if im.size != (st["width"], st["height"]):
            sys.exit(f"--reference must be {st['width']}x{st['height']} (same as the video)")
        im.save(os.path.join(R, "reference.png"))
    bg = a.background
    if not bg:
        f0 = load(frames[0]); c = np.concatenate([f0[0, :], f0[-1, :], f0[:, 0], f0[:, -1]]); m = np.median(c, axis=0)
        bg = "#%02X%02X%02X" % tuple(int(v) for v in m)
    man = {"composition": src, "meta": {"width": st["width"], "height": st["height"], "fps": fps, "duration": len(frames) / fps, "background": bg, "markers": {}},
           "fps": fps, "frames": len(frames), "transparent": False, "outputs": {}, "validation": [], "page_errors": [], "determinism": None, "ingested_video": True}
    json.dump(man, open(os.path.join(R, "render-manifest.json"), "w"), indent=2)
    print(f"[qa] ingested {src}: {len(frames)} frames @ {fps:.3f} fps, {st['width']}x{st['height']}, background {bg}")
    return R

def contact_sheet(frames, fps, man, out, cols=4, rows=3):
    n = len(frames)
    idx = sorted(set([0] + [round(i * (n - 1) / (cols * rows - 1)) for i in range(cols * rows)] + [n - 1]))[: cols * rows]
    while len(idx) < cols * rows and len(idx) < n:
        idx.append(n - 1)
    sample = Image.open(frames[0])
    cw = 420; ch = round(sample.height * cw / sample.width)
    sheet = Image.new("RGB", (cols * cw, rows * (ch + 26)), (18, 18, 22))
    d = ImageDraw.Draw(sheet); f = font(15)
    for k, i in enumerate(idx):
        im = Image.open(frames[i]).convert("RGBA")
        bgc = Image.new("RGBA", im.size, (40, 40, 46, 255)) if man.get("transparent") else Image.new("RGBA", im.size, (0, 0, 0, 255))
        im = Image.alpha_composite(bgc, im).convert("RGB").resize((cw, ch), Image.LANCZOS)
        x, y = (k % cols) * cw, (k // cols) * (ch + 26)
        sheet.paste(im, (x, y + 26))
        d.text((x + 8, y + 5), f"f{i}  t={i / fps:.2f}s", fill=(220, 220, 220), font=f)
    sheet.save(os.path.join(out, "contact-sheet.png"))

def motion_graph(t, diffs, ink, man, bp_eval, hold, out):
    Wd, Hd, P = 1200, 360, 50
    im = Image.new("RGB", (Wd, Hd), (18, 18, 22)); d = ImageDraw.Draw(im); f = font(12)
    T = t[-1] if len(t) > 1 else 1
    X = lambda s: P + (Wd - 2 * P) * s / T
    cols = [(60, 60, 90), (60, 90, 60), (90, 60, 60), (90, 80, 50), (60, 85, 95)]
    for k, st in enumerate(bp_eval):
        d.rectangle([X(st["start"]), 20, X(st["end"]), Hd - P], fill=cols[k % len(cols)] if st["ok"] else (120, 30, 30))
        d.text((X(st["start"]) + 3, 22), str(st["stage"])[:18], fill=(230, 230, 230), font=f)
    if hold:
        d.rectangle([X(t[-1 - hold]), Hd - P - 6, X(t[-1]), Hd - P], fill=(255, 212, 59))
    mx = max(float(diffs.max()), 1e-6)
    pts = [(X(t[i]), Hd - P - (Hd - P - 40) * diffs[i] / mx) for i in range(len(t))]
    d.line(pts, fill=(77, 171, 247), width=2)
    mi = max(float(ink.max()), 1e-6)
    pts2 = [(X(t[i]), Hd - P - (Hd - P - 40) * ink[i] / mi) for i in range(len(t))]
    d.line(pts2, fill=(32, 201, 151), width=1)
    for k, v in (man["meta"].get("markers") or {}).items():
        d.line([(X(float(v)), 20), (X(float(v)), Hd - P)], fill=(255, 59, 92)); d.text((X(float(v)) + 3, Hd - P - 16), k, fill=(255, 120, 140), font=f)
    d.line([(P, Hd - P), (Wd - P, Hd - P)], fill=(120, 120, 120))
    for s in np.arange(0, T + 1e-6, 0.5):
        d.line([(X(s), Hd - P), (X(s), Hd - P + 5)], fill=(150, 150, 150)); d.text((X(s) - 8, Hd - P + 8), f"{s:.1f}", fill=(170, 170, 170), font=f)
    d.text((P, 4), "blue: motion energy per frame   green: ink coverage   yellow: final hold   red lines: markers   bands: blueprint stages (red = promise not met)", fill=(200, 200, 200), font=f)
    im.save(os.path.join(out, "motion-graph.png"))

def write_md(r, out):
    L = [f"# QA report\n\n**Verdict:** {r['verdict']}\n", "## Checks\n", "| status | check | detail |", "|---|---|---|"]
    for c in r["checks"]:
        L.append(f"| {c['status']} | {c['id']} | {c['message'].replace('|', '/')} |")
    sc = r["scorecard"]
    L += ["\n## Scorecard (0-10 per criterion)\n", "| criterion | weight | score | source | evidence |", "|---|---|---|---|---|"]
    for k, w in sc["weights"].items():
        s = sc["scores"].get(k)
        L.append(f"| {k} | {w:.0%} | {s['score'] if s else '—'} | {s['source'] if s else 'needs reviewer'} | {(s or {}).get('evidence', '').replace('|', '/')} |")
    L.append(f"\n**Weighted total:** {sc['weighted_total_out_of_100'] if sc['weighted_total_out_of_100'] is not None else 'not computed — missing ' + ', '.join(sc['missing'])}\n")
    m = r["metrics"]
    L += ["## Key metrics\n", "```json", json.dumps({k: m[k] for k in m if k not in ('pops',)}, indent=2), "```",
          "\nVisual evidence: `contact-sheet.png`, `motion-graph.png`, `fidelity-diff.png`. Automated checks do not replace looking at the frames."]
    open(os.path.join(out, "qa-report.md"), "w").write("\n".join(L))

if __name__ == "__main__":
    main()
