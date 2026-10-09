-- À exécuter dans Supabase : Project > SQL Editor > New query > Run.
-- Crée les tables "expériences" et "formations", gérables depuis /admin.

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  location text not null,
  region text not null check (region in ('lyon', 'paris', 'londres', 'abidjan')),
  period text not null,
  is_current boolean not null default false,
  missions text[] not null default '{}',
  stack text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.experiences enable row level security;

drop policy if exists "public can read experiences" on public.experiences;
create policy "public can read experiences"
  on public.experiences for select
  to anon
  using (true);

-- Écriture réservée à la clé "service_role" (routes /api/admin, protégées
-- par mot de passe côté middleware) — aucune policy d'insert/update/delete
-- pour "anon", donc le public ne peut jamais modifier ce contenu.

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  school text not null,
  location text not null,
  period text not null,
  is_current boolean not null default false,
  detail text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.education enable row level security;

drop policy if exists "public can read education" on public.education;
create policy "public can read education"
  on public.education for select
  to anon
  using (true);
