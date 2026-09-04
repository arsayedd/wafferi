import type { CategoryId, Product, Store, VerticalId } from "./types";
import { stores } from "./network";
import { brandShopFits, storeSearchUrl } from "./store-link";
import { isDeadShopUrl } from "./dead-hosts";

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
  phones: "mobile",
  laptops: "computing",
  tablets: "mobile",
  gaming: "gaming",
  grocery: "grocery",
  sports: "sports",
  auto: "auto",
  tools: "tools",
  pets: "pets",
  office: "office",
  garden: "garden",
};

function allowedOnProduct(st: Store, p: Product) {
  if (st.shipsEgypt === false) return false;
  if (st.kind === "district" || st.kind === "factory") return false;
  if (st.skuEstimate === 0) return false;
  if (isDeadShopUrl(st.website)) return false;
  if (st.kind === "brand" || st.connector === "brand_portal") {
    return brandShopFits(st, p);
  }
  return true;
}

function jitter(seed: string, base: number) {
  let h = 0;
  for (const c of seed) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  const pct = ((h % 19) - 7) / 100;
  return Math.max(50, Math.round((base * (1 + pct)) / 10) * 10);
}

const PIN = ["jumia", "noon", "raneen", "elaraby", "tawhid-nour", "alreyada", "amazon", "btech", "twob", "extra", "orange"];

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
          allowedOnProduct(st, p) &&
          Boolean(storeSearchUrl(st, p.name)),
      )
      .filter((st, i, arr) => arr.findIndex((x) => x.id === st.id) === i)
      .sort((a, b) => {
        const pa = PIN.indexOf(a.id);
        const pb = PIN.indexOf(b.id);
        const ra = pa === -1 ? 80 : pa;
        const rb = pb === -1 ? 80 : pb;
        if (ra !== rb) return ra - rb;
        return Number(b.status === "connected") - Number(a.status === "connected");
      })
      .slice(0, 8)
      .map((s) => {
        const url = storeSearchUrl(s, p.name);
        if (!url) return null;
        const price = jitter(`${s.id}:${p.id}`, base);
        return {
          storeId: s.id,
          price,
          rating: Number((3.9 + (price % 7) / 10).toFixed(1)),
          reviews: 12 + (price % 200),
          inStock: price % 17 !== 0,
          shipping: s.kind === "hypermarket" || s.kind === "department" ? "استلام فرع أو توصيل" : "توصيل خلال 2–5 أيام",
          url,
          sku: `${p.id}-${s.id}`.toUpperCase(),
          affiliateNetwork: s.network,
          oldPrice: price % 5 === 0 ? Math.round(price * 1.12) : undefined,
        };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row));
    return { ...p, listings: [...p.listings, ...extras] };
  });
}
