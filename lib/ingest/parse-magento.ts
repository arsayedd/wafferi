import type { Product } from "../types";
import { productFromRow, parsePrice } from "./product-from-row";
import { storeIdFromUrl } from "./host-store";
import { postPublic } from "./ssrf";

export function looksLikeMagento(html: string) {
  return /Magento_|mage\/cookies|text\/x-magento-init|catalog\/product/i.test(html);
}

const PRODUCTS_QUERY = `{
  products(pageSize: 12, currentPage: 1) {
    items {
      name
      sku
      url_key
      stock_status
      price_range {
        minimum_price {
          final_price { value }
          regular_price { value }
        }
      }
    }
  }
}`;

type MageItem = {
  name?: string;
  sku?: string;
  url_key?: string;
  stock_status?: string;
  price_range?: {
    minimum_price?: {
      final_price?: { value?: number };
      regular_price?: { value?: number };
    };
  };
};

export async function productsFromMagentoGraphql(page: URL): Promise<Product[]> {
  try {
    const { res, body } = await postPublic(`${page.origin}/graphql`, { query: PRODUCTS_QUERY });
    if (!res.ok) return [];
    const json = JSON.parse(body) as { data?: { products?: { items?: MageItem[] } } };
    const items = json.data?.products?.items ?? [];
    return items.slice(0, 12).map((p, i) => {
      const final = p.price_range?.minimum_price?.final_price?.value;
      const regular = p.price_range?.minimum_price?.regular_price?.value;
      const url = p.url_key ? `${page.origin}/${p.url_key}.html` : page.toString();
      return productFromRow(
        {
          id: p.sku ?? `mage-${i}`,
          name: p.name,
          sku: p.sku,
          price: parsePrice(final),
          regular_price: regular && final && regular > final ? regular : undefined,
          url,
          store: storeIdFromUrl(url),
          instock: String(p.stock_status ?? "").toUpperCase() === "OUT_OF_STOCK" ? "false" : "true",
        },
        i,
        page.toString(),
      );
    });
  } catch {
    return [];
  }
}
