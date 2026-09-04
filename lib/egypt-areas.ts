import { arabicIncludes, foldArabic } from "./ar-fold";

export type AreaSpot = {
  id: string;
  name: string;
  note: string;
};

export type EgyptArea = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  cheaper: boolean;
  why: string;
  finds: string[];
  keywords: string[];
  spots: AreaSpot[];
};

function a(
  area: Omit<EgyptArea, "spots"> & { spots: AreaSpot[] },
): EgyptArea {
  return area;
}

/** أحياء وتجمّعات تسوّق العروسة — داتا وفّري، مش بحث جوجل. */
export const egyptAreas: EgyptArea[] = [
  a({
    id: "hammam-tlat",
    name: "حمام التلات",
    city: "الجمالية — القاهرة",
    lat: 30.0494,
    lng: 31.2623,
    cheaper: true,
    why: "جملة حلل وطاسات وصواني وتقديم. غالبًا أرخص من المولات لو بتعرفي تساومي.",
    finds: ["حلل", "طاسات", "صواني", "أطباق", "كوبايات", "توابل", "كنكة"],
    keywords: ["حلل", "طاسات", "صواني", "مطبخ", "أطباق", "تقديم", "كنكة", "براد", "سكاكين", "تيفال"],
    spots: [
      { id: "pots", name: "سوق الحلل والطاسات", note: "امشي المحلات المتجاورة وقارني السماكة والسعر." },
      { id: "trays", name: "محلات الصواني والتقديم", note: "صواني فرن وضيافة بالجملة." },
      { id: "spices", name: "توابل وأدوات صغيرة", note: "رفايع المطبخ جنب الحلل." },
    ],
  }),
  a({
    id: "abdelaziz",
    name: "شارع عبدالعزيز",
    city: "وسط البلد — القاهرة",
    lat: 30.0478,
    lng: 31.2462,
    cheaper: true,
    why: "مقارنة أجهزة على الطبيعة بين محلات متجاورة. السعر كتير بينزل عن الأونلاين لو كاش.",
    finds: ["غسالة", "ثلاجة", "بوتاجاز", "تكييف", "تلفزيون", "رفايع كهربا"],
    keywords: ["غسالة", "ثلاجة", "بوتاجاز", "تكييف", "شاشة", "جهاز", "فريزر", "سخان", "مكنسة"],
    spots: [
      { id: "white", name: "محلات الأجهزة البيضاء", note: "غسالة وثلاجة وبوتاجاز — خدي عرض مكتوب." },
      { id: "ac", name: "تكييفات وشاشات", note: "قارني الحصان والموديل على أكثر من محل في نفس الشارع." },
    ],
  }),
  a({
    id: "ataba",
    name: "العتبة",
    city: "وسط القاهرة",
    lat: 30.0526,
    lng: 31.2466,
    cheaper: true,
    why: "أجهزة ورفايع ومفروشات جملة. زحمة بس التنوع والسعر شعبي.",
    finds: ["أجهزة", "مفروشات", "رفايع", "إضاءة", "لحاف"],
    keywords: ["عتبة", "مفروشات", "لحاف", "بطانية", "نجفة", "جهاز", "فوط"],
    spots: [
      { id: "tex", name: "مفروشات ولحاف", note: "لحاف وبطانيات وفوط بأسعار السوق الشعبي." },
      { id: "light", name: "إضاءة ونجف", note: "نجف وأباجورات للجهاز." },
    ],
  }),
  a({
    id: "nozha",
    name: "شارع النزهة",
    city: "مصر الجديدة",
    lat: 30.0992,
    lng: 31.3458,
    cheaper: false,
    why: "رفايع وأدوات منزل ومفروشات. أهدى من العتبة، الأسعار وسط.",
    finds: ["رفايع", "منظمات", "مفروشات", "ستائر"],
    keywords: ["رفايع", "منظم", "ستائر", "فوط", "نزهة"],
    spots: [{ id: "home", name: "محلات الرفايع والمفروشات", note: "ستائر ومنظمات من غير زحمة العتبة." }],
  }),
  a({
    id: "shubra",
    name: "شارع شبرا",
    city: "شبرا — القاهرة",
    lat: 30.0779,
    lng: 31.2434,
    cheaper: true,
    why: "أدوات منزل ومفروشات بأسعار شعبية.",
    finds: ["رفايع", "مفروشات", "ملابس بيت"],
    keywords: ["شبرا", "مفروشات", "بيت", "فوط", "بيجاما"],
    spots: [{ id: "home", name: "رفايع ومفروشات شبرا", note: "أسعار شعبية على طول الشارع." }],
  }),
  a({
    id: "moski",
    name: "الموسكي",
    city: "القاهرة الفاطمية",
    lat: 30.0471,
    lng: 31.2554,
    cheaper: true,
    why: "جملة إكسسوار وأدوات منزل. كميات وسعر حبة.",
    finds: ["إكسسوار", "هدايا", "أدوات منزل"],
    keywords: ["موسكي", "إكسسوار", "هدايا", "جملة"],
    spots: [{ id: "acc", name: "جملة الإكسسوار والهدايا", note: "مناسب للكميات ولمسة الجهاز." }],
  }),
  a({
    id: "sogha",
    name: "الصاغة",
    city: "الموسكي",
    lat: 30.0466,
    lng: 31.2568,
    cheaper: true,
    why: "ذهب حسب السعر العالمي + المصنعية. قارني المصنعية بين الدكاكين.",
    finds: ["شبكات", "دبل", "ذهب"],
    keywords: ["ذهب", "شبكة", "دبل", "صاغة", "مجوهرات", "خاتم", "غويشة"],
    spots: [
      { id: "gold", name: "دكاكين الذهب", note: "اسألي على المصنعية للجرام، مش السعر الإجمالي بس." },
    ],
  }),
  a({
    id: "azhar",
    name: "الأزهر — أدوات منزلية",
    city: "الأزهر",
    lat: 30.0456,
    lng: 31.2625,
    cheaper: true,
    why: "محلات أدوات منزل وتقديم جنب حمام التلات.",
    finds: ["تقديم", "أطباق", "صواني"],
    keywords: ["أزهر", "تقديم", "سفرة"],
    spots: [{ id: "serve", name: "تقديم وسفرة", note: "كمّلي من هنا لو حمام التلات زحمة." }],
  }),
  a({
    id: "darb-saada",
    name: "درب سعادة",
    city: "القاهرة الفاطمية",
    lat: 30.0462,
    lng: 31.2601,
    cheaper: true,
    why: "أدوات منزل ورفايع رخيصة ومتنوعة جنب الجمالية.",
    finds: ["رفايع", "منظمات", "أدوات منزل"],
    keywords: ["درب", "سعادة", "رفايع", "رخيص"],
    spots: [{ id: "bits", name: "رفايع درب سعادة", note: "مشيان قصير من حمام التلات." }],
  }),
  a({
    id: "bab-shareya",
    name: "باب الشعرية",
    city: "القاهرة",
    lat: 30.0568,
    lng: 31.2638,
    cheaper: true,
    why: "أدوات منزل ورفايع في حي تجاري شعبي.",
    finds: ["رفايع", "أدوات منزل"],
    keywords: ["شعرية", "باب الشعرية", "رفايع"],
    spots: [{ id: "home", name: "محلات الرفايع", note: "حي تجاري جنب العتبة." }],
  }),
  a({
    id: "fagala",
    name: "الفجالة",
    city: "القاهرة",
    lat: 30.0579,
    lng: 31.2489,
    cheaper: true,
    why: "مكتبات ورفايع وأدوات تنظيم وطباعة.",
    finds: ["منظمات", "ملفات", "أدوات مكتب"],
    keywords: ["فجالة", "منظم", "مكتبة", "تخزين"],
    spots: [{ id: "org", name: "منظمات وملفات", note: "كويس لركن المكتب وتخزين الأوراق." }],
  }),
  a({
    id: "damietta",
    name: "مدينة الأثاث بدمياط",
    city: "دمياط",
    lat: 31.4165,
    lng: 31.8133,
    cheaper: true,
    why: "أثاث من المصنع. غرف نوم وصالون أرخص لو تتحمّلي التوصيل.",
    finds: ["غرفة نوم", "صالون", "سفرة", "دولاب"],
    keywords: ["أثاث", "غرفة نوم", "كنب", "سفرة", "دمياط", "دولاب", "غرفة"],
    spots: [
      { id: "city", name: "مدينة الأثاث", note: "قارني الخشب والتشطيب بين ورش متجاورة." },
    ],
  }),
  a({
    id: "ikea-mall",
    name: "ايكيا — مول مصر",
    city: "6 أكتوبر",
    lat: 29.9724,
    lng: 31.0174,
    cheaper: false,
    why: "أسعار ثابتة، تنظيم وتخزين ومفروشات واضحة. مش أرخص جملة بس مضمونة.",
    finds: ["تخزين", "مطبخ", "مفروشات", "حمام", "ديكور"],
    keywords: ["ايكيا", "تخزين", "منظم", "كفر", "مكتب"],
    spots: [{ id: "ikea", name: "صالة ايكيا", note: "خذي مقاسات الأدراج قبل ما تنزلي." }],
  }),
  a({
    id: "citystars",
    name: "سيتي ستارز / هوم سنتر",
    city: "مدينة نصر",
    lat: 30.0729,
    lng: 31.3457,
    cheaper: false,
    why: "مولات: لبس، تجميل، هوم سنتر. مناسب للمقارنة السريعة مش للجملة.",
    finds: ["لبس", "مكياج", "أحذية", "ديكور"],
    keywords: ["مول", "سيفورا", "زارا", "هوم سنتر", "لانجري", "فستان", "مكياج", "عطور"],
    spots: [
      { id: "beauty", name: "تجميل وعطور", note: "قارني العروض قبل ما تشتري أونلاين." },
      { id: "home", name: "هوم سنتر", note: "مفروشات وديكور بسعر المول." },
    ],
  }),
  a({
    id: "carrefour-clusters",
    name: "كارفور / هايبر وان",
    city: "تجمّعات القاهرة",
    lat: 30.0074,
    lng: 31.4913,
    cheaper: false,
    why: "عروض أسبوعية على تنظيف ومطبخ صغير. كويس للكميات المتوسطة.",
    finds: ["منظفات", "أكياس", "أجهزة صغيرة", "بقالة جهاز"],
    keywords: ["كارفور", "هايبر", "منظف", "مسحوق", "إسفنج", "كلور", "مناديل"],
    spots: [{ id: "hyper", name: "ممر التنظيف والمطبخ", note: "اتبع العروض الأسبوعية، مش الرف الثابت." }],
  }),
];

export function osmPinUrl(lat: number, lng: number) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}

export function osmEmbedSrc(lat: number, lng: number) {
  const d = 0.012;
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

function scoreArea(area: EgyptArea, raw: string): number {
  const q = foldArabic(raw);
  if (!q) return area.cheaper ? 1 : 0;
  let s = 0;
  if (arabicIncludes(area.name, raw) || arabicIncludes(area.city, raw)) s += 8;
  for (const k of area.keywords) {
    if (arabicIncludes(k, raw) || arabicIncludes(raw, k)) s += 5;
  }
  for (const f of area.finds) {
    if (arabicIncludes(f, raw) || arabicIncludes(raw, f)) s += 4;
  }
  for (const spot of area.spots) {
    if (arabicIncludes(spot.name, raw) || arabicIncludes(spot.note, raw)) s += 3;
  }
  if (arabicIncludes(area.why, raw)) s += 1;
  if (area.cheaper && s > 0) s += 0.5;
  return s;
}

/** لو في بحث: نرمي العميلة على المنطقة المناسبة. من غير بحث: أحياء الجملة أولًا. */
export function matchAreas(q: string): EgyptArea[] {
  const raw = q.trim();
  if (!raw) {
    return [...egyptAreas].sort((x, y) => Number(y.cheaper) - Number(x.cheaper));
  }
  const scored = egyptAreas
    .map((area) => ({ area, s: scoreArea(area, raw) }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s);
  return scored.map((x) => x.area);
}

export function cheapestDistricts() {
  return egyptAreas.filter((a) => a.cheaper);
}
