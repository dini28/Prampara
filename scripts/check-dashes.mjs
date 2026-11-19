#!/usr/bin/env node
/**
 * Fails if em dash (—) or en dash (–) appears in content/component source.
 * Compound hyphens in code identifiers are allowed.
 */
import { readdirSync, readFileSync, statSync } from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "src");
const ALLOWED_EXT = new Set([".ts", ".tsx", ".json", ".md", ".css"]);
const BAD = /[—–]/;
const report = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(full);
      continue;
    }
    const ext = path.extname(name);
    if (!ALLOWED_EXT.has(ext)) continue;
    const text = readFileSync(full, "utf8");
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (BAD.test(line)) {
        report.push(`${path.relative(process.cwd(), full)}:${i + 1}: ${line.trim().slice(0, 120)}`);
      }
    });
  }
}

walk(ROOT);
// also check top-level product docs that ship with the site story
for (const doc of ["DESIGN.md", "PRODUCT.md", "README.md"]) {
  try {
    const text = readFileSync(path.join(process.cwd(), doc), "utf8");
    text.split(/\r?\n/).forEach((line, i) => {
      if (BAD.test(line)) {
        report.push(`${doc}:${i + 1}: ${line.trim().slice(0, 120)}`);
      }
    });
  } catch {
    /* optional */
  }
}

if (report.length) {
  console.error(`Dash punctuation check failed (${report.length} hits):\n`);
  for (const row of report.slice(0, 80)) console.error(row);
  if (report.length > 80) console.error(`… and ${report.length - 80} more`);
  process.exit(1);
}

console.log("Dash punctuation check passed (no em/en dashes in src or product docs).");
