import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { regions, type RegionKey } from "@/data/experiences";

function linesToArray(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase non configuré." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const payload = (body ?? {}) as Record<string, unknown>;

  if (payload.action === "move") {
    const direction = payload.direction === "up" ? "up" : "down";
    const { data: all, error: listError } = await supabase
      .from("experiences")
      .select("id, sort_order")
      .order("sort_order", { ascending: true });
    if (listError || !all) {
      return NextResponse.json({ error: "Échec du chargement." }, { status: 500 });
    }
    const index = all.findIndex((row) => row.id === params.id);
    const neighborIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || neighborIndex < 0 || neighborIndex >= all.length) {
      return NextResponse.json({ ok: true }); // déjà en bout de liste, rien à faire
    }
    const current = all[index];
    const neighbor = all[neighborIndex];
    await supabase.from("experiences").update({ sort_order: neighbor.sort_order }).eq("id", current.id);
    await supabase.from("experiences").update({ sort_order: current.sort_order }).eq("id", neighbor.id);
    return NextResponse.json({ ok: true });
  }

  const { role, company, location, region, period, isCurrent, missions, stack } = payload;

  if (typeof role !== "string" || role.trim().length === 0) {
    return NextResponse.json({ error: "Le poste est requis." }, { status: 400 });
  }
  if (typeof company !== "string" || company.trim().length === 0) {
    return NextResponse.json({ error: "L'entreprise est requise." }, { status: 400 });
  }
  if (typeof location !== "string" || location.trim().length === 0) {
    return NextResponse.json({ error: "Le lieu est requis." }, { status: 400 });
  }
  if (typeof period !== "string" || period.trim().length === 0) {
    return NextResponse.json({ error: "La période est requise." }, { status: 400 });
  }
  if (typeof region !== "string" || !(region in regions)) {
    return NextResponse.json(
      { error: "Zone géographique invalide (lyon, paris, londres ou abidjan)." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("experiences")
    .update({
      role: role.trim(),
      company: company.trim(),
      location: location.trim(),
      region: region as RegionKey,
      period: period.trim(),
      is_current: Boolean(isCurrent),
      missions: linesToArray(missions),
      stack: linesToArray(stack),
    })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Échec de la mise à jour." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase non configuré." }, { status: 503 });
  }
  const { error } = await supabase.from("experiences").delete().eq("id", params.id);
  if (error) {
    return NextResponse.json({ error: "Échec de la suppression." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
