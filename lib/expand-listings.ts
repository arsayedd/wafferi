import type { CategoryId, Product, Store, VerticalId } from "./types";
import { stores } from "./network";
import { brandShopFits, storeSearchUrl } from "./store-link";

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

/** Retailers we actually send shoppers to — not every brand portal on every SKU. */
const EXPAND_IDS = new Set([
  "jumia",
  "noon",
  "amazon",
  "carrefour",
  "btech",
  "twob",
  "raya",
  "raneen",
  "dream2000",
  "extra",
  "homzmart",
  "ikea",
  "namshi",
  "defacto",
  "lgshop",
  "samsung",
  "boschshop",
  "bekoshop",
  "fresh",
  "unionaire",
  "kiriazi",
  "tornado",
]);

function jitter(seed: string, base: number) {
  let h = 0;
  for (const c of seed) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  const pct = ((h % 19) - 7) / 100;
  return Math.max(50, Math.round((base * (1 + pct)) / 10) * 10);
}

function allowedOnProduct(st: Store, p: Product) {
  if (st.shipsEgypt === false) return false;
  if (!EXPAND_IDS.has(st.id)) return false;
  if (st.kind === "brand" || st.connector === "brand_portal") {
    return brandShopFits(st, p);
  }
  return true;
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
        (st) =>
          st.verticals.includes(vertical) &&
          !existing.has(st.id) &&
          allowedOnProduct(st, p),
      )
      .sort((a, b) => Number(b.status === "connected") - Number(a.status === "connected"))
      .slice(0, 12)
      .map((s) => {
        const price = jitter(`${s.id}:${p.id}`, base);
        return {
          storeId: s.id,
          price,
          rating: Number((3.9 + (price % 7) / 10).toFixed(1)),
          reviews: 12 + (price % 200),
          inStock: price % 17 !== 0,
          shipping: s.kind === "hypermarket" ? "استلام فرع أو توصيل" : "توصيل خلال 2–5 أيام",
          url: storeSearchUrl(s, p.name),
          sku: `${p.id}-${s.id}`.toUpperCase(),
          affiliateNetwork: s.network,
          oldPrice: price % 5 === 0 ? Math.round(price * 1.12) : undefined,
        };
      });
    return { ...p, listings: [...p.listings, ...extras] };
  });
}
