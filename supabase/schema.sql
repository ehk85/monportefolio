-- À exécuter une fois dans Supabase : Project > SQL Editor > New query > Run.

create extension if not exists pgcrypto;

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text,
  is_anonymous boolean not null default false,
  company text not null,
  comment text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

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
