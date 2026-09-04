import type { Product } from "../types";
import { getStore } from "../catalog";
import { storeIdFromUrl } from "../ingest/host-store";
import type { AdapterKind, CompetitiveSnapshot } from "./types";

export function snapshotFromProduct(
  p: Product,
  adapter: AdapterKind,
  checkedAt = Date.now(),
): CompetitiveSnapshot {
  const listing = [...p.listings].sort((a, b) => a.price - b.price)[0];
  const seller = listing ? getStore(listing.storeId)?.name ?? listing.storeId : storeIdFromUrl(p.listings[0]?.url ?? "");
  const compareAt = listing?.oldPrice && listing.oldPrice > listing.price ? listing.oldPrice : undefined;
  return {
    url: listing?.url ?? "",
    seller,
    adapter,
    name: p.name,
    brand: p.brand !== "غير محدد" ? p.brand : undefined,
    sku: listing?.sku,
    gtin: p.barcode,
    price: listing?.price ?? 0,
    compareAt,
    currency: "EGP",
    availability: listing?.inStock === false ? "out_of_stock" : listing ? "in_stock" : "unknown",
    rating: listing?.rating,
    reviewCount: listing?.reviews,
    category: p.category,
    checkedAt,
  };
}

export function adapterFromConnector(connector: string): AdapterKind {
  if (connector.includes("magento")) return "magento";
  if (connector.includes("shopify")) return "shopify";
  if (connector.includes("woo")) return "woocommerce";
  if (connector === "json-ld") return "json-ld";
  if (connector === "open-graph") return "open-graph";
  if (connector.includes("json") || connector.includes("csv") || connector.includes("xml")) return "api-feed";
  if (connector.includes("css")) return "css";
  if (connector.includes("next")) return "next-embedded";
  return "unknown";
}
