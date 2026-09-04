import { parseProductFeed } from "@/lib/parse-feed";

export const dynamic = "force-dynamic";

function blockedHost(hostname: string) {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (h === "127.0.0.1" || h === "0.0.0.0" || h === "::1") return true;
  if (h.startsWith("10.") || h.startsWith("192.168.") || h.startsWith("169.254.")) return true;
  return false;
}

function looksLikeHtml(body: string, contentType: string) {
  if (contentType.includes("text/html")) return true;
  const head = body.slice(0, 400).toLowerCase();
  return head.includes("<!doctype html") || head.includes("<html");
}

export async function POST(req: Request) {
  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  if (!url?.trim()) {
    return Response.json({ error: "حطي رابط الفيد" }, { status: 400 });
  }
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return Response.json({ error: "الرابط مش صالح" }, { status: 400 });
  }
  if (!["http:", "https:"].includes(parsed.protocol) || blockedHost(parsed.hostname)) {
    return Response.json({ error: "رابط الفيد مش مسموح" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(parsed.toString(), {
      signal: AbortSignal.timeout(12000),
      headers: { accept: "application/json,text/csv,text/plain,application/xml" },
    });
  } catch {
    return Response.json({ error: "مقدرناش نوصل للرابط" }, { status: 400 });
  }

  const contentType = res.headers.get("content-type") ?? "";
  const body = await res.text();
  if (!res.ok) {
    return Response.json({ error: `المصدر رجّع ${res.status}` }, { status: 400 });
  }
  if (looksLikeHtml(body, contentType)) {
    return Response.json(
      {
        error:
          "ده صفحة متجر مش فيد. حطي ملف CSV/JSON من لوحة الأفلييت أو من التاجر، مش رابط منتج جوميا/نون.",
      },
      { status: 400 },
    );
  }

  const { products, error } = parseProductFeed(body);
  if (error) return Response.json({ error }, { status: 400 });
  return Response.json({ count: products.length, products });
}
