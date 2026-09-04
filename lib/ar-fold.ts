/** Normalize Arabic so search matches أ/ا, ة/ه, Eastern digits, and similar forms. */
export function foldArabic(value: string) {
  return value
    .normalize("NFC")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function tokenizeQuery(value: string) {
  return foldArabic(value)
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

export function arabicIncludes(haystack: string, needle: string) {
  const q = foldArabic(needle);
  if (!q) return true;
  return foldArabic(haystack).includes(q);
}
