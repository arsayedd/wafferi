"use client";

import { ExternalLink, BadgeCheck, TrendingDown, TrendingUp, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStore } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { hostnameOf } from "@/lib/outbound";
import type { Listing } from "@/lib/types";
import type { LiveListing } from "@/lib/live-quotes";
import { usePartners } from "@/hooks/use-partners";

function isLive(l: Listing): l is LiveListing {
  return "previousPrice" in l;
}

export function PriceTable({ listings }: { listings: Listing[] }) {
  const { outbound, ruleFor } = usePartners();
  const sorted = [...listings].sort((a, b) => a.price - b.price);
  const min = sorted[0]?.price;

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
      <table className="w-full min-w-[860px] text-sm">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-start font-medium">المصدر</th>
            <th className="px-3 py-2 text-start font-medium">السعر</th>
            <th className="px-3 py-2 text-start font-medium">التغيّر</th>
            <th className="px-3 py-2 text-start font-medium">كوبون وفّري</th>
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
            const rule = ruleFor(l.storeId);
            const coupon = l.coupon || rule?.coupon || "";
            const host = hostnameOf(l.url);
            const href = outbound(l.url, l.storeId, l.coupon);
            return (
              <tr key={l.sku} className={cheapest ? "bg-emerald-50/80" : "border-t"}>
                <td className="px-3 py-3">
                  <div className="font-medium">{store?.name ?? l.storeId}</div>
                  <div className="text-xs text-muted-foreground">
                    {host || store?.website} · المنتج عندهم مش عندنا
                  </div>
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
                  {coupon ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs"
                      onClick={() => {
                        navigator.clipboard?.writeText(coupon);
                        toast.success(`اتنسخ الكوبون ${coupon}`);
                      }}
                    >
                      <Ticket className="size-3" />
                      {coupon}
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
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
                      toast.message(`هتحوّلي على ${store?.name ?? host}`, {
                        description: coupon
                          ? `الكوبون ${coupon} هيتركب على الرابط. العمولة ترجع لوفّري لو الأفلييت متظبط.`
                          : "السعر زي ما هو عند المصدر. الأفلييت يتظبط من صفحة الشراكة.",
                      });
                      window.open(href, "_blank", "noopener");
                    }}
                  >
                    اشتري من {store?.name ?? "المصدر"}
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
        وفّري مش البائع. كل عرض مربوط بمصدره، والضغط بيحولك لصفحة المتجر بلينك فيه أفلييت/كوبون لو ظبّطتيهم.
      </p>
    </div>
  );
}
