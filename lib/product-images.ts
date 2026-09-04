import type { CategoryId } from "./types";

const CATEGORY_EN: Record<CategoryId, string> = {
  washers: "front load washing machine appliance",
  fridges: "french door refrigerator appliance",
  freezers: "chest freezer appliance",
  acs: "split air conditioner indoor unit",
  fans: "standing pedestal fan",
  stoves: "gas stove oven range",
  dishwashers: "built-in dishwasher",
  vacuums: "cylinder vacuum cleaner",
  heaters: "electric water heater tank",
  water: "water dispenser cooler",
  tvs: "flat screen television",
  audio: "soundbar speaker",
  "small-appliances": "kitchen countertop appliance",
  "personal-care": "hair dryer beauty device",
  bedroom: "wooden bedroom furniture set",
  living: "living room sofa",
  "kitchen-tools": "cookware pot set",
  textiles: "folded towels bedding",
  decor: "home chandelier lighting",
  "women-wear": "women dress on hanger",
  "men-wear": "men galabiya garment",
  "kids-wear": "kids pajamas folded",
  "bridal-wear": "white wedding dress",
  pajamas: "cotton pajamas folded",
  shoes: "bridal slippers shoes",
  bags: "evening clutch bag",
  jewelry: "zircon jewelry set",
  beauty: "perfume bottle",
  accessories: "kitchen linens",
  cleaning: "cleaning mop bucket",
  bathroom: "bathroom accessories set",
  storage: "storage organizer boxes",
  travel: "travel suitcase",
  emergency: "first aid kit box",
  baby: "baby bedding",
};

function seed(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (h >>> 0) % 1_000_000;
}

/** Unique studio-style photo per product name — not one generic category stock image. */
export function productImage(id: string, category: CategoryId, name = "") {
  const kind = CATEGORY_EN[category] ?? "home product";
  const prompt = [
    "photorealistic catalog product photo",
    name || id.replace(/-/g, " "),
    kind,
    "studio lighting",
    "clean white background",
    "single product only",
    "no people",
    "no watermark",
    "e-commerce listing",
  ].join(", ");
  const params = new URLSearchParams({
    width: "900",
    height: "675",
    nologo: "true",
    seed: String(seed(id)),
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

export function productImageFallback(id: string, category: CategoryId) {
  const kind = encodeURIComponent(CATEGORY_EN[category] ?? "product");
  return `https://loremflickr.com/900/675/${kind}/all?lock=${seed(id)}`;
}
