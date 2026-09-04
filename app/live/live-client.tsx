"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RefreshCw, Radio } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SourceCopyright } from "@/components/source-copyright";
import { Sparkline } from "@/components/sparkline";
import { useCatalog } from "@/hooks/use-catalog";
import { useLive, POLL_MS } from "@/hooks/use-live";
import { getStore } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { productStats } from "@/lib/stats";
import { arabicIncludes } from "@/lib/ar-fold";
import type { LiveListing } from "@/lib/live-quotes";

function ago(at: number, now: number) {
  if (!at) return "لسه مفيش تيك من فيد";
  const s = Math.max(0, Math.round((now - at) / 1000));
  if (s < 60) return `من ${s} ث`;
  const m = Math.round(s / 60);
  if (m < 60) return `من ${m} د`;
  return `من ${Math.round(m / 60)} س`;
}

export function LiveBoard() {
  const { allProducts } = useCatalog();
  const {
    liveProduct,
    quoteHistory,
    lastFeedAt,
    feedUrls,
    addFeedUrl,
    removeFeedUrl,
    refreshFeeds,
    autoPoll,
    setAutoPoll,
    polling,
    now,
  } = useLive();
  const [q, setQ] = useState("");
  const [url, setUrl] = useState("");

  const rows = useMemo(() => {
    const list = allProducts
      .map((p) => liveProduct(p))
      .filter((p) => {
        if (!q.trim()) return true;
        return arabicIncludes(`${p.name} ${p.brand} ${p.model}`, q);
      })
      .map((p) => {
        const stats = productStats(p);
        const updated = Math.max(0, ...p.listings.map((l) => l.updatedAt ?? 0));
        const hist = quoteHistory(p.id, stats.cheap.storeId);
        return { p, stats, updated, hist };
      })
      .sort((a, b) => b.updated - a.updated);
    return list.slice(0, 80);
  }, [allProducts, liveProduct, q, quoteHistory]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-sm text-primary">
            <Radio className="size-4" />
            طبقة أسعار حية — موديل Pricena
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold">تحديث السعر من فيد المصدر</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            منصات زي Pricena بتشتغل على فيدات وAPIs وبيانات منظمة. حطي رابط فيد أو منتج
            على صفحة السحب — الموصّل بيتحدد لوحده (CSV، XML، Shopify، Woo، JSON-LD، أمازون).
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            آخر تيك: {ago(lastFeedAt, now)}
            {autoPoll ? ` · تحديث تلقائي كل ${POLL_MS / 1000} ثانية` : ""}
          </p>
        </div>
        <Button
          onClick={async () => {
            const n = await refreshFeeds();
            toast.message(n ? `اتحدّث ${n} عرض من الفيد` : "مفيش روابط فيد محفوظة");
          }}
          disabled={polling || !feedUrls.length}
        >
          <RefreshCw className={polling ? "animate-spin" : ""} />
          حدّث الآن
        </Button>
      </div>

      <section className="space-y-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="font-medium">مصادر التحديث اللحظي</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…/affiliate-feed.csv"
          />
          <Button
            variant="outline"
            onClick={() => {
              if (!url.trim()) {
                toast.error("حطي رابط فيد");
                return;
              }
              addFeedUrl(url);
              setUrl("");
              toast.success("الرابط اتسجل — التحديث هيجيب الأسعار منه");
            }}
          >
            أضيفي فيد
          </Button>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoPoll}
            onChange={(e) => setAutoPoll(e.target.checked)}
            disabled={!feedUrls.length}
          />
          شغّلي التحديث اللحظي (سحب الفيد كل دقيقة)
        </label>
        {feedUrls.length ? (
          <ul className="space-y-1 text-sm">
            {feedUrls.map((u) => (
              <li key={u} className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-xs">{u}</span>
                <Button size="sm" variant="ghost" onClick={() => removeFeedUrl(u)}>
                  حذف
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            لسه مفيش فيد. من صفحة «فيد وأفلييت» تقدري تلصقي CSV وتحدّثي السعر فورًا، أو
            تحطي رابط ملف مصرّح هنا.
          </p>
        )}
        <Button variant="secondary" nativeButton={false} render={<Link href="/ingest" />}>
          فتح صفحة الفيد
        </Button>
        <Button variant="ghost" nativeButton={false} render={<Link href="/connectors" />}>
          كل الموصّلات
        </Button>
      </section>

      <SourceCopyright />

      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="دورِي على منتج…" />

      <div className="overflow-x-auto rounded-2xl ring-1 ring-foreground/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-start font-medium">المنتج</th>
              <th className="px-3 py-2 text-start font-medium">أرخص سعر حي</th>
              <th className="px-3 py-2 text-start font-medium">المسار</th>
              <th className="px-3 py-2 text-start font-medium">آخر تحديث</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ p, stats, updated, hist }) => {
              const cheap = stats.cheap as LiveListing;
              return (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-3">
                    <Link href={`/product/${p.id}`} className="font-medium hover:underline">
                      {p.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {p.brand} · {stats.stores} مصدر
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-semibold">{formatPrice(cheap.price)}</div>
                    <div className="text-xs text-muted-foreground">
                      {getStore(cheap.storeId)?.name}
                      {cheap.channel === "feed" ? (
                        <Badge className="ms-2" variant="secondary">
                          فيد
                        </Badge>
                      ) : (
                        <Badge className="ms-2" variant="outline">
                          كتالوج
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Sparkline values={hist} className="h-8 w-28" />
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{ago(updated, now)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
