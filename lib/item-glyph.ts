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
  { keys: ["مبرد مياه", "فلتر"], emoji: "💧" },
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
  const bg = `hsl(${h} 42% 93%)`;
  const fg = `hsl(${h} 35% 28%)`;
  const label = input.name.replace(/[<>&"]/g, "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" role="img" aria-label="${label}">
  <rect width="640" height="480" fill="${bg}"/>
  <text x="320" y="210" text-anchor="middle" font-size="120">${emoji}</text>
  <text x="320" y="340" text-anchor="middle" font-size="28" fill="${fg}" font-family="Tahoma, Arial, sans-serif">${label}</text>
</svg>`;
}
