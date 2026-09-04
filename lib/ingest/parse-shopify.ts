import { productFromRow, parsePrice } from "./product-from-row";
import { storeIdFromUrl } from "./host-store";
import type { Product } from "../types";

type ShopifyProduct = {
  id?: number | string;
  title?: string;
  vendor?: string;
  product_type?: string;
  handle?: string;
  variants?: {
    price?: string;
    compare_at_price?: string | null;
    sku?: string;
    barcode?: string;
    available?: boolean;
    title?: string;
  }[];
};

export function shopifyJsonUrl(page: URL): string | null {
  const path = page.pathname.replace(/\/$/, "");
  if (/\/products\/[^/]+$/i.test(path)) {
    return `${page.origin}${path}.json`;
  }
  if (path === "" || path === "/" || /\/collections\//i.test(path)) {
    return `${page.origin}/products.json?limit=50`;
  }
  return null;
}

export function looksLikeShopify(html: string, url: URL) {
  if (url.hostname.endsWith("myshopify.com")) return true;
  if (/\/products\/[^/]+/i.test(url.pathname)) return true;
  return /cdn\.shopify\.com|Shopify\.theme|myshopify/i.test(html);
}

export function productsFromShopifyJson(json: unknown, pageUrl: string): Product[] {
  const root = json as { product?: ShopifyProduct; products?: ShopifyProduct[] };
  const list = root.products ?? (root.product ? [root.product] : []);
  return list.slice(0, 50).map((p, i) => {
    const v = p.variants?.[0];
    const url = p.handle
      ? `${new URL(pageUrl).origin}/products/${p.handle}`
      : pageUrl;
    return productFromRow(
      {
        id: String(p.id ?? `shopify-${i}`),
        name: p.title,
        brand: p.vendor,
        category: p.product_type,
        price: parsePrice(v?.price),
        compare_at_price: v?.compare_at_price ?? undefined,
        sku: v?.sku,
        barcode: v?.barcode,
        url,
        store: storeIdFromUrl(url),
        instock: v?.available === false ? "false" : "true",
      },
      i,
      pageUrl,
    );
  });
}
