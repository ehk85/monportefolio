import { getSupabasePublicClient } from "./public";
import type { Region, CountryMap } from "@/data/region";

export async function getRegions(): Promise<Region[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("regions")
    .select("key, label, country, country_code, lat, lng, map_x, map_y, created_at")
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => ({
    key: row.key,
    label: row.label,
    country: row.country,
    countryCode: row.country_code,
    lat: row.lat,
    lng: row.lng,
    mapX: row.map_x,
    mapY: row.map_y,
  }));
}

export async function getCountryMaps(): Promise<Record<string, CountryMap>> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return {};

  const { data, error } = await supabase.from("country_maps").select("country_code, points");

  if (error || !data) return {};
  const result: Record<string, CountryMap> = {};
  for (const row of data) {
    result[row.country_code] = { countryCode: row.country_code, points: row.points ?? [] };
  }
  return result;
}
