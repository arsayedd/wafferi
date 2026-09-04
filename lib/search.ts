import { foldArabic, tokenizeQuery, similarArabic, softenArabic } from "./ar-fold";
import { avgRating, cheapestListing, getCategory, getStore, products } from "./catalog";
import { bestChoiceScore, offerDiscountPct, totalReviews } from "./best-choice";
import { SEARCH_STOP } from "./query-parse";
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
    p.category,
    getCategory(p.category)?.name ?? "",
    ...(p.highlights ?? []),
    ...p.listings.map((l) => getStore(l.storeId)?.name ?? l.storeId),
    ...p.specs.map((s) => `${s.label} ${s.value}`),
  ].join(" ");
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

function tokenHit(hay: string, token: string) {
  if (!token) return true;
  if (SEARCH_STOP.has(token) || /^\d+$/.test(token)) return true;
  const softHay = softenArabic(hay);
  const softTok = softenArabic(token);
  if (hay.includes(token) || softHay.includes(softTok)) return true;
  const stem = token.slice(0, Math.min(token.length, 5));
  if (stem.length >= 4 && (hay.includes(stem) || softHay.includes(softenArabic(stem)))) return true;
  return hay.split(" ").some((w) => similarArabic(w, token));
}

function textHit(p: Product, q?: string) {
  if (!q?.trim()) return true;
  const hay = foldArabic(haystack(p));
  const foldedQ = foldArabic(q);
  if (hay.includes(foldedQ) || softenArabic(hay).includes(softenArabic(q))) return true;
  if (similarArabic(p.name, q) || similarArabic(p.category, q) || similarArabic(getCategory(p.category)?.name ?? "", q)) {
    return true;
  }
  const tokens = tokenizeQuery(q).filter((w) => w.length > 1 && !SEARCH_STOP.has(w) && !/^\d+$/.test(w));
  if (!tokens.length) return true;
  const hits = tokens.filter((t) => tokenHit(hay, t));
  if (hits.length === tokens.length) return true;
  if (tokens.length >= 2 && hits.length >= Math.ceil(tokens.length * 0.6)) return true;
  return false;
}

function applyFilters(p: Product, filters: SearchFilters, withText: boolean) {
  if (withText && !textHit(p, filters.q)) return false;
  if (filters.category && p.category !== filters.category) return false;
  if (filters.brand && foldArabic(p.brand) !== foldArabic(filters.brand) && p.brand !== filters.brand) {
    return false;
  }
  if (filters.store && !p.listings.some((l) => l.storeId === filters.store)) return false;
  const cheap = cheapestListing(p);
  if (!cheap) {
    if (
      filters.min != null ||
      filters.max != null ||
      filters.inStock ||
      filters.minDiscount != null ||
      filters.delivery
    )
      return false;
    return true;
  }
  const cheapPrice = cheap.price;
  if (filters.min != null && Number.isFinite(filters.min) && cheapPrice < filters.min) return false;
  if (filters.max != null && Number.isFinite(filters.max) && cheapPrice > filters.max) return false;
  if (filters.inStock && !p.listings.some((l) => l.inStock)) return false;
  if (filters.minRating != null && avgRating(p) < filters.minRating) return false;
  if (filters.minReviews != null && totalReviews(p) < filters.minReviews) return false;
  if (filters.minDiscount != null && offerDiscountPct(p) < filters.minDiscount) return false;
  if (!capacityHit(p, filters.capacity)) return false;
  if (!deliveryHit(p, filters.delivery)) return false;
  return true;
}

function sortList(list: Product[], sort: SortKey) {
  return [...list].sort((a, b) => {
    if (sort === "best") return bestChoiceScore(b) - bestChoiceScore(a);
    if (sort === "discount") return offerDiscountPct(b) - offerDiscountPct(a);
    if (sort === "reviews") return totalReviews(b) - totalReviews(a);
    const ca = cheapestListing(a)?.price ?? Number.POSITIVE_INFINITY;
    const cb = cheapestListing(b)?.price ?? Number.POSITIVE_INFINITY;
    if (sort === "price") return ca - cb;
    if (sort === "rating") return avgRating(b) - avgRating(a);
    if (sort === "stores") return b.listings.length - a.listings.length;
    const sa = Math.max(...a.listings.map((l) => l.price)) - ca;
    const sb = Math.max(...b.listings.map((l) => l.price)) - cb;
    return sb - sa;
  });
}

function hasStructuredFilters(filters: SearchFilters) {
  return Boolean(
    filters.category ||
      filters.brand ||
      filters.store ||
      filters.min != null ||
      filters.max != null ||
      filters.inStock ||
      filters.minRating != null ||
      filters.minReviews != null ||
      filters.minDiscount != null ||
      filters.capacity ||
      filters.delivery,
  );
}

export function searchProducts(
  filters: SearchFilters,
  pool: Product[] = products,
): Product[] {
  const sort = filters.sort ?? "best";
  const strict = pool.filter((p) => applyFilters(p, filters, true));
  if (strict.length || !filters.q) return sortList(strict, sort);

  if (hasStructuredFilters(filters)) {
    const byFacets = pool.filter((p) => applyFilters(p, { ...filters, q: undefined }, false));
    if (byFacets.length) return sortList(byFacets, sort);
  }

  const loose = pool.filter((p) =>
    applyFilters(p, { q: filters.q, category: filters.category, brand: filters.brand, sort }, true),
  );
  return sortList(loose, sort);
}
