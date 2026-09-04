import type { StockStatus } from "./stock";

export type AdapterKind =
  | "shopify"
  | "woocommerce"
  | "magento"
  | "opencart"
  | "salla"
  | "zid"
  | "json-ld"
  | "open-graph"
  | "next-embedded"
  | "api-feed"
  | "css"
  | "unknown";

export type WatchTier = 1 | 2 | 3 | 4 | 5;

/** بيانات تنافسية واقعية فقط — من غير وصف/صور/نصوص تسويق. */
export type CompetitiveSnapshot = {
  url: string;
  seller: string;
  adapter: AdapterKind;
  name: string;
  brand?: string;
  sku?: string;
  gtin?: string;
  variant?: string;
  price: number;
  previousPrice?: number;
  compareAt?: number;
  currency: "EGP";
  availability: "in_stock" | "out_of_stock" | "unknown";
  stock?: StockStatus;
  quantity?: number;
  rating?: number;
  reviewCount?: number;
  category?: string;
  checkedAt: number;
};

export type ChangeKind =
  | "price"
  | "price_down"
  | "price_up"
  | "stock"
  | "discount"
  | "new_product"
  | "removed"
  | "variant";

export type ChangeEvent = {
  id: string;
  url: string;
  at: number;
  kind: ChangeKind;
  from: string;
  to: string;
  message?: string;
};

export type WatchItem = {
  id: string;
  url: string;
  tier: WatchTier;
  lastCheck: number;
  snapshot?: CompetitiveSnapshot;
  lastSnapshots: CompetitiveSnapshot[];
  history: CompetitiveSnapshot[];
  waterfall: string[];
  error?: string;
  discovery?: string[];
  platform?: string;
  quietChecks?: number;
  changeChecks?: number;
  effectiveMs?: number;
  robotsNote?: string;
};

export const TIER_MS: Record<WatchTier, number> = {
  1: 60_000,
  2: 5 * 60_000,
  3: 30 * 60_000,
  4: 6 * 60 * 60_000,
  5: 24 * 60 * 60_000,
};

export const tierLabels: Record<WatchTier, string> = {
  1: "ساخن — دقيقة",
  2: "مهم — ٥ دقايق",
  3: "عادي — ٣٠ دقيقة",
  4: "منخفض — ٦ ساعات",
  5: "اكتشاف — ٢٤ ساعة",
};

export function watchDue(w: WatchItem, now = Date.now()) {
  const ms = w.effectiveMs ?? TIER_MS[w.tier];
  return now - w.lastCheck >= ms;
}

export function discountPct(s: CompetitiveSnapshot) {
  if (!s.compareAt || s.compareAt <= s.price) return 0;
  return Math.round(((s.compareAt - s.price) / s.compareAt) * 100);
}
