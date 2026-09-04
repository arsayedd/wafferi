export type WebHit = {
  id: string;
  title: string;
  url: string;
  snippet: string;
  image?: string;
  source: string;
  host: string;
  kind: "web" | "knowledge" | "place";
};

export type WebSearchResponse = {
  q: string;
  hits: WebHit[];
  provider: "google" | "open-web";
  note: string;
};

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function hit(
  partial: Omit<WebHit, "id" | "host"> & { id?: string },
): WebHit {
  const host = hostOf(partial.url);
  return {
    id: partial.id ?? partial.url,
    title: partial.title,
    url: partial.url,
    snippet: partial.snippet,
    image: partial.image,
    source: partial.source,
    kind: partial.kind,
    host,
  };
}

async function getJson(url: string, init: RequestInit = {}, ms = 8000) {
  const ctrl = AbortSignal.timeout(ms);
  const res = await fetch(url, {
    ...init,
    signal: ctrl,
    headers: {
      accept: "application/json",
      ...(init.headers ?? {}),
    },
    next: { revalidate: 120 },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

type GoogleItem = {
  title?: string;
  link?: string;
  snippet?: string;
  pagemap?: {
    cse_image?: { src?: string }[];
    metatags?: Record<string, string>[];
  };
};

async function googleSearch(q: string): Promise<WebHit[] | null> {
  const key = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CSE_ID || process.env.GOOGLE_CSE_CX;
  if (!key || !cx) return null;
  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.set("key", key);
  url.searchParams.set("cx", cx);
  url.searchParams.set("q", q);
  url.searchParams.set("gl", "eg");
  url.searchParams.set("hl", "ar");
  url.searchParams.set("num", "10");
  const data = (await getJson(url.toString())) as { items?: GoogleItem[] };
  return (data.items ?? [])
    .filter((i) => i.link && i.title)
    .map((i) =>
      hit({
        title: i.title!,
        url: i.link!,
        snippet: i.snippet ?? "",
        image: i.pagemap?.cse_image?.[0]?.src,
        source: "جوجل",
        kind: "web",
      }),
    );
}

type WikiPage = {
  title?: string;
  extract?: string;
  fullurl?: string;
  thumbnail?: { source?: string };
};

async function wikipediaSearch(q: string, lang: "ar" | "en"): Promise<WebHit[]> {
  const url = new URL(`https://${lang}.wikipedia.org/w/api.php`);
  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", q);
  url.searchParams.set("gsrlimit", "8");
  url.searchParams.set("prop", "pageimages|extracts|info");
  url.searchParams.set("inprop", "url");
  url.searchParams.set("piprop", "thumbnail");
  url.searchParams.set("pithumbsize", "640");
  url.searchParams.set("exintro", "1");
  url.searchParams.set("explaintext", "1");
  url.searchParams.set("exchars", "200");
  url.searchParams.set("format", "json");
  const data = (await getJson(url.toString(), {
    headers: { "user-agent": "Waffari/1.0 (https://cursor.com)" },
  })) as { query?: { pages?: Record<string, WikiPage> } };
  const pages = Object.values(data.query?.pages ?? {});
  return pages
    .filter((p) => p.fullurl && p.title)
    .map((p) =>
      hit({
        title: p.title!,
        url: p.fullurl!,
        snippet: p.extract ?? "من ويكيبيديا",
        image: p.thumbnail?.source,
        source: lang === "ar" ? "ويكيبيديا عربي" : "Wikipedia",
        kind: "knowledge",
      }),
    );
}

type DdgTopic = { Text?: string; FirstURL?: string; Icon?: { URL?: string } };

async function duckDuckGo(q: string): Promise<WebHit[]> {
  const url = new URL("https://api.duckduckgo.com/");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("no_html", "1");
  url.searchParams.set("skip_disambig", "1");
  url.searchParams.set("t", "waffari");
  const data = (await getJson(url.toString())) as {
    AbstractText?: string;
    AbstractURL?: string;
    Heading?: string;
    Image?: string;
    RelatedTopics?: (DdgTopic | { Topics?: DdgTopic[] })[];
  };
  const hits: WebHit[] = [];
  if (data.Heading && data.AbstractURL) {
    hits.push(
      hit({
        title: data.Heading,
        url: data.AbstractURL,
        snippet: data.AbstractText || "ملخص من فهرس الويب",
        image: data.Image
          ? data.Image.startsWith("http")
            ? data.Image
            : `https://duckduckgo.com${data.Image}`
          : undefined,
        source: "فهرس الويب",
        kind: "knowledge",
      }),
    );
  }
  const flat: DdgTopic[] = [];
  for (const t of data.RelatedTopics ?? []) {
    if ("FirstURL" in t) flat.push(t);
    if ("Topics" in t) flat.push(...(t.Topics ?? []));
  }
  for (const t of flat.slice(0, 8)) {
    if (!t.FirstURL || !t.Text) continue;
    hits.push(
      hit({
        title: t.Text.split(" - ")[0] ?? t.Text,
        url: t.FirstURL,
        snippet: t.Text,
        image: t.Icon?.URL
          ? t.Icon.URL.startsWith("http")
            ? t.Icon.URL
            : `https://duckduckgo.com${t.Icon.URL}`
          : undefined,
        source: "فهرس الويب",
        kind: "web",
      }),
    );
  }
  return hits;
}

async function nominatim(q: string): Promise<WebHit[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "5");
  url.searchParams.set("accept-language", "ar");
  const data = (await getJson(url.toString(), {
    headers: {
      "user-agent": "Waffari/1.0 (bridal marketplace search)",
    },
  })) as { display_name?: string; lat?: string; lon?: string; osm_type?: string; osm_id?: number; type?: string }[];
  return data.slice(0, 4).map((p) =>
    hit({
      title: p.display_name ?? q,
      url: `https://www.openstreetmap.org/${p.osm_type}/${p.osm_id}`,
      snippet: `مكان على الخريطة · ${p.type ?? "موقع"}`,
      source: "خريطة مفتوحة",
      kind: "place",
    }),
  );
}

function dedupe(hits: WebHit[]) {
  const seen = new Set<string>();
  const out: WebHit[] = [];
  for (const h of hits) {
    const key = h.url.replace(/\/$/, "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(h);
  }
  return out;
}

export async function searchTheWeb(q: string): Promise<WebSearchResponse> {
  const query = q.trim().slice(0, 200);
  if (!query) {
    return {
      q: "",
      hits: [],
      provider: "open-web",
      note: "اكتبي أي حاجة.",
    };
  }

  try {
    const google = await googleSearch(query);
    if (google && google.length) {
      return {
        q: query,
        hits: dedupe(google).slice(0, 12),
        provider: "google",
        note: "النتايج من بحث جوجل (Programmable Search)، معروضة بشكل وفّري.",
      };
    }
  } catch {
    // fall through to open sources
  }

  const settled = await Promise.allSettled([
    wikipediaSearch(query, "ar"),
    wikipediaSearch(query, "en"),
    duckDuckGo(query),
    nominatim(`${query} مصر`),
  ]);
  const merged: WebHit[] = [];
  for (const s of settled) {
    if (s.status === "fulfilled") merged.push(...s.value);
  }

  const hasGoogleEnv = Boolean(
    process.env.GOOGLE_API_KEY && (process.env.GOOGLE_CSE_ID || process.env.GOOGLE_CSE_CX),
  );

  return {
    q: query,
    hits: dedupe(merged).slice(0, 16),
    provider: "open-web",
    note: hasGoogleEnv
      ? "جوجل مرجعش نتايج، فظهر فهرس مفتوح (ويكيبيديا ومصادر ويب) بنفس شكل وفّري."
      : "مفتاح جوجل مش متضبط. بنبحث في فهرس مفتوح (ويكيبيديا، ملخصات ويب، خرائط). حطّي GOOGLE_API_KEY و GOOGLE_CSE_ID عشان النتايج تيجي من جوجل.",
  };
}
