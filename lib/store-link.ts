import type { Store } from "./types";
import { foldArabic } from "./ar-fold";
import { isDeadShopUrl } from "./dead-hosts";
import { isGoogleShopUrl } from "./link-health";
import { safeShopQuery } from "./shop-query";
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
  if (!host || host.includes("google.")) return "";
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`;
}

/** Official search pages that open a real store, not Google. */
export const NATIVE_SEARCH: Record<string, (q: string) => string> = {
  jumia: (q) => `https://www.jumia.com.eg/catalog/?q=${q}`,
  amazon: (q) => `https://www.amazon.eg/s?k=${q}`,
  noon: (q) => `https://www.noon.com/egypt-ar/search?q=${q}`,
  ikea: (q) => `https://www.ikea.com/eg/ar/search/products/?q=${q}`,
};

export function hasNativeShopSearch(storeId: string) {
  return Object.hasOwn(NATIVE_SEARCH, storeId);
}

/** The merchant’s own site — never Google. */
export function storeSiteHref(store: Store) {
  if (store.id === "tradeline") return "https://www.tradelinestores.com/";
  if (store.id === "olympic") return "https://olympicelectric.com/";
  const raw = store.website || "";
  if (!raw || isDeadShopUrl(raw)) return "";
  try {
    const u = new URL(raw);
    if (isGoogleShopUrl(raw) || u.hostname.includes("google.")) return "";
    return `${u.protocol}//${u.host}/`;
  } catch {
    return "";
  }
}

export function canShopOut(storeId: string) {
  const store = getNetworkStore(storeId);
  if (!store || store.shipsEgypt === false) return false;
  if (store.kind === "district" || store.kind === "factory") return false;
  if (store.skuEstimate === 0) return false;
  if (isDeadShopUrl(store.website) && !storeSiteHref(store)) return false;
  return Boolean(hasNativeShopSearch(storeId) || storeSiteHref(store));
}

export function storeSearchUrl(store: Store, productName: string) {
  const native = hasNativeShopSearch(store.id) ? NATIVE_SEARCH[store.id] : undefined;
  const q = encodeURIComponent(safeShopQuery(productName));
  if (native) return native(q);
  return storeSiteHref(store);
}

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

export function storeHomeHref(website: string, storeId?: string, storeName?: string) {
  const store = storeId ? getNetworkStore(storeId) : undefined;
  if (store) {
    const site = storeSiteHref(store);
    if (site) return site;
  }
  const raw = website || "";
  if (storeId === "tradeline" || raw.toLowerCase().includes("tradeline.com.eg")) {
    return "https://www.tradelinestores.com/";
  }
  if (storeId === "olympic") return "https://olympicelectric.com/";
  if (!raw || isDeadShopUrl(raw) || isGoogleShopUrl(raw)) return "";
  try {
    const u = new URL(raw);
    if (u.hostname.includes("google.")) return "";
    return `${u.protocol}//${u.host}/`;
  } catch {
    return "";
  }
}

export function listingHref(storeId: string, productName: string, _fallbackUrl?: string) {
  const store = getNetworkStore(storeId);
  if (!store || store.shipsEgypt === false) return "";
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
