import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "src/data/places");

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts"));
const relatedCardSlugs = new Set();
const counts = {};

for (const f of files) {
  const t = fs.readFileSync(path.join(dir, f), "utf8");
  const n = (re) => (t.match(re) || []).length;
  counts[f] = {
    destinations: n(/kind: "(state|city)"/g),
    places: n(/category: "/g),
    experiences: n(/type: "(food|travel|stay_tip|event)"/g),
    modern_items: n(/theme: "/g),
    meanings: n(/object_type: "/g),
    itineraries: n(/duration_days:/g),
    local_partners: n(/kind: "(artisan|community_experience|family_eatery|certified_guide)"/g),
    official_support_links: n(/official_support_links:/g),
    hero_images: n(/hero_image:/g),
  };
  const blocks = [...t.matchAll(/related_card_slugs:\s*\[([\s\S]*?)\]/g)];
  for (const b of blocks) {
    for (const s of b[1].match(/"([^"]+)"/g) || []) {
      relatedCardSlugs.add(s.replace(/"/g, ""));
    }
  }
}

const totals = Object.values(counts).reduce(
  (acc, row) => {
    for (const [k, v] of Object.entries(row)) acc[k] = (acc[k] || 0) + v;
    return acc;
  },
  {}
);

console.log(JSON.stringify({ perFile: counts, totals, relatedCardSlugs: [...relatedCardSlugs].sort() }, null, 2));