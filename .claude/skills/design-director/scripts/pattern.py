#!/usr/bin/env python3
"""Original Islamic-geometric tiles generated from first principles (no third-party
licence). Each output is ONE seamless square tile: repeat it with CSS
`background: url(tile.svg) 0 0 / <size>px repeat`.

Patterns
  star8    8-point star lattice. --star 2 = {8/2} khatam (two overlapping squares), --star 3 = sharper {8/3}.
           Stars sit at tile centres with points touching the tile edges, so neighbouring
           stars meet point to point and the gaps between them form the classic crosses.
  rosette  8-fold rosette: star8 plus a second, rotated ring of petals; denser, more ornamental.
  kufi     square-Kufic-style maze bands (orthogonal strokes on a grid), for architectural texture.

  pattern.py star8   --size 160 --stroke "#8f3a1b" --width 3 --out tile.svg
  pattern.py star8   --star 3 --fill "#efe6d8" --stroke "#1e1611" --bg "#e3d6c3" --out tile.svg
  pattern.py rosette --size 200 --stroke "#c89b4a" --width 2 --opacity .5 --out tile.svg
  pattern.py kufi    --size 120 --stroke "#3f5b3a" --width 10 --out tile.svg
"""
import argparse
import math


def star_points(cx, cy, R, k):
    """{8/k} star polygon as 16 alternating outer/inner vertices."""
    # inner radius where the edges of the {8/k} star cross
    r = R * math.cos(math.pi * k / 8) / math.cos(math.pi * (k - 1) / 8)
    pts = []
    for i in range(16):
        ang = math.pi / 8 * i - math.pi / 2
        rad = R if i % 2 == 0 else r
        pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    return pts


def poly(pts, **attrs):
    d = " ".join(f"{x:.2f},{y:.2f}" for x, y in pts)
    a = " ".join(f'{k.replace("_", "-")}="{v}"' for k, v in attrs.items() if v is not None)
    return f'<polygon points="{d}" {a}/>'


def star8(s, k, fill, stroke, width):
    # One star per tile, outer points on the edge midpoints: neighbours meet point to
    # point and the leftover space between four stars is the cross. Nothing else
    # crosses the tile edge, so the tile is seamless. (v1 also put stars on the
    # corners; they overlapped into stepped shapes. Caught on the rendered sheet.)
    c = s / 2
    return [poly(star_points(c, c, c, k), fill=fill or "none", stroke=stroke, stroke_width=width, stroke_linejoin="round")]


def rosette(s, fill, stroke, width):
    shapes = star8(s, 3, fill, stroke, width)
    c = s / 2
    for cx, cy in ((c, c),):
        pts = star_points(cx, cy, c * 0.62, 2)
        rot = [(cx + (x - cx) * math.cos(math.pi / 8) - (y - cy) * math.sin(math.pi / 8),
                cy + (x - cx) * math.sin(math.pi / 8) + (y - cy) * math.cos(math.pi / 8)) for x, y in pts]
        shapes.append(poly(rot, fill="none", stroke=stroke, stroke_width=width * 0.8, stroke_linejoin="round"))
    return shapes


def kufi(s, stroke, width):
    # Square spiral (banna'i / square-Kufic motif) kept inside the tile so no stroke
    # is clipped at the edge. (v1 ran strokes along the tile edge; they rendered at half width.)
    u = s / 7
    path = [(u, 6 * u), (u, u), (6 * u, u), (6 * u, 6 * u), (2.5 * u, 6 * u), (2.5 * u, 2.5 * u),
            (4.5 * u, 2.5 * u), (4.5 * u, 4.5 * u), (3.5 * u, 4.5 * u)]
    d = "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in path)
    return [f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{width}" stroke-linecap="square" stroke-linejoin="miter"/>']


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("kind", choices=["star8", "rosette", "kufi"])
    p.add_argument("--size", type=int, default=160)
    p.add_argument("--star", type=int, choices=[2, 3], default=2)
    p.add_argument("--stroke", default="#000000")
    p.add_argument("--width", type=float, default=2)
    p.add_argument("--fill")
    p.add_argument("--bg")
    p.add_argument("--opacity", type=float, default=1.0)
    p.add_argument("--out", required=True)
    a = p.parse_args()
    s = a.size
    if a.kind == "star8":
        shapes = star8(s, a.star, a.fill, a.stroke, a.width)
    elif a.kind == "rosette":
        shapes = rosette(s, a.fill, a.stroke, a.width)
    else:
        shapes = kufi(s, a.stroke, a.width)
    bg = f'<rect width="{s}" height="{s}" fill="{a.bg}"/>' if a.bg else ""
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{s}" height="{s}" viewBox="0 0 {s} {s}">'
           f'<!-- design-director pattern.py {a.kind}: original geometry, no third-party licence -->'
           f'{bg}<g opacity="{a.opacity}">{"".join(shapes)}</g></svg>\n')
    with open(a.out, "w") as f:
        f.write(svg)
    print(f"wrote {a.out} ({a.kind}, {s}px tile)")


if __name__ == "__main__":
    main()
