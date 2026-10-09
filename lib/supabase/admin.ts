import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client "service role" : contourne les policies RLS (lecture des avis en
 * attente, changement de statut). Ne doit JAMAIS être importé depuis un
 * composant client — le `import "server-only"` ci-dessus fait planter le
 * build si c'était le cas, par sécurité.
 */
export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
    // Next.js patche `fetch` et met en cache les requêtes GET par défaut,
    // même sur une route marquée force-dynamic. On désactive ce cache
    // explicitement pour que /admin voie toujours les derniers avis.
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
