import { networkStats, stores } from "@/lib/network";
import { products } from "@/lib/catalog";

export async function GET() {
  const stats = networkStats();
  return Response.json({
    stats,
    stores: stores.map((s) => ({
      ...s,
      liveProducts: products.filter((p) => p.listings.some((l) => l.storeId === s.id)).length,
    })),
  });
}
