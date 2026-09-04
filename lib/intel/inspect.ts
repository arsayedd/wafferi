import { ingestFromUrl } from "../ingest/ingest-url";
import type { HostRecipe } from "../ingest/recipes";
import { fetchPublic } from "../ingest/ssrf";
import { fingerprintStore } from "./store-detect";
import { discoverStore } from "./discover";
import { robotsAllows } from "./robots";
import { snapshotsFromEmbeddedJson } from "./embedded";
import { adapterFromConnector, snapshotFromProduct } from "./from-product";
import type { CompetitiveSnapshot } from "./types";

export type InspectResult = {
  snapshots: CompetitiveSnapshot[];
  waterfall: string[];
  adapter: string;
  discovery?: string[];
  error?: string;
  platform?: string;
  robotsNote?: string;
};

/** HTTP/API أولاً. اكتشاف محدود للصفحة الرئيسية. Playwright مش في المسار. */
export async function inspectUrl(url: string, recipes: HostRecipe[] = []): Promise<InspectResult> {
  const waterfall: string[] = ["http"];
  const page = new URL(url);
  const robots = await robotsAllows(page);
  waterfall.push("robots");
  if (!robots.allowed) {
    return {
      snapshots: [],
      waterfall,
      adapter: "unknown",
      error: robots.note,
      robotsNote: robots.note,
    };
  }

  const home = page.pathname === "/" || page.pathname === "";
  if (home) {
    waterfall.push("discovery");
    const d = await discoverStore(url);
    waterfall.push(d.platform);
    const feedTry =
      d.platform === "shopify"
        ? `${page.origin}/products.json?limit=50`
        : d.platform === "woocommerce"
          ? `${page.origin}/wp-json/wc/store/v1/products?per_page=20`
          : "";
    if (feedTry) {
      const feed = await ingestFromUrl(feedTry, recipes);
      waterfall.push(feed.connector);
      if (feed.products.length) {
        return {
          snapshots: feed.products.slice(0, 40).map((p) =>
            snapshotFromProduct(p, adapterFromConnector(feed.connector)),
          ),
          waterfall,
          adapter: adapterFromConnector(feed.connector),
          discovery: d.discovery,
          platform: d.platform,
          robotsNote: robots.note,
        };
      }
    }
    if (d.discovery.length) {
      return {
        snapshots: [],
        waterfall,
        adapter: "api-feed",
        discovery: d.discovery,
        platform: d.platform,
        robotsNote: robots.note,
        error: d.notes.join(" · "),
      };
    }
  }

  const ingested = await ingestFromUrl(url, recipes);
  waterfall.push(ingested.connector);

  if (ingested.discovery?.length && !ingested.products.length) {
    return {
      snapshots: [],
      waterfall,
      adapter: "api-feed",
      discovery: ingested.discovery,
      robotsNote: robots.note,
    };
  }

  if (ingested.products.length) {
    const adapter = adapterFromConnector(ingested.connector);
    return {
      snapshots: ingested.products.slice(0, 40).map((p) => snapshotFromProduct(p, adapter)),
      waterfall,
      adapter,
      robotsNote: robots.note,
    };
  }

  try {
    const { body, url: parsed } = await fetchPublic(url, "text/html,application/json");
    const fp = fingerprintStore(body, parsed);
    waterfall.push(fp.platform);
    const embedded = snapshotsFromEmbeddedJson(body, parsed.toString());
    if (embedded.length) {
      waterfall.push("next-embedded");
      return { snapshots: embedded, waterfall, adapter: "next-embedded", platform: fp.platform, robotsNote: robots.note };
    }
  } catch {
    /* already failed ingest */
  }

  return {
    snapshots: [],
    waterfall,
    adapter: ingested.connector,
    robotsNote: robots.note,
    error: ingested.error ?? "مفيش سعر منظم. المتصفح آخر حل ومش شغال هنا كزحف أو تجاوز حماية.",
  };
}
