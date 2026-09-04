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

/** Typo-tolerant form: ث/ت, doubled letters (تلاججة → تلاجه). */
export function softenArabic(value: string) {
  return foldArabic(value)
    .replace(/ث/g, "ت")
    .replace(/ذ/g, "ز")
    .replace(/ظ/g, "ض")
    .replace(/(.)\1+/g, "$1");
}

export function editDistance(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = cur;
    }
  }
  return row[b.length];
}

export function similarArabic(a: string, b: string) {
  const x = softenArabic(a);
  const y = softenArabic(b);
  if (!x || !y) return false;
  if (x === y) return true;
  const n = Math.max(x.length, y.length);
  const dLen = Math.abs(x.length - y.length);
  if (dLen <= 2 && n >= 4 && (x.includes(y) || y.includes(x))) return true;
  if (n < 4) return false;
  const allow = n <= 5 ? 1 : n <= 8 ? 2 : 3;
  return editDistance(x, y) <= allow;
}
