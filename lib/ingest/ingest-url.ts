import type { Product } from "../types";
import { fetchPublic } from "./ssrf";
import { parseProductFeed } from "../parse-feed";
import { parseMerchantXml } from "./parse-xml";
import { productsFromJsonLd, productsFromOpenGraph } from "./parse-jsonld";
import { looksLikeShopify, productsFromShopifyJson, shopifyJsonUrl } from "./parse-shopify";
import { looksLikeWordpress, productsFromWoo, wooStoreApiUrl } from "./parse-woo";
import { amazonAsinFromUrl, amazonGetItems } from "./amazon-creators";

export type IngestResult = {
  products: Product[];
  connector: string;
  error?: string;
};

function looksLikeHtml(body: string, contentType: string) {
  if (contentType.includes("text/html")) return true;
  const head = body.slice(0, 500).toLowerCase();
  return head.includes("<!doctype html") || head.includes("<html");
}

function looksLikeXml(body: string, contentType: string) {
  if (contentType.includes("xml") || contentType.includes("rss") || contentType.includes("atom")) {
    return true;
  }
  const head = body.trim().slice(0, 200);
  return head.startsWith("<?xml") || head.startsWith("<rss") || head.startsWith("<feed");
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const { res, body, contentType } = await fetchPublic(url, "application/json");
    if (!res.ok || looksLikeHtml(body, contentType)) return null;
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export async function ingestFromUrl(rawUrl: string): Promise<IngestResult> {
  const amazonAsin = amazonAsinFromUrl(rawUrl);
  if (amazonAsin && process.env.AMAZON_CREATORS_ACCESS_TOKEN) {
    const amz = await amazonGetItems([amazonAsin]);
    if (amz.products.length) return { products: amz.products, connector: "amazon-creators" };
  }

  const { res, body, contentType, url } = await fetchPublic(
    rawUrl,
    "application/json,text/csv,application/xml,text/xml,text/plain,text/html",
  );
  if (!res.ok) return { products: [], connector: "http", error: `المصدر رجّع ${res.status}` };

  if (!looksLikeHtml(body, contentType)) {
    if (looksLikeXml(body, contentType)) {
      const products = parseMerchantXml(body, url.toString());
      if (!products.length) return { products: [], connector: "xml", error: "XML من غير عناصر منتج" };
      return { products, connector: "google-merchant-xml" };
    }
    const parsed = parseProductFeed(body);
    if (parsed.error) return { products: [], connector: "json-csv", error: parsed.error };
    return { products: parsed.products, connector: "json-csv" };
  }

  const shopUrl = shopifyJsonUrl(url);
  if (shopUrl && looksLikeShopify(body, url)) {
    const json = await fetchJson(shopUrl);
    if (json) {
      const products = productsFromShopifyJson(json, url.toString());
      if (products.length) return { products, connector: "shopify-json" };
    }
  }

  if (looksLikeWordpress(body)) {
    const json = await fetchJson(wooStoreApiUrl(url));
    if (json) {
      const products = productsFromWoo(json, url.toString());
      if (products.length) return { products, connector: "woocommerce-store-api" };
    }
  }

  const ld = productsFromJsonLd(body, url.toString());
  if (ld.length) return { products: ld, connector: "json-ld" };

  const og = productsFromOpenGraph(body, url.toString());
  if (og.length) return { products: og, connector: "open-graph" };

  if (amazonAsin) {
    const amz = await amazonGetItems([amazonAsin]);
    if (amz.products.length) return { products: amz.products, connector: "amazon-creators" };
    return {
      products: [],
      connector: "amazon-creators",
      error:
        amz.error ??
        "صفحة أمازون من غير JSON-LD ظاهر. حطي مفاتيح Creators API أو فيد Associates.",
    };
  }

  return {
    products: [],
    connector: "html",
    error:
      "مقدرناش نلاقي سعر منظم في الصفحة (JSON-LD / Open Graph / Shopify / Woo). حطي فيد CSV/JSON أو رابط منتج فيه schema.org Product — مش هنزحف الكتالوج كامل ولا هنعدّي حماية الموقع.",
  };
}

