import type { CategoryId } from "./types";
import { foldArabic } from "./ar-fold";

function seed(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (h >>> 0) % 1_000_000;
}

/** Local Wikimedia Commons photos (real appliances/furniture, not AI stock). */
const BY_ID: Record<string, string> = {
  "lg-washer-8": "/catalog-photos/washers2.jpg",
  "lg-tv-55": "/catalog-photos/tvs2.jpg",
  "toshiba-fridge-16": "/catalog-photos/fridges2.jpg",
  "bosch-dishwasher": "/catalog-photos/dishwashers.jpg",
  "unionaire-stove": "/catalog-photos/stoves.jpg",
  "fresh-heater": "/catalog-photos/heaters.jpg",
  "kenwood-mixer": "/catalog-photos/small-appliances.jpg",
  "tefal-pots": "/catalog-photos/kitchen-tools.jpg",
  "tefal-iron": "/catalog-photos/iron.jpg",
};

const BY_CATEGORY: Partial<Record<CategoryId, string[]>> = {
  washers: ["/catalog-photos/washers.jpg", "/catalog-photos/washers2.jpg", "/catalog-photos/washers3.jpg"],
  fridges: ["/catalog-photos/fridges.jpg", "/catalog-photos/fridges2.jpg"],
  freezers: ["/catalog-photos/freezers.jpg", "/catalog-photos/fridges2.jpg"],
  acs: ["/catalog-photos/acs.jpg"],
  fans: ["/catalog-photos/fans.jpg"],
  stoves: ["/catalog-photos/stoves.jpg"],
  dishwashers: ["/catalog-photos/dishwashers.jpg"],
  vacuums: ["/catalog-photos/vacuums.jpg"],
  heaters: ["/catalog-photos/heaters.jpg"],
  water: ["/catalog-photos/water.jpg"],
  tvs: ["/catalog-photos/tvs.jpg", "/catalog-photos/tvs2.jpg"],
  audio: ["/catalog-photos/audio.jpg"],
  "small-appliances": ["/catalog-photos/small-appliances.jpg", "/catalog-photos/microwave.jpg"],
  "personal-care": ["/catalog-photos/personal-care.jpg"],
  bedroom: ["/catalog-photos/bedroom.jpg"],
  living: ["/catalog-photos/living.jpg"],
  "kitchen-tools": ["/catalog-photos/kitchen-tools.jpg"],
  textiles: ["/catalog-photos/textiles.jpg"],
  bathroom: ["/catalog-photos/textiles.jpg"],
};

export function productPhotoSrc(input: {
  id: string;
  category: CategoryId;
  name: string;
  brand?: string;
  model?: string;
}) {
  const q = new URLSearchParams({
    id: input.id,
    category: input.category,
    name: input.name,
    brand: input.brand ?? "",
    model: input.model ?? "",
  });
  return `/api/product-photo?${q.toString()}`;
}

export function productImage(id: string, category: CategoryId, name = "") {
  if (BY_ID[id]) return BY_ID[id];
  const blob = foldArabic(`${id} ${name}`);
  if (category === "washers" && blob.includes("lg")) return "/catalog-photos/washers2.jpg";
  if (category === "washers" && blob.includes("samsung")) return "/catalog-photos/washers3.jpg";
  if (category === "tvs" && (blob.includes("lg") || blob.includes("samsung"))) return "/catalog-photos/tvs2.jpg";
  if (blob.includes("ميكرو") || blob.includes("microwave")) return "/catalog-photos/microwave.jpg";
  if (blob.includes("مكواة") || blob.includes("iron")) return "/catalog-photos/iron.jpg";
  const pool = BY_CATEGORY[category];
  if (pool?.length) return pool[seed(id) % pool.length];
  return "";
}

export function productImageFallback(id: string, category: CategoryId, name = "") {
  const pool = BY_CATEGORY[category];
  if (pool && pool.length > 1) return pool[(seed(id) + 1) % pool.length];
  if (pool?.[0] && pool[0] !== productImage(id, category, name)) return pool[0];
  return "/catalog-photos/living.jpg";
}

export const PHOTO_CREDIT = "ويكيميديا / Openverse — صورة مرجعية للمنتج، مش سحب من صفحة المتجر";
