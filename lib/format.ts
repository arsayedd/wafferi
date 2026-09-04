const egp = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number) {
  return egp.format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("ar-EG").format(value);
}

export function affiliateHref(url: string) {
  const u = new URL(url);
  u.searchParams.set("utm_source", "waffari");
  u.searchParams.set("aff_id", "demo");
  return u.toString();
}
