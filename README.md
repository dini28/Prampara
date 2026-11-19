# Parampara Path

Living Heritage Compass — student MVP for AICTE / SIH Heritage & Culture.

Unofficial learner tool. Not affiliated with the Ministry of Culture, UNESCO, AICTE, or Sahapedia.

## Loop

Discover → attributed card → grounded Ask (cite or refuse) → quiz → contribution that stays pending until a human accepts it.

## Stack (this phase)

- Next.js 15 App Router + Tailwind v4
- **40** team-written cards in [`src/data/catalogue.json`](src/data/catalogue.json)
- Spreadsheet seed: [`data/seed-heritage-cards.csv`](data/seed-heritage-cards.csv)
- Local JSON store: `data/runtime-queue.json` (contributions, ask log, quiz scores, audit)
- Learner cookie + secured reviewer desk (obscure path, hashed secret, httpOnly session, CSRF)
- Installable PWA (manifest + service worker), mobile bottom nav, Leaflet map
- **Supabase is not installed.** See [`docs/supabase-later.md`](docs/supabase-later.md)

## Run

```bash
cd parampara-path
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. Demo path: **Jaipur / Rajasthan → Kalbelia → Ask → Quiz → Contribute**.

### Reviewer desk (not linked publicly)

Set `PARAMPARA_ADMIN_PATH` (default `desk-k9m2x7q`) and open:

`http://localhost:3000/<PARAMPARA_ADMIN_PATH>`

Demo secret: `parampara-demo` (override with `PARAMPARA_ADMIN_SECRET` or a scrypt hash via `scripts/hash-admin-secret.mjs`).

`/admin` returns 404 on purpose.

## Demo reset

Delete `data/runtime-queue.json` to clear Ask logs, quiz scores, the contribution queue, and the audit log.

## Regenerating cards

```bash
python scripts/generate_seed.py
```

## Scope lock (do not add)

AR/VR, native apps, social feed, payments, scraping ICP/Sahapedia wholesale, billed Google Maps.
