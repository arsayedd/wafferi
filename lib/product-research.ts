import { FLAGSHIP_VERSUS } from "./flagship-tech";
import { virtualSearch } from "./virtual-catalog";
import { googleShopUrl, safeShopQuery, shopQueryFromProduct } from "./shop-query";
import type { Product } from "./types";

export function youtubeReviewUrl(product: Product, extra = "review") {
  const q = encodeURIComponent(safeShopQuery(shopQueryFromProduct(product), extra));
  return `https://www.youtube.com/results?search_query=${q}`;
}

export function videoQueries(product: Product) {
  return [
    { id: "review", title: "مراجعة", extra: "review Arabic" },
    { id: "vs", title: "مقارنة", extra: "vs comparison" },
    { id: "camera", title: "كاميرا / تجربة", extra: "camera test" },
  ];
}

export function gsmarenaSearchUrl(product: Product) {
  const q = encodeURIComponent(safeShopQuery(shopQueryFromProduct(product)));
  return `https://www.gsmarena.com/res.php3?sSearch=${q}`;
}

export function mobizilSearchUrl(product: Product) {
  return googleShopUrl(shopQueryFromProduct(product), "mobizil");
}

export function pricenaSearchUrl(product: Product) {
  return googleShopUrl(shopQueryFromProduct(product), "pricena Egypt");
}

export function similarVirtual(product: Product, take = 6) {
  return virtualSearch({ category: product.category, brand: product.brand }, 0, take + 4).items.filter(
    (p) => p.id !== product.id,
  ).slice(0, take);
}

export function versusIds(product: Product) {
  return FLAGSHIP_VERSUS[product.id] ?? [];
}
