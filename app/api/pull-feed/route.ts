import { ingestFromUrl } from "@/lib/ingest/ingest-url";
import type { HostRecipe } from "@/lib/ingest/recipes";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    url?: string;
    recipes?: HostRecipe[];
  };
  if (!body.url?.trim()) {
    return Response.json({ error: "حطي رابط الفيد أو المنتج" }, { status: 400 });
  }
  try {
    const result = await ingestFromUrl(body.url.trim(), body.recipes ?? []);
    if (result.error) {
      return Response.json(
        {
          error: result.error,
          connector: result.connector,
          count: 0,
          products: [],
          candidates: result.candidates ?? [],
        },
        { status: 400 },
      );
    }
    return Response.json({
      count: result.products.length,
      products: result.products,
      connector: result.connector,
      candidates: result.candidates ?? [],
      needsReview: Boolean(result.needsReview),
      discovery: result.discovery ?? [],
    });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
