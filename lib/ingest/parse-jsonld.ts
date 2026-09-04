import { parsePrice, productFromRow, slug } from "./product-from-row";
import { storeIdFromUrl } from "./host-store";
import type { Product } from "../types";

function asArray(node: unknown): Record<string, unknown>[] {
  if (!node) return [];
  if (Array.isArray(node)) return node.filter((x) => x && typeof x === "object") as Record<string, unknown>[];
  if (typeof node === "object") return [node as Record<string, unknown>];
  return [];
}

function typeOf(node: Record<string, unknown>): string {
  const t = node["@type"] ?? node["@Type"];
  if (Array.isArray(t)) return t.map(String).join(" ");
  return String(t ?? "");
}

function walk(node: unknown, acc: Record<string, unknown>[]): void {
  if (!node) return;
  if (Array.isArray(node)) {
    node.forEach((n) => walk(n, acc));
    return;
  }
  if (typeof node !== "object") return;
  const rec = node as Record<string, unknown>;
  const t = typeOf(rec).toLowerCase();
  if (t.includes("product") || t.includes("offer")) acc.push(rec);
  if (rec["@graph"]) walk(rec["@graph"], acc);
  if (rec.itemListElement) walk(rec.itemListElement, acc);
  if (rec.mainEntity) walk(rec.mainEntity, acc);
  if (rec.offers) walk(rec.offers, acc);
}

export function productsFromJsonLd(html: string, pageUrl: string): Product[] {
  const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const nodes: Record<string, unknown>[] = [];
  for (const b of blocks) {
    try {
      walk(JSON.parse(b[1].replace(/[\u0000-\u001f]/g, " ")), nodes);
    } catch {
      /* ignore broken ld+json */
    }
  }
  const products: Product[] = [];
  let i = 0;
  for (const n of nodes) {
    const t = typeOf(n).toLowerCase();
    if (!t.includes("product")) continue;
    const offers = asArray(n.offers);
    const offer = offers[0] ?? n;
    const brand =
      typeof n.brand === "string"
        ? n.brand
        : String((n.brand as Record<string, unknown> | undefined)?.name ?? "غير محدد");
    const url = String(n.url ?? offer.url ?? pageUrl);
    const price = parsePrice(offer.price ?? offer.lowPrice ?? n.price);
    if (!n.name && !price) continue;
    products.push(
      productFromRow(
        {
          name: n.name,
          brand,
          price,
          compare_at_price: parsePrice((offer as { highPrice?: unknown }).highPrice),
          sku: n.sku ?? n.mpn ?? n.productID,
          barcode: n.gtin13 ?? n.gtin ?? n.gtin14 ?? n.isbn,
          url,
          store: storeIdFromUrl(url),
          availability: offer.availability,
        },
        i++,
        pageUrl,
      ),
    );
    if (products.length >= 40) break;
  }
  return products;
}

export function productsFromOpenGraph(html: string, pageUrl: string): Product[] {
  const meta = (prop: string) => {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
      "i",
    );
    const re2 = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
      "i",
    );
    return html.match(re)?.[1] ?? html.match(re2)?.[1] ?? "";
  };
  const title = meta("og:title") || meta("twitter:title");
  const price = parsePrice(meta("product:price:amount") || meta("og:price:amount"));
  if (!title || !price) return [];
  return [
    productFromRow(
      {
        name: title,
        brand: meta("product:brand") || "غير محدد",
        price,
        url: meta("og:url") || pageUrl,
        id: `og-${slug(title)}`,
      },
      0,
      pageUrl,
    ),
  ];
}
