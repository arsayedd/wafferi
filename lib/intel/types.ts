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

export type WatchTier = 1 | 2 | 3 | 4;

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
  compareAt?: number;
  currency: "EGP";
  availability: "in_stock" | "out_of_stock" | "unknown";
  rating?: number;
  reviewCount?: number;
  category?: string;
  checkedAt: number;
};

export type ChangeEvent = {
  id: string;
  url: string;
  at: number;
  kind: "price" | "stock" | "discount";
  from: string;
  to: string;
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
};

export const TIER_MS: Record<WatchTier, number> = {
  1: 45_000,
  2: 5 * 60_000,
  3: 30 * 60_000,
  4: 12 * 60 * 60_000,
};

export const tierLabels: Record<WatchTier, string> = {
  1: "حرج — ٤٥ ثانية",
  2: "مهم — ٥ دقايق",
  3: "عادي — ٣٠ دقيقة",
  4: "اكتشاف كتالوج — ١٢ ساعة",
};

export function watchDue(w: WatchItem, now = Date.now()) {
  return now - w.lastCheck >= TIER_MS[w.tier];
}

export function discountPct(s: CompetitiveSnapshot) {
  if (!s.compareAt || s.compareAt <= s.price) return 0;
  return Math.round(((s.compareAt - s.price) / s.compareAt) * 100);
}
