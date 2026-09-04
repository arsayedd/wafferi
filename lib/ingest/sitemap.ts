/** Product-like URLs from a public sitemap — capped, never a full catalog crawl. */

export function isSitemapXml(body: string) {
  return /<(urlset|sitemapindex)\b/i.test(body);
}

export function locUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1].trim());
}

export function productishUrls(urls: string[], cap = 24): string[] {
  const product = urls.filter((u) =>
    /\/(product|products|p|item|dp|catalog\/product)s?\b/i.test(u),
  );
  const pool = product.length ? product : urls.filter((u) => /^https?:\/\//i.test(u));
  return [...new Set(pool)].slice(0, cap);
}
