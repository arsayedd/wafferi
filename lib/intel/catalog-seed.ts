import { products } from "../catalog";
import { listingHref } from "../store-link";
import { snapshotsFromCatalogProduct } from "./from-product";
import { shopQueryFromProduct } from "../shop-query";
import type { ChangeEvent, WatchItem } from "./types";

const SEED_IDS = [
  "lg-washer-8",
  "toshiba-fridge-16",
  "unionaire-stove",
  "fresh-heater",
  "kenwood-mixer",
  "tefal-pots",
  "lg-tv-55",
  "bosch-dishwasher",
];

/** Stable timestamp so SSR and the browser paint the same dashboard. */
export const CATALOG_REF_AT = Date.UTC(2026, 8, 4, 12, 0, 0);

function productIdFromWatch(id: string) {
  return id.startsWith("catalog-") ? id.slice("catalog-".length) : "";
}

/** Reference rows from the local catalog — not a live scrape of Egypt retail. */
export function catalogReferenceWatches(now = CATALOG_REF_AT): WatchItem[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  const picked = SEED_IDS.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const extra = products.filter((p) => !SEED_IDS.includes(p.id)).slice(0, 4);
  return [...picked, ...extra].map((p, i) => {
    const snaps = snapshotsFromCatalogProduct(p, now);
    return {
      id: `catalog-${p.id}`,
      url: listingHref("jumia", shopQueryFromProduct(p)),
      tier: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5,
      lastCheck: now,
      snapshot: snaps[0],
      lastSnapshots: snaps,
      history: snaps.slice(0, 1),
      waterfall: ["كتالوج وفّري (مرجعي)", "مش سحب صفحة متجر"],
      platform: "catalog-reference",
      robotsNote: "أسعار مرجعية جوّه وفّري. التحديث الحي يحتاج فيد/JSON-LD مصرّح.",
    };
  });
}

export function refillWatchSnapshots(watch: WatchItem, now = CATALOG_REF_AT): WatchItem {
  if ((watch.lastSnapshots ?? []).length && watch.snapshot) return watch;
  const pid = productIdFromWatch(watch.id);
  const p = products.find((x) => x.id === pid);
  if (!p) return watch;
  const snaps = snapshotsFromCatalogProduct(p, now);
  return {
    ...watch,
    snapshot: watch.snapshot ?? snaps[0],
    lastSnapshots: (watch.lastSnapshots ?? []).length ? watch.lastSnapshots : snaps,
    history: watch.history?.length ? watch.history : snaps.slice(0, 1),
    waterfall: watch.waterfall?.length ? watch.waterfall : ["كتالوج وفّري (مرجعي)"],
    platform: watch.platform ?? "catalog-reference",
  };
}

export function hydrateIntelWatches(saved?: WatchItem[]): WatchItem[] {
  const seed = catalogReferenceWatches();
  if (!saved?.length) return seed;
  const filled = saved.map((w) => refillWatchSnapshots(w));
  if (filled.some((w) => (w.lastSnapshots ?? []).length > 0)) return filled;
  return seed;
}

export function defaultMyPrice(watches: WatchItem[]) {
  const prices = watches.flatMap((w) => w.lastSnapshots ?? []).map((s) => s.price).filter((n) => n > 0);
  return prices.length ? Math.min(...prices) : 0;
}

/** Spread between sellers in the catalog — not a live price tick. */
export function catalogSpreadEvents(watches: WatchItem[], at = CATALOG_REF_AT): ChangeEvent[] {
  const out: ChangeEvent[] = [];
  for (const w of watches) {
    const snaps = [...(w.lastSnapshots ?? [])].filter((s) => s.price > 0).sort((a, b) => a.price - b.price);
    if (snaps.length < 2) continue;
    const low = snaps[0];
    const high = snaps[snaps.length - 1];
    if (high.price <= low.price) continue;
    out.push({
      id: `spread-${w.id}`,
      url: low.url,
      at,
      kind: "price",
      from: String(high.price),
      to: String(low.price),
      message: `${low.name}: أعلى عرض ${high.seller} ${high.price}ج مقابل ${low.seller} ${low.price}ج (كتالوج مرجعي)`,
    });
  }
  return out;
}
