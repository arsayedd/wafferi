"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BadgePercent, MapPin } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { brands, categories, stores } from "@/lib/catalog";
import { searchProducts, type SortKey } from "@/lib/search";
import { matchAreas } from "@/lib/egypt-areas";
import { useCatalog } from "@/hooks/use-catalog";

type Tab = "all" | "waffari" | "go";

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

  const areas = useMemo(() => (q.trim() ? matchAreas(q) : []), [q]);
  const uniqueBrands = [...new Set(brands.map((b) => b.name))];
  const showWaffari = tab !== "go";
  const showGo = tab !== "waffari" && Boolean(q.trim());
  const empty =
    (!showWaffari || results.length === 0) &&
    (!showGo || areas.length === 0);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="space-y-3">
        <h1 className="font-heading text-3xl font-semibold">
          {q ? `نتائج «${q}»` : "دورِي في الكتالوج أو على الحي"}
        </h1>
        <p className="text-muted-foreground">
          لو هتشتري أونلاين: منتجات وفّري. لو عايزة تنزلي: بنرميكي على الحي من داتا
          الأحياء عندنا — مش بحث جوجل.
        </p>
        <SearchBar defaultValue={q} category={category || undefined} />
        {q ? (
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["all", `الكل`],
                ["waffari", `أونلاين (${results.length})`],
                ["go", `تنزلي (${areas.length})`],
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
          <p className="text-xs text-muted-foreground">الفلاتر على منتجات وفّري الأونلاين.</p>
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
          {showGo ? (
            <section className="space-y-4">
              <div>
                <h2 className="font-heading text-xl font-semibold">لو عايزة تنزلي</h2>
                <p className="text-sm text-muted-foreground">
                  {areas.length
                    ? `بنودّيكي على ${areas[0].name} حسب داتا الأحياء.`
                    : "مفيش حي مربوط بالكلمة دي عندنا."}
                </p>
              </div>
              {areas.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {areas.slice(0, 4).map((a, i) => (
                    <Link
                      key={a.id}
                      href={`/places?q=${encodeURIComponent(a.name)}`}
                      className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:bg-secondary"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-medium">{a.name}</span>
                        {a.cheaper ? (
                          <Badge variant="secondary" className="gap-1">
                            <BadgePercent className="size-3" />
                            غالبًا أرخص
                          </Badge>
                        ) : (
                          <Badge variant="outline">سعر أوضح</Badge>
                        )}
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground">{a.city}</p>
                      <p className="mt-2 text-sm">{a.why}</p>
                      <p className="mt-2 flex items-center gap-1 text-xs text-primary">
                        <MapPin className="size-3" />
                        {i === 0 ? "المنطقة الأولى لكلمتك" : "بديل قريب"}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
                  جرّبي كلمات زي حلل، غسالة، ذهب، أثاث، فوط — أو{" "}
                  <Link className="text-primary underline" href="/places">
                    شوفي خريطة الأحياء
                  </Link>
                  .
                </div>
              )}
            </section>
          ) : null}

          {showWaffari ? (
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-xl font-semibold">أونلاين في وفّري</h2>
                  <p className="text-sm text-muted-foreground">
                    {results.length === 0
                      ? "مفيش منتج مطابق في الكتالوج."
                      : `${results.length} منتج بأسعار متاجر مصر`}
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
                  الكتالوج للجهاز والبيت. لو هتنزلي، شوفي قسم الأحياء فوق.
                </div>
              )}
            </section>
          ) : null}

          {empty && q ? (
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
