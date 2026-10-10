#!/usr/bin/env python3
"""Check that a font actually contains every character of the supplied copy
BEFORE choosing it — a face that lacks a glyph silently falls back to another
font at render time (qa.mjs catches that afterwards; this catches it first).

  glyph_coverage.py --copy copy.json  font1 [font2 ...]   fonts in CSS stack order; -v lists per-font gaps
  glyph_coverage.py --text "عرض خاص ٥٠٪" font.ttf
  glyph_coverage.py --inventory               list repo fonts with script coverage + OpenType features

Requires fontTools (pip install fonttools; plus brotli for .woff2).
"""
import argparse
import json
import pathlib
import sys
import unicodedata

try:
    from fontTools.ttLib import TTFont
except ImportError:
    sys.exit("fontTools missing: pip install fonttools")

REPO_FONTS = pathlib.Path(__file__).resolve().parents[4] / "src" / "fonts"
SKILL_FONTS = pathlib.Path(__file__).resolve().parents[1] / "assets" / "fonts"
IGNORABLE = {0x20, 0x0A, 0x0D, 0x09, 0x200C, 0x200D, 0x200E, 0x200F, 0x00AD, 0x2066, 0x2067, 0x2068, 0x2069}


def features(font):
    if "GSUB" not in font:
        return []
    return sorted({fr.FeatureTag for fr in font["GSUB"].table.FeatureList.FeatureRecord})


def inventory():
    import signal
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)  # allow piping into head
    for f in sorted(SKILL_FONTS.glob("*.woff2")) + sorted(REPO_FONTS.glob("*.[ot]tf")):
        t = TTFont(f)
        cmap = t.getBestCmap()
        name = t["name"].getDebugName(4)
        ar = sum(1 for c in cmap if 0x0600 <= c <= 0x06FF)
        la = sum(1 for c in cmap if 0x20 <= c <= 0x7E)
        harakat = all(c in cmap for c in range(0x064B, 0x0653))
        ar_digits = all(c in cmap for c in range(0x0660, 0x066A))
        axes = " · variable " + ",".join(f"{a.axisTag} {a.minValue:g}–{a.maxValue:g}" for a in t["fvar"].axes) if "fvar" in t else ""
        print(f"{f.name}\n  {name}{axes} · weight class {t['OS/2'].usWeightClass} · Arabic {ar} · Basic Latin {la}/95"
              f" · harakat {'yes' if harakat else 'no'} · Arabic-Indic digits {'yes' if ar_digits else 'no'}"
              f"\n  GSUB: {' '.join(features(t)) or '—'}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("fonts", nargs="*")
    p.add_argument("--copy")
    p.add_argument("--text")
    p.add_argument("--inventory", action="store_true")
    p.add_argument("--verbose", "-v", action="store_true", help="list each font's missing characters")
    a = p.parse_args()
    if a.inventory:
        return inventory()
    if a.copy:
        data = json.loads(pathlib.Path(a.copy).read_text(encoding="utf-8"))
        text = " ".join(v for k, v in data.items() if not k.startswith("_") and isinstance(v, str))
    elif a.text:
        text = a.text
    else:
        p.error("give --copy or --text")
    needed = sorted({ord(c) for c in text} - IGNORABLE)
    # Fonts are a stack (CSS font-family order): a character is fine if ANY font
    # in the stack has it. Report which font serves each character's script, and
    # fail only on characters no font covers (those would render in a fallback).
    cmaps = [(pathlib.Path(f).name, TTFont(f).getBestCmap()) for f in a.fonts]
    for name, cmap in cmaps:
        served = [c for c in needed if c in cmap]
        print(f"{name}: covers {len(served)}/{len(needed)} characters of the copy")
        if a.verbose:
            for c in needed:
                if c not in cmap:
                    print(f"   lacks U+{c:04X} {chr(c)!r} {unicodedata.name(chr(c), '?')}")
    missing = [c for c in needed if not any(c in cm for _, cm in cmaps)]
    if missing:
        print(f"STACK MISSING {len(missing)} — these will render in a fallback font:")
        for c in missing:
            print(f"   U+{c:04X} {chr(c)!r} {unicodedata.name(chr(c), '?')}")
    else:
        print("stack: complete")
    sys.exit(1 if missing else 0)


if __name__ == "__main__":
    main()
