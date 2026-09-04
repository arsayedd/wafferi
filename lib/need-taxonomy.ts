import { arabicIncludes } from "./ar-fold";

export type NeedPri = "must" | "should" | "nice";

export type NeedItem = {
  name: string;
  source: string;
  pri: NeedPri;
};

export type NeedGroup = {
  id: string;
  phase: string;
  title: string;
  blurb: string;
  items: NeedItem[];
};

function i(name: string, source: string, pri: NeedPri = "must"): NeedItem {
  return { name, source, pri };
}

/** قاعدة احتياجات العروسة — بنود للتخطيط، مش كتالوج أسعار لكل سطر. */
export const needGroups: NeedGroup[] = [
  {
    id: "engagement",
    phase: "قبل الجواز",
    title: "الخطوبة",
    blurb: "ذهب ولبس وهدايا وتوزيعات قبل الفرح.",
    items: [
      i("دبلة", "gold"),
      i("شبكة", "gold"),
      i("ساعات", "fashion", "should"),
      i("شنط", "fashion"),
      i("أحذية", "fashion"),
      i("فساتين خروج", "fashion"),
      i("عبايات", "fashion"),
      i("لانجري", "lingerie"),
      i("بيجامات", "lingerie"),
      i("عطور", "beauty"),
      i("مكياج", "beauty"),
      i("عناية بشرة", "beauty"),
      i("عناية شعر", "beauty"),
      i("مانيكير", "beauty", "should"),
      i("بوكس خطوبة", "gifts"),
      i("توزيعات", "gifts"),
      i("دعوات", "gifts", "should"),
      i("ديكور حفلة الخطوبة", "services", "nice"),
      i("مستلزمات تصوير", "gifts", "should"),
    ],
  },
  {
    id: "wedding-day",
    phase: "يوم الفرح",
    title: "تجهيزات الفرح",
    blurb: "فستان وإكسسوار وميكب — وللعريس بدلة.",
    items: [
      i("فستان الزفاف", "bridal"),
      i("طرحة", "bridal"),
      i("تاج", "bridal", "should"),
      i("حذاء العروسة", "fashion"),
      i("كلتش", "fashion"),
      i("إكسسوار شعر", "bridal", "should"),
      i("روب العروسة", "lingerie"),
      i("شبشب", "fashion"),
      i("رموش وعدسات", "beauty", "should"),
      i("أدوات شعر", "beauty"),
      i("بدلة العريس", "fashion"),
      i("قميص وكرافتة", "fashion"),
      i("حذاء العريس", "fashion"),
      i("أزرار كم", "fashion", "nice"),
    ],
  },
  {
    id: "memories",
    phase: "يوم الفرح",
    title: "التصوير والذكريات",
    blurb: "خدمة مصور + منتجات ذكرى.",
    items: [
      i("مصور / فيديو", "services"),
      i("ألبوم فرح", "gifts", "should"),
      i("براويز", "decor"),
      i("دفتر مدعوين", "gifts", "nice"),
      i("كاميرا فورية", "gifts", "nice"),
      i("صندوق ذكريات", "gifts", "should"),
      i("إطار عقد الزواج", "gifts", "should"),
      i("هدايا باسمين", "gifts", "nice"),
      i("لافتة / نيون", "services", "nice"),
    ],
  },
  {
    id: "beauty-box",
    phase: "تجميل",
    title: "بوكس العناية",
    blurb: "روتين البشرة والجسم والشعر قبل الفرح.",
    items: [
      i("غسول وتونر", "beauty"),
      i("سيروم ومرطب", "beauty"),
      i("واقي شمس", "beauty"),
      i("لوشن وسكراب", "beauty"),
      i("جل استحمام", "grocery"),
      i("مزيل عرق", "beauty"),
      i("عطر", "beauty"),
      i("شامبو وبلسم", "beauty"),
      i("ماسك وزيت شعر", "beauty"),
      i("سشوار", "appliances"),
      i("مكواة فرد / تجعيد", "appliances", "should"),
      i("ماكينة تشذيب", "beauty", "should"),
      i("شمع إزالة", "beauty", "should"),
    ],
  },
  {
    id: "nail-tools",
    phase: "تجميل",
    title: "أدوات منيكر وميكب",
    blurb: "رفايع التجميل اللي بترفع متوسط السلة.",
    items: [
      i("قصافة ومبرد", "beauty"),
      i("طلاء ومزيل", "beauty"),
      i("لمبة UV", "beauty", "nice"),
      i("ملقاط وكيرلر", "beauty"),
      i("مراية مكياج", "beauty"),
      i("فرش وبيوتي بلندر", "beauty"),
      i("منظم مكياج", "storage"),
      i("قطن وأعواد", "grocery"),
      i("رولر ثلج / جواشا", "beauty", "nice"),
    ],
  },
  {
    id: "wardrobe",
    phase: "لبس",
    title: "دولاب العروسة",
    blurb: "خروج، بيت، داخلي، إكسسوار.",
    items: [
      i("فساتين وبلوزات", "fashion"),
      i("جينز وبناطيل", "fashion"),
      i("جاكيت ومعطف", "fashion", "should"),
      i("عبايات وطرح", "fashion"),
      i("بيجامات وروبات", "lingerie"),
      i("شباشب بيت", "fashion"),
      i("حمالات وداخلي", "lingerie"),
      i("شرابات وشيبوير", "lingerie", "should"),
      i("شنط وأحذية", "fashion"),
      i("حزام ومحفظة", "fashion", "should"),
      i("نظارة وساعة", "fashion", "nice"),
      i("إكسسوار شعر", "fashion", "should"),
    ],
  },
  {
    id: "honeymoon",
    phase: "شهر العسل",
    title: "سفر وشهر العسل",
    blurb: "لبس بحر + عدة السفر مش شنطة وبس.",
    items: [
      i("ملابس بحر", "fashion"),
      i("فساتين سفر", "fashion"),
      i("شنطة كبيرة وكابينة", "travel"),
      i("حامل باسبور ومحفظة سفر", "travel"),
      i("مكعبات تغليف", "travel"),
      i("شنطة أدوات شخصية", "travel"),
      i("زجاجات سفر", "travel"),
      i("وسادة رقبة وغطاء عين", "travel", "should"),
      i("قفل وميزان شنط", "travel", "should"),
      i("محول كهربا وباور بانك", "travel"),
    ],
  },
  {
    id: "first-week",
    phase: "أول بيت",
    title: "بوكس أول أسبوع",
    blurb: "تطبخي وتنضفي من غير مشوار يومي.",
    items: [
      i("أطباق وكوبايات ومعالق", "kitchen"),
      i("طاسات وحلل وسكينة ولوح", "kitchen"),
      i("مصفاة وعلب حفظ", "housewares"),
      i("فوط وإسفنج", "cleaning"),
      i("أكياس قمامة ومناديل", "grocery"),
      i("منظفات ومعطر", "cleaning"),
      i("ورق مطبخ وفويل واسترتش", "grocery"),
      i("أكياس فريزر", "grocery"),
      i("مناديل حمام", "grocery"),
    ],
  },
  {
    id: "micro-kitchen",
    phase: "مطبخ",
    title: "رفايع المطبخ الصغيرة",
    blurb: "AOV عالي لو اتجمعت في بوكس.",
    items: [
      i("عصّارة ثوم", "housewares"),
      i("قطاعة تفاح / بيتزا", "housewares", "should"),
      i("فاصل بيض ومؤقت", "housewares", "nice"),
      i("فتاحة علب وزجاجات", "housewares"),
      i("مقشرة ومبشرة ليمون", "housewares"),
      i("مقص أعشاب ومطبخ", "housewares"),
      i("صينية ثلج وقوالب سيليكون", "housewares", "should"),
      i("أكواب وملاعق قياس", "housewares"),
      i("قمع وموزّع زيت", "housewares"),
      i("طبق زبدة وحامل موز", "housewares", "nice"),
      i("كلبسات أكياس وميزان", "housewares"),
    ],
  },
  {
    id: "pantry",
    phase: "تنظيم",
    title: "تنظيم المونة والثلاجة",
    blurb: "سوق لوحده: برطمانات وعلب ومنظمات.",
    items: [
      i("برطمانات توابل ورف", "storage"),
      i("علب رز وسكر ودقيق", "storage"),
      i("علب مكرونة وحبوب", "storage"),
      i("برطمان قهوة وشاي", "storage"),
      i("زجاجات زيت وخل", "kitchen"),
      i("منظم ثلاجة وفريزر", "storage"),
      i("حامل بيض ومعلبات", "storage"),
      i("سلال خضار وفاكهة", "storage"),
      i("ملصقات وأكياس", "storage"),
    ],
  },
  {
    id: "laundry",
    phase: "تنظيف",
    title: "ركن الغسيل",
    blurb: "سلة، منشر، مكواة، شماعات.",
    items: [
      i("سلة غسيل وفرّاز", "bathroom"),
      i("منشر غسيل", "storage"),
      i("شماعات وملاقط", "storage"),
      i("مكواة ولوح", "appliances"),
      i("كواية بخار", "appliances", "nice"),
      i("مشط كتان ورولر", "cleaning"),
      i("أكياس غسيل", "storage"),
      i("منظم مسحوق", "storage"),
    ],
  },
  {
    id: "bath-detail",
    phase: "حمام",
    title: "الحمام بالتفصيل",
    blurb: "من الستارة للروب.",
    items: [
      i("رف شاور وموزّع شامبو", "bathroom"),
      i("حامل صابون وفرش أسنان", "bathroom"),
      i("فرشة تواليت وحامل مناديل", "bathroom"),
      i("علاقة فوط ودواسة وستارة", "bathroom"),
      i("سلة مهملات وسلة غسيل", "bathroom"),
      i("منظم مستحضرات وأدوات شعر", "storage"),
      i("مراية مكبرة", "bathroom", "should"),
      i("فوط جسم ويد ووش وشعر", "bathroom"),
      i("روب وشباشب", "lingerie"),
    ],
  },
  {
    id: "bedroom",
    phase: "غرف",
    title: "غرفة النوم",
    blurb: "مفروشات + تنظيم الدولاب.",
    items: [
      i("واقي مرتبة ومخدة", "bedding"),
      i("مخدات وكيس مخدة", "bedding"),
      i("ملايات ولحاف وكفر", "bedding"),
      i("بطانية ومفرش", "bedding"),
      i("كوشنز وأباجورة", "decor", "should"),
      i("منبه", "smart", "nice"),
      i("منظم مجوهرات ومكياج", "storage"),
      i("منظم دولاب وأحذية", "storage"),
      i("تخزين تحت السرير", "storage", "should"),
    ],
  },
  {
    id: "living",
    phase: "غرف",
    title: "المعيشة",
    blurb: "كنب وطاولة وتلفزيون وديكور.",
    items: [
      i("كنب وكراسي", "furniture"),
      i("ترابيزة ووحدات جانبية", "furniture"),
      i("وحدة شاشة", "furniture"),
      i("سجاد وستائر", "bedding"),
      i("كوشنز وthrows", "decor"),
      i("نجف وأباجورات", "decor"),
      i("مرايات وبراويز وفازات", "decor"),
      i("شموع وديفيوزر", "decor"),
    ],
  },
  {
    id: "dining",
    phase: "غرف",
    title: "السفرة",
    blurb: "ترابيزة + تقديم كامل.",
    items: [
      i("سفرة وكراسي", "furniture"),
      i("مفرش ورانر وبلايس مات", "bedding"),
      i("مناديل سفرة", "housewares", "should"),
      i("أطباق وبولات ومعالق", "kitchen"),
      i("صواني تقديم وبولة سلطة", "kitchen"),
      i("حامل تورتة وسكينة", "kitchen", "nice"),
      i("طقم شاي وقهوة", "kitchen"),
      i("إبريق وكاسات وكوسترات", "kitchen"),
    ],
  },
  {
    id: "toolkit",
    phase: "عدة",
    title: "عدة البيت",
    blurb: "اللي بيتنسي لحد ما تحتاجي مسمار.",
    items: [
      i("طقم مفكات ومطرقة وزرادية", "tools"),
      i("متر وقطاعة ومقص", "tools"),
      i("مفاتيح ألن ومسامير", "tools"),
      i("خطافات وغراء ولزق", "tools"),
      i("شريط كهربا ومشترك", "tools"),
      i("كشاف وبطاريات ولمبات", "tools"),
      i("علبة خياطة", "tools", "should"),
    ],
  },
  {
    id: "smart-home",
    phase: "بيت ذكي",
    title: "البيت الذكي",
    blurb: "لمبات وبلج وكاميرات لو المنصة حديثة.",
    items: [
      i("لمبات ومفاتيح ذكية", "smart", "should"),
      i("كاميرات وجرس فيديو", "smart", "nice"),
      i("سماعة ذكية", "smart", "nice"),
      i("مكنسة روبوت", "appliances", "nice"),
      i("ميزان هوا ومنقّي هواء", "smart", "nice"),
      i("كتل قهوة ذكي", "smart", "nice"),
    ],
  },
  {
    id: "fragrance",
    phase: "ديكور",
    title: "عطور البيت",
    blurb: "شموع وبخور وديفيوزر.",
    items: [
      i("شموع معطرة", "decor"),
      i("عيدان / ديفيوزر كهربا", "decor"),
      i("بخاخ جو ومفروشات", "cleaning"),
      i("معطر دولاب", "decor", "should"),
      i("بخور وعطور زيت", "faith"),
    ],
  },
  {
    id: "personalized",
    phase: "هدايا",
    title: "منتجات باسمين",
    blurb: "طلبات مخصّصة — تطريز وحفر.",
    items: [
      i("فوط وروبات باسم", "gifts", "nice"),
      i("مجات وأطباق باسم", "gifts", "nice"),
      i("إطار فرح ولافتة اسم", "gifts", "should"),
      i("بيجامات زوجين", "lingerie", "nice"),
      i("شنط شهر عسل مطرّزة", "travel", "nice"),
    ],
  },
  {
    id: "faith",
    phase: "أول بيت",
    title: "ركن الصلاة",
    blurb: "سجاد ومصحف وبخور.",
    items: [
      i("سجادات صلاة", "faith"),
      i("مصحف وحامل", "faith"),
      i("سبحة وبوكس صلاة", "faith", "should"),
      i("لوحات آيات", "faith", "nice"),
    ],
  },
  {
    id: "pets",
    phase: "بعد الجواز",
    title: "لو عندكم حيوان",
    blurb: "اختياري — مش جزء من كل جهاز.",
    items: [
      i("سرير أليف", "gifts", "nice"),
      i("أطباق أكل ونافورة", "gifts", "nice"),
      i("صندوق رمل وحامل سفر", "gifts", "nice"),
      i("ألعاب وأدوات تهذيب", "gifts", "nice"),
    ],
  },
  {
    id: "baby",
    phase: "بعد الجواز",
    title: "تجهيز المستقبل",
    blurb: "بعد الجواز، مش أول يوم.",
    items: [
      i("لبس ومفروشات بيبي", "gifts", "nice"),
      i("حمام وإرضاع", "gifts", "nice"),
      i("عربية ومقعد سيارة", "gifts", "nice"),
      i("مونيتور وألعاب", "gifts", "nice"),
      i("أثاث غرفة أطفال", "furniture", "nice"),
    ],
  },
  {
    id: "grocery",
    phase: "أول بيت",
    title: "بقالة أول شهر",
    blurb: "رز وزيت ومنظفات من الهايبر.",
    items: [
      i("رز ومكرونة ودقيق", "grocery"),
      i("سكر وملح وزيت وسمنة", "grocery"),
      i("شاي وقهوة ونسكافيه", "grocery"),
      i("توابل وصلصة وبقول", "grocery"),
      i("مياه ومناديل", "grocery"),
      i("مسحوق ومنعم وصابون وشامبو", "grocery"),
    ],
  },
];

export const lifePhases = [...new Set(needGroups.map((g) => g.phase))];

export const needItemCount = needGroups.reduce((n, g) => n + g.items.length, 0);

export function searchNeeds(q: string): { group: NeedGroup; items: NeedItem[] }[] {
  const raw = q.trim();
  return needGroups
    .map((group) => ({
      group,
      items: raw
        ? group.items.filter(
            (it) =>
              arabicIncludes(it.name, raw) ||
              arabicIncludes(group.title, raw) ||
              arabicIncludes(group.phase, raw),
          )
        : group.items,
    }))
    .filter((row) => row.items.length);
}

export function needsForSources(sourceIds: string[], pri?: NeedPri): NeedItem[] {
  const set = new Set(sourceIds);
  return needGroups.flatMap((g) =>
    g.items.filter((it) => set.has(it.source) && (!pri || it.pri === pri)),
  );
}
