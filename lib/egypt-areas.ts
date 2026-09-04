export type EgyptArea = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  cheaper: boolean;
  why: string;
  finds: string[];
  keywords: string[];
  mapsQuery: string;
};

export const egyptAreas: EgyptArea[] = [
  {
    id: "hammam-tlat",
    name: "حمام التلات",
    city: "الجمالية — القاهرة",
    lat: 30.0494,
    lng: 31.2623,
    cheaper: true,
    why: "جملة حلل وطاسات وصواني وتقديم. غالبًا أرخص من المولات لو بتعرفي تساومي.",
    finds: ["حلل", "طاسات", "صواني", "أطباق", "كوبايات", "توابل"],
    keywords: ["حلل", "طاسات", "صواني", "مطبخ", "أطباق", "تقديم", "كنكة", "براد", "سكاكين", "kitchen"],
    mapsQuery: "Hammam El Talat Cairo housewares",
  },
  {
    id: "abdelaziz",
    name: "شارع عبدالعزيز",
    city: "وسط البلد — القاهرة",
    lat: 30.0478,
    lng: 31.2462,
    cheaper: true,
    why: "مقارنة أجهزة على الطبيعة بين محلات متجاورة. سعر كتير بينزل عن الأونلاين لو كاش.",
    finds: ["غسالة", "ثلاجة", "بوتاجاز", "تكييف", "تلفزيون", "رفايع كهربا"],
    keywords: ["غسالة", "ثلاجة", "بوتاجاز", "تكييف", "شاشة", "جهاز", "washer", "fridge"],
    mapsQuery: "Abdel Aziz Street Cairo electronics",
  },
  {
    id: "ataba",
    name: "العتبة",
    city: "وسط القاهرة",
    lat: 30.0526,
    lng: 31.2466,
    cheaper: true,
    why: "أجهزة ورفايع ومفروشات جملة. زحمة بس التنوع والسعر شعبي.",
    finds: ["أجهزة", "مفروشات", "رفايع", "إضاءة"],
    keywords: ["عتبة", "مفروشات", "لحاف", "بطانية", "نجفة", "جهاز"],
    mapsQuery: "Ataba Cairo wholesale",
  },
  {
    id: "nozha",
    name: "شارع النزهة",
    city: "مصر الجديدة",
    lat: 30.0992,
    lng: 31.3458,
    cheaper: false,
    why: "رفايع وأدوات منزل ومفروشات. أهدى من العتبة، الأسعار وسط.",
    finds: ["رفايع", "منظمات", "مفروشات", "ستائر"],
    keywords: ["رفايع", "منظم", "ستائر", "فوط", "نزهة"],
    mapsQuery: "El Nozha Street Heliopolis housewares",
  },
  {
    id: "shubra",
    name: "شارع شبرا",
    city: "شبرا — القاهرة",
    lat: 30.0779,
    lng: 31.2434,
    cheaper: true,
    why: "أدوات منزل ومفروشات بأسعار شعبية.",
    finds: ["رفايع", "مفروشات", "ملابس بيت"],
    keywords: ["شبرا", "مفروشات", "بيت", "فوط"],
    mapsQuery: "Shubra Street Cairo home goods",
  },
  {
    id: "moski",
    name: "الموسكي",
    city: "القاهرة الفاطمية",
    lat: 30.0471,
    lng: 31.2554,
    cheaper: true,
    why: "جملة إكسسوار وأدوات منزل. كميات وسعر حبة.",
    finds: ["إكسسوار", "هدايا", "أدوات منزل"],
    keywords: ["موسكي", "إكسسوار", "هدايا", "جملة"],
    mapsQuery: "Al Moski Cairo",
  },
  {
    id: "sogha",
    name: "الصاغة",
    city: "الموسكي",
    lat: 30.0466,
    lng: 31.2568,
    cheaper: true,
    why: "ذهب حسب السعر العالمي + المصنعية. قارني المصنعية بين الدكاكين.",
    finds: ["شبكات", "دبل", "ذهب"],
    keywords: ["ذهب", "شبكة", "دبل", "صاغة", "مجوهرات", "gold"],
    mapsQuery: "Gold souk Moski Cairo",
  },
  {
    id: "azhar",
    name: "الأزهر — أدوات منزلية",
    city: "الأزهر",
    lat: 30.0456,
    lng: 31.2625,
    cheaper: true,
    why: "محلات أدوات منزل وتقديم جنب حمام التلات.",
    finds: ["تقديم", "أطباق", "صواني"],
    keywords: ["أزهر", "تقديم", "سفرة"],
    mapsQuery: "Al Azhar Cairo housewares",
  },
  {
    id: "damietta",
    name: "مدينة الأثاث بدمياط",
    city: "دمياط",
    lat: 31.4165,
    lng: 31.8133,
    cheaper: true,
    why: "أثاث من المصنع. غرف نوم وصالون أرخص لو تتحمّلي التوصيل.",
    finds: ["غرفة نوم", "صالون", "سفرة", "دولاب"],
    keywords: ["أثاث", "غرفة نوم", "كنب", "سفرة", "دمياط", "furniture"],
    mapsQuery: "Damietta furniture city",
  },
  {
    id: "ikea-mall",
    name: "ايكيا — مول مصر",
    city: "6 أكتوبر",
    lat: 29.9724,
    lng: 31.0174,
    cheaper: false,
    why: "أسعار ثابتة، تنظيم وتخزين ومفروشات واضحة. مش أرخص جملة بس مضمونة.",
    finds: ["تخزين", "مطبخ", "مفروشات", "حمام", "ديكور"],
    keywords: ["ايكيا", "ikea", "تخزين", "منظم", "كفر"],
    mapsQuery: "IKEA Mall of Egypt",
  },
  {
    id: "citystars",
    name: "سيتي ستارز / هوم سنتر",
    city: "مدينة نصر",
    lat: 30.0729,
    lng: 31.3457,
    cheaper: false,
    why: "مولات: لبس، تجميل، هوم سنتر. مناسب للمقارنة السريعة مش للجملة.",
    finds: ["لبس", "مكياج", "أحذية", "ديكور"],
    keywords: ["مول", "سيفورا", "زارا", "هوم سنتر", "لانجري", "فستان", "مكياج"],
    mapsQuery: "City Stars Cairo",
  },
  {
    id: "carrefour-clusters",
    name: "كارفور / هايبر وان",
    city: "تجمّعات القاهرة",
    lat: 30.0074,
    lng: 31.4913,
    cheaper: false,
    why: "عروض أسبوعية على تنظيف ومطبخ صغير. كويس للكميات المتوسطة.",
    finds: ["منظفات", "أكياس", "أجهزة صغيرة", "بقالة جهاز"],
    keywords: ["كارفور", "هايبر", "منظف", "مسحوق", "إسفنج"],
    mapsQuery: "Carrefour Cairo",
  },
];

export function googleMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsDirUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function osmEmbedSrc(lat: number, lng: number) {
  const d = 0.012;
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function matchAreas(q: string): EgyptArea[] {
  const n = q.trim().toLowerCase();
  if (!n) return egyptAreas.filter((a) => a.cheaper);
  const scored = egyptAreas
    .map((a) => {
      let s = 0;
      if (a.name.includes(q.trim()) || a.city.includes(q.trim())) s += 5;
      for (const k of a.keywords) {
        if (n.includes(k.toLowerCase()) || k.toLowerCase().includes(n)) s += 3;
      }
      for (const f of a.finds) {
        if (n.includes(f) || f.includes(q.trim())) s += 2;
      }
      return { a, s };
    })
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s);
  return (scored.length ? scored.map((x) => x.a) : egyptAreas.filter((a) => a.cheaper)).slice(0, 6);
}
