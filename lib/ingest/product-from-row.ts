import type { CategoryId, Product } from "../types";
import { categories } from "../catalog";
import { parseMoney } from "./money";
import { storeIdFromUrl } from "./host-store";

const fallbackCategory: CategoryId = "accessories";

export function categoryOf(raw: string | undefined): CategoryId {
  if (!raw) return fallbackCategory;
  const id = raw.trim() as CategoryId;
  if (categories.some((c) => c.id === id)) return id;
  const byName = categories.find((c) => c.name === raw.trim());
  return byName?.id ?? fallbackCategory;
}

export function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .slice(0, 40);
}

export function parsePrice(raw: unknown): number {
  return parseMoney(raw);
}

export function pick(row: Record<string, unknown>, keys: string[]): unknown {
  const map = new Map(Object.entries(row).map(([k, v]) => [k.toLowerCase().replace(/[:_-]/g, ""), v]));
  for (const k of keys) {
    const hit = map.get(k.toLowerCase().replace(/[:_-]/g, ""));
    if (hit != null && hit !== "") return hit;
  }
  return undefined;
}

export function productFromRow(
  row: Record<string, unknown>,
  i: number,
  fallbackUrl?: string,
): Product {
  const url = String(pick(row, ["url", "link", "permalink", "g:link", "الرابط"]) ?? fallbackUrl ?? "");
  const name = String(pick(row, ["name", "title", "g:title", "الاسم"]) ?? `منتج مستورد ${i + 1}`);
  const brand = String(pick(row, ["brand", "g:brand", "vendor", "الماركة"]) ?? "غير محدد");
  const storeId = String(
    pick(row, ["store", "storeid", "المتجر"]) ?? (url ? storeIdFromUrl(url) : "direct-feed"),
  );
  const price = parsePrice(
    pick(row, ["price", "g:price", "sale_price", "g:sale_price", "السعر", "amount"]),
  );
  const barcode = String(pick(row, ["barcode", "ean", "gtin", "g:gtin", "gtin13"]) ?? "") || undefined;
  const id = String(pick(row, ["id", "g:id"]) ?? `feed-${slug(name)}-${i}`);
  return {
    id,
    name,
    brand,
    category: categoryOf(String(pick(row, ["category", "product_type", "الفئة"]) ?? "")),
    barcode,
    model: String(pick(row, ["model", "sku", "g:mpn", "mpn"]) ?? id),
    capacity: String(pick(row, ["capacity"]) ?? ""),
    highlights: [String(pick(row, ["highlight", "description"]) ?? "وارد من موصّل أسعار")],
    specs: [{ label: "المصدر", value: "موصّل أسعار" }],
    listings: [
      {
        storeId,
        price,
        sku: String(pick(row, ["sku", "g:id", "id"]) ?? id),
        oldPrice: (() => {
          const listed = parsePrice(
            pick(row, ["compareat", "compare_at_price", "oldprice", "regular_price", "listprice"]),
          );
          return listed > price ? listed : undefined;
        })(),
        rating: Number(pick(row, ["rating"]) ?? 4) || 4,
        reviews: Number(pick(row, ["reviews"]) ?? 1) || 1,
        inStock: String(pick(row, ["instock", "availability", "g:availability"]) ?? "true")
          .toLowerCase()
          .includes("out")
          ? false
          : String(pick(row, ["instock"]) ?? "true") !== "false",
        shipping: String(pick(row, ["shipping"]) ?? "حسب المتجر"),
        url: url || "https://example.com",
        affiliateNetwork: "direct",
        coupon: String(pick(row, ["coupon", "voucher"]) ?? "") || undefined,
      },
    ],
    reviewHighlights: [],
  };
}
