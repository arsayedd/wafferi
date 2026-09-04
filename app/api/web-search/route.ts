import { searchTheWeb } from "@/lib/web-search";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (!q.trim()) {
    return Response.json({
      q: "",
      hits: [],
      provider: "open-web",
      note: "اكتبي كلمة بحث.",
    });
  }
  try {
    const data = await searchTheWeb(q);
    return Response.json(data);
  } catch {
    return Response.json(
      {
        q,
        hits: [],
        provider: "open-web",
        note: "البحث على الويب اتأخر. جرّبي تاني.",
      },
      { status: 200 },
    );
  }
}
