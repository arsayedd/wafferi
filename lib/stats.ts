import {
  avgRating,
  cheapestListing,
  maxListing,
  savings,
  storeCount,
} from "./catalog";
import type { Product } from "./types";

export function productStats(product: Product) {
  const cheap = cheapestListing(product);
  const max = maxListing(product);
  return {
    cheap,
    max,
    save: savings(product),
    rating: avgRating(product),
    stores: storeCount(product),
  };
}
