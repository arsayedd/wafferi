import { arabicIncludes, foldArabic } from "./ar-fold";
import { avgRating, cheapestListing, getStore, products } from "./catalog";
import { bestChoiceScore, offerDiscountPct, totalReviews } from "./best-choice";
import type { Product } from "./types";

export type SortKey = "price" | "savings" | "rating" | "stores" | "best" | "discount" | "reviews";

export type SearchFilters = {
  q?: string;
  category?: string;
  brand?: string;
  store?: string;
  min?: number;
  max?: number;
  inStock?: boolean;
  minRating?: number;
  minReviews?: number;
  minDiscount?: number;
  capacity?: string;
  delivery?: "same_day" | "next_day" | "free";
  sort?: SortKey;
};

function haystack(p: Product) {
  return [
    p.name,
    p.brand,
    p.model,
    p.capacity,
    p.barcode,
    ...p.listings.map((l) => getStore(l.storeId)?.name ?? l.storeId),
    ...p.specs.map((s) => `${s.label} ${s.value}`),
  ]
    .join(" ")
    .toLowerCase();
}

function deliveryHit(p: Product, kind: SearchFilters["delivery"]) {
  if (!kind) return true;
  const blob = p.listings.map((l) => l.shipping).join(" ").toLowerCase();
  if (kind === "free") return /مجاني|بدون تكلفه|بدون تكلفة|free/.test(blob);
  if (kind === "same_day") return /نفس اليوم|today|same day/.test(blob);
  return /يوم|غدا|tomorrow|next/.test(blob);
}

function capacityHit(p: Product, cap?: string) {
  if (!cap) return true;
  const n = cap.match(/[\d.]+/)?.[0];
  if (!n) return true;
  const blob = foldArabic(`${p.capacity ?? ""} ${p.name} ${p.specs.map((s) => s.value).join(" ")}`);
  return blob.includes(foldArabic(n));
}

export function searchProducts(
  filters: SearchFilters,
  pool: Product[] = products,
): Product[] {
  const q = (filters.q ?? "").trim();
  let list = pool.filter((p) => {
    if (q) {
      const blob = haystack(p);
      const hit =
        arabicIncludes(blob, q) ||
        arabicIncludes(p.name, q) ||
        q.split(/\s+/).every((w) => w && (arabicIncludes(blob, w) || blob.includes(w.toLowerCase())));
      if (!hit) return false;
    }
    if (filters.category && p.category !== filters.category) return false;
    if (filters.brand && foldArabic(p.brand) !== foldArabic(filters.brand) && p.brand !== filters.brand) {
      return false;
    }
    if (filters.store && !p.listings.some((l) => l.storeId === filters.store)) return false;
    const cheap = cheapestListing(p).price;
    if (filters.min != null && cheap < filters.min) return false;
    if (filters.max != null && cheap > filters.max) return false;
    if (filters.inStock && !p.listings.some((l) => l.inStock)) return false;
    if (filters.minRating != null && avgRating(p) < filters.minRating) return false;
    if (filters.minReviews != null && totalReviews(p) < filters.minReviews) return false;
    if (filters.minDiscount != null && offerDiscountPct(p) < filters.minDiscount) return false;
    if (!capacityHit(p, filters.capacity)) return false;
    if (!deliveryHit(p, filters.delivery)) return false;
    return true;
  });

  const sort = filters.sort ?? "price";
  list = [...list].sort((a, b) => {
    if (sort === "best") return bestChoiceScore(b) - bestChoiceScore(a);
    if (sort === "discount") return offerDiscountPct(b) - offerDiscountPct(a);
    if (sort === "reviews") return totalReviews(b) - totalReviews(a);
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
