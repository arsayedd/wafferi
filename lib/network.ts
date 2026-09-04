import type {
  AffiliateNetwork,
  ConnectionStatus,
  ConnectorKind,
  Store,
  StoreKind,
  VerticalId,
} from "./types";
import { mapStores } from "./map-stores";

const ALL_APPLIANCES: VerticalId[] = [
  "laundry",
  "cooling",
  "climate",
  "cooking",
  "cleaning",
  "water_heat",
  "av",
  "small_kitchen",
  "personal_care",
];

const LIFE: VerticalId[] = [
  ...ALL_APPLIANCES,
  "furniture",
  "textiles",
  "decor",
  "fashion_women",
  "fashion_men",
  "fashion_kids",
  "bridal",
  "sleepwear",
  "shoes",
  "bags",
  "jewelry",
  "beauty",
  "accessories",
  "bathroom",
  "storage",
  "travel",
  "emergency",
  "baby",
];

const FASHION: VerticalId[] = [
  "fashion_women",
  "fashion_men",
  "fashion_kids",
  "bridal",
  "sleepwear",
  "shoes",
  "bags",
  "jewelry",
  "beauty",
  "accessories",
];

const BIG_HOME: VerticalId[] = LIFE;
const FURNITURE: VerticalId[] = ["furniture", "textiles", "decor", "small_kitchen"];
const AV: VerticalId[] = ["av", "small_kitchen", "climate"];

function s(
  id: string,
  name: string,
  kind: StoreKind,
  connector: ConnectorKind,
  status: ConnectionStatus,
  network: AffiliateNetwork,
  verticals: VerticalId[],
  extra: {
    city: string;
    website: string;
    specialty: string;
    commissionNote: string;
    skuEstimate: number;
    shipsEgypt?: boolean;
  },
): Store {
  return {
    id,
    name,
    kind,
    connector,
    status,
    network,
    verticals,
    affiliate:
      connector === "affiliate_network" || connector === "direct_affiliate",
    ...extra,
  };
}

export const stores: Store[] = [
  s("jumia", "جوميا", "marketplace", "direct_affiliate", "connected", "jumia", BIG_HOME, {
    city: "كل المحافظات",
    website: "https://www.jumia.com.eg",
    specialty: "ماركتبليس: أجهزة، لبس، بيت، رفايع، عرايس",
    commissionNote: "برنامج جوميا أفلييت المباشر",
    skuEstimate: 180000,
  }),
  s("noon", "نون", "marketplace", "direct_affiliate", "connected", "noon", BIG_HOME, {
    city: "كل المحافظات",
    website: "https://www.noon.com/egypt-ar",
    specialty: "ماركتبليس + نون دقائق لأجهزة صغيرة",
    commissionNote: "affiliates.noon.com / ArabClicks",
    skuEstimate: 140000,
  }),
  s("amazon", "أمازون مصر", "marketplace", "direct_affiliate", "connected", "direct", BIG_HOME, {
    city: "أونلاين",
    website: "https://www.amazon.eg",
    specialty: "تشكيلة واسعة وتقييمات عالمية",
    commissionNote: "Amazon Associates مصر عند التفعيل",
    skuEstimate: 90000,
  }),
  s("cartlow", "كارتلو", "marketplace", "affiliate_network", "outreach", "arabclicks", ALL_APPLIANCES, {
    city: "مش سوق مصر",
    website: "https://cartlow.com",
    specialty: "مجدّد إقليمي — مش كتالوج جهاز مصري",
    commissionNote: "مش معروض كبائع مصر",
    skuEstimate: 0,
    shipsEgypt: false,
  }),
  s("btech", "بي تك", "electronics", "affiliate_network", "connected", "arabclicks", ALL_APPLIANCES, {
    city: "القاهرة والجيزة والإسكندرية",
    website: "https://btech.com",
    specialty: "أجهزة كهربائية وخدمات تركيب",
    commissionNote: "ArabClicks / شراكة سلسلة",
    skuEstimate: 12000,
  }),
  s("twob", "2B", "electronics", "affiliate_network", "connected", "arabclicks", ALL_APPLIANCES, {
    city: "القاهرة",
    website: "https://2b.com.eg",
    specialty: "إلكترونيات وأجهزة منزلية",
    commissionNote: "شبكات أفلييت أو عقد مباشر",
    skuEstimate: 9000,
  }),
  s("raya", "راية شوب", "electronics", "affiliate_network", "connected", "arabclicks", ALL_APPLIANCES, {
    city: "فروع راية",
    website: "https://rayashop.com",
    specialty: "أجهزة وإلكترونيات استهلاكية",
    commissionNote: "عبر الشبكات",
    skuEstimate: 7000,
  }),
  s("raneen", "رنين", "electronics", "partnership", "connected", "direct", ALL_APPLIANCES, {
    city: "فروع متعددة",
    website: "https://raneen.com",
    specialty: "أجهزة وأدوات منزل بأسعار تنافسية",
    commissionNote: "شراكة مباشرة / عمولة لياد",
    skuEstimate: 6000,
  }),
  s("tradeline", "تريدلاين", "electronics", "affiliate_network", "affiliate_ready", "arabclicks", [...ALL_APPLIANCES, "av"], {
    city: "القاهرة",
    website: "https://tradeline.com.eg",
    specialty: "موبايلات وأجهزة منزلية",
    commissionNote: "ArabClicks / Admitad",
    skuEstimate: 5000,
  }),
  s("compume", "كمبيو مي", "electronics", "affiliate_network", "affiliate_ready", "admitad", AV, {
    city: "القاهرة",
    website: "https://compume.com",
    specialty: "كمبيوتر وشاشات وصوتيات",
    commissionNote: "Admitad",
    skuEstimate: 4000,
  }),
  s("contact", "كونتاكت", "electronics", "partnership", "feed_pending", "direct", ALL_APPLIANCES, {
    city: "فروع",
    website: "https://contact.com.eg",
    specialty: "تقسيط أجهزة وإلكترونيات",
    commissionNote: "فيد أسعار + لياد تقسيط",
    skuEstimate: 3500,
  }),
  s("itouch", "آي تاتش", "electronics", "affiliate_network", "affiliate_ready", "arabclicks", AV, {
    city: "أونلاين",
    website: "https://itouch.store",
    specialty: "أبل وإلكترونيات",
    commissionNote: "شبكات أفلييت",
    skuEstimate: 2000,
  }),
  s("elnekhely", "النخيلي", "electronics", "partnership", "outreach", "direct", ALL_APPLIANCES, {
    city: "القاهرة",
    website: "https://elnekhely.com",
    specialty: "أجهزة منزلية بالتقسيط",
    commissionNote: "شراكة سلسلة محلية",
    skuEstimate: 2500,
  }),
  s("olympic", "أوليمبيك إلكتريك", "electronics", "official_feed", "feed_pending", "direct", ALL_APPLIANCES, {
    city: "مصنع + فروع",
    website: "https://olympicelectric.com",
    specialty: "فريش / يونيون إير / تصنيع محلي",
    commissionNote: "فيد رسمي من المجموعة",
    skuEstimate: 3000,
  }),
  s("hardwarehub", "هاردوير هب", "electronics", "partnership", "outreach", "direct", AV, {
    city: "أونلاين",
    website: "https://hardwarehub-eg.com",
    specialty: "مكونات كمبيوتر وشاشات",
    commissionNote: "شراكة محتوى تقني",
    skuEstimate: 1500,
  }),
  s("carrefour", "كارفور", "hypermarket", "affiliate_network", "connected", "arabclicks", [...ALL_APPLIANCES, "textiles"], {
    city: "فروع هايبر",
    website: "https://www.carrefouregypt.com",
    specialty: "أجهزة صغيرة وأدوات مطبخ وأجهزة كبيرة",
    commissionNote: "عبر الشبكات",
    skuEstimate: 8000,
  }),
  s("hyperone", "هايبر وان", "hypermarket", "partnership", "affiliate_ready", "direct", ALL_APPLIANCES, {
    city: "الشيخ زايد / تجمّعات",
    website: "https://hyperone.com.eg",
    specialty: "هايبر ماركت بأجهزة منزلية",
    commissionNote: "شراكة تجارية / فيد عروض",
    skuEstimate: 4000,
  }),
  s("spinneys", "سبينيس", "hypermarket", "affiliate_network", "feed_pending", "arabclicks", ["small_kitchen", "personal_care", "cleaning"], {
    city: "القاهرة",
    website: "https://spinneys-egypt.com",
    specialty: "أجهزة مطبخ صغيرة وعناية",
    commissionNote: "شبكات عند التفعيل",
    skuEstimate: 1200,
  }),
  s("seoudi", "سعودي", "hypermarket", "partnership", "outreach", "direct", ["small_kitchen", "cleaning", "cooking"], {
    city: "القاهرة",
    website: "https://seoudi.com",
    specialty: "سوبرماركت وأجهزة صغيرة",
    commissionNote: "لياد محلي",
    skuEstimate: 900,
  }),
  s("metro", "مترو ماركت", "hypermarket", "partnership", "outreach", "direct", ["small_kitchen", "cleaning"], {
    city: "فروع",
    website: "https://metro-markets.com",
    specialty: "بقالة وأجهزة صغيرة",
    commissionNote: "شراكة سلسلة",
    skuEstimate: 700,
  }),
  s("elaraby", "العربي جروب", "brand", "brand_portal", "connected", "direct", ALL_APPLIANCES, {
    city: "مصنع + فروع",
    website: "https://www.elarabygroup.com",
    specialty: "توشيبا العربي وخدمات ما بعد البيع",
    commissionNote: "بوابة علامة محلية",
    skuEstimate: 2500,
  }),
  s("fresh", "فريش الرسمي", "brand", "official_feed", "feed_pending", "direct", ALL_APPLIANCES, {
    city: "مصر",
    website: "https://fresh.com.eg",
    specialty: "أجهزة فريش المصنّعة محليًا",
    commissionNote: "فيد رسمي من المصنع",
    skuEstimate: 1800,
  }),
  s("unionaire", "يونيون إير الرسمي", "brand", "official_feed", "feed_pending", "direct", ["climate", "cooling", "cooking", "laundry"], {
    city: "مصر",
    website: "https://unionaire.com",
    specialty: "تكييف وأجهزة بيضاء",
    commissionNote: "فيد وكلاء",
    skuEstimate: 1600,
  }),
  s("kiriazi", "كريازي", "brand", "official_feed", "feed_pending", "direct", ["cooling", "laundry", "cooking", "climate"], {
    city: "مصر",
    website: "https://kiriazi.com",
    specialty: "ثلاجات وغسالات وبوتاجازات",
    commissionNote: "فيد رسمي / وكلاء",
    skuEstimate: 1400,
  }),
  s("samsung", "سامسونج شوب", "brand", "brand_portal", "affiliate_ready", "direct", ["av", "laundry", "cooling", "climate", "small_kitchen"], {
    city: "أونلاين + فروع",
    website: "https://www.samsung.com/eg",
    specialty: "أجهزة سامسونج الرسمية",
    commissionNote: "بوابة علامة / أفلييت إقليمي",
    skuEstimate: 2200,
  }),
  s("lgshop", "إل جي شوب", "brand", "brand_portal", "affiliate_ready", "direct", ["av", "laundry", "cooling", "climate", "small_kitchen"], {
    city: "أونلاين",
    website: "https://www.lg.com/eg",
    specialty: "غسالات وشاشات وتكييف إل جي",
    commissionNote: "بوابة علامة",
    skuEstimate: 2000,
  }),
  s("boschshop", "بوش هوم", "brand", "brand_portal", "feed_pending", "direct", ["cooking", "cleaning", "laundry", "small_kitchen"], {
    city: "وكلاء مصر",
    website: "https://www.bosch-home.com",
    specialty: "أجهزة بوش المدمجة والمستقلة",
    commissionNote: "فيد وكيل حصري",
    skuEstimate: 800,
  }),
  s("bekoshop", "بيكو مصر", "brand", "official_feed", "feed_pending", "direct", ["laundry", "cooling", "cooking", "climate"], {
    city: "وكلاء",
    website: "https://www.beko.com/eg-ar",
    specialty: "أجهزة بيكو البيضاء",
    commissionNote: "فيد رسمي",
    skuEstimate: 900,
  }),
  s("homzmart", "هومزمارت", "furniture", "affiliate_network", "connected", "arabclicks", FURNITURE, {
    city: "أونلاين + شووروم",
    website: "https://homzmart.com",
    specialty: "أثاث ومفروشات وأدوات بيت",
    commissionNote: "أفلييت أثاث",
    skuEstimate: 20000,
  }),
  s("ikea", "ايكيا مصر", "furniture", "official_feed", "feed_pending", "direct", FURNITURE, {
    city: "التجمع / مول مصر",
    website: "https://www.ikea.com/eg/ar",
    specialty: "أثاث ومطابخ جاهزة",
    commissionNote: "كاتالوج رسمي",
    skuEstimate: 9000,
  }),
  s("bfurn", "بي فيرن", "furniture", "partnership", "connected", "direct", ["furniture", "decor"], {
    city: "القاهرة",
    website: "https://bfurn.com",
    specialty: "غرف نوم وصالونات محلية",
    commissionNote: "لياد للمتجر المحلي",
    skuEstimate: 600,
  }),
  s("homecentre", "هوم سنتر", "furniture", "affiliate_network", "affiliate_ready", "arabclicks", FURNITURE, {
    city: "مولات",
    website: "https://homecentre.com",
    specialty: "أثاث وإكسسوار منزل",
    commissionNote: "شبكات إقليمية",
    skuEstimate: 5000,
  }),
  s("panemirates", "بان إميريتس", "furniture", "partnership", "outreach", "direct", ["furniture", "decor"], {
    city: "مولات القاهرة",
    website: "https://panemirates.com",
    specialty: "صالونات وغرف نوم",
    commissionNote: "شراكة شووروم",
    skuEstimate: 2000,
  }),
  s("ace", "ايس هاردوير", "local", "partnership", "outreach", "direct", ["cleaning", "climate", "small_kitchen", "decor"], {
    city: "فروع",
    website: "https://acehardware.com.eg",
    specialty: "عدد وأجهزة صغيرة ومراوح",
    commissionNote: "شراكة سلسلة",
    skuEstimate: 3000,
  }),
  s("whitewhale", "وايت ويل", "local", "official_feed", "feed_pending", "direct", ["cooling", "laundry", "climate", "cooking"], {
    city: "وكلاء مصر",
    website: "https://whitewhale-eg.com",
    specialty: "أجهزة بيضاء بسعر اقتصادي",
    commissionNote: "فيد وكلاء",
    skuEstimate: 1100,
  }),
  s("tornado", "تورنيدو", "brand", "official_feed", "feed_pending", "direct", ["climate", "small_kitchen", "cleaning", "laundry"], {
    city: "مصر",
    website: "https://tornado-eg.com",
    specialty: "مراوح وأجهزة صغيرة",
    commissionNote: "فيد رسمي",
    skuEstimate: 1000,
  }),
  s("universal", "يونيفرسال جروب", "local", "partnership", "outreach", "direct", ALL_APPLIANCES, {
    city: "فروع",
    website: "https://universalgroup.com.eg",
    specialty: "توزيع أجهزة منزلية",
    commissionNote: "شراكة موزّع",
    skuEstimate: 2200,
  }),
  s("kazyon", "كازيون", "hypermarket", "partnership", "outreach", "direct", ["small_kitchen", "cleaning"], {
    city: "فروع تخفيض",
    website: "https://kazyon.com",
    specialty: "أجهزة صغيرة رخيصة",
    commissionNote: "لياد عروض أسبوعية",
    skuEstimate: 400,
  }),
  s("breadfast", "بريد فاست مارت", "local", "affiliate_network", "outreach", "direct", ["small_kitchen"], {
    city: "توصيل سريع",
    website: "https://breadfast.com",
    specialty: "أجهزة مطبخ صغيرة للتوصيل السريع",
    commissionNote: "شراكة تطبيق",
    skuEstimate: 200,
  }),
  s("namshi", "نمشي", "fashion", "affiliate_network", "connected", "arabclicks", FASHION, {
    city: "أونلاين مصر",
    website: "https://www.namshi.com",
    specialty: "أزياء وأحذية وشنط",
    commissionNote: "ArabClicks / Noon fashion",
    skuEstimate: 40000,
  }),
  s("sixthstreet", "6th Street", "fashion", "affiliate_network", "connected", "arabclicks", FASHION, {
    city: "أونلاين",
    website: "https://www.6thstreet.com",
    specialty: "ملابس وماركات عالمية",
    commissionNote: "شبكات أفلييت",
    skuEstimate: 35000,
  }),
  s("max", "ماكس فاشن", "fashion", "partnership", "affiliate_ready", "direct", FASHION, {
    city: "مولات مصر",
    website: "https://www.maxfashion.com/eg",
    specialty: "لبس عائلي وبيجامات وفوط",
    commissionNote: "شراكة سلسلة",
    skuEstimate: 18000,
  }),
  s("lcw", "السي واكيك", "fashion", "partnership", "affiliate_ready", "direct", FASHION, {
    city: "فروع",
    website: "https://www.lcwaikiki.eg",
    specialty: "لبس يومي وبيجامات وأطفال",
    commissionNote: "فيد سلسلة",
    skuEstimate: 22000,
  }),
  s("hm", "H&M مصر", "fashion", "brand_portal", "feed_pending", "direct", FASHION, {
    city: "مولات",
    website: "https://www2.hm.com/en_eg",
    specialty: "أزياء سريعة",
    commissionNote: "بوابة علامة",
    skuEstimate: 15000,
  }),
  s("centrepoint", "سنتربوينت", "fashion", "affiliate_network", "affiliate_ready", "arabclicks", [...FASHION, "textiles"], {
    city: "مولات",
    website: "https://www.centrepointstores.com",
    specialty: "لبس ومنزل وهوم سنتر",
    commissionNote: "شبكات إقليمية",
    skuEstimate: 25000,
  }),
  s("defacto", "ديفاكتو", "fashion", "affiliate_network", "connected", "admitad", FASHION, {
    city: "أونلاين + فروع",
    website: "https://www.defacto.com.eg",
    specialty: "لبس وبيجامات بأسعار شعبية",
    commissionNote: "Admitad",
    skuEstimate: 12000,
  }),
  s("cottonil", "كوتونيل", "fashion", "official_feed", "feed_pending", "direct", ["sleepwear", "fashion_women", "fashion_men", "textiles"], {
    city: "مصر",
    website: "https://cottonil.com",
    specialty: "بيجامات وملابس داخلية قطن",
    commissionNote: "فيد رسمي",
    skuEstimate: 3000,
  }),
  s("dice", "دايس", "fashion", "partnership", "outreach", "direct", ["fashion_women", "bridal", "bags"], {
    city: "القاهرة",
    website: "https://diceshops.com",
    specialty: "لبس حريمي وعبايات",
    commissionNote: "شراكة محلية",
    skuEstimate: 4000,
  }),
  s("goldenscent", "جولدن سنت", "fashion", "affiliate_network", "affiliate_ready", "arabclicks", ["beauty", "accessories"], {
    city: "أونلاين",
    website: "https://www.goldenscent.com",
    specialty: "عطور وتجميل",
    commissionNote: "شبكات أفلييت",
    skuEstimate: 8000,
  }),
  s("seif", "سيف للتجميل", "local", "partnership", "outreach", "direct", ["beauty", "personal_care"], {
    city: "فروع",
    website: "https://seif.eg",
    specialty: "صيدلية تجميل وعناية",
    commissionNote: "لياد صيدليات",
    skuEstimate: 6000,
  }),
  s("extra", "إكسترا مصر", "electronics", "affiliate_network", "affiliate_ready", "arabclicks", ALL_APPLIANCES, {
    city: "فروع",
    website: "https://www.extra.com/ar-eg",
    specialty: "إلكترونيات وأجهزة منزلية",
    commissionNote: "شبكات إقليمية",
    skuEstimate: 8000,
  }),
  s("dream2000", "دريم 2000", "electronics", "affiliate_network", "connected", "arabclicks", ALL_APPLIANCES, {
    city: "القاهرة",
    website: "https://dream2000.com",
    specialty: "موبايلات وأجهزة",
    commissionNote: "أفلييت / شبكات",
    skuEstimate: 5000,
  }),
  s("radioshack", "راديو شاك مصر", "electronics", "partnership", "affiliate_ready", "direct", [...ALL_APPLIANCES, "av"], {
    city: "فروع",
    website: "https://radioshack.com.eg",
    specialty: "إلكترونيات واكسسوار",
    commissionNote: "شراكة سلسلة",
    skuEstimate: 4500,
  }),
  s("virgin", "فيرجن ميجاستور", "electronics", "partnership", "affiliate_ready", "direct", AV, {
    city: "مولات",
    website: "https://www.virginmegastore.eg",
    specialty: "صوتيات وشاشات",
    commissionNote: "شراكة مولات",
    skuEstimate: 2000,
  }),
  s("gourmet", "جورميه", "hypermarket", "partnership", "affiliate_ready", "direct", ["small_kitchen", "personal_care"], {
    city: "القاهرة",
    website: "https://gourmetegypt.com",
    specialty: "بقالة فاخرة وأجهزة صغيرة",
    commissionNote: "فيد عروض",
    skuEstimate: 800,
  }),
  s("talabatmart", "طلبات مارت", "local", "affiliate_network", "affiliate_ready", "direct", ["small_kitchen", "cleaning"], {
    city: "توصيل سريع",
    website: "https://www.talabat.com/egypt",
    specialty: "مارت سريع للأجهزة الصغيرة",
    commissionNote: "شراكة تطبيق",
    skuEstimate: 600,
  }),
  s("rabbit", "رابت", "local", "partnership", "affiliate_ready", "direct", ["small_kitchen"], {
    city: "القاهرة",
    website: "https://rabbitmart.com",
    specialty: "توصيل دقائق",
    commissionNote: "شراكة تطبيق",
    skuEstimate: 300,
  }),
  s("instashop", "إنستاشوب", "local", "affiliate_network", "affiliate_ready", "direct", ["small_kitchen", "cleaning"], {
    city: "أونلاين",
    website: "https://instashop.com",
    specialty: "توصيل سوبرماركت",
    commissionNote: "شراكة تطبيق",
    skuEstimate: 400,
  }),
  s("olx", "أوليكس مصر", "marketplace", "partnership", "outreach", "direct", BIG_HOME, {
    city: "إعلانات مبوبة",
    website: "https://www.olx.com.eg",
    specialty: "مستعمل وجديد من أفراد — مش فيد أسعار حي",
    commissionNote: "توجيه فقط، من غير زحف الإعلانات",
    skuEstimate: 0,
  }),
  s("hatla2ee", "هتلاقيه", "marketplace", "partnership", "outreach", "direct", ALL_APPLIANCES, {
    city: "إعلانات سيارات وأجهزة",
    website: "https://eg.hatla2ee.com",
    specialty: "إعلانات — مش كتالوج جهاز حي",
    commissionNote: "توجيه",
    skuEstimate: 0,
  }),
  ...mapStores,
];

export const kindLabels: Record<StoreKind, string> = {
  marketplace: "ماركتبليس",
  electronics: "سلاسل أجهزة",
  hypermarket: "هايبر وسوبرماركت",
  brand: "متجر علامة",
  furniture: "أثاث وبيت",
  local: "محلي وموزّعين",
  fashion: "أزياء وتجميل",
  department: "ديبارتمنت / وان ستوب",
  district: "أحياء وأسواق جملة",
  bridal: "بوتيكات فساتين",
  jewelry: "ذهب وإكسسوار",
  beauty_retail: "تجميل وصيدليات",
  factory: "مصانع ومناطق صناعية",
};

export const statusLabels: Record<ConnectionStatus, string> = {
  connected: "متصل في الـ MVP",
  affiliate_ready: "أفلييت جاهز للربط",
  feed_pending: "في انتظار فيد رسمي",
  outreach: "تواصل تجاري",
};

export const connectorLabels: Record<ConnectorKind, string> = {
  affiliate_network: "شبكة أفلييت",
  direct_affiliate: "أفلييت مباشر",
  official_feed: "فيد كاتالوج رسمي",
  brand_portal: "بوابة العلامة",
  partnership: "شراكة / لياد",
};

export const verticalLabels: Record<VerticalId, string> = {
  laundry: "غسيل",
  cooling: "تبريد",
  climate: "تكييف ومراوح",
  cooking: "طبخ",
  cleaning: "تنظيف",
  water_heat: "سخانات ومياه",
  av: "شاشات وصوت",
  small_kitchen: "أجهزة مطبخ صغيرة",
  personal_care: "عناية شخصية",
  furniture: "أثاث",
  textiles: "مفروشات وفوط",
  decor: "ديكور",
  fashion_women: "لبس حريمي",
  fashion_men: "لبس رجالي",
  fashion_kids: "لبس أطفال",
  bridal: "لبس العرايس",
  sleepwear: "بيجامات ومنزلي",
  shoes: "أحذية",
  bags: "شنط",
  jewelry: "إكسسوار وذهب موضة",
  beauty: "عطور وتجميل",
  accessories: "رفايع",
  bathroom: "حمام",
  storage: "تخزين وتنظيم",
  travel: "سفر",
  emergency: "طوارئ",
  baby: "أطفال مستقبلًا",
};

export function catalogStores() {
  return stores.filter(
    (s) => s.kind !== "district" && s.kind !== "factory" && s.shipsEgypt !== false,
  );
}

export function networkStats() {
  const catalog = catalogStores();
  return {
    total: stores.length,
    catalog: catalog.length,
    connected: catalog.filter((x) => x.status === "connected").length,
    ready: catalog.filter(
      (x) =>
        x.status === "connected" ||
        x.status === "affiliate_ready" ||
        x.status === "feed_pending",
    ).length,
    affiliate: stores.filter((x) => x.affiliate).length,
    skuCoverage: stores.reduce((n, x) => n + x.skuEstimate, 0),
  };
}
