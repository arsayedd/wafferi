export type PartnerRule = {
  storeId: string;
  affiliateId: string;
  coupon: string;
  extraQuery: string;
};

export function buildOutboundUrl(
  rawUrl: string,
  rule?: PartnerRule,
  listingCoupon?: string,
): string {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    return rawUrl;
  }
  u.searchParams.set("utm_source", "waffari");
  u.searchParams.set("utm_medium", "affiliate");
  if (rule?.affiliateId.trim()) {
    u.searchParams.set("aff_id", rule.affiliateId.trim());
    if (u.hostname.includes("amazon.")) {
      u.searchParams.set("tag", rule.affiliateId.trim());
    }
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
