import { arabicIncludes } from "./ar-fold";

export type SourcingLane = "online" | "wholesale" | "factory";

export type SourcingCategory = {
  id: string;
  title: string;
  blurb: string;
  products: string[];
  keywords: string[];
  online: string[];
  wholesale: string[];
  factory: string[];
};

/** خريطة sourcing عملية: أونلاين + جملة + مصنع. مش كل تاجر إنستجرام في مصر. */
export const sourcingCategories: SourcingCategory[] = [
  {
    id: "housewares",
    title: "رفايع",
    blurb: "منجم العروسة الحقيقي — تنوع وسعر حبة.",
    products: [
      "فتاحة علب",
      "فتاحة زجاجات",
      "مقص مطبخ",
      "مبشرة",
      "عصارة",
      "هراسة",
      "مضرب بيض",
      "ملقاط",
      "ملاعق خشب",
      "مصفاة",
      "قمع",
      "جوانتي فرن",
    ],
    keywords: ["رفايع", "مصفاة", "مبشرة", "برطمان"],
    online: ["jumia", "noon", "cupindy", "safqqa", "amazon", "miniso"],
    wholesale: ["ataba", "moski", "hammam-tlat"],
    factory: ["tenth-ramadan", "october-industry"],
  },
  {
    id: "kitchen",
    title: "مطبخ",
    blurb: "حلل وطاسات وتقديم وأجهزة صغيرة.",
    products: ["حلل", "طاسات", "صواني", "أطباق", "كوبايات", "معالق", "سكاكين", "برطمانات", "تقديم"],
    keywords: ["حلل", "كنكة", "مطبخ", "طاسات", "تيفال"],
    online: ["ikea", "noon", "jumia", "amazon", "cupindy", "safqqa", "homecentre", "raneen", "palacio", "miniso", "carrefour"],
    wholesale: ["hammam-tlat", "moski", "azhar"],
    factory: ["tenth-ramadan"],
  },
  {
    id: "plastic",
    title: "بلاستيك",
    blurb: "علب، سلال، منظمات رخيصة بالكميات.",
    products: ["علب", "سلال", "جرادل", "أغطية", "شماعات بلاستيك"],
    keywords: ["بلاستيك", "علب", "سلال"],
    online: ["jumia", "noon", "safqqa", "ikea"],
    wholesale: ["moski", "bab-shareya", "ataba"],
    factory: ["tenth-ramadan", "october-industry"],
  },
  {
    id: "bedding",
    title: "مفروشات",
    blurb: "ملايات ولحاف وفوط وستائر.",
    products: ["ملايات", "لحاف", "فوط", "كوفرتة", "واقي مرتبة", "ستائر"],
    keywords: ["لحاف", "ملايات", "فوط", "مفروشات", "ستائر"],
    online: ["ikea", "homecentre", "zarahome", "jumia", "noon", "homzmart", "cotton-house"],
    wholesale: ["shubra", "nozha", "ataba"],
    factory: ["tenth-ramadan", "damietta", "mahalla"],
  },
  {
    id: "furniture",
    title: "أثاث",
    blurb: "غرف وصالون وسفرة — دمياط للمصنع، ايكيا للثابت.",
    products: ["غرفة نوم", "كنب", "سفرة", "دولاب", "نيش"],
    keywords: ["أثاث", "غرفة نوم", "كنب", "دمياط"],
    online: ["ikea", "homzmart", "homecentre", "mobica"],
    wholesale: ["damietta"],
    factory: ["damietta", "october-industry"],
  },
  {
    id: "appliances",
    title: "أجهزة",
    blurb: "بيضاء وصغيرة — سلاسل + عبدالعزيز للمقارنة كاش.",
    products: ["غسالة", "ثلاجة", "بوتاجاز", "تكييف", "ميكروويف"],
    keywords: ["غسالة", "ثلاجة", "تكييف", "جهاز"],
    online: ["jumia", "noon", "btech", "raneen", "amazon", "twob", "raya", "dream2000", "elaraby", "fresh", "carrefour"],
    wholesale: ["abdelaziz", "ataba"],
    factory: ["october-industry"],
  },
  {
    id: "tools",
    title: "أدوات وعدد",
    blurb: "الفئة اللي بتتنسي في الجهاز: شنيور ومفكات ومسامير.",
    products: ["شنيور", "مفكات", "مسامير", "خطافات", "لمبات"],
    keywords: ["شنيور", "عدد", "مفك", "هاردوير"],
    online: ["amazon", "noon", "jumia", "safqqa", "ikea", "ace"],
    wholesale: ["republic-st", "ataba", "moski"],
    factory: [],
  },
  {
    id: "decor",
    title: "ديكور",
    blurb: "شموع، فازات، إضاءة، تحف.",
    products: ["شموع", "فازات", "مرايات", "نجف", "نباتات صناعية"],
    keywords: ["ديكور", "شموع", "نجفة", "تحف"],
    online: ["ikea", "zarahome", "homecentre", "miniso", "palacio", "homzmart"],
    wholesale: ["darb-saada", "moski", "ataba"],
    factory: [],
  },
  {
    id: "fashion",
    title: "لبس",
    blurb: "سلاسل المولات + جملة العبور ووسط البلد.",
    products: ["خروج", "بيت", "عبايات", "تريننج"],
    keywords: ["لبس", "عباية", "جلابية"],
    online: ["jumia", "noon", "lcw", "defacto", "hm", "zara", "mango", "max", "randb", "bershka", "trendyol", "shein"],
    wholesale: ["nasr-city", "nozha", "kasr-nile", "abdeen", "sahel-cairo"],
    factory: ["obour"],
  },
  {
    id: "lingerie",
    title: "لانجري",
    blurb: "سلاسل المولات + مدينة نصر/مصر الجديدة.",
    products: ["لانجري", "داخلي", "بيجاما"],
    keywords: ["لانجري", "بيجاما", "داخلي"],
    online: ["jumia", "noon", "lavieenrose", "womensecret", "hunkemoller", "nayomi", "cottonil"],
    wholesale: ["nasr-city", "nozha"],
    factory: ["obour"],
  },
  {
    id: "beauty",
    title: "تجميل",
    blurb: "سيفورا للمولات، العزبي للسريع، العتبة للجملة.",
    products: ["مكياج", "عناية", "عطور", "فرش", "منظم مكياج"],
    keywords: ["مكياج", "ميكب", "عطر", "سيفورا"],
    online: ["jumia", "noon", "sephora", "faces", "mazaya", "elezaby", "p19011", "eva", "orchidia", "beautymarket", "amazon"],
    wholesale: ["ataba", "nasr-city"],
    factory: [],
  },
  {
    id: "bridal",
    title: "فستان الفرح",
    blurb: "على الطبيعة في أحياء العرايس — مش ماركتبليس.",
    products: ["فستان", "طرح", "تعديل مقاس"],
    keywords: ["فستان", "فرح", "عروسة", "زفاف"],
    online: [],
    wholesale: ["dokki", "nozha", "nasr-city", "maadi", "zamalek"],
    factory: [],
  },
  {
    id: "gold",
    title: "ذهب",
    blurb: "الصاغة للمصنعية. المولات للماركات.",
    products: ["شبكات", "دبل", "غويشة"],
    keywords: ["ذهب", "شبكة", "دبل", "صاغة"],
    online: ["damas", "azzafahmy"],
    wholesale: ["sogha"],
    factory: [],
  },
  {
    id: "storage",
    title: "تنظيم",
    blurb: "كاتيجوري تقدر تبقى بيزنس لوحدها.",
    products: ["منظم أدراج", "منظم دولاب", "منظم أحذية", "منظم مكياج", "صناديق", "سلال", "شماعات", "أكياس تفريغ"],
    keywords: ["منظم", "تخزين", "شماعات", "تفريغ"],
    online: ["ikea", "miniso", "jumia", "noon", "safqqa", "cupindy", "homecentre"],
    wholesale: ["moski", "fagala", "ikea-mall"],
    factory: ["tenth-ramadan"],
  },
  {
    id: "bathroom",
    title: "الحمام",
    blurb: "ستائر، دواسات، إكسسوار، سلال غسيل.",
    products: ["ستارة", "دواسة", "حامل شامبو", "حامل صابون", "حامل فرش", "سلة غسيل", "فوط", "روب"],
    keywords: ["حمام", "ستارة حمام", "دواسة"],
    online: ["ikea", "homecentre", "jumia", "noon", "miniso", "raneen"],
    wholesale: ["moski", "ataba", "hammam-tlat"],
    factory: [],
  },
  {
    id: "cleaning",
    title: "تنظيف",
    blurb: "هايبر للعروض، جملة للعدد.",
    products: ["مقشة", "ممسحة", "جردل", "إسفنج", "فوط مايكروفايبر", "بخاخ", "جاروف", "منظفات"],
    keywords: ["تنظيف", "ممسحة", "مقشة", "كلور"],
    online: ["jumia", "noon", "carrefour", "hyperone", "raneen", "ikea", "cupindy"],
    wholesale: ["moski", "ataba", "fagala"],
    factory: ["tenth-ramadan"],
  },
  {
    id: "travel",
    title: "سفر وشهر العسل",
    blurb: "شنط ومنظمات وبيتشوير.",
    products: ["شنطة سفر", "منظم سفر", "بيتشوير", "لانجري سفر", "حامل باسبور", "باور بانك"],
    keywords: ["سفر", "شنطة", "شهر العسل"],
    online: ["jumia", "noon", "amtourister", "samsonite", "aldo", "lcw"],
    wholesale: ["kasr-nile", "nasr-city"],
    factory: [],
  },
  {
    id: "gifts",
    title: "هدايا",
    blurb: "خطوبة وجواز — جملة الموسكي أو ماركتبليس.",
    products: ["هدايا", "تغليف", "شوكولاتة", "ورد"],
    keywords: ["هدية", "هدايا", "تغليف"],
    online: ["miniso", "jumia", "noon", "palacio", "goldenscent"],
    wholesale: ["moski", "ataba"],
    factory: [],
  },
  {
    id: "grocery",
    title: "أول شهر بقالة",
    blurb: "رز، زيت، منظفات — هايبر مش جملة الجمالية.",
    products: ["رز", "زيت", "شاي", "توابل", "مناديل", "مسحوق"],
    keywords: ["بقالة", "رز", "زيت", "توابل"],
    online: ["carrefour", "hyperone", "spinneys", "metro", "talabat-mart", "breadfast"],
    wholesale: ["carrefour-clusters"],
    factory: [],
  },
  {
    id: "smart",
    title: "بيت ذكي",
    blurb: "لمبات، بلج، كاميرات — ماركتبليس وسلاسل أجهزة.",
    products: ["لمبة ذكية", "كاميرا", "سماعة", "مكنسة روبوت"],
    keywords: ["ذكي", "كاميرا", "روبوت", "سماعة"],
    online: ["jumia", "noon", "amazon", "btech", "twob"],
    wholesale: ["abdelaziz"],
    factory: [],
  },
  {
    id: "faith",
    title: "ركن الصلاة",
    blurb: "سجاد، مصحف، بخور — أسواق شعبية + أونلاين.",
    products: ["سجادة صلاة", "مصحف", "بخور", "سبحة"],
    keywords: ["سجادة", "صلاة", "مصحف", "بخور"],
    online: ["jumia", "noon", "amazon"],
    wholesale: ["moski", "ataba", "ghoreya"],
    factory: [],
  },
  {
    id: "services",
    title: "خدمات الفرح",
    blurb: "قاعة، مصور، ميكب، زفة — بنوجّه للأحياء مش بنحجز من هنا.",
    products: ["قاعة", "تصوير", "ميكب آرتست", "كوشة", "ورد"],
    keywords: ["قاعة", "مصور", "حنة", "كوشة", "زفة"],
    online: [],
    wholesale: ["dokki", "nasr-city", "nozha", "maadi"],
    factory: [],
  },
];

export const houseTiers = [
  {
    id: "basic",
    name: "Basic",
    budget: 10000,
    blurb: "أساسيات المطبخ والحمام والتنظيف من الجملة + ماركتبليس.",
    rooms: ["مطبخ رفايع", "حمام", "تنظيف"],
  },
  {
    id: "smart",
    name: "Smart",
    budget: 25000,
    blurb: "الأساسي + مفروشات وتنظيم وأجهزة صغيرة.",
    rooms: ["مطبخ", "مفروشات", "تنظيم", "أجهزة صغيرة"],
  },
  {
    id: "premium",
    name: "Premium",
    budget: 50000,
    blurb: "جهاز أوضح: حلل أحسن، مفروشات، ديكور، عناية.",
    rooms: ["مطبخ كامل", "غرفة", "ديكور", "تجميل"],
  },
  {
    id: "full",
    name: "Full House",
    budget: 100000,
    blurb: "أجهزة كبيرة + أثاث دمياط أو ايكيا + باقي البيت.",
    rooms: ["أجهزة", "أثاث", "كل الغرف"],
  },
] as const;

export const marketplaceProfiles = [
  { id: "jumia", sells: "أجهزة، مطبخ، رفايع، بيت، تجميل، لبس" },
  { id: "noon", sells: "بيت، مطبخ، تنظيم، أجهزة، لبس، تجميل" },
  { id: "amazon", sells: "أجهزة، أدوات، بيت، تجميل، لبس" },
  { id: "ikea", sells: "أثاث، تنظيم، مطبخ، حمام، ديكور، مفروشات" },
  { id: "homzmart", sells: "أثاث، ديكور، بيت" },
  { id: "raneen", sells: "أجهزة، أدوات منزل، مطبخ، مفروشات" },
  { id: "carrefour", sells: "أجهزة، بيت، بقالة، عناية" },
  { id: "hyperone", sells: "أجهزة، منزل، سوبرماركت" },
  { id: "spinneys", sells: "بيت، عناية، بقالة" },
  { id: "miniso", sells: "رفايع، تنظيم، إكسسوار تجميل، هدايا" },
  { id: "safqqa", sells: "أدوات، بيت، مطبخ، تخزين" },
  { id: "cupindy", sells: "مطبخ، بيت، تنظيم" },
] as const;

export function matchSourcing(q: string): SourcingCategory[] {
  const raw = q.trim();
  if (!raw) return sourcingCategories;
  const hit = sourcingCategories.filter(
    (c) =>
      arabicIncludes(c.title, raw) ||
      c.keywords.some((k) => arabicIncludes(k, raw) || arabicIncludes(raw, k)) ||
      c.products.some((p) => arabicIncludes(p, raw) || arabicIncludes(raw, p)),
  );
  return hit.length ? hit : sourcingCategories;
}
