export type StockStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "preorder"
  | "backorder"
  | "unknown";

export function parseStock(raw: unknown, quantity?: number): { status: StockStatus; quantity?: number } {
  const t = String(raw ?? "").toLowerCase();
  if (quantity != null && quantity <= 0) return { status: "out_of_stock", quantity: 0 };
  if (quantity != null && quantity > 0 && quantity <= 5) return { status: "low_stock", quantity };
  if (quantity != null && quantity > 5) return { status: "in_stock", quantity };
  if (/pre-?order|طلب مسبق/.test(t)) return { status: "preorder" };
  if (/backorder|آمر تصنيع/.test(t)) return { status: "backorder" };
  if (/out.?of.?stock|غير متوفر|نفد/.test(t)) return { status: "out_of_stock" };
  if (/in.?stock|متوفر|instock/.test(t)) return { status: "in_stock" };
  if (/low/.test(t)) return { status: "low_stock" };
  return { status: "unknown" };
}
