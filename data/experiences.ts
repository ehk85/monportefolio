export type RegionKey = "lyon" | "paris" | "londres" | "abidjan";

export type CountryCode = "fra" | "gbr" | "civ";

export type Region = {
  label: string;
  country: string;
  countryCode: CountryCode;
  lat: number;
  lng: number;
};

export const regions: Record<RegionKey, Region> = {
  lyon: { label: "Lyon", country: "France", countryCode: "fra", lat: 45.75, lng: 4.85 },
  paris: { label: "Paris", country: "France", countryCode: "fra", lat: 48.8566, lng: 2.3522 },
  londres: {
    label: "Londres",
    country: "Royaume-Uni",
    countryCode: "gbr",
    lat: 51.5074,
    lng: -0.1278,
  },
  abidjan: {
    label: "Abidjan",
    country: "Côte d'Ivoire",
    countryCode: "civ",
    lat: 5.36,
    lng: -4.0083,
  },
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  region: RegionKey;
  period: string;
  current?: boolean;
  missions: string[];
  stack: string[];
  sort_order?: number;
};

// Le contenu lui-même (liste des postes) vit désormais dans Supabase
// (table "experiences", gérée depuis /admin/experiences) — voir
// lib/supabase/content.ts. Seule la géographie des régions reste ici,
// car elle est liée aux cartes précalculées du globe (CountryMorph).
