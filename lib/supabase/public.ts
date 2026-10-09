import { createClient } from "@supabase/supabase-js";

/**
 * Client "anon" : utilisable côté serveur comme côté navigateur.
 * Les policies RLS limitent la lecture aux avis approuvés et l'écriture
 * force toujours status="pending" (voir supabase/schema.sql).
 * Renvoie null si les variables d'environnement ne sont pas configurées,
 * pour que le site continue de fonctionner (section vide) sans planter.
 */
export function getSupabasePublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
