-- Parampara Path schema. Prefixed pp_ so it can coexist with other public tables.
-- Do not alter marketplace / existing app tables.

create extension if not exists vector;
create extension if not exists pg_trgm;

do $$ begin
  create type public.pp_item_type as enum (
    'festival', 'craft', 'performing', 'oral', 'ritual', 'knowledge'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.pp_role as enum ('user', 'reviewer', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.pp_contrib_status as enum ('pending', 'accepted', 'rejected');
exception when duplicate_object then null;
end $$;

create table if not exists public.pp_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role public.pp_role not null default 'user',
  locale text not null default 'en',
  created_at timestamptz not null default now()
);

create table if not exists public.pp_cultural_regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  state_ut text,
  zone text,
  lat double precision,
  lng double precision,
  blurb text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.pp_languages (
  code text primary key,
  name text not null
);

create table if not exists public.pp_heritage_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type public.pp_item_type not null,
  title text not null,
  summary text not null,
  body text not null,
  unesco_id text,
  gi_flag boolean not null default false,
  region_id uuid references public.pp_cultural_regions (id) on delete set null,
  calendar_note text,
  sensitivity_flag boolean not null default false,
  published boolean not null default false,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pp_item_sources (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.pp_heritage_items (id) on delete cascade,
  url text not null,
  title text not null,
  publisher text,
  accessed_on date
);

create table if not exists public.pp_item_languages (
  item_id uuid not null references public.pp_heritage_items (id) on delete cascade,
  language_code text not null references public.pp_languages (code) on delete cascade,
  primary key (item_id, language_code)
);

create table if not exists public.pp_stories (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.pp_heritage_items (id) on delete cascade,
  title text not null,
  body text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.pp_quizzes (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null unique references public.pp_heritage_items (id) on delete cascade,
  title text not null
);

create table if not exists public.pp_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.pp_quizzes (id) on delete cascade,
  prompt text not null,
  options jsonb not null,
  answer_index int not null,
  explanation text,
  sort_order int not null default 0
);

create table if not exists public.pp_user_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id uuid not null references public.pp_heritage_items (id) on delete cascade,
  quiz_id uuid references public.pp_quizzes (id) on delete set null,
  score int,
  completed_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table if not exists public.pp_bookmarks (
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id uuid not null references public.pp_heritage_items (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table if not exists public.pp_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id uuid not null references public.pp_heritage_items (id) on delete cascade,
  body text not null,
  media_path text,
  status public.pp_contrib_status not null default 'pending',
  reviewer_id uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table if not exists public.pp_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.pp_heritage_embeddings (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.pp_heritage_items (id) on delete cascade,
  chunk text not null,
  embedding vector(1536)
);

create table if not exists public.pp_ask_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  item_id uuid references public.pp_heritage_items (id) on delete set null,
  question text not null,
  retrieved_ids uuid[] not null default '{}',
  refused boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists pp_items_published_idx on public.pp_heritage_items (published);
create index if not exists pp_items_region_idx on public.pp_heritage_items (region_id);
create index if not exists pp_items_type_idx on public.pp_heritage_items (type);
create index if not exists pp_items_fts_idx on public.pp_heritage_items
  using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(body, '')));
create index if not exists pp_items_trgm_idx on public.pp_heritage_items using gin (title gin_trgm_ops);
create index if not exists pp_embed_item_idx on public.pp_heritage_embeddings (item_id);

create schema if not exists parampara_private;

create or replace function parampara_private.pp_is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.pp_profiles
    where id = (select auth.uid())
      and role in ('admin', 'reviewer')
  );
$$;

revoke all on function parampara_private.pp_is_staff() from public;
grant execute on function parampara_private.pp_is_staff() to authenticated;

alter table public.pp_profiles enable row level security;
alter table public.pp_cultural_regions enable row level security;
alter table public.pp_languages enable row level security;
alter table public.pp_heritage_items enable row level security;
alter table public.pp_item_sources enable row level security;
alter table public.pp_item_languages enable row level security;
alter table public.pp_stories enable row level security;
alter table public.pp_quizzes enable row level security;
alter table public.pp_questions enable row level security;
alter table public.pp_user_progress enable row level security;
alter table public.pp_bookmarks enable row level security;
alter table public.pp_contributions enable row level security;
alter table public.pp_reports enable row level security;
alter table public.pp_heritage_embeddings enable row level security;
alter table public.pp_ask_events enable row level security;

-- Public read of published catalogue
create policy pp_regions_read on public.pp_cultural_regions for select to anon, authenticated using (true);
create policy pp_languages_read on public.pp_languages for select to anon, authenticated using (true);
create policy pp_items_public_read on public.pp_heritage_items
  for select to anon, authenticated using (published = true);
create policy pp_items_staff_all on public.pp_heritage_items
  for all to authenticated
  using (parampara_private.pp_is_staff())
  with check (parampara_private.pp_is_staff());
create policy pp_sources_public_read on public.pp_item_sources
  for select to anon, authenticated
  using (exists (select 1 from public.pp_heritage_items i where i.id = item_id and i.published));
create policy pp_sources_staff_all on public.pp_item_sources
  for all to authenticated
  using (parampara_private.pp_is_staff())
  with check (parampara_private.pp_is_staff());
create policy pp_item_lang_read on public.pp_item_languages for select to anon, authenticated using (true);
create policy pp_stories_read on public.pp_stories
  for select to anon, authenticated using (published = true);
create policy pp_quizzes_read on public.pp_quizzes for select to anon, authenticated using (true);
create policy pp_questions_read on public.pp_questions for select to anon, authenticated using (true);

create policy pp_profiles_self_select on public.pp_profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy pp_profiles_self_insert on public.pp_profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy pp_profiles_self_update on public.pp_profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id and role = (select p.role from public.pp_profiles p where p.id = (select auth.uid())));
create policy pp_profiles_staff_select on public.pp_profiles
  for select to authenticated using (parampara_private.pp_is_staff());

create policy pp_progress_own on public.pp_user_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy pp_progress_own_upsert on public.pp_user_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy pp_progress_own_update on public.pp_user_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy pp_bookmarks_own_select on public.pp_bookmarks
  for select to authenticated using ((select auth.uid()) = user_id);
create policy pp_bookmarks_own_insert on public.pp_bookmarks
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy pp_bookmarks_own_delete on public.pp_bookmarks
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy pp_contrib_own_select on public.pp_contributions
  for select to authenticated using ((select auth.uid()) = user_id or parampara_private.pp_is_staff());
create policy pp_contrib_own_insert on public.pp_contributions
  for insert to authenticated with check ((select auth.uid()) = user_id and status = 'pending');
create policy pp_contrib_staff_update on public.pp_contributions
  for update to authenticated
  using (parampara_private.pp_is_staff())
  with check (parampara_private.pp_is_staff());

create policy pp_reports_own_insert on public.pp_reports
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy pp_reports_staff_select on public.pp_reports
  for select to authenticated using (parampara_private.pp_is_staff());

create policy pp_embed_staff on public.pp_heritage_embeddings
  for all to authenticated
  using (parampara_private.pp_is_staff())
  with check (parampara_private.pp_is_staff());

create policy pp_ask_own_insert on public.pp_ask_events
  for insert to authenticated with check (user_id is null or (select auth.uid()) = user_id);
create policy pp_ask_staff_select on public.pp_ask_events
  for select to authenticated using (parampara_private.pp_is_staff());

grant usage on schema public to anon, authenticated;
grant select on public.pp_cultural_regions, public.pp_languages, public.pp_heritage_items,
  public.pp_item_sources, public.pp_item_languages, public.pp_stories, public.pp_quizzes, public.pp_questions
  to anon, authenticated;
grant select, insert, update on public.pp_profiles to authenticated;
grant select, insert, update, delete on public.pp_bookmarks to authenticated;
grant select, insert, update on public.pp_user_progress to authenticated;
grant select, insert, update on public.pp_contributions to authenticated;
grant select, insert on public.pp_reports to authenticated;
grant select, insert on public.pp_ask_events to authenticated;
grant select, insert, update, delete on public.pp_heritage_items, public.pp_item_sources,
  public.pp_heritage_embeddings, public.pp_stories, public.pp_quizzes, public.pp_questions
  to authenticated;
grant usage on schema parampara_private to authenticated;
