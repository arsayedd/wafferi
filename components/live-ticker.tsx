"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useLive } from "@/hooks/use-live";

export function LiveTicker() {
  const { moves } = useLive();
  if (!moves.length) return null;
  return (
    <div className="overflow-hidden border-b bg-primary text-primary-foreground">
      <div className="flex animate-[ticker_40s_linear_infinite] gap-10 whitespace-nowrap px-4 py-2 text-xs">
        {moves.concat(moves).map((m, i) => {
          const down = m.to < m.from;
          return (
            <Link key={`${m.productId}-${m.storeId}-${i}`} href={`/product/${m.productId}`} className="inline-flex gap-2">
              <span className="opacity-80">{m.storeName}</span>
              <span>{m.productName}</span>
              <span className={down ? "text-emerald-200" : "text-amber-200"}>
                {down ? "▼" : "▲"} {formatPrice(m.to)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
