import { foldArabic } from "./ar-fold";
import type { CategoryId } from "./types";

const RULES: { keys: string[]; emoji: string }[] = [
  { keys: ["ولاع"], emoji: "🔥" },
  { keys: ["دبابيس", "سوسته", "سوستة", "دبوس"], emoji: "📌" },
  { keys: ["سلك مواعين"], emoji: "🧽" },
  { keys: ["مقص"], emoji: "✂️" },
  { keys: ["كاتر"], emoji: "🔪" },
  { keys: ["خيط", "إبره", "ابره", "خياطه", "خياطة"], emoji: "🧵" },
  { keys: ["شطرطون", "لزق", "لاصق"], emoji: "📎" },
  { keys: ["شريط قياس", "متر قياس"], emoji: "📏" },
  { keys: ["مسمار", "مسامير"], emoji: "🔩" },
  { keys: ["خطاف"], emoji: "🪝" },
  { keys: ["فيش", "كهرباء"], emoji: "🔌" },
  { keys: ["لمبه", "لمبة", "لمبات"], emoji: "💡" },
  { keys: ["بطاري"], emoji: "🔋" },
  { keys: ["كشاف"], emoji: "🔦" },
  { keys: ["سلم"], emoji: "🪜" },
  { keys: ["مفك", "عدة", "صندوق ادوات", "صندوق أدوات"], emoji: "🧰" },
  { keys: ["غساله اطباق", "غسالة أطباق", "غساله أطباق"], emoji: "🍽️" },
  { keys: ["غساله", "غسالة"], emoji: "🧺" },
  { keys: ["ثلاج", "تلاج"], emoji: "🧊" },
  { keys: ["فريزر"], emoji: "❄️" },
  { keys: ["تكييف", "مكيف"], emoji: "🌬️" },
  { keys: ["مروحه", "مروحة"], emoji: "🪭" },
  { keys: ["بوتاجاز", "فرن"], emoji: "🔥" },
  { keys: ["مكنسه", "مكنسة"], emoji: "🧹" },
  { keys: ["سخان"], emoji: "🚿" },
  { keys: ["تلفزيون", "تليفزيون", "شاشه", "شاشة"], emoji: "📺" },
  { keys: ["ساوند", "سماع"], emoji: "🔊" },
  { keys: ["خلاط"], emoji: "🫙" },
  { keys: ["ميكرو"], emoji: "📦" },
  { keys: ["مكواه", "مكواة"], emoji: "♨️" },
  { keys: ["قلايه", "قلاية", "اير فراي"], emoji: "🍟" },
  { keys: ["كتل", "غلايه", "غلاية"], emoji: "🫖" },
  { keys: ["سشوار"], emoji: "💨" },
  { keys: ["حلل", "طاسه", "طاسة", "طقم"], emoji: "🍳" },
  { keys: ["سرير", "غرفه نوم", "غرفة نوم", "دولاب"], emoji: "🛏️" },
  { keys: ["كنب", "ركنه", "ركنة", "صالون"], emoji: "🛋️" },
  { keys: ["سفره", "سفرة"], emoji: "🪑" },
  { keys: ["لحاف", "ملايه", "ملاية"], emoji: "🛏️" },
  { keys: ["فوط", "منشف", "مناشف"], emoji: "🧻" },
  { keys: ["نجف"], emoji: "💡" },
  { keys: ["فستان"], emoji: "👗" },
  { keys: ["عبايه", "عباية"], emoji: "🧕" },
  { keys: ["جلابيه", "جلابية", "جلابيه"], emoji: "👘" },
  { keys: ["بيجام"], emoji: "👕" },
  { keys: ["شبشب", "شباشب"], emoji: "🥿" },
  { keys: ["شنط", "شنطه", "كلتش"], emoji: "👜" },
  { keys: ["زركون", "حلق", "سلسل"], emoji: "💍" },
  { keys: ["عطر"], emoji: "🧴" },
  { keys: ["موبايل", "موبيل", "ايفون", "آيفون"], emoji: "📱" },
  { keys: ["لابتوب", "لاب "], emoji: "💻" },
  { keys: ["تابلت", "ايباد"], emoji: "📲" },
  { keys: ["بلايستيشن", "جيمنج", "اكس بوكس"], emoji: "🎮" },
];

const CATEGORY_EMOJI: Partial<Record<CategoryId, string>> = {
  washers: "🧺",
  fridges: "🧊",
  freezers: "❄️",
  acs: "🌬️",
  fans: "🪭",
  stoves: "🔥",
  dishwashers: "🍽️",
  vacuums: "🧹",
  heaters: "🚿",
  water: "💧",
  tvs: "📺",
  audio: "🔊",
  "small-appliances": "🔌",
  "personal-care": "💇",
  bedroom: "🛏️",
  living: "🛋️",
  "kitchen-tools": "🍳",
  textiles: "🧻",
  decor: "🕯️",
  "women-wear": "👗",
  "men-wear": "👘",
  "kids-wear": "🧒",
  "bridal-wear": "👰",
  pajamas: "👕",
  shoes: "🥿",
  bags: "👜",
  jewelry: "💍",
  beauty: "🧴",
  accessories: "🧰",
  cleaning: "🧽",
  bathroom: "🚿",
  storage: "📦",
  travel: "🧳",
  emergency: "🩹",
  baby: "🍼",
  phones: "📱",
  laptops: "💻",
  tablets: "📲",
  gaming: "🎮",
};

function hue(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (h >>> 0) % 360;
}

export function itemEmoji(name: string, category: CategoryId) {
  const blob = foldArabic(name);
  for (const rule of RULES) {
    if (rule.keys.some((k) => blob.includes(foldArabic(k)))) return rule.emoji;
  }
  return CATEGORY_EMOJI[category] ?? "🛒";
}

export function productGlyphSvg(input: { id: string; name: string; category: CategoryId }) {
  const emoji = itemEmoji(input.name, input.category);
  const h = hue(input.id || input.name);
  const bg = `hsl(${h} 38% 92%)`;
  const body = `hsl(${h} 22% 42%)`;
  const door = `hsl(${h} 18% 62%)`;
  const accent = `hsl(${(h + 40) % 360} 45% 48%)`;
  const fg = `hsl(${h} 30% 22%)`;
  const label = input.name.replace(/[<>&"]/g, "").slice(0, 42);
  const cat = input.category;
  let drawing = `<text x="320" y="200" text-anchor="middle" font-size="110">${emoji}</text>`;
  if (cat === "fridges" || cat === "freezers") {
    drawing = `<rect x="210" y="50" rx="18" width="220" height="340" fill="${body}"/>
      <rect x="222" y="62" rx="12" width="196" height="150" fill="${door}"/>
      <rect x="222" y="222" rx="12" width="196" height="152" fill="${door}"/>
      <rect x="390" y="110" width="12" height="54" rx="4" fill="${accent}"/>
      <rect x="390" y="270" width="12" height="54" rx="4" fill="${accent}"/>`;
  } else if (cat === "washers" || cat === "dishwashers") {
    drawing = `<rect x="180" y="70" rx="24" width="280" height="320" fill="${body}"/>
      <circle cx="320" cy="250" r="88" fill="${bg}" stroke="${door}" stroke-width="18"/>
      <circle cx="320" cy="250" r="42" fill="${accent}" opacity="0.35"/>
      <rect x="210" y="95" width="200" height="28" rx="8" fill="${door}"/>`;
  } else if (cat === "acs") {
    drawing = `<rect x="140" y="140" rx="20" width="360" height="160" fill="${body}"/>
      <rect x="160" y="165" width="320" height="18" rx="6" fill="${door}"/>
      <rect x="160" y="200" width="320" height="18" rx="6" fill="${door}"/>
      <rect x="160" y="235" width="220" height="18" rx="6" fill="${door}"/>`;
  } else if (cat === "tvs") {
    drawing = `<rect x="90" y="80" rx="16" width="460" height="280" fill="${body}"/>
      <rect x="110" y="98" width="420" height="230" fill="#111"/>
      <rect x="280" y="360" width="80" height="18" fill="${door}"/>
      <rect x="240" y="378" width="160" height="12" rx="4" fill="${accent}"/>`;
  } else if (cat === "phones" || cat === "tablets") {
    const w = cat === "tablets" ? 200 : 140;
    const x = 320 - w / 2;
    drawing = `<rect x="${x}" y="50" rx="28" width="${w}" height="340" fill="${body}"/>
      <rect x="${x + 10}" y="72" width="${w - 20}" height="280" rx="12" fill="#111"/>
      <circle cx="320" cy="372" r="10" fill="${accent}"/>`;
  } else if (cat === "laptops") {
    drawing = `<rect x="120" y="70" rx="10" width="400" height="230" fill="${body}"/>
      <rect x="140" y="88" width="360" height="190" fill="#111"/>
      <rect x="90" y="300" rx="8" width="460" height="70" fill="${door}"/>
      <rect x="200" y="318" width="240" height="10" rx="4" fill="${accent}"/>`;
  } else if (cat === "stoves") {
    drawing = `<rect x="140" y="80" rx="12" width="360" height="300" fill="${body}"/>
      <circle cx="230" cy="160" r="36" fill="${bg}" stroke="${accent}" stroke-width="8"/>
      <circle cx="410" cy="160" r="36" fill="${bg}" stroke="${accent}" stroke-width="8"/>
      <circle cx="230" cy="250" r="36" fill="${bg}" stroke="${accent}" stroke-width="8"/>
      <circle cx="410" cy="250" r="36" fill="${bg}" stroke="${accent}" stroke-width="8"/>`;
  } else if (cat === "gaming") {
    drawing = `<rect x="160" y="150" rx="40" width="320" height="160" fill="${body}"/>
      <circle cx="230" cy="230" r="28" fill="${accent}"/>
      <circle cx="410" cy="230" r="28" fill="${door}"/>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" role="img" aria-label="${label}">
  <rect width="640" height="480" fill="${bg}"/>
  ${drawing}
  <text x="320" y="455" text-anchor="middle" font-size="18" fill="${fg}" font-family="Tahoma, Arial, sans-serif">${label}</text>
</svg>`;
}
