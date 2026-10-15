// WCAG contrast helpers for brand accent colors (case-study pages).
// Accents are client brand colors; these helpers derive text-safe shades without
// touching the accent used for borders, dividers and decoration.

const INK = "#0a0a0a";
const WHITE = "#ffffff";
// Lightest/darkest page surfaces across both themes (see globals.css tokens).
const LIGHT_SURFACES = ["#f5f5f2", "#f2f2ef"];
const DARK_SURFACES = ["#0a0a0a", "#0b0b0c"];

function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex([r, g, b]: [number, number, number]) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function luminance(hex: string) {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function mix(a: string, b: string, t: number) {
  const [ra, ga, ba] = rgb(a);
  const [rb, gb, bb] = rgb(b);
  return toHex([ra + (rb - ra) * t, ga + (gb - ga) * t, ba + (bb - ba) * t]);
}

/** Shift `color` toward `toward` in 5% steps until it reaches `min` contrast on every surface. */
function ensureContrast(color: string, surfaces: string[], toward: string, min = 4.5) {
  for (let t = 0; t <= 1; t += 0.05) {
    const c = mix(color, toward, t);
    if (surfaces.every((s) => contrastRatio(c, s) >= min)) return c;
  }
  return toward;
}

/** CSS custom properties for an accent: text on light/dark surfaces, and a surface that carries white text. */
export function accentVars(accent: string): Record<string, string> {
  return {
    "--accent": accent,
    "--accent-on-light": ensureContrast(accent, LIGHT_SURFACES, INK),
    "--accent-on-dark": ensureContrast(accent, DARK_SURFACES, WHITE),
    "--accent-surface": ensureContrast(accent, [WHITE], INK),
  };
}
