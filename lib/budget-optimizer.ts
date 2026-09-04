import { cheapestListing, getProduct, products as catalog } from "./catalog";
import { bestChoiceScore } from "./best-choice";
import type { ListItem, Product } from "./types";

export type SwitchTip = {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  save: number;
};

function listingPrice(p: Product, storeId?: string) {
  if (storeId) {
    const hit = p.listings.find((l) => l.storeId === storeId && l.inStock) ?? p.listings.find((l) => l.storeId === storeId);
    if (hit) return hit.price;
  }
  return cheapestListing(p).price;
}

export function collectionTotals(items: ListItem[], resolve: (id: string) => Product | undefined = getProduct) {
  let selected = 0;
  let lowest = 0;
  let highest = 0;
  for (const item of items) {
    const p = resolve(item.productId);
    if (!p) continue;
    const qty = item.qty || 1;
    selected += listingPrice(p, item.storeId) * qty;
    lowest += cheapestListing(p).price * qty;
    const max = Math.max(...p.listings.map((l) => l.price));
    highest += max * qty;
  }
  return {
    selected,
    lowest,
    highest,
    saving: Math.max(0, selected - lowest),
    vsHigh: Math.max(0, highest - lowest),
  };
}

export function budgetSwitches(
  items: ListItem[],
  pool: Product[] = catalog,
  resolve: (id: string) => Product | undefined = getProduct,
): SwitchTip[] {
  const have = new Set(items.map((i) => i.productId));
  const tips: SwitchTip[] = [];
  for (const item of items) {
    const current = resolve(item.productId);
    if (!current) continue;
    const now = listingPrice(current, item.storeId);
    const alts = pool.filter(
      (p) => p.category === current.category && p.id !== current.id && !have.has(p.id),
    );
    let best: Product | undefined;
    let bestPrice = now;
    for (const alt of alts) {
      const price = cheapestListing(alt).price;
      if (price < bestPrice - 80 && bestChoiceScore(alt) >= bestChoiceScore(current) * 0.72) {
        best = alt;
        bestPrice = price;
      }
    }
    if (best) {
      tips.push({
        fromId: current.id,
        fromName: current.name,
        toId: best.id,
        toName: best.name,
        save: now - bestPrice,
      });
    }
  }
  return tips.sort((a, b) => b.save - a.save).slice(0, 6);
}
