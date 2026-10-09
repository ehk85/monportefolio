import { NextResponse } from "next/server";
import { getSupabasePublicClient } from "@/lib/supabase/public";
import { testimonialSources } from "@/data/testimonialSources";
import { notifyNewTestimonial } from "@/lib/notifyNewTestimonial";

const MAX_WORDS = 2000;

function countWords(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { name, isAnonymous, company, comment } = (body ?? {}) as Record<string, unknown>;

  if (typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json({ error: "Le commentaire est requis." }, { status: 400 });
  }
  if (countWords(comment) > MAX_WORDS) {
    return NextResponse.json(
      { error: `Le commentaire dépasse ${MAX_WORDS} mots.` },
      { status: 400 }
    );
  }
  if (typeof company !== "string" || !testimonialSources.includes(company)) {
    return NextResponse.json({ error: "Entreprise ou école invalide." }, { status: 400 });
  }
  const anonymous = Boolean(isAnonymous);
  const trimmedName = typeof name === "string" ? name.trim() : "";
  if (!anonymous && trimmedName.length === 0) {
    return NextResponse.json(
      { error: "Indique ton nom ou choisis de rester anonyme." },
      { status: 400 }
    );
  }
  if (trimmedName.length > 120) {
    return NextResponse.json({ error: "Nom trop long." }, { status: 400 });
  }

  const supabase = getSupabasePublicClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Le service d'avis n'est pas encore configuré." },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("testimonials").insert({
    name: anonymous ? null : trimmedName,
    is_anonymous: anonymous,
    company,
    comment: comment.trim().slice(0, 20000),
  });

  if (error) {
    return NextResponse.json({ error: "Échec de l'envoi, réessaie plus tard." }, { status: 500 });
  }

  await notifyNewTestimonial({
    name: anonymous ? null : trimmedName,
    isAnonymous: anonymous,
    company,
    comment: comment.trim(),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
