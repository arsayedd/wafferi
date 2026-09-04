import { amazonGetItems, amazonAsinFromUrl } from "@/lib/ingest/amazon-creators";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { asins?: string[]; url?: string };
  const asins = [
    ...(body.asins ?? []),
    ...(body.url ? [amazonAsinFromUrl(body.url) ?? ""] : []),
  ]
    .map((s) => s.trim().toUpperCase())
    .filter((s) => /^[A-Z0-9]{10}$/.test(s));
  if (!asins.length) {
    return Response.json({ error: "حطي ASIN أو رابط amazon.eg/dp/…" }, { status: 400 });
  }
  const result = await amazonGetItems(asins);
  if (result.error && !result.products.length) {
    return Response.json({ error: result.error, products: [], count: 0 }, { status: 400 });
  }
  return Response.json({ count: result.products.length, products: result.products, connector: "amazon-creators" });
}
