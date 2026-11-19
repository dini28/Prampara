/**
 * Coverage of India report: states/UTs × heritage type gap matrix.
 * Usage: node scripts/coverage-report.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const cat = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/catalogue.json"), "utf8"),
);

const INDIA_STATES = [
  { slug: "andaman-and-nicobar", name: "Andaman and Nicobar Islands" },
  { slug: "andhra-pradesh", name: "Andhra Pradesh" },
  { slug: "arunachal-pradesh", name: "Arunachal Pradesh" },
  { slug: "assam", name: "Assam" },
  { slug: "bihar", name: "Bihar" },
  { slug: "chandigarh", name: "Chandigarh" },
  { slug: "chhattisgarh", name: "Chhattisgarh" },
  { slug: "dadra-daman-diu", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { slug: "delhi", name: "Delhi" },
  { slug: "goa", name: "Goa" },
  { slug: "gujarat", name: "Gujarat" },
  { slug: "haryana", name: "Haryana" },
  { slug: "himachal-pradesh", name: "Himachal Pradesh" },
  { slug: "jharkhand", name: "Jharkhand" },
  { slug: "jammu-kashmir", name: "Jammu and Kashmir" },
  { slug: "karnataka", name: "Karnataka" },
  { slug: "kerala", name: "Kerala" },
  { slug: "ladakh", name: "Ladakh" },
  { slug: "lakshadweep", name: "Lakshadweep" },
  { slug: "maharashtra", name: "Maharashtra" },
  { slug: "meghalaya", name: "Meghalaya" },
  { slug: "manipur", name: "Manipur" },
  { slug: "madhya-pradesh", name: "Madhya Pradesh" },
  { slug: "mizoram", name: "Mizoram" },
  { slug: "nagaland", name: "Nagaland" },
  { slug: "odisha", name: "Odisha" },
  { slug: "punjab", name: "Punjab" },
  { slug: "puducherry", name: "Puducherry" },
  { slug: "rajasthan", name: "Rajasthan" },
  { slug: "sikkim", name: "Sikkim" },
  { slug: "telangana", name: "Telangana" },
  { slug: "tamil-nadu", name: "Tamil Nadu" },
  { slug: "tripura", name: "Tripura" },
  { slug: "uttar-pradesh", name: "Uttar Pradesh" },
  { slug: "uttarakhand", name: "Uttarakhand" },
  { slug: "west-bengal", name: "West Bengal" },
];

const TYPES = ["festival", "craft", "performing", "oral", "ritual", "knowledge"];

const published = cat.items.filter((i) => i.published);
const byState = {};
for (const s of INDIA_STATES) {
  byState[s.slug] = { name: s.name, count: 0, types: Object.fromEntries(TYPES.map((t) => [t, 0])), slugs: [] };
}

for (const item of published) {
  const slug = item.region_slug;
  if (!byState[slug]) {
    byState[slug] = {
      name: item.region_slug,
      count: 0,
      types: Object.fromEntries(TYPES.map((t) => [t, 0])),
      slugs: [],
    };
  }
  byState[slug].count += 1;
  byState[slug].slugs.push(item.slug);
  if (TYPES.includes(item.type)) byState[slug].types[item.type] += 1;
}

const covered = INDIA_STATES.filter((s) => byState[s.slug].count > 0);
const missing = INDIA_STATES.filter((s) => byState[s.slug].count === 0);

const report = {
  generated_on: new Date().toISOString().slice(0, 10),
  published_cards: published.length,
  regions_in_catalogue: cat.regions.length,
  states_uts_total: INDIA_STATES.length,
  states_uts_covered: covered.length,
  states_uts_missing: missing.map((s) => s.slug),
  by_state: byState,
};

const outDir = path.join(root, "docs");
fs.mkdirSync(outDir, { recursive: true });
const jsonPath = path.join(outDir, "coverage-report.json");
fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");

const lines = [
  "# Coverage of India",
  "",
  `Generated: ${report.generated_on}`,
  "",
  `- Published cards: **${report.published_cards}**`,
  `- States/UTs covered: **${report.states_uts_covered} / ${report.states_uts_total}**`,
  `- Catalogue regions: **${report.regions_in_catalogue}**`,
  "",
  "## Gaps (no published card yet)",
  "",
];
if (missing.length === 0) {
  lines.push("_None. Every state/UT has at least one published card._", "");
} else {
  for (const s of missing) lines.push(`- ${s.name} (\`${s.slug}\`)`);
  lines.push("");
}

lines.push("## Matrix (state × type counts)", "", "| State / UT | Total | " + TYPES.join(" | ") + " |", "|---|---:|" + TYPES.map(() => "---:").join("|") + "|");
for (const s of INDIA_STATES) {
  const row = byState[s.slug];
  lines.push(
    `| ${s.name} | ${row.count} | ${TYPES.map((t) => row.types[t]).join(" | ")} |`,
  );
}

const mdPath = path.join(outDir, "coverage-report.md");
fs.writeFileSync(mdPath, lines.join("\n") + "\n", "utf8");

console.log(
  `Coverage ${covered.length}/${INDIA_STATES.length} · cards ${published.length} · wrote ${path.relative(root, mdPath)}`,
);
if (missing.length) {
  console.log("Missing:", missing.map((s) => s.slug).join(", "));
  process.exitCode = 0;
}
