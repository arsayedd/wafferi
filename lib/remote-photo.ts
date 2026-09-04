import { commonsPhotoQuery, photoOffset } from "./photo-query";
import { productImage, productImageFallback } from "./product-images";
import type { CategoryId } from "./types";

const UA = "Waffari/1.0 (bridal marketplace; CC product reference thumbs)";
const mem = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

function skipTitle(title: string) {
  return /logo|icon|svg|pdf|flag|coat of arms|\.svg|\.pdf|\.gif|\.webm|\.djvu/i.test(title);
}

async function getJson(url: string) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 4000);
  try {
    const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" }, signal: ac.signal });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text.startsWith("{") && !text.startsWith("[")) return null;
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function commonsThumbs(q: string) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("generator", "search");
  api.searchParams.set("gsrsearch", q);
  api.searchParams.set("gsrnamespace", "6");
  api.searchParams.set("gsrlimit", "20");
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url");
  api.searchParams.set("iiurlwidth", "640");
  api.searchParams.set("format", "json");
  const data = (await getJson(api.toString())) as {
    query?: {
      pages?: Record<
        string,
        { title?: string; index?: number; imageinfo?: { thumburl?: string; url?: string }[] }
      >;
    };
  } | null;
  const pages = Object.values(data?.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  const urls: string[] = [];
  for (const p of pages) {
    if (skipTitle(p.title ?? "")) continue;
    const u = p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url;
    if (u && /\.(jpe?g|png|webp)(\?|$)/i.test(u)) urls.push(u);
  }
  return urls;
}

async function openverseThumbs(q: string) {
  const api = new URL("https://api.openverse.org/v1/images/");
  api.searchParams.set("q", q);
  api.searchParams.set("page_size", "20");
  api.searchParams.set("license_type", "commercial");
  const data = (await getJson(api.toString())) as { results?: { url?: string; title?: string }[] } | null;
  return (data?.results ?? [])
    .filter((r) => r.url && !skipTitle(r.title ?? "") && /\.(jpe?g|png|webp)(\?|$)/i.test(r.url!))
    .map((r) => r.url!);
}

export function photoCacheKey(input: { id: string; brand: string; name: string; model?: string; category: CategoryId }) {
  const q = commonsPhotoQuery(input);
  return `${q}::${photoOffset(input.id)}`;
}

export async function resolveRemotePhoto(input: {
  id: string;
  brand: string;
  name: string;
  model?: string;
  category: CategoryId;
}) {
  const key = photoCacheKey(input);
  const hit = mem.get(key);
  if (hit) return hit;
  const pending = inflight.get(key);
  if (pending) return pending;

  const job = (async () => {
    const q = commonsPhotoQuery(input);
    const offset = photoOffset(input.id);
    let urls = await commonsThumbs(q);
    if (urls.length < 4) {
      const extra = await openverseThumbs(q);
      urls = [...urls, ...extra];
    }
    if (urls.length < 3) {
      const extra = await commonsThumbs(q.replace(/^[A-Za-z0-9.+-]+\s+/, ""));
      urls = [...urls, ...extra];
    }
    const unique = [...new Set(urls)];
    const picked = unique.length ? unique[offset % unique.length]! : "";
    if (picked) {
      mem.set(key, picked);
      return picked;
    }
    const local = productImage(input.id, input.category, input.name) || productImageFallback(input.id, input.category, input.name);
    if (local) mem.set(key, local);
    return local;
  })();

  inflight.set(key, job);
  try {
    return await job;
  } finally {
    inflight.delete(key);
  }
}
