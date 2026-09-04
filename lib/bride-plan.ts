import {
  fiveArcs,
  itemsForArc,
  type FiveArc,
  type NeedItem,
  type NeedPri,
} from "./need-taxonomy";
import type { SourcingCategory } from "./sourcing";
import { sourcingCategories } from "./sourcing";

export type PlanAnswers = {
  months: number;
  weddingDate: string;
  budget: number;
  furnished: boolean;
  finished: boolean;
  hasKitchen: boolean;
  hasAppliances: boolean;
  bedrooms: number;
  bathrooms: number;
  tier: "basic" | "smart" | "premium" | "full";
};

export type JourneyStage = {
  arc: FiveArc;
  focus: string;
  items: NeedItem[];
};

export type MonthSlice = {
  label: string;
  focus: string;
  items: NeedItem[];
};

const TIER_WEIGHT = {
  basic: { must: 0.82, should: 0.14, nice: 0.04 },
  smart: { must: 0.72, should: 0.2, nice: 0.08 },
  premium: { must: 0.62, should: 0.25, nice: 0.13 },
  full: { must: 0.55, should: 0.28, nice: 0.17 },
} as const;

export const TIER_AR = {
  basic: "اقتصادي",
  smart: "متوسط",
  premium: "فاخر",
  full: "جهاز كامل",
} as const;

const FOCUS: Record<FiveArc, string> = {
  "قبل الجواز": "قاعة، فستان، تصوير، ميكب، هدايا الخطوبة.",
  "يوم الجواز": "تجهيز العروسة والعريس + خدمات اليوم.",
  "تجهيز البيت": "أثاث، أجهزة، مطبخ، حمام، مفروشات.",
  "أول شهر": "بوكس أول شهر، بقالة، تنظيف، عدة البيت.",
  "بعد الجواز": "تركيب وصيانة، وبعدين أسرة/حيوانات لو حابة.",
};

const WAVE_FOCUS = [
  "فستان، قاعة، تصوير، ميكب، أثاث",
  "أجهزة، مطبخ، ستائر، مفروشات",
  "رفايع مطبخ، حمّام، غرفة نوم، تنظيف",
  "لبس، تجميل، إكسسوار، شهر عسل",
  "رفايع، عناية، طوارئ، عدة يوم الفرح",
] as const;

function waveOf(it: NeedItem): 0 | 1 | 2 | 3 | 4 {
  if (
    it.source === "services" ||
    it.source === "bridal" ||
    it.source === "gold" ||
    it.source === "furniture"
  ) {
    return 0;
  }
  if (it.source === "appliances" || it.source === "kitchen" || it.source === "bedding") {
    return 1;
  }
  if (
    it.source === "housewares" ||
    it.source === "bathroom" ||
    it.source === "storage" ||
    it.source === "cleaning" ||
    it.source === "decor"
  ) {
    return 2;
  }
  if (
    it.source === "fashion" ||
    it.source === "beauty" ||
    it.source === "lingerie" ||
    it.source === "travel" ||
    it.source === "gifts"
  ) {
    return 3;
  }
  return 4;
}

function keepItem(it: NeedItem, a: PlanAnswers): boolean {
  if (
    a.furnished &&
    (it.source === "furniture" ||
      it.name.includes("كنب") ||
      it.name.includes("سفرة وكراسي") ||
      it.name.includes("سرير ومرتبة"))
  ) {
    return false;
  }
  if (
    a.hasAppliances &&
    it.source === "appliances" &&
    !it.name.includes("سشوار") &&
    !it.name.includes("مكواة") &&
    !it.name.includes("كتل")
  ) {
    return false;
  }
  if (
    a.hasKitchen &&
    (it.name === "حلل" ||
      it.name === "طاسات" ||
      it.name === "صواني" ||
      it.name.includes("طقم حلل") ||
      it.name.includes("طاسات وحلل"))
  ) {
    return false;
  }
  if (a.finished && it.source === "home-services" && it.name.includes("ألوميتال")) {
    return false;
  }
  if (a.tier === "basic" && it.pri === "nice") return false;
  if (a.tier === "basic" && it.source === "smart") return false;
  return true;
}

function uniq(items: NeedItem[]): NeedItem[] {
  const seen = new Set<string>();
  return items.filter((it) => {
    if (seen.has(it.name)) return false;
    seen.add(it.name);
    return true;
  });
}

export function priceBands(budget: number, count: number, pri: NeedPri) {
  const unit = Math.max(80, Math.round(budget / Math.max(count, 8)));
  const w = pri === "must" ? 1 : pri === "should" ? 0.7 : 0.4;
  const mid = Math.round(unit * w);
  return {
    eco: Math.round(mid * 0.55),
    mid,
    prem: Math.round(mid * 1.75),
  };
}

export function countdownMonths(months: number): { label: string; wave: 0 | 1 | 2 | 3 | 4 }[] {
  const m = Math.max(1, Math.min(18, Math.round(months) || 1));
  const slots = Math.min(5, m);
  return Array.from({ length: slots }, (_, i) => {
    const remaining = slots === 1 ? m : Math.round(m - (i * (m - 1)) / (slots - 1));
    const wave = (i === slots - 1 ? 4 : i) as 0 | 1 | 2 | 3 | 4;
    const label =
      i === slots - 1 ? "آخر شهر" : remaining <= 1 ? "الشهر الجاي" : `الشهر ${remaining}`;
    return { label, wave };
  });
}

export function buildMonthPlan(a: PlanAnswers, items: NeedItem[]): MonthSlice[] {
  const slots = countdownMonths(a.months);
  return slots.map((s) => ({
    label: s.label,
    focus: WAVE_FOCUS[s.wave],
    items: items.filter((it) => waveOf(it) === s.wave),
  }));
}

export function buildJourney(a: PlanAnswers): {
  stages: JourneyStage[];
  months: MonthSlice[];
  must: number;
  should: number;
  nice: number;
  skipped: string[];
  packageName: string;
} {
  const w = TIER_WEIGHT[a.tier];
  const skipped: string[] = [];
  if (a.furnished) skipped.push("الأثاث الثقيل — الشقة مفروشة");
  if (a.hasAppliances) skipped.push("الأجهزة الكبيرة — موجودة");
  if (a.hasKitchen) skipped.push("طقم الحلل الأساسي — المطبخ موجود");
  if (a.finished) skipped.push("تشطيب تقيل — الشقة متشطبة");

  const stages: JourneyStage[] = fiveArcs.map((arc) => ({
    arc,
    focus: FOCUS[arc],
    items: uniq(itemsForArc(arc).filter((it) => keepItem(it, a))),
  }));

  const all = uniq(stages.flatMap((s) => s.items));
  const months = buildMonthPlan(a, all);

  const names = {
    basic: "جهاز اقتصادي",
    smart: "جهاز متوسط",
    premium: "جهاز فاخر",
    full: "جهاز البيت كامل",
  } as const;

  return {
    stages,
    months,
    must: Math.round(a.budget * w.must),
    should: Math.round(a.budget * w.should),
    nice: Math.round(a.budget * w.nice),
    skipped,
    packageName: names[a.tier],
  };
}

export function categoriesForIds(ids: string[]): SourcingCategory[] {
  return ids
    .map((id) => sourcingCategories.find((s) => s.id === id))
    .filter((s): s is SourcingCategory => Boolean(s));
}
