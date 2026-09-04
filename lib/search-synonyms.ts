import { foldArabic, tokenizeQuery } from "./ar-fold";

/** Phrase groups: if the query hits one member, products must hit a member too. */
export const SEARCH_SYNONYMS: string[][] = [
  [
    "اير فراير",
    "ايرفراير",
    "air fryer",
    "airfryer",
    "air-fryer",
    "قلاية هوائية",
    "قلايه هوائيه",
    "قلايات هوائية",
    "قلاية",
    "قلايه",
    "فراير",
  ],
  ["غسالة", "غساله", "غسالات", "washer", "washing machine"],
  ["ثلاجة", "ثلاجه", "تلاجة", "تلاجه", "fridge", "refrigerator"],
  ["تكييف", "مكيف", "air conditioner", "سبليت"],
  ["بوتاجاز", "فرن", "stove", "oven"],
  ["تلفزيون", "تليفزيون", "شاشة", "شاشه", "tv"],
  ["موبايل", "موبيل", "هاتف", "smartphone", "phone"],
  ["لابتوب", "laptop", "notebook"],
  ["مكنسة", "مكنسه", "vacuum"],
  ["سخان", "heater"],
  ["خلاط", "blender"],
  ["ميكروويف", "ميكرويف", "microwave"],
];

export function triggeredSynonymGroups(raw: string) {
  const folded = foldArabic(raw);
  const tokens = tokenizeQuery(raw);
  return SEARCH_SYNONYMS.filter((group) =>
    group.some((term) => {
      const f = foldArabic(term);
      if (!f) return false;
      if (f.includes(" ") || f.length >= 5) return folded.includes(f) || tokens.join(" ").includes(f.replace(/ /g, ""));
      if (f.length >= 4) return tokens.some((t) => t === f) || folded.includes(f);
      return tokens.includes(f);
    }),
  );
}

export function hayMatchesSynonyms(hay: string, groups: string[][]) {
  if (!groups.length) return true;
  const h = foldArabic(hay);
  const words = new Set(h.split(/\s+/).filter(Boolean));
  return groups.every((group) =>
    group.some((term) => {
      const f = foldArabic(term);
      if (!f) return false;
      if (f.length >= 4) return h.includes(f);
      return words.has(f);
    }),
  );
}

export function primaryKindNeedle(groups: string[][]) {
  const air = groups.find((g) => g.some((t) => /فراير|قلايه|قلاية|air ?fry/i.test(t)));
  return air ? "قلاية هوائية" : undefined;
}
