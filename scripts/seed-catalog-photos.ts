import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UA = "Waffari/1.0 (bridal marketplace; CC catalog thumbs)";
const OUT = path.join(process.cwd(), "public/catalog-photos");

const QUERIES: Record<string, string> = {
  washers: "front load washing machine",
  washers2: "LG washing machine",
  washers3: "Samsung washing machine",
  fridges: "refrigerator kitchen",
  fridges2: "french door refrigerator",
  freezers: "chest freezer",
  acs: "split air conditioner indoor unit",
  fans: "pedestal fan",
  stoves: "gas stove cooker",
  dishwashers: "dishwasher kitchen",
  vacuums: "vacuum cleaner",
  heaters: "gas water heater",
  water: "water dispenser",
  tvs: "flat screen television",
  tvs2: "LED TV living room",
  audio: "soundbar",
  "small-appliances": "stand mixer kitchen",
  microwave: "microwave oven",
  iron: "steam iron",
  "personal-care": "hair dryer",
  bedroom: "bedroom furniture",
  living: "sofa living room",
  "kitchen-tools": "cookware pans",
  textiles: "folded towels",
};

async function commonsFirst(q: string) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("generator", "search");
  api.searchParams.set("gsrsearch", q);
  api.searchParams.set("gsrnamespace", "6");
  api.searchParams.set("gsrlimit", "8");
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url");
  api.searchParams.set("iiurlwidth", "900");
  api.searchParams.set("format", "json");
  const res = await fetch(api, { headers: { "user-agent": UA } });
  const text = await res.text();
  if (!res.ok || text.startsWith("<") || text.startsWith("You are")) return "";
  const data = JSON.parse(text) as {
    query?: { pages?: Record<string, { title?: string; imageinfo?: { thumburl?: string }[] }> };
  };
  for (const p of Object.values(data.query?.pages ?? {})) {
    if (/logo|svg|pdf/i.test(p.title ?? "")) continue;
    const u = p.imageinfo?.[0]?.thumburl;
    if (u) return u;
  }
  return "";
}

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const [key, q] of Object.entries(QUERIES)) {
    const dest = path.join(OUT, `${key}.jpg`);
    const url = await commonsFirst(q);
    if (!url) {
      console.log("MISS", key);
      await new Promise((r) => setTimeout(r, 400));
      continue;
    }
    const img = await fetch(url, { headers: { "user-agent": UA } });
    if (!img.ok) {
      console.log("FAIL", key, img.status);
      continue;
    }
    await writeFile(dest, Buffer.from(await img.arrayBuffer()));
    console.log("OK", key);
    await new Promise((r) => setTimeout(r, 350));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
