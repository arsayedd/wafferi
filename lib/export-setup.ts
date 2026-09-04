import { getStore } from "./catalog";
import { cheapestListing } from "./catalog";
import type { ListItem, Product } from "./types";

function csvCell(v: string | number) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function setupToCsv(
  name: string,
  items: ListItem[],
  resolve: (id: string) => Product | undefined,
) {
  const header = [
    "Category",
    "Product",
    "Brand",
    "Model",
    "Store",
    "Price",
    "Discount",
    "Rating",
    "Reviews",
    "Stock",
    "URL",
    "Selected",
  ];
  const lines = [header.join(",")];
  for (const item of items) {
    const p = resolve(item.productId);
    if (!p) continue;
    const offer =
      (item.storeId ? p.listings.find((l) => l.storeId === item.storeId) : undefined) ??
      cheapestListing(p);
    const store = getStore(offer.storeId)?.name ?? offer.storeId;
    const disc =
      offer.oldPrice && offer.oldPrice > offer.price
        ? Math.round(((offer.oldPrice - offer.price) / offer.oldPrice) * 100)
        : 0;
    lines.push(
      [
        p.category,
        csvCell(p.name),
        csvCell(p.brand),
        csvCell(p.model),
        csvCell(store),
        offer.price,
        disc,
        offer.rating,
        offer.reviews,
        offer.inStock ? "in_stock" : "out_of_stock",
        csvCell(offer.url),
        item.purchased ? "yes" : "no",
      ].join(","),
    );
  }
  return `\uFEFF${lines.join("\n")}`;
}

export function setupSellersCsv(
  items: ListItem[],
  resolve: (id: string) => Product | undefined,
) {
  const header = [
    "Product",
    "Brand",
    "Category",
    "Store",
    "Price",
    "OldPrice",
    "Rating",
    "Reviews",
    "Stock",
    "Shipping",
    "URL",
    "Chosen",
  ];
  const lines = [header.join(",")];
  for (const item of items) {
    const p = resolve(item.productId);
    if (!p) continue;
    const chosen =
      (item.storeId ? p.listings.find((l) => l.storeId === item.storeId)?.storeId : undefined) ??
      cheapestListing(p).storeId;
    for (const offer of [...p.listings].sort((a, b) => a.price - b.price)) {
      const store = getStore(offer.storeId)?.name ?? offer.storeId;
      lines.push(
        [
          csvCell(p.name),
          csvCell(p.brand),
          p.category,
          csvCell(store),
          offer.price,
          offer.oldPrice ?? "",
          offer.rating,
          offer.reviews,
          offer.inStock ? "in_stock" : "out_of_stock",
          csvCell(offer.shipping),
          csvCell(offer.url),
          offer.storeId === chosen ? "yes" : "no",
        ].join(","),
      );
    }
  }
  return `\uFEFF${lines.join("\n")}`;
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}
