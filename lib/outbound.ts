import { listingHref } from "./store-link";

export type PartnerRule = {
  storeId: string;
  affiliateId: string;
  coupon: string;
  extraQuery: string;
};

function isRealAmazonProduct(pathname: string) {
  return /\/(dp|gp\/product|gp\/aw\/d)\/[A-Z0-9]{10}/i.test(pathname);
}

/** Fake paths like amazon.eg/samsung-18 show Amazon's "Looking for something?" page. */
export function canonicalizeListingUrl(
  rawUrl: string,
  storeId?: string,
  productName?: string,
) {
  if (storeId && productName?.trim()) return listingHref(storeId, productName);
  try {
    const u = new URL(rawUrl);
    if (u.hostname.includes("amazon.")) {
      if (isRealAmazonProduct(u.pathname)) return `https://www.amazon.eg${u.pathname.split("?")[0]}`;
      if (u.pathname.includes("/s")) {
        const k = u.searchParams.get("k");
        if (k) return `https://www.amazon.eg/-/ar/s?k=${encodeURIComponent(k)}`;
      }
      const slug = u.pathname.split("/").filter(Boolean)[0] ?? "";
      const k = decodeURIComponent(slug).replace(/-/g, " ").trim() || "home";
      return `https://www.amazon.eg/-/ar/s?k=${encodeURIComponent(k)}`;
    }
  } catch {
    /* keep */
  }
  return rawUrl;
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
    return safe;
  }
  const amazon = u.hostname.includes("amazon.");
  if (amazon) {
    if (rule?.affiliateId.trim()) u.searchParams.set("tag", rule.affiliateId.trim());
    return u.toString();
  }
  u.searchParams.set("utm_source", "waffari");
  u.searchParams.set("utm_medium", "affiliate");
  if (rule?.affiliateId.trim()) {
    u.searchParams.set("aff_id", rule.affiliateId.trim());
    if (u.hostname.includes("jumia.")) {
      u.searchParams.set("sid", rule.affiliateId.trim());
    }
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
