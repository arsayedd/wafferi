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
    finds: ["إكسسوار", "هدايا", "أدوات منزل", "بلاستيك", "زجاج"],
    keywords: ["موسكي", "إكسسوار", "هدايا", "جملة", "بلاستيك", "زجاج", "تغليف"],
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
    finds: ["ديكور", "تحف", "إضاءة", "هدايا"],
    keywords: ["درب", "سعادة", "رفايع", "رخيص", "ديكور", "تحف"],
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
  a({
    id: "republic-st",
    name: "شارع الجمهورية",
    city: "وسط البلد — القاهرة",
    lat: 30.0505,
    lng: 31.2468,
    cheaper: true,
    why: "عدد وهاردوير وكهربا وقطع غيار البيت. فئة ناس بتنساها في الجهاز.",
    finds: ["شنيور", "مفكات", "مسامير", "لمبات", "مشترك"],
    keywords: ["عدد", "شنيور", "مفك", "هاردوير", "جمهورية", "أدوات", "كهربا"],
    spots: [
      { id: "kadry", name: "محلات العدد (قدري تولز ومن حولها)", note: "أدوات يدوية وكهربائية للبيت الجديد." },
      { id: "world", name: "عالم العدد", note: "قارني الماركة والسعر بين المحلات المتجاورة." },
    ],
  }),
  a({
    id: "dokki",
    name: "الدقي",
    city: "الجيزة",
    lat: 30.038,
    lng: 31.212,
    cheaper: false,
    why: "فساتين فرح وتجميل ومطابخ بمستوى أعلى من الجملة.",
    finds: ["فستان فرح", "مكياج", "مطبخ"],
    keywords: ["دقي", "فستان", "عروسة", "فيو", "مطبخ"],
    spots: [{ id: "kitchen", name: "Kitchen Store — مصدق", note: "مستلزمات مطبخ بريميوم." }],
  }),
  a({
    id: "zamalek",
    name: "الزمالك",
    city: "القاهرة",
    lat: 30.062,
    lng: 31.219,
    cheaper: false,
    why: "ديكور ومطبخ فاخر ولبس. مش جملة.",
    finds: ["ديكور", "تقديم", "هدايا"],
    keywords: ["زمالك", "بريميوم", "هوم تاتش"],
    spots: [{ id: "hometouch", name: "Home Touch — طه حسين", note: "مستلزمات مطبخ وديكور." }],
  }),
  a({
    id: "maadi",
    name: "المعادي",
    city: "القاهرة",
    lat: 29.96,
    lng: 31.258,
    cheaper: false,
    why: "ديكور وأثاث وتجميل وفساتين بمستوى أعلى. النمرسى في زهراء المعادي.",
    finds: ["فستان", "ديكور", "أثاث"],
    keywords: ["معادي", "نمرسى", "فستان"],
    spots: [{ id: "nemrasy", name: "النمرسى — زهراء المعادي", note: "فساتين على الطبيعة." }],
  }),
  a({
    id: "nasr-city",
    name: "مدينة نصر",
    city: "القاهرة",
    lat: 30.062,
    lng: 31.346,
    cheaper: false,
    why: "لبس، لانجري، تجميل، فساتين، بيت — مولات وشوارع تجارية.",
    finds: ["لبس", "لانجري", "مكياج", "فستان"],
    keywords: ["مدينة نصر", "عقاد", "مول", "لانجري", "فستان"],
    spots: [{ id: "akkad", name: "عباس العقاد والمولات", note: "فاشن وبيوتي وهدايا في نفس المشوار." }],
  }),
  a({
    id: "tenth-ramadan",
    name: "العاشر من رمضان",
    city: "الشرقية",
    lat: 30.298,
    lng: 31.741,
    cheaper: true,
    why: "مصانع: بلاستيك، منزل، نسيج، تعبئة. بدل التاجر توصل للمصنع.",
    finds: ["بلاستيك", "مصنع", "تعبئة", "نسيج"],
    keywords: ["عاشر", "مصنع", "بلاستيك", "جملة مصنع"],
    spots: [{ id: "zone", name: "المناطق الصناعية", note: "MOQ أعلى، سعر أحسن للكميات." }],
  }),
  a({
    id: "october-industry",
    name: "6 أكتوبر — مناطق صناعية",
    city: "الجيزة",
    lat: 29.928,
    lng: 30.918,
    cheaper: true,
    why: "مصانع ومخازن وموزّعين: بلاستيك، أثاث، منزل، أجهزة استهلاكية.",
    finds: ["مصنع", "مخزن", "بلاستيك", "أثاث"],
    keywords: ["أكتوبر", "مصنع", "مخازن", "موزع"],
    spots: [{ id: "zone", name: "المناطق الصناعية والمخازن", note: "للـsourcing بكميات مش للمشوار اليومي." }],
  }),
  a({
    id: "obour",
    name: "العبور",
    city: "القليوبية",
    lat: 30.228,
    lng: 31.459,
    cheaper: true,
    why: "جملة ملابس ومصانع ومخازن. Egypt Fashion Center مثال واضح.",
    finds: ["لبس جملة", "مصانع"],
    keywords: ["عبور", "جملة لبس", "فاشن سنتر"],
    spots: [{ id: "efc", name: "Egypt Fashion Center", note: "جملة ملابس بدل الريتيل." }],
  }),
  a({
    id: "badr-city",
    name: "مدينة بدر",
    city: "القاهرة",
    lat: 30.136,
    lng: 31.719,
    cheaper: true,
    why: "مصانع منزل وتعبئة وأثاث.",
    finds: ["مصنع", "تعبئة"],
    keywords: ["بدر", "مصنع"],
    spots: [{ id: "zone", name: "المنطقة الصناعية", note: "للتعاقد مع مصنع مش للتسوق الفردي." }],
  }),
  a({
    id: "kasr-nile",
    name: "قصر النيل / وسط البلد",
    city: "القاهرة",
    lat: 30.044,
    lng: 31.239,
    cheaper: true,
    why: "جملة لبس وإكسسوار وأحذية. محلات العروسة على قصر النيل مثال.",
    finds: ["لبس جملة", "أحذية", "شنط"],
    keywords: ["قصر النيل", "وسط البلد", "جملة لبس"],
    spots: [{ id: "arousa", name: "محلات العروسة — قصر النيل", note: "لبس وإكسسوار في قلب وسط البلد." }],
  }),
  a({
    id: "souq-gomaa",
    name: "سوق الجمعة",
    city: "المعصرة — القاهرة",
    lat: 29.983,
    lng: 31.305,
    cheaper: true,
    why: "أثاث مستعمل، ديكور، تحف، متنوع. مش مصدر جهاز جديد مضمون.",
    finds: ["مستعمل", "تحف", "ديكور"],
    keywords: ["جمعة", "مستعمل", "تحف"],
    spots: [{ id: "souq", name: "السوق الأسبوعية", note: "روحي بدري واتساومي." }],
  }),
  a({
    id: "wekalet-balah",
    name: "وكالة البلح",
    city: "بولاق — القاهرة",
    lat: 30.0625,
    lng: 31.2295,
    cheaper: true,
    why: "أقمشة ولبس ومستلزمات منزل بالجملة.",
    finds: ["أقمشة", "لبس", "منزل"],
    keywords: ["بلح", "وكالة", "أقمشة"],
    spots: [{ id: "fabric", name: "الأقمشة والجملة", note: "كويس للتفصيل والكميات." }],
  }),
  a({
    id: "ghoreya",
    name: "الغورية",
    city: "القاهرة الفاطمية",
    lat: 30.0472,
    lng: 31.2614,
    cheaper: true,
    why: "أقمشة، إكسسوار، هاند ميد، مناسبات.",
    finds: ["أقمشة", "إكسسوار", "مناسبات"],
    keywords: ["غورية", "أقمشة", "هاند ميد"],
    spots: [{ id: "fabric", name: "محلات الأقمشة", note: "جنب الموسكي والأزهر." }],
  }),
  a({
    id: "mahalla",
    name: "المحلة الكبرى",
    city: "الغربية",
    lat: 30.969,
    lng: 31.166,
    cheaper: true,
    why: "نسيج ومفروشات وملابس من بلد الصناعة.",
    finds: ["مفروشات", "أقمشة", "لبس"],
    keywords: ["محلة", "نسيج", "قطن"],
    spots: [{ id: "tex", name: "مصانع ومنافذ النسيج", note: "للمفروشات والكميات." }],
  }),
  a({
    id: "borg-arab",
    name: "برج العرب",
    city: "الإسكندرية",
    lat: 30.85,
    lng: 29.58,
    cheaper: true,
    why: "مصانع ومخازن على محور إسكندرية.",
    finds: ["مصنع", "مخزن"],
    keywords: ["برج العرب", "إسكندرية", "مصنع"],
    spots: [{ id: "zone", name: "المنطقة الصناعية", note: "للـsourcing مش للمشوار اليومي من القاهرة." }],
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
