import type { Product, Store } from "./types";
import { foldArabic } from "./ar-fold";
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

/** Only these search URLs are known to work in Egypt. Everything else is a Google query. */
const TRUSTED_SEARCH: Record<string, (q: string) => string> = {
  jumia: (q) => `https://www.jumia.com.eg/catalog/?q=${q}`,
  noon: (q) => `https://www.noon.com/egypt-ar/search/?q=${q}`,
  amazon: (q) => `https://www.amazon.eg/-/ar/s?k=${q}`,
  carrefour: (q) => `https://www.carrefouregypt.com/mafegy/ar/search?q=${q}`,
  btech: (q) => `https://btech.com/eg-ar/catalogsearch/result/?q=${q}`,
  twob: (q) => `https://2b.com.eg/ar/catalogsearch/result/?q=${q}`,
  ikea: (q) => `https://www.ikea.com/eg/ar/search/?q=${q}`,
  namshi: (q) => `https://www.namshi.com/eg-ar/search/?q=${q}`,
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
  return `https://www.google.com/search?q=${encodeURIComponent(`${productName} ${store.name} مصر`)}`;
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
