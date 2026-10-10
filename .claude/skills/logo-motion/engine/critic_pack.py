#!/usr/bin/env python3
"""
critic_pack.py — prepare a BLIND review packet so a fresh reviewer judges pixels, not rationale.

    python3 critic_pack.py --out <dir> --brief "one-line brand context" <renders_dir> [<renders_dir_2> ...]

For each renders dir (from render.mjs) it writes an anonymised strip `clip-X.png`, `clip-Y.png`, …
(10 frames cropped around the logo, timestamps only), plus `official.png` (the official logo) and
`brief.md` with reviewer instructions. The label→source mapping goes to `<out>/../<name>-key.json`
— outside the packet — so the reviewer cannot see which clip is which. Labels are shuffled
deterministically from the packet name (no hidden randomness).
"""
import argparse, glob, hashlib, json, os
from PIL import Image, ImageDraw, ImageFont

def font(size):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/System/Library/Fonts/Supplemental/Arial.ttf"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def logo_box(renders):
    m = json.load(open(os.path.join(renders, "render-manifest.json")))
    r = (m["meta"].get("logoRect") or {})
    W, H = m["meta"]["width"], m["meta"]["height"]
    if not r:
        return (0, 0, W, H), m
    padx, pady = r["w"] * 0.18, r["h"] * 0.6
    return (max(0, int(r["x"] - padx)), max(0, int(r["y"] - pady)), min(W, int(r["x"] + r["w"] + padx)), min(H, int(r["y"] + r["h"] + pady))), m

def strip(renders, out_png, n=10, width=1400):
    box, m = logo_box(renders)
    frames = sorted(glob.glob(os.path.join(renders, "frames", "*.png")))
    fps = m["fps"]
    idx = [round(i * (len(frames) - 1) / (n - 1)) for i in range(n)]
    cw = width // 2
    crops = [Image.open(frames[i]).convert("RGB").crop(box) for i in idx]
    ch = round(crops[0].height * cw / crops[0].width)
    sheet = Image.new("RGB", (cw * 2, (ch + 24) * (n // 2)), (20, 20, 24))
    d = ImageDraw.Draw(sheet); f = font(14)
    for k, (i, c) in enumerate(zip(idx, crops)):
        x, y = (k % 2) * cw, (k // 2) * (ch + 24)
        sheet.paste(c.resize((cw, ch), Image.LANCZOS), (x, y + 24))
        d.text((x + 6, y + 4), f"t={i / fps:.2f}s", fill=(210, 210, 210), font=f)
    sheet.save(out_png)
    return box

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("renders", nargs="+")
    ap.add_argument("--out", required=True)
    ap.add_argument("--brief", default="")
    a = ap.parse_args()
    out = os.path.abspath(a.out); os.makedirs(out, exist_ok=True)
    name = os.path.basename(out.rstrip("/"))
    labels = [chr(ord("X") + i) if i < 3 else f"C{i}" for i in range(len(a.renders))]
    order = sorted(range(len(a.renders)), key=lambda i: hashlib.sha1(f"{name}:{i}".encode()).hexdigest())
    key = {}
    for lab, i in zip(labels, order):
        r = os.path.abspath(a.renders[i])
        box = strip(r, os.path.join(out, f"clip-{lab}.png"))
        key[lab] = r
    ref = os.path.join(os.path.abspath(a.renders[0]), "reference.png")
    if os.path.exists(ref):
        Image.open(ref).convert("RGB").crop(box).save(os.path.join(out, "official.png"))
    json.dump(key, open(os.path.join(os.path.dirname(out), f"{name}-key.json"), "w"), indent=2)
    clips = ", ".join(f"`clip-{l}.png`" for l in labels)
    open(os.path.join(out, "brief.md"), "w").write(f"""# Blind review

Brand context: {a.brief or '(none given)'}

Files: `official.png` (the official logo, final state) and {clips} — each is 10 frames of one logo animation in time order (timestamps shown), cropped around the logo.

For EACH clip, score 0–10 with one or two sentences of visual evidence (cite timestamps):
- **creative_originality** — is the motion idea specific to this logo, or a preset that would fit any logo?
- **motion_quality** — timing, spacing, easing, overlap, readability of mid-states.
- **brand_relevance** — does the movement suit this mark and the brand context?
- **visual_clarity** — is the logo legible and well framed, especially at the end?
Then name the single most important improvement for each clip, and which clip you would ship.
Judge only what you see. Do not assume intent.
Reply as JSON: {{"<label>": {{"creative_originality": {{"score": n, "evidence": "..."}}, ...,"top_fix": "..."}}, "ship": "<label>", "why": "..."}}
""")
    print(f"[critic_pack] {out} (key: {name}-key.json, keep it away from the reviewer)")

if __name__ == "__main__":
    main()
