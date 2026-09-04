"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProduct, cheapestListing } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useWaffari } from "@/hooks/use-waffari";

export default function AlertsPage() {
  const { alerts, removeAlert } = useWaffari();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold">تنبيهات الأسعار</h1>
      <p className="text-muted-foreground">
        التنبيهات بتتحفظ على المتصفح. في الإنتاج هتتبعت بالإيميل أو واتساب لما السعر ينزل.
      </p>
      {alerts.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">مفيش تنبيهات لسه</p>
          <p className="mt-1 text-sm text-muted-foreground">
            افتحي أي منتج وحددِي سعر أقل من الحالي.
          </p>
          <Button className="mt-4" nativeButton={false} render={<Link href="/search" />}>
            السوق
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((a) => {
            const p = getProduct(a.productId);
            if (!p) return null;
            const cheap = cheapestListing(p);
            const hit = cheap.price <= a.targetPrice;
            return (
              <li
                key={a.productId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
              >
                <div>
                  <Link href={`/product/${p.id}`} className="font-medium hover:underline">
                    {p.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    الحالي {formatPrice(cheap.price)} · الهدف {formatPrice(a.targetPrice)}
                    {hit ? " · السعر وصل للهدف في البيانات التجريبية" : ""}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => removeAlert(a.productId)}>
                  حذف
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
