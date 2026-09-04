import {
  googleMapsSearchUrl,
  matchAreas,
  type EgyptArea,
} from "./egypt-areas";

export type MapPlace = {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  rating?: number;
  mapsUrl: string;
  source: string;
};

export type PlacesResponse = {
  q: string;
  areas: EgyptArea[];
  shops: MapPlace[];
  provider: "google-maps" | "open-maps";
  note: string;
};

async function googlePlaces(q: string): Promise<MapPlace[] | null> {
  const key =
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_API_KEY;
  if (!key) return null;
  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", `${q} مصر`);
  url.searchParams.set("language", "ar");
  url.searchParams.set("region", "eg");
  url.searchParams.set("key", key);
  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(9000) });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    status?: string;
    results?: {
      place_id: string;
      name: string;
      formatted_address?: string;
      rating?: number;
      geometry?: { location?: { lat: number; lng: number } };
    }[];
  };
  if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") return null;
  return (data.results ?? []).slice(0, 10).map((r) => ({
    id: r.place_id,
    name: r.name,
    address: r.formatted_address ?? "",
    lat: r.geometry?.location?.lat,
    lng: r.geometry?.location?.lng,
    rating: r.rating,
    mapsUrl: googleMapsSearchUrl(
      r.geometry?.location
        ? `${r.geometry.location.lat},${r.geometry.location.lng}`
        : r.name,
    ),
    source: "خرائط جوجل",
  }));
}

async function nominatimPlaces(q: string): Promise<MapPlace[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", `${q} Egypt`);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "8");
  url.searchParams.set("accept-language", "ar");
  url.searchParams.set("countrycodes", "eg");
  const res = await fetch(url.toString(), {
    signal: AbortSignal.timeout(9000),
    headers: { "user-agent": "Waffari/1.0 (places for bridal shopping)" },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    name?: string;
  }[];
  return data.map((p) => ({
    id: `osm-${p.place_id}`,
    name: p.name || p.display_name.split(",")[0] || q,
    address: p.display_name,
    lat: Number(p.lat),
    lng: Number(p.lon),
    mapsUrl: googleMapsSearchUrl(`${p.lat},${p.lon}`),
    source: "خريطة مفتوحة → لينك جوجل ماب",
  }));
}

export async function searchPlaces(q: string): Promise<PlacesResponse> {
  const query = q.trim().slice(0, 120);
  const areas = matchAreas(query || "مطبخ");
  const areaPins: MapPlace[] = areas.map((a) => ({
    id: `area-${a.id}`,
    name: a.name,
    address: `${a.city} — ${a.why}`,
    lat: a.lat,
    lng: a.lng,
    mapsUrl: googleMapsSearchUrl(a.mapsQuery),
    source: a.cheaper ? "حي جملة → خرائط جوجل" : "منطقة تسوق → خرائط جوجل",
  }));
  const look = query
    ? `${query} ${areas[0]?.name ?? "القاهرة"}`
    : "أدوات منزل القاهرة";

  try {
    const g = await googlePlaces(look);
    if (g && g.length) {
      return {
        q: query,
        areas,
        shops: [...areaPins, ...g],
        provider: "google-maps",
        note: "الأحياء من خبرة سوق العروسة، والمحلات من Google Places. اللينك بيفتح خرائط جوجل.",
      };
    }
  } catch {
    /* open maps */
  }

  const fromAreas = (
    await Promise.all(
      areas.slice(0, 3).map((a) => nominatimPlaces(a.mapsQuery).catch(() => [] as MapPlace[])),
    )
  ).flat();
  const extra = await nominatimPlaces(look).catch(() => []);
  const shops = [...areaPins, ...fromAreas, ...extra].filter(
    (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i,
  );
  const hasKey = Boolean(
    process.env.GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_PLACES_API_KEY ||
      process.env.GOOGLE_API_KEY,
  );
  return {
    q: query,
    areas,
    shops,
    provider: "open-maps",
    note: hasKey
      ? "جوجل ماب مرجعش أماكن، فظهر ترشيح الأحياء + نقاط من الخريطة المفتوحة ولينك جوجل ماب لكل مكان."
      : "حطّي GOOGLE_MAPS_API_KEY عشان المحلات تيجي من Google Places. دلوقتي: أحياء الجملة المعروفة + خريطة مفتوحة، وكل كارت ليه زر خرائط جوجل.",
  };
}
