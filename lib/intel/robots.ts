import { fetchPublic } from "../ingest/ssrf";

const cache = new Map<string, { at: number; body: string }>();

function matchPath(rule: string, path: string) {
  const r = rule.trim();
  if (!r) return false;
  if (r === "/") return path === "/" || path === "";
  return path.startsWith(r.endsWith("/") ? r : r);
}

export async function robotsAllows(target: URL): Promise<{ allowed: boolean; note: string }> {
  const robotsUrl = `${target.origin}/robots.txt`;
  let body = "";
  const cached = cache.get(target.origin);
  if (cached && Date.now() - cached.at < 30 * 60_000) body = cached.body;
  else {
    try {
      const got = await fetchPublic(robotsUrl, "text/plain");
      body = got.res.ok ? got.body : "";
      cache.set(target.origin, { at: Date.now(), body });
    } catch {
      return { allowed: true, note: "robots.txt مش متاح — مكملين بحذر" };
    }
  }
  if (!body.trim()) return { allowed: true, note: "robots فاضي" };

  const lines = body.split(/\r?\n/).map((l) => l.trim());
  let ua = "";
  const ours: { allow: string[]; disallow: string[] } = { allow: [], disallow: [] };
  const star: { allow: string[]; disallow: string[] } = { allow: [], disallow: [] };
  for (const line of lines) {
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(user-agent|allow|disallow)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === "user-agent") {
      ua = val.toLowerCase();
      continue;
    }
    const bucket = ua.includes("waffaripricebot") ? ours : ua === "*" ? star : null;
    if (!bucket) continue;
    if (key === "allow") bucket.allow.push(val);
    if (key === "disallow") bucket.disallow.push(val);
  }
  const rules = ours.disallow.length || ours.allow.length ? ours : star;
  const path = target.pathname || "/";
  const denied = rules.disallow.some((d) => d && matchPath(d, path));
  const allowed = rules.allow.some((a) => a && matchPath(a, path));
  if (denied && !allowed) {
    return { allowed: false, note: `robots.txt مانع المسار ${path}` };
  }
  return { allowed: true, note: "robots.txt سامح المسار" };
}
