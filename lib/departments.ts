import type { CategoryId } from "./types";

export type Department = {
  id: string;
  name: string;
  blurb: string;
  categories: CategoryId[];
};

export const departments: Department[] = [
  {
    id: "appliances",
    name: "أجهزة البيت",
    blurb: "تبريد، غسيل، طبخ، تكييف",
    categories: ["fridges", "freezers", "washers", "acs", "fans", "stoves", "dishwashers", "heaters", "water", "vacuums", "small-appliances"],
  },
  {
    id: "tech",
    name: "موبايل وكمبيوتر",
    blurb: "هواتف، لابتوب، شاشات، جيمنج",
    categories: ["phones", "laptops", "tablets", "gaming", "tvs", "audio"],
  },
  {
    id: "home",
    name: "الأثاث والبيت",
    blurb: "غرف، مفروشات، ديكور، حمام",
    categories: ["bedroom", "living", "textiles", "decor", "bathroom", "storage", "kitchen-tools", "accessories", "cleaning"],
  },
  {
    id: "fashion",
    name: "لبس وإكسسوار",
    blurb: "حريمي، رجالي، عرايس، أحذية",
    categories: ["women-wear", "men-wear", "kids-wear", "bridal-wear", "pajamas", "shoes", "bags", "jewelry", "beauty", "personal-care", "travel"],
  },
  {
    id: "life",
    name: "حياة يومية",
    blurb: "بقالة، أطفال، طوارئ، حيوانات",
    categories: ["grocery", "baby", "pets", "emergency"],
  },
  {
    id: "outdoor",
    name: "برّه البيت",
    blurb: "رياضة، سيارات، عدة، حديقة، مكتبيات",
    categories: ["sports", "auto", "tools", "garden", "office"],
  },
];
