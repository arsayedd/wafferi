import type {
  Brand,
  Category,
  ChecklistTemplate,
  Product,
} from "./types";
import { hydrateVirtual } from "./virtual-catalog";
import { extraProducts } from "./extra-products";
import { flagshipTech } from "./flagship-tech";
import { lifeProducts } from "./life-products";
import { marketCatalog } from "./market-catalog";
import { brideProducts, commercialBundles } from "./bride-guide";
import { expandNetworkListings } from "./expand-listings";
import { listingHref, isEgyptSeller, getNetworkStore, brandShopFits, canShopOut } from "./store-link";
import { shopQueryFromProduct } from "./shop-query";
import { stores } from "./network";

export { stores } from "./network";

export const categories: Category[] = [
  { id: "washers", name: "غسالات", description: "أوتوماتيك حسب السعة والعيلة", room: "kitchen", vertical: "laundry" },
  { id: "fridges", name: "ثلاجات", description: "نوفروست بمقاسات القدم", room: "kitchen", vertical: "cooling" },
  { id: "freezers", name: "ديب فريزر", description: "حفظ اللحمة والخضار للعيلة", room: "kitchen", vertical: "cooling" },
  { id: "acs", name: "مكيفات", description: "تبريد وإنفرتر حسب الحصان", room: "general", vertical: "climate" },
  { id: "fans", name: "مراوح", description: "عمود وحائط وسقف", room: "general", vertical: "climate" },
  { id: "stoves", name: "بوتاجازات", description: "غاز وكهرباء بأسطح استانلس", room: "kitchen", vertical: "cooking" },
  { id: "dishwashers", name: "غسالات أطباق", description: "توفير مية ووقت في المطبخ", room: "kitchen", vertical: "cooking" },
  { id: "vacuums", name: "مكانس", description: "عادية وروبوت", room: "general", vertical: "cleaning" },
  { id: "heaters", name: "سخانات", description: "غاز وكهرباء حسب عدد الأفراد", room: "kitchen", vertical: "water_heat" },
  { id: "water", name: "مياه وفلاتر", description: "مبردات وفلاتر شرب", room: "kitchen", vertical: "water_heat" },
  { id: "tvs", name: "شاشات", description: "للصالون وغرفة النوم", room: "living", vertical: "av" },
  { id: "audio", name: "صوتيات", description: "ساوند بار وسماعات", room: "living", vertical: "av" },
  { id: "small-appliances", name: "أجهزة صغيرة", description: "خلاطات، قلايات، كتل، ميكروويف", room: "kitchen", vertical: "small_kitchen" },
  { id: "personal-care", name: "عناية شخصية", description: "سشوار، مكواة شعر، أجهزة يومية", room: "general", vertical: "personal_care" },
  { id: "bedroom", name: "غرف نوم", description: "سرير، دولاب، تسريحة", room: "bedroom", vertical: "furniture" },
  { id: "living", name: "صالون وسفرة", description: "كنب، ترابيزات، كراسي", room: "living", vertical: "furniture" },
  { id: "kitchen-tools", name: "أدوات مطبخ", description: "طقم حلل، سكاكين، أواني", room: "kitchen", vertical: "small_kitchen" },
  { id: "textiles", name: "مفروشات وفوط", description: "لحاف، مناشف، فوط حمام، ستائر", room: "bedroom", vertical: "textiles" },
  { id: "decor", name: "ديكور وإضاءة", description: "نجف، مرايا، إكسسوار البيت", room: "living", vertical: "decor" },
  { id: "women-wear", name: "لبس حريمي", description: "جلابيات، عبايات، خروج", room: "general", vertical: "fashion_women" },
  { id: "men-wear", name: "لبس رجالي", description: "جلابيات وملابس يومية", room: "general", vertical: "fashion_men" },
  { id: "kids-wear", name: "لبس أطفال", description: "بيجامات وملابس المدارس", room: "general", vertical: "fashion_kids" },
  { id: "bridal-wear", name: "لبس العرايس", description: "فستان، عباية كتب الكتاب، إكسسوار", room: "general", vertical: "bridal" },
  { id: "pajamas", name: "بيجامات", description: "قطن ومنزلي للعروسين", room: "bedroom", vertical: "sleepwear" },
  { id: "shoes", name: "أحذية وشباشب", description: "خروج وقاعة وعروسة", room: "general", vertical: "shoes" },
  { id: "bags", name: "شنط", description: "يد، كلتش، سفر", room: "general", vertical: "bags" },
  { id: "jewelry", name: "إكسسوار", description: "طقم زركون وحلق وسلاسل", room: "general", vertical: "jewelry" },
  { id: "beauty", name: "عطور وتجميل", description: "عطر، مكياج، عناية", room: "general", vertical: "beauty" },
  { id: "accessories", name: "رفايع البيت", description: "فوط مطبخ، مريلة، حاجات صغيرة", room: "kitchen", vertical: "accessories" },
  { id: "cleaning", name: "تنظيف", description: "مقشات، ممسحات، منظفات، فوط", room: "general", vertical: "cleaning" },
  { id: "bathroom", name: "الحمام", description: "ستائر، دواسات، إكسسوار حمام", room: "general", vertical: "bathroom" },
  { id: "storage", name: "تخزين وتنظيم", description: "منظمات أدراج ودولاب وصناديق", room: "general", vertical: "storage" },
  { id: "travel", name: "سفر وشهر العسل", description: "شنط، منظمات سفر، باسبور هولدر", room: "general", vertical: "travel" },
  { id: "emergency", name: "طوارئ وإسعاف", description: "بوكس إسعافات وعدة صغيرة", room: "general", vertical: "emergency" },
  { id: "baby", name: "مستقبل الأطفال", description: "ملايات وفوط ومنظمات ممكن تتجاب بدري", room: "general", vertical: "baby" },
  { id: "phones", name: "موبايلات", description: "أندرويد وآيفون حسب المساحة والشبكة", room: "general", vertical: "mobile" },
  { id: "laptops", name: "لابتوبات", description: "دراسة، شغل، جيمنج حسب الرامة والشاشة", room: "general", vertical: "computing" },
  { id: "tablets", name: "تابلت", description: "شاشات لمس ودراسة", room: "general", vertical: "mobile" },
  { id: "gaming", name: "جيمنج", description: "بلايستيشن، إكس بوكس، إكسسوار لعب", room: "general", vertical: "gaming" },
  { id: "grocery", name: "بقالة وطعام", description: "زيت، أرز، علب، مشروبات للجهاز والبيت", room: "kitchen", vertical: "grocery" },
  { id: "sports", name: "رياضة", description: "أحذية جري، أوزان، بساط يوجا", room: "general", vertical: "sports" },
  { id: "auto", name: "سيارات", description: "إكسسوار عربيات وزيوت وعناية", room: "general", vertical: "auto" },
  { id: "tools", name: "عدد وأدوات", description: "شنيور، عدة بيت، قياس", room: "general", vertical: "tools" },
  { id: "pets", name: "حيوانات أليفة", description: "أكل، رمل، ألعاب قطط وكلاب", room: "general", vertical: "pets" },
  { id: "office", name: "مكتبيات", description: "ورق، أحبار، كراسي مكتب", room: "general", vertical: "office" },
  { id: "garden", name: "حديقة وبلكونة", description: "زرع، ري، إضاءة خارج", room: "general", vertical: "garden" },
];

export const brands: Brand[] = [
  { id: "lg", name: "LG", origin: "كوريا" },
  { id: "samsung", name: "Samsung", origin: "كوريا" },
  { id: "toshiba", name: "توشيبا", origin: "مصر / اليابان" },
  { id: "sharp", name: "شارب", origin: "اليابان" },
  { id: "bosch", name: "بوش", origin: "ألمانيا" },
  { id: "carrier", name: "كاريير", origin: "أمريكا" },
  { id: "unionaire", name: "يونيون إير", origin: "مصر" },
  { id: "hoover", name: "هوفر", origin: "إيطاليا" },
  { id: "fresh", name: "فريش", origin: "مصر" },
  { id: "kenwood", name: "كينوود", origin: "بريطانيا" },
  { id: "tefal", name: "تيفال", origin: "فرنسا" },
  { id: "braun", name: "براون", origin: "ألمانيا" },
  { id: "beko", name: "بيكو", origin: "تركيا" },
  { id: "gree", name: "جري", origin: "الصين" },
  { id: "ikea", name: "ايكيا", origin: "السويد" },
  { id: "philips", name: "فيليبس", origin: "هولندا" },
  { id: "xiaomi", name: "Xiaomi", origin: "الصين" },
  { id: "apple", name: "Apple", origin: "أمريكا" },
  { id: "oppo", name: "OPPO", origin: "الصين" },
  { id: "realme", name: "realme", origin: "الصين" },
  { id: "infinix", name: "Infinix", origin: "الصين" },
  { id: "hp", name: "HP", origin: "أمريكا" },
  { id: "dell", name: "Dell", origin: "أمريكا" },
  { id: "lenovo", name: "Lenovo", origin: "الصين" },
  { id: "asus", name: "ASUS", origin: "تايوان" },
  { id: "remington", name: "ريمنجتون", origin: "أمريكا" },
  { id: "tornado", name: "تورنيدو", origin: "مصر" },
  { id: "defacto", name: "ديفاكتو", origin: "تركيا" },
  { id: "cottonil", name: "كوتونيل", origin: "مصر" },
  { id: "lattafa", name: "لطافة", origin: "الإمارات" },
  { id: "luminarc", name: "لومينارك", origin: "فرنسا" },
  { id: "nivea", name: "نيفيا", origin: "ألمانيا" },
  { id: "loreal", name: "لوريال", origin: "فرنسا" },
  { id: "anker", name: "أنكر", origin: "الصين" },
];

function listing(
  storeId: string,
  price: number,
  sku: string,
  opts: {
    rating?: number;
    reviews?: number;
    shipping?: string;
    url?: string;
    oldPrice?: number;
    inStock?: boolean;
  } = {},
): Product["listings"][number] {
  const store = stores.find((s) => s.id === storeId)!;
  return {
    storeId,
    price,
    sku,
    rating: opts.rating ?? 4.3,
    reviews: opts.reviews ?? 120,
    inStock: opts.inStock ?? true,
    shipping: opts.shipping ?? "توصيل خلال 2–5 أيام",
    url: opts.url ?? `https://www.example.com/${storeId}/${sku}`,
    affiliateNetwork: store?.network ?? "direct",
    oldPrice: opts.oldPrice,
  };
}

const seedProducts: Product[] = [
  {
    id: "lg-washer-8",
    name: "غسالة إل جي فول أوتوماتيك 8 كيلو",
    brand: "LG",
    category: "washers",
    barcode: "8806091870018",
    model: "F4V5RYP0T",
    capacity: "8 كجم",
    highlights: ["موتور إنفرتر 10 سنوات", "بخار للتنظيف", "غسيل سريع 14 دقيقة"],
    specs: [
      { label: "السعة", value: "8 كجم" },
      { label: "السرعة", value: "1400 لفة" },
      { label: "الطاقة", value: "A+++" },
      { label: "اللون", value: "فضي" },
    ],
    listings: [
      listing("jumia", 18999, "LG-W8-J", { rating: 4.6, reviews: 842, oldPrice: 21499, url: "https://www.jumia.com.eg/lg-8kg" }),
      listing("noon", 19450, "LG-W8-N", { rating: 4.5, reviews: 611, shipping: "غدًا مع نون", url: "https://www.noon.com/egypt-ar/lg-8kg" }),
      listing("btech", 19990, "LG-W8-B", { rating: 4.7, reviews: 203, shipping: "تركيب مجاني داخل القاهرة", url: "https://btech.com/lg-8kg" }),
      listing("twob", 19200, "LG-W8-2B", { rating: 4.4, reviews: 88, url: "https://2b.com.eg/lg-8kg" }),
    ],
    reviewHighlights: [
      { author: "منى ع.", rating: 5, source: "جوميا", text: "هادية والغسيل نضيف من أول دورة. ركّبوها في نفس اليوم." },
      { author: "أحمد س.", rating: 4, source: "نون", text: "السعر نزل أسبوع. وفّري نبّهتني واتشتريت بـ 18999." },
    ],
  },
  {
    id: "lg-washer-10",
    name: "غسالة إل جي فول أوتوماتيك 10 كيلو",
    brand: "LG",
    category: "washers",
    barcode: "8806091870100",
    model: "F4V9RWP2T",
    capacity: "10 كجم",
    highlights: ["سعة أكبر للعيلة", "AI DD", "تجفيف جزئي"],
    specs: [
      { label: "السعة", value: "10 كجم" },
      { label: "السرعة", value: "1400 لفة" },
      { label: "الطاقة", value: "A+++" },
    ],
    listings: [
      listing("jumia", 23999, "LG-W10-J", { rating: 4.5, reviews: 310, url: "https://www.jumia.com.eg/lg-10kg" }),
      listing("noon", 24490, "LG-W10-N", { rating: 4.6, reviews: 190, url: "https://www.noon.com/egypt-ar/lg-10kg" }),
      listing("raya", 24900, "LG-W10-R", { rating: 4.4, reviews: 54, url: "https://rayashop.com/lg-10kg" }),
    ],
    reviewHighlights: [
      { author: "سارة م.", rating: 5, source: "نون", text: "10 كيلو فرق واضح مع ملايات السرير. متشتريش 8 لو العيلة كبيرة." },
    ],
  },
  {
    id: "toshiba-fridge-16",
    name: "ثلاجة توشيبا نوفروست 16 قدم",
    brand: "توشيبا",
    category: "fridges",
    barcode: "6223001870164",
    model: "GR-EF46P-J",
    capacity: "16 قدم",
    highlights: ["صنع في مصر", "ضمان العربي", "توفير كهربا"],
    specs: [
      { label: "السعة", value: "16 قدم / 453 لتر" },
      { label: "التصنيف", value: "نوفروست" },
      { label: "الأدراج", value: "2 فريزر" },
    ],
    listings: [
      listing("elaraby", 21400, "TOS-F16-AR", { rating: 4.6, reviews: 420, shipping: "من فرع العربي الأقرب", url: "https://elarabygroup.com/toshiba-16" }),
      listing("jumia", 21990, "TOS-F16-J", { rating: 4.4, reviews: 980, oldPrice: 23990, url: "https://www.jumia.com.eg/toshiba-16" }),
      listing("btech", 22450, "TOS-F16-B", { rating: 4.5, reviews: 150, url: "https://btech.com/toshiba-16" }),
      listing("raneen", 20990, "TOS-F16-RN", { rating: 4.2, reviews: 67, shipping: "استلام من الفرع أو توصيل", url: "https://raneen.com/toshiba-16" }),
    ],
    reviewHighlights: [
      { author: "هند ك.", rating: 5, source: "العربي", text: "الخدمة بعد البيع أهم من فرق الألف جنيه. العربي ردّوا في الضمان." },
    ],
  },
  {
    id: "samsung-fridge-18",
    name: "ثلاجة سامسونج نوفروست 18 قدم",
    brand: "Samsung",
    category: "fridges",
    barcode: "8806094180182",
    model: "RT47CG6644B1",
    capacity: "18 قدم",
    highlights: ["Digital Inverter", "رفوف زجاج", "درج خضار رطوبة"],
    specs: [
      { label: "السعة", value: "18 قدم" },
      { label: "اللون", value: "أسود مطفي" },
    ],
    listings: [
      listing("noon", 28990, "SAM-F18-N", { rating: 4.7, reviews: 233, url: "https://www.noon.com/egypt-ar/samsung-18" }),
      listing("twob", 29400, "SAM-F18-2B", { rating: 4.6, reviews: 91, url: "https://2b.com.eg/samsung-18" }),
      listing("amazon", 30150, "SAM-F18-AZ", { rating: 4.5, reviews: 40, url: "https://www.amazon.eg/samsung-18" }),
    ],
    reviewHighlights: [
      { author: "ليلى ر.", rating: 4, source: "نون", text: "شكلها في المطبخ فخم. الصوت مسموع خفيف أول أسبوع بعدين هدي." },
    ],
  },
  {
    id: "sharp-ac-15",
    name: "مكيف شارب 1.5 حصان بارد",
    brand: "شارب",
    category: "acs",
    barcode: "4974019115012",
    model: "AH-XP12UHE",
    capacity: "1.5 حصان",
    highlights: ["بلازما كلاستر", "توفير طاقة", "تحكم رطوبة"],
    specs: [
      { label: "القدرة", value: "1.5 حصان / 12000 وحدة" },
      { label: "النوع", value: "بارد فقط" },
    ],
    listings: [
      listing("btech", 16490, "SH-AC15-B", { rating: 4.6, reviews: 310, shipping: "تركيب خلال 72 ساعة", url: "https://btech.com/sharp-1-5" }),
      listing("jumia", 15990, "SH-AC15-J", { rating: 4.4, reviews: 720, oldPrice: 17990, url: "https://www.jumia.com.eg/sharp-1-5" }),
      listing("raya", 16900, "SH-AC15-R", { rating: 4.5, reviews: 88, url: "https://rayashop.com/sharp-1-5" }),
    ],
    reviewHighlights: [
      { author: "محمود ط.", rating: 5, source: "بي تك", text: "التركيب كان منظم. التبريد يكفي أوضة 16 متر." },
    ],
  },
  {
    id: "carrier-ac-225",
    name: "مكيف كاريير إنفرتر 2.25 حصان",
    brand: "كاريير",
    category: "acs",
    barcode: "6224001222501",
    model: "42KHA024",
    capacity: "2.25 حصان",
    highlights: ["إنفرتر", "حار وبارد", "مناسب للصالات"],
    specs: [
      { label: "القدرة", value: "2.25 حصان" },
      { label: "النوع", value: "حار / بارد إنفرتر" },
    ],
    listings: [
      listing("twob", 28900, "CAR-225-2B", { rating: 4.5, reviews: 76, url: "https://2b.com.eg/carrier-2-25" }),
      listing("btech", 27990, "CAR-225-B", { rating: 4.6, reviews: 140, url: "https://btech.com/carrier-2-25" }),
      listing("noon", 28450, "CAR-225-N", { rating: 4.4, reviews: 52, url: "https://www.noon.com/egypt-ar/carrier-2-25" }),
    ],
    reviewHighlights: [
      { author: "ياسمين ف.", rating: 4, source: "2B", text: "الصالة كبيرة ومسك التبريد. استهلاك الكهربا أقل من القديم." },
    ],
  },
  {
    id: "gree-ac-15",
    name: "مكيف جري 1.5 حصان إنفرتر",
    brand: "جري",
    category: "acs",
    barcode: "6932148015019",
    model: "GWH12QC",
    capacity: "1.5 حصان",
    highlights: ["سعر أقل من العلامات الكبرى", "إنفرتر", "ضمان محلي"],
    specs: [
      { label: "القدرة", value: "1.5 حصان" },
      { label: "النوع", value: "إنفرتر بارد" },
    ],
    listings: [
      listing("raneen", 13290, "GREE-15-RN", { rating: 4.1, reviews: 210, url: "https://raneen.com/gree-1-5" }),
      listing("jumia", 13990, "GREE-15-J", { rating: 4.2, reviews: 430, url: "https://www.jumia.com.eg/gree-1-5" }),
      listing("amazon", 14150, "GREE-15-AZ", { rating: 4.0, reviews: 33, url: "https://www.amazon.eg/gree-1-5" }),
    ],
    reviewHighlights: [
      { author: "نورا ح.", rating: 4, source: "رنين", text: "للميزانية مناسب. الصوت أعلى شوية من شارب بس التبريد كويس." },
    ],
  },
  {
    id: "unionaire-stove",
    name: "بوتاجاز يونيون إير 5 شعلة استانلس",
    brand: "يونيون إير",
    category: "stoves",
    barcode: "6223004555018",
    model: "C6050SS",
    capacity: "5 شعلة",
    highlights: ["أمان كامل", "فرن كهربا", "صنع في مصر"],
    specs: [
      { label: "الشعلات", value: "5 غاز" },
      { label: "الفرن", value: "كهرباء 60 سم" },
    ],
    listings: [
      listing("jumia", 8990, "UN-ST-J", { rating: 4.3, reviews: 560, oldPrice: 9990, url: "https://www.jumia.com.eg/unionaire-stove" }),
      listing("carrefour", 8750, "UN-ST-CF", { rating: 4.2, reviews: 44, shipping: "استلام هايبر أو توصيل", url: "https://www.carrefouregypt.com/unionaire-stove" }),
      listing("raneen", 8490, "UN-ST-RN", { rating: 4.1, reviews: 190, url: "https://raneen.com/unionaire-stove" }),
    ],
    reviewHighlights: [
      { author: "إيمان د.", rating: 5, source: "كارفور", text: "الشعلة الكبيرة بتغلي بسرعة. الفرن بيسوّي الكيك مظبوط." },
    ],
  },
  {
    id: "bosch-dishwasher",
    name: "غسالة أطباق بوش 13 فرد",
    brand: "بوش",
    category: "dishwashers",
    barcode: "4242005270136",
    model: "SMS4HAW48M",
    capacity: "13 فرد",
    highlights: ["Silence Plus", "برنامج ساعة", "استهلاك مية منخفض"],
    specs: [
      { label: "السعة", value: "13 فرد" },
      { label: "الطاقة", value: "A++" },
    ],
    listings: [
      listing("btech", 24990, "BSH-DW-B", { rating: 4.8, reviews: 120, url: "https://btech.com/bosch-dw" }),
      listing("noon", 25900, "BSH-DW-N", { rating: 4.7, reviews: 86, url: "https://www.noon.com/egypt-ar/bosch-dw" }),
      listing("amazon", 26450, "BSH-DW-AZ", { rating: 4.6, reviews: 21, url: "https://www.amazon.eg/bosch-dw" }),
    ],
    reviewHighlights: [
      { author: "داليا ش.", rating: 5, source: "بي تك", text: "بعد الجهاز ده مبقتش أقف على الحوض ساعة. الهدير مقبول ليلًا." },
    ],
  },
  {
    id: "beko-washer-7",
    name: "غسالة بيكو فوق أوتوماتيك 7 كيلو",
    brand: "بيكو",
    category: "washers",
    barcode: "8690842390704",
    model: "WTE7512B0",
    capacity: "7 كجم",
    highlights: ["مناسبة للشقق الصغيرة", "برامج قطن وصوف", "ضمان سنتين"],
    specs: [
      { label: "السعة", value: "7 كجم" },
      { label: "النوع", value: "فوق أوتوماتيك" },
    ],
    listings: [
      listing("jumia", 7990, "BEKO-7-J", { rating: 4.2, reviews: 410, url: "https://www.jumia.com.eg/beko-7" }),
      listing("raneen", 7690, "BEKO-7-RN", { rating: 4.0, reviews: 155, url: "https://raneen.com/beko-7" }),
      listing("carrefour", 7890, "BEKO-7-CF", { rating: 4.1, reviews: 38, url: "https://www.carrefouregypt.com/beko-7" }),
    ],
    reviewHighlights: [
      { author: "هدى ق.", rating: 4, source: "جوميا", text: "للعروسة اللي شقتها صغيرة كفاية. مش هتشيل ملايات تقيلة." },
    ],
  },
  {
    id: "hoover-vacuum",
    name: "مكنسة هوفر 2200 وات بدون كيس",
    brand: "هوفر",
    category: "vacuums",
    barcode: "8016361992207",
    model: "SL71PET011",
    capacity: "2200 وات",
    highlights: ["فلتر HEPA", "فرشاة للسجاد", "سعة 2 لتر"],
    specs: [
      { label: "القدرة", value: "2200 وات" },
      { label: "الكيس", value: "بدون كيس" },
    ],
    listings: [
      listing("noon", 4290, "HOV-V-N", { rating: 4.4, reviews: 300, url: "https://www.noon.com/egypt-ar/hoover-vac" }),
      listing("jumia", 3990, "HOV-V-J", { rating: 4.3, reviews: 640, oldPrice: 4590, url: "https://www.jumia.com.eg/hoover-vac" }),
      listing("amazon", 4150, "HOV-V-AZ", { rating: 4.2, reviews: 48, url: "https://www.amazon.eg/hoover-vac" }),
    ],
    reviewHighlights: [
      { author: "مريم أ.", rating: 5, source: "جوميا", text: "بتشفط شعر القطة من السجاد. سهلة التفضية." },
    ],
  },
  {
    id: "fresh-heater",
    name: "سخان فريش غاز 10 لتر",
    brand: "فريش",
    category: "heaters",
    barcode: "6223003310109",
    model: "GWH10",
    capacity: "10 لتر",
    highlights: ["أمان انقطاع الغاز", "اشتعال بطارية", "مناسب لشقة العروسين"],
    specs: [
      { label: "السعة", value: "10 لتر" },
      { label: "الوقود", value: "غاز طبيعي / أسطوانة" },
    ],
    listings: [
      listing("raneen", 2890, "FR-H10-RN", { rating: 4.1, reviews: 280, url: "https://raneen.com/fresh-heater" }),
      listing("jumia", 3090, "FR-H10-J", { rating: 4.2, reviews: 510, url: "https://www.jumia.com.eg/fresh-heater" }),
      listing("carrefour", 2990, "FR-H10-CF", { rating: 4.0, reviews: 62, url: "https://www.carrefouregypt.com/fresh-heater" }),
    ],
    reviewHighlights: [
      { author: "آية ن.", rating: 4, source: "رنين", text: "المي بتسخن بسرعة. ركّبوه مع سباك البيت في ساعة." },
    ],
  },
  {
    id: "lg-tv-55",
    name: "شاشة إل جي 55 بوصة 4K UHD",
    brand: "LG",
    category: "tvs",
    barcode: "8806091550011",
    model: "55UQ80006LB",
    capacity: "55 بوصة",
    highlights: ["webOS", "HDR10", "تحكم صوتي"],
    specs: [
      { label: "المقاس", value: "55 بوصة" },
      { label: "الدقة", value: "4K" },
    ],
    listings: [
      listing("twob", 18490, "LG-TV55-2B", { rating: 4.6, reviews: 201, url: "https://2b.com.eg/lg-55" }),
      listing("noon", 17990, "LG-TV55-N", { rating: 4.5, reviews: 340, oldPrice: 19990, url: "https://www.noon.com/egypt-ar/lg-55" }),
      listing("btech", 18900, "LG-TV55-B", { rating: 4.7, reviews: 110, url: "https://btech.com/lg-55" }),
    ],
    reviewHighlights: [
      { author: "كريم و.", rating: 5, source: "نون", text: "الألوان هادية للصالون. التطبيق فتح نتفليكس من غير مشاكل." },
    ],
  },
  {
    id: "kenwood-mixer",
    name: "خلاط كينوود 800 وات زجاج",
    brand: "كينوود",
    category: "small-appliances",
    barcode: "5011423178008",
    model: "BLM800WH",
    capacity: "1.6 لتر",
    highlights: ["محرك قوي", "إناء زجاج", "طحن ثلج"],
    specs: [
      { label: "القدرة", value: "800 وات" },
      { label: "الإناء", value: "زجاج 1.6 لتر" },
    ],
    listings: [
      listing("jumia", 2190, "KEN-MX-J", { rating: 4.5, reviews: 890, url: "https://www.jumia.com.eg/kenwood-mixer" }),
      listing("carrefour", 2290, "KEN-MX-CF", { rating: 4.4, reviews: 70, url: "https://www.carrefouregypt.com/kenwood-mixer" }),
      listing("noon", 2350, "KEN-MX-N", { rating: 4.6, reviews: 255, url: "https://www.noon.com/egypt-ar/kenwood-mixer" }),
    ],
    reviewHighlights: [
      { author: "شيماء ب.", rating: 5, source: "جوميا", text: "بيهرس الثلج والعصير ناعم. الغطا محكم مش بيطرطش." },
    ],
  },
  {
    id: "braun-mixer",
    name: "خلاط يد براون مالتي كويك 5",
    brand: "براون",
    category: "small-appliances",
    barcode: "4210201235006",
    model: "MQ5235",
    capacity: "1000 وات",
    highlights: ["ملحقات خفق وتقطيع", "سهولة الغسيل", "ضمان سنتين"],
    specs: [
      { label: "القدرة", value: "1000 وات" },
      { label: "الملحقات", value: "3 قطع" },
    ],
    listings: [
      listing("amazon", 3490, "BRN-MQ-AZ", { rating: 4.7, reviews: 96, url: "https://www.amazon.eg/braun-mq5" }),
      listing("noon", 3290, "BRN-MQ-N", { rating: 4.6, reviews: 180, url: "https://www.noon.com/egypt-ar/braun-mq5" }),
      listing("jumia", 3390, "BRN-MQ-J", { rating: 4.5, reviews: 410, url: "https://www.jumia.com.eg/braun-mq5" }),
    ],
    reviewHighlights: [
      { author: "رنا ج.", rating: 5, source: "أمازون", text: "الشوربة بتبقى كريمية في دقيقة. أخف من الخلاط الكبير." },
    ],
  },
  {
    id: "toshiba-microwave",
    name: "ميكروويف توشيبا 28 لتر بالشواية",
    brand: "توشيبا",
    category: "small-appliances",
    barcode: "6223001870287",
    model: "MM-EG28P",
    capacity: "28 لتر",
    highlights: ["شواية", "إزالة تجميد", "قفل أطفال"],
    specs: [
      { label: "السعة", value: "28 لتر" },
      { label: "الشواية", value: "نعم" },
    ],
    listings: [
      listing("elaraby", 4590, "TOS-MW-AR", { rating: 4.4, reviews: 130, url: "https://elarabygroup.com/toshiba-mw" }),
      listing("btech", 4790, "TOS-MW-B", { rating: 4.3, reviews: 77, url: "https://btech.com/toshiba-mw" }),
      listing("jumia", 4690, "TOS-MW-J", { rating: 4.2, reviews: 520, url: "https://www.jumia.com.eg/toshiba-mw" }),
    ],
    reviewHighlights: [
      { author: "فاطمة ي.", rating: 4, source: "العربي", text: "الشواية بتحمّر الجبنة كويس. المقاس يدخل الركن بسهولة." },
    ],
  },
  {
    id: "tefal-iron",
    name: "مكواة تيفال بخار 2600 وات",
    brand: "تيفال",
    category: "small-appliances",
    barcode: "3121040062605",
    model: "FV5697",
    capacity: "2600 وات",
    highlights: ["مضاد للتكلس", "بخار عمودي", "قاعدة سيراميك"],
    specs: [
      { label: "القدرة", value: "2600 وات" },
      { label: "القاعدة", value: "سيراميك" },
    ],
    listings: [
      listing("jumia", 1890, "TEF-IR-J", { rating: 4.5, reviews: 700, url: "https://www.jumia.com.eg/tefal-iron" }),
      listing("carrefour", 1790, "TEF-IR-CF", { rating: 4.4, reviews: 41, url: "https://www.carrefouregypt.com/tefal-iron" }),
      listing("noon", 1950, "TEF-IR-N", { rating: 4.6, reviews: 210, url: "https://www.noon.com/egypt-ar/tefal-iron" }),
    ],
    reviewHighlights: [
      { author: "جميلة س.", rating: 5, source: "كارفور", text: "بتفك تجعيد العباية من غير ما تلزق. الخزان يكفي أوضة كاملة." },
    ],
  },
  {
    id: "bedroom-oak",
    name: "غرفة نوم سنديان 5 قطع",
    brand: "هومزمارت",
    category: "bedroom",
    barcode: "6224011005012",
    model: "OAK-BR-5",
    capacity: "سرير 160",
    highlights: ["دولاب مفصلي", "تسريحة بمرآة", "2 كمودينو"],
    specs: [
      { label: "المكونات", value: "5 قطع" },
      { label: "الخامة", value: "MDF قشرة سنديان" },
      { label: "عرض السرير", value: "160 سم" },
    ],
    listings: [
      listing("homzmart", 42900, "OAK-HM", { rating: 4.4, reviews: 86, shipping: "تركيب خلال أسبوع", url: "https://homzmart.com/oak-bedroom" }),
      listing("bfurn", 39900, "OAK-BF", { rating: 4.3, reviews: 34, shipping: "معاينة في الشووروم", url: "https://bfurn.com/oak-bedroom" }),
      listing("ikea", 45500, "OAK-IK", { rating: 4.6, reviews: 210, shipping: "اطلب واستلم / توصيل ايكيا", url: "https://www.ikea.com/eg/ar/oak-bedroom" }),
    ],
    reviewHighlights: [
      { author: "سلمى ع.", rating: 4, source: "بي فيرن", text: "الخشب تقيل والدولاب واسع. التسليم اتأخر يومين عن المعاد." },
    ],
  },
  {
    id: "velvet-sofa",
    name: "ركنة مخمل 3 قطع لون زيتي",
    brand: "هومزمارت",
    category: "living",
    barcode: "6224011008778",
    model: "VEL-L-3",
    capacity: "7 أفراد",
    highlights: ["إسفنج كثافة عالية", "أغطية قابلة للغسيل", "خامات محلية"],
    specs: [
      { label: "الأفراد", value: "7" },
      { label: "القماش", value: "مخمل" },
    ],
    listings: [
      listing("homzmart", 18900, "VEL-HM", { rating: 4.5, reviews: 142, url: "https://homzmart.com/velvet-sofa" }),
      listing("bfurn", 17500, "VEL-BF", { rating: 4.2, reviews: 28, url: "https://bfurn.com/velvet-sofa" }),
      listing("noon", 19990, "VEL-N", { rating: 4.3, reviews: 67, url: "https://www.noon.com/egypt-ar/velvet-sofa" }),
    ],
    reviewHighlights: [
      { author: "بسمة ك.", rating: 5, source: "هومزمارت", text: "اللون في الواقع أغمق شوية من الصور وده أحلى. مريحة للضيف." },
    ],
  },
  {
    id: "dining-6",
    name: "سفرة 6 كراسي خشب زان",
    brand: "ايكيا",
    category: "living",
    barcode: "7021453310068",
    model: "EKEDALEN",
    capacity: "6 أفراد",
    highlights: ["قابلة للتمديد", "كراسي مبطنة", "سهل التنظيف"],
    specs: [
      { label: "الكراسي", value: "6" },
      { label: "الخامة", value: "خشب زان" },
    ],
    listings: [
      listing("ikea", 21400, "DIN-IK", { rating: 4.7, reviews: 330, url: "https://www.ikea.com/eg/ar/dining-6" }),
      listing("homzmart", 19800, "DIN-HM", { rating: 4.3, reviews: 55, url: "https://homzmart.com/dining-6" }),
      listing("bfurn", 18900, "DIN-BF", { rating: 4.1, reviews: 19, url: "https://bfurn.com/dining-6" }),
    ],
    reviewHighlights: [
      { author: "عمر ل.", rating: 4, source: "ايكيا", text: "التمديد مفيد للعزايم. التجميع واضح بالكتالوج." },
    ],
  },
  {
    id: "tefal-pots",
    name: "طقم حلل تيفال 10 قطع",
    brand: "تيفال",
    category: "kitchen-tools",
    barcode: "3168430230017",
    model: "B301SA95",
    capacity: "10 قطع",
    highlights: ["مانع الالتصاق", "مقابض مريحة", "أغطية زجاج"],
    specs: [
      { label: "القطع", value: "10" },
      { label: "الخامة", value: "ألومنيوم مطلي" },
    ],
    listings: [
      listing("carrefour", 4590, "TEF-POT-CF", { rating: 4.6, reviews: 88, url: "https://www.carrefouregypt.com/tefal-pots" }),
      listing("jumia", 4390, "TEF-POT-J", { rating: 4.5, reviews: 1200, oldPrice: 5290, url: "https://www.jumia.com.eg/tefal-pots" }),
      listing("noon", 4490, "TEF-POT-N", { rating: 4.5, reviews: 340, url: "https://www.noon.com/egypt-ar/tefal-pots" }),
    ],
    reviewHighlights: [
      { author: "نادية م.", rating: 5, source: "جوميا", text: "الأرز مش بيلزق. الغطا بيحكم البخار كويس." },
    ],
  },
  {
    id: "cotton-duvet",
    name: "لحاف قطن مصري 6 قطع كينج",
    brand: "هومزمارت",
    category: "textiles",
    barcode: "6224099006013",
    model: "DUV-K-6",
    capacity: "كينج",
    highlights: ["قطن 100%", "حشو شتوي", "كيس وسادتين"],
    specs: [
      { label: "المقاس", value: "كينج" },
      { label: "القطع", value: "6" },
    ],
    listings: [
      listing("homzmart", 2890, "DUV-HM", { rating: 4.4, reviews: 210, url: "https://homzmart.com/duvet" }),
      listing("noon", 3090, "DUV-N", { rating: 4.3, reviews: 90, url: "https://www.noon.com/egypt-ar/duvet" }),
      listing("amazon", 2750, "DUV-AZ", { rating: 4.2, reviews: 47, url: "https://www.amazon.eg/duvet" }),
    ],
    reviewHighlights: [
      { author: "آمال ف.", rating: 5, source: "أمازون", text: "القطن ناعم بعد الغسلة الأولى. اللون زي الصورة بالظبط." },
    ],
  },
  {
    id: "towel-set",
    name: "طقم مناشف فندقي 8 قطع",
    brand: "ايكيا",
    category: "textiles",
    barcode: "9042763310081",
    model: "FREDRIKSJÖN",
    capacity: "8 قطع",
    highlights: ["امتصاص عالي", "غسيل متكرر", "ألوان هادية"],
    specs: [
      { label: "القطع", value: "8" },
      { label: "الخامة", value: "قطن تيري" },
    ],
    listings: [
      listing("ikea", 1290, "TOW-IK", { rating: 4.6, reviews: 400, url: "https://www.ikea.com/eg/ar/towels" }),
      listing("carrefour", 1190, "TOW-CF", { rating: 4.3, reviews: 52, url: "https://www.carrefouregypt.com/towels" }),
      listing("jumia", 1350, "TOW-J", { rating: 4.2, reviews: 260, url: "https://www.jumia.com.eg/towels" }),
    ],
    reviewHighlights: [
      { author: "حنان ر.", rating: 4, source: "ايكيا", text: "تخينة ومش بتكرمش بسرعة. سعرها في كارفور كان أقل بأسبوع." },
    ],
  },
  {
    id: "crystal-chandelier",
    name: "نجفة كريستال 8 فروع للصالون",
    brand: "هومزمارت",
    category: "decor",
    barcode: "6224011880084",
    model: "CH-8-CR",
    capacity: "8 فروع",
    highlights: ["إضاءة دافئة", "تركيب معلق", "قطع كريستال"],
    specs: [
      { label: "الفروع", value: "8" },
      { label: "اللون", value: "ذهبي / شفاف" },
    ],
    listings: [
      listing("homzmart", 4590, "CH-HM", { rating: 4.3, reviews: 61, url: "https://homzmart.com/chandelier" }),
      listing("bfurn", 4290, "CH-BF", { rating: 4.1, reviews: 14, url: "https://bfurn.com/chandelier" }),
      listing("noon", 4890, "CH-N", { rating: 4.2, reviews: 33, url: "https://www.noon.com/egypt-ar/chandelier" }),
    ],
    reviewHighlights: [
      { author: "غادة ت.", rating: 5, source: "هومزمارت", text: "الصالون اتغيّر. الفني ركّبها في نص ساعة." },
    ],
  },
];

export const products = [
  ...expandNetworkListings([...seedProducts, ...extraProducts, ...lifeProducts, ...marketCatalog, ...brideProducts, ...flagshipTech]),
].map((p) => {
  const seen = new Set<string>();
  const listings = p.listings
    .filter((l) => {
      const st = getNetworkStore(l.storeId);
      if (l.storeId === "cartlow" || l.storeId === "carrefour" || !canShopOut(l.storeId) || !isEgyptSeller(st)) return false;
      if (!listingHref(l.storeId, shopQueryFromProduct(p))) return false;
      if (!st) return false;
      if (st.kind === "brand" || st.connector === "brand_portal") {
        return brandShopFits(st, p);
      }
      return true;
    })
    .filter((l) => {
      if (seen.has(l.storeId)) return false;
      seen.add(l.storeId);
      return true;
    })
    .map((l) => ({
      ...l,
      url: listingHref(l.storeId, shopQueryFromProduct(p)),
    }));
  return { ...p, listings };
});

const productById = new Map(products.map((p) => [p.id, p]));

export const templates: ChecklistTemplate[] = [
  {
    id: "kitchen-core",
    kind: "room",
    name: "جهاز مطبخ أساسي",
    description: "غسالة، ثلاجة، بوتاجاز، سخان، خلاط، حلل",
    suggestedBudget: 65000,
    productIds: [
      "lg-washer-8",
      "toshiba-fridge-16",
      "unionaire-stove",
      "fresh-heater",
      "kenwood-mixer",
      "tefal-pots",
    ],
  },
  {
    id: "kitchen-plus",
    kind: "room",
    name: "مطبخ كامل مع أطباق",
    description: "الأساسي + غسالة أطباق وميكروويف",
    suggestedBudget: 95000,
    productIds: [
      "lg-washer-8",
      "toshiba-fridge-16",
      "unionaire-stove",
      "bosch-dishwasher",
      "toshiba-microwave",
      "fresh-heater",
      "tefal-pots",
      "braun-mixer",
    ],
  },
  {
    id: "bedroom-set",
    kind: "room",
    name: "غرفة نوم العروسين",
    description: "غرفة 5 قطع + لحاف + مناشف",
    suggestedBudget: 48000,
    productIds: ["bedroom-oak", "cotton-duvet", "towel-set", "tefal-iron"],
  },
  {
    id: "living-set",
    kind: "room",
    name: "صالون واستقبال",
    description: "ركنة، سفرة، شاشة، نجفة",
    suggestedBudget: 62000,
    productIds: ["velvet-sofa", "dining-6", "lg-tv-55", "crystal-chandelier"],
  },
  {
    id: "cooling",
    kind: "room",
    name: "تبريد الشقة",
    description: "مكيف أوضة + مكيف صالة",
    suggestedBudget: 45000,
    productIds: ["sharp-ac-15", "carrier-ac-225"],
  },
  {
    id: "daily-life",
    kind: "room",
    name: "أجهزة البيت اليومية",
    description: "قلاية، كتل، مروحة، مبرد مياه، سشوار، روبوت",
    suggestedBudget: 28000,
    productIds: [
      "philips-airfryer",
      "kettle-kenwood",
      "tornado-fan-18",
      "water-dispenser-fresh",
      "remington-dryer",
      "robot-vacuum-tuya",
    ],
  },
  {
    id: "bride-wardrobe",
    kind: "room",
    name: "لبس العروسة والبيجامات",
    description: "فستان/عباية، بيجامة، شباشب، كلتش، فوط، عطر",
    suggestedBudget: 15000,
    productIds: [
      "bridal-dress",
      "bridal-abaya",
      "cotton-pajamas",
      "bride-slippers",
      "evening-bag",
      "bath-towels-8",
      "lattafa-perfume",
    ],
  },
  ...commercialBundles.map((b) => ({ ...b, kind: "bundle" as const })),
];

export function getProduct(id: string) {
  return productById.get(id) ?? hydrateVirtual(id);
}

export function getStore(id: string) {
  return stores.find((s) => s.id === id);
}

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function cheapestListing(product: Product) {
  const shoppable = product.listings.filter((l) => canShopOut(l.storeId) && Boolean(listingHref(l.storeId, product.name)));
  const inStock = shoppable.filter((l) => l.inStock);
  const pool = inStock.length ? inStock : shoppable;
  return [...pool].sort((a, b) => a.price - b.price)[0] ?? product.listings[0];
}

export function maxListing(product: Product) {
  const shoppable = product.listings.filter((l) => canShopOut(l.storeId));
  return [...(shoppable.length ? shoppable : product.listings)].sort((a, b) => b.price - a.price)[0];
}

export function savings(product: Product) {
  const cheap = cheapestListing(product);
  const max = maxListing(product);
  return Math.max(0, max.price - cheap.price);
}

export function avgRating(product: Product) {
  if (!product.listings.length) return 0;
  const w = product.listings.reduce(
    (acc, l) => ({ r: acc.r + l.rating * l.reviews, n: acc.n + l.reviews }),
    { r: 0, n: 0 },
  );
  return w.n ? w.r / w.n : 0;
}

export function storeCount(product: Product) {
  return new Set(product.listings.map((l) => l.storeId)).size;
}
