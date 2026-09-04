import { fetchPublic } from "../ingest/ssrf";
import { locUrls, productishUrls, isSitemapXml } from "../ingest/sitemap";
import { fingerprintStore } from "./store-detect";
import { robotsAllows } from "./robots";

const FEED_HINTS = [
  "/products.json?limit=50",
  "/wp-json/wc/store/v1/products?per_page=20",
  "/sitemap.xml",
];

export async function discoverStore(storeUrl: string): Promise<{
  platform: string;
  confidence: number;
  discovery: string[];
  notes: string[];
}> {
  const page = new URL(storeUrl);
  const notes: string[] = [];
  const { res, body } = await fetchPublic(page.toString(), "text/html,application/xml");
  if (!res.ok) return { platform: "unknown", confidence: 0, discovery: [], notes: [`HTTP ${res.status}`] };

  const fp = fingerprintStore(body, page);
  notes.push(`منصة ${fp.platform} (ثقة ${(fp.confidence * 100).toFixed(0)}٪)`);

  const found: string[] = [];
  if (isSitemapXml(body)) found.push(...productishUrls(locUrls(body)));

  for (const probe of [...fp.probeUrls, ...FEED_HINTS.map((p) => page.origin + p)]) {
    if (probe.endsWith("/robots.txt")) {
      try {
        const robots = await fetchPublic(probe, "text/plain");
        for (const m of robots.body.matchAll(/^sitemap:\s*(\S+)/gim)) found.push(m[1]);
      } catch {
        /* skip */
      }
      continue;
    }
    if (probe.includes("graphql")) continue;
    const allow = await robotsAllows(new URL(probe));
    if (!allow.allowed) {
      notes.push(allow.note);
      continue;
    }
    if (probe.includes("sitemap.xml")) {
      try {
        const sm = await fetchPublic(probe, "application/xml,text/xml");
        if (isSitemapXml(sm.body)) found.push(...productishUrls(locUrls(sm.body)));
      } catch {
        /* skip */
      }
    }
  }

  const discovery = [...new Set(found.filter((u) => u.startsWith("http")))].slice(0, 24);
  notes.push(`اكتشاف محدود: ${discovery.length} رابط — مش آلاف صفحات ولا infinite scroll.`);
  return { platform: fp.platform, confidence: fp.confidence, discovery, notes };
}
