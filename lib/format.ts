import { buildOutboundUrl } from "./outbound";

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
  return buildOutboundUrl(url);
}
