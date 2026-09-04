import type { CompetitiveSnapshot } from "./types";
import { parseMoney } from "../ingest/money";
import { storeIdFromUrl } from "../ingest/host-store";

function walk(node: unknown, hits: Record<string, unknown>[], depth = 0) {
  if (depth > 8 || hits.length > 12 || node == null) return;
  if (Array.isArray(node)) {
    node.slice(0, 30).forEach((n) => walk(n, hits, depth + 1));
    return;
  }
  if (typeof node !== "object") return;
  const rec = node as Record<string, unknown>;
  const price = rec.price ?? rec.amount ?? rec.finalPrice ?? rec.productPrice;
  const name = rec.name ?? rec.title ?? rec.productName;
  if (price != null && name) hits.push(rec);
  for (const v of Object.values(rec).slice(0, 40)) walk(v, hits, depth + 1);
}

export function snapshotsFromEmbeddedJson(html: string, pageUrl: string): CompetitiveSnapshot[] {
  const blocks: string[] = [];
  const next = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
  if (next) blocks.push(next[1]);
  const nuxt = html.match(/window\.__NUXT__\s*=\s*(\{[\s\S]*?\});/);
  if (nuxt) blocks.push(nuxt[1]);
  const mage = html.match(/<script type="text\/x-magento-init"[^>]*>([\s\S]*?)<\/script>/i);
  if (mage) blocks.push(mage[1]);
  const out: CompetitiveSnapshot[] = [];
  for (const raw of blocks) {
    try {
      const hits: Record<string, unknown>[] = [];
      walk(JSON.parse(raw), hits);
      for (const rec of hits) {
        const price = parseMoney(rec.price ?? rec.amount ?? rec.finalPrice);
        if (!price) continue;
        const compareAt = parseMoney(rec.compare_at_price ?? rec.regularPrice ?? rec.oldPrice);
        out.push({
          url: pageUrl,
          seller: storeIdFromUrl(pageUrl),
          adapter: "next-embedded",
          name: String(rec.name ?? rec.title ?? "منتج"),
          brand: rec.brand ? String(rec.brand) : undefined,
          sku: rec.sku ? String(rec.sku) : undefined,
          gtin: rec.gtin || rec.barcode ? String(rec.gtin ?? rec.barcode) : undefined,
          price,
          compareAt: compareAt > price ? compareAt : undefined,
          currency: "EGP",
          availability: String(rec.availability ?? rec.inStock ?? "").toLowerCase().includes("out")
            ? "out_of_stock"
            : "in_stock",
          checkedAt: Date.now(),
        });
        if (out.length >= 8) return out;
      }
    } catch {
      /* ignore */
    }
  }
  return out;
}
