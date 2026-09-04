import type { Product } from "./types";
import { makeSku } from "./sku-factory";

function phone(
  id: string,
  name: string,
  brand: string,
  price: number,
  capacity: string,
  specs: { label: string; value: string }[],
  highlights: string[],
): Product {
  const p = makeSku(id, name, brand, "phones", price, capacity);
  p.capacity = capacity;
  p.model = name.replace(brand, "").trim();
  p.specs = specs;
  p.highlights = highlights;
  p.reviewHighlights = [
    {
      author: "مشتري من القاهرة",
      rating: 5,
      source: "جوميا",
      text: "الموديل مطلوب في مصر. قارني المساحة واللون قبل ما تدفعي.",
    },
  ];
  return p;
}

/** موديلات معروفة بتدور في سوق مصر — أسعار مرجعية مش لقطة برايسينا. */
export const flagshipTech: Product[] = [
  phone(
    "samsung-s25-ultra-256",
    "سامسونج جالاكسي S25 Ultra 256GB",
    "Samsung",
    62990,
    "256 جيجا",
    [
      { label: "الشاشة", value: "6.9 بوصة Dynamic AMOLED 2X" },
      { label: "التردد", value: "120Hz" },
      { label: "المعالج", value: "Snapdragon 8 Elite for Galaxy" },
      { label: "الرام", value: "12 جيجا" },
      { label: "التخزين", value: "256 جيجا" },
      { label: "الكاميرا الرئيسية", value: "200 ميجا" },
      { label: "الزوم", value: "مقراب حتى 100x (حسب إصدار الشركة)" },
      { label: "البطارية", value: "5000 مللي أمبير" },
      { label: "الشحن", value: "45 وات" },
      { label: "S Pen", value: "مدمج" },
      { label: "المقاومة", value: "IP68" },
      { label: "الشبكة", value: "5G · دوال SIM" },
      { label: "الألوان الشائعة", value: "تيتانيوم أسود / فضي / أزرق" },
    ],
    ["فلاجشيب 2025 في مصر", "قارني 256 و 512 قبل الشراء", "أسعار المتاجر بتتغير أسبوعي"],
  ),
  phone(
    "samsung-s25-ultra-512",
    "سامسونج جالاكسي S25 Ultra 512GB",
    "Samsung",
    69990,
    "512 جيجا",
    [
      { label: "الشاشة", value: "6.9 بوصة Dynamic AMOLED 2X" },
      { label: "المعالج", value: "Snapdragon 8 Elite for Galaxy" },
      { label: "الرام", value: "12 جيجا" },
      { label: "التخزين", value: "512 جيجا" },
      { label: "الكاميرا الرئيسية", value: "200 ميجا" },
      { label: "البطارية", value: "5000 مللي أمبير" },
      { label: "S Pen", value: "مدمج" },
      { label: "الشبكة", value: "5G" },
    ],
    ["نفس S25 Ultra بمساحة أكبر", "أنسب لو بتصوري 4K كتير"],
  ),
  phone(
    "samsung-s24-ultra-256",
    "سامسونج جالاكسي S24 Ultra 256GB",
    "Samsung",
    49990,
    "256 جيجا",
    [
      { label: "الشاشة", value: "6.8 بوصة AMOLED 120Hz" },
      { label: "المعالج", value: "Snapdragon 8 Gen 3" },
      { label: "التخزين", value: "256 جيجا" },
      { label: "الكاميرا الرئيسية", value: "200 ميجا" },
      { label: "البطارية", value: "5000 مللي أمبير" },
    ],
    ["الجيل السابق — غالبًا أوفر من S25"],
  ),
  phone(
    "iphone-16-pro-max-256",
    "آيفون 16 برو ماكس 256GB",
    "Apple",
    72990,
    "256 جيجا",
    [
      { label: "الشاشة", value: "6.9 بوصة Super Retina XDR" },
      { label: "المعالج", value: "A18 Pro" },
      { label: "التخزين", value: "256 جيجا" },
      { label: "الكاميرا", value: "Fusion 48MP" },
      { label: "الشبكة", value: "5G" },
    ],
    ["بديل آبل لفلاجشيب أندرويد في مصر"],
  ),
  phone(
    "xiaomi-15-ultra-512",
    "شاومي 15 Ultra 512GB",
    "Xiaomi",
    54990,
    "512 جيجا",
    [
      { label: "الشاشة", value: "6.73 بوصة AMOLED" },
      { label: "المعالج", value: "Snapdragon 8 Elite" },
      { label: "الكاميرا", value: "Leica-class" },
      { label: "التخزين", value: "512 جيجا" },
    ],
    ["كاميرا قوية بسعر أقل من سامسونج ألترا"],
  ),
  phone(
    "oppo-find-x8-pro",
    "OPPO Find X8 Pro 512GB",
    "OPPO",
    47990,
    "512 جيجا",
    [
      { label: "الشاشة", value: "6.78 بوصة" },
      { label: "المعالج", value: "Dimensity 9400" },
      { label: "التخزين", value: "512 جيجا" },
    ],
    ["فلاجشيب أوبو المتداول أونلاين في مصر"],
  ),
  phone(
    "samsung-a56-256",
    "سامسونج جالاكسي A56 256GB",
    "Samsung",
    18990,
    "256 جيجا",
    [
      { label: "الفئة", value: "فئة وسط" },
      { label: "التخزين", value: "256 جيجا" },
      { label: "الشبكة", value: "5G" },
    ],
    ["أنسب ميزانية من الألترا"],
  ),
  phone(
    "infinix-note-40-pro",
    "إنفينكس نوت 40 برو",
    "Infinix",
    9990,
    "256 جيجا",
    [
      { label: "الشحن", value: "سريع" },
      { label: "التخزين", value: "256 جيجا" },
    ],
    ["فئة شعبية في فروع مصر"],
  ),
];

export const FLAGSHIP_VERSUS: Record<string, string[]> = {
  "samsung-s25-ultra-256": ["samsung-s24-ultra-256", "iphone-16-pro-max-256", "samsung-s25-ultra-512"],
  "samsung-s25-ultra-512": ["samsung-s25-ultra-256", "iphone-16-pro-max-256"],
  "samsung-s24-ultra-256": ["samsung-s25-ultra-256", "iphone-16-pro-max-256"],
  "iphone-16-pro-max-256": ["samsung-s25-ultra-256", "xiaomi-15-ultra-512"],
};
