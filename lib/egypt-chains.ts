import type { Store } from "./types";

function chain(
  id: string,
  name: string,
  kind: Store["kind"],
  website: string,
  specialty: string,
  city: string,
  skuEstimate: number,
  verticals: Store["verticals"],
): Store {
  return {
    id,
    name,
    kind,
    city,
    website,
    specialty,
    verticals,
    skuEstimate,
    connector: "partnership",
    status: "connected",
    network: "direct",
    commissionNote: "توجيه لبحث المتجر — الأسعار المرجعية مش مخزون مسحوب",
    affiliate: false,
  };
}

/** سلاسل مصرية حقيقية ناقصة من الكتالوج الأساسي (رنين موجود في network.ts). */
export const egyptChains: Store[] = [
  chain(
    "alreyada",
    "الريادة ستور",
    "electronics",
    "https://alreyadastore.com",
    "أجهزة بلت إن ومطبخ: فرن، شفاط، مسطح، غسالة أطباق",
    "مدينة نصر / أونلاين",
    4000,
    ["cooking", "small_kitchen", "cooling", "laundry"],
  ),
  chain(
    "fathalla",
    "فتح الله",
    "hypermarket",
    "https://www.fathalla.com",
    "هايبر: بقالة، أدوات منزل، أجهزة صغيرة",
    "فروع الدلتا والقاهرة",
    8000,
    ["small_kitchen", "cleaning", "textiles", "accessories", "bathroom"],
  ),
  chain(
    "awladragab",
    "أولاد رجب",
    "hypermarket",
    "https://www.awlad-ragab.com",
    "سوبرماركت وأدوات منزل بأسعار شعبية",
    "فروع مصر",
    5000,
    ["small_kitchen", "cleaning", "accessories", "textiles"],
  ),
  chain(
    "binaa",
    "بناء",
    "hypermarket",
    "https://www.binaa.com.eg",
    "تخفيضات منزل وأجهزة صغيرة",
    "فروع",
    3500,
    ["small_kitchen", "cleaning", "textiles", "accessories"],
  ),
  chain(
    "palacio",
    "بالاسيو",
    "furniture",
    "https://www.palacio-eg.com",
    "أثاث ومفروشات وإكسسوار بيت",
    "مولات",
    6000,
    ["furniture", "textiles", "decor"],
  ),
];
