export type RawOffer = {
  id: string;
  store: string;
  title: string;
  brand?: string;
  barcode?: string;
  category?: string;
  capacity?: string;
};

export type MatchCluster = {
  id: string;
  members: RawOffer[];
  reason: string;
  confidence: "high" | "medium" | "review";
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function tokens(s: string) {
  return new Set(normalize(s).split(" ").filter((t) => t.length > 1));
}

export function textSimilarity(a: string, b: string) {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter += 1;
  return inter / Math.max(A.size, B.size);
}

function capacityKey(offer: RawOffer) {
  if (offer.capacity) return normalize(offer.capacity);
  const m = offer.title.match(/(\d+(?:\.\d+)?)\s*(كجم|كيلو|قدم|حصان|لتر|بوصة)/);
  return m ? `${m[1]} ${m[2]}` : "";
}

function brandKey(offer: RawOffer) {
  return normalize(offer.brand ?? offer.title.split(" ")[0] ?? "");
}

export function matchOffers(offers: RawOffer[]): {
  clusters: MatchCluster[];
  reviewQueue: { a: RawOffer; b: RawOffer; score: number }[];
} {
  const parent = new Map<string, string>();
  const reason = new Map<string, string>();
  offers.forEach((o) => parent.set(o.id, o.id));

  function find(id: string): string {
    const p = parent.get(id)!;
    if (p !== id) parent.set(id, find(p));
    return parent.get(id)!;
  }
  function union(a: string, b: string, why: string) {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return;
    parent.set(rb, ra);
    reason.set(ra, why);
  }

  const reviewQueue: { a: RawOffer; b: RawOffer; score: number }[] = [];

  for (let i = 0; i < offers.length; i++) {
    for (let j = i + 1; j < offers.length; j++) {
      const a = offers[i];
      const b = offers[j];
      if (a.barcode && b.barcode && a.barcode === b.barcode) {
        union(a.id, b.id, "باركود مطابق");
        continue;
      }
      const sameBrand = brandKey(a) && brandKey(a) === brandKey(b);
      const sameCat =
        a.category && b.category && normalize(a.category) === normalize(b.category);
      const capA = capacityKey(a);
      const capB = capacityKey(b);
      if (sameBrand && sameCat && capA && capA === capB) {
        union(a.id, b.id, "ماركة + فئة + سعة");
        continue;
      }
      const score = textSimilarity(a.title, b.title);
      if (score >= 0.72 && sameBrand) {
        union(a.id, b.id, `تشابه نصي ${(score * 100).toFixed(0)}٪`);
      } else if (score >= 0.55 && score < 0.72) {
        reviewQueue.push({ a, b, score });
      }
    }
  }

  const groups = new Map<string, RawOffer[]>();
  for (const o of offers) {
    const r = find(o.id);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r)!.push(o);
  }

  const clusters: MatchCluster[] = [...groups.entries()].map(([id, members]) => ({
    id,
    members,
    reason: members.length > 1 ? reason.get(id) ?? "قواعد مطابقة" : "عرض وحيد",
    confidence: members.length > 1 ? "high" : "medium",
  }));

  return { clusters, reviewQueue };
}

export const demoOffers: RawOffer[] = [
  { id: "j1", store: "جوميا", title: "غسالة LG فول أوتوماتيك 8 كيلو", brand: "LG", barcode: "8806091870018", category: "غسالات", capacity: "8 كجم" },
  { id: "n1", store: "نون", title: "LG washing machine 8kg inverter", brand: "LG", barcode: "8806091870018", category: "غسالات", capacity: "8 كجم" },
  { id: "b1", store: "بي تك", title: "غسالة ال جي 8 كجم فضي", brand: "LG", category: "غسالات", capacity: "8 كجم" },
  { id: "j2", store: "جوميا", title: "ثلاجة توشيبا نوفروست 16 قدم", brand: "توشيبا", category: "ثلاجات", capacity: "16 قدم" },
  { id: "n2", store: "نون", title: "Toshiba fridge 16 feet nofrost", brand: "توشيبا", category: "ثلاجات", capacity: "16 قدم" },
  { id: "r2", store: "رنين", title: "ثلاجة توشيبا 16 قدم", brand: "توشيبا", category: "ثلاجات", capacity: "16 قدم" },
  { id: "j3", store: "جوميا", title: "مكيف شارب 1.5 حصان بارد", brand: "شارب", category: "مكيفات", capacity: "1.5 حصان" },
  { id: "b3", store: "بي تك", title: "تكييف شارب واحد ونص حصان", brand: "شارب", category: "مكيفات", capacity: "1.5 حصان" },
  { id: "n3", store: "نون", title: "Sharp AC 1.5 HP", brand: "شارب", category: "مكيفات", capacity: "1.5 حصان" },
  { id: "j4", store: "جوميا", title: "غسالة LG 10 كيلو", brand: "LG", category: "غسالات", capacity: "10 كجم" },
  { id: "x5", store: "نون", title: "غسالة طوشيبا 8 كيلو", brand: "طوشيبا", category: "غسالات", capacity: "8 كجم" },
  { id: "y5", store: "جوميا", title: "غسالة توشيبا 8 كيلو", brand: "توشيبا", category: "غسالات", capacity: "8 كجم" },
];
