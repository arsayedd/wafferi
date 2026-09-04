import type { Product } from "./types";
import { productFromRow } from "./ingest/product-from-row";

export function parseProductFeed(raw: string): { products: Product[]; error?: string } {
  const text = raw.trim();
  if (!text) return { products: [], error: "الملف فاضي" };

  try {
    if (text.startsWith("[") || text.startsWith("{")) {
      const data = JSON.parse(text) as unknown;
      const arr = Array.isArray(data)
        ? data
        : Array.isArray((data as { products?: unknown[] }).products)
          ? (data as { products: unknown[] }).products
          : Array.isArray((data as { items?: unknown[] }).items)
            ? (data as { items: unknown[] }).items
            : [data];
      return {
        products: arr.map((row, i) => productFromRow(row as Record<string, unknown>, i)),
      };
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
    products.push(productFromRow(row, i));
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

export const sampleFeedCsv = `name,brand,price,store,category,rating,url,coupon,gtin
فستان سهرة وردي,محلي,3200,namshi,bridal-wear,4.4,https://www.namshi.com,BRIDE10,
بيجاما رجالي قطن,كوتونيل,540,cottonil,pajamas,4.5,https://cottonil.com,,
طقم فوط مطبخ,ايكيا,180,ikea,accessories,4.6,https://www.ikea.com/eg/ar,HOME5,
`;
