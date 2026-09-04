import { isFakeProductPath, listingHref } from "./store-link";

export type PartnerRule = {
  storeId: string;
  affiliateId: string;
  coupon: string;
  extraQuery: string;
};

const DEAD_SHOP =
  /carrefouregypt|tradeline\.com\.eg|edgesuite\.net|edgekey\.net|mafretailprod|mafegy/i;

function isJumiaHost(hostname: string) {
  return hostname.includes("jumia.");
}

function isGoogleHost(hostname: string) {
  return hostname.includes("google.");
}

/** Never send shoppers to invented /p/{sku} pages or Carrefour’s broken Akamai host. */
export function forceShopOut(url: string, storeId?: string, productName?: string) {
  const name = productName?.trim() || "منتج جهاز";
  let id = storeId?.trim() || "";
  try {
    const u = new URL(url);
    if (!id && (DEAD_SHOP.test(u.hostname) || u.hostname.includes("carrefour"))) {
      id = u.hostname.includes("tradeline") ? "tradeline" : "carrefour";
    }
    const fallback = listingHref(id || "jumia", name);
    if (DEAD_SHOP.test(u.hostname) || DEAD_SHOP.test(u.pathname)) return fallback;
    if (isFakeProductPath(url) || /\/p\/[a-z0-9_-]+/i.test(u.pathname)) return fallback;
    if (u.hostname.includes("carrefour")) return fallback;
    return u.toString();
  } catch {
    return listingHref(id || "jumia", name);
  }
}

export function canonicalizeListingUrl(
  rawUrl: string,
  storeId?: string,
  productName?: string,
) {
  if (storeId && productName?.trim()) {
    return forceShopOut(listingHref(storeId, productName), storeId, productName);
  }
  return forceShopOut(rawUrl, storeId, productName);
}

export function buildOutboundUrl(
  rawUrl: string,
  rule?: PartnerRule,
  listingCoupon?: string,
  productName?: string,
): string {
  const safe = canonicalizeListingUrl(rawUrl, rule?.storeId, productName);
  let u: URL;
  try {
    u = new URL(safe);
  } catch {
    return listingHref(rule?.storeId ?? "jumia", productName || "منتج جهاز");
  }
  if (DEAD_SHOP.test(u.hostname) || isFakeProductPath(u.toString())) {
    return listingHref(rule?.storeId ?? "carrefour", productName || "كارفور مصر");
  }
  if (isGoogleHost(u.hostname)) return u.toString();
  if (!isJumiaHost(u.hostname)) {
    return listingHref(rule?.storeId ?? "", productName || "منتج جهاز");
  }
  u.searchParams.set("utm_source", "waffari");
  u.searchParams.set("utm_medium", "affiliate");
  if (rule?.affiliateId.trim()) {
    u.searchParams.set("aff_id", rule.affiliateId.trim());
    u.searchParams.set("sid", rule.affiliateId.trim());
  }
  const coupon = (listingCoupon || rule?.coupon || "").trim();
  if (coupon) {
    u.searchParams.set("coupon", coupon);
    u.searchParams.set("voucher", coupon);
  }
  if (rule?.extraQuery.trim()) {
    const extra = new URLSearchParams(rule.extraQuery.replace(/^\?/, ""));
    extra.forEach((v, k) => {
      if (k) u.searchParams.set(k, v);
    });
  }
  return u.toString();
}

export function hostnameOf(rawUrl: string) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
