export const marketTree = [
  {
    id: "electronics",
    name: "إلكترونيات",
    kids: [
      { id: "tvs", name: "شاشات" },
      { id: "acs", name: "تكييف" },
      { id: "small-appliances", name: "أجهزة صغيرة" },
    ],
  },
  {
    id: "home",
    name: "البيت",
    kids: [
      { id: "washers", name: "غسالات" },
      { id: "fridges", name: "ثلاجات" },
      { id: "stoves", name: "بوتاجازات" },
      { id: "textiles", name: "مفروشات" },
      { id: "bedroom", name: "غرف نوم" },
      { id: "living", name: "صالون" },
    ],
  },
  {
    id: "fashion",
    name: "أزياء",
    kids: [
      { id: "women-wear", name: "حريمي" },
      { id: "men-wear", name: "رجالي" },
      { id: "kids-wear", name: "أطفال" },
    ],
  },
] as const;
