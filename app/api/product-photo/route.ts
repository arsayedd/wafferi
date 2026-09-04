import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { commonsPhotoQuery, photoOffset } from "@/lib/photo-query";
import { productImage } from "@/lib/product-images";
import type { CategoryId } from "@/lib/types";

const UA = "WaffariCatalog/1.0 (product thumbnails; educational bridal planner)";
const cache = new Map<string, string>();
const photosDir = () => path.join(process.cwd(), "public", "product-photos");

function localProductFile(id: string) {
  const file = path.join(photosDir(), `${id}.jpg`);
  return existsSync(file) ? `/product-photos/${id}.jpg` : "";
}

const poolCache = new Map<string, string[]>();

function poolFile(id: string, category: string) {
  if (!poolCache.size) {
    const dir = path.join(photosDir(), "pool");
    if (!existsSync(dir)) return "";
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".jpg")) continue;
      const key = name.replace(/-\d+\.jpg$/, "");
      const list = poolCache.get(key) ?? [];
      list.push(name);
      poolCache.set(key, list);
    }
    for (const list of poolCache.values()) list.sort();
  }
  const list = poolCache.get(category);
  if (!list?.length) return "";
  const name = list[photoOffset(id) % list.length];
  return `/product-photos/pool/${name}`;
}

async function commonsThumb(query: string, offset: number) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("generator", "search");
  api.searchParams.set("gsrsearch", query);
  api.searchParams.set("gsrnamespace", "6");
  api.searchParams.set("gsrlimit", "8");
  api.searchParams.set("gsroffset", String(offset));
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url|mime");
  api.searchParams.set("iiurlwidth", "900");
  api.searchParams.set("format", "json");
  const res = await fetch(api, { headers: { "user-agent": UA }, next: { revalidate: 86400 } });
  if (!res.ok) return "";
  const data = (await res.json()) as {
    query?: { pages?: Record<string, { title?: string; imageinfo?: { thumburl?: string; url?: string; mime?: string }[] }> };
  };
  const skip = /logo|icon|flag|diagram|svg|headquarters|remote control/i;
  for (const page of Object.values(data.query?.pages ?? {})) {
    if (page.title && skip.test(page.title)) continue;
    const info = page.imageinfo?.[0];
    const mime = info?.mime ?? "";
    if (!mime.startsWith("image/") || mime.includes("svg") || mime.includes("gif")) continue;
    const url = info?.thumburl || info?.url || "";
    if (url.startsWith("https://")) return url;
  }
  return "";
}

function publicUrl(req: Request, pathname: string) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host && !host.startsWith("0.0.0.0")) {
    const proto = req.headers.get("x-forwarded-proto") || "http";
    return `${proto}://${host}${pathname}`;
  }
  return `http://127.0.0.1:43147${pathname}`;
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("id") ?? "";
  const brand = u.searchParams.get("brand") ?? "";
  const name = u.searchParams.get("name") ?? "";
  const model = u.searchParams.get("model") ?? "";
  const category = (u.searchParams.get("category") ?? "small-appliances") as CategoryId;
  const fallback = productImage(id || "x", category, name);

  const local = id ? localProductFile(id) : "";
  if (local) return NextResponse.redirect(publicUrl(req, local), 302);

  const pooled = id ? poolFile(id, category) : "";
  if (pooled) return NextResponse.redirect(publicUrl(req, pooled), 302);

  const key = `${id}|${brand}|${model}|${category}`;
  const cached = cache.get(key);
  if (cached) return NextResponse.redirect(cached, 302);

  const q = commonsPhotoQuery({ brand, name, model, category });
  try {
    const thumb = q ? await commonsThumb(q, photoOffset(id || q)) : "";
    if (thumb) {
      cache.set(key, thumb);
      return NextResponse.redirect(thumb, 302);
    }
  } catch {
    /* fall through */
  }
  return NextResponse.redirect(publicUrl(req, fallback), 302);
}
