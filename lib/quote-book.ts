import { getStore } from "./catalog";
import { findCatalogMatch } from "./merge-feed";
import type { LiveListing, LiveProduct, PriceMove } from "./live-quotes";
import { listingHref } from "./store-link";
import type { Product } from "./types";

export type QuoteChannel = "seed" | "feed";

export type QuoteTick = {
  productId: string;
  storeId: string;
  sku: string;
  price: number;
  url: string;
  at: number;
  channel: QuoteChannel;
};

export function tickKey(productId: string, storeId: string) {
  return `${productId}::${storeId}`;
}

export function ticksFromIncomingFeed(
  incoming: Product[],
  catalog: Product[],
  at = Date.now(),
): QuoteTick[] {
  const out: QuoteTick[] = [];
  for (const item of incoming) {
    const hit = findCatalogMatch(item, catalog);
    const productId = hit?.product.id ?? item.id;
    for (const l of item.listings) {
      out.push({
        productId,
        storeId: l.storeId,
        sku: l.sku,
        price: l.price,
        url: listingHref(l.storeId, hit?.product.name ?? item.name),
        at,
        channel: "feed",
      });
    }
  }
  return out;
}

export function ticksFromProducts(
  products: Product[],
  channel: QuoteChannel,
  at = Date.now(),
): QuoteTick[] {
  const out: QuoteTick[] = [];
  for (const p of products) {
    for (const l of p.listings) {
      out.push({
        productId: p.id,
        storeId: l.storeId,
        sku: l.sku,
        price: l.price,
        url: listingHref(l.storeId, p.name),
        at,
        channel,
      });
    }
  }
  return out;
}

export function appendTicks(prev: QuoteTick[], incoming: QuoteTick[], perKey = 32): QuoteTick[] {
  const groups = new Map<string, QuoteTick[]>();
  for (const t of prev) {
    const k = tickKey(t.productId, t.storeId);
    const arr = groups.get(k) ?? [];
    arr.push(t);
    groups.set(k, arr);
  }
  for (const t of incoming) {
    const k = tickKey(t.productId, t.storeId);
    const arr = groups.get(k) ?? [];
    const last = arr[arr.length - 1];
    if (last && last.price === t.price) {
      arr[arr.length - 1] = { ...last, at: t.at, channel: t.channel, url: t.url || last.url };
    } else {
      arr.push(t);
    }
    groups.set(k, arr.slice(-perKey));
  }
  return [...groups.values()].flat().sort((a, b) => a.at - b.at);
}

export function overlayProduct(product: Product, ticks: QuoteTick[]): LiveProduct {
  return {
    ...product,
    listings: product.listings.map((l) => {
      const hist = ticks.filter((t) => t.productId === product.id && t.storeId === l.storeId);
      const last = hist[hist.length - 1];
      const prev = hist[hist.length - 2];
      const live: LiveListing = {
        ...l,
        price: last?.price ?? l.price,
        url: listingHref(l.storeId, product.name),
        catalogPrice: l.price,
        previousPrice: prev?.price ?? last?.price ?? l.price,
        updatedAt: last?.at,
        channel: last?.channel,
      };
      return live;
    }),
  };
}

export function historyFor(ticks: QuoteTick[], productId: string, storeId: string): number[] {
  return ticks.filter((t) => t.productId === productId && t.storeId === storeId).map((t) => t.price);
}

export function movesFromTicks(ticks: QuoteTick[], names: Map<string, string>, limit = 24): PriceMove[] {
  const lastTwo = new Map<string, QuoteTick[]>();
  for (const t of ticks) {
    const k = tickKey(t.productId, t.storeId);
    const arr = lastTwo.get(k) ?? [];
    arr.push(t);
    lastTwo.set(k, arr);
  }
  const moves: PriceMove[] = [];
  for (const arr of lastTwo.values()) {
    if (arr.length < 2) continue;
    const prev = arr[arr.length - 2];
    const last = arr[arr.length - 1];
    if (prev.price === last.price) continue;
    moves.push({
      productId: last.productId,
      productName: names.get(last.productId) ?? last.productId,
      storeId: last.storeId,
      storeName: getStore(last.storeId)?.name ?? last.storeId,
      from: prev.price,
      to: last.price,
      at: last.at,
    });
  }
  return moves.sort((a, b) => b.at - a.at).slice(0, limit);
}

export function lastTickAt(ticks: QuoteTick[]) {
  return ticks.reduce((m, t) => Math.max(m, t.at), 0);
}
