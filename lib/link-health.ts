import { isDeadShopUrl } from "./dead-hosts";

function isFakeProductPath(url: string) {
  try {
    const path = new URL(url).pathname;
    return /\/p\/[a-z0-9_-]+$/i.test(path) || /\/catalog\/[a-z0-9_-]+$/i.test(path);
  } catch {
    return false;
  }
}

const BOT_WALL = new Set([401, 403, 429, 503]);

export function isGoogleShopUrl(url: string) {
  try {
    return new URL(url).hostname.includes("google.");
  } catch {
    return /google\./i.test(url);
  }
}

/** Google search, dead DNS, and invented /p/{sku} pages are not shoppable. */
export function isShopableListingUrl(url: string) {
  if (!url) return false;
  if (isGoogleShopUrl(url) || isDeadShopUrl(url) || isFakeProductPath(url)) return false;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export type LinkHealth = { ok: boolean; status: number; host: string };

const mem = new Map<string, LinkHealth>();

export async function probeListingUrl(url: string): Promise<LinkHealth> {
  if (!isShopableListingUrl(url)) {
    return { ok: false, status: 0, host: "" };
  }
  const hit = mem.get(url);
  if (hit) return hit;
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    return { ok: false, status: 0, host: "" };
  }

  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 4500);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: ac.signal,
      headers: { "user-agent": "Mozilla/5.0 (compatible; WaffariLinkCheck/1.0)" },
    });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: ac.signal,
        headers: { "user-agent": "Mozilla/5.0 (compatible; WaffariLinkCheck/1.0)" },
      });
    }
    const status = res.status;
    const ok = (status > 0 && status < 400) || BOT_WALL.has(status);
    const row = { ok, status, host };
    mem.set(url, row);
    return row;
  } catch {
    const row = { ok: false, status: 0, host };
    mem.set(url, row);
    return row;
  } finally {
    clearTimeout(t);
  }
}
