export const connectors = [
  {
    id: "json-csv",
    title: "فيد JSON / CSV",
    text: "لوحة جوميا أفلييت، نون، Admitad، ArabClicks، فيسبوك كاتالوج.",
  },
  {
    id: "google-merchant-xml",
    title: "Google Merchant / RSS XML",
    text: "ملفات g:price و g:gtin اللي التجار بيصدّروها لمحركات التسوق.",
  },
  {
    id: "shopify-json",
    title: "Shopify products.json",
    text: "متاجر Shopify: /products/handle.json أو /products.json",
  },
  {
    id: "woocommerce-store-api",
    title: "WooCommerce Store API",
    text: "wp-json/wc/store/v1/products — مواقع الأجهزة المحلية.",
  },
  {
    id: "json-ld",
    title: "schema.org JSON-LD",
    text: "سعر Offer من صفحة المنتج. مش زحف للكتالوج كامل ولا تجاوز حماية.",
  },
  {
    id: "open-graph",
    title: "Open Graph",
    text: "og:title و product:price:amount لو الصفحة معلنة السعر.",
  },
  {
    id: "amazon-creators",
    title: "Amazon Creators API",
    text: "GetItems على amazon.eg بـ ASIN. محتاج توكن Associates في البيئة.",
  },
  {
    id: "css-recipe",
    title: "وصفة CSS للدومين",
    text: "لو الصفحة معلنة السعر في class معيّن. إنتي بتحددي السيلكتور، مش بنلف على الموقع.",
  },
] as const;
