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

const COLORS = ["black", "white", "silver", "gold", "blue", "اسود", "أسود", "ابيض", "أبيض", "فضي", "ذهبي"];

export function attributesOf(name: string) {
  const f = fold(name);
  const cap = f.match(/(\d+)\s*(gb|g|كيلو|كجم|kg|قدم)/)?.[0];
  const color = COLORS.find((c) => f.includes(fold(c)));
  return { capacity: cap, color };
}

export function matchExplain(a: CompetitiveSnapshot, b: CompetitiveSnapshot) {
  const reasons: string[] = [];
  let score = 0;
  if (a.gtin && b.gtin && a.gtin === b.gtin) {
    return { score: 0.987, reasons: ["GTIN مطابق"] };
  }
  if (a.sku && b.sku && fold(a.sku) === fold(b.sku)) {
    score += 0.45;
    reasons.push("SKU");
  }
  if (fold(a.brand ?? "") && fold(a.brand ?? "") === fold(b.brand ?? "")) {
    score += 0.2;
    reasons.push("ماركة");
  }
  const aa = attributesOf(a.name);
  const bb = attributesOf(b.name);
  if (aa.capacity && aa.capacity === bb.capacity) {
    score += 0.12;
    reasons.push("سعة/ذاكرة");
  }
  if (aa.color && aa.color === bb.color) {
    score += 0.08;
    reasons.push("لون");
  }
  const sim = textSimilarity(a.name, b.name);
  score += sim * 0.35;
  if (sim >= 0.5) reasons.push("عنوان موحّد");
  return { score: Math.min(0.99, Number(score.toFixed(3))), reasons };
}

export function matchScore(a: CompetitiveSnapshot, b: CompetitiveSnapshot): number {
  return matchExplain(a, b).score;
}

export function clusterSnapshots(items: CompetitiveSnapshot[]) {
  const used = new Set<number>();
  const clusters: { score: number; members: CompetitiveSnapshot[]; reasons: string[] }[] = [];
  for (let i = 0; i < items.length; i++) {
    if (used.has(i)) continue;
    const members = [items[i]];
    used.add(i);
    let best = 1;
    let reasons: string[] = [];
    for (let j = i + 1; j < items.length; j++) {
      if (used.has(j)) continue;
      const ex = matchExplain(items[i], items[j]);
      if (ex.score >= 0.72) {
        members.push(items[j]);
        used.add(j);
        best = Math.min(best, ex.score);
        reasons = ex.reasons;
      }
    }
    clusters.push({ score: members.length > 1 ? best : 1, members, reasons });
  }
  return clusters.sort((a, b) => b.members.length - a.members.length);
}
