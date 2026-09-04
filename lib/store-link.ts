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

/** Search on the merchant site — never a fake /p/{id} PDP that 404s. */
export function storeSearchUrl(store: Store, productName: string) {
  const q = encodeURIComponent(productName);
  const host = storeHostname(store.website);
  if (host.includes("amazon.")) return `https://www.amazon.eg/s?k=${q}`;
  if (host.includes("jumia.")) return `https://www.jumia.com.eg/catalog/?q=${q}`;
  if (host.includes("noon.")) return `https://www.noon.com/egypt-ar/search/?q=${q}`;
  if (host.includes("carrefour")) return `https://www.carrefouregypt.com/mafegy/ar/search?q=${q}`;
  if (host.includes("ikea.")) return `https://www.ikea.com/eg/ar/search/?q=${q}`;
  if (host.includes("btech.")) return `https://btech.com/eg-ar/catalogsearch/result/?q=${q}`;
  if (host.includes("2b.com")) return `https://2b.com.eg/ar/catalogsearch/result/?q=${q}`;
  if (host.includes("homzmart.")) return `https://homzmart.com/ar/search?q=${q}`;
  if (host.includes("namshi.")) return `https://www.namshi.com/eg-ar/search/?q=${q}`;
  const base = store.website.replace(/\/$/, "");
  return `${base}`;
}

export function listingHref(storeId: string, productName: string, fallbackUrl?: string) {
  const store = getNetworkStore(storeId);
  if (!store) return fallbackUrl || "#";
  if (store.shipsEgypt === false) return store.website;
  const host = storeHostname(store.website);
  if (fallbackUrl) {
    try {
      const path = new URL(fallbackUrl).pathname;
      if (path.includes("/p/") || path.endsWith(`/${storeId}`) || /\/p\/[\w-]+$/.test(path)) {
        return storeSearchUrl(store, productName);
      }
    } catch {
      /* use search */
    }
  }
  if (host.includes("amazon.")) return storeSearchUrl(store, productName);
  return fallbackUrl || storeSearchUrl(store, productName);
}

export function isEgyptSeller(store?: Store) {
  if (!store) return false;
  if (store.shipsEgypt === false) return false;
  return true;
}
