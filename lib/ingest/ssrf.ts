export function blockedHost(hostname: string) {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (h === "127.0.0.1" || h === "0.0.0.0" || h === "::1") return true;
  if (h.startsWith("10.") || h.startsWith("192.168.") || h.startsWith("169.254.")) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
  return false;
}

export function assertPublicHttpUrl(raw: string): URL {
  const parsed = new URL(raw.trim());
  if (!["http:", "https:"].includes(parsed.protocol) || blockedHost(parsed.hostname)) {
    throw new Error("الرابط مش مسموح");
  }
  return parsed;
}

export async function fetchPublic(url: string, accept: string) {
  const parsed = assertPublicHttpUrl(url);
  const res = await fetch(parsed.toString(), {
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
    headers: {
      accept,
      "user-agent": "WaffariPriceBot/1.0 (structured product data; comparison)",
    },
  });
  const contentType = res.headers.get("content-type") ?? "";
  const buf = await res.arrayBuffer();
  if (buf.byteLength > 2_000_000) throw new Error("الملف أكبر من المسموح");
  const body = new TextDecoder("utf-8", { fatal: false }).decode(buf);
  return { res, contentType, body, url: parsed };
}
