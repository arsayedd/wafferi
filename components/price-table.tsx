"use client";

import { useState } from "react";
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
  const [sort, setSort] = useState<"price" | "rating" | "reviews" | "discount">("price");
  const sorted = [...listings].sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "reviews") return b.reviews - a.reviews;
    if (sort === "discount") {
      const da = a.oldPrice && a.oldPrice > a.price ? a.oldPrice - a.price : 0;
      const db = b.oldPrice && b.oldPrice > b.price ? b.oldPrice - b.price : 0;
      return db - da;
    }
    return a.price - b.price;
  });
  const min = Math.min(...listings.map((l) => l.price));

  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 px-3 py-2">
        <p className="text-sm font-medium">فين تشتري</p>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="price">الأرخص</option>
          <option value="rating">الأعلى تقييمًا</option>
          <option value="reviews">الأكثر مراجعات</option>
          <option value="discount">أكبر خصم</option>
        </select>
      </div>
      <table className="w-full min-w-[860px] text-sm">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-start font-medium">المصدر</th>
            <th className="px-3 py-2 text-start font-medium">السعر</th>
            <th className="px-3 py-2 text-start font-medium">تقييم</th>
            <th className="px-3 py-2 text-start font-medium">ستوك</th>
            <th className="px-3 py-2 text-start font-medium">كوبون</th>
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
                      <Badge className="bg-emerald-700 text-white">أفضل سعر حاليًا</Badge>
                    )}
                    {l.oldPrice && l.oldPrice > l.price ? (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(l.oldPrice)}
                      </span>
                    ) : null}
                    {updatedAtOf(l) ? (
                      <span className="text-xs text-muted-foreground">
                        {new Date(updatedAtOf(l)!).toLocaleTimeString("ar-EG")}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-3 py-3 text-sm">
                  {l.rating.toFixed(1)} · {l.reviews.toLocaleString("ar-EG")}
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  {l.inStock ? `✓ ${l.shipping}` : "✕ غير متوفر"}
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
