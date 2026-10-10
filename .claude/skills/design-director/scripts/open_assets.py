#!/usr/bin/env python3
"""Open-licensed visual assets: find, copy, and credit them.

Every asset copied into a design is logged in that design's ASSETS.json
(source, licence, author, attribution text) so a delivery can always say where
each element came from and whether credit is required.

Sources reachable from the build environment (npm registry + PyPI). The icon
and pattern sets are fetched on demand into .cache/ (gitignored):
  icons     tabler (MIT, 5k+ outline/filled) · phosphor (MIT, 1.5k × 6 weights) · lucide (ISC, 1.8k)
  patterns  hero-patterns (MIT npm package by Alec Lomas; heropatterns.com states CC BY 4.0, so credit it)
  photos    vendored CC0 / public-domain photographs and textures (assets/open/photos/, see credits.json)
  geometric scripts/pattern.py generates original Islamic-geometric tilings (no third-party licence)

  open_assets.py fetch                                 download the icon/pattern packages into .cache/
  open_assets.py icons coffee cup --set all --limit 20 search names + tags
  open_assets.py copy tabler:coffee --style outline --to tests/cases/G/assets
  open_assets.py copy phosphor:coffee --style duotone --to DIR
  open_assets.py patterns                              list hero-pattern names
  open_assets.py pattern topography --color "#8f3a1b" --opacity .25 --to DIR
  open_assets.py photos                                list vendored photos with licence + credit
  open_assets.py photo coffee --to DIR
  open_assets.py credits DIR                           print the attribution block for a design
"""
import argparse
import datetime as dt
import json
import pathlib
import re
import shutil
import subprocess
import sys

SKILL = pathlib.Path(__file__).resolve().parent.parent
CACHE = SKILL / ".cache"
PHOTOS = SKILL / "assets" / "open" / "photos"

PACKAGES = {
    "tabler": ("@tabler/icons", "MIT", "Paweł Kuna and contributors", "https://tabler.io/icons"),
    "phosphor": ("@phosphor-icons/core", "MIT", "Phosphor Icons", "https://phosphoricons.com"),
    "lucide": ("lucide-static", "ISC", "Lucide Icons and contributors", "https://lucide.dev"),
    "hero-patterns": ("hero-patterns", "MIT (package); CC BY 4.0 (heropatterns.com)", "Steve Schoger (patterns), Alec Lomas (package)", "https://heropatterns.com"),
}


def pkg_dir(key):
    name = PACKAGES[key][0].lstrip("@").replace("/", "-")
    hits = sorted(CACHE.glob(f"{name}-*/package"))
    if not hits:
        sys.exit(f"{key} not fetched: run `open_assets.py fetch`")
    return hits[-1]


def fetch():
    CACHE.mkdir(exist_ok=True)
    for key, (npm, *_rest) in PACKAGES.items():
        name = npm.lstrip("@").replace("/", "-")
        if list(CACHE.glob(f"{name}-*/package")):
            print(f"{key}: cached")
            continue
        tgz = subprocess.run(["npm", "pack", npm, "--silent"], cwd=CACHE, capture_output=True, text=True, check=True).stdout.strip().splitlines()[-1]
        dest = CACHE / tgz[:-4]
        dest.mkdir(exist_ok=True)
        subprocess.run(["tar", "-xzf", tgz, "-C", str(dest)], cwd=CACHE, check=True)
        (CACHE / tgz).unlink()
        print(f"{key}: fetched {tgz[:-4]}")


def catalogue(which):
    out = []
    if which in ("tabler", "all"):
        for n, m in json.loads((pkg_dir("tabler") / "icons.json").read_text()).items():
            out.append(("tabler", n, m.get("tags", []) + [m.get("category", "")], list(m.get("styles", {}))))
    if which in ("lucide", "all"):
        for n, tags in json.loads((pkg_dir("lucide") / "tags.json").read_text()).items():
            out.append(("lucide", n, tags, ["outline"]))
    if which in ("phosphor", "all"):
        js = subprocess.run(["node", "-e", f"import('{pkg_dir('phosphor') / 'dist/index.mjs'}').then(m=>console.log(JSON.stringify(m.icons.map(i=>[i.name,i.tags.concat(i.categories)]))))"],
                            capture_output=True, text=True, check=True).stdout
        for n, tags in json.loads(js):
            out.append(("phosphor", n, tags, ["thin", "light", "regular", "bold", "fill", "duotone"]))
    return out


def svg_path(key, name, style):
    if key == "tabler":
        return pkg_dir("tabler") / "icons" / (style or "outline") / f"{name}.svg"
    if key == "lucide":
        return pkg_dir("lucide") / "icons" / f"{name}.svg"
    if key == "phosphor":
        style = style or "regular"
        suffix = "" if style == "regular" else f"-{style}"
        return pkg_dir("phosphor") / "assets" / style / f"{name}{suffix}.svg"
    sys.exit(f"unknown set {key}")


def log(to, entry):
    to.mkdir(parents=True, exist_ok=True)
    f = to / "ASSETS.json"
    data = json.loads(f.read_text()) if f.exists() else []
    data = [d for d in data if d["file"] != entry["file"]] + [entry]
    f.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def entry(file, key, name, extra=""):
    npm, lic, author, url = PACKAGES[key]
    return {"file": file, "asset": f"{key}:{name}{extra}", "source": f"npm {npm}", "license": lic, "author": author,
            "url": url, "attribution_required": "CC BY" in lic, "added": dt.date.today().isoformat()}


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("fetch")
    s = sub.add_parser("icons"); s.add_argument("terms", nargs="+"); s.add_argument("--set", default="all", choices=["all", "tabler", "phosphor", "lucide"]); s.add_argument("--limit", type=int, default=30)
    c = sub.add_parser("copy"); c.add_argument("ref", help="set:name"); c.add_argument("--style"); c.add_argument("--to", required=True); c.add_argument("--color", help="replace currentColor")
    sub.add_parser("patterns")
    pt = sub.add_parser("pattern"); pt.add_argument("name"); pt.add_argument("--color", default="#000000"); pt.add_argument("--opacity", type=float, default=0.4); pt.add_argument("--to", required=True)
    sub.add_parser("photos")
    ph = sub.add_parser("photo"); ph.add_argument("name"); ph.add_argument("--to", required=True)
    cr = sub.add_parser("credits"); cr.add_argument("dir")
    a = p.parse_args()

    if a.cmd == "fetch":
        fetch()
    elif a.cmd == "icons":
        terms = [t.lower() for t in a.terms]
        scored = []
        for key, name, tags, styles in catalogue(a.set):
            hay = " ".join([name] + [str(t) for t in tags]).lower()
            score = sum(3 if t in name else 1 for t in terms if t in hay)
            if score:
                scored.append((-score, key, name, styles))
        for _, key, name, styles in sorted(scored)[: a.limit]:
            print(f"{key}:{name}  [{', '.join(styles)}]")
        print(f"{len(scored)} match(es)")
    elif a.cmd == "copy":
        key, name = a.ref.split(":", 1)
        src = svg_path(key, name, a.style)
        if not src.exists():
            sys.exit(f"not found: {src}")
        to = pathlib.Path(a.to)
        fname = f"{key}-{name}{'-' + a.style if a.style else ''}.svg"
        svg = src.read_text()
        if a.color:
            svg = svg.replace("currentColor", a.color)
        (to / fname).parent.mkdir(parents=True, exist_ok=True)
        (to / fname).write_text(svg)
        log(to, entry(fname, key, name, f" ({a.style})" if a.style else ""))
        print(f"copied {to / fname}")
    elif a.cmd == "patterns":
        js = subprocess.run(["node", "-e", f"console.log(Object.keys(require('{next(pkg_dir('hero-patterns').glob('dist/*.cjs.js'))}')).join(' '))"], capture_output=True, text=True, check=True).stdout
        print(js.strip())
    elif a.cmd == "pattern":
        camel = re.sub(r"-(\w)", lambda m: m.group(1).upper(), a.name)
        js = subprocess.run(["node", "-e", f"const h=require('{next(pkg_dir('hero-patterns').glob('dist/*.cjs.js'))}'); if(!h['{camel}']) process.exit(3); console.log(h['{camel}']({json.dumps(a.color)}, {a.opacity}))"],
                            capture_output=True, text=True)
        if js.returncode:
            sys.exit(f"unknown pattern {a.name} (see `open_assets.py patterns`)")
        from urllib.parse import unquote
        svg = unquote(re.search(r"data:image/svg\+xml,(.*)'\)", js.stdout.strip()).group(1))
        to = pathlib.Path(a.to); to.mkdir(parents=True, exist_ok=True)
        fname = f"pattern-{a.name}.svg"
        (to / fname).write_text(svg)
        log(to, entry(fname, "hero-patterns", a.name, f" {a.color} @{a.opacity}"))
        print(f"wrote {to / fname}  (use as background-image: url({fname}); background-repeat: repeat)")
    elif a.cmd == "photos":
        for k, v in json.loads((PHOTOS / "credits.json").read_text()).items():
            print(f"{k:18} {v['file']:24} {v['size']:>9}  {v['license']:<14} {v['credit']}\n{'':18} use: {v['notes']}")
    elif a.cmd == "photo":
        credits = json.loads((PHOTOS / "credits.json").read_text())
        if a.name not in credits:
            sys.exit(f"unknown photo; choose from {', '.join(credits)}")
        v = credits[a.name]
        to = pathlib.Path(a.to); to.mkdir(parents=True, exist_ok=True)
        shutil.copy(PHOTOS / v["file"], to / v["file"])
        log(to, {"file": v["file"], "asset": f"photo:{a.name}", "source": v["source"], "license": v["license"], "author": v["credit"],
                 "url": v.get("url", ""), "attribution_required": False, "added": dt.date.today().isoformat()})
        print(f"copied {to / v['file']} ({v['size']}, {v['license']})")
    elif a.cmd == "credits":
        f = pathlib.Path(a.dir) / "ASSETS.json"
        if not f.exists():
            sys.exit("no ASSETS.json in that directory")
        data = json.loads(f.read_text())
        for d in data:
            flag = "  ← credit required" if d["attribution_required"] else ""
            print(f"{d['file']}: {d['asset']} · {d['license']} · {d['author']} · {d['url']}{flag}")


if __name__ == "__main__":
    main()
