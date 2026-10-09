import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/AdminNav";
import { AdminExperienceManager } from "@/components/AdminExperienceManager";
import type { Experience } from "@/data/experiences";
import type { Region } from "@/data/region";

export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return (
      <main className="min-h-screen bg-bg-primary px-6 py-16 text-ink-primary">
        <div className="mx-auto max-w-3xl">
          <AdminNav active="experiences" />
          <p className="text-sm text-ink-secondary">Supabase non configuré.</p>
        </div>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("experiences")
    .select(
      "id, role, company, location, region, period, contract_type, is_current, missions, stack, sort_order"
    )
    .order("sort_order", { ascending: true });

  const { data: regionRows } = await supabase
    .from("regions")
    .select("key, label, country, country_code, lat, lng, map_x, map_y")
    .order("label", { ascending: true });

  const regions: Region[] = (regionRows ?? []).map((row) => ({
    key: row.key,
    label: row.label,
    country: row.country,
    countryCode: row.country_code,
    lat: row.lat,
    lng: row.lng,
    mapX: row.map_x,
    mapY: row.map_y,
  }));

  const items: Experience[] = (data ?? []).map((row) => ({
    id: row.id,
    role: row.role,
    company: row.company,
    location: row.location,
    region: row.region,
    period: row.period,
    contractType: row.contract_type,
    current: row.is_current,
    missions: row.missions ?? [],
    stack: row.stack ?? [],
    sort_order: row.sort_order,
  }));

  return (
    <main className="min-h-screen bg-bg-primary px-6 py-16 text-ink-primary">
      <div className="mx-auto max-w-3xl">
        <AdminNav active="experiences" />
        <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
          Expériences professionnelles
        </h1>
        <p className="mt-2 text-sm text-ink-secondary">
          Visibles immédiatement sur le site (sous 2 min). Pour une nouvelle ville, utilise le
          bouton « + » à côté de la zone géographique : sa carte de pays sera générée
          automatiquement.
        </p>

        {error ? (
          <p className="mt-10 text-sm text-red-400">Erreur de chargement : {error.message}</p>
        ) : (
          <AdminExperienceManager initialItems={items} regions={regions} />
        )}
      </div>
    </main>
  );
}
