import type { ChangeEvent, CompetitiveSnapshot } from "./types";

function keyOf(s: CompetitiveSnapshot) {
  return (s.sku || s.gtin || s.url + "|" + s.name).toLowerCase();
}

export function diffSnapshots(
  prev: CompetitiveSnapshot | undefined,
  next: CompetitiveSnapshot,
): ChangeEvent[] {
  if (!prev) return [];
  const at = next.checkedAt;
  const url = next.url;
  const out: ChangeEvent[] = [];
  if (prev.price !== next.price) {
    const down = next.price < prev.price;
    const delta = Math.abs(next.price - prev.price);
    out.push({
      id: `${url}-price-${at}`,
      url,
      at,
      kind: down ? "price_down" : "price_up",
      from: String(prev.price),
      to: String(next.price),
      message: down
        ? `نزول سعر ${next.name} بـ ${delta} جنيه`
        : `ارتفاع سعر ${next.name} بـ ${delta} جنيه`,
    });
  }
  if ((prev.stock ?? prev.availability) !== (next.stock ?? next.availability)) {
    out.push({
      id: `${url}-stock-${at}`,
      url,
      at,
      kind: "stock",
      from: prev.stock ?? prev.availability,
      to: next.stock ?? next.availability,
      message: `ستوك ${next.name}: ${prev.stock ?? prev.availability} ← ${next.stock ?? next.availability}`,
    });
  }
  const d1 = prev.compareAt ?? 0;
  const d2 = next.compareAt ?? 0;
  if (d1 !== d2) {
    out.push({
      id: `${url}-disc-${at}`,
      url,
      at,
      kind: "discount",
      from: String(d1),
      to: String(d2),
    });
  }
  return out;
}

export function diffRuns(prev: CompetitiveSnapshot[], next: CompetitiveSnapshot[]): ChangeEvent[] {
  if (!prev.length) return [];
  const map = new Map(prev.map((s) => [keyOf(s), s]));
  const seen = new Set<string>();
  const out: ChangeEvent[] = [];
  for (const s of next) {
    const k = keyOf(s);
    seen.add(k);
    const old = map.get(k);
    if (!old) {
      out.push({
        id: `${s.url}-new-${s.checkedAt}`,
        url: s.url,
        at: s.checkedAt,
        kind: "new_product",
        from: "",
        to: s.name,
        message: `ظهر في السحب: ${s.name}`,
      });
    } else {
      out.push(...diffSnapshots(old, s));
    }
  }
  for (const s of prev) {
    const k = keyOf(s);
    if (!seen.has(k)) {
      out.push({
        id: `${s.url}-gone-${Date.now()}`,
        url: s.url,
        at: Date.now(),
        kind: "removed",
        from: s.name,
        to: "",
        message: `اختفى من آخر سحب: ${s.name}`,
      });
    }
  }
  return out;
}
