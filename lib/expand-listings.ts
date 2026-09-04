import type { CategoryId, Product, VerticalId } from "./types";
import { stores } from "./network";

export const categoryVertical: Record<CategoryId, VerticalId> = {
  washers: "laundry",
  fridges: "cooling",
  freezers: "cooling",
  acs: "climate",
  fans: "climate",
  stoves: "cooking",
  dishwashers: "cooking",
  vacuums: "cleaning",
  heaters: "water_heat",
  water: "water_heat",
  tvs: "av",
  audio: "av",
  "small-appliances": "small_kitchen",
  "personal-care": "personal_care",
  bedroom: "furniture",
  living: "furniture",
  "kitchen-tools": "small_kitchen",
  textiles: "textiles",
  decor: "decor",
  "women-wear": "fashion_women",
  "men-wear": "fashion_men",
  "kids-wear": "fashion_kids",
  "bridal-wear": "bridal",
  pajamas: "sleepwear",
  shoes: "shoes",
  bags: "bags",
  jewelry: "jewelry",
  beauty: "beauty",
  accessories: "accessories",
  cleaning: "cleaning",
  bathroom: "bathroom",
  storage: "storage",
  travel: "travel",
  emergency: "emergency",
  baby: "baby",
};

function jitter(seed: string, base: number) {
  let h = 0;
  for (const c of seed) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  const pct = ((h % 19) - 7) / 100;
  return Math.max(50, Math.round((base * (1 + pct)) / 10) * 10);
}

export function expandNetworkListings(products: Product[]): Product[] {
  return products.map((p) => {
    const vertical = categoryVertical[p.category];
    const base = p.listings[0]
      ? Math.min(...p.listings.map((l) => l.price))
      : 0;
    if (!base) return p;
    const existing = new Set(p.listings.map((l) => l.storeId));
    const extras = stores
      .filter(
        (s) =>
          s.verticals.includes(vertical) &&
          !existing.has(s.id) &&
          (s.status === "connected" ||
            s.status === "affiliate_ready" ||
            s.status === "feed_pending"),
      )
      .map((s) => {
        const price = jitter(`${s.id}:${p.id}`, base);
        return {
          storeId: s.id,
          price,
          rating: Number((3.9 + (price % 7) / 10).toFixed(1)),
          reviews: 12 + (price % 200),
          inStock: price % 17 !== 0,
          shipping: s.kind === "hypermarket" ? "استلام فرع أو توصيل" : "توصيل خلال 2–5 أيام",
          url: `${s.website.replace(/\/$/, "")}/p/${p.id}`,
          sku: `${p.id.slice(0, 8)}-${s.id}`.toUpperCase(),
          affiliateNetwork: s.network,
          oldPrice: price % 5 === 0 ? Math.round(price * 1.12) : undefined,
        };
      });
    return { ...p, listings: [...p.listings, ...extras] };
  });
}
