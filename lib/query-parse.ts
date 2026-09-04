import { foldArabic, tokenizeQuery } from "./ar-fold";
import { brands, categories } from "./catalog";
import type { CategoryId } from "./types";
import type { SearchFilters, SortKey } from "./search";

const CATEGORY_ALIASES: { id: CategoryId; words: string[] }[] = [
  { id: "washers", words: ["غساله", "غسالة", "غسالات", "washer", "washing machine"] },
  { id: "fridges", words: ["ثلاجه", "ثلاجة", "تلاجة", "ثلاجات", "fridge", "refrigerator"] },
  { id: "freezers", words: ["ديب فريزر", "فريزر", "freezer"] },
  { id: "acs", words: ["تكييف", "مكيف", "تكييفات", "مكيفات", "سبليت", "air conditioner", "aircon"] },
  { id: "fans", words: ["مروحه", "مروحة", "مراوح", "fan"] },
  { id: "stoves", words: ["بوتاجاز", "بوتاجازات", "فرن", "موقد", "oven", "stove"] },
  { id: "dishwashers", words: ["غسالة اطباق", "غسالة أطباق", "غساله اطباق", "dishwasher"] },
  { id: "tvs", words: ["تلفزيون", "تليفزيون", "شاشة", "شاشه", "شاشات", "tv", "television"] },
  { id: "audio", words: ["ساوند بار", "سماعة", "سماعات", "soundbar"] },
  { id: "vacuums", words: ["مكنسة", "مكنسه", "مكانس", "مكنسة كهربائية", "vacuum"] },
  { id: "heaters", words: ["سخان", "سخانات", "heater"] },
  { id: "water", words: ["فلتر مياه", "مبرد مياه", "فلاتر", "filter"] },
  { id: "small-appliances", words: ["خلاط", "قلايه", "قلاية", "ميكروويف", "ميكرويف", "كتل", "blender", "air fryer", "microwave"] },
  { id: "personal-care", words: ["سشوار", "مكواة شعر"] },
  { id: "textiles", words: ["مفروشات", "لحاف", "فوط", "مناشف", "ملايه", "ملاية", "towel", "duvet"] },
  { id: "bedroom", words: ["غرفة نوم", "غرفه نوم", "سرير", "دولاب", "تسريحه"] },
  { id: "living", words: ["ركنه", "ركنة", "صالون", "سفره", "سفرة", "كنب"] },
  { id: "kitchen-tools", words: ["حلل", "سكاكين", "اطباق", "أطباق", "طقم حلل", "pots"] },
  { id: "bathroom", words: ["حمام", "دواسه", "ستارة حمام", "bathroom"] },
  { id: "decor", words: ["نجف", "اباجوره", "ديكور", "مرايه"] },
  { id: "women-wear", words: ["عبايه", "عباية", "جلابيه", "لبس حريمي"] },
  { id: "bridal-wear", words: ["فستان", "فستان فرح", "كتب الكتاب"] },
  { id: "pajamas", words: ["بيجامه", "بيجاما", "بيجامات", "لانجيري"] },
  { id: "shoes", words: ["شوز", "جزمه", "حذاء", "شبشب"] },
  { id: "bags", words: ["شنطه", "شنطة", "شنط"] },
  { id: "jewelry", words: ["طقم زركون", "حلق", "إكسسوار"] },
  { id: "beauty", words: ["عطر", "مكياج", "روج", "perfume"] },
  { id: "accessories", words: ["رفايع", "مريله"] },
  { id: "cleaning", words: ["ممسحه", "مشه", "منظف"] },
  { id: "storage", words: ["منظم", "منظمات", "صندوق تخزين"] },
  { id: "travel", words: ["شهر العسل", "شنطة سفر"] },
  { id: "baby", words: ["بيبي", "طفل", "رضيع"] },
];

const BRAND_ALIASES: Record<string, string> = {
  سامسونج: "Samsung",
  samsung: "Samsung",
  "ال جي": "LG",
  "إل جي": "LG",
  lg: "LG",
  توشيبا: "توشيبا",
  toshiba: "توشيبا",
  فريش: "فريش",
  fresh: "فريش",
  بيكو: "بيكو",
  beko: "بيكو",
  بوش: "بوش",
  bosch: "بوش",
  كينوود: "كينوود",
  شارپ: "شارب",
  شارب: "شارب",
  يونيون: "يونيون إير",
  هوفر: "هوفر",
  تيفال: "تيفال",
  براون: "براون",
  ايكيا: "ايكيا",
  ikea: "ايكيا",
};

export const SEARCH_STOP = new Set(
  [
    "عايزة",
    "عايز",
    "اريد",
    "أريد",
    "عاوزه",
    "عاوز",
    "دور",
    "دوري",
    "ابحث",
    "عن",
    "في",
    "من",
    "اللي",
    "ال",
    "و",
    "يا",
    "لو",
    "اقل",
    "أقل",
    "تحت",
    "فوق",
    "تقييم",
    "تقييمها",
    "سعر",
    "سعرها",
    "كيلو",
    "كجم",
    "كغ",
    "kg",
    "الف",
    "ألف",
    "جنيه",
    "ج",
    "جم",
    "فقط",
    "ارخص",
    "أرخص",
    "اغلي",
    "أغلى",
    "مصر",
    "اونلاين",
    "أونلاين",
    "كاش",
    "قسط",
    "او",
    "أو",
    "اي",
    "أي",
    "حاجة",
    "حاجه",
    "منتج",
    "كل",
    "كلها",
    "the",
    "for",
    "with",
  ].map((w) => foldArabic(w)),
);

function toNumber(raw: string) {
  const western = foldArabic(raw);
  return Number(western.replace(/,/g, ""));
}

function parseMoneyPhrase(folded: string): number | undefined {
  const m =
    folded.match(/(?:اقل|أقل|تحت|ارخص|أرخص من|max)\s*(\d+(?:[.,]\d+)?)\s*(الف|ألف|k|الف جنيه)?/) ||
    folded.match(/(\d+(?:[.,]\d+)?)\s*(الف|ألف)\s*(جنيه|ج)?/);
  if (!m) return undefined;
  const n = toNumber(m[1]);
  if (!n) return undefined;
  if (m[2] && /الف|ألف|k/i.test(m[2])) return Math.round(n * 1000);
  if (n > 0 && n < 400 && folded.includes("الف")) return Math.round(n * 1000);
  return n;
}

function parseRating(folded: string): number | undefined {
  const m = folded.match(/(?:تقييم(?:ها)?|نجوم|rating)\s*(?:فوق|اعلى|أعلى|اكتر|أكتر من|>|>=)?\s*(\d(?:[.,]\d)?)/);
  if (m) return toNumber(m[1].replace(",", "."));
  const plus = folded.match(/(\d(?:[.,]\d)?)\s*\+/);
  if (plus && toNumber(plus[1].replace(",", ".")) <= 5) return toNumber(plus[1].replace(",", "."));
  return undefined;
}

function parseReviews(folded: string): number | undefined {
  const m = folded.match(/(\d+)\s*\+?\s*(تقييم|ريفيو|مراجعة|reviews)/);
  return m ? toNumber(m[1]) : undefined;
}

function parseCapacity(folded: string): string | undefined {
  const m = folded.match(/(\d+(?:[.,]\d+)?)\s*(كيلو|كجم|كغ|kg|قدم|حصان|لتر|بوصه|بوصة)/);
  if (!m) return undefined;
  return `${toNumber(m[1])} ${m[2]}`;
}

function parseDiscount(folded: string): number | undefined {
  const m = folded.match(/(?:خصم|discount)\s*(\d{1,2})\s*%?/);
  return m ? toNumber(m[1]) : undefined;
}

function categoryHints() {
  const list = CATEGORY_ALIASES.map((row) => ({
    id: row.id,
    words: [...row.words, categories.find((c) => c.id === row.id)?.name ?? ""].filter(Boolean),
  }));
  for (const c of categories) {
    if (!list.some((x) => x.id === c.id)) list.push({ id: c.id, words: [c.name] });
  }
  return list;
}

function stripPhrases(folded: string, phrases: string[]) {
  let s = ` ${folded} `;
  const sorted = [...phrases].map(foldArabic).filter(Boolean).sort((a, b) => b.length - a.length);
  for (const p of sorted) {
    s = s.replaceAll(p, " ");
  }
  return foldArabic(s);
}

export type ParsedQuery = SearchFilters & {
  leftover: string;
  intent: string[];
};

export function parseShopperQuery(raw: string): ParsedQuery {
  const folded = foldArabic(raw);
  const intent: string[] = [];
  const filters: ParsedQuery = { leftover: raw, intent };

  const max = parseMoneyPhrase(folded);
  if (max) {
    filters.max = max;
    intent.push(`أقل من ${max.toLocaleString("ar-EG")} جنيه`);
  }

  const minRating = parseRating(folded);
  if (minRating) {
    filters.minRating = minRating;
    intent.push(`تقييم ≥ ${minRating}`);
  }

  const minReviews = parseReviews(folded);
  if (minReviews) {
    filters.minReviews = minReviews;
    intent.push(`${minReviews}+ مراجعة`);
  }

  const capacity = parseCapacity(folded);
  if (capacity) {
    filters.capacity = capacity;
    intent.push(capacity);
  }

  const discount = parseDiscount(folded);
  if (discount) {
    filters.minDiscount = discount;
    intent.push(`خصم ${discount}%+`);
  }

  if (/متوفر|in stock|instock/.test(folded)) {
    filters.inStock = true;
    intent.push("متوفر");
  }

  const hints = categoryHints();
  let categoryHit: { id: CategoryId; len: number } | undefined;
  for (const alias of hints) {
    for (const w of alias.words) {
      const f = foldArabic(w);
      if (f && folded.includes(f) && (!categoryHit || f.length > categoryHit.len)) {
        categoryHit = { id: alias.id, len: f.length };
      }
    }
  }
  if (categoryHit) {
    filters.category = categoryHit.id;
    intent.push(categories.find((c) => c.id === categoryHit.id)?.name ?? categoryHit.id);
  }

  for (const [alias, name] of Object.entries(BRAND_ALIASES)) {
    if (folded.includes(foldArabic(alias))) {
      const catalog = brands.find((b) => foldArabic(b.name) === foldArabic(name) || b.name === name);
      filters.brand = catalog?.name ?? name;
      intent.push(filters.brand);
      break;
    }
  }

  const drop: string[] = [
    ...Object.keys(BRAND_ALIASES),
    ...Object.values(BRAND_ALIASES),
    "اقل من",
    "أقل من",
    "تحت",
    "تقييمها",
    "تقييم",
    "متوفر",
  ];
  let leftoverText = stripPhrases(folded, drop);
  leftoverText = leftoverText
    .replace(/(?:اقل|أقل|تحت|ارخص|max)\s*\d+(?:[.,]\d+)?\s*(?:الف|ألف|k)?/g, " ")
    .replace(/\d+(?:[.,]\d+)?\s*(?:الف|ألف|كيلو|كجم|كغ|kg|قدم|حصان|لتر|بوصه|بوصة|جنيه)?/g, " ");

  const leftover = tokenizeQuery(leftoverText)
    .filter((w) => w.length > 1 && !SEARCH_STOP.has(w) && !/^\d+$/.test(w))
    .join(" ");
  filters.leftover = leftover;
  filters.q = leftover || undefined;
  filters.sort = "best" as SortKey;
  return filters;
}

export const POPULAR_SEARCHES = [
  "غسالة 10 كيلو",
  "ثلاجة 16 قدم",
  "تكييف 1.5 حصان",
  "فستان فرح",
  "بوتاجاز",
  "شاشة 55",
  "قلاية هوائية",
  "طقم حلل",
];
