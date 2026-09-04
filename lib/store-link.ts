import type { Store } from "./types";
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

const SEARCH: Record<string, (q: string) => string> = {
  jumia: (q) => `https://www.jumia.com.eg/catalog/?q=${q}`,
  noon: (q) => `https://www.noon.com/egypt-ar/search/?q=${q}`,
  amazon: (q) => `https://www.amazon.eg/s?k=${q}`,
  carrefour: (q) => `https://www.carrefouregypt.com/mafegy/ar/search?q=${q}`,
  btech: (q) => `https://btech.com/eg-ar/catalogsearch/result/?q=${q}`,
  twob: (q) => `https://2b.com.eg/ar/catalogsearch/result/?q=${q}`,
  raya: (q) => `https://rayashop.com/search?q=${q}`,
  raneen: (q) => `https://raneen.com/en/catalogsearch/result/?q=${q}`,
  ikea: (q) => `https://www.ikea.com/eg/ar/search/?q=${q}`,
  homzmart: (q) => `https://homzmart.com/ar/search?q=${q}`,
  namshi: (q) => `https://www.namshi.com/eg-ar/search/?q=${q}`,
  samsung: (q) => `https://www.samsung.com/eg/search/?searchvalue=${q}`,
  lgshop: (q) => `https://www.lg.com/eg/search/?search=${q}`,
  boschshop: (q) => `https://www.bosch-home.com/eg/search?text=${q}`,
  bekoshop: (q) => `https://www.beko.com/eg-ar/search?q=${q}`,
  dream2000: (q) => `https://dream2000.com/catalogsearch/result/?q=${q}`,
  extra: (q) => `https://www.extra.com/ar-eg/search?q=${q}`,
  defacto: (q) => `https://www.defacto.com.eg/search?q=${q}`,
  tradeline: (q) => `https://www.tradelinestores.com/search?q=${q}`,
  sixthstreet: (q) => `https://www.6thstreet.com/eg-ar/search?q=${q}`,
  goldenscent: (q) => `https://www.goldenscent.com/eg-ar/search?q=${q}`,
};

/** Search on the merchant, or Google for the product + store in Egypt — never a fake /p/{id} page. */
export function storeSearchUrl(store: Store, productName: string) {
  const q = encodeURIComponent(productName);
  const known = SEARCH[store.id];
  if (known) return known(q);
  return `https://www.google.com/search?q=${encodeURIComponent(`${productName} ${store.name} مصر`)}`;
}

export function listingHref(storeId: string, productName: string, _fallbackUrl?: string) {
  const store = getNetworkStore(storeId);
  if (!store) return "#";
  if (store.shipsEgypt === false) return store.website;
  return storeSearchUrl(store, productName);
}

export function isEgyptSeller(store?: Store) {
  if (!store) return false;
  return store.shipsEgypt !== false;
}
