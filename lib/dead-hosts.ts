/** Hosts that NXDOMAIN or fail DNS (Akamai edgesuite). Never send shoppers here. */
export const DEAD_SHOP_RE =
  /tradeline\.com\.eg|carrefouregypt|edgesuite\.net|edgekey\.net|mafretailprod|mafegy|olympic\.com\.eg|cara-eg\.com/i;

export function isDeadShopUrl(url: string) {
  try {
    const u = new URL(url.includes("://") ? url : `https://${url}`);
    return DEAD_SHOP_RE.test(u.hostname) || DEAD_SHOP_RE.test(u.pathname);
  } catch {
    return DEAD_SHOP_RE.test(url);
  }
}
