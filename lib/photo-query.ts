import type { CategoryId } from "./types";

const CATEGORY_EN: Record<CategoryId, string> = {
  washers: "front load washing machine",
  fridges: "refrigerator fridge",
  freezers: "chest freezer",
  acs: "split air conditioner indoor unit",
  fans: "pedestal standing fan",
  stoves: "gas range cooker stove",
  dishwashers: "built-in dishwasher",
  vacuums: "vacuum cleaner",
  heaters: "gas water heater",
  water: "water dispenser cooler",
  tvs: "LED television",
  audio: "soundbar speaker",
  "small-appliances": "kitchen appliance",
  "personal-care": "hair dryer",
  bedroom: "bedroom furniture set",
  living: "sofa living room",
  "kitchen-tools": "cookware",
  textiles: "towels bedding",
  decor: "chandelier lighting",
  "women-wear": "women cotton galabiya dress",
  "men-wear": "men galabiya",
  "kids-wear": "kids pajamas",
  "bridal-wear": "wedding dress",
  pajamas: "cotton pajamas",
  shoes: "satin slippers",
  bags: "evening clutch bag",
  jewelry: "zircon jewelry set",
  beauty: "perfume bottle",
  accessories: "kitchen towel apron",
  cleaning: "mop bucket",
  bathroom: "bath towels",
  storage: "storage boxes organizer",
  travel: "suitcase luggage",
  emergency: "first aid kit",
  baby: "baby bedding",
  phones: "smartphone mobile phone",
  laptops: "laptop notebook computer",
  tablets: "android tablet",
  gaming: "game console controller",
  grocery: "grocery food pantry",
  sports: "sports equipment",
  auto: "car accessories",
  tools: "power drill tools",
  pets: "pet food cat",
  office: "office stationery",
  garden: "garden plant pot",
};

const BRAND_EN: Record<string, string> = {
  توشيبا: "Toshiba",
  شارب: "Sharp",
  كاريير: "Carrier",
  جري: "Gree",
  "يونيون إير": "Unionaire",
  بوش: "Bosch",
  بيكو: "Beko",
  هوفر: "Hoover",
  فريش: "Fresh",
  كينوود: "Kenwood",
  براون: "Braun",
  تيفال: "Tefal",
  فيليبس: "Philips",
  تورنيدو: "Tornado",
  ريمنجتون: "Remington",
  لطافة: "Lattafa",
  ايكيا: "IKEA",
  كوتونيل: "Cottonil",
  ديفاكتو: "DeFacto",
  هومزمارت: "wooden furniture",
};

export function commonsPhotoQuery(input: {
  brand: string;
  name: string;
  model?: string;
  category: CategoryId;
}) {
  const brand = BRAND_EN[input.brand] ?? (/^[A-Za-z]/.test(input.brand) ? input.brand : "");
  const kind = CATEGORY_EN[input.category] ?? "home product";
  // Model numbers (F4V5RYP0T, BR-K-PANS) almost never have Commons files and
  // push search toward logos/PDFs. Search the actual product type instead.
  return [brand, kind].filter(Boolean).join(" ").trim();
}

export function photoOffset(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (h >>> 0) % 12;
}
