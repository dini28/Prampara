import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const cat = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/catalogue.json"), "utf8")
);

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
const INDIA_UTS = [
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];
const ALL = [...INDIA_STATES, ...INDIA_UTS];

const types = ["festival", "craft", "performing", "oral", "ritual", "knowledge"];
const regionBySlug = Object.fromEntries(cat.regions.map((r) => [r.slug, r]));

const allItems = cat.items;
const published = allItems.filter((i) => i.published);
const unpublished = allItems.filter((i) => !i.published);

function lastChecked(item) {
  if (!item.sources?.length) return null;
  const dates = item.sources.map((s) => s.accessed_on).filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1] : null;
}

const matrix = {};
function ensure(st) {
  if (!matrix[st]) matrix[st] = Object.fromEntries(types.map((t) => [t, 0]));
}

const suspiciousHosts = /memeraki|medium\.com|blogspot|wordpress|pinterest/i;

const perCard = published.map((item) => {
  const region = regionBySlug[item.region_slug];
  const st = region?.state_ut ?? "(unknown region)";
  ensure(st);
  if (types.includes(item.type)) matrix[st][item.type] += 1;
  const srcCount = item.sources?.length ?? 0;
  const lc = lastChecked(item);
  const issues = [];
  if (srcCount === 0) issues.push("no sources");
  for (const s of item.sources || []) {
    if (!s.url?.trim()) issues.push(`empty url (${s.id})`);
    if (!s.title?.trim()) issues.push(`empty title (${s.id})`);
    if (!s.accessed_on?.trim()) issues.push(`no accessed_on (${s.id})`);
    if (s.url && !/^https?:\/\//i.test(s.url)) issues.push(`bad url scheme: ${s.url}`);
    if (s.url && suspiciousHosts.test(s.url)) issues.push(`non-official blog: ${s.url}`);
  }
  if (!region) issues.push(`orphan region_slug: ${item.region_slug}`);
  return {
    slug: item.slug,
    title: item.title,
    state_ut: st,
    region_slug: item.region_slug,
    type: item.type,
    source_count: srcCount,
    lastChecked: lc,
    needs_verification: issues.length > 0,
    issues,
    sensitivity_flag: item.sensitivity_flag,
    gi_flag: item.gi_flag,
    unesco_id: item.unesco_id,
    published: item.published,
  };
});

for (const item of unpublished) {
  const region = regionBySlug[item.region_slug];
  const st = region?.state_ut ?? "(unknown)";
  ensure(st);
}

const coveredFromItems = new Set(perCard.map((c) => c.state_ut).filter((x) => x !== "(unknown region)"));
const missing = ALL.filter((x) => !coveredFromItems.has(x));

const typeTotals = Object.fromEntries(types.map((t) => [t, 0]));
for (const c of perCard) typeTotals[c.type] += 1;

let noSources = 0;
let sourcesMissingAccessed = 0;
const urlCounts = {};
for (const item of published) {
  if (!item.sources?.length) noSources += 1;
  const seen = new Set();
  for (const s of item.sources || []) {
    if (!s.accessed_on?.trim()) sourcesMissingAccessed += 1;
    urlCounts[s.url] = (urlCounts[s.url] || 0) + 1;
    if (seen.has(s.url)) {
      /* within-item duplicate */
    }
    seen.add(s.url);
  }
}

const officialPatterns = /unesco\.org|culture\.gov\.in|indianculture\.gov\.in|sahapedia\.org/i;
const portalUrls = new Set();
for (const item of published) {
  for (const s of item.sources || []) {
    if (officialPatterns.test(s.url)) portalUrls.add(s.url);
  }
}

const itemsWithIssues = perCard.filter((c) => c.issues.length > 0);

const report = {
  data_locations: {
    heritage_cards: "src/data/catalogue.json",
    schema_types: "src/lib/types.ts",
    regions_in_catalogue: true,
    places: "src/data/places/*.ts (Rajasthan only MVP)",
    runtime_queue: "data/runtime-queue.json",
    supabase: "auth/session only (no heritage CMS)",
  },
  generated_on: cat.generated_on,
  regionCount: cat.regions.length,
  itemsTotal: allItems.length,
  itemsPublished: published.length,
  itemsUnpublished: unpublished.length,
  unpublishedSlugs: unpublished.map((i) => i.slug),
  typeTotals,
  coveredStates: [...coveredFromItems].sort(),
  coveredStatesCount: coveredFromItems.size,
  missingStates: missing.sort(),
  missingStatesCount: missing.length,
  regionsWithZeroPublishedItems: cat.regions
    .filter((r) => !published.some((i) => i.region_slug === r.slug))
    .map((r) => ({ slug: r.slug, state_ut: r.state_ut })),
  matrix,
  citationStats: {
    noSourcesPublished: noSources,
    sourceRowsMissingAccessed: sourcesMissingAccessed,
    itemsWithAnyCitationIssue: itemsWithIssues.length,
    topRepeatedUrls: Object.entries(urlCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([url, count]) => ({ url, count })),
  },
  officialPortalUrlsInSources: [...portalUrls].sort(),
  perCard,
  sampleCitationIssues: itemsWithIssues.slice(0, 25),
};

const outPath = path.join(root, ".audit-catalogue.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    {
      itemsPublished: report.itemsPublished,
      itemsTotal: report.itemsTotal,
      regions: report.regionCount,
      covered: report.coveredStatesCount,
      missing: report.missingStatesCount,
      typeTotals: report.typeTotals,
      citationIssues: report.citationStats.itemsWithAnyCitationIssue,
    },
    null,
    2
  )
);