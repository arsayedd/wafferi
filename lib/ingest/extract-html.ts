import type { Product } from "../types";
import { productsFromJsonLd, productsFromOpenGraph } from "./parse-jsonld";
import { productFromRow } from "./product-from-row";
import { recipeForHost, type FieldStrategy, type HostRecipe } from "./recipes";
import { extractCss, extractCssOrAdaptive, extractRegex, extractJsonPath } from "./select";
import { parseMoney } from "./money";
import { votePrices, type PriceCandidate } from "./vote";
import { storeIdFromUrl } from "./host-store";

export function extractHtmlProduct(
  html: string,
  pageUrl: string,
  extraRecipes: HostRecipe[] = [],
): {
  products: Product[];
  candidates: PriceCandidate[];
  needsReview: boolean;
  connector: string;
} {
  const host = new URL(pageUrl).hostname;
  const recipe = recipeForHost(host, extraRecipes);
  const candidates: PriceCandidate[] = [];

  const ld = productsFromJsonLd(html, pageUrl);
  for (const p of ld) {
    const price = p.listings[0]?.price ?? 0;
    if (price) {
      candidates.push({
        price,
        method: "json-ld",
        context: p.name,
        confidence: 0.92,
      });
    }
  }
  const og = productsFromOpenGraph(html, pageUrl);
  for (const p of og) {
    const price = p.listings[0]?.price ?? 0;
    if (price) {
      candidates.push({
        price,
        method: "open-graph",
        context: "Open Graph",
        confidence: 0.75,
      });
    }
  }

  if (recipe?.price) pushStrategy(html, recipe.price, candidates);
  else pushAdaptive(html, candidates);

  const { winner, needsReview } = votePrices(candidates);
  if (!winner) {
    return { products: [], candidates, needsReview: false, connector: "html" };
  }

  const title =
    (recipe?.title ? applyText(html, recipe.title) : "") ||
    ld[0]?.name ||
    og[0]?.name ||
    "منتج من المصدر";
  const product = productFromRow(
    {
      name: title,
      brand: ld[0]?.brand ?? "غير محدد",
      price: winner.price,
      url: pageUrl,
      store: storeIdFromUrl(pageUrl),
      barcode: ld[0]?.barcode,
      sku: ld[0]?.model,
    },
    0,
    pageUrl,
  );
  product.listings[0].price = winner.price;
  return {
    products: [product],
    candidates,
    needsReview,
    connector: winner.method,
  };
}

function applyText(html: string, s: FieldStrategy): string {
  if (s.type === "css" && s.value) return extractCss(html, s.value);
  if (s.type === "regex" && s.value) return extractRegex(html, s.value);
  if (s.type === "json" && s.value) return extractJsonPath(html, s.value);
  return "";
}

function pushAdaptive(html: string, candidates: PriceCandidate[]) {
  const hit = extractCssOrAdaptive(html);
  const price = parseMoney(hit.text);
  if (!price) return;
  candidates.push({
    price,
    method: "css-adaptive",
    context: hit.used,
    confidence: 0.48,
  });
}

function pushStrategy(html: string, s: FieldStrategy, candidates: PriceCandidate[]) {
  if (s.type === "schema_org") {
    pushAdaptive(html, candidates);
    return;
  }
  if (s.type === "css") {
    const hit = extractCssOrAdaptive(html, s.value);
    const price = parseMoney(hit.text);
    if (!price) return;
    candidates.push({
      price,
      method: hit.adaptive ? "css-adaptive" : "css",
      context: hit.used,
      confidence: hit.adaptive ? 0.5 : 0.65,
    });
    return;
  }
  const text = applyText(html, s);
  const price = parseMoney(text);
  if (!price) return;
  candidates.push({
    price,
    method: s.type === "regex" ? "regex" : "json",
    context: s.value ?? s.type,
    confidence: 0.65,
  });
}
