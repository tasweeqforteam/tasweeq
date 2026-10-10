#!/usr/bin/env node
// Render every .canvas in an HTML design to PNG (and optionally one PDF).
//
//   node render.mjs design.html --out out/name            -> out/name-1.png, -2.png ...
//   node render.mjs design.html --out out/name --grid     -> also out/name-1.grid.png with overlay
//   node render.mjs design.html --out out/name --scale 2  -> 2x pixel density
//   node render.mjs design.html --out out/name --pdf      -> out/name.pdf, one page per canvas
//
// Text is real text shaped by Chromium/HarfBuzz, so Arabic joining, ligatures
// and bidi ordering come from the engine. Output is a flattened raster (or a
// PDF with live text) — not a layered or editable design document.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { launch, openDesign } from "./pw.mjs";

const args = process.argv.slice(2);
const input = args[0];
const flag = (n) => args.includes(n);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
if (!input || flag("--help")) {
  console.log("usage: render.mjs <design.html> --out <prefix> [--scale N] [--grid] [--pdf]");
  process.exit(input ? 0 : 1);
}
const out = opt("--out", input.replace(/\.html?$/, ""));
const scale = Number(opt("--scale", "1"));
mkdirSync(path.dirname(path.resolve(out)), { recursive: true });

const browser = await launch();
try {
  const page = await openDesign(browser, input, scale);
  const canvases = await page.$$(".canvas");
  if (!canvases.length) throw new Error("no .canvas element found — wrap each artboard in <section class=\"canvas\">");
  const files = [];
  for (const [i, el] of canvases.entries()) {
    const file = `${out}-${i + 1}.png`;
    await el.screenshot({ path: file });
    files.push(file);
  }
  if (flag("--grid")) {
    // Inject a column overlay into any canvas that does not carry its own.
    await page.evaluate(() => {
      for (const cv of document.querySelectorAll(".canvas")) {
        if (cv.querySelector(".grid-overlay")) continue;
        const o = document.createElement("div");
        o.className = "grid-overlay";
        const n = parseInt(getComputedStyle(cv).getPropertyValue("--columns")) || 6;
        for (let i = 0; i < n; i++) o.appendChild(document.createElement("i"));
        cv.appendChild(o);
      }
      document.body.classList.add("show-grid");
    });
    for (const [i, el] of canvases.entries()) {
      const file = `${out}-${i + 1}.grid.png`;
      await el.screenshot({ path: file });
      files.push(file);
    }
    await page.evaluate(() => document.body.classList.remove("show-grid"));
  }
  if (flag("--pdf")) {
    const box = await canvases[0].boundingBox();
    await page.addStyleTag({ content: `html,body{background:none!important}.canvas+.canvas{margin-top:0!important}.canvas{break-after:page}@page{margin:0}` });
    await page.pdf({ path: `${out}.pdf`, width: `${box.width}px`, height: `${box.height}px`, printBackground: true });
    files.push(`${out}.pdf`);
  }
  console.log(files.join("\n"));
} finally {
  await browser.close();
}
