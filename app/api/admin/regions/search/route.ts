import { NextResponse } from "next/server";
import { iso2ToIso3 } from "@/lib/geo/isoCodes";

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
    country_code?: string;
  };
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const { query } = (body ?? {}) as Record<string, unknown>;
  if (typeof query !== "string" || query.trim().length < 2) {
    return NextResponse.json({ error: "Indique au moins 2 caractères." }, { status: 400 });
  }

  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&accept-language=fr&q=${encodeURIComponent(
    query.trim()
  )}`;

  let results: NominatimResult[];
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "portfolio-emmanuel-konate-admin/1.0 (contact: mohadhassan798@gmail.com)",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Échec du géocodage, réessaie plus tard." }, { status: 502 });
    }
    results = (await res.json()) as NominatimResult[];
  } catch {
    return NextResponse.json({ error: "Service de géocodage injoignable." }, { status: 502 });
  }

  if (!results || results.length === 0) {
    return NextResponse.json({ error: "Aucune ville trouvée pour cette recherche." }, { status: 404 });
  }

  const r = results[0];
  const address = r.address ?? {};
  const iso2 = (address.country_code ?? "").toUpperCase();
  const iso3 = iso2 ? iso2ToIso3[iso2] : undefined;
  if (!iso3) {
    return NextResponse.json(
      { error: "Pays non reconnu dans la base de frontières." },
      { status: 404 }
    );
  }

  const label =
    address.city || address.town || address.village || address.municipality || r.display_name.split(",")[0];
  const country = address.country || iso3;
  const lat = parseFloat(r.lat);
  const lng = parseFloat(r.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Coordonnées invalides." }, { status: 502 });
  }

  return NextResponse.json({
    label,
    country,
    countryCode: iso3.toLowerCase(),
    lat,
    lng,
  });
}
