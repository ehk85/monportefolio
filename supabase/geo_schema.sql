-- À exécuter dans Supabase SQL Editor.
-- Rend le globe entièrement dynamique : les villes/pays ne sont plus figés
-- dans le code, ils peuvent être ajoutés depuis /admin/experiences.

create table if not exists public.regions (
  key text primary key,
  label text not null,
  country text not null,
  country_code text not null,
  lat double precision not null,
  lng double precision not null,
  map_x double precision not null,
  map_y double precision not null,
  created_at timestamptz not null default now()
);

alter table public.regions enable row level security;
drop policy if exists "public can read regions" on public.regions;
create policy "public can read regions"
  on public.regions for select
  to anon
  using (true);

create table if not exists public.country_maps (
  country_code text primary key,
  points jsonb not null,
  center_lng double precision not null,
  center_lat double precision not null,
  cos_lat double precision not null,
  max_abs double precision not null,
  created_at timestamptz not null default now()
);

alter table public.country_maps enable row level security;
drop policy if exists "public can read country maps" on public.country_maps;
create policy "public can read country maps"
  on public.country_maps for select
  to anon
  using (true);

-- Écriture réservée à la clé service_role (routes /api/admin), comme pour
-- les autres tables de contenu.
