import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { contractTypes } from "@/data/experiences";

function linesToArray(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

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

  const { role, company, location, region, period, contractType, isCurrent, missions, stack } =
    (body ?? {}) as Record<string, unknown>;

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
  if (typeof region !== "string" || region.trim().length === 0) {
    return NextResponse.json({ error: "Zone géographique requise." }, { status: 400 });
  }
  const { data: regionRow } = await supabase
    .from("regions")
    .select("key")
    .eq("key", region)
    .maybeSingle();
  if (!regionRow) {
    return NextResponse.json({ error: "Zone géographique inconnue." }, { status: 400 });
  }
  const normalizedContractType =
    typeof contractType === "string" && contractType.trim().length > 0 ? contractType.trim() : null;
  if (normalizedContractType && !contractTypes.includes(normalizedContractType as (typeof contractTypes)[number])) {
    return NextResponse.json({ error: "Type de contrat invalide." }, { status: 400 });
  }

  const { data: minRow } = await supabase
    .from("experiences")
    .select("sort_order")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  const sortOrder = minRow ? minRow.sort_order - 1 : 0;

  const { error } = await supabase.from("experiences").insert({
    role: role.trim(),
    company: company.trim(),
    location: location.trim(),
    region,
    period: period.trim(),
    contract_type: normalizedContractType,
    is_current: Boolean(isCurrent),
    missions: linesToArray(missions),
    stack: linesToArray(stack),
    sort_order: sortOrder,
  });

  if (error) {
    return NextResponse.json({ error: "Échec de l'enregistrement." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
