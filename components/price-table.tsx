"use client";

import { ExternalLink, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStore } from "@/lib/catalog";
import { affiliateHref, formatNumber, formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

export function PriceTable({ listings }: { listings: Listing[] }) {
  const sorted = [...listings].sort((a, b) => a.price - b.price);
  const min = sorted[0]?.price;

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-start font-medium">المتجر</th>
            <th className="px-3 py-2 text-start font-medium">السعر</th>
            <th className="px-3 py-2 text-start font-medium">التقييم</th>
            <th className="px-3 py-2 text-start font-medium">التوصيل</th>
            <th className="px-3 py-2 text-start font-medium">أفلييت</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((l) => {
            const store = getStore(l.storeId);
            const cheapest = l.price === min;
            return (
              <tr
                key={l.sku}
                className={cheapest ? "bg-emerald-50/80" : "border-t"}
              >
                <td className="px-3 py-3">
                  <div className="font-medium">{store?.name}</div>
                  <div className="text-xs text-muted-foreground">{l.sku}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatPrice(l.price)}</span>
                    {cheapest && (
                      <Badge className="bg-emerald-700 text-white">الأرخص</Badge>
                    )}
                  </div>
                  {l.oldPrice && l.oldPrice > l.price && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(l.oldPrice)}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">
                  {l.rating.toFixed(1)} · {formatNumber(l.reviews)} تقييم
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  {l.inStock ? l.shipping : "غير متوفر حاليًا"}
                </td>
                <td className="px-3 py-3">
                  <span className="text-xs text-muted-foreground">
                    {store?.commissionNote}
                  </span>
                </td>
                <td className="px-3 py-3 text-end">
                  <Button
                    size="sm"
                    variant={cheapest ? "default" : "outline"}
                    disabled={!l.inStock}
                    onClick={() => {
                      toast.message("رابط أفلييت تجريبي", {
                        description:
                          "في الإنتاج الرابط هيعدّي على الشبكة (جوميا / نون / ArabClicks) والعمولة ترجع لوفّري من غير ما السعر يزيد.",
                      });
                      window.open(affiliateHref(l.url), "_blank", "noopener");
                    }}
                  >
                    اشتري من {store?.name}
                    <ExternalLink />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="flex items-center gap-1 px-3 py-2 text-xs text-muted-foreground">
        <BadgeCheck className="size-3.5" />
        الأسعار هنا كتالوج MVP تجريبي. الشارة الخضراء = أقل سعر متوفر دلوقتي في البيانات.
      </p>
    </div>
  );
}
