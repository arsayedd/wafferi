import { ingestFromUrl } from "@/lib/ingest/ingest-url";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  if (!url?.trim()) {
    return Response.json({ error: "حطي رابط الفيد أو المنتج" }, { status: 400 });
  }
  try {
    const result = await ingestFromUrl(url.trim());
    if (result.error) {
      return Response.json(
        { error: result.error, connector: result.connector, count: 0, products: [] },
        { status: 400 },
      );
    }
    return Response.json({
      count: result.products.length,
      products: result.products,
      connector: result.connector,
    });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
