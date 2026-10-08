# Parampara Path

Living Heritage Compass — student MVP for AICTE / SIH Heritage & Culture.

Unofficial learner tool. Not affiliated with the Ministry of Culture, UNESCO, AICTE, or Sahapedia.

## Loop

Discover → attributed card → grounded Ask (cite or refuse) → quiz → contribution that stays pending until a human accepts it.

## Stack (this phase)

- Next.js 15 App Router + Tailwind v4
- **40** team-written cards in [`src/data/catalogue.json`](src/data/catalogue.json)
- Spreadsheet seed: [`data/seed-heritage-cards.csv`](data/seed-heritage-cards.csv)
- Local JSON store: `data/runtime-queue.json` (contributions, ask log, quiz scores)
- Local learner cookie + admin secret (`parampara-demo`)
- **Supabase is not installed.** See [`docs/supabase-later.md`](docs/supabase-later.md)

## Run

```bash
cd parampara-path
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. Demo path: **Jaipur / Rajasthan → Kalbelia → Ask → Quiz → Contribute**.

Admin: `/admin` with secret `parampara-demo`.

## Demo reset

Delete `data/runtime-queue.json` to clear Ask logs, quiz scores, and the contribution queue.

## Regenerating cards

```bash
python scripts/generate_seed.py
```

## Scope lock (do not add)

AR/VR, native apps, social feed, payments, scraping ICP/Sahapedia wholesale, billed Google Maps.
