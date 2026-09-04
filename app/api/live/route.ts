import { recentMoves, tickBucket } from "@/lib/live-quotes";
import { networkStats } from "@/lib/network";
import { products } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  return Response.json({
    at: now,
    bucket: tickBucket(now),
    network: networkStats(),
    watchedProducts: products.length,
    moves: recentMoves(now, 30),
  });
}
