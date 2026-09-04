"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BadgePercent, MapPin, Sparkles } from "lucide-react";
import { ProductPhoto } from "@/components/product-photo";
import { SellerStrip } from "@/components/seller-strip";
import { StoreLogo } from "@/components/store-logo";
import { SearchBar } from "@/components/search-bar";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { brands, categories, cheapestListing, getStore } from "@/lib/catalog";
import { catalogStores, networkStats } from "@/lib/network";
import { searchProductsPage, SEARCH_PAGE_SIZE, type SortKey } from "@/lib/search";
import { parseShopperQuery, POPULAR_SEARCHES } from "@/lib/query-parse";
import { pickBestChoice, priceIntel, whyBest } from "@/lib/best-choice";
import { matchAreas } from "@/lib/egypt-areas";
import { formatNumber, formatPrice } from "@/lib/format";
import { VIRTUAL_SKU_COUNT } from "@/lib/virtual-catalog";
import { useCatalog } from "@/hooks/use-catalog";
import { useWaffari } from "@/hooks/use-waffari";
import { toast } from "sonner";

type Tab = "all" | "waffari" | "go";

export function SearchExperience({
  initialCategory,
}: {
  initialCategory?: string;
}) {
  const { allProducts } = useCatalog();
  const { addItem } = useWaffari();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = params.get("q") ?? "";
  const parsed = useMemo(() => parseShopperQuery(q), [q]);
  const category = initialCategory || params.get("category") || parsed.category || "";
  const brand = params.get("brand") || parsed.brand || "";
  const store = params.get("store") ?? "";
  const sort = (params.get("sort") as SortKey) || "best";
  const min = params.get("min") ? Number(params.get("min")) : undefined;
  const max = params.get("max") ? Number(params.get("max")) : parsed.max;
  const minRating = params.get("rating") ? Number(params.get("rating")) : parsed.minRating;
  const minReviews = params.get("reviews") ? Number(params.get("reviews")) : parsed.minReviews;
  const minDiscount = params.get("discount") ? Number(params.get("discount")) : parsed.minDiscount;
  const inStock = params.get("stock") === "1" || Boolean(parsed.inStock);
  const delivery = (params.get("delivery") as "same_day" | "next_day" | "free" | "") || "";
  const tab = (params.get("tab") as Tab) || "all";
  const page = Math.max(1, Number(params.get("page") || "1") || 1);

  const [minDraft, setMinDraft] = useState(min?.toString() ?? "");
  const [maxDraft, setMaxDraft] = useState(max?.toString() ?? "");

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    if (initialCategory && key !== "category") next.set("category", initialCategory);
    router.push(`${pathname}?${next.toString()}`);
  }

  const results = useMemo(
    () =>
      searchProductsPage(
        {
          q: parsed.q ?? (parsed.category ? undefined : q.trim() || undefined),
          category: category || undefined,
          brand: brand || undefined,
          store: store || undefined,
          min,
          max,
          sort,
          inStock: inStock || undefined,
          minRating,
          minReviews,
          minDiscount,
          capacity: parsed.capacity,
          delivery: delivery || undefined,
        },
        allProducts,
        page,
        SEARCH_PAGE_SIZE,
      ),
    [
      q,
      parsed.q,
      parsed.category,
      parsed.capacity,
      category,
      brand,
      store,
      min,
      max,
      sort,
      inStock,
      minRating,
      minReviews,
      minDiscount,
      delivery,
      allProducts,
      page,
    ],
  );

  const best = useMemo(() => pickBestChoice(results.items.slice(0, 24)), [results]);
  const areas = useMemo(() => (q.trim() ? matchAreas(q) : []), [q]);
  const net = networkStats();
  const storeOptions = useMemo(
    () =>
      [...catalogStores()].sort(
        (a, b) => Number(b.status === "connected") - Number(a.status === "connected"),
      ),
    [],
  );
  const uniqueBrands = [...new Set(brands.map((b) => b.name))];
  const showWaffari = tab !== "go";
  const showGo = tab !== "waffari" && Boolean(q.trim());
  const empty = (!showWaffari || results.total === 0) && (!showGo || areas.length === 0);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="space-y-3">
        <h1 className="font-heading text-3xl font-semibold">
          {q ? `نتائج «${q}»` : "كل منتجات الجهاز"}
        </h1>
        <p className="text-muted-foreground">
          {q
            ? "أي كتابة — حتى لو فيها غلط إملائي. النتيجة منتج واحد وكل بائعيه، مع صفحات للكتالوج المرجعي الكبير."
            : `الدليل المنسّق ${formatNumber(allProducts.length)} صنف + كتالوج تركيبي ${formatNumber(VIRTUAL_SKU_COUNT)} تركيبة لسوق مصر (ماركة × مقاس × نوع × لون). مش سحب لحظي لملايين الـ SKU من كل رف.`}
        </p>
        <p className="text-xs text-muted-foreground">
          شبكة الكتالوج: {net.catalog} متجر إيكومرس + أحياء على الخريطة · {net.ready} جاهز للعروض
          الموسَّعة · ابحثي زي «غسالة ١٠ كيلو أقل من ٣٠ ألف وتقييمها فوق ٤.٥»
        </p>
        <SearchBar defaultValue={q} category={initialCategory} />
        {!q ? (
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SEARCHES.map((s) => (
              <button
                key={s}
                type="button"
                className="rounded-full bg-muted px-3 py-1 text-xs hover:bg-secondary"
                onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}
        {parsed.intent.length ? (
          <div className="flex flex-wrap gap-1.5">
            {parsed.intent.map((chip, i) => (
              <Badge key={`${chip}-${i}`} variant="secondary">
                {chip}
              </Badge>
            ))}
          </div>
        ) : null}
        {q ? (
          <Link
            href={`/sourcing?q=${encodeURIComponent(q)}`}
            className="block rounded-xl bg-secondary/80 px-4 py-3 text-sm ring-1 ring-foreground/10 hover:bg-secondary"
          >
            خريطة المصادر لـ «{q}» — أونلاين + جملة + مصنع
          </Link>
        ) : null}
        {q ? (
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["all", `الكل`],
                ["waffari", `أونلاين (${formatNumber(results.total)})`],
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
          <p className="text-xs text-muted-foreground">الفلاتر على المنتج الرئيسي، مش على صفحة متجر.</p>
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
                <Chip key={c.id} active={category === c.id} onClick={() => setParam("category", c.id)}>
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
            <legend className="text-sm font-medium">البائع</legend>
            <select
              className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
              value={store}
              onChange={(e) => setParam("store", e.target.value)}
            >
              <option value="">كل المتاجر</option>
              {storeOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">التقييم</legend>
            <div className="flex flex-wrap gap-1.5">
              {[
                ["", "الكل"],
                ["4", "٤+"],
                ["4.5", "٤.٥+"],
              ].map(([v, label]) => (
                <Chip key={label} active={String(minRating ?? "") === v} onClick={() => setParam("rating", v)}>
                  {label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">عدد المراجعات</legend>
            <div className="flex flex-wrap gap-1.5">
              {[
                ["", "الكل"],
                ["100", "١٠٠+"],
                ["500", "٥٠٠+"],
                ["1000", "١٠٠٠+"],
              ].map(([v, label]) => (
                <Chip key={label} active={String(minReviews ?? "") === v} onClick={() => setParam("reviews", v)}>
                  {label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">الخصم</legend>
            <div className="flex flex-wrap gap-1.5">
              {[
                ["", "الكل"],
                ["10", "١٠٪+"],
                ["20", "٢٠٪+"],
                ["30", "٣٠٪+"],
              ].map(([v, label]) => (
                <Chip key={label} active={String(minDiscount ?? "") === v} onClick={() => setParam("discount", v)}>
                  {label}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">التوفر</legend>
            <Chip active={inStock} onClick={() => setParam("stock", inStock ? "" : "1")}>
              متوفر الآن
            </Chip>
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">التوصيل (لو مكتوب في العرض)</legend>
            <select
              className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
              value={delivery}
              onChange={(e) => setParam("delivery", e.target.value)}
            >
              <option value="">أي توصيل</option>
              <option value="same_day">نفس اليوم</option>
              <option value="next_day">يوم تالي</option>
              <option value="free">توصيل مجاني</option>
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
              {best ? (
                <article className="grid gap-4 rounded-2xl bg-primary/5 p-5 ring-1 ring-primary/20 md:grid-cols-[200px_1fr]">
                  <ProductPhoto id={best.id} category={best.category} name={best.name} brand={best.brand} model={best.model} className="rounded-xl" />
                  <div>
                  <p className="flex items-center gap-2 text-sm text-primary">
                    <Sparkles className="size-4" />
                    أفضل اختيار للجهاز
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-semibold">{best.name}</h3>
                  {(() => {
                    const intel = priceIntel(best);
                    const store = getStore(intel.cheapestStoreId);
                    return (
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        {formatPrice(intel.lowest)} · تقييم {intel.rating.toFixed(1)} ·{" "}
                        {intel.reviews.toLocaleString("ar-EG")} مراجعة · {intel.stores} متاجر · الأرخص:{" "}
                        <span className="inline-flex items-center gap-1">
                          <StoreLogo name={store?.name ?? ""} website={store?.website} size={16} />
                          {store?.name}
                        </span>
                      </p>
                    );
                  })()}
                  <div className="mt-3">
                    <SellerStrip product={best} />
                  </div>
                  <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    {whyBest(best).map((r) => (
                      <li key={r.label}>
                        <span className="font-medium">{r.label}.</span> {r.detail}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button nativeButton={false} render={<Link href={`/product/${best.id}`} />}>
                      قارني البائعين
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        addItem(best.id, cheapestListing(best).storeId);
                        toast.success("اتضافت للجهاز بالبائع الأرخص");
                      }}
                    >
                      أضيفي للجهاز
                    </Button>
                  </div>
                  </div>
                </article>
              ) : null}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-xl font-semibold">منتجات موحّدة</h2>
                  <p className="text-sm text-muted-foreground">
                    {results.total === 0
                      ? "مفيش منتج مطابق."
                      : `${formatNumber(results.total)} نتيجة — ${formatNumber(results.curated)} من الدليل المنسّق و${formatNumber(results.virtual)} تركيبة مرجعية. صفحة ${formatNumber(results.page)} من ${formatNumber(results.pages)}`}
                  </p>
                </div>
                <select
                  className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
                  value={sort}
                  onChange={(e) => setParam("sort", e.target.value)}
                >
                  <option value="best">أفضل اختيار</option>
                  <option value="price">الأرخص أولًا</option>
                  <option value="rating">الأعلى تقييمًا</option>
                  <option value="reviews">الأكثر مراجعات</option>
                  <option value="discount">أكبر خصم</option>
                  <option value="savings">أكبر فرق بين البائعين</option>
                  <option value="stores">الأكثر تغطية</option>
                </select>
              </div>
              {results.items.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
                  جرّبي جملة أوضح، أو امسحي الفلاتر.
                </div>
              )}
              {results.pages > 1 ? (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <Button
                    variant="outline"
                    disabled={results.page <= 1}
                    onClick={() => setParam("page", String(results.page - 1))}
                  >
                    السابق
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber((results.page - 1) * SEARCH_PAGE_SIZE + 1)}–
                    {formatNumber(Math.min(results.page * SEARCH_PAGE_SIZE, results.total))} من{" "}
                    {formatNumber(results.total)}
                  </p>
                  <Button
                    variant="outline"
                    disabled={results.page >= results.pages}
                    onClick={() => setParam("page", String(results.page + 1))}
                  >
                    التالي
                  </Button>
                </div>
              ) : null}
            </section>
          ) : null}

          {empty && q ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="font-medium">مفيش نتايج للكلمة دي</p>
              <p className="mt-1 text-sm text-muted-foreground">
                جرّبي فئة جاهزة أو امسحي الفلاتر. البحث بيطابق الاسم والماركة والفئة حتى لو الكتابة ناقصة.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {POPULAR_SEARCHES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="rounded-full bg-muted px-3 py-1 text-xs"
                    onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Button className="mt-4" variant="outline" onClick={() => router.push("/search")}>
                مسح الفلاتر وعرض السوق
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
