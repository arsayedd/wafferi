import { FLAGSHIP_VERSUS } from "./flagship-tech";
import { virtualSearch } from "./virtual-catalog";
import type { Product } from "./types";

export function youtubeReviewUrl(product: Product) {
  const q = encodeURIComponent(`${product.brand} ${product.name} مراجعة مصر`);
  return `https://www.youtube.com/results?search_query=${q}`;
}

export function youtubeSearchEmbed(query: string) {
  return `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(query)}`;
}

export function videoQueries(product: Product) {
  const base = `${product.brand} ${product.name}`;
  return [
    { id: "review", title: "مراجعة", q: `${base} review Arabic` },
    { id: "vs", title: "مقارنة", q: `${base} vs` },
    { id: "camera", title: "كاميرا / تجربة", q: `${base} camera test` },
  ];
}

export function gsmarenaSearchUrl(product: Product) {
  const q = encodeURIComponent(`${product.brand} ${product.name}`);
  return `https://www.gsmarena.com/res.php3?sSearch=${q}`;
}

export function mobizilSearchUrl(product: Product) {
  const q = encodeURIComponent(`${product.brand} ${product.name}`);
  return `https://www.google.com.eg/search?q=${encodeURIComponent("site:mobizil.com")}%20${q}`;
}

export function pricenaSearchUrl(product: Product) {
  const q = encodeURIComponent(`${product.brand} ${product.name} Egypt`);
  return `https://www.google.com.eg/search?q=${encodeURIComponent("site:eg.pricena.com")}%20${q}`;
}

export function similarVirtual(product: Product, take = 6) {
  return virtualSearch({ category: product.category, brand: product.brand }, 0, take + 4).items.filter(
    (p) => p.id !== product.id,
  ).slice(0, take);
}

export function versusIds(product: Product) {
  return FLAGSHIP_VERSUS[product.id] ?? [];
}
