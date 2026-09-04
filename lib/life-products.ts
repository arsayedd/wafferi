import type { Product } from "./types";

function L(
  storeId: string,
  price: number,
  sku: string,
  extra: Partial<Product["listings"][number]> = {},
): Product["listings"][number] {
  const network =
    storeId === "jumia"
      ? "jumia"
      : storeId === "noon"
        ? "noon"
        : storeId === "defacto" || storeId === "namshi" || storeId === "sixthstreet"
          ? "arabclicks"
          : "direct";
  return {
    storeId,
    price,
    sku,
    rating: extra.rating ?? 4.4,
    reviews: extra.reviews ?? 90,
    inStock: extra.inStock ?? true,
    shipping: extra.shipping ?? "توصيل خلال 2–4 أيام",
    url: extra.url ?? `https://www.example.com/${storeId}/${sku}`,
    affiliateNetwork: extra.affiliateNetwork ?? network,
    oldPrice: extra.oldPrice,
  };
}

export const lifeProducts: Product[] = [
  {
    id: "bridal-dress",
    name: "فستان فرح أوف وايت تطريز خفيف",
    brand: "محلي",
    category: "bridal-wear",
    model: "BRD-OW-01",
    capacity: "مقاس 38–46",
    highlights: ["قماش كريب", "ذيل قابل للفصل", "مناسب للكوافير"],
    specs: [
      { label: "المقاسات", value: "38 إلى 46" },
      { label: "اللون", value: "أوف وايت" },
    ],
    listings: [
      L("namshi", 8900, "BRD-N", { rating: 4.5, reviews: 40, url: "https://www.namshi.com/bridal-dress" }),
      L("jumia", 8200, "BRD-J", { rating: 4.2, reviews: 71, url: "https://www.jumia.com.eg/bridal-dress" }),
    ],
    reviewHighlights: [
      { author: "ياسمين ع.", rating: 5, source: "نمشي", text: "القماش تقيل والذيل اتشال بعد الفرح بسهولة." },
    ],
  },
  {
    id: "bridal-abaya",
    name: "عباية عروسة شيفون مطرزة",
    brand: "دايس",
    category: "bridal-wear",
    model: "ABY-BR-2",
    capacity: "وان سايز واسع",
    highlights: ["تطريز ذهبي", "حزام خصر", "بطن مبطّن"],
    specs: [
      { label: "القماش", value: "شيفون" },
      { label: "اللون", value: "سكري" },
    ],
    listings: [
      L("dice", 2450, "ABY-D", { rating: 4.3, reviews: 55 }),
      L("noon", 2690, "ABY-N", { rating: 4.4, reviews: 88 }),
    ],
    reviewHighlights: [
      { author: "نورا س.", rating: 4, source: "نون", text: "حلوة للكتّة. الطول يغطي الكعب." },
    ],
  },
  {
    id: "cotton-pajamas",
    name: "بيجاما حريمي قطن كوتونيل",
    brand: "كوتونيل",
    category: "pajamas",
    model: "CTN-PJ-W",
    capacity: "M–XXL",
    highlights: ["قطن مصري", "زراير أمامية", "جيوب"],
    specs: [
      { label: "الخامة", value: "قطن 100%" },
      { label: "المقاسات", value: "M إلى XXL" },
    ],
    listings: [
      L("cottonil", 690, "PJ-CT", { rating: 4.6, reviews: 320 }),
      L("max", 590, "PJ-MX", { rating: 4.2, reviews: 140 }),
      L("jumia", 640, "PJ-J", { rating: 4.3, reviews: 510 }),
    ],
    reviewHighlights: [
      { author: "هدى م.", rating: 5, source: "كوتونيل", text: "بعد الغسيل مقاسها ثابت. ناعمة للنوم." },
    ],
  },
  {
    id: "kids-pajamas",
    name: "بيجاما أطفال قطعتين",
    brand: "السي واكيك",
    category: "kids-wear",
    model: "LCW-K-PJ",
    capacity: "2–10 سنوات",
    highlights: ["رسمة خفيفة", "قطن مخلوط", "سهل الغسيل"],
    specs: [
      { label: "الأعمار", value: "2 إلى 10" },
      { label: "القطع", value: "2" },
    ],
    listings: [
      L("lcw", 280, "KPJ-L", { rating: 4.4, reviews: 200 }),
      L("max", 250, "KPJ-M", { rating: 4.1, reviews: 90 }),
      L("carrefour", 270, "KPJ-C", { rating: 4.0, reviews: 33 }),
    ],
    reviewHighlights: [
      { author: "أم يوسف", rating: 4, source: "ماكس", text: "الخامة تتحمل الغسالة. اللون زي الصورة." },
    ],
  },
  {
    id: "women-galabiya",
    name: "جلابية قطن صيفي حريمي",
    brand: "ديفاكتو",
    category: "women-wear",
    model: "DF-GAL-W",
    capacity: "S–XL",
    highlights: ["واسعة ومريحة", "كم ثلاث أرباع", "طباعة هادية"],
    specs: [
      { label: "الخامة", value: "قطن مخلوط" },
      { label: "الموسم", value: "صيفي" },
    ],
    listings: [
      L("defacto", 420, "GAL-DF", { rating: 4.3, reviews: 180 }),
      L("namshi", 490, "GAL-NS", { rating: 4.4, reviews: 60 }),
      L("jumia", 399, "GAL-J", { rating: 4.1, reviews: 410 }),
    ],
    reviewHighlights: [
      { author: "سلوى ر.", rating: 5, source: "ديفاكتو", text: "للبيت وللعزومة الخفيفة. مش شفافة." },
    ],
  },
  {
    id: "men-galabiya",
    name: "جلابية رجالي مقلم",
    brand: "ماكس",
    category: "men-wear",
    model: "MAX-GAL-M",
    capacity: "M–3XL",
    highlights: ["قماش بارد", "جيب صدر", "ياقة صينية"],
    specs: [
      { label: "المقاسات", value: "M إلى 3XL" },
      { label: "الخامة", value: "قطن" },
    ],
    listings: [
      L("max", 350, "MG-MX", { rating: 4.2, reviews: 75 }),
      L("lcw", 330, "MG-L", { rating: 4.0, reviews: 110 }),
      L("noon", 390, "MG-N", { rating: 4.3, reviews: 48 }),
    ],
    reviewHighlights: [
      { author: "محمود ك.", rating: 4, source: "ماكس", text: "واسعة ومش بتكرمش بسرعة." },
    ],
  },
  {
    id: "bride-slippers",
    name: "شباشب عروسة ساتان",
    brand: "نمشي",
    category: "shoes",
    model: "BR-SLP",
    capacity: "36–41",
    highlights: ["كعب واطي", "فيونكة", "مريحة للقاعة"],
    specs: [
      { label: "المقاسات", value: "36 إلى 41" },
      { label: "الكعب", value: "3 سم" },
    ],
    listings: [
      L("namshi", 390, "SLP-N", { rating: 4.5, reviews: 95 }),
      L("sixthstreet", 420, "SLP-6", { rating: 4.4, reviews: 40 }),
      L("jumia", 350, "SLP-J", { rating: 4.1, reviews: 210 }),
    ],
    reviewHighlights: [
      { author: "دينا ف.", rating: 5, source: "نمشي", text: "وقفت بيها الساحة كلها من غير وجع." },
    ],
  },
  {
    id: "evening-bag",
    name: "شنطة سهرة عروسة صغيرة",
    brand: "6th Street",
    category: "bags",
    model: "CLUTCH-01",
    capacity: "يد سلسلة",
    highlights: ["تل خفيف", "تدخل الموبايل", "ذهبي"],
    specs: [
      { label: "اللون", value: "ذهبي" },
      { label: "الخامة", value: "ساتان" },
    ],
    listings: [
      L("sixthstreet", 650, "BAG-6", { rating: 4.4, reviews: 52 }),
      L("namshi", 690, "BAG-N", { rating: 4.5, reviews: 70 }),
      L("centrepoint", 590, "BAG-C", { rating: 4.2, reviews: 28 }),
    ],
    reviewHighlights: [
      { author: "مروة أ.", rating: 4, source: "سنتربوينت", text: "صغيرة وأنيقة. السلسلة تتشال." },
    ],
  },
  {
    id: "zircon-set",
    name: "طقم زركون للعروسة",
    brand: "محلي",
    category: "jewelry",
    model: "ZR-3PC",
    capacity: "3 قطع",
    highlights: ["حلق + سلسلة + أسورة", "لون ثابت نسبيًا", "علبة هدية"],
    specs: [
      { label: "القطع", value: "3" },
      { label: "الحجر", value: "زركون" },
    ],
    listings: [
      L("jumia", 280, "ZR-J", { rating: 4.0, reviews: 190 }),
      L("noon", 310, "ZR-N", { rating: 4.2, reviews: 64 }),
      L("namshi", 360, "ZR-NS", { rating: 4.3, reviews: 22 }),
    ],
    reviewHighlights: [
      { author: "إسراء ق.", rating: 4, source: "جوميا", text: "للتصوير حلو. مش تقيل على الودن." },
    ],
  },
  {
    id: "lattafa-perfume",
    name: "عطر يارا لطافة 100 مل",
    brand: "لطافة",
    category: "beauty",
    model: "YARA-100",
    capacity: "100 مل",
    highlights: ["ثبات معقول", "رائحة فواكه", "غلاف هدية"],
    specs: [
      { label: "الحجم", value: "100 مل" },
      { label: "النوع", value: "أو دو بارفان" },
    ],
    listings: [
      L("goldenscent", 890, "YAR-GS", { rating: 4.6, reviews: 410 }),
      L("noon", 940, "YAR-N", { rating: 4.5, reviews: 620 }),
      L("seif", 920, "YAR-S", { rating: 4.4, reviews: 80 }),
    ],
    reviewHighlights: [
      { author: "لميس ح.", rating: 5, source: "جولدن سنت", text: "ريحتي طول اليوم من غير ما تخنق." },
    ],
  },
  {
    id: "bath-towels-8",
    name: "طقم فوط حمام 8 قطع فندقي",
    brand: "هوم سنتر",
    category: "textiles",
    model: "TOW-8-HT",
    capacity: "8 قطع",
    highlights: ["امتصاص عالي", "قطن تيري", "لون أوف وايت وبيج"],
    specs: [
      { label: "القطع", value: "8" },
      { label: "الخامة", value: "قطن" },
    ],
    listings: [
      L("centrepoint", 980, "TW-CP", { rating: 4.5, reviews: 70 }),
      L("carrefour", 890, "TW-CF", { rating: 4.3, reviews: 55 }),
      L("homzmart", 1050, "TW-HM", { rating: 4.4, reviews: 40 }),
    ],
    reviewHighlights: [
      { author: "عبير ن.", rating: 5, source: "كارفور", text: "تخينة وجهاز الحمام اكتمل بيها." },
    ],
  },
  {
    id: "kitchen-linens",
    name: "فوط مطبخ + مريلة 5 قطع",
    brand: "ايكيا",
    category: "accessories",
    model: "KIT-LN-5",
    capacity: "5 قطع",
    highlights: ["مقاومة بقع", "حلقة تعليق", "ألوان هادية"],
    specs: [
      { label: "القطع", value: "5" },
      { label: "الاستخدام", value: "مطبخ" },
    ],
    listings: [
      L("ikea", 220, "KL-IK", { rating: 4.6, reviews: 150 }),
      L("carrefour", 190, "KL-CF", { rating: 4.2, reviews: 40 }),
      L("jumia", 210, "KL-J", { rating: 4.1, reviews: 88 }),
    ],
    reviewHighlights: [
      { author: "شيماء د.", rating: 4, source: "ايكيا", text: "بتتنضف بسهولة. المريلة مقاس مظبوط." },
    ],
  },
];
