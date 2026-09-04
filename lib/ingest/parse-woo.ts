import { productFromRow, parsePrice } from "./product-from-row";
import { storeIdFromUrl } from "./host-store";
import type { Product } from "../types";

export function wooStoreApiUrl(page: URL): string {
  const path = page.pathname.replace(/\/$/, "");
  if (/\/product\//i.test(path)) {
    const slug = path.split("/").filter(Boolean).pop();
    return `${page.origin}/wp-json/wc/store/v1/products?slug=${encodeURIComponent(slug ?? "")}`;
  }
  return `${page.origin}/wp-json/wc/store/v1/products?per_page=20`;
}

export function looksLikeWordpress(html: string) {
  return /wp-content|woocommerce|wc-block/i.test(html);
}

export function productsFromWoo(json: unknown, pageUrl: string): Product[] {
  const list = Array.isArray(json) ? json : json ? [json] : [];
  return (list as Record<string, unknown>[]).slice(0, 40).map((p, i) => {
    const prices = (p.prices ?? {}) as Record<string, unknown>;
    const minor = Number(prices.currency_minor_unit ?? 0);
    let price = parsePrice(prices.price ?? p.price);
    if (minor === 2 && price > 0) price = Math.round(price / 100);
    const url = String(p.permalink ?? pageUrl);
    return productFromRow(
      {
        id: String(p.id ?? `woo-${i}`),
        name: p.name ?? p.title,
        brand: (p.brands as { name?: string }[] | undefined)?.[0]?.name,
        price,
        sku: p.sku,
        url,
        store: storeIdFromUrl(url),
        instock: p.is_in_stock === false ? "false" : "true",
      },
      i,
      pageUrl,
    );
  });
}
