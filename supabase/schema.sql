-- À exécuter une fois dans Supabase : Project > SQL Editor > New query > Run.

create extension if not exists pgcrypto;

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text,
  is_anonymous boolean not null default false,
  company text not null,
  comment text not null,
  rating numeric(2, 1) not null default 5,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- Si la table existait déjà avant l'ajout de la note : ajoute la colonne
-- et sa contrainte sans tout recréer (sans effet si déjà appliqué).
alter table public.testimonials add column if not exists rating numeric(2, 1) not null default 5;
alter table public.testimonials drop constraint if exists testimonials_rating_check;
alter table public.testimonials add constraint testimonials_rating_check
  check (rating >= 1 and rating <= 5 and (rating * 2) = round(rating * 2));

alter table public.testimonials enable row level security;

-- Tout le monde peut déposer un avis, toujours en statut "pending".
drop policy if exists "public can insert testimonials" on public.testimonials;
create policy "public can insert testimonials"
  on public.testimonials for insert
  to anon
  with check (status = 'pending');

-- Tout le monde peut lire uniquement les avis déjà approuvés.
drop policy if exists "public can read approved testimonials" on public.testimonials;
create policy "public can read approved testimonials"
  on public.testimonials for select
  to anon
  using (status = 'approved');

-- Filet de sécurité : même si le payload envoyé contenait un autre statut,
-- l'insertion est toujours forcée à "pending" côté base de données.
create or replace function public.force_pending_status()
returns trigger as $$
begin
  new.status := 'pending';
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists testimonials_force_pending on public.testimonials;
create trigger testimonials_force_pending
  before insert on public.testimonials
  for each row execute function public.force_pending_status();

-- La lecture/l'approbation des avis en attente se fait uniquement via la
-- clé "service_role" (routes API admin côté serveur), qui contourne la RLS.
