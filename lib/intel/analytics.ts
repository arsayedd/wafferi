import type { CompetitiveSnapshot } from "./types";
import { discountPct } from "./types";

export function marketAnalytics(snaps: CompetitiveSnapshot[]) {
  if (!snaps.length) {
    return {
      lowest: 0,
      highest: 0,
      average: 0,
      gap: 0,
      avgDiscount: 0,
      stockPct: 0,
      sellers: 0,
    };
  }
  const prices = snaps.map((s) => s.price).filter((p) => p > 0);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  const average = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const discs = snaps.map(discountPct).filter((d) => d > 0);
  const inStock = snaps.filter((s) => s.stock === "in_stock" || s.availability === "in_stock").length;
  return {
    lowest,
    highest,
    average,
    gap: highest - lowest,
    avgDiscount: discs.length ? Math.round(discs.reduce((a, b) => a + b, 0) / discs.length) : 0,
    stockPct: Math.round((inStock / snaps.length) * 100),
    sellers: new Set(snaps.map((s) => s.seller)).size,
  };
}

export function positionVsMarket(myPrice: number, snaps: CompetitiveSnapshot[]) {
  const { average, lowest } = marketAnalytics(snaps);
  if (!average) return { vsAvg: 0, vsLow: 0 };
  return {
    vsAvg: Number((((myPrice - average) / average) * 100).toFixed(1)),
    vsLow: Number((((myPrice - lowest) / lowest) * 100).toFixed(1)),
  };
}
