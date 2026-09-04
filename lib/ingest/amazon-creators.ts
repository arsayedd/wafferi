import { productFromRow, parsePrice } from "./product-from-row";
import type { Product } from "../types";

const MARKETPLACE = process.env.AMAZON_MARKETPLACE ?? "www.amazon.eg";
const PARTNER = process.env.AMAZON_PARTNER_TAG ?? "";
const TOKEN = process.env.AMAZON_CREATORS_ACCESS_TOKEN ?? "";

export function amazonAsinFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("amazon.")) return null;
    const fromPath = u.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/i);
    if (fromPath) return fromPath[1].toUpperCase();
    const q = u.searchParams.get("asin");
    if (q && /^[A-Z0-9]{10}$/i.test(q)) return q.toUpperCase();
    return null;
  } catch {
    return null;
  }
}

export async function amazonGetItems(asins: string[]): Promise<{ products: Product[]; error?: string }> {
  if (!TOKEN || !PARTNER) {
    return {
      products: [],
      error:
        "Amazon Creators API محتاج AMAZON_CREATORS_ACCESS_TOKEN و AMAZON_PARTNER_TAG في البيئة. من غير مفاتيح مش هنقدر نطلب كتالوج أمازون.",
    };
  }
  const ids = asins.slice(0, 10);
  const res = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
    method: "POST",
    signal: AbortSignal.timeout(15000),
    headers: {
      authorization: `Bearer ${TOKEN}`,
      "content-type": "application/json",
      "x-marketplace": MARKETPLACE,
    },
    body: JSON.stringify({
      itemIds: ids,
      partnerTag: PARTNER,
      marketplace: MARKETPLACE,
      resources: [
        "itemInfo.title",
        "itemInfo.byLineInfo",
        "itemInfo.externalIds",
        "offersV2.listings.price",
        "offersV2.listings.availability",
      ],
    }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    itemsResult?: {
      items?: {
        asin?: string;
        detailPageURL?: string;
        itemInfo?: {
          title?: { displayValue?: string };
          byLineInfo?: { brand?: { displayValue?: string } };
          externalIds?: { eans?: { displayValues?: string[] } };
        };
        offersV2?: {
          listings?: { price?: { money?: { amount?: number } }; availability?: { type?: string } }[];
        };
      }[];
    };
    errors?: { message?: string }[];
  };
  if (!res.ok) {
    return {
      products: [],
      error: data.errors?.[0]?.message ?? `Amazon API ${res.status}`,
    };
  }
  const items = data.itemsResult?.items ?? [];
  const products = items.map((it, i) => {
    const offer = it.offersV2?.listings?.[0];
    const url = it.detailPageURL ?? `https://${MARKETPLACE}/dp/${it.asin}`;
    return productFromRow(
      {
        id: it.asin ?? `amz-${i}`,
        name: it.itemInfo?.title?.displayValue,
        brand: it.itemInfo?.byLineInfo?.brand?.displayValue,
        price: parsePrice(offer?.price?.money?.amount),
        barcode: it.itemInfo?.externalIds?.eans?.displayValues?.[0],
        sku: it.asin,
        url,
        store: "amazon",
        instock: String(offer?.availability?.type ?? "").toLowerCase().includes("out")
          ? "false"
          : "true",
      },
      i,
      url,
    );
  });
  return { products };
}
