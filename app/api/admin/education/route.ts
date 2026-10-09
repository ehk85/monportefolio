import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
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

  const { degree, school, location, period, isCurrent, detail } = (body ?? {}) as Record<
    string,
    unknown
  >;

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

  const { data: minRow } = await supabase
    .from("education")
    .select("sort_order")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  const sortOrder = minRow ? minRow.sort_order - 1 : 0;

  const { error } = await supabase.from("education").insert({
    degree: degree.trim(),
    school: school.trim(),
    location: location.trim(),
    period: period.trim(),
    is_current: Boolean(isCurrent),
    detail: typeof detail === "string" && detail.trim().length > 0 ? detail.trim() : null,
    sort_order: sortOrder,
  });

  if (error) {
    return NextResponse.json({ error: "Échec de l'enregistrement." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
