import type { CategoryId, Product } from "./types";
import { makeSku } from "./sku-factory";

function item(
  id: string,
  name: string,
  brand: string,
  category: CategoryId,
  price: number,
  hint: string,
  extra: { model: string; capacity: string; specs?: { label: string; value: string }[] },
): Product {
  const base = makeSku(id, name, brand, category, price, hint);
  return {
    ...base,
    model: extra.model,
    capacity: extra.capacity,
    specs: extra.specs ?? [
      { label: "السعة", value: extra.capacity },
      { label: "البراند", value: brand },
    ],
  };
}

const fridgeBrands = [
  { brand: "توشيبا", slug: "toshiba", base: 15200 },
  { brand: "Samsung", slug: "samsung", base: 19800 },
  { brand: "LG", slug: "lg", base: 20500 },
  { brand: "فريش", slug: "fresh", base: 12800 },
  { brand: "كريازي", slug: "kiriazi", base: 13400 },
  { brand: "بيكو", slug: "beko", base: 17600 },
  { brand: "وايت ويل", slug: "whitewhale", base: 11900 },
  { brand: "شارب", slug: "sharp", base: 18800 },
  { brand: "يونيون إير", slug: "unionaire", base: 14100 },
  { brand: "زانوسي", slug: "zanussi", base: 16900 },
  { brand: "هوفر", slug: "hoover", base: 17200 },
  { brand: "هاير", slug: "haier", base: 16100 },
  { brand: "ميديا", slug: "midea", base: 14800 },
  { brand: "تورنيدو", slug: "tornado", base: 12500 },
];

const fridgeSizes = [
  { ft: 9, add: 0 },
  { ft: 12, add: 2200 },
  { ft: 14, add: 3800 },
  { ft: 16, add: 5600 },
  { ft: 18, add: 8200 },
  { ft: 20, add: 11800 },
  { ft: 22, add: 15500 },
];

function fridges(): Product[] {
  const out: Product[] = [];
  for (const b of fridgeBrands) {
    for (const s of fridgeSizes) {
      if (b.slug === "toshiba" && s.ft === 16) continue;
      if (b.slug === "samsung" && s.ft === 18) continue;
      const id = `mk-fr-${b.slug}-${s.ft}`;
      const kind = s.ft >= 20 ? "4 باب نوفروست" : "نوفروست 2 باب";
      out.push(
        item(
          id,
          `ثلاجة ${b.brand} ${kind} ${s.ft} قدم`,
          b.brand,
          "fridges",
          b.base + s.add,
          `${s.ft} قدم للعيلة`,
          {
            model: `${b.slug.toUpperCase()}-RF${s.ft}`,
            capacity: `${s.ft} قدم`,
            specs: [
              { label: "السعة", value: `${s.ft} قدم` },
              { label: "النوع", value: kind },
              { label: "التصنيف", value: "نوفروست" },
            ],
          },
        ),
      );
    }
  }
  return out;
}

const washerBrands = [
  { brand: "LG", slug: "lg", base: 16400 },
  { brand: "Samsung", slug: "samsung", base: 15800 },
  { brand: "بيكو", slug: "beko", base: 7200 },
  { brand: "فريش", slug: "fresh", base: 6800 },
  { brand: "توشيبا", slug: "toshiba", base: 11200 },
  { brand: "كريازي", slug: "kiriazi", base: 7900 },
  { brand: "هوفر", slug: "hoover", base: 12100 },
  { brand: "زانوسي", slug: "zanussi", base: 11800 },
  { brand: "وايت ويل", slug: "whitewhale", base: 6400 },
  { brand: "هاير", slug: "haier", base: 9900 },
];

function washers(): Product[] {
  const out: Product[] = [];
  const kgs = [6, 7, 8, 9, 10, 11, 12];
  for (const b of washerBrands) {
    for (const kg of kgs) {
      if (b.slug === "lg" && (kg === 8 || kg === 10)) continue;
      if (b.slug === "beko" && kg === 7) continue;
      const front = kg >= 8 && b.slug !== "fresh" && b.slug !== "whitewhale";
      const type = front ? "فول أوتوماتيك أمامي" : "فوق أوتوماتيك";
      out.push(
        item(
          `mk-ws-${b.slug}-${kg}`,
          `غسالة ${b.brand} ${type} ${kg} كيلو`,
          b.brand,
          "washers",
          b.base + (kg - 6) * 2200,
          `${kg} كجم`,
          {
            model: `${b.slug.toUpperCase()}-W${kg}`,
            capacity: `${kg} كجم`,
            specs: [
              { label: "السعة", value: `${kg} كجم` },
              { label: "النوع", value: type },
            ],
          },
        ),
      );
    }
  }
  return out;
}

const acBrands = [
  { brand: "شارب", slug: "sharp", base: 14800 },
  { brand: "كاريير", slug: "carrier", base: 17200 },
  { brand: "جري", slug: "gree", base: 11900 },
  { brand: "يونيون إير", slug: "unionaire", base: 12400 },
  { brand: "LG", slug: "lg", base: 18900 },
  { brand: "Samsung", slug: "samsung", base: 19200 },
  { brand: "ميديا", slug: "midea", base: 13100 },
  { brand: "فريش", slug: "fresh", base: 10800 },
  { brand: "تورنيدو", slug: "tornado", base: 9900 },
];

function acs(): Product[] {
  const out: Product[] = [];
  const powers = [
    { hp: "1.5", add: 0 },
    { hp: "2.25", add: 6200 },
    { hp: "3", add: 11000 },
  ];
  for (const b of acBrands) {
    for (const p of powers) {
      if (b.slug === "sharp" && p.hp === "1.5") continue;
      if (b.slug === "carrier" && p.hp === "2.25") continue;
      if (b.slug === "gree" && p.hp === "1.5") continue;
      out.push(
        item(
          `mk-ac-${b.slug}-${p.hp.replace(".", "")}`,
          `مكيف ${b.brand} ${p.hp} حصان إنفرتر حار/بارد`,
          b.brand,
          "acs",
          b.base + p.add,
          `${p.hp} حصان`,
          {
            model: `${b.slug.toUpperCase()}-AC${p.hp.replace(".", "")}`,
            capacity: `${p.hp} حصان`,
            specs: [
              { label: "القدرة", value: `${p.hp} حصان` },
              { label: "النوع", value: "إنفرتر حار / بارد" },
            ],
          },
        ),
      );
    }
  }
  return out;
}

function moreHome(): Product[] {
  const rows: Parameters<typeof item>[] = [
    ["mk-fz-fresh-7", "ديب فريزر فريش 7 درج", "فريش", "freezers", 13400, "7 أدراج", { model: "FDF-7D", capacity: "7 أدراج" }],
    ["mk-fz-kiriazi-5", "ديب فريزر كريازي 5 درج", "كريازي", "freezers", 11800, "5 أدراج", { model: "KDF-5", capacity: "5 أدراج" }],
    ["mk-fz-ww-chest", "ديب فريزر وايت ويل أفقي 300 لتر", "وايت ويل", "freezers", 9900, "أفقي", { model: "WW-CF300", capacity: "300 لتر" }],
    ["mk-fz-toshiba-6", "ديب فريزر توشيبا 6 درج", "توشيبا", "freezers", 15200, "6 أدراج", { model: "GR-FZ6", capacity: "6 أدراج" }],
    ["mk-fz-beko-5", "ديب فريزر بيكو 5 درج", "بيكو", "freezers", 14100, "5 أدراج", { model: "BDF-5", capacity: "5 أدراج" }],
    ["mk-st-fresh-5", "بوتاجاز فريش 5 شعلة", "فريش", "stoves", 6200, "5 شعلة", { model: "FST-5", capacity: "5 شعلة" }],
    ["mk-st-kiriazi-5", "بوتاجاز كريازي 5 شعلة استانلس", "كريازي", "stoves", 7100, "5 شعلة", { model: "KST-5", capacity: "5 شعلة" }],
    ["mk-st-universal-4", "بوتاجاز يونيفرسال 4 شعلة", "يونيفرسال", "stoves", 4800, "4 شعلة", { model: "UST-4", capacity: "4 شعلة" }],
    ["mk-st-elba-90", "بوتاجاز إلبا 90 سم بلت إن", "إلبا", "stoves", 18900, "بلت إن", { model: "ELBA-90", capacity: "90 سم" }],
    ["mk-st-gorenje-60", "فرن جورينيا بلت إن 60 سم", "جورينيا", "stoves", 16400, "بلت إن", { model: "GO-OV60", capacity: "60 سم" }],
    ["mk-dw-beko-13", "غسالة أطباق بيكو 13 فرد", "بيكو", "dishwashers", 18900, "13 فرد", { model: "BDW-13", capacity: "13 فرد" }],
    ["mk-dw-fresh-12", "غسالة أطباق فريش 12 فرد", "فريش", "dishwashers", 14200, "12 فرد", { model: "FDW-12", capacity: "12 فرد" }],
    ["mk-dw-lg-14", "غسالة أطباق إل جي 14 فرد", "LG", "dishwashers", 22800, "14 فرد", { model: "LG-DW14", capacity: "14 فرد" }],
    ["mk-tv-samsung-43", "شاشة سامسونج 43 بوصة 4K", "Samsung", "tvs", 11200, "43 بوصة", { model: "UA43", capacity: "43 بوصة" }],
    ["mk-tv-samsung-65", "شاشة سامسونج 65 بوصة 4K", "Samsung", "tvs", 24900, "65 بوصة", { model: "UA65", capacity: "65 بوصة" }],
    ["mk-tv-lg-43", "شاشة إل جي 43 بوصة", "LG", "tvs", 10800, "43 بوصة", { model: "43UQ", capacity: "43 بوصة" }],
    ["mk-tv-lg-65", "شاشة إل جي 65 بوصة OLED", "LG", "tvs", 38900, "65 بوصة", { model: "65C3", capacity: "65 بوصة" }],
    ["mk-tv-toshiba-50", "شاشة توشيبا 50 بوصة", "توشيبا", "tvs", 12100, "50 بوصة", { model: "50V35", capacity: "50 بوصة" }],
    ["mk-tv-fresh-55", "شاشة فريش 55 بوصة", "فريش", "tvs", 8900, "55 بوصة", { model: "FR-55", capacity: "55 بوصة" }],
    ["mk-fan-tornado-16", "مروحة تورنيدو 16 بوصة", "تورنيدو", "fans", 890, "16 بوصة", { model: "TF-16", capacity: "16 بوصة" }],
    ["mk-fan-fresh-18", "مروحة فريش 18 بوصة", "فريش", "fans", 720, "18 بوصة", { model: "FF-18", capacity: "18 بوصة" }],
    ["mk-fan-ata-20", "مروحة آتا 20 بوصة", "آتا", "fans", 650, "20 بوصة", { model: "ATA-20", capacity: "20 بوصة" }],
    ["mk-ht-fresh-6", "سخان فريش غاز 6 لتر", "فريش", "heaters", 2190, "6 لتر", { model: "GWH6", capacity: "6 لتر" }],
    ["mk-ht-olympic-10", "سخان أوليمبيك 10 لتر", "أوليمبيك", "heaters", 2680, "10 لتر", { model: "OL-10", capacity: "10 لتر" }],
    ["mk-ht-ariston-50", "سخان أريستون كهربا 50 لتر", "أريستون", "heaters", 4290, "50 لتر", { model: "AR-50", capacity: "50 لتر" }],
    ["mk-wd-fresh-hot", "مبرد مياه فريش حار وبارد", "فريش", "water", 1890, "حار/بارد", { model: "FWD-HB", capacity: "حار وبارد" }],
    ["mk-wd-tornado", "مبرد مياه تورنيدو", "تورنيدو", "water", 1650, "بارد", { model: "TWD", capacity: "بارد" }],
    ["mk-vc-lg-cord", "مكنسة إل جي بدون كيس", "LG", "vacuums", 3890, "بدون كيس", { model: "LG-VC", capacity: "2000 وات" }],
    ["mk-vc-fresh", "مكنسة فريش 1800 وات", "فريش", "vacuums", 1290, "1800 وات", { model: "FVC-18", capacity: "1800 وات" }],
    ["mk-mx-toshiba", "خلاط توشيبا 1.5 لتر", "توشيبا", "small-appliances", 1890, "زجاج", { model: "BL-TOS", capacity: "1.5 لتر" }],
    ["mk-mx-fresh", "خلاط فريش 400 وات", "فريش", "small-appliances", 690, "يومي", { model: "FBL-400", capacity: "1.2 لتر" }],
    ["mk-af-fresh", "قلاية هوائية فريش 4.5 لتر", "فريش", "small-appliances", 2190, "4.5 لتر", { model: "FAF-45", capacity: "4.5 لتر" }],
    ["mk-mw-lg", "ميكروويف إل جي 25 لتر", "LG", "small-appliances", 3890, "25 لتر", { model: "MS253", capacity: "25 لتر" }],
    ["mk-mw-fresh", "ميكروويف فريش 20 لتر", "فريش", "small-appliances", 1690, "20 لتر", { model: "FMW-20", capacity: "20 لتر" }],
    ["mk-ir-philips", "مكواة فيليبس بخار", "فيليبس", "small-appliances", 1290, "بخار", { model: "GC2145", capacity: "2200 وات" }],
    ["mk-kt-tornado", "كتل تورنيدو 1.7 لتر", "تورنيدو", "small-appliances", 390, "1.7 لتر", { model: "TK-17", capacity: "1.7 لتر" }],
  ];
  return rows.map((r) => item(...r));
}

export const marketCatalog: Product[] = [...fridges(), ...washers(), ...acs(), ...moreHome()];
