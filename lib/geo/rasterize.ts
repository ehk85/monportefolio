import "server-only";

// Transforme les frontières d'un pays (GeoJSON) en nuage de points normalisé,
// utilisé pour l'animation « globe qui explose en carte » (CountryMorph).
// Même algorithme que celui utilisé manuellement pour générer les cartes
// France / Royaume-Uni / Côte d'Ivoire initiales.

export type LngLat = [number, number];
export type Ring = LngLat[];

export type CountryMapResult = {
  points: [number, number][];
  centerLng: number;
  centerLat: number;
  cosLat: number;
  maxAbs: number;
};

function pointInRing(pt: LngLat, ring: Ring): boolean {
  let inside = false;
  const [x, y] = pt;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInPolys(pt: LngLat, polys: Ring[]): boolean {
  return polys.some((ring) => pointInRing(pt, ring));
}

function ringBBoxArea(ring: Ring): number {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const [lng, lat] of ring) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return Math.max(0, maxLng - minLng) * Math.max(0, maxLat - minLat);
}

type GeoJsonFeatureCollection = {
  features?: {
    geometry?: {
      type: "Polygon" | "MultiPolygon";
      coordinates: unknown;
    };
  }[];
};

export function extractRings(geojson: GeoJsonFeatureCollection): Ring[] {
  const geom = geojson.features?.[0]?.geometry;
  if (!geom) return [];
  if (geom.type === "Polygon") return [(geom.coordinates as Ring[])[0]];
  if (geom.type === "MultiPolygon") {
    return (geom.coordinates as Ring[][]).map((p) => p[0]);
  }
  return [];
}

/**
 * Génère le nuage de points d'un pays à partir de son GeoJSON.
 * `targetPoints` : densité visée (le pas de la grille s'auto-ajuste pour
 * s'en approcher en 1-2 passes, quelle que soit la taille du pays).
 * Les îles/exclaves dont la boîte englobante fait moins de 3% de celle du
 * plus grand morceau sont ignorées (ex: Corse pour la France).
 */
export function rasterizeCountry(
  geojson: GeoJsonFeatureCollection,
  targetPoints = 900
): CountryMapResult | null {
  let polys = extractRings(geojson);
  if (polys.length === 0) return null;

  const areas = polys.map(ringBBoxArea);
  const maxArea = Math.max(...areas, 0);
  if (maxArea > 0) {
    polys = polys.filter((_, i) => areas[i] >= maxArea * 0.03);
  }

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const ring of polys) {
    for (const [lng, lat] of ring) {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }

  const meanLat = (minLat + maxLat) / 2;
  const cosLat = Math.cos((meanLat * Math.PI) / 180) || 1;
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;

  const project = (lng: number, lat: number): [number, number] => [
    (lng - centerLng) * cosLat,
    lat - centerLat,
  ];

  const bboxWidth = Math.max((maxLng - minLng) * cosLat, 0.01);
  const bboxHeight = Math.max(maxLat - minLat, 0.01);
  const bboxArea = bboxWidth * bboxHeight;

  let gridStep = Math.sqrt((bboxArea * 0.45) / targetPoints);
  gridStep = Math.max(0.03, Math.min(gridStep, 1.2));

  const sample = (step: number): [number, number][] => {
    const pts: [number, number][] = [];
    for (let lat = minLat; lat <= maxLat; lat += step) {
      for (let lng = minLng; lng <= maxLng; lng += step / cosLat) {
        if (pointInPolys([lng, lat], polys)) {
          pts.push(project(lng, lat));
        }
      }
    }
    return pts;
  };

  let pts = sample(gridStep);
  if (pts.length > 0 && Math.abs(pts.length - targetPoints) / targetPoints > 0.4) {
    const scale = Math.sqrt(pts.length / targetPoints);
    gridStep = Math.max(0.025, Math.min(gridStep * scale, 1.3));
    pts = sample(gridStep);
  }

  let maxAbs = 0;
  for (const [x, y] of pts) {
    maxAbs = Math.max(maxAbs, Math.abs(x), Math.abs(y));
  }
  if (maxAbs === 0) maxAbs = 1;

  const points = pts.map(
    ([x, y]) => [Number((x / maxAbs).toFixed(4)), Number((-y / maxAbs).toFixed(4))] as [
      number,
      number,
    ]
  );

  return { points, centerLng, centerLat, cosLat, maxAbs };
}

/** Projette une ville dans le repère déjà calculé d'une carte de pays existante. */
export function projectCityInCountry(
  map: Pick<CountryMapResult, "centerLng" | "centerLat" | "cosLat" | "maxAbs">,
  lng: number,
  lat: number
): [number, number] {
  const x = (lng - map.centerLng) * map.cosLat;
  const y = lat - map.centerLat;
  return [Number((x / map.maxAbs).toFixed(4)), Number((-y / map.maxAbs).toFixed(4))];
}

/** Récupère et traite les frontières d'un pays depuis le jeu de données public. */
export async function fetchCountryBoundary(
  iso3Lower: string
): Promise<GeoJsonFeatureCollection | null> {
  const url = `https://raw.githubusercontent.com/johan/world.geo.json/master/countries/${iso3Lower.toUpperCase()}.geo.json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  try {
    return (await res.json()) as GeoJsonFeatureCollection;
  } catch {
    return null;
  }
}
