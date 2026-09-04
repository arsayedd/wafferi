/** Short ASCII search text. Arabic, A++, quotes, and `site:` trip Citrix/Fortinet "URL rejected". */
export function safeShopQuery(productName: string, storeHint = "") {
  const cleaned = productName
    .replace(/A\+{1,}/gi, "A")
    .replace(/\+/g, " ")
    .replace(/[<>"'`\\]/g, " ")
    .replace(/site:/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const latin = cleaned
    .replace(/[^\x20-\x7E]+/g, " ")
    .replace(/[^A-Za-z0-9 ._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const fromName =
    latin ||
    (cleaned.match(/[A-Za-z][A-Za-z0-9.-]*|\d+(?:\.\d+)?/g) ?? []).join(" ");
  const hint = storeHint
    .replace(/[^\x20-\x7E]+/g, " ")
    .replace(/[^A-Za-z0-9 ._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = `${fromName} ${hint}`.split(" ").filter((w) => w.length > 1 || /^\d/.test(w));
  const core = [...new Set(words)].slice(0, 8).join(" ").slice(0, 80);
  return core || "Egypt store";
}

/** Brand, model, and id slug keep Google/Jumia queries useful after Arabic is stripped. */
export function shopQueryFromProduct(p: {
  id?: string;
  brand?: string;
  name: string;
  model?: string;
  capacity?: string;
}) {
  const slug = (p.id ?? "").replace(/-/g, " ");
  return [p.brand, p.model, p.capacity, p.name, slug].filter(Boolean).join(" ");
}

export function googleShopUrl(productName: string, storeHint = "") {
  const q = safeShopQuery(productName, storeHint);
  return `https://www.google.com/search?q=${encodeURIComponent(`${q} Egypt buy`)}`;
}
