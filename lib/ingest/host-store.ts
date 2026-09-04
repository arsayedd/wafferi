import { stores } from "../catalog";

const extra: Record<string, string> = {
  "jumia.com.eg": "jumia",
  "jumia.eg": "jumia",
  "noon.com": "noon",
  "amazon.eg": "amazon",
  "btech.com": "btech",
  "2b.com.eg": "twob",
  "carrefouregypt.com": "carrefour",
  "tradeline.com.eg": "tradeline",
  "tradelinestores.com": "tradeline",
  "ikea.com": "ikea",
  "homzmart.com": "homzmart",
  "namshi.com": "namshi",
  "raneen.com": "raneen",
  "rayashop.com": "raya",
};

export function storeIdFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    if (extra[host]) return extra[host];
    for (const [k, id] of Object.entries(extra)) {
      if (host.endsWith(k)) return id;
    }
    const hit = stores.find((s) => {
      try {
        return new URL(s.website).hostname.replace(/^www\./, "").toLowerCase() === host;
      } catch {
        return false;
      }
    });
    return hit?.id ?? "direct-feed";
  } catch {
    return "direct-feed";
  }
}
