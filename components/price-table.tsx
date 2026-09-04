"use client";

import { ExternalLink, BadgeCheck, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceCopyright } from "@/components/source-copyright";
import { getStore } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { hostnameOf } from "@/lib/outbound";
import type { Listing } from "@/lib/types";
import type { LiveListing } from "@/lib/live-quotes";
import { usePartners } from "@/hooks/use-partners";

function updatedAtOf(l: Listing) {
  return "updatedAt" in l ? (l as LiveListing).updatedAt : undefined;
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
            <th className="px-3 py-2 text-start font-medium">سعر حي</th>
            <th className="px-3 py-2 text-start font-medium">كوبون</th>
            <th className="px-3 py-2 text-start font-medium">التوصيل</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((l) => {
            const store = getStore(l.storeId);
            const cheapest = l.price === min;
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
                      <Badge className="bg-emerald-700 text-white">الأرخص في العينة</Badge>
                    )}
                    {updatedAtOf(l) ? (
                      <span className="text-xs text-muted-foreground">
                        {new Date(updatedAtOf(l)!).toLocaleTimeString("ar-EG")}
                      </span>
                    ) : null}
                  </div>
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
        وفّري مش البائع. السعر يتحدّث من فيد المصدر. الاسم والحقوق ليهم. الزر بيفتح موقعهم.
      </p>
      <div className="px-3 pb-3">
        <SourceCopyright
          compact
          names={sorted.map((l) => getStore(l.storeId)?.name).filter(Boolean) as string[]}
        />
      </div>
    </div>
  );
}
