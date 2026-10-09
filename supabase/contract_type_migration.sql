-- À exécuter une fois dans Supabase SQL Editor.
-- Ajoute un champ dédié "type de contrat" aux expériences (au lieu de
-- le glisser dans le texte de la période), et reprend les valeurs déjà
-- présentes dans les 8 expériences existantes.

alter table public.experiences add column if not exists contract_type text;
alter table public.experiences drop constraint if exists experiences_contract_type_check;
alter table public.experiences add constraint experiences_contract_type_check
  check (contract_type is null or contract_type in ('Stage', 'Stage alterné', 'Alternance', 'CDI', 'CDD', 'Freelance'));

update public.experiences set contract_type = 'Stage alterné', period = 'Fév. 2026 — Sept. 2026'
  where company = 'AFEO';
update public.experiences set contract_type = 'Alternance', period = 'Jan. 2025 — Sept. 2025'
  where company = 'Le Livre Scolaire';
update public.experiences set contract_type = 'Stage', period = 'Nov. 2024 — Jan. 2025'
  where company = 'InnovQube';
update public.experiences set contract_type = 'Stage', period = 'Sept. 2024 — Oct. 2024'
  where company = 'Nexora AI';
update public.experiences set contract_type = 'Alternance', period = 'Oct. 2023 — Août 2024'
  where company = 'Capgemini';
update public.experiences set contract_type = 'CDD'
  where company = 'WebTech';
update public.experiences set contract_type = 'Stage'
  where company = 'SUNU GROUP';
update public.experiences set contract_type = 'Stage'
  where company like 'SNDI%';
