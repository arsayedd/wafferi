"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProduct, cheapestListing } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useWaffari } from "@/hooks/use-waffari";
import { useLive } from "@/hooks/use-live";

export default function AlertsPage() {
  const { alerts, removeAlert } = useWaffari();
  const { inbox, unread, markRead, enableBrowserNotifications, notifyOn, liveProduct } =
    useLive();

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold">تنبيهات السعر</h1>
          <p className="text-muted-foreground">
            الأهداف بتتسجل عندكِ على الجهاز. مفيش بورصة لحظية من المتاجر — التنبيه
            للمقارنة المرجعية جوّه وفّري، والسعر النهائي عند المصدر.
          </p>
        </div>
        <Button variant={notifyOn ? "secondary" : "default"} onClick={() => enableBrowserNotifications()}>
          {notifyOn ? "النوتيفيكيشن شغال" : "فعّلي نوتيفيكيشن المتصفح"}
        </Button>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">صندوق الوارد {unread ? `(${unread} جديدة)` : ""}</h2>
          <Button variant="ghost" size="sm" onClick={markRead} disabled={!unread}>
            تعليم كمقروء
          </Button>
        </div>
        {inbox.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            لسه مفيش رسائل من فيد الأسعار. أضيفي هدف سعر من صفحة المنتج. مراقبة المنافسين المرجعية على{" "}
            <Link href="/intel" className="text-primary underline">
              صفحة المراقبة
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-2">
            {inbox.map((n) => (
              <li
                key={n.id}
                className={`rounded-xl p-3 ring-1 ring-foreground/10 ${n.read ? "bg-card" : "bg-emerald-50"}`}
              >
                <Link href={n.href} className="font-medium hover:underline">
                  {n.title}
                </Link>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(n.ts).toLocaleTimeString("ar-EG")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">أهداف السعر</h2>
        {alerts.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="font-medium">مفيش أهداف لسه</p>
            <Button className="mt-4" nativeButton={false} render={<Link href="/search" />}>
              السوق
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {alerts.map((a) => {
              const raw = getProduct(a.productId);
              if (!raw) return null;
              const p = liveProduct(raw);
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
                      السعر المرجعي {formatPrice(cheap.price)} · الهدف {formatPrice(a.targetPrice)}
                      {hit ? " · وصل للهدف" : ""}
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
      </section>
    </div>
  );
}
