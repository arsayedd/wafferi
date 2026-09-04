import type { SourcingCategory } from "./sourcing";
import { sourcingCategories } from "./sourcing";

export type PlanAnswers = {
  months: number;
  budget: number;
  furnished: boolean;
  hasKitchen: boolean;
  hasAppliances: boolean;
  bedrooms: number;
  bathrooms: number;
  tier: "basic" | "smart" | "premium" | "full";
};

export type PlanMonth = {
  label: string;
  focus: string;
  categoryIds: string[];
  share: number;
};

const TIER_WEIGHT = {
  basic: { must: 0.82, should: 0.14, nice: 0.04 },
  smart: { must: 0.72, should: 0.2, nice: 0.08 },
  premium: { must: 0.62, should: 0.25, nice: 0.13 },
  full: { must: 0.55, should: 0.28, nice: 0.17 },
} as const;

export function buildPlan(a: PlanAnswers): {
  months: PlanMonth[];
  must: number;
  should: number;
  nice: number;
  skipped: string[];
} {
  const w = TIER_WEIGHT[a.tier];
  const skipped: string[] = [];
  const cats = new Set<string>([
    "housewares",
    "kitchen",
    "bathroom",
    "cleaning",
    "storage",
    "beauty",
    "travel",
    "gifts",
  ]);
  if (!a.furnished) {
    cats.add("furniture");
    cats.add("bedding");
    cats.add("decor");
  } else {
    skipped.push("الأثاث الثقيل — الشقة مفروشة");
    cats.add("bedding");
  }
  if (!a.hasKitchen) cats.add("kitchen");
  if (!a.hasAppliances) cats.add("appliances");
  else skipped.push("الأجهزة الكبيرة — موجودة");
  cats.add("grocery");
  cats.add("faith");
  cats.add("tools");
  if (a.tier !== "basic") cats.add("fashion");
  if (a.tier === "premium" || a.tier === "full") {
    cats.add("lingerie");
    cats.add("bridal");
    cats.add("gold");
  }

  const sequence: { label: string; focus: string; ids: string[] }[] = [
    {
      label: "بدري (قاعة وفستان)",
      focus: "يوم الفرح والتصوير قبل الزحمة.",
      ids: ["bridal", "beauty", "gifts", "services"],
    },
    {
      label: "الأثاث والأجهزة",
      focus: "التوصيل والتركيب بياخد وقت.",
      ids: ["furniture", "appliances", "bedding"],
    },
    {
      label: "المطبخ والحمام",
      focus: "جملة الرفايع + تنظيم.",
      ids: ["kitchen", "housewares", "bathroom", "storage"],
    },
    {
      label: "اللبس والتجميل والسفر",
      focus: "دولاب العروسة وشهر العسل.",
      ids: ["fashion", "lingerie", "beauty", "travel"],
    },
    {
      label: "آخر شهر",
      focus: "رفايع متنسية، تنظيف، عدة البيت، هدايا.",
      ids: ["housewares", "cleaning", "tools", "gifts", "grocery", "faith"],
    },
  ];

  const monthsCount = Math.max(2, Math.min(6, a.months || 6));
  const picked = sequence.slice(0, monthsCount).map((row, i) => {
    const categoryIds = row.ids.filter((id) => cats.has(id) || i === 0);
    return {
      label: `قبل الفرح بـ ${monthsCount - i} شهر`,
      focus: row.focus,
      categoryIds,
      share: 1 / monthsCount,
    };
  });

  return {
    months: picked,
    must: Math.round(a.budget * w.must),
    should: Math.round(a.budget * w.should),
    nice: Math.round(a.budget * w.nice),
    skipped,
  };
}

export function categoriesForIds(ids: string[]): SourcingCategory[] {
  return ids
    .map((id) => sourcingCategories.find((c) => c.id === id))
    .filter((c): c is SourcingCategory => Boolean(c));
}
