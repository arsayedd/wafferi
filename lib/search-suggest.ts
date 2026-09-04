import { categories } from "@/lib/catalog";
import { POPULAR_SEARCHES } from "@/lib/query-parse";
import { virtualFacets } from "@/lib/virtual-catalog";
import { foldArabic } from "@/lib/ar-fold";

export type SuggestRow = { label: string; href: string; hint: string };

export function searchSuggestions(raw: string): SuggestRow[] {
  const q = raw.trim();
  const rows: SuggestRow[] = [];
  const seen = new Set<string>();
  function add(row: SuggestRow) {
    if (seen.has(row.href)) return;
    seen.add(row.href);
    rows.push(row);
  }

  if (q) {
    add({
      label: `بحث عن «${q}» في السوق`,
      href: `/search?q=${encodeURIComponent(q)}`,
      hint: "كل النتائج",
    });
  }

  for (const s of POPULAR_SEARCHES) {
    if (!q || foldArabic(s).includes(foldArabic(q))) {
      add({ label: s, href: `/search?q=${encodeURIComponent(s)}`, hint: "شائع" });
    }
  }

  for (const c of categories) {
    if (!q || foldArabic(c.name).includes(foldArabic(q)) || foldArabic(c.description).includes(foldArabic(q))) {
      add({ label: c.name, href: `/search?category=${c.id}`, hint: "فئة" });
    }
  }

  if (q.length >= 2) {
    for (const b of virtualFacets().brands) {
      if (foldArabic(b).includes(foldArabic(q)) || foldArabic(q).includes(foldArabic(b))) {
        add({ label: b, href: `/search?brand=${encodeURIComponent(b)}&q=${encodeURIComponent(q)}`, hint: "ماركة" });
      }
      if (rows.length > 16) break;
    }
  }

  return rows.slice(0, 14);
}
