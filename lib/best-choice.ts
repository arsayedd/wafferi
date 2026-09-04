import { avgRating, cheapestListing, maxListing, savings } from "./catalog";
import type { Product } from "./types";

export function offerDiscountPct(product: Product) {
  let best = 0;
  for (const l of product.listings) {
    if (l.oldPrice && l.oldPrice > l.price) {
      best = Math.max(best, Math.round(((l.oldPrice - l.price) / l.oldPrice) * 100));
    }
  }
  return best;
}

export function totalReviews(product: Product) {
  return product.listings.reduce((s, l) => s + (l.reviews || 0), 0);
}

export function priceIntel(product: Product) {
  const prices = product.listings.filter((l) => l.price > 0).map((l) => l.price);
  const cheap = cheapestListing(product);
  const high = maxListing(product);
  const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const inStock = product.listings.filter((l) => l.inStock).length;
  return {
    lowest: cheap.price,
    average: avg,
    highest: high.price,
    spread: savings(product),
    rating: avgRating(product),
    reviews: totalReviews(product),
    stores: product.listings.length,
    inStock,
    discount: offerDiscountPct(product),
    cheapestStoreId: cheap.storeId,
  };
}

export type ChoiceReason = { label: string; detail: string };

export function bestChoiceScore(product: Product) {
  const intel = priceIntel(product);
  const stockBoost = intel.inStock ? 1 : 0.2;
  const coverage = Math.min(1, intel.stores / 6);
  const rating = intel.rating / 5;
  const reviews = Math.min(1, Math.log10(intel.reviews + 1) / 3);
  const belowAvg = intel.average ? Math.min(1, Math.max(0, (intel.average - intel.lowest) / intel.average)) : 0;
  return Number((stockBoost * (0.35 * rating + 0.2 * reviews + 0.25 * belowAvg + 0.2 * coverage)).toFixed(4));
}

export function whyBest(product: Product): ChoiceReason[] {
  const intel = priceIntel(product);
  const reasons: ChoiceReason[] = [];
  if (intel.rating >= 4.5) reasons.push({ label: "تقييم قوي", detail: `${intel.rating.toFixed(1)} من المتاجر` });
  if (intel.lowest < intel.average) {
    reasons.push({
      label: "تحت متوسط السوق",
      detail: `الأوفر ${intel.lowest.toLocaleString("ar-EG")} مقابل متوسط ${intel.average.toLocaleString("ar-EG")}`,
    });
  }
  if (intel.stores >= 3) reasons.push({ label: "تغطية متاجر", detail: `متوفر عند ${intel.stores} بائعين` });
  if (intel.inStock >= 2) reasons.push({ label: "ستوك", detail: `${intel.inStock} عروض متاحة` });
  if (intel.discount >= 10) reasons.push({ label: "خصم ظاهر", detail: `حتى ${intel.discount}٪` });
  return reasons.slice(0, 4);
}

export function pickBestChoice(products: Product[]) {
  if (!products.length) return undefined;
  return [...products].sort((a, b) => bestChoiceScore(b) - bestChoiceScore(a))[0];
}
