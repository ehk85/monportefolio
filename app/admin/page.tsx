import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminTestimonialList } from "@/components/AdminTestimonialList";
import type { Testimonial } from "@/data/testimonialTypes";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return (
      <main className="min-h-screen bg-bg-primary px-6 py-24 text-ink-primary">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-heading text-2xl font-semibold">Supabase non configuré</h1>
          <p className="mt-3 text-sm text-ink-secondary">
            Ajoute NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans les variables
            d&apos;environnement pour activer la modération des avis.
          </p>
        </div>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, is_anonymous, company, comment, rating, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-bg-primary px-6 py-16 text-ink-primary">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">Avis en attente</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          Approuve pour publier sur le site, rejette pour ignorer définitivement.
        </p>

        {error ? (
          <p className="mt-10 text-sm text-red-400">
            Erreur de chargement : {error.message}
          </p>
        ) : (
          <AdminTestimonialList initialItems={(data ?? []) as Testimonial[]} />
        )}
      </div>
    </main>
  );
}
