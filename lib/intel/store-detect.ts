import type { AdapterKind } from "./types";

export type StorePlatform =
  | "shopify"
  | "woocommerce"
  | "magento"
  | "opencart"
  | "salla"
  | "zid"
  | "nextjs"
  | "react"
  | "laravel"
  | "custom";

export type StoreFingerprint = {
  platform: StorePlatform;
  adapter: AdapterKind;
  confidence: number;
  signals: string[];
  probeUrls: string[];
};

export function fingerprintStore(html: string, page: URL): StoreFingerprint {
  const signals: string[] = [];
  const origin = page.origin;
  const probes: string[] = [`${origin}/sitemap.xml`, `${origin}/robots.txt`];

  const hit = (re: RegExp, label: string) => {
    if (re.test(html) || re.test(page.hostname)) {
      signals.push(label);
      return true;
    }
    return false;
  };

  if (hit(/cdn\.shopify\.com|Shopify\.theme|myshopify/i, "shopify")) {
    probes.push(`${origin}/products.json?limit=50`);
    return { platform: "shopify", adapter: "shopify", confidence: 0.95, signals, probeUrls: probes };
  }
  if (hit(/woocommerce|wp-content\/plugins\/woocommerce/i, "woo")) {
    probes.push(`${origin}/wp-json/wc/store/v1/products?per_page=20`);
    return { platform: "woocommerce", adapter: "woocommerce", confidence: 0.9, signals, probeUrls: probes };
  }
  if (hit(/Magento_|mage-init|mage\/cookies/i, "magento")) {
    probes.push(`${origin}/graphql`);
    return { platform: "magento", adapter: "magento", confidence: 0.85, signals, probeUrls: probes };
  }
  if (hit(/salla\.|cdn\.salla/i, "salla")) {
    return { platform: "salla", adapter: "json-ld", confidence: 0.8, signals, probeUrls: probes };
  }
  if (hit(/zid\.|zidcdn/i, "zid")) {
    return { platform: "zid", adapter: "json-ld", confidence: 0.8, signals, probeUrls: probes };
  }
  if (hit(/catalog\/view\/theme|opencart/i, "opencart")) {
    return { platform: "opencart", adapter: "json-ld", confidence: 0.75, signals, probeUrls: probes };
  }
  if (hit(/__NEXT_DATA__/i, "next")) {
    return { platform: "nextjs", adapter: "next-embedded", confidence: 0.8, signals, probeUrls: probes };
  }
  if (hit(/laravel_session|csrf-token/i, "laravel") && /php/i.test(html)) {
    return { platform: "laravel", adapter: "css", confidence: 0.55, signals, probeUrls: probes };
  }
  if (hit(/data-reactroot|__REACT/i, "react")) {
    return { platform: "react", adapter: "next-embedded", confidence: 0.5, signals, probeUrls: probes };
  }
  return { platform: "custom", adapter: "unknown", confidence: 0.3, signals, probeUrls: probes };
}
