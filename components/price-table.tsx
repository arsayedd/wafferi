"use client";

import { ExternalLink, BadgeCheck, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStore } from "@/lib/catalog";
import { affiliateHref, formatNumber, formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";
import type { LiveListing } from "@/lib/live-quotes";

function isLive(l: Listing): l is LiveListing {
  return "previousPrice" in l;
}

export function PriceTable({ listings }: { listings: Listing[] }) {
  const sorted = [...listings].sort((a, b) => a.price - b.price);
  const min = sorted[0]?.price;

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-start font-medium">المتجر</th>
            <th className="px-3 py-2 text-start font-medium">السعر اللحظي</th>
            <th className="px-3 py-2 text-start font-medium">التغيّر</th>
            <th className="px-3 py-2 text-start font-medium">التقييم</th>
            <th className="px-3 py-2 text-start font-medium">التوصيل</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((l) => {
            const store = getStore(l.storeId);
            const cheapest = l.price === min;
            const prev = isLive(l) ? l.previousPrice : l.oldPrice;
            const diff = prev != null ? l.price - prev : 0;
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
                </td>
                <td className="px-3 py-3">
                  {diff === 0 ? (
                    <span className="text-muted-foreground">ثابت</span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1 ${diff < 0 ? "text-emerald-700" : "text-amber-800"}`}
                    >
                      {diff < 0 ? (
                        <TrendingDown className="size-3.5" />
                      ) : (
                        <TrendingUp className="size-3.5" />
                      )}
                      {formatPrice(Math.abs(diff))}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3">
                  {l.rating.toFixed(1)} · {formatNumber(l.reviews)} تقييم
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  {l.inStock ? l.shipping : "غير متوفر حاليًا"}
                </td>
                <td className="px-3 py-3 text-end">
                  <Button
                    size="sm"
                    variant={cheapest ? "default" : "outline"}
                    disabled={!l.inStock}
                    onClick={() => {
                      toast.message("رابط أفلييت تجريبي", {
                        description:
                          "العمولة ترجع لوفّري لو العملية تمت من الرابط ده.",
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
        الأسعار لحظية على الشبكة المتصلة، وتتحدّث كل ٤ ثواني. الأخضر = نزول عن التيك السابق.
      </p>
    </div>
  );
}
