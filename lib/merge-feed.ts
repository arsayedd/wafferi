import { textSimilarity } from "./matching";
import type { Product } from "./types";

function fold(s: string) {
  return s
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function scoreMatch(a: Product, b: Product) {
  if (a.barcode && b.barcode && a.barcode === b.barcode) return 1;
  if (a.model && b.model && fold(a.model) === fold(b.model) && fold(a.brand) === fold(b.brand)) {
    return 0.92;
  }
  if (fold(a.brand) !== fold(b.brand)) return 0;
  return textSimilarity(a.name, b.name);
}

export function findCatalogMatch(incoming: Product, pool: Product[]) {
  let best: { product: Product; score: number } | null = null;
  for (const p of pool) {
    const score = scoreMatch(incoming, p);
    if (score < 0.72) continue;
    if (!best || score > best.score) best = { product: p, score };
  }
  return best;
}

/** وحّد عروض الفيد على منتجات موجودة (باركود / موديل / اسم) زي منصات المقارنة. */
export function mergeFeedIntoCatalog(incoming: Product[], base: Product[]): Product[] {
  const out = base.map((p) => ({
    ...p,
    listings: p.listings.map((l) => ({ ...l })),
  }));

  for (const item of incoming) {
    const hit = findCatalogMatch(item, out);
    if (!hit) {
      out.unshift({
        ...item,
        listings: item.listings.map((l) => ({ ...l })),
      });
      continue;
    }
    const target = out.find((p) => p.id === hit.product.id);
    if (!target) continue;
    if (item.barcode && !target.barcode) target.barcode = item.barcode;
    for (const listing of item.listings) {
      const idx = target.listings.findIndex((l) => l.storeId === listing.storeId);
      if (idx >= 0) target.listings[idx] = { ...target.listings[idx], ...listing };
      else target.listings.push({ ...listing });
    }
  }
  return out;
}
