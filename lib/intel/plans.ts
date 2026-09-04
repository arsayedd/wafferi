export const saasPlans = [
  { id: "starter", name: "Starter", watches: 25, blurb: "تجربة محلية: عشرات الروابط، مش ألف." },
  { id: "growth", name: "Growth", watches: 80, blurb: "قوائم جهاز + مراقبة منافسين أساسيين." },
  { id: "pro", name: "Pro", watches: 200, blurb: "سقف أعلى على نفس المحرك HTTP." },
  { id: "enterprise", name: "Enterprise", watches: 200, blurb: "مليون صنف يحتاج PostgreSQL/Redis/ClickHouse — مش في التشغيل الحالي." },
] as const;

export type PlanId = (typeof saasPlans)[number]["id"];
