import { textSimilarity } from "../matching";
import type { CompetitiveSnapshot } from "./types";

function fold(s: string) {
  return s
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function matchScore(a: CompetitiveSnapshot, b: CompetitiveSnapshot): number {
  if (a.gtin && b.gtin && a.gtin === b.gtin) return 0.99;
  if (a.sku && b.sku && fold(a.sku) === fold(b.sku) && fold(a.brand ?? "") === fold(b.brand ?? "")) {
    return 0.94;
  }
  const brand = fold(a.brand ?? "") && fold(a.brand ?? "") === fold(b.brand ?? "");
  const sim = textSimilarity(a.name, b.name);
  if (brand && sim >= 0.55) return Math.min(0.93, 0.6 + sim * 0.35);
  return sim;
}

export function clusterSnapshots(items: CompetitiveSnapshot[]) {
  const used = new Set<number>();
  const clusters: { score: number; members: CompetitiveSnapshot[] }[] = [];
  for (let i = 0; i < items.length; i++) {
    if (used.has(i)) continue;
    const members = [items[i]];
    used.add(i);
    let best = 1;
    for (let j = i + 1; j < items.length; j++) {
      if (used.has(j)) continue;
      const s = matchScore(items[i], items[j]);
      if (s >= 0.72) {
        members.push(items[j]);
        used.add(j);
        best = Math.min(best, s);
      }
    }
    clusters.push({ score: members.length > 1 ? best : 1, members });
  }
  return clusters.sort((a, b) => b.members.length - a.members.length);
}
