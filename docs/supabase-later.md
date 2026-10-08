# Add Supabase later

This MVP runs without Postgres, Auth, Storage, or pgvector.

Today:
- Catalogue: `src/data/catalogue.json`
- Queue / ask log / quiz scores: `data/runtime-queue.json`
- Learner label: `pp_learner` cookie
- Admin: `pp_staff` cookie + `PARAMPARA_ADMIN_SECRET`

When you are ready:

1. Create a Supabase project.
2. Apply [`../supabase/migrations/20260903120000_parampara_path.sql`](../supabase/migrations/20260903120000_parampara_path.sql) (tables are prefixed `pp_`).
3. `npm install @supabase/ssr @supabase/supabase-js`
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Wire Auth, RLS, embeddings, and Storage as in the Research & Build Guide sections 21–26.

Do not start that work until the Discover → Ask → Quiz → Moderate loop is demo-stable locally.
