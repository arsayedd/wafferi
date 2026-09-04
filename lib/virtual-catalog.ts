import type { CategoryId, Product } from "./types";
import { listingHref } from "./store-link";
import { makeSku } from "./sku-factory";
import { shopQueryFromProduct } from "./shop-query";
import { foldArabic, similarArabic } from "./ar-fold";
import { triggeredSynonymGroups, hayMatchesSynonyms } from "./search-synonyms";

export const VIRTUAL_STORES = [
  "jumia",
  "noon",
  "raneen",
  "elaraby",
  "tawhid-nour",
  "alreyada",
  "amazon",
  "btech",
] as const;

const APPLIANCE_BRANDS = [
  "توشيبا",
  "فريش",
  "كريازي",
  "يونيون إير",
  "تورنيدو",
  "وايت ويل",
  "بيكو",
  "زانوسي",
  "هوفر",
  "LG",
  "Samsung",
  "شارب",
  "هاير",
  "ميديا",
  "جري",
  "كاريير",
  "هيتاشي",
  "باناسونيك",
  "يونيفرسال",
  "الأهرام",
  "ايديال",
  "باور",
  "أوليمبيك",
  "وايت بوينت",
  "أرو",
  "جاك",
  "هيونداي",
  "دايو",
  "إلكترولكس",
  "بوش",
  "سيمنس",
  "ميليه",
  "وينكس",
  "هيسنس",
  "تي سي إل",
  "سوني",
  "فيليبس",
  "كينوود",
  "مولينكس",
  "براون",
  "كونتي",
  "رويال",
  "سوناي",
  "بلاك اند ديكر",
  "ارستون",
  "اندست",
  "كولر",
  "فريش برو",
  "جيرمان",
];

const FASHION_BRANDS = [
  "كوتونيل",
  "ديفاكتو",
  "ماكس",
  "اتش اند ام",
  "زارا",
  "LC Waikiki",
  "رنيمة",
  "كاش كاش",
  "سبلاش",
  "سنتربوينت",
  "أمريكان إيجل",
  "بول آند بير",
  "جارينا",
  "شي إن",
  "بيربري لوك",
  "نايك",
  "أديداس",
  "بوما",
  "سكيتشرز",
  "ألدو",
  "تشارلز آند كيث",
  "مينت جرين",
  "موزة",
  "لوكال",
  "فاشون مصر",
  "جوسي كوتور لوك",
  "بيرشكا لوك",
  "ستراديواريوس لوك",
  "بول آند بير كيدز",
  "بابا جون",
];

const HOME_BRANDS = [
  "ايكيا",
  "هومزمارت",
  "بالاسيو",
  "رنين هوم",
  "التوحيد والنور",
  "إيديال استاندرد",
  "موبيكا",
  "داماك",
  "هايبر وان هوم",
  "كارينا",
  "جيه بي إل",
  "سفن فورم",
  "أت هوم",
  "وود آرت",
  "لوكس هوم",
  "بيت العروسة",
  "مفروشات مصر",
  "نيست هوم",
];

const TECH_BRANDS = [
  "Samsung",
  "Apple",
  "Xiaomi",
  "OPPO",
  "realme",
  "Infinix",
  "Tecno",
  "Huawei",
  "Honor",
  "Nokia",
  "Vivo",
  "Motorola",
  "OnePlus",
  "Google",
  "Nothing",
  "Sony",
  "ASUS",
  "Lenovo",
  "TCL",
  "Itel",
  "Poco",
  "Redmi",
  "iQOO",
  "ZTE",
  "HTC",
  "Blackview",
  "Oukitel",
  "Fairphone",
  "CAT",
  "Nubia",
];

const LAPTOP_BRANDS = [
  "HP",
  "Dell",
  "Lenovo",
  "ASUS",
  "Acer",
  "MSI",
  "Apple",
  "Samsung",
  "Huawei",
  "LG",
  "Toshiba",
  "Microsoft",
  "Razer",
  "Gigabyte",
  "Chuwi",
  "Honor",
  "Xiaomi",
  "Fujitsu",
  "Alienware",
  "Vaio",
];

const TECH_COLORS = ["أسود", "أبيض", "أزرق", "أخضر", "ذهبي", "فضي", "بنفسجي", "وردي", "رمادي", "تيتانيوم"];

const BEAUTY_BRANDS = [
  "لطافة",
  "عبدالصمد القرشي",
  "النارسيس",
  "ذا بودي شوب",
  "باتشي",
  "سيف",
  "جولدن سنت",
  "ميبيلين",
  "لوريال",
  "نيفيا",
  "جارنييه",
  "دوركس",
  "فا",
  "جونسون",
  "فازلين",
  "أفون",
  "أوريفليم",
  "ريفلون",
];

const COLORS = ["فضي", "أبيض", "أسود", "ستانلس", "ذهبي", "رمادي", "بيج", "أزرق"];
const GRADES = ["عادي", "إنفرتر", "موفر A++", "موفر A+++", "بريميوم"];
const FASHION_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "36", "38", "40", "42", "44"];
const FASHION_COLORS = ["أسود", "أبيض", "بيج", "كحلي", "وردي", "أحمر", "ذهبي", "رمادي"];
const HOME_COLORS = ["خشب طبيعي", "أبيض", "رمادي", "أسود", "جوز", "كريمي"];

type Family = {
  key: string;
  category: CategoryId;
  brands: string[];
  sizes: string[];
  kinds: string[];
  colors: string[];
  grades: string[];
  words: string[];
  title: (b: string, size: string, kind: string, color: string, grade: string) => string;
  basePrice: number;
};

function familySize(f: Family) {
  return f.brands.length * f.sizes.length * f.kinds.length * f.colors.length * f.grades.length;
}

function F(
  key: string,
  category: CategoryId,
  brands: string[],
  sizes: string[],
  kinds: string[],
  colors: string[],
  grades: string[],
  words: string[],
  basePrice: number,
  title: Family["title"],
): Family {
  return { key, category, brands, sizes, kinds, colors, grades, words, basePrice, title };
}

const families: Family[] = [
  F(
    "fr",
    "fridges",
    APPLIANCE_BRANDS,
    ["8 قدم", "9 قدم", "10 قدم", "12 قدم", "14 قدم", "16 قدم", "18 قدم", "20 قدم", "22 قدم", "24 قدم", "26 قدم", "28 قدم", "340 لتر", "400 لتر", "500 لتر", "610 لتر"],
    ["نوفروست 2 باب", "ديفروست", "4 باب", "سايد باي سايد", "باب زجاج", "باب فرنسي", "ميني بار", "شارب انفرتر"],
    COLORS,
    GRADES,
    ["ثلاجة", "ثلاجه", "تلاجة", "تلاجه", "ثلاجات", "fridge"],
    9800,
    (b, size, kind, color, grade) => `ثلاجة ${b} ${kind} ${size} ${color} ${grade}`,
  ),
  F(
    "ws",
    "washers",
    APPLIANCE_BRANDS,
    ["5 كجم", "6 كجم", "7 كجم", "8 كجم", "9 كجم", "10 كجم", "11 كجم", "12 كجم", "13 كجم", "14 كجم", "16 كجم", "18 كجم"],
    ["فول أوتوماتيك أمامي", "فوق أوتوماتيك", "نصف أوتوماتيك", "مع تجفيف", "تحميل علوي", "غسيل + تجفيف"],
    COLORS,
    GRADES,
    ["غسالة", "غساله", "غسالات", "washer"],
    6200,
    (b, size, kind, color, grade) => `غسالة ${b} ${kind} ${size} ${color} ${grade}`,
  ),
  F(
    "ac",
    "acs",
    APPLIANCE_BRANDS,
    ["1 حصان", "1.5 حصان", "2.25 حصان", "3 حصان", "4 حصان", "5 حصان", "6 حصان", "12000 BTU", "18000 BTU", "24000 BTU"],
    ["بارد فقط", "حار وبارد", "إنفرتر سبليت", "دولابي", "شباك", "مخفي"],
    ["أبيض", "بيج", "فضي"],
    GRADES,
    ["تكييف", "مكيف", "تكييفات", "سبليت"],
    10400,
    (b, size, kind, color, grade) => `مكيف ${b} ${kind} ${size} ${color} ${grade}`,
  ),
  F(
    "st",
    "stoves",
    APPLIANCE_BRANDS,
    ["4 شعلة", "5 شعلة", "60 سم بلت إن", "90 سم بلت إن", "80 سم", "فرن كهربا"],
    ["غاز", "غاز وكهربا", "استانلس", "مينا", "سيراميك", "تاتش"],
    ["ستانلس", "أسود", "أبيض", "فضي"],
    ["عادي", "أمان كامل", "تاتش", "بريميوم"],
    ["بوتاجاز", "فرن", "موقد"],
    4200,
    (b, size, kind, color, grade) => `بوتاجاز ${b} ${kind} ${size} ${color} ${grade}`,
  ),
  F(
    "tv",
    "tvs",
    APPLIANCE_BRANDS,
    ["32 بوصة", "40 بوصة", "43 بوصة", "50 بوصة", "55 بوصة", "65 بوصة", "70 بوصة", "75 بوصة", "85 بوصة"],
    ["HD", "FHD", "4K UHD", "OLED", "QLED", "Mini LED"],
    ["أسود", "فضي"],
    ["عادي", "سمارت", "ويب أو إس", "أندرويد"],
    ["تلفزيون", "تليفزيون", "شاشة", "شاشه"],
    5400,
    (b, size, kind, color, grade) => `شاشة ${b} ${kind} ${size} ${grade}`,
  ),
  F(
    "fz",
    "freezers",
    APPLIANCE_BRANDS,
    ["3 أدراج", "5 أدراج", "7 أدراج", "200 لتر أفقي", "250 لتر", "300 لتر أفقي", "400 لتر", "500 لتر"],
    ["رأسي", "أفقي", "نوفروست", "ديفروست"],
    ["أبيض", "فضي", "ستانلس"],
    GRADES,
    ["فريزر", "ديب فريزر"],
    7800,
    (b, size, kind, color, grade) => `ديب فريزر ${b} ${kind} ${size} ${color} ${grade}`,
  ),
  F(
    "ht",
    "heaters",
    APPLIANCE_BRANDS,
    ["6 لتر", "10 لتر", "30 لتر", "50 لتر", "80 لتر", "100 لتر"],
    ["غاز", "كهربا", "بدون مدخنة", "بمدخنة", "فوري"],
    ["أبيض", "فضي"],
    ["عادي", "أمان", "ديجيتال", "إنفرتر"],
    ["سخان", "سخانات"],
    1800,
    (b, size, kind, color, grade) => `سخان ${b} ${kind} ${size} ${grade}`,
  ),
  F(
    "sm",
    "small-appliances",
    APPLIANCE_BRANDS,
    ["400 وات", "600 وات", "800 وات", "1000 وات", "1200 وات", "1.5 لتر", "2 لتر", "5 لتر"],
    ["خلاط", "قلاية هوائية", "ميكروويف", "كتل", "مكواة", "محضر طعام", "عصارة", "توستر", "مكنسة يد"],
    ["أبيض", "أسود", "أحمر", "ستانلس"],
    ["عادي", "زجاج", "استانلس", "ديجيتال"],
    ["خلاط", "قلاية", "قلايه", "قلاية هوائية", "اير فراير", "air fryer", "ميكروويف", "كتل", "محضر"],
    450,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "dw",
    "dishwashers",
    APPLIANCE_BRANDS,
    ["12 فرد", "13 فرد", "14 فرد", "15 فرد", "60 سم", "45 سم"],
    ["حر", "بلت إن", "إنفرتر", "نصف مدمج"],
    ["ستانلس", "أبيض", "أسود"],
    GRADES,
    ["غسالة أطباق", "غسالة اطباق"],
    8900,
    (b, size, kind, color, grade) => `غسالة أطباق ${b} ${kind} ${size} ${color} ${grade}`,
  ),
  F(
    "fn",
    "fans",
    APPLIANCE_BRANDS,
    ["16 بوصة", "18 بوصة", "20 بوصة", "56 بوصة سقف"],
    ["عمود", "حائط", "سقف", "صندوق", "شحن"],
    ["أبيض", "أسود", "ذهبي"],
    ["عادي", "ريموت", "مؤقت"],
    ["مروحة", "مروحه", "مراوح"],
    380,
    (b, size, kind, color, grade) => `مروحة ${b} ${kind} ${size} ${color} ${grade}`,
  ),
  F(
    "vc",
    "vacuums",
    APPLIANCE_BRANDS,
    ["1200 وات", "1600 وات", "2000 وات", "بدون كيس"],
    ["أسطوانة", "عصا", "روبوت", "غسيل سجاد"],
    ["أحمر", "أسود", "أبيض"],
    ["عادي", "فلتر HEPA", "لاسلكي"],
    ["مكنسة", "مكنسه", "مكانس"],
    1100,
    (b, size, kind, color, grade) => `مكنسة ${b} ${kind} ${size} ${color} ${grade}`,
  ),
  F(
    "wt",
    "water",
    APPLIANCE_BRANDS,
    ["7 مراحل", "5 مراحل", "3 مراحل", "مبرد حار وبارد"],
    ["فلتر منزلي", "مبرد مياه", "خزان"],
    ["أبيض", "أسود"],
    ["عادي", "UV", "RO"],
    ["فلتر", "مبرد مياه"],
    2200,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${grade}`,
  ),
  F(
    "au",
    "audio",
    APPLIANCE_BRANDS,
    ["2.1", "5.1", "ساوند بار 2.0", "سماعة رأس"],
    ["ساوند بار", "سماعة بلوتوث", "هوم ثياتر", "مكبر صوت"],
    ["أسود", "فضي"],
    ["عادي", "واي فاي", "دولبي"],
    ["ساوند", "سماعة", "سماعات"],
    900,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${grade}`,
  ),
  F(
    "lv",
    "living",
    HOME_BRANDS,
    ["2 مقعد", "3 مقعد", "L", "U", "سفره 6 كرسي", "سفره 8 كرسي"],
    ["ركنة", "كنبة", "سفرة", "ترابيزة", "نيش", "مكتبة"],
    HOME_COLORS,
    ["قماش", "جلد", "مودرن", "كلاسيك", "L فاخر"],
    ["ركنة", "ركنه", "صالون", "سفرة", "سفره", "كنب"],
    7800,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "br",
    "bedroom",
    HOME_BRANDS,
    ["120 سم", "160 سم", "180 سم", "دولاب 2 درفة", "دولاب 4 درفة"],
    ["سرير", "دولاب", "تسريحة", "كومودينو", "غرفة كاملة"],
    HOME_COLORS,
    ["ميلامين", "خشب طبيعي", "مبطن", "مقاس خاص", "عرض غرفة"],
    ["سرير", "دولاب", "غرفة نوم", "تسريحة"],
    6500,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "tx",
    "textiles",
    HOME_BRANDS,
    ["فردي", "دبل", "كينج", "4 قطع", "6 قطع", "8 قطع"],
    ["لحاف", "ملاية", "فوط", "ستارة", "سجادة", "بطانية"],
    FASHION_COLORS,
    ["قطن", "ميكروفيبر", "مصري", "ستان", "تطريز"],
    ["مفروشات", "لحاف", "فوط", "ملاية"],
    280,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "ww",
    "women-wear",
    FASHION_BRANDS,
    FASHION_SIZES,
    ["عباية", "فستان يومي", "بلوزة", "بنطلون", "تونيك", "جينز", "كارديجان", "طقم"],
    FASHION_COLORS,
    ["كاجوال", "رسمي", "محجبات", "عيد", "شغل"],
    ["عباية", "عبايه", "لبس حريمي", "فستان"],
    220,
    (b, size, kind, color, grade) => `${kind} ${b} مقاس ${size} ${color} ${grade}`,
  ),
  F(
    "mw",
    "men-wear",
    FASHION_BRANDS,
    FASHION_SIZES,
    ["قميص", "بنطلون", "تيشيرت", "بدلة", "جينز", "جاكيت"],
    FASHION_COLORS,
    ["كاجوال", "رسمي", "رياضي", "شتوي", "صيفي"],
    ["قميص", "لبس رجالي", "بدلة"],
    250,
    (b, size, kind, color, grade) => `${kind} ${b} مقاس ${size} ${color} ${grade}`,
  ),
  F(
    "kw",
    "kids-wear",
    FASHION_BRANDS,
    ["2 سنوات", "4 سنوات", "6 سنوات", "8 سنوات", "10 سنوات", "12 سنوات", "S", "M"],
    ["طقم أطفال", "فستان بناتي", "تيشيرت", "بيجاما"],
    FASHION_COLORS,
    ["صيفي", "شتوي", "مدرسي", "عيد", "رياضي"],
    ["لبس أطفال", "أطفال"],
    140,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "pj",
    "pajamas",
    FASHION_BRANDS,
    FASHION_SIZES,
    ["بيجاما قطن", "ساتان", "لانجيري", "روب"],
    FASHION_COLORS,
    ["صيفي", "شتوي", "عروس", "ستان", "قطن"],
    ["بيجاما", "بيجامه", "لانجيري"],
    180,
    (b, size, kind, color, grade) => `${kind} ${b} مقاس ${size} ${color}`,
  ),
  F(
    "sh",
    "shoes",
    FASHION_BRANDS,
    ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    ["كعب", "فلات", "سنيكرز", "شبشب", "بوت", "كوتشي"],
    FASHION_COLORS,
    ["يومي", "سهرة", "رياضي", "كعب عالي", "مريح"],
    ["حذاء", "شوز", "جزمة", "شبشب"],
    320,
    (b, size, kind, color, grade) => `${kind} ${b} مقاس ${size} ${color} ${grade}`,
  ),
  F(
    "bg",
    "bags",
    FASHION_BRANDS,
    ["صغير", "متوسط", "كبير", "كلتش"],
    ["شنطة يد", "ظهر", "كتف", "سفر"],
    FASHION_COLORS,
    ["جلد", "قماش", "سهرة", "كاجوال", "سفر"],
    ["شنطة", "شنطه", "شنط"],
    290,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "jw",
    "jewelry",
    ["محلي", "إيطالي", "زركون", "لولو", "ذهب مصر", "فضة", "كيانيت", "سواروفسكي لوك"],
    ["عيار 18", "عيار 21", "عيار 24", "مطلي", "فضة 925"],
    ["حلق", "خاتم", "سلاسل", "أسورة", "طقم", "غويشة", "دبلة"],
    ["ذهبي", "فضي", "روز جولد", "ملون"],
    ["عروس", "يومي", "هدية", "خطوبة"],
    ["طقم", "حلق", "ذهب", "إكسسوار"],
    450,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "be",
    "beauty",
    BEAUTY_BRANDS,
    ["30 مل", "50 مل", "100 مل", "200 مل", "علبة"],
    ["عطر", "روج", "كريم", "سيروم", "ماسكارا", "فاونديشن", "شامبو"],
    ["أصلي", "شرقي", "نهاري", "ليلي"],
    ["عادي", "فاخر", "عرض"],
    ["عطر", "مكياج", "روج"],
    180,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "bb",
    "baby",
    ["بامبرز", "جونسون", "فيشر برايس", "تشيكو", "ماما", "بيبي جوي", "فاين", "مولفيكس"],
    ["حديثي ولادة", "3 شهور", "6 شهور", "سنة", "سنتين"],
    ["حفاض", "عربية", "سرير بيبي", "رضّاعة", "ملابس بيبي", "لعبة"],
    ["أبيض", "أزرق", "وردي"],
    ["عادي", "بريميوم"],
    ["بيبي", "طفل", "رضيع"],
    90,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color}`,
  ),
  F(
    "cl",
    "cleaning",
    HOME_BRANDS,
    ["قطعة", "عرض 3", "عرض 6", "جالون"],
    ["ممسحة", "منظف أرضيات", "كلور", "منظم غسيل", "جردل"],
    ["عادي", "برائحة"],
    ["يومي", "عرض"],
    ["منظف", "ممسحة", "تنظيف"],
    45,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${grade}`,
  ),
  F(
    "kt",
    "kitchen-tools",
    ["تيفال", "بيرندز", "لوك", "زارا هوم", "ايكيا", "التوحيد", "رنين", "براون", "كينوود", "جرانيت مصر"],
    ["4 قطع", "7 قطع", "10 قطع", "12 قطعة", "طقم عروس"],
    ["حلل", "سكاكين", "أطباق", "معالق", "صينية", "كوستر"],
    ["جرانيت", "ستانلس", "زجاج", "سيراميك"],
    ["عادي", "عروس", "فاخر"],
    ["حلل", "سكاكين", "أطباق", "طقم حلل"],
    320,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "bt",
    "bathroom",
    HOME_BRANDS,
    ["قطعة", "طقم 3", "طقم 5"],
    ["دواسة", "ستارة حمام", "سلة غسيل", "حافظة", "مشاية"],
    FASHION_COLORS,
    ["عادي", "مقاوم ماء"],
    ["حمام", "دواسة", "ستارة حمام"],
    95,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color}`,
  ),
  F(
    "st2",
    "storage",
    HOME_BRANDS,
    ["صغير", "متوسط", "كبير", "3 أدوار"],
    ["صندوق", "رف", "منظم دولاب", "عربية خضار"],
    ["شفاف", "أبيض", "رمادي"],
    ["بلاستيك", "قماش", "معدن"],
    ["منظم", "تخزين", "صندوق"],
    85,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "dc",
    "decor",
    HOME_BRANDS,
    ["صغير", "متوسط", "كبير"],
    ["نجف", "اباجورة", "مراية", "تابلوه", "فاز"],
    ["ذهبي", "أسود", "أبيض", "نحاسي"],
    ["مودرن", "كلاسيك", "نحاسي"],
    ["نجف", "ديكور", "مراية", "اباجورة"],
    420,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "pc",
    "personal-care",
    APPLIANCE_BRANDS.slice(0, 18),
    ["سفر", "منزلي", "بروفيشنال"],
    ["سشوار", "مكواة شعر", "ماكينة حلاقة", "فرشاة أسنان كهربا"],
    ["أسود", "ذهبي", "أبيض"],
    ["عادي", "أيوني", "سيراميك"],
    ["سشوار", "مكواة شعر"],
    380,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "tr",
    "travel",
    FASHION_BRANDS,
    ["20 بوصة", "24 بوصة", "28 بوصة", "طقم 3"],
    ["شنطة سفر", "عربية أطفال سفر", "وسادة رقبة"],
    ["أسود", "كحلي", "أحمر"],
    ["قماش", "صلب"],
    ["سفر", "شهر العسل", "شنطة سفر"],
    650,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color}`,
  ),
  F(
    "em",
    "emergency",
    ["فينوس", "إيديال", "رنين", "جوميا بيسكس", "نايلون مصر"],
    ["قطعة", "طقم"],
    ["طفاية", "شنطة إسعاف", "كشاف", "بطارية"],
    ["أحمر", "أخضر"],
    ["عادي", "معتمد"],
    ["طوارئ", "طفاية"],
    120,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${grade}`,
  ),
  F(
    "bd",
    "bridal-wear",
    FASHION_BRANDS,
    ["S", "M", "L", "XL", "XXL", "مقاس خاص"],
    ["فستان فرح", "عباية كتب كتاب", "طرحة", "قفازات", "طرحة مع فستان"],
    ["أبيض", "أوفايت", "ذهبي", "روز"],
    ["بسيط", "مطرز", "ذيل"],
    ["فستان فرح", "كتب الكتاب", "طرحة"],
    2800,
    (b, size, kind, color, grade) => `${kind} ${b} مقاس ${size} ${color} ${grade}`,
  ),
  F(
    "ax",
    "accessories",
    FASHION_BRANDS,
    ["قطعة", "طقم"],
    ["مريلة", "حزام", "اسكارف", "قبعة", "نظارة"],
    FASHION_COLORS,
    ["يومي", "سهرة"],
    ["إكسسوار", "رفايع", "مريلة"],
    75,
    (b, size, kind, color, grade) => `${kind} ${b} ${color} ${grade}`,
  ),
  F(
    "ph",
    "phones",
    TECH_BRANDS,
    ["64 جيجا", "128 جيجا", "256 جيجا", "512 جيجا", "1 تيرا", "32 جيجا", "8+256", "12+512", "16+1T", "4+128", "6+128", "8+128"],
    [
      "فئة A",
      "فئة S",
      "نوت",
      "رينو",
      "ريدمي",
      "بوكو",
      "سبارك",
      "هوت",
      "كامون",
      "نورد",
      "فلاجشيب",
      "قابل للطي",
      "جيمنج",
      "كاميرا برو",
      "ميني",
      "بلس",
      "أولترا",
      "سي",
      "واي",
      "نوفا",
      "إيج",
      "جي تي",
      "بكسيل كلاس",
      "اقتصادي",
      "فئة وسط",
      "5G ماكس",
      "دوال شريحة",
      "مقاوم ماء",
      "شحن سريع",
      "بطارية كبيرة",
    ],
    TECH_COLORS,
    ["4G", "5G", "8 رام", "12 رام", "16 رام", "دوال SIM"],
    ["موبايل", "موبيل", "تليفون", "ايفون", "آيفون", "اندرويد", "هاتف"],
    4200,
    (b, size, kind, color, grade) => `موبايل ${b} ${kind} ${size} ${color} ${grade}`,
  ),
  F(
    "lp",
    "laptops",
    LAPTOP_BRANDS,
    ["8 رام", "16 رام", "32 رام", "64 رام", "i5", "i7", "Ryzen 5", "Ryzen 7", "M3", "M4"],
    [
      "أولترا بوك",
      "جيمنج",
      "محطة عمل",
      "2 في 1",
      "دراسة",
      "مكتب",
      "خفيفة",
      "15 بوصة",
      "14 بوصة",
      "16 بوصة",
      "OLED",
      "RTX",
      "طلاب",
      "هندسة",
      "مونتاج",
    ],
    TECH_COLORS,
    ["256 SSD", "512 SSD", "1 تيرا SSD", "HDD+SSD"],
    ["لابتوب", "لاب", "كمبيوتر محمول", "نوت بوك"],
    14500,
    (b, size, kind, color, grade) => `لابتوب ${b} ${kind} ${size} ${color} ${grade}`,
  ),
  F(
    "tb",
    "tablets",
    TECH_BRANDS,
    ["64 جيجا", "128 جيجا", "256 جيجا", "512 جيجا", "واي فاي", "LTE"],
    ["10 بوصة", "11 بوصة", "12.9 بوصة", "دراسة", "رسم", "أندرويد", "آيباد كلاس", "أطفال"],
    TECH_COLORS,
    ["واي فاي", "شريحة", "قلم", "كيبورد"],
    ["تابلت", "ايباد", "آيباد"],
    6800,
    (b, size, kind, color, grade) => `تابلت ${b} ${kind} ${size} ${color} ${grade}`,
  ),
  F(
    "gm",
    "gaming",
    ["Sony", "Microsoft", "Nintendo", "Logitech", "Razer", "SteelSeries", "Meta", "Valve", "ASUS", "Samsung"],
    ["ديجيتال", "قرص", "حزمة", "جهاز فقط"],
    ["بلايستيشن 5", "إكس بوكس سيريز", "نينتندو سويتش", "يد تحكم", "سماعة جيمنج", "كرسي", "شاشة 144هرتز", "VR"],
    ["أسود", "أبيض", "أحمر"],
    ["عادي", "برو", "إصدار محدود"],
    ["بلايستيشن", "جيمنج", "اكس بوكس", "سويتش"],
    8900,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "gr",
    "grocery",
    ["جهينة", "المراعي", "العروسة", "السكر", "إيزيس", "دومتي", "بسكولاتا", "هيرو", "فاين", "أبو قوس"],
    ["كيلو", "كيس 5 كيلو", "علبة", "كرتونة", "لتر", "عرض 2"],
    ["زيت", "أرز", "سكر", "مكرونة", "شاي", "بن", "لبن", "جبنة", "تونة", "مربى"],
    ["عادي", "لايت"],
    ["يومي", "عرض"],
    ["بقالة", "زيت", "أرز", "سكر"],
    35,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${grade}`,
  ),
  F(
    "sp",
    "sports",
    ["نايك", "أديداس", "بوما", "سكيتشرز", "ديكاتلون", "ريبوك", "أندر آرمور", "محلي"],
    ["S", "M", "L", "XL", "2.5 كجم", "5 كجم"],
    ["حذاء جري", "تيشيرت رياضي", "دمبل", "بساط يوجا", "حبل قفز", "شنطة جيم"],
    ["أسود", "أبيض", "أحمر", "أزرق"],
    ["رجال", "حريمي", "يونيسكس"],
    ["رياضة", "جيم", "جري"],
    420,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "au",
    "auto",
    ["موبيل", "شل", "توتال", "بريجستون", "ميشلان", "بوش أوتو", "فيلتر كينج"],
    ["لتر", "4 لتر", "طقم 4"],
    ["زيت موتور", "فلتر هواء", "مساحات", "عطر سيارة", "شاحن", "كاوتش"],
    ["عادي"],
    ["صغير", "سيدان", "SUV"],
    ["عربية", "سيارة", "زيت موتور"],
    280,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${grade}`,
  ),
  F(
    "tl",
    "tools",
    ["بوش", "ماكيتا", "ديوالت", "توتال تولز", "إيجيبت تولز", "محلي"],
    ["قطعة", "طقم", "12 فولت", "18 فولت"],
    ["شنيور", "صاروخ", "متر ليزر", "عدة يد", "منشار"],
    ["أخضر", "أزرق", "أسود"],
    ["هواة", "محترف"],
    ["شنيور", "عدة", "عدد"],
    650,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
  F(
    "pt",
    "pets",
    ["رويال كانين", "ويسكرز", "بدجري", "كيتيكات", "محلي"],
    ["400 جم", "كيلو", "3 كيلو", "كيس"],
    ["أكل قطط", "أكل كلاب", "رمل", "ليتر", "لعبة", "حمالة"],
    ["عادي"],
    ["قطط", "كلاب"],
    ["قطط", "كلاب", "حيوانات"],
    90,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${grade}`,
  ),
  F(
    "of",
    "office",
    ["HP", "كانون", "براذر", "فابر كاستل", "ستيدلر", "محلي"],
    ["باكتة", "علبة", "حبر"],
    ["ورق A4", "حبر طابعة", "قلم", "كرسي مكتب", "دباسة"],
    ["أبيض", "أسود"],
    ["عادي", "عرض"],
    ["مكتبية", "ورق", "حبر"],
    55,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${grade}`,
  ),
  F(
    "gd",
    "garden",
    ["ايكيا", "هومزمارت", "محلي مشتل", "جارينا هوم"],
    ["صغير", "متوسط", "كبير"],
    ["أصيص", "تراب زراعي", "خرطوم ري", "إضاءة بلكونة", "كرسي حديقة"],
    ["أخضر", "ترابي", "أبيض"],
    ["داخلي", "بلكونة"],
    ["حديقة", "بلكونة", "زرع"],
    120,
    (b, size, kind, color, grade) => `${kind} ${b} ${size} ${color} ${grade}`,
  ),
];

const offsets: number[] = [];
let running = 0;
for (const f of families) {
  offsets.push(running);
  running += familySize(f);
}
export const VIRTUAL_SKU_COUNT = running;

/** Brand varies fastest so each page mixes marakat, not 200 SKUs of one fridge. */
function encodeLocal(f: Family, b: number, s: number, k: number, c: number, g: number) {
  return b + f.brands.length * (s + f.sizes.length * (k + f.kinds.length * (c + f.colors.length * g)));
}

function decode(globalIndex: number) {
  if (globalIndex < 0 || globalIndex >= VIRTUAL_SKU_COUNT) return null;
  let fi = 0;
  for (let i = offsets.length - 1; i >= 0; i--) {
    if (globalIndex >= offsets[i]!) {
      fi = i;
      break;
    }
  }
  const family = families[fi]!;
  let n = globalIndex - offsets[fi]!;
  const b = family.brands[n % family.brands.length]!;
  n = Math.floor(n / family.brands.length);
  const s = family.sizes[n % family.sizes.length]!;
  n = Math.floor(n / family.sizes.length);
  const k = family.kinds[n % family.kinds.length]!;
  n = Math.floor(n / family.kinds.length);
  const c = family.colors[n % family.colors.length]!;
  n = Math.floor(n / family.colors.length);
  const g = family.grades[n % family.grades.length]!;
  return {
    family,
    parts: [b, s, k, c, g] as [string, string, string, string, string],
    local: globalIndex - offsets[fi]!,
  };
}

function hashPrice(id: string, base: number) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return Math.max(40, Math.round((base * (1 + ((h >>> 0) % 70) / 100)) / 5) * 5);
}

export function hydrateVirtual(id: string): Product | undefined {
  const m = /^vc-(\d+)$/.exec(id);
  if (!m) return undefined;
  const decoded = decode(Number(m[1]));
  if (!decoded) return undefined;
  const [brand, size, kind, color, grade] = decoded.parts;
  const name = decoded.family.title(brand, size, kind, color, grade);
  const price = hashPrice(id, decoded.family.basePrice);
  const product = makeSku(id, name, brand, decoded.family.category, price, `${size} · ${kind}`);
  product.model = `${decoded.family.key}-${decoded.local}`;
  product.capacity = size;
  product.specs = [
    { label: "الماركة", value: brand },
    { label: "الفئة", value: kind },
    { label: "المقاس / المساحة", value: size },
    { label: "اللون", value: color },
    { label: "الدرجة", value: grade },
    { label: "الاستخدام", value: decoded.family.category === "phones" ? "موبايل سوق مصر" : "جهاز وبيت" },
  ];
  product.highlights = [
    `${size} · ${kind} · ${color} · ${grade}`,
    "تركيبة مرجعية لسوق مصر — مش سحب لحظي من رف التاجر",
    "أفتحي رنين / العربي / جوميا / نون على نفس الاسم",
  ];
  product.listings = VIRTUAL_STORES.map((storeId, i) => ({
    storeId,
    price: Math.max(40, Math.round((price * (1 + (i - 1) * 0.03)) / 5) * 5),
    rating: 4 + (i % 8) / 10,
    reviews: 20 + ((decoded.local + i * 13) % 400),
    inStock: (decoded.local + i) % 17 !== 0,
    shipping:
      storeId === "elaraby" || storeId === "raneen" || storeId === "tawhid-nour" || storeId === "alreyada"
        ? "فرع العربي/رنين/التوحيد/الريادة أو توصيل"
        : "توصيل خلال 2–5 أيام",
    url: listingHref(storeId, shopQueryFromProduct({ id, name, brand, model: product.model, capacity: size })),
    sku: `${id}-${storeId}`.toUpperCase(),
    affiliateNetwork: storeId === "jumia" ? "jumia" : storeId === "noon" ? "noon" : "direct",
  }));
  return product;
}

export function isVirtualId(id: string) {
  return /^vc-\d+$/.test(id);
}

type QueryBits = {
  category?: string;
  brand?: string;
  q?: string;
  capacity?: string;
  kind?: string;
  color?: string;
};

function pickIndexes(list: string[], want?: string) {
  if (!want?.trim()) return list.map((_, i) => i);
  const folded = foldArabic(want);
  const groups = triggeredSynonymGroups(want);
  return list
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => {
      const fv = foldArabic(v);
      if (fv === folded) return true;
      if (folded.length >= 4 && (fv.includes(folded) || folded.includes(fv))) return true;
      if (similarArabic(v, want)) return true;
      if (groups.length && hayMatchesSynonyms(v, groups)) return true;
      if (folded.length < 4) return fv.split(/\s+/).includes(folded);
      return false;
    })
    .map(({ i }) => i);
}

function tokensOf(q?: string) {
  if (!q?.trim()) return [];
  return foldArabic(q)
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}

function familyMatches(f: Family, filters: QueryBits) {
  if (filters.category && f.category !== filters.category) return false;
  const q = filters.q?.trim();
  if (!q) return true;
  const groups = triggeredSynonymGroups(q);
  if (groups.length) {
    const blob = `${f.words.join(" ")} ${f.kinds.join(" ")} ${f.category}`;
    return hayMatchesSynonyms(blob, groups);
  }
  const folded = foldArabic(q);
  if (f.words.some((w) => folded.includes(foldArabic(w)) || similarArabic(w, q))) return true;
  if (pickIndexes(f.brands, q).length && foldArabic(f.brands.join(" ")).includes(folded)) return true;
  if (pickIndexes(f.kinds, q).length) return true;
  if (filters.category) return false;
  return false;
}

function allIdx(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

function assignDims(f: Family, filters: QueryBits) {
  let brandIdx = filters.brand ? pickIndexes(f.brands, filters.brand) : allIdx(f.brands.length);
  let sizeIdx = filters.capacity
    ? pickIndexes(f.sizes, filters.capacity.match(/[\d.]+/)?.[0] ?? filters.capacity)
    : allIdx(f.sizes.length);
  let kindIdx = allIdx(f.kinds.length);
  let colorIdx = allIdx(f.colors.length);
  let gradeIdx = allIdx(f.grades.length);

  if (filters.kind) {
    const hits = pickIndexes(f.kinds, filters.kind);
    if (hits.length) kindIdx = hits;
  }
  if (filters.color) {
    const hits = pickIndexes(f.colors, filters.color);
    if (hits.length) colorIdx = hits;
  }
  if (!brandIdx.length) brandIdx = allIdx(f.brands.length);
  if (!sizeIdx.length) sizeIdx = allIdx(f.sizes.length);

  const skip = new Set(
    [
      ...(filters.brand ? foldArabic(filters.brand).split(/\s+/) : []),
      ...(filters.capacity ? [foldArabic(filters.capacity)] : []),
      ...f.words.map((w) => foldArabic(w)),
    ].filter(Boolean),
  );

  for (const token of tokensOf(filters.q)) {
    if (token.length < 4) continue;
    if (skip.has(token) || [...skip].some((s) => s.includes(token) || token.includes(s))) continue;
    const dims: { hits: number[]; apply: (v: number[]) => void }[] = [
      { hits: pickIndexes(f.brands, token), apply: (v) => (brandIdx = v) },
      { hits: pickIndexes(f.sizes, token), apply: (v) => (sizeIdx = v) },
      { hits: pickIndexes(f.kinds, token), apply: (v) => (kindIdx = v) },
      { hits: pickIndexes(f.colors, token), apply: (v) => (colorIdx = v) },
      { hits: pickIndexes(f.grades, token), apply: (v) => (gradeIdx = v) },
    ];
    const scored = dims.filter((d) => d.hits.length).sort((a, b) => a.hits.length - b.hits.length);
    if (scored[0]) scored[0].apply(scored[0].hits);
  }

  return { brandIdx, sizeIdx, kindIdx, colorIdx, gradeIdx };
}

export function virtualSearch(filters: QueryBits, offset: number, limit: number) {
  const items: Product[] = [];
  let total = 0;
  let skipped = 0;

  for (let fi = 0; fi < families.length; fi++) {
    const f = families[fi]!;
    if (!familyMatches(f, filters)) continue;
    const { brandIdx, sizeIdx, kindIdx, colorIdx, gradeIdx } = assignDims(f, filters);
    const count = brandIdx.length * sizeIdx.length * kindIdx.length * colorIdx.length * gradeIdx.length;
    total += count;
    if (offset >= skipped + count) {
      skipped += count;
      continue;
    }
    const localOff = Math.max(0, offset - skipped);
    const take = Math.min(limit - items.length, Math.max(0, count - localOff));
    if (take <= 0) {
      skipped += count;
      continue;
    }
    const start = offsets[fi]!;
    for (let n = localOff; n < localOff + take; n++) {
      let rest = n;
      const bi = rest % brandIdx.length;
      rest = Math.floor(rest / brandIdx.length);
      const si = rest % sizeIdx.length;
      rest = Math.floor(rest / sizeIdx.length);
      const ki = rest % kindIdx.length;
      rest = Math.floor(rest / kindIdx.length);
      const ci = rest % colorIdx.length;
      rest = Math.floor(rest / colorIdx.length);
      const gi = rest % gradeIdx.length;
      const local = encodeLocal(f, brandIdx[bi]!, sizeIdx[si]!, kindIdx[ki]!, colorIdx[ci]!, gradeIdx[gi]!);
      const p = hydrateVirtual(`vc-${start + local}`);
      if (p) items.push(p);
    }
    skipped += count;
  }

  return { total, items };
}

export function virtualTotalForCategory(category?: string) {
  return families.filter((f) => !category || f.category === category).reduce((n, f) => n + familySize(f), 0);
}

export function virtualFacets(category?: string) {
  const fams = families.filter((f) => !category || f.category === category);
  const uniq = (xs: string[]) => [...new Set(xs)];
  return {
    brands: uniq(fams.flatMap((f) => f.brands)).sort((a, b) => a.localeCompare(b, "ar")),
    kinds: uniq(fams.flatMap((f) => f.kinds)),
    colors: uniq(fams.flatMap((f) => f.colors)),
    sizes: uniq(fams.flatMap((f) => f.sizes)),
  };
}
