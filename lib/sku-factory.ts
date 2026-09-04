import type { AffiliateNetwork, CategoryId, Product } from "./types";
import { listingHref } from "./store-link";

function hash(s: string) {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 16777619);
  return x >>> 0;
}

const NET: Record<string, AffiliateNetwork> = {
  jumia: "jumia",
  noon: "noon",
  carrefour: "arabclicks",
  amazon: "direct",
  ikea: "direct",
  namshi: "arabclicks",
  goldenscent: "arabclicks",
  seif: "direct",
  homzmart: "arabclicks",
};

function storesFor(cat: CategoryId): [string, string, string] {
  if (cat === "beauty" || cat === "personal-care") return ["jumia", "noon", "goldenscent"];
  if (
    cat === "women-wear" ||
    cat === "pajamas" ||
    cat === "bridal-wear" ||
    cat === "shoes" ||
    cat === "bags" ||
    cat === "jewelry"
  )
    return ["jumia", "noon", "namshi"];
  if (cat === "textiles" || cat === "bathroom" || cat === "decor" || cat === "storage")
    return ["jumia", "noon", "ikea"];
  if (cat === "emergency") return ["jumia", "amazon", "carrefour"];
  if (cat === "travel") return ["jumia", "noon", "amazon"];
  return ["jumia", "noon", "carrefour"];
}

export function makeSku(
  id: string,
  name: string,
  brand: string,
  category: CategoryId,
  price: number,
  hint: string,
): Product {
  const n = hash(id);
  const [a, b, c] = storesFor(category);
  const p2 = Math.max(25, Math.round((price * (1.04 + (n % 6) / 100)) / 5) * 5);
  const p3 = Math.max(20, Math.round((price * (0.95 + (n % 5) / 100)) / 5) * 5);
  const rows = [
    { storeId: a, price, extra: 0 },
    { storeId: b, price: p2, extra: 1 },
    { storeId: c, price: p3, extra: 2 },
  ];
  return {
    id,
    name,
    brand,
    category,
    model: id.replace(/-/g, " ").toUpperCase(),
    highlights: [hint, "متوفر من متاجر مصر المتصلة", "بند أساسي في قايمة العروسة"],
    specs: [
      { label: "الاستخدام", value: "جهاز العروسة وأول بيت" },
      { label: "البراند", value: brand },
    ],
    listings: rows.map((row) => ({
      storeId: row.storeId,
      price: row.price,
      rating: Number((4.0 + ((n + row.extra) % 8) / 10).toFixed(1)),
      reviews: 18 + ((n + row.extra * 17) % 420),
      inStock: (n + row.extra) % 19 !== 0,
      shipping:
        row.storeId === "carrefour" || row.storeId === "ikea"
          ? "استلام فرع أو توصيل"
          : "توصيل خلال 2–5 أيام",
      url: listingHref(row.storeId, name),
      sku: `${id}-${row.storeId}`.toUpperCase(),
      affiliateNetwork: NET[row.storeId] ?? "direct",
      oldPrice: row.extra === 0 && n % 5 === 0 ? Math.round(price * 1.18) : undefined,
    })),
    reviewHighlights: [
      {
        author: "عروسة من الإسكندرية",
        rating: 5,
        source: "جوميا",
        text: "من الحاجات اللي بتتنسي في الجهاز. وصلت سريعة والسعر أوفر من المحل.",
      },
    ],
  };
}
