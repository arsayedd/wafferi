"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cheapestListing, getProduct } from "@/lib/catalog";
import { brideItemCount, brideSections, commercialBundles } from "@/lib/bride-guide";
import { formatPrice } from "@/lib/format";
import { useWaffari } from "@/hooks/use-waffari";
import { useLive } from "@/hooks/use-live";

export default function GuideClient() {
  const { items, addItem, addMany } = useWaffari();
  const { liveProduct } = useLive();
  const [q, setQ] = useState("");
  const inList = useMemo(() => new Set(items.map((i) => i.productId)), [items]);

  const query = q.trim();
  const sections = useMemo(() => {
    if (!query) return brideSections;
    return brideSections
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (it) => it.name.includes(query) || s.title.includes(query),
        ),
      }))
      .filter((s) => s.items.length);
  }, [query]);

  function addSection(ids: string[], label: string) {
    addMany(ids);
    toast.success(`اتضاف ${label} للقايمة`);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <div className="space-y-3">
        <p className="text-sm text-primary">دليل العروسة من أول البيت لحد أصغر رفايع</p>
        <h1 className="font-heading text-3xl font-semibold md:text-4xl">
          قايمة شاملة: {brideItemCount} بند في {brideSections.length} باب
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          من تجهيز المطبخ لبوكس الطوارئ وحاجات الأطفال المستقبلية. كل بند مربوط بمنتج
          في السوق — أضيفي قسم كامل أو بوكس جاهز للقايمة، وبعدين قارني السعر على جوميا
          ونون وكارفور.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button nativeButton={false} render={<Link href="/list" />}>
            فتح قايمة الجهاز
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/search" />}>
            السوق
          </Button>
        </div>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="دورِي جوّه الدليل: كنكة، فوط، ترمومتر…"
          className="max-w-md"
        />
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-semibold">بوكسات تجارية جاهزة</h2>
        <p className="text-sm text-muted-foreground">
          Kitchen Essentials → تنظيم → تنظيف → حمام → عناية → شهر العسل → أول بيت.
          الإضافة هنا بتدمج مع قايمتك، مش بتمسحها.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {commercialBundles.map((b) => (
            <div
              key={b.id}
              className="flex flex-col gap-2 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
            >
              <p className="font-medium">{b.name}</p>
              <p className="text-sm text-muted-foreground">{b.description}</p>
              <p className="text-xs">
                {b.productIds.length} منتجات · ميزانية مقترحة{" "}
                {b.suggestedBudget.toLocaleString("ar-EG")} ج
              </p>
              <Button
                size="sm"
                onClick={() => addSection(b.productIds, b.name)}
              >
                أضيفي البوكس
              </Button>
            </div>
          ))}
        </div>
      </section>

      <nav className="flex flex-wrap gap-2">
        {brideSections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full bg-secondary px-3 py-1 text-sm hover:bg-muted"
          >
            {s.title}
          </a>
        ))}
      </nav>

      {sections.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          مفيش بند بالاسم ده في الدليل. جرّبي كلمة أقصر أو افتحي السوق.
        </p>
      ) : (
        sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24 space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs text-primary">{s.commercial}</p>
                <h2 className="font-heading text-2xl font-semibold">{s.title}</h2>
                <p className="text-sm text-muted-foreground">{s.blurb}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  addSection(
                    s.items.map((i) => i.productId),
                    s.title,
                  )
                }
              >
                أضيفي الباب كله ({s.items.length})
              </Button>
            </div>
            <ul className="divide-y rounded-xl bg-card ring-1 ring-foreground/10">
              {s.items.map((it) => {
                const p = getProduct(it.productId);
                const live = p ? liveProduct(p) : null;
                const cheap = live ? cheapestListing(live) : null;
                const added = inList.has(it.productId);
                return (
                  <li
                    key={`${s.id}-${it.productId}-${it.name}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{it.name}</p>
                      {p ? (
                        <p className="text-xs text-muted-foreground">
                          {p.brand}
                          {cheap ? ` · من ${formatPrice(cheap.price)}` : ""}
                        </p>
                      ) : (
                        <p className="text-xs text-destructive">المنتج لسه مش مربوط في الكتالوج</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {p ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          nativeButton={false}
                          render={<Link href={`/product/${p.id}`} />}
                        >
                          قارني
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant={added ? "secondary" : "default"}
                        disabled={added || !p}
                        onClick={() => {
                          addItem(it.productId);
                          toast.success(`اتضاف ${it.name}`);
                        }}
                      >
                        {added ? "في القايمة" : "أضيفي"}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
