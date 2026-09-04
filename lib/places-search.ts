import {
  matchAreas,
  osmPinUrl,
  type EgyptArea,
} from "./egypt-areas";

export type MapPlace = {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  mapsUrl: string;
  source: string;
};

export type PlacesResponse = {
  q: string;
  areas: EgyptArea[];
  shops: MapPlace[];
  provider: "waffari-areas";
  note: string;
};

export function searchPlaces(q: string): PlacesResponse {
  const query = q.trim().slice(0, 120);
  const areas = matchAreas(query);
  const shops: MapPlace[] = areas.flatMap((area) =>
    area.spots.map((spot) => ({
      id: `${area.id}-${spot.id}`,
      name: spot.name,
      address: `${area.name} · ${area.city} — ${spot.note}`,
      lat: area.lat,
      lng: area.lng,
      mapsUrl: osmPinUrl(area.lat, area.lng),
      source: area.cheaper ? `${area.name} · جملة` : area.name,
    })),
  );
  return {
    q: query,
    areas,
    shops,
    provider: "waffari-areas",
    note: query
      ? areas.length
        ? "الترشيح من داتا أحياء وفّري حسب اللي كتبتيه. مش بحث جوجل."
        : "الكلمة دي مش مربوطة بحي عندنا. جرّبي حلل، غسالة، ذهب، أثاث…"
      : "من غير بحث بنظهر أحياء الجملة المعروفة. اكتبي الحاجة عشان نودّيكي للمنطقة.",
  };
}
