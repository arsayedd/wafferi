import { parseMoney } from "./money";

/** CSS بسيط: class / id / meta / itemprop — من غير محرك DOM كامل. */
export function extractCss(html: string, spec: string): string {
  const [selRaw, attr] = spec.split("|").map((s) => s.trim());
  const sel = selRaw ?? "";
  const meta = sel.match(/^meta\[([^=\]]+)=["']([^"']+)["']\]$/i);
  if (meta) {
    const re = new RegExp(
      `<meta[^>]+${meta[1]}=["']${escapeRe(meta[2])}["'][^>]*content=["']([^"']+)["']`,
      "i",
    );
    const re2 = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]*${meta[1]}=["']${escapeRe(meta[2])}["']`,
      "i",
    );
    return decode(html.match(re)?.[1] ?? html.match(re2)?.[1] ?? "");
  }
  const item = sel.match(/^\[itemprop=["']([^"']+)["']\]$/i);
  if (item) {
    const re = new RegExp(
      `itemprop=["']${escapeRe(item[1])}["'][^>]*(?:content=["']([^"']+)["'][^>]*)?>([^<]*)`,
      "i",
    );
    const m = html.match(re);
    return decode(attr === "content" ? m?.[1] ?? m?.[2] ?? "" : m?.[2] || m?.[1] || "");
  }
  const cls = sel.match(/^\.([\w-]+)$/);
  if (cls) {
    const re = new RegExp(`class=["'][^"']*\\b${escapeRe(cls[1])}\\b[^"']*["'][^>]*>([^<]+)`, "i");
    return decode(html.match(re)?.[1] ?? "");
  }
  const id = sel.match(/^#([\w-]+)$/);
  if (id) {
    const re = new RegExp(`id=["']${escapeRe(id[1])}["'][^>]*>([^<]+)`, "i");
    return decode(html.match(re)?.[1] ?? "");
  }
  const data = sel.match(/^\[([a-z0-9:-]+)\]$/i);
  if (data) {
    const re = new RegExp(`${escapeRe(data[1])}=["']([^"']+)["']`, "i");
    return decode(html.match(re)?.[1] ?? "");
  }
  const clsHas = sel.match(/^\[class\*=["']([^"']+)["']\]$/i);
  if (clsHas) {
    const re = new RegExp(
      `class=["'][^"']*${escapeRe(clsHas[1])}[^"']*["'][^>]*(?:content=["']([^"']+)["'])?[^>]*>([^<]*)`,
      "i",
    );
    const m = html.match(re);
    return decode(m?.[1] || m?.[2] || "");
  }
  return "";
}

/** لو السيلكتور اتكسر (فكرة Scrapling adaptive) ندور على علامات سعر معلنة قريبة. */
export const adaptivePriceSpecs = [
  'meta[property="product:price:amount"]|content',
  'meta[property="og:price:amount"]|content',
  '[itemprop="price"]|content',
  "[data-price]",
  "[data-product-price]",
  ".product-price",
  ".current-price",
  '[class*="price"]',
];

export function extractCssOrAdaptive(html: string, spec?: string): { text: string; used: string; adaptive: boolean } {
  if (spec) {
    const direct = extractCss(html, spec);
    if (direct) return { text: direct, used: spec, adaptive: false };
    const loosened = loosenClassSelector(spec);
    if (loosened) {
      const again = extractCss(html, loosened);
      if (again) return { text: again, used: loosened, adaptive: true };
    }
  }
  for (const fallback of adaptivePriceSpecs) {
    if (fallback === spec) continue;
    const text = extractCss(html, fallback);
    if (text) return { text, used: fallback, adaptive: true };
  }
  return { text: "", used: spec ?? "", adaptive: false };
}

function loosenClassSelector(spec: string): string | null {
  const cls = spec.match(/^\.([\w-]+)$/);
  if (!cls) return null;
  const stem = cls[1].replace(/--.+$/, "").replace(/-v?\d+$/, "");
  if (stem.length < 4) return null;
  return `[class*="${stem}"]`;
}

export function extractRegex(html: string, pattern: string): string {
  try {
    const re = new RegExp(pattern, "i");
    const m = html.match(re);
    return decode(m?.[1] ?? m?.[0] ?? "");
  } catch {
    return "";
  }
}

export function extractJsonPath(jsonText: string, path: string): string {
  try {
    let cur: unknown = JSON.parse(jsonText);
    for (const part of path.split(".").filter(Boolean)) {
      if (cur == null || typeof cur !== "object") return "";
      cur = (cur as Record<string, unknown>)[part];
    }
    if (cur == null) return "";
    return String(cur);
  } catch {
    return "";
  }
}

export function jsonPathPrice(jsonText: string, path: string): number {
  return parseMoney(extractJsonPath(jsonText, path));
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decode(s: string) {
  return s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
}
