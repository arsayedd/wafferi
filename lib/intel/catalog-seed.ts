import { products } from "../catalog";
import { listingHref } from "../store-link";
import { snapshotsFromCatalogProduct } from "./from-product";
import type { WatchItem } from "./types";

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

/** Reference rows from the local catalog — not a live scrape of Egypt retail. */
export function catalogReferenceWatches(now = Date.now()): WatchItem[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  const picked = SEED_IDS.map((id) => byId.get(id)).filter(Boolean);
  const extra = products.filter((p) => !SEED_IDS.includes(p.id)).slice(0, 4);
  return [...picked, ...extra].map((p, i) => {
    const snaps = snapshotsFromCatalogProduct(p!, now);
    return {
      id: `catalog-${p!.id}`,
      url: listingHref("jumia", p!.name),
      tier: (i % 5) + 1 as 1 | 2 | 3 | 4 | 5,
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
