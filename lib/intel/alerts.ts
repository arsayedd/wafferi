import type { ChangeEvent, CompetitiveSnapshot } from "./types";

export type AlertRule = {
  id: string;
  name: string;
  kind: "below_mine" | "stock_out" | "drop_egp";
  /** سعركِ المرجعي للمقارنة */
  myPrice?: number;
  percent?: number;
  dropEgp?: number;
  channel: "dashboard" | "webhook";
};

export type AlertHit = {
  ruleId: string;
  message: string;
  at: number;
  url: string;
};

export function evaluateRules(
  rules: AlertRule[],
  events: ChangeEvent[],
  snaps: CompetitiveSnapshot[],
): AlertHit[] {
  const hits: AlertHit[] = [];
  const now = Date.now();
  for (const rule of rules) {
    if (rule.kind === "stock_out") {
      for (const e of events.filter((x) => x.kind === "stock" && /out/i.test(x.to))) {
        hits.push({
          ruleId: rule.id,
          url: e.url,
          at: e.at,
          message: `ستوك خلص عند المصدر · ${e.url}`,
        });
      }
    }
    if (rule.kind === "drop_egp") {
      const min = rule.dropEgp ?? 500;
      for (const e of events.filter((x) => x.kind === "price_down" || x.kind === "price")) {
        const from = Number(e.from);
        const to = Number(e.to);
        if (from - to >= min) {
          hits.push({
            ruleId: rule.id,
            url: e.url,
            at: e.at,
            message: `نزول ${from - to} جنيه (حد القاعدة ${min})`,
          });
        }
      }
    }
    if (rule.kind === "below_mine" && rule.myPrice) {
      const pct = (rule.percent ?? 10) / 100;
      const threshold = rule.myPrice * (1 - pct);
      for (const s of snaps) {
        if (s.price > 0 && s.price < threshold) {
          hits.push({
            ruleId: rule.id,
            url: s.url,
            at: now,
            message: `${s.seller} أرخص من سعركِ بأكتر من ${rule.percent ?? 10}٪ (${s.price} مقابل ${rule.myPrice})`,
          });
        }
      }
    }
  }
  return hits.slice(0, 50);
}
