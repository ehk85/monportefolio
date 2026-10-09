-- À exécuter dans Supabase SQL Editor, après geo_schema.sql et geo_seed.sql.
-- La région d'une expérience n'est plus limitée aux 4 valeurs d'origine
-- (lyon/paris/londres/abidjan) : elle est maintenant validée dynamiquement
-- côté API contre la table public.regions (voir app/api/admin/experiences).
alter table public.experiences drop constraint if exists experiences_region_check;
