import { inspectUrl } from "@/lib/intel/inspect";
import type { HostRecipe } from "@/lib/ingest/recipes";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { url?: string; recipes?: HostRecipe[] };
  if (!body.url?.trim()) return Response.json({ error: "حطي رابط المنتج أو السايتماب" }, { status: 400 });
  try {
    const result = await inspectUrl(body.url.trim(), body.recipes ?? []);
    return Response.json(result);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
