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

/** Search URLs that land on a real catalog page — not invented /p/{sku} and not DNS-dead hosts. */
const TRUSTED_SEARCH: Record<string, (q: string) => string> = {
  jumia: (q) => `https://www.jumia.com.eg/catalog/?q=${q}`,
  amazon: (q) => `https://www.amazon.eg/s?k=${q}`,
  noon: (q) => `https://www.noon.com/egypt-ar/search?q=${q}`,
  tradeline: (q) => `https://www.tradelinestores.com/search?q=${q}`,
  raya: (q) => `https://www.rayashop.com/ar/search?q=${q}`,
  ikea: (q) => `https://www.ikea.com/eg/ar/search/products/?q=${q}`,
  dream2000: (q) => `https://dream2000.com/search?q=${q}`,
  raneen: (q) => `https://www.raneen.com/catalogsearch/result/?q=${q}`,
  "tawhid-nour": (q) => `https://tawheedwnour.com/search?q=${q}`,
  alreyada: (q) => `https://alreyadastore.com/search?q=${q}`,
  btech: (q) => `https://btech.com/catalogsearch/result/?q=${q}`,
  twob: (q) => `https://2b.com.eg/catalogsearch/result/?q=${q}`,
  extra: (q) => `https://www.extra.com/ar-eg/search?q=${q}`,
  homzmart: (q) => `https://homzmart.com/en/search?q=${q}`,
  defacto: (q) => `https://www.defacto.com.eg/search?q=${q}`,
  max: (q) => `https://www.maxfashion.com/eg/ar/search?q=${q}`,
  namshi: (q) => `https://www.namshi.com/uae-en/search/?q=${q}`,
  radioshack: (q) => `https://radioshack.com.eg/catalogsearch/result/?q=${q}`,
  hyperone: (q) => `https://hyperone.com.eg/search?q=${q}`,
  elaraby: (q) =>
    `https://www.google.com.eg/search?q=${encodeURIComponent("site:elarabygroup.com")}%20${q}`,
  olympic: (q) => `https://www.google.com.eg/search?q=${encodeURIComponent("أوليمبيك")}%20${q}%20مصر`,
  cara: (q) => `https://www.google.com.eg/search?q=${encodeURIComponent("كارا")}%20${q}%20مصر`,
  spinneys: (q) => `https://www.spinneys-egypt.com/search?q=${q}`,
  gourmet: (q) => `https://gourmetegypt.com/catalogsearch/result/?q=${q}`,
};

export function canShopOut(storeId: string) {
  const store = getNetworkStore(storeId);
  if (!store || store.shipsEgypt === false) return false;
  if (store.kind === "district" || store.kind === "factory") return false;
  if (store.skuEstimate === 0) return false;
  if (isDeadShopUrl(store.website)) return false;
  return true;
}

export function storeSearchUrl(store: Store, productName: string) {
  const q = encodeURIComponent(productName);
  const trusted = TRUSTED_SEARCH[store.id];
  if (trusted) return trusted(q);
  const host = storeHostname(store.website);
  if (host && !host.includes("google.") && !isDeadShopUrl(store.website)) {
    return `https://www.google.com.eg/search?q=${encodeURIComponent(`site:${host} ${productName}`)}`;
  }
  return `https://www.google.com.eg/search?q=${encodeURIComponent(`${productName} ${store.name} مصر للبيع`)}`;
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
  const raw = website || "";
  if (!raw || isDeadShopUrl(raw)) {
    if (storeId === "tradeline" || raw.toLowerCase().includes("tradeline.com.eg")) {
      return "https://www.tradelinestores.com";
    }
    return `https://www.google.com.eg/search?q=${encodeURIComponent(`${storeName || "متجر"} مصر`)}`;
  }
  return raw;
}

export function listingHref(storeId: string, productName: string, _fallbackUrl?: string) {
  const store = getNetworkStore(storeId);
  if (!store) {
    return `https://www.google.com.eg/search?q=${encodeURIComponent(`${productName} مصر`)}`;
  }
  if (store.shipsEgypt === false) {
    return `https://www.google.com.eg/search?q=${encodeURIComponent(`${productName} مصر`)}`;
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
