import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { action } = (body ?? {}) as Record<string, unknown>;
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "Action invalide." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase non configuré." }, { status: 503 });
  }

  const status = action === "approve" ? "approved" : "rejected";
  const { error } = await supabase
    .from("testimonials")
    .update({ status })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Échec de la mise à jour." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
