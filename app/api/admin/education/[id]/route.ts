import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

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
      .from("education")
      .select("id, sort_order")
      .order("sort_order", { ascending: true });
    if (listError || !all) {
      return NextResponse.json({ error: "Échec du chargement." }, { status: 500 });
    }
    const index = all.findIndex((row) => row.id === params.id);
    const neighborIndex = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || neighborIndex < 0 || neighborIndex >= all.length) {
      return NextResponse.json({ ok: true });
    }
    const current = all[index];
    const neighbor = all[neighborIndex];
    await supabase.from("education").update({ sort_order: neighbor.sort_order }).eq("id", current.id);
    await supabase.from("education").update({ sort_order: current.sort_order }).eq("id", neighbor.id);
    return NextResponse.json({ ok: true });
  }

  const { degree, school, location, period, isCurrent, detail } = payload;

  if (typeof degree !== "string" || degree.trim().length === 0) {
    return NextResponse.json({ error: "Le diplôme est requis." }, { status: 400 });
  }
  if (typeof school !== "string" || school.trim().length === 0) {
    return NextResponse.json({ error: "L'établissement est requis." }, { status: 400 });
  }
  if (typeof location !== "string" || location.trim().length === 0) {
    return NextResponse.json({ error: "Le lieu est requis." }, { status: 400 });
  }
  if (typeof period !== "string" || period.trim().length === 0) {
    return NextResponse.json({ error: "La période est requise." }, { status: 400 });
  }

  const { error } = await supabase
    .from("education")
    .update({
      degree: degree.trim(),
      school: school.trim(),
      location: location.trim(),
      period: period.trim(),
      is_current: Boolean(isCurrent),
      detail: typeof detail === "string" && detail.trim().length > 0 ? detail.trim() : null,
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
  const { error } = await supabase.from("education").delete().eq("id", params.id);
  if (error) {
    return NextResponse.json({ error: "Échec de la suppression." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
