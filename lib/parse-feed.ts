import type { CategoryId, Product } from "./types";
import { categories } from "./catalog";

const fallbackCategory: CategoryId = "accessories";

function categoryOf(raw: string | undefined): CategoryId {
  if (!raw) return fallbackCategory;
  const id = raw.trim() as CategoryId;
  if (categories.some((c) => c.id === id)) return id;
  const byName = categories.find((c) => c.name === raw.trim());
  return byName?.id ?? fallbackCategory;
}

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .slice(0, 40);
}

export function parseProductFeed(raw: string): { products: Product[]; error?: string } {
  const text = raw.trim();
  if (!text) return { products: [], error: "الملف فاضي" };

  try {
    if (text.startsWith("[") || text.startsWith("{")) {
      const data = JSON.parse(text) as unknown;
      const arr = Array.isArray(data) ? data : [data];
      return { products: arr.map((row, i) => fromRow(row as Record<string, unknown>, i)) };
    }
  } catch (e) {
    return { products: [], error: `JSON غلط: ${(e as Error).message}` };
  }

  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { products: [], error: "CSV محتاج صف عناوين وصف بيانات" };
  const header = splitCsv(lines[0]).map((h) => h.trim().toLowerCase());
  const products: Product[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsv(lines[i]);
    const row: Record<string, unknown> = {};
    header.forEach((h, idx) => {
      row[h] = cols[idx];
    });
    products.push(fromRow(row, i));
  }
  return { products };
}

function splitCsv(line: string) {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (const ch of line) {
    if (ch === '"') {
      q = !q;
      continue;
    }
    if (ch === "," && !q) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function fromRow(row: Record<string, unknown>, i: number): Product {
  const name = String(row.name ?? row.title ?? row["الاسم"] ?? `منتج مستورد ${i + 1}`);
  const brand = String(row.brand ?? row["الماركة"] ?? "غير محدد");
  const storeId = String(row.store ?? row.storeid ?? row["المتجر"] ?? "direct-feed");
  const price = Number(row.price ?? row["السعر"] ?? 0) || 0;
  const barcode = String(row.barcode ?? row.ean ?? row.gtin ?? "") || undefined;
  const id = String(row.id ?? `feed-${slug(name)}-${i}`);
  return {
    id,
    name,
    brand,
    category: categoryOf(String(row.category ?? row["الفئة"] ?? "")),
    barcode,
    model: String(row.model ?? row.sku ?? id),
    capacity: String(row.capacity ?? ""),
    highlights: [String(row.highlight ?? "وارد من فيد تاجر مصرّح")],
    specs: [{ label: "المصدر", value: "فيد مستورد" }],
    listings: [
      {
        storeId,
        price,
        sku: String(row.sku ?? id),
        rating: Number(row.rating ?? 4),
        reviews: Number(row.reviews ?? 1),
        inStock: String(row.instock ?? "true") !== "false",
        shipping: String(row.shipping ?? "حسب المتجر"),
        url: String(row.url ?? row.link ?? row["الرابط"] ?? "https://example.com"),
        affiliateNetwork: "direct",
        coupon: String(row.coupon ?? row.voucher ?? "") || undefined,
      },
    ],
    reviewHighlights: [],
  };
}

export const sampleFeedCsv = `name,brand,price,store,category,rating,url,coupon
فستان سهرة وردي,محلي,3200,namshi,bridal-wear,4.4,https://www.namshi.com,BRIDE10
بيجاما رجالي قطن,كوتونيل,540,cottonil,pajamas,4.5,https://cottonil.com,
طقم فوط مطبخ,ايكيا,180,ikea,accessories,4.6,https://www.ikea.com/eg/ar,HOME5
`;
