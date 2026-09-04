export type NamedSupplier = {
  id: string;
  name: string;
  channel: "online" | "wholesale" | "factory" | "retail";
  region: string;
  address?: string;
  phone?: string;
  website?: string;
  facebook?: string;
  categories: string[];
  products: string[];
  wholesale: boolean;
  ships?: boolean;
  feed?: boolean;
  notes: string;
  areaId?: string;
};

/** عيّنة موردين بأسماء وعناوين معلنة — نواة قاعدة sourcing مش ألف تاجر وهمي. */
export const namedSuppliers: NamedSupplier[] = [
  {
    id: "elshams-hammam",
    name: "شركة الشمس للأدوات المنزلية",
    channel: "wholesale",
    region: "القاهرة",
    address: "8/7 قبوة الزينة، حمام التلات، الموسكي — العتبة",
    phone: "+20225909921",
    facebook: "https://www.facebook.com/Elshams.Company/",
    categories: ["kitchen", "housewares"],
    products: ["أدوات منزلية", "حلل", "تقديم"],
    wholesale: true,
    notes: "جملة حمام التلات.",
    areaId: "hammam-tlat",
  },
  {
    id: "kitchen-dokki",
    name: "Kitchen Store",
    channel: "retail",
    region: "الجيزة",
    address: "75 مصدق، الدقي",
    phone: "+201009769488",
    categories: ["kitchen"],
    products: ["مستلزمات مطبخ"],
    wholesale: false,
    notes: "مستوى أعلى من جملة الجمالية.",
    areaId: "dokki",
  },
  {
    id: "home-touch",
    name: "Home Touch",
    channel: "retail",
    region: "القاهرة",
    address: "15 طه حسين، الزمالك",
    phone: "+20227371488",
    categories: ["kitchen", "decor"],
    products: ["مطبخ", "تقديم"],
    wholesale: false,
    notes: "بريميوم الزمالك.",
    areaId: "zamalek",
  },
  {
    id: "konouz-damietta",
    name: "كنوز أرت للأثاث",
    channel: "factory",
    region: "دمياط",
    address: "طريق دمياط",
    phone: "+201068880006",
    website: "http://www.konouzfurniture.com",
    categories: ["furniture"],
    products: ["غرف نوم", "صالون"],
    wholesale: true,
    notes: "مصنع/شووروم دمياط.",
    areaId: "damietta",
  },
  {
    id: "teakia-damietta",
    name: "قلعة أثاث دمياط",
    channel: "factory",
    region: "دمياط",
    website: "http://www.teakia.com",
    phone: "+201061333426",
    categories: ["furniture"],
    products: ["أثاث"],
    wholesale: true,
    notes: "مدينة الأثاث.",
    areaId: "damietta",
  },
  {
    id: "efc-obour",
    name: "Egypt Fashion Center",
    channel: "wholesale",
    region: "العبور",
    address: "شارع 110، العبور",
    phone: "+201275188000",
    website: "https://efc.center",
    categories: ["fashion"],
    products: ["لبس جملة"],
    wholesale: true,
    notes: "جملة ملابس بدل الريتيل.",
    areaId: "obour",
  },
  {
    id: "arousa-kasr",
    name: "محلات العروسة",
    channel: "wholesale",
    region: "القاهرة",
    address: "21 قصر النيل",
    phone: "+20223938690",
    facebook: "https://www.facebook.com/profile.php?id=100014870358835",
    categories: ["fashion"],
    products: ["لبس", "إكسسوار"],
    wholesale: true,
    notes: "وسط البلد.",
    areaId: "kasr-nile",
  },
  {
    id: "asly-abdeen",
    name: "عبايات الأصلي",
    channel: "wholesale",
    region: "القاهرة",
    address: "7 الجيش، عابدين",
    phone: "+201225931328",
    categories: ["fashion"],
    products: ["عبايات جملة"],
    wholesale: true,
    notes: "عابدين.",
    areaId: "abdeen",
  },
  {
    id: "cairosales-named",
    name: "أسواق القاهرة للمبيعات",
    channel: "retail",
    region: "الجيزة",
    address: "86 شهاب، المهندسين",
    phone: "+20233022208",
    website: "https://cairosales.com",
    categories: ["appliances"],
    products: ["أجهزة"],
    wholesale: false,
    ships: true,
    notes: "سلسلة أجهزة — مقارنة مع عبدالعزيز.",
    areaId: "abdelaziz",
  },
];
