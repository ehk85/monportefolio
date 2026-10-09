import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/AdminNav";
import { AdminEducationManager } from "@/components/AdminEducationManager";
import type { Education } from "@/data/education";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return (
      <main className="min-h-screen bg-bg-primary px-6 py-16 text-ink-primary">
        <div className="mx-auto max-w-3xl">
          <AdminNav active="education" />
          <p className="text-sm text-ink-secondary">Supabase non configuré.</p>
        </div>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("education")
    .select("id, degree, school, location, period, is_current, detail, sort_order")
    .order("sort_order", { ascending: true });

  const items: Education[] = (data ?? []).map((row) => ({
    id: row.id,
    degree: row.degree,
    school: row.school,
    location: row.location,
    period: row.period,
    current: row.is_current,
    detail: row.detail ?? undefined,
    sort_order: row.sort_order,
  }));

  return (
    <main className="min-h-screen bg-bg-primary px-6 py-16 text-ink-primary">
      <div className="mx-auto max-w-3xl">
        <AdminNav active="education" />
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Diplômes &amp; Formations
        </h1>
        <p className="mt-2 text-sm text-ink-secondary">
          Visibles immédiatement sur le site (sous 2 min).
        </p>

        {error ? (
          <p className="mt-10 text-sm text-red-400">Erreur de chargement : {error.message}</p>
        ) : (
          <AdminEducationManager initialItems={items} />
        )}
      </div>
    </main>
  );
}
