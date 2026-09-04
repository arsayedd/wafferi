import type { Store } from "./types";
import { egyptChains } from "./egypt-chains";

function shop(
  id: string,
  name: string,
  kind: Store["kind"],
  website: string,
  specialty: string,
  verticals: Store["verticals"],
  skuEstimate: number,
): Store {
  return {
    id,
    name,
    kind,
    city: "مصر / أونلاين",
    website,
    specialty,
    verticals,
    skuEstimate,
    connector: "partnership",
    status: "connected",
    network: "direct",
    commissionNote: "توجيه لبحث المتجر — زي قايمة برايسينا: مش سحب رف حي",
    affiliate: false,
  };
}

const TECH = ["mobile", "computing", "gaming", "av", "small_kitchen"] as const;
const APPL = ["cooling", "laundry", "climate", "cooking", "av", "small_kitchen"] as const;

/** سلاسل ظهرت عند المشترين على برايسينا وغيرها — توجيه بحث، مش كاتالوج مسحوب. */
export const egyptWebstores: Store[] = [
  ...egyptChains,
  shop("orange", "أورنج مصر", "electronics", "https://www.orange.eg", "موبايلات وخطوط وإكسسوار", [...TECH], 6000),
  shop("egypt-gamer", "Egypt Gamer", "electronics", "https://egyptgamer.com", "جيمنج وأجهزة لعب", ["gaming", "computing", "av"], 4000),
  shop("egypt-laptop", "Egypt Laptop", "electronics", "https://egyptlaptop.com", "لابتوب وإكسسوار كمبيوتر", ["computing", "mobile", "gaming"], 5000),
  shop(
    "elgammal",
    "الجمال إلكترونيكس",
    "electronics",
    "https://www.google.com.eg/search?q=elgammalelectronics",
    "أجهزة كهربي وموبايل",
    [...APPL, "mobile"],
    2500,
  ),
  shop("gamerzlounge", "Gamerz Lounge", "electronics", "https://gamerzlounge.com", "جيمنج وملحقات", ["gaming", "computing"], 2000),
  shop("herobaby", "Hero Baby Store", "electronics", "https://www.google.com.eg/search?q=herobabystore+egypt", "مستلزمات أطفال", ["baby"], 1500),
  shop("hubfurniture", "Hub Furniture", "furniture", "https://www.hubfurniture.com.eg", "أثاث ومفروشات", ["furniture", "decor", "textiles"], 8000),
  shop("deeda", "Deeda", "electronics", "https://www.google.com.eg/search?q=deeda+egypt+store", "إلكترونيات", [...TECH], 1200),
  shop("elsayaad", "الصياد", "electronics", "https://www.google.com.eg/search?q=elsayaad+electronics+egypt", "أجهزة كهربي", [...APPL], 2000),
  shop("alaska", "Alaska", "electronics", "https://www.google.com.eg/search?q=alaska+electronics+egypt", "أجهزة", [...APPL], 1500),
  shop("aucpress", "Aucpress", "electronics", "https://www.google.com.eg/search?q=aucpress+egypt", "إلكترونيات", [...TECH], 800),
  shop("frillu", "Frillu", "fashion", "https://www.google.com.eg/search?q=frillu+egypt", "موضة", ["fashion_women", "bags"], 900),
  shop("future-electronics", "Future Electronics", "electronics", "https://www.google.com.eg/search?q=future+electronics+egypt", "إلكترونيات وكمبيوتر", [...TECH, "av"], 3500),
  shop("circuits", "Circuits", "electronics", "https://www.google.com.eg/search?q=circuits+egypt+store", "إلكترونيات", [...TECH], 1000),
  shop("le3ab", "le3ab store", "electronics", "https://www.google.com.eg/search?q=le3ab+store+egypt", "ألعاب وجيمنج", ["gaming", "baby"], 1800),
  shop("americaneagle", "American Eagle", "fashion", "https://www.google.com.eg/search?q=american+eagle+egypt", "لبس", ["fashion_women", "fashion_men", "bags"], 3000),
];
