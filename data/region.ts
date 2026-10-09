// Une "région" est une ville/zone affichée sur le globe. Le contenu vit
// dans Supabase (table "regions", générée automatiquement depuis
// /admin/experiences) — voir lib/supabase/geo.ts. mapX/mapY sont la
// position précalculée de la ville dans le nuage de points de son pays
// (table "country_maps").
export type Region = {
  key: string;
  label: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  mapX: number;
  mapY: number;
};

export type CountryMap = {
  countryCode: string;
  points: [number, number][];
};
