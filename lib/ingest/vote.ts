import { parseMoney } from "./money";

export type ExtractMethod = "json-ld" | "open-graph" | "css" | "regex" | "json";

export type PriceCandidate = {
  price: number;
  method: ExtractMethod;
  context: string;
  confidence: number;
};

export function pricesAgree(a: number, b: number) {
  if (a === b) return true;
  const avg = (a + b) / 2;
  return avg > 0 && Math.abs(a - b) / avg < 0.05;
}

export function votePrices(candidates: PriceCandidate[]): {
  winner: PriceCandidate | null;
  needsReview: boolean;
} {
  const valid = candidates.filter((c) => c.price > 0);
  if (!valid.length) return { winner: null, needsReview: false };
  if (valid.length === 1) return { winner: valid[0], needsReview: false };

  const groups: PriceCandidate[][] = [];
  for (const c of valid) {
    const g = groups.find((x) => pricesAgree(x[0].price, c.price));
    if (g) g.push(c);
    else groups.push([c]);
  }
  groups.sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length;
    const ca = a.reduce((s, x) => s + x.confidence, 0) / a.length;
    const cb = b.reduce((s, x) => s + x.confidence, 0) / b.length;
    return cb - ca;
  });
  const top = groups[0];
  const winner = [...top].sort((a, b) => b.confidence - a.confidence)[0];
  return { winner, needsReview: groups.length > 1 };
}

export function candidateFromText(
  text: string,
  method: ExtractMethod,
  context: string,
  confidence: number,
): PriceCandidate | null {
  const price = parseMoney(text);
  if (!price) return null;
  return { price, method, context, confidence };
}
