import { inspectUrl, type InspectResult } from "@/lib/intel/inspect";
import type { HostRecipe } from "@/lib/ingest/recipes";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    url?: string;
    urls?: string[];
    recipes?: HostRecipe[];
  };
  const urls = [...(body.urls ?? []), body.url ?? ""]
    .map((u) => u.trim())
    .filter(Boolean)
    .slice(0, 8);
  if (!urls.length) return Response.json({ error: "حطي رابط المنتج أو السايتماب" }, { status: 400 });
  try {
    const results: InspectResult[] = [];
    for (const url of urls) {
      results.push(await inspectUrl(url, body.recipes ?? []));
    }
    return Response.json(urls.length === 1 ? results[0] : { results });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
