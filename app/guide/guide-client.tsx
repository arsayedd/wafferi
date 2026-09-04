"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cheapestListing, getProduct } from "@/lib/catalog";
import { arabicIncludes } from "@/lib/ar-fold";
import { brideItemCount, brideSections, commercialBundles } from "@/lib/bride-guide";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useWaffari } from "@/hooks/use-waffari";

export default function GuideClient() {
  const { items, addItem, addMany } = useWaffari();
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(brideSections[0]?.id ?? "");
  const inList = useMemo(() => new Set(items.map((i) => i.productId)), [items]);

  const query = q.trim();
  const searching = query.length > 0;

  const filtered = useMemo(() => {
    if (!searching) return brideSections;
    return brideSections
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (it) =>
            arabicIncludes(it.name, query) ||
            arabicIncludes(s.title, query) ||
            arabicIncludes(s.blurb, query),
        ),
      }))
      .filter((s) => s.items.length);
  }, [query, searching]);

  const hitCount = filtered.reduce((n, s) => n + s.items.length, 0);

  const visible = searching
    ? filtered
    : filtered.map((s) => (s.id === openId ? s : { ...s, items: [] as typeof s.items }));

  function addSection(ids: string[], label: string) {
    addMany(ids);
    toast.success(`اتضاف ${label} للقايمة`);
  }

  function jumpTo(id: string) {
    setQ("");
    setOpenId(id);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
          <Link href="/list" className={cn(buttonVariants())}>
            فتح قايمة الجهاز
          </Link>
          <Link href="/search" className={cn(buttonVariants({ variant: "outline" }))}>
            السوق
          </Link>
        </div>
        <label className="block max-w-xl space-y-2">
          <span className="text-sm font-medium">بحث جوّه الدليل</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="دورِي جوّه الدليل: كنكة، فوط، ترمومتر…"
            aria-label="بحث داخل الدليل"
            className="h-12 w-full rounded-lg border border-input bg-background px-3 text-base shadow-sm outline-none ring-1 ring-foreground/10 focus-visible:ring-3"
          />
        </label>
        {searching ? (
          <p className="text-sm text-muted-foreground">
            {hitCount ? `${hitCount} بند مطابق لكلمة «${query}»` : "مفيش نتائج بالكلمة دي"}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            الأبواب مطوية عشان الصفحة تفضل خفيفة. افتحي باب أو ابحثي جوه الدليل.
          </p>
        )}
      </div>

      {!searching ? (
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
                  type="button"
                  size="sm"
                  nativeButton
                  onClick={() => addSection(b.productIds, b.name)}
                >
                  أضيفي البوكس
                </Button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <nav className="flex flex-wrap gap-2">
        {brideSections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => jumpTo(s.id)}
            className={cn(
              "rounded-full px-3 py-1 text-sm",
              !searching && openId === s.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-muted",
            )}
          >
            {s.title}
          </button>
        ))}
      </nav>

      {searching && filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          مفيش بند بالاسم ده في الدليل. جرّبي كلمة أقصر أو افتحي السوق.
        </p>
      ) : (
        visible.map((s) => {
          const full = brideSections.find((x) => x.id === s.id)!;
          const expanded = searching || s.id === openId;
          return (
            <section key={s.id} id={s.id} className="scroll-mt-24 space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-primary">{s.commercial}</p>
                  <h2 className="font-heading text-2xl font-semibold">{s.title}</h2>
                  <p className="text-sm text-muted-foreground">{s.blurb}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!searching ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => setOpenId(expanded ? "" : s.id)}
                    >
                      {expanded ? "طوي الباب" : `افتحي ${full.items.length} بند`}
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addSection(
                        full.items.map((i) => i.productId),
                        s.title,
                      )
                    }
                  >
                    أضيفي الباب كله ({full.items.length})
                  </Button>
                </div>
              </div>
              {expanded ? (
                <ul className="divide-y rounded-xl bg-card ring-1 ring-foreground/10">
                  {s.items.map((it) => {
                    const p = getProduct(it.productId);
                    const cheap = p ? cheapestListing(p) : null;
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
                            <Link
                              href={`/product/${p.id}`}
                              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                            >
                              قارني
                            </Link>
                          ) : null}
                          <Button
                            type="button"
                            size="sm"
                            nativeButton
                            variant={added ? "secondary" : "default"}
                            disabled={added}
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
              ) : (
                <p className="text-sm text-muted-foreground">الباب مطوي — افتحيه من الشريحة فوق أو الزر.</p>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}
