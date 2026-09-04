import { cheapestListing, products } from "./catalog";
import { getStore } from "./catalog";
import type { Listing, Product } from "./types";

export const TICK_MS = 4000;

export type LiveListing = Listing & {
  previousPrice: number;
  catalogPrice: number;
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

function hash(s: string) {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function quotePrice(base: number, sku: string, at = Date.now()) {
  const bucket = Math.floor(at / TICK_MS);
  const h = hash(sku);
  const wave = Math.sin(bucket / 5 + (h % 360) / 18) * 0.03;
  const jitter = ((hash(`${sku}:${bucket}`) % 1000) / 1000 - 0.5) * 0.014;
  return Math.max(40, Math.round((base * (1 + wave + jitter)) / 10) * 10);
}

export function quoteHistory(base: number, sku: string, points = 32, at = Date.now()) {
  return Array.from({ length: points }, (_, i) =>
    quotePrice(base, sku, at - (points - 1 - i) * TICK_MS),
  );
}

export function withLivePrices(product: Product, at = Date.now()): LiveProduct {
  return {
    ...product,
    listings: product.listings.map((l) => ({
      ...l,
      catalogPrice: l.price,
      previousPrice: quotePrice(l.price, l.sku, at - TICK_MS),
      price: quotePrice(l.price, l.sku, at),
    })),
  };
}

export function liveCheapest(product: Product, at = Date.now()) {
  return cheapestListing(withLivePrices(product, at));
}

export function recentMoves(at = Date.now(), limit = 24): PriceMove[] {
  const moves: PriceMove[] = [];
  const watch = products.filter((p) => !p.id.startsWith("br-"));
  for (const p of watch) {
    const live = withLivePrices(p, at);
    for (const l of live.listings) {
      if (l.price === l.previousPrice) continue;
      moves.push({
        productId: p.id,
        productName: p.name,
        storeId: l.storeId,
        storeName: getStore(l.storeId)?.name ?? l.storeId,
        from: l.previousPrice,
        to: l.price,
        at,
      });
    }
  }
  return moves
    .sort((a, b) => Math.abs(b.to - b.from) - Math.abs(a.to - a.from))
    .slice(0, limit);
}

export function tickBucket(at = Date.now()) {
  return Math.floor(at / TICK_MS);
}
