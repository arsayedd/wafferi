import type { AdapterKind } from "./types";

export function detectAdapter(html: string, url: URL): AdapterKind {
  if (url.hostname.endsWith("myshopify.com") || /cdn\.shopify\.com|Shopify\.theme/i.test(html)) {
    return "shopify";
  }
  if (/wp-content|woocommerce/i.test(html)) return "woocommerce";
  if (/salla\.(?:sa|com)|cdn\.salla/i.test(html)) return "salla";
  if (/zid\.(?:sa|store)|zidcdn/i.test(html)) return "zid";
  if (/catalog\/view\/theme|opencart/i.test(html)) return "opencart";
  if (/Magento|mage\/cookies|mage-init/i.test(html)) return "magento";
  if (/__NEXT_DATA__|__NUXT__/i.test(html)) return "next-embedded";
  if (/application\/ld\+json/i.test(html)) return "json-ld";
  if (/og:price|product:price:amount/i.test(html)) return "open-graph";
  return "unknown";
}
