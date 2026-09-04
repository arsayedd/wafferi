import type { CategoryId, Product } from "./types";

function hash(s: string) {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 16777619);
  return x >>> 0;
}

function pick<T>(id: string, salt: string, arr: readonly T[]): T {
  return arr[hash(`${id}:${salt}`) % arr.length]!;
}

function num(id: string, salt: string, min: number, max: number) {
  return min + (hash(`${id}:${salt}`) % (max - min + 1));
}

export type SpecGroup = { title: string; rows: { label: string; value: string }[] };

function identity(p: Product): SpecGroup {
  return {
    title: "هوية الجهاز",
    rows: [
      { label: "الاسم التجاري", value: p.name },
      { label: "الماركة", value: p.brand },
      { label: "الموديل المرجعي", value: p.model },
      { label: "الفئة", value: p.category },
      { label: "السعة / المقاس الظاهر", value: p.capacity ?? "حسب الموديل" },
      { label: "الباركود الداخلي", value: p.barcode ?? `WF-${p.id.slice(0, 10).toUpperCase()}` },
      { label: "بلد البيع", value: "مصر — 220V / 50Hz" },
    ],
  };
}

function fridge(p: Product): SpecGroup[] {
  const feet = p.capacity ?? pick(p.id, "ft", ["14 قدم", "16 قدم", "18 قدم", "20 قدم"]);
  return [
    {
      title: "التبريد والسعة",
      rows: [
        { label: "السعة", value: feet },
        { label: "السعة التقريبية باللتر", value: `${num(p.id, "l", 280, 620)} لتر` },
        { label: "نظام التبريد", value: pick(p.id, "cool", ["نوفروست", "ديفروست جزئي", "نوفروست كامل"]) },
        { label: "عدد الأبواب", value: pick(p.id, "doors", ["بابين", "3 أبواب", "4 أبواب", "سايد باي سايد"]) },
        { label: "الفريزر", value: pick(p.id, "fz", ["علوي", "سفلي", "باب مستقل", "درج"]) },
        { label: "سعة الفريزر", value: `${num(p.id, "fzl", 60, 180)} لتر` },
      ],
    },
    {
      title: "الطاقة والضاغط",
      rows: [
        { label: "الضاغط", value: pick(p.id, "comp", ["إنفرتر", "عادى", "إنفرتر توشيبا-ستايل", "موفر"]) },
        { label: "كلاس الطاقة", value: pick(p.id, "en", ["A+", "A++", "A+++", "A"]) },
        { label: "استهلاك تقديري", value: `${num(p.id, "kwh", 220, 480)} ك.و.س/سنة` },
        { label: "غاز التبريد", value: pick(p.id, "gas", ["R600a", "R134a"]) },
        { label: "مستوى الضوضاء", value: `${num(p.id, "db", 38, 46)} ديسيل` },
        { label: "الجهد", value: "220–240 فولت · 50 هرتز" },
      ],
    },
    {
      title: "التصميم والمطبخ",
      rows: [
        { label: "اللون", value: pick(p.id, "c", ["فضي", "أبيض", "أسود", "ستانلس", "زجاج"]) },
        { label: "الخامة الخارجية", value: pick(p.id, "mat", ["معدن مطلي", "ستانلس", "زجاج"]) },
        { label: "الأبعاد التقريبية (سم)", value: `${num(p.id, "h", 155, 190)} × ${num(p.id, "w", 54, 92)} × ${num(p.id, "d", 58, 75)}` },
        { label: "الوزن التقريبي", value: `${num(p.id, "kg", 48, 95)} كجم` },
        { label: "الأرفف", value: `${num(p.id, "sh", 3, 6)} زجاج مقوّى` },
        { label: "الإضاءة", value: pick(p.id, "led", ["LED داخلية", "LED + درج"]) },
        { label: "صانع ثلج / ماء", value: pick(p.id, "ice", ["بدون", "صانع ثلج", "ماء من الباب"]) },
      ],
    },
    {
      title: "الضمان والاستخدام في البيت",
      rows: [
        { label: "الضمان المرجعي", value: pick(p.id, "w", ["سنة", "سنتين", "10 سنين على الضاغط"]) },
        { label: "خدمة بعد البيع", value: "فروع العربي / وكلاء الماركة في مصر" },
        { label: "ينفع لكام فرد", value: pick(p.id, "ppl", ["2–3", "4–5", "أسرة كبيرة"]) },
        { label: "مساحة المطبخ المقترحة", value: pick(p.id, "sp", ["مطبخ ضيق", "مطبخ متوسط", "مطبخ واسع"]) },
        { label: "صيانة", value: "تنظيف كويل مرة في السنة · ميزان على الأرض" },
      ],
    },
  ];
}

function washer(p: Product): SpecGroup[] {
  return [
    {
      title: "الغسيل",
      rows: [
        { label: "السعة", value: p.capacity ?? `${num(p.id, "kg", 7, 12)} كجم` },
        { label: "التحميل", value: pick(p.id, "ld", ["أمامي", "علوي"]) },
        { label: "السرعة", value: `${pick(p.id, "rpm", ["800", "1000", "1200", "1400"])} لفة` },
        { label: "البرامج", value: `${num(p.id, "pr", 12, 18)} برنامج` },
        { label: "تجفيف", value: pick(p.id, "dry", ["بدون", "تجفيف جزئي", "غسيل+تجفيف"]) },
      ],
    },
    {
      title: "طاقة ومياه",
      rows: [
        { label: "كلاس الطاقة", value: pick(p.id, "en", ["A", "A+++", "B"]) },
        { label: "استهلاك مياه تقديري", value: `${num(p.id, "w", 38, 62)} لتر/دورة` },
        { label: "إنفرتر", value: pick(p.id, "inv", ["نعم", "لا"]) },
        { label: "مستوى الضوضاء", value: `${num(p.id, "db", 48, 62)} ديسيل` },
      ],
    },
    {
      title: "البيت",
      rows: [
        { label: "الأبعاد سم", value: `${num(p.id, "h", 84, 96)} × ${num(p.id, "w", 59, 64)} × ${num(p.id, "d", 45, 64)}` },
        { label: "الضمان", value: pick(p.id, "w", ["سنتين", "10 سنين موتور"]) },
        { label: "ينفع لكام فرد", value: pick(p.id, "ppl", ["عروسين", "أسرة 4", "أسرة كبيرة"]) },
      ],
    },
  ];
}

function phone(p: Product): SpecGroup[] {
  return [
    {
      title: "الشاشة والمعالج",
      rows: [
        { label: "الشاشة", value: `${pick(p.id, "sc", ["6.5", "6.7", "6.1", "6.8"])} بوصة ${pick(p.id, "pan", ["AMOLED", "IPS", "LTPO"])}` },
        { label: "التردد", value: pick(p.id, "hz", ["90Hz", "120Hz", "144Hz"]) },
        { label: "المعالج", value: pick(p.id, "soc", ["Dimensity", "Snapdragon", "Exynos", "Helio", "Apple-class"]) },
        { label: "الرام / التخزين", value: p.capacity ?? pick(p.id, "st", ["8+128", "8+256", "12+256"]) },
      ],
    },
    {
      title: "الكاميرا والبطارية",
      rows: [
        { label: "الكاميرا الخلفية", value: `${num(p.id, "cam", 48, 200)} ميجا` },
        { label: "السيلفي", value: `${num(p.id, "fr", 8, 50)} ميجا` },
        { label: "البطارية", value: `${num(p.id, "bat", 4000, 6000)} مللي أمبير` },
        { label: "الشحن", value: `${num(p.id, "ch", 18, 120)} وات` },
        { label: "الشبكة", value: pick(p.id, "net", ["4G", "5G"]) },
        { label: "الشريحة", value: "دوال SIM" },
      ],
    },
    {
      title: "البرامج والجسم",
      rows: [
        { label: "النظام", value: pick(p.id, "os", ["أندرويد", "iOS-class"]) },
        { label: "مقاومة الماء", value: pick(p.id, "ip", ["بدون", "IP54", "IP68"]) },
        { label: "البصمة", value: pick(p.id, "fp", ["جنب", "تحت الشاشة", "وجه"]) },
        { label: "الوزن التقريبي", value: `${num(p.id, "g", 165, 230)} جم` },
      ],
    },
  ];
}

function laptop(p: Product): SpecGroup[] {
  return [
    {
      title: "الأداء",
      rows: [
        { label: "المعالج", value: p.capacity ?? pick(p.id, "cpu", ["i5", "i7", "Ryzen 5", "Ryzen 7"]) },
        { label: "الرام", value: pick(p.id, "ram", ["8 جيجا", "16 جيجا", "32 جيجا"]) },
        { label: "التخزين", value: pick(p.id, "ssd", ["256 SSD", "512 SSD", "1 تيرا"]) },
        { label: "كرت الشاشة", value: pick(p.id, "gpu", ["مدمج", "RTX 3050-class", "RTX 4050-class"]) },
      ],
    },
    {
      title: "الشاشة والجسم",
      rows: [
        { label: "الشاشة", value: pick(p.id, "sc", ["14 بوصة", "15.6 بوصة", "16 بوصة"]) },
        { label: "الدقة", value: pick(p.id, "res", ["FHD", "OLED 2.8K", "QHD"]) },
        { label: "الوزن", value: `${(num(p.id, "kg", 12, 24) / 10).toFixed(1)} كجم` },
        { label: "البطارية", value: `${num(p.id, "hr", 6, 14)} ساعات استخدام مكتبي` },
      ],
    },
  ];
}

function ac(p: Product): SpecGroup[] {
  return [
    {
      title: "التكييف",
      rows: [
        { label: "القدرة", value: p.capacity ?? pick(p.id, "hp", ["1.5 حصان", "2.25 حصان", "3 حصان"]) },
        { label: "النوع", value: pick(p.id, "t", ["سبليت", "حار وبارد", "إنفرتر"]) },
        { label: "التغطية التقريبية", value: `${num(p.id, "m", 12, 35)} م²` },
        { label: "كلاس الطاقة", value: pick(p.id, "en", ["A", "A++", "A+++"]) },
        { label: "فريون", value: pick(p.id, "g", ["R32", "R410A"]) },
      ],
    },
  ];
}

function generic(p: Product): SpecGroup[] {
  return [
    {
      title: "التفاصيل",
      rows: [
        { label: "الخامة / النوع", value: p.highlights[0] ?? p.capacity ?? p.brand },
        { label: "الاستخدام", value: pick(p.id, "u", ["يومي", "جهاز عروسة", "موسمي"]) },
        { label: "الضمان المرجعي", value: pick(p.id, "w", ["ستة شهور", "سنة", "سنتين"]) },
        { label: "الوزن/الحجم", value: p.capacity ?? "حسب العبوة" },
        { label: "صنع للبيع في", value: "مصر" },
      ],
    },
  ];
}

const BY_CAT: Partial<Record<CategoryId, (p: Product) => SpecGroup[]>> = {
  fridges: fridge,
  freezers: fridge,
  washers: washer,
  phones: phone,
  tablets: phone,
  laptops: laptop,
  acs: ac,
  tvs: (p) => [
    {
      title: "الشاشة",
      rows: [
        { label: "المقاس", value: p.capacity ?? pick(p.id, "in", ["43 بوصة", "55 بوصة", "65 بوصة"]) },
        { label: "الدقة", value: pick(p.id, "res", ["FHD", "4K UHD", "QLED"]) },
        { label: "سمارت", value: pick(p.id, "os", ["أندرويد", "ويب أو إس", "بدون"]) },
        { label: "هرتز", value: pick(p.id, "hz", ["60", "120"]) },
        { label: "HDMI", value: `${num(p.id, "hd", 2, 4)} منافذ` },
      ],
    },
  ],
  stoves: (p) => [
    {
      title: "البوتاجاز",
      rows: [
        { label: "الشعلات", value: p.capacity ?? pick(p.id, "b", ["4 شعلة", "5 شعلة"]) },
        { label: "الوقود", value: pick(p.id, "f", ["غاز", "غاز وكهربا"]) },
        { label: "الأمان", value: pick(p.id, "s", ["صمام أمان", "تاتش"]) },
        { label: "الخامة", value: pick(p.id, "m", ["استانلس", "مينا"]) },
      ],
    },
  ],
};

function life(p: Product): SpecGroup {
  return {
    title: "في الحياة اليومية",
    rows: [
      { label: "ينفع لمين", value: pick(p.id, "who", ["عروسين أول بيت", "أسرة صغيرة", "أسرة كبيرة", "استوديو"]) },
      { label: "مساحة الشقة", value: pick(p.id, "apt", ["أقل من 80م", "80–120م", "أكبر من 120م"]) },
      { label: "فاتورة كهربا تقديرية", value: pick(p.id, "bill", ["موفرة", "متوسطة", "حسب الاستخدام"]) },
      { label: "صيانة", value: pick(p.id, "mnt", ["سهلة من الوكيل", "تحتاج فني معتمد", "قطع غيار منتشرة"]) },
      { label: "إكسسوار مطلوب", value: pick(p.id, "acc", ["قاعدة / ميزان", "وصلات كهربا آمنة", "غطا غبار", "بدون"]) },
      { label: "عمر تشغيلي مرجعي", value: `${num(p.id, "yr", 5, 12)} سنين مع الصيانة` },
    ],
  };
}

/** مواصفات مرجعية كاملة للعرض — مش كتالوج المصنع الرسمي إلا لو فيد اتربط. */
export function fullSpecGroups(p: Product): SpecGroup[] {
  const extra = (BY_CAT[p.category] ?? generic)(p);
  const seen = new Set<string>();
  const fromProduct: SpecGroup = {
    title: "من بطاقة المنتج",
    rows: p.specs.filter((s) => {
      if (seen.has(s.label)) return false;
      seen.add(s.label);
      return true;
    }),
  };
  const groups = [identity(p), fromProduct, ...extra, life(p)].filter((g) => g.rows.length);
  return groups;
}

export function flatSpecs(p: Product) {
  return fullSpecGroups(p).flatMap((g) => g.rows.map((r) => ({ ...r, group: g.title })));
}
