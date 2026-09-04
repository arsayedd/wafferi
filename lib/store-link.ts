import type { Product, Store } from "./types";
import { foldArabic } from "./ar-fold";
import { isDeadShopUrl } from "./dead-hosts";
import { stores } from "./network";

export function getNetworkStore(id: string) {
  return stores.find((s) => s.id === id);
}

export function storeHostname(website: string) {
  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website;
  }
}

export function storeLogoUrl(website: string) {
  const host = storeHostname(website);
  if (!host) return "";
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`;
}

/** Direct search only on hosts that resolve and are not fake /p/{sku} pages. */
const TRUSTED_SEARCH: Record<string, (q: string) => string> = {
  jumia: (q) => `https://www.jumia.com.eg/catalog/?q=${q}`,
  tradeline: (q) => `https://www.tradelinestores.com/search?q=${q}`,
};

const BRAND_SHOPS: Record<string, string[]> = {
  lgshop: ["lg", "ال جي", "إل جي"],
  samsung: ["samsung", "سامسونج"],
  boschshop: ["bosch", "بوش"],
  bekoshop: ["beko", "بيكو"],
  fresh: ["fresh", "فريش"],
  unionaire: ["unionaire", "يونيون"],
  kiriazi: ["kiriazi", "كريازي"],
  tornado: ["tornado", "تورنيدو"],
  cottonil: ["cottonil", "كوتونيل"],
  defacto: ["defacto", "ديفاكتو"],
  elaraby: ["العربي", "elaraby"],
};

export function brandShopFits(store: Store, product: { brand: string; name: string }) {
  const keys = BRAND_SHOPS[store.id];
  if (!keys) {
    if (store.kind !== "brand" && store.connector !== "brand_portal") return true;
    const token = foldArabic(store.name).split(/\s+/)[0] ?? "";
    if (token.length < 3) return false;
    return foldArabic(`${product.brand} ${product.name}`).includes(token);
  }
  const blob = foldArabic(`${product.brand} ${product.name}`);
  return keys.some((k) => blob.includes(foldArabic(k)));
}

export function storeSearchUrl(store: Store, productName: string) {
  const q = encodeURIComponent(productName);
  const trusted = TRUSTED_SEARCH[store.id];
  if (trusted) return trusted(q);
  return `https://www.google.com/search?q=${encodeURIComponent(`${productName} ${store.name} مصر للبيع`)}`;
}

export function storeHomeHref(website: string, storeId?: string, storeName?: string) {
  const raw = website || "";
  if (!raw || isDeadShopUrl(raw)) {
    if (storeId === "tradeline" || raw.toLowerCase().includes("tradeline.com.eg")) {
      return "https://www.tradelinestores.com";
    }
    return `https://www.google.com/search?q=${encodeURIComponent(`${storeName || "متجر"} مصر`)}`;
  }
  return raw;
}

export function listingHref(storeId: string, productName: string, _fallbackUrl?: string) {
  const store = getNetworkStore(storeId);
  if (!store) {
    return `https://www.google.com/search?q=${encodeURIComponent(`${productName} مصر`)}`;
  }
  if (store.shipsEgypt === false) {
    return `https://www.google.com/search?q=${encodeURIComponent(`${productName} مصر`)}`;
  }
  return storeSearchUrl(store, productName);
}

export function isEgyptSeller(store?: Store) {
  if (!store) return false;
  return store.shipsEgypt !== false;
}

export function isFakeProductPath(url: string) {
  try {
    const path = new URL(url).pathname;
    return /\/p\/[a-z0-9_-]+$/i.test(path) || /\/catalog\/[a-z0-9_-]+$/i.test(path);
  } catch {
    return false;
  }
}
