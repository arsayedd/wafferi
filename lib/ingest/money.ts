/** قراءة سعر معلن بالجنيه، مع رفض أقساط وتمويل زي تتبّع السعر الجاد. */
export function parseMoney(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return Math.round(raw);
  const text = String(raw ?? "").trim();
  if (!text) return 0;
  const lower = text.toLowerCase();
  if (
    /\/mo|per month|تقسيط|قسط|جنيه\/شهر|payments? of|starting at/i.test(lower)
  ) {
    return 0;
  }
  const compact = text.replace(/\s+/g, " ");
  const m =
    compact.match(
      /(?:EGP|LE|ج\.?\s*م\.?|جنيه)?\s*([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+)(?:\s*(?:EGP|LE|ج\.?\s*م\.?|جنيه))?/i,
    ) ?? compact.match(/(\d+(?:[.,]\d+)?)/);
  if (!m) return 0;
  let n = m[1].replace(/\s/g, "");
  if (/,\d{2}$/.test(n) && !/\.\d{2}$/.test(n)) n = n.replace(/\./g, "").replace(",", ".");
  else n = n.replace(/,/g, "");
  const v = Number(n);
  return Number.isFinite(v) && v > 0 ? Math.round(v) : 0;
}
