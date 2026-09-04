import { ingestFromUrl } from "../ingest/ingest-url";
import type { HostRecipe } from "../ingest/recipes";
import { fetchPublic } from "../ingest/ssrf";
import { detectAdapter } from "./adapters";
import { snapshotsFromEmbeddedJson } from "./embedded";
import { adapterFromConnector, snapshotFromProduct } from "./from-product";
import type { CompetitiveSnapshot } from "./types";

export type InspectResult = {
  snapshots: CompetitiveSnapshot[];
  waterfall: string[];
  adapter: string;
  discovery?: string[];
  error?: string;
};

/** HTTP → فيد/API → Shopify/Woo → JSON مضمّن → JSON-LD/OG/CSS. Playwright مش في المسار. */
export async function inspectUrl(url: string, recipes: HostRecipe[] = []): Promise<InspectResult> {
  const waterfall: string[] = ["http"];
  const ingested = await ingestFromUrl(url, recipes);
  waterfall.push(ingested.connector);

  if (ingested.discovery?.length && !ingested.products.length) {
    return {
      snapshots: [],
      waterfall,
      adapter: "api-feed",
      discovery: ingested.discovery,
    };
  }

  if (ingested.products.length) {
    const adapter = adapterFromConnector(ingested.connector);
    return {
      snapshots: ingested.products.slice(0, 40).map((p) => snapshotFromProduct(p, adapter)),
      waterfall,
      adapter,
    };
  }

  try {
    const { body, url: parsed } = await fetchPublic(url, "text/html,application/json");
    waterfall.push(detectAdapter(body, parsed));
    const embedded = snapshotsFromEmbeddedJson(body, parsed.toString());
    if (embedded.length) {
      waterfall.push("next-embedded");
      return { snapshots: embedded, waterfall, adapter: "next-embedded" };
    }
  } catch {
    /* already failed ingest */
  }

  return {
    snapshots: [],
    waterfall,
    adapter: ingested.connector,
    error: ingested.error ?? "مفيش سعر واقعي من الشلال. Playwright آخر حل ومش شغال هنا كزحف.",
  };
}
