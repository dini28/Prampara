"""Emit SQL to upsert languages + regions into pp_* tables."""
from __future__ import annotations

import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
cat = json.loads((root / "src" / "data" / "catalogue.json").read_text(encoding="utf-8"))

def esc(s: str) -> str:
    return s.replace("'", "''")

lines = ["-- Parampara Path seed: languages + regions"]
for lang in cat["languages"]:
    lines.append(
        f"insert into public.pp_languages (code, name) values ('{esc(lang['code'])}', '{esc(lang['name'])}') on conflict (code) do update set name = excluded.name;"
    )
for r in cat["regions"]:
    lines.append(
        "insert into public.pp_cultural_regions (id, slug, name, state_ut, zone, lat, lng, blurb) values ("
        f"'{r['id']}', '{esc(r['slug'])}', '{esc(r['name'])}', '{esc(r.get('state_ut') or '')}', "
        f"'{esc(r.get('zone') or '')}', {r['lat']}, {r['lng']}, '{esc(r['blurb'])}'"
        ") on conflict (slug) do update set name = excluded.name, blurb = excluded.blurb, lat = excluded.lat, lng = excluded.lng;"
    )

out = root / "supabase" / "seed_regions.sql"
out.write_text("\n".join(lines) + "\n", encoding="utf-8")
print("wrote", out, "statements", len(lines) - 1)
