import { productFromRow } from "./product-from-row";
import type { Product } from "../types";

function tag(xml: string, name: string) {
  const re = new RegExp(`<(?:g:)?${name}[^>]*>([\\s\\S]*?)</(?:g:)?${name}>`, "i");
  const m = xml.match(re);
  return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
}

export function parseMerchantXml(xml: string, sourceUrl?: string): Product[] {
  const chunks = xml.split(/<item[\s>]/i).slice(1);
  const products: Product[] = [];
  chunks.forEach((chunk, i) => {
    const item = chunk.split(/<\/item>/i)[0];
    if (!item) return;
    const row = {
      id: tag(item, "id") || tag(item, "guid"),
      title: tag(item, "title"),
      description: tag(item, "description"),
      link: tag(item, "link"),
      "g:price": tag(item, "price") || tag(item, "sale_price"),
      "g:brand": tag(item, "brand"),
      "g:gtin": tag(item, "gtin"),
      sku: tag(item, "mpn") || tag(item, "id"),
      availability: tag(item, "availability"),
    };
    if (!row.title && !row["g:price"]) return;
    products.push(productFromRow(row, i, sourceUrl));
  });
  return products;
}
