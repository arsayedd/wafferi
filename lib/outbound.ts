import { isFakeProductPath, listingHref } from "./store-link";

export type PartnerRule = {
  storeId: string;
  affiliateId: string;
  coupon: string;
  extraQuery: string;
};

function isRealAmazonProduct(pathname: string) {
  return /\/(dp|gp\/product|gp\/aw\/d)\/[A-Z0-9]{10}/i.test(pathname);
}

/** Drop invented /p/{sku} pages (Bosch, Carrefour, Tradeline…) and Amazon dead slugs. */
export function canonicalizeListingUrl(
  rawUrl: string,
  storeId?: string,
  productName?: string,
) {
  if (storeId && productName?.trim()) return listingHref(storeId, productName);
  try {
    const u = new URL(rawUrl);
    if (
      u.hostname.includes("carrefouregypt.") ||
      u.hostname.includes("edgesuite.net") ||
      u.hostname.includes("edgekey.net")
    ) {
      return listingHref(storeId ?? "carrefour", productName || "كارفور مصر");
    }
    if (isFakeProductPath(rawUrl)) {
      const slug = u.pathname.split("/").filter(Boolean).pop() ?? "";
      const guess = decodeURIComponent(slug).replace(/-/g, " ");
      return listingHref(storeId ?? "", productName || guess);
    }
    if (u.hostname.includes("amazon.")) {
      if (isRealAmazonProduct(u.pathname)) return `https://www.amazon.eg${u.pathname.split("?")[0]}`;
      const k =
        u.searchParams.get("k") ||
        decodeURIComponent((u.pathname.split("/").filter(Boolean)[0] ?? "").replace(/-/g, " "));
      return listingHref("amazon", productName || k || "أمازون مصر");
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
  const google = u.hostname.includes("google.");
  if (google) return u.toString();
  if (amazon) {
    return listingHref("amazon", productName || u.searchParams.get("k") || "أمازون مصر");
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
