import type { ChangeEvent, CompetitiveSnapshot } from "./types";

export function diffSnapshots(
  prev: CompetitiveSnapshot | undefined,
  next: CompetitiveSnapshot,
): ChangeEvent[] {
  if (!prev) return [];
  const at = next.checkedAt;
  const url = next.url;
  const out: ChangeEvent[] = [];
  if (prev.price !== next.price) {
    out.push({
      id: `${url}-price-${at}`,
      url,
      at,
      kind: "price",
      from: String(prev.price),
      to: String(next.price),
    });
  }
  if (prev.availability !== next.availability) {
    out.push({
      id: `${url}-stock-${at}`,
      url,
      at,
      kind: "stock",
      from: prev.availability,
      to: next.availability,
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

function keyOf(s: CompetitiveSnapshot) {
  return (s.sku || s.gtin || s.url + "|" + s.name).toLowerCase();
}

/** Compare vs baseline — خطوة 3 في مسار Apify price monitoring. */
export function diffRuns(prev: CompetitiveSnapshot[], next: CompetitiveSnapshot[]): ChangeEvent[] {
  const map = new Map(prev.map((s) => [keyOf(s), s]));
  return next.flatMap((s) => diffSnapshots(map.get(keyOf(s)), s));
}

