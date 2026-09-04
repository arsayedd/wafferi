import type { Listing, Product } from "./types";

export type LiveListing = Listing & {
  previousPrice: number;
  catalogPrice: number;
  updatedAt?: number;
  channel?: "seed" | "feed";
};

export type LiveProduct = Omit<Product, "listings"> & {
  listings: LiveListing[];
};

export type PriceMove = {
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  from: number;
  to: number;
  at: number;
};

export function asStaticLive(p: Product): LiveProduct {
  return {
    ...p,
    listings: p.listings.map((l) => ({
      ...l,
      previousPrice: l.oldPrice ?? l.price,
      catalogPrice: l.price,
    })),
  };
}
