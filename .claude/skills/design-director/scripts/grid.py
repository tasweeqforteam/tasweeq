#!/usr/bin/env python3
"""Grid calculator for fixed-canvas layouts.

Computes margins, columns, gutters, rows and a baseline unit that divide the
artboard cleanly, then prints a JSON spec plus CSS custom properties that drop
straight into templates/base.css.

Margins are proportional to the artboard (not fixed pixels) so a spec
transfers between sizes. Everything snaps to the baseline unit so vertical
rhythm survives rounding.

Examples:
  grid.py --format ig-portrait --columns 6
  grid.py --width 1080 --height 1920 --columns 4 --margin 0.07 --safe-top 250 --safe-bottom 340
  grid.py --format a4-portrait --columns 12 --rows 0 --baseline 12 --margin-outer 0.09 --margin-inner 0.06
"""
import argparse
import json
import sys

# Pixel formats. Print formats are expressed at 300 dpi so the arithmetic is
# shared; the printed spec also reports millimetres.
FORMATS = {
    "ig-square": (1080, 1080),
    "ig-portrait": (1080, 1350),
    "story": (1080, 1920),          # Stories / Reels / TikTok cover
    "x-landscape": (1600, 900),
    "linkedin": (1200, 1200),
    "slide-16x9": (1920, 1080),
    "a4-portrait": (2480, 3508),
    "a4-landscape": (3508, 2480),
    "a3-portrait": (3508, 4961),
    "poster-50x70": (5906, 8268),
    "dl-panel": (1169, 2480),       # 99x210 mm trifold panel
}

# Platform UI overlays that cover the artboard on vertical placements. These
# are conservative working values, not platform-published guarantees; confirm
# against the current platform spec before final delivery.
SAFE_DEFAULTS = {"story": {"top": 250, "bottom": 340}}


def snap_up(value, unit):
    """Round up to the unit — safe areas must never shrink when snapped."""
    return int(-(-value // unit) * unit) if unit else int(value)


def snap(value, unit):
    return int(round(value / unit) * unit) if unit else int(round(value))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--format", choices=sorted(FORMATS))
    p.add_argument("--width", type=int)
    p.add_argument("--height", type=int)
    p.add_argument("--columns", type=int, default=6)
    p.add_argument("--rows", type=int, default=8, help="0 = no modular rows")
    p.add_argument("--margin", type=float, default=0.0667, help="margin as fraction of the short side")
    p.add_argument("--margin-top", type=float, help="override, fraction of short side")
    p.add_argument("--margin-bottom", type=float, help="override, fraction of short side")
    p.add_argument("--margin-outer", type=float, help="spreads: outside margin fraction")
    p.add_argument("--margin-inner", type=float, help="spreads: gutter-side margin fraction")
    p.add_argument("--gutter", type=float, default=0.333, help="gutter as fraction of the margin")
    p.add_argument("--baseline", type=int, help="baseline unit px (default: short side / 135, min 4)")
    p.add_argument("--safe-top", type=int)
    p.add_argument("--safe-bottom", type=int)
    p.add_argument("--dpi", type=int, default=300, help="for mm reporting on print formats")
    p.add_argument("--css", action="store_true", help="print only the CSS block")
    a = p.parse_args()

    if a.format:
        w, h = FORMATS[a.format]
    elif a.width and a.height:
        w, h = a.width, a.height
    else:
        p.error("give --format or --width and --height")

    short = min(w, h)
    base = a.baseline or max(4, snap(short / 135, 1))
    m = snap(short * a.margin, base)
    mt = snap(short * a.margin_top, base) if a.margin_top is not None else m
    mb = snap(short * a.margin_bottom, base) if a.margin_bottom is not None else m
    ms = snap(short * a.margin_outer, base) if a.margin_outer is not None else m
    me = snap(short * a.margin_inner, base) if a.margin_inner is not None else m

    safe = dict(SAFE_DEFAULTS.get(a.format, {}))
    if a.safe_top is not None:
        safe["top"] = a.safe_top
    if a.safe_bottom is not None:
        safe["bottom"] = a.safe_bottom
    # Live area must clear platform UI on vertical placements.
    mt = max(mt, snap_up(safe.get("top", 0), base))
    mb = max(mb, snap_up(safe.get("bottom", 0), base))

    gutter = max(base, snap(m * a.gutter, base))
    live_w = w - ms - me
    live_h = h - mt - mb
    col_w = (live_w - gutter * (a.columns - 1)) / a.columns
    row_h = (live_h - gutter * (a.rows - 1)) / a.rows if a.rows else None

    warnings = []
    if col_w < base * 6:
        warnings.append("columns narrower than 6 baseline units; reduce --columns")
    if live_h % base:
        warnings.append(f"live height {live_h}px is not a multiple of the {base}px baseline; adjust margins for exact rhythm")
    if a.rows and row_h and abs(row_h - round(row_h)) > 0.01:
        warnings.append("row height is fractional; modules will round differently — consider changing --rows")

    spec = {
        "canvas": {"width": w, "height": h, "aspect": round(w / h, 4)},
        "baseline": base,
        "margins": {"top": mt, "bottom": mb, "inline_start": ms, "inline_end": me},
        "live_area": {"width": live_w, "height": live_h},
        "columns": {"count": a.columns, "width": round(col_w, 2), "gutter": gutter},
        "rows": {"count": a.rows, "height": round(row_h, 2) if row_h else None, "gap": gutter} if a.rows else None,
        "column_edges": [round(ms + i * (col_w + gutter), 2) for i in range(a.columns)],
        "safe_area": safe or None,
        "warnings": warnings,
    }
    if a.format and a.format.startswith(("a4", "a3", "poster", "dl")):
        mm = lambda px: round(px / a.dpi * 25.4, 1)
        spec["print_mm"] = {"canvas": [mm(w), mm(h)], "margins": [mm(mt), mm(mb), mm(ms), mm(me)], "gutter": mm(gutter),
                            "note": "add 3 mm bleed outside trim; keep critical content 5 mm inside trim"}

    css = (
        ":root {\n"
        f"  --canvas-w: {w}px; --canvas-h: {h}px;\n"
        f"  --margin-top: {mt}px; --margin-bottom: {mb}px;\n"
        f"  --margin-inline-start: {ms}px; --margin-inline-end: {me}px;\n"
        f"  --columns: {a.columns}; --gutter: {gutter}px;\n"
        f"  --rows: {a.rows or 1}; --row-gap: {gutter}px; --baseline: {base}px;\n"
        "}"
    )
    if a.css:
        print(css)
        return
    spec["css"] = css
    json.dump(spec, sys.stdout, indent=2)
    print()


if __name__ == "__main__":
    main()
