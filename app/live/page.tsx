"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/format";
import { products } from "@/lib/catalog";
import { stores } from "@/lib/network";
import { useLive } from "@/hooks/use-live";
import { withLivePrices } from "@/lib/live-quotes";
import { cheapestListing } from "@/lib/catalog";

export default function LivePage() {
  const { moves, now, enableBrowserNotifications, notifyOn } = useLive();
  const hot = [...products]
    .map((p) => {
      const live = withLivePrices(p, now);
      const cheap = cheapestListing(live);
      const prev = live.listings.find((l) => l.sku === cheap.sku)?.previousPrice ?? cheap.price;
      return { p, drop: prev - cheap.price, live };
    })
    .sort((a, b) => b.drop - a.drop)
    .slice(0, 6);

  const connected = stores.filter((s) => s.status === "connected" || s.status === "affiliate_ready");

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-sm text-emerald-700">
            <span className="size-2 animate-pulse rounded-full bg-emerald-600" />
            مراقبة شغّالة · تيك كل ٤ ثواني
          </p>
          <h1 className="font-heading mt-2 text-3xl font-semibold">غرفة العمليات اللحظية</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            بنراقب الأسعار، الفروق، والتقييمات على شبكة متاجر الأجهزة في مصر. الصور
            والتقييمات ظاهرة على كل كارت، والنوتيفيكيشن بيتبعت لما حاجة في قايمتك تنزل.
            الربط الحي الكامل لكل دومين في مصر بيستني فيد أفلييت/رسمي — المحرك هنا شغّال
            على الشبكة المتصلة دلوقتي.
          </p>
        </div>
        <Button onClick={() => enableBrowserNotifications()}>
          {notifyOn ? "النوتيفيكيشن متفعل" : "تفعيل نوتيفيكيشن المتصفح"}
        </Button>
      </div>

      <ul className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <li className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <strong className="block text-2xl text-primary">{connected.length}</strong>
          متجر بيتحدّث
        </li>
        <li className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <strong className="block text-2xl text-primary">{products.length}</strong>
          منتج تحت المراقبة
        </li>
        <li className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <strong className="block text-2xl text-primary">{moves.length}</strong>
          حركة في التيك الحالي
        </li>
        <li className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <strong className="block text-2xl text-primary">
            {new Date(now).toLocaleTimeString("ar-EG")}
          </strong>
          آخر مزامنة
        </li>
      </ul>

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-heading text-xl font-semibold">
          <Activity className="size-5" />
          تدفق التغيّرات
        </h2>
        <div className="divide-y rounded-xl bg-card ring-1 ring-foreground/10">
          {moves.map((m) => {
            const down = m.to < m.from;
            return (
              <Link
                key={`${m.productId}-${m.storeId}-${m.to}`}
                href={`/product/${m.productId}`}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm hover:bg-muted/50"
              >
                <span>
                  <span className="font-medium">{m.storeName}</span>
                  {" · "}
                  {m.productName}
                </span>
                <span className={down ? "text-emerald-700" : "text-amber-800"}>
                  {formatPrice(m.from)} → {formatPrice(m.to)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold">أكبر نزول في التيك الحالي</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hot.map(({ p }) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
