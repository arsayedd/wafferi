import type { CategoryId } from "./types";

const byCategory: Record<CategoryId, string> = {
  washers:
    "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=900&q=80",
  fridges:
    "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=900&q=80",
  freezers:
    "https://images.unsplash.com/photo-1571175443880-49e1c26b8755?auto=format&fit=crop&w=900&q=80",
  acs: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=900&q=80",
  fans: "https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?auto=format&fit=crop&w=900&q=80",
  stoves:
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
  dishwashers:
    "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?auto=format&fit=crop&w=900&q=80",
  vacuums:
    "https://images.unsplash.com/photo-1558317374-058fb54a0b0b?auto=format&fit=crop&w=900&q=80",
  heaters:
    "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=80",
  water:
    "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=900&q=80",
  tvs: "https://images.unsplash.com/photo-1593359677879-a4bb92f829ef?auto=format&fit=crop&w=900&q=80",
  audio:
    "https://images.unsplash.com/photo-1545454675-3538b25d5d0c?auto=format&fit=crop&w=900&q=80",
  "small-appliances":
    "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=900&q=80",
  "personal-care":
    "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=900&q=80",
  bedroom:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  living:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  "kitchen-tools":
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
  textiles:
    "https://images.unsplash.com/photo-1582735689369-4fe89db71132?auto=format&fit=crop&w=900&q=80",
  decor:
    "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=900&q=80",
  "women-wear":
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  "men-wear":
    "https://images.unsplash.com/photo-1490578474895-aec7c82d818b?auto=format&fit=crop&w=900&q=80",
  "kids-wear":
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
  "bridal-wear":
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  pajamas:
    "https://images.unsplash.com/photo-1617331721439-c4ae9d6d0d0d?auto=format&fit=crop&w=900&q=80",
  shoes:
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80",
  bags: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
  jewelry:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
  beauty:
    "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
  accessories:
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
};

const byProduct: Record<string, string> = {
  "lg-washer-8": byCategory.washers,
  "lg-washer-10": byCategory.washers,
  "beko-washer-7": byCategory.washers,
  "toshiba-fridge-16": byCategory.fridges,
  "samsung-fridge-18": byCategory.fridges,
  "fresh-freezer-5": byCategory.freezers,
  "sharp-ac-15": byCategory.acs,
  "carrier-ac-225": byCategory.acs,
  "gree-ac-15": byCategory.acs,
  "unionaire-stove": byCategory.stoves,
  "bosch-dishwasher": byCategory.dishwashers,
  "hoover-vacuum": byCategory.vacuums,
  "robot-vacuum-tuya":
    "https://images.unsplash.com/photo-1603618090561-412154b4bd12?auto=format&fit=crop&w=900&q=80",
  "fresh-heater": byCategory.heaters,
  "water-dispenser-fresh": byCategory.water,
  "lg-tv-55": byCategory.tvs,
  "samsung-soundbar": byCategory.audio,
  "kenwood-mixer": byCategory["small-appliances"],
  "braun-mixer": byCategory["small-appliances"],
  "toshiba-microwave":
    "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=900&q=80",
  "tefal-iron":
    "https://images.unsplash.com/photo-1517677208171-0ec0d10187d6?auto=format&fit=crop&w=900&q=80",
  "philips-airfryer":
    "https://images.unsplash.com/photo-1615368144592-283c58987d5d?auto=format&fit=crop&w=900&q=80",
  "kettle-kenwood":
    "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=900&q=80",
  "tornado-fan-18": byCategory.fans,
  "remington-dryer": byCategory["personal-care"],
  "bedroom-oak": byCategory.bedroom,
  "velvet-sofa": byCategory.living,
  "dining-6":
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
  "tefal-pots": byCategory["kitchen-tools"],
  "cotton-duvet":
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80",
  "towel-set": byCategory.textiles,
  "crystal-chandelier": byCategory.decor,
  "bridal-dress": byCategory["bridal-wear"],
  "bridal-abaya": byCategory["bridal-wear"],
  "cotton-pajamas": byCategory.pajamas,
  "kids-pajamas": byCategory["kids-wear"],
  "women-galabiya": byCategory["women-wear"],
  "men-galabiya": byCategory["men-wear"],
  "bride-slippers": byCategory.shoes,
  "evening-bag": byCategory.bags,
  "zircon-set": byCategory.jewelry,
  "lattafa-perfume": byCategory.beauty,
  "bath-towels-8": byCategory.textiles,
  "kitchen-linens": byCategory.accessories,
};

export function productImage(id: string, category: CategoryId) {
  return byProduct[id] ?? byCategory[category];
}
