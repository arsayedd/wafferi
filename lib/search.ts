import { avgRating, cheapestListing, products } from "./catalog";
import type { Product } from "./types";

export type SortKey = "price" | "savings" | "rating" | "stores";

export type SearchFilters = {
  q?: string;
  category?: string;
  brand?: string;
  store?: string;
  min?: number;
  max?: number;
  inStock?: boolean;
  sort?: SortKey;
};

function haystack(p: Product) {
  return [
    p.name,
    p.brand,
    p.model,
    p.capacity,
    p.barcode,
    ...p.highlights,
    ...p.specs.map((s) => `${s.label} ${s.value}`),
  ]
    .join(" ")
    .toLowerCase();
}

export function searchProducts(filters: SearchFilters): Product[] {
  const q = (filters.q ?? "").trim().toLowerCase();
  let list = products.filter((p) => {
    if (q && !haystack(p).includes(q) && !p.name.includes(filters.q ?? "")) {
      const words = q.split(/\s+/);
      if (!words.every((w) => haystack(p).includes(w))) return false;
    }
    if (filters.category && p.category !== filters.category) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    if (filters.store && !p.listings.some((l) => l.storeId === filters.store)) return false;
    const cheap = cheapestListing(p).price;
    if (filters.min != null && cheap < filters.min) return false;
    if (filters.max != null && cheap > filters.max) return false;
    if (filters.inStock && !p.listings.some((l) => l.inStock)) return false;
    return true;
  });

  const sort = filters.sort ?? "price";
  list = [...list].sort((a, b) => {
    const ca = cheapestListing(a).price;
    const cb = cheapestListing(b).price;
    if (sort === "price") return ca - cb;
    if (sort === "rating") return avgRating(b) - avgRating(a);
    if (sort === "stores") return b.listings.length - a.listings.length;
    const sa = Math.max(...a.listings.map((l) => l.price)) - ca;
    const sb = Math.max(...b.listings.map((l) => l.price)) - cb;
    return sb - sa;
  });
  return list;
}
