import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { rasterizeCountry, projectCityInCountry, fetchCountryBoundary } from "@/lib/geo/rasterize";

function slugify(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
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
  const { label, country, countryCode, lat, lng } = (body ?? {}) as Record<string, unknown>;

  if (typeof label !== "string" || label.trim().length === 0) {
    return NextResponse.json({ error: "Nom de ville requis." }, { status: 400 });
  }
  if (typeof country !== "string" || country.trim().length === 0) {
    return NextResponse.json({ error: "Nom de pays requis." }, { status: 400 });
  }
  if (typeof countryCode !== "string" || !/^[a-z]{3}$/.test(countryCode)) {
    return NextResponse.json({ error: "Code pays invalide." }, { status: 400 });
  }
  const latNum = typeof lat === "number" ? lat : NaN;
  const lngNum = typeof lng === "number" ? lng : NaN;
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
    return NextResponse.json({ error: "Coordonnées invalides." }, { status: 400 });
  }

  // 1) la carte du pays existe-t-elle déjà ?
  const { data: existingMap } = await supabase
    .from("country_maps")
    .select("country_code, center_lng, center_lat, cos_lat, max_abs")
    .eq("country_code", countryCode)
    .maybeSingle();

  let projectionParams: { centerLng: number; centerLat: number; cosLat: number; maxAbs: number };

  if (existingMap) {
    projectionParams = {
      centerLng: existingMap.center_lng,
      centerLat: existingMap.center_lat,
      cosLat: existingMap.cos_lat,
      maxAbs: existingMap.max_abs,
    };
  } else {
    // 2) sinon, génère la carte à partir des frontières réelles du pays
    const geojson = await fetchCountryBoundary(countryCode);
    if (!geojson) {
      return NextResponse.json(
        { error: `Frontières introuvables pour le pays "${countryCode.toUpperCase()}".` },
        { status: 404 }
      );
    }
    const result = rasterizeCountry(geojson, 900);
    if (!result || result.points.length === 0) {
      return NextResponse.json({ error: "Échec de la génération de la carte." }, { status: 500 });
    }
    const { error: insertMapError } = await supabase.from("country_maps").insert({
      country_code: countryCode,
      points: result.points,
      center_lng: result.centerLng,
      center_lat: result.centerLat,
      cos_lat: result.cosLat,
      max_abs: result.maxAbs,
    });
    if (insertMapError) {
      return NextResponse.json({ error: "Échec de l'enregistrement de la carte." }, { status: 500 });
    }
    projectionParams = {
      centerLng: result.centerLng,
      centerLat: result.centerLat,
      cosLat: result.cosLat,
      maxAbs: result.maxAbs,
    };
  }

  // 3) position de la ville dans cette carte
  const [mapX, mapY] = projectCityInCountry(projectionParams, lngNum, latNum);

  // 4) clé unique pour la région
  const baseKey = slugify(label) || "ville";
  let key = baseKey;
  let suffix = 2;
  // boucle courte : la liste de régions reste petite (quelques dizaines max)
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data: existingRegion } = await supabase
      .from("regions")
      .select("key")
      .eq("key", key)
      .maybeSingle();
    if (!existingRegion) break;
    key = `${baseKey}-${suffix}`;
    suffix += 1;
    if (suffix > 50) break;
  }

  const { error: insertRegionError } = await supabase.from("regions").insert({
    key,
    label: label.trim(),
    country: country.trim(),
    country_code: countryCode,
    lat: latNum,
    lng: lngNum,
    map_x: mapX,
    map_y: mapY,
  });

  if (insertRegionError) {
    return NextResponse.json({ error: "Échec de l'enregistrement de la ville." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, key }, { status: 201 });
}
