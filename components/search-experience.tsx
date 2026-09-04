"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search-bar";
import { ProductCard } from "@/components/product-card";
import { WebResultCard } from "@/components/web-result-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brands, categories, stores } from "@/lib/catalog";
import { searchProducts, type SortKey } from "@/lib/search";
import { useCatalog } from "@/hooks/use-catalog";
import type { WebSearchResponse } from "@/lib/web-search";

type Tab = "all" | "waffari" | "web";

export function SearchExperience({
  initialCategory,
}: {
  initialCategory?: string;
}) {
  const { allProducts } = useCatalog();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? initialCategory ?? "";
  const brand = params.get("brand") ?? "";
  const store = params.get("store") ?? "";
  const sort = (params.get("sort") as SortKey) || "price";
  const min = params.get("min") ? Number(params.get("min")) : undefined;
  const max = params.get("max") ? Number(params.get("max")) : undefined;
  const tab = (params.get("tab") as Tab) || "all";

  const [minDraft, setMinDraft] = useState(min?.toString() ?? "");
  const [maxDraft, setMaxDraft] = useState(max?.toString() ?? "");
  const [web, setWeb] = useState<WebSearchResponse | null>(null);
  const [webLoading, setWebLoading] = useState(false);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (initialCategory && key !== "category") {
      next.set("category", initialCategory);
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  const results = useMemo(
    () =>
      searchProducts(
        {
          q,
          category: category || undefined,
          brand: brand || undefined,
          store: store || undefined,
          min,
          max,
          sort,
        },
        allProducts,
      ),
    [q, category, brand, store, min, max, sort, allProducts],
  );

  useEffect(() => {
    if (!q.trim()) {
      setWeb(null);
      setWebLoading(false);
      return;
    }
    const ac = new AbortController();
    setWebLoading(true);
    fetch(`/api/web-search?q=${encodeURIComponent(q.trim())}`, { signal: ac.signal })
      .then((r) => r.json())
      .then((data: WebSearchResponse) => setWeb(data))
      .catch(() => {
        if (!ac.signal.aborted) {
          setWeb({
            q,
            hits: [],
            provider: "open-web",
            note: "البحث على الويب اتأخر. جرّبي تاني.",
          });
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) setWebLoading(false);
      });
    return () => ac.abort();
  }, [q]);

  const uniqueBrands = [...new Set(brands.map((b) => b.name))];
  const webHits = web?.hits ?? [];
  const showWaffari = tab !== "web";
  const showWeb = tab !== "waffari" && Boolean(q.trim());
  const empty =
    (!showWaffari || results.length === 0) &&
    (!showWeb || (!webLoading && webHits.length === 0));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="space-y-3">
        <h1 className="font-heading text-3xl font-semibold">
          {q ? `نتائج «${q}»` : "دورِي على أي حاجة في الحياة"}
        </h1>
        <p className="text-muted-foreground">
          البحث مش محبوس في كتالوج وفّري. اللي عندنا يطلع بشكل الجهاز، والباقي من
          الويب (جوجل لو المفتاح متفعل) بنفس كروت وفّري.
        </p>
        <SearchBar defaultValue={q} category={category || undefined} />
        {q ? (
          <Link
            href={`/places?q=${encodeURIComponent(q)}`}
            className="block rounded-xl bg-secondary/80 px-4 py-3 text-sm ring-1 ring-foreground/10 hover:bg-secondary"
          >
            أماكن على الخريطة لـ «{q}» — أحياء غالبًا أرخص + خرائط جوجل
          </Link>
        ) : null}
        {q ? (
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["all", `الكل (${results.length + webHits.length})`],
                ["waffari", `في وفّري (${results.length})`],
                ["web", `من الويب (${webLoading ? "…" : webHits.length})`],
              ] as const
            ).map(([id, label]) => (
              <Chip key={id} active={tab === id} onClick={() => setParam("tab", id === "all" ? "" : id)}>
                {label}
              </Chip>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-5 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <p className="text-xs text-muted-foreground">
            الفلاتر دي على منتجات وفّري. نتايج الويب بتيجي من برّه الكتالوج.
          </p>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">الفئة</legend>
            <div className="flex flex-wrap gap-1.5">
              <Chip
                active={!category}
                onClick={() => {
                  if (initialCategory) router.push("/search");
                  else setParam("category", "");
                }}
              >
                الكل
              </Chip>
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  active={category === c.id}
                  onClick={() => setParam("category", c.id)}
                >
                  {c.name}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">الماركة</legend>
            <select
              className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
              value={brand}
              onChange={(e) => setParam("brand", e.target.value)}
            >
              <option value="">كل الماركات</option>
              {uniqueBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">المتجر</legend>
            <select
              className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
              value={store}
              onChange={(e) => setParam("store", e.target.value)}
            >
              <option value="">كل المتاجر</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">نطاق السعر (جنيه)</legend>
            <div className="flex gap-2">
              <Input
                inputMode="numeric"
                placeholder="من"
                value={minDraft}
                onChange={(e) => setMinDraft(e.target.value)}
              />
              <Input
                inputMode="numeric"
                placeholder="إلى"
                value={maxDraft}
                onChange={(e) => setMaxDraft(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const next = new URLSearchParams(params.toString());
                if (minDraft) next.set("min", minDraft);
                else next.delete("min");
                if (maxDraft) next.set("max", maxDraft);
                else next.delete("max");
                router.push(`${pathname}?${next.toString()}`);
              }}
            >
              تطبيق السعر
            </Button>
          </fieldset>
        </aside>

        <div className="space-y-8">
          {showWaffari ? (
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-xl font-semibold">في وفّري</h2>
                  <p className="text-sm text-muted-foreground">
                    {results.length === 0
                      ? "مفيش منتج مطابق في الكتالوج — الويب تحت لو فيه نتايج."
                      : `${results.length} منتج موحّد بأسعار متاجر مصر`}
                  </p>
                </div>
                <select
                  className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
                  value={sort}
                  onChange={(e) => setParam("sort", e.target.value)}
                >
                  <option value="price">الأرخص أولًا</option>
                  <option value="savings">أكبر فرق سعر بين المتاجر</option>
                  <option value="rating">الأعلى تقييمًا</option>
                  <option value="stores">الأكثر تغطية متاجر</option>
                </select>
              </div>
              {results.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
                  الكتالوج عندنا متخصص في جهاز العروسة والبيت. أي موضوع تاني هيظهر من الويب بنفس الشكل.
                </div>
              )}
            </section>
          ) : null}

          {showWeb ? (
            <section className="space-y-4">
              <div>
                <h2 className="font-heading text-xl font-semibold">من الويب</h2>
                <p className="text-sm text-muted-foreground">
                  {webLoading
                    ? "بنبحث برّه الكتالوج…"
                    : web?.note ?? "نتايج الحياة العامة بشكل وفّري."}
                </p>
              </div>
              {webLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-72 animate-pulse rounded-xl bg-muted"
                    />
                  ))}
                </div>
              ) : webHits.length ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {webHits.map((h) => (
                    <WebResultCard key={h.id} hit={h} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  مفيش نتايج ويب للكلمة دي دلوقتي. جرّبي صياغة تانية.
                </div>
              )}
            </section>
          ) : null}

          {empty && !webLoading && q ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="font-medium">مفيش نتايج</p>
              <p className="mt-1 text-sm text-muted-foreground">وسّعي الكلمة أو امسحي الفلاتر.</p>
              <Button className="mt-4" variant="outline" onClick={() => router.push("/search")}>
                مسح الفلاتر
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-xs ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
