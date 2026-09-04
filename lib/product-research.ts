import { virtualSearch } from "@/lib/virtual-catalog";
import type { Product } from "@/lib/types";

export function youtubeReviewUrl(product: Product) {
  const q = encodeURIComponent(`${product.brand} ${product.name} مراجعة مصر`);
  return `https://www.youtube.com/results?search_query=${q}`;
}

export function gsmarenaSearchUrl(product: Product) {
  const q = encodeURIComponent(`${product.brand} ${product.model} ${product.capacity ?? ""}`);
  return `https://www.gsmarena.com/res.php3?sSearch=${q}`;
}

export function mobizilSearchUrl(product: Product) {
  const q = encodeURIComponent(`${product.brand} ${product.capacity ?? ""}`);
  return `https://www.google.com.eg/search?q=${encodeURIComponent("site:mobizil.com")}%20${q}`;
}

export function similarVirtual(product: Product, take = 6) {
  return virtualSearch({ category: product.category, brand: product.brand }, 0, take + 4).items.filter(
    (p) => p.id !== product.id,
  ).slice(0, take);
}
