#!/usr/bin/env node
// Validates the website-design skill: frontmatter, required files, internal links,
// empty/placeholder files, and that every rule/workflow/template is referenced from SKILL.md or README.md.
// Usage: node check-skill.mjs [skillDir]

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));
const errors = [];
const warnings = [];

const files = walk(root).filter((f) => !f.includes(`${path.sep}node_modules${path.sep}`));
const md = files.filter((f) => f.endsWith(".md"));

// 1. Frontmatter
const skillPath = path.join(root, "SKILL.md");
if (!existsSync(skillPath)) errors.push("SKILL.md missing");
else {
  const s = readFileSync(skillPath, "utf8");
  const m = s.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) errors.push("SKILL.md has no YAML frontmatter");
  else {
    const name = m[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const desc = m[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (!name || !/^[a-z0-9-]{1,64}$/.test(name)) errors.push(`invalid name: ${name}`);
    if (!desc) errors.push("missing description");
    else if (desc.length > 1024) errors.push(`description too long (${desc.length} > 1024)`);
    if (name && name !== path.basename(root)) warnings.push(`name "${name}" differs from folder "${path.basename(root)}"`);
  }
  const lines = s.split("\n").length;
  if (lines > 500) warnings.push(`SKILL.md is ${lines} lines; keep it concise (< 500)`);
}

// 2. Required structure
const required = [
  "README.md",
  "rules/art-direction.md", "rules/layout-and-grids.md", "rules/typography.md", "rules/responsive-design.md",
  "rules/ui-ux.md", "rules/animation.md", "rules/accessibility.md", "rules/performance.md", "rules/code-quality.md",
  "rules/rtl-arabic.md",
  "workflows/research.md", "workflows/design-planning.md", "workflows/implementation.md",
  "workflows/browser-testing.md", "workflows/design-review.md",
  "templates/project-brief.md", "templates/design-direction.md", "templates/reference-analysis.md", "templates/quality-report.md",
  "references/reference-directory.md", "references/ai-built-websites.md", "references/premium-website-design.md",
  "references/ui-ux-patterns.md", "references/animation-references.md", "references/open-source-projects.md",
  "references/technical-documentation.md", "references/motion-recipes.md",
  "evaluations/test-projects.md", "evaluations/acceptance-criteria.md", "evaluations/results.md",
  "scripts/visual-qa.mjs",
];
for (const r of required) if (!existsSync(path.join(root, r))) errors.push(`missing required file: ${r}`);

// 3. Empty / placeholder content (templates may contain {{placeholders}})
for (const f of md) {
  const rel = path.relative(root, f);
  const text = readFileSync(f, "utf8");
  const body = text.replace(/^---[\s\S]*?---/, "").trim();
  if (body.length < 400 && !rel.includes("evaluations/runs")) errors.push(`${rel}: suspiciously short (${body.length} chars)`);
  if (!rel.startsWith("templates") && /\b(TODO|TBD|FIXME)\b/.test(text)) warnings.push(`${rel}: contains TODO/TBD/FIXME`);
  if (!rel.startsWith("templates") && /\{\{[A-Za-z0-9 _./|-]+\}\}/.test(text) && !rel.includes("evaluations/runs")) warnings.push(`${rel}: contains {{template}} placeholders`);
}

// 4. Internal links: backticked paths like `rules/x.md` or `../rules/x.md`, and markdown links to .md
const linkRe = /`((?:\.\.\/)?(?:rules|workflows|templates|references|evaluations|scripts)\/[A-Za-z0-9_./-]+\.(?:md|mjs))`|\]\(((?!https?:)[^)#]+\.md)\)/g;
for (const f of md) {
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(linkRe)) {
    const target = m[1] || m[2];
    const fromFile = path.resolve(path.dirname(f), target);
    const fromRoot = path.resolve(root, target.replace(/^(\.\.\/)+/, ""));
    if (!existsSync(fromFile) && !existsSync(fromRoot)) errors.push(`${path.relative(root, f)}: broken link → ${target}`);
  }
}

// 5. Every rule/workflow/template reachable from SKILL.md or README.md
const entry = ["SKILL.md", "README.md"].map((p) => (existsSync(path.join(root, p)) ? readFileSync(path.join(root, p), "utf8") : "")).join("\n");
for (const dir of ["rules", "workflows", "templates"]) {
  for (const f of readdirSync(path.join(root, dir))) {
    if (!entry.includes(`${dir}/${f}`) && !entry.includes(f)) warnings.push(`${dir}/${f} is not referenced from SKILL.md or README.md`);
  }
}

for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`${md.length} markdown files, ${files.length} files total — ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    return statSync(p).isDirectory() ? (n === "node_modules" || n === "qa" ? [] : walk(p)) : [p];
  });
}
