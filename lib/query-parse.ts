import { foldArabic } from "./ar-fold";
import { brands, categories } from "./catalog";
import type { CategoryId } from "./types";
import type { SearchFilters, SortKey } from "./search";

const CATEGORY_ALIASES: { id: CategoryId; words: string[] }[] = [
  { id: "washers", words: ["غساله", "غسالة", "غسالات", "washer", "washing"] },
  { id: "fridges", words: ["ثلاجه", "ثلاجة", "تلاجة", "ثلاجات", "fridge", "refrigerator"] },
  { id: "freezers", words: ["ديب فريزر", "فريزر", "freezer"] },
  { id: "acs", words: ["تكييف", "مكيف", "تكييفات", "air conditioner", "ac"] },
  { id: "stoves", words: ["بوتاجاز", "فرن", "oven", "stove"] },
  { id: "dishwashers", words: ["غسالة اطباق", "غسالة أطباق", "dishwasher"] },
  { id: "tvs", words: ["تلفزيون", "شاشة", "tv", "television"] },
  { id: "vacuums", words: ["مكنسة", "مكنسه", "vacuum"] },
  { id: "heaters", words: ["سخان", "heater"] },
  { id: "small-appliances", words: ["خلاط", "قلايه", "قلاية", "ميكروويف", "blender", "air fryer", "microwave"] },
  { id: "textiles", words: ["مفروشات", "لحاف", "فوط", "مناشف", "towel", "duvet"] },
  { id: "bedroom", words: ["غرفة نوم", "سرير", "دولاب"] },
  { id: "living", words: ["ركنه", "ركنة", "صالون", "سفرة"] },
  { id: "kitchen-tools", words: ["حلل", "سكاكين", "اطباق", "أطباق", "pots"] },
  { id: "bathroom", words: ["حمام", "bathroom"] },
];

const BRAND_ALIASES: Record<string, string> = {
  سامسونج: "Samsung",
  samsung: "Samsung",
  "ال جي": "LG",
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
};

const STOP = new Set(
  "عايزة عايز اريد أريد عاوزه عاوز دور دوري ابحث عن في من اللي ال و يا لو اقل أقل تحت فوق تقييم تقييمها سعر سعرها كيلو كجم kg".split(
    " ",
  ),
);

function toNumber(raw: string) {
  const western = raw.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
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

  for (const alias of CATEGORY_ALIASES) {
    if (alias.words.some((w) => folded.includes(foldArabic(w)))) {
      filters.category = alias.id;
      intent.push(categories.find((c) => c.id === alias.id)?.name ?? alias.id);
      break;
    }
  }

  for (const [alias, name] of Object.entries(BRAND_ALIASES)) {
    if (folded.includes(foldArabic(alias))) {
      const catalog = brands.find((b) => foldArabic(b.name) === foldArabic(name) || b.name === name);
      filters.brand = catalog?.name ?? name;
      intent.push(filters.brand);
      break;
    }
  }

  const leftover = folded
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w) && !/^\d/.test(w))
    .join(" ");
  filters.leftover = leftover;
  filters.q = leftover || undefined;
  filters.sort = "best" as SortKey;
  return filters;
}
