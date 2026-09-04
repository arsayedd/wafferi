/** Normalize Arabic so search matches أ/ا, ة/ه, and similar forms. */
export function foldArabic(value: string) {
  return value
    .normalize("NFC")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function arabicIncludes(haystack: string, needle: string) {
  const q = foldArabic(needle);
  if (!q) return true;
  return foldArabic(haystack).includes(q);
}
