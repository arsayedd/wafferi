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
  return "";
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
