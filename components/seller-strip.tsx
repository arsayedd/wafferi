"use client";

import { getStore } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { StoreLogo } from "@/components/store-logo";
import { ShopLink } from "@/components/shop-link";
import { canShopOut } from "@/lib/store-link";
import { shopQueryFromProduct } from "@/lib/shop-query";
import type { Product } from "@/lib/types";

export function SellerStrip({
  product,
  limit = 24,
}: {
  product: Product;
  limit?: number;
}) {
  const rows = [...product.listings]
    .filter((l) => l.storeId !== "cartlow" && l.storeId !== "carrefour" && canShopOut(l.storeId) && getStore(l.storeId)?.shipsEgypt !== false)
    .sort((a, b) => a.price - b.price);
  const shown = rows.slice(0, limit);
  const extra = rows.length - shown.length;

  if (!rows.length) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((l, i) => {
        const st = getStore(l.storeId);
        return (
          <li key={`${l.storeId}-${l.sku}-${i}`}>
            <ShopLink
              storeId={l.storeId}
              productName={shopQueryFromProduct(product)}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] hover:bg-secondary"
            >
              <StoreLogo name={st?.name ?? l.storeId} website={st?.website} size={16} />
              <span>
                {st?.name ?? l.storeId} {formatPrice(l.price)}
                {!l.inStock ? " ✕" : ""}
              </span>
            </ShopLink>
          </li>
        );
      })}
      {extra > 0 ? <li className="text-[11px] text-muted-foreground">+{extra} بائع</li> : null}
    </ul>
  );
}
