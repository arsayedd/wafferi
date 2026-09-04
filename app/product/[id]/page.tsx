"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Bell, Star } from "lucide-react";
import { toast } from "sonner";
import { PriceTable } from "@/components/price-table";
import { ProductPhoto } from "@/components/product-photo";
import { StoreLogo } from "@/components/store-logo";
import { SellerStrip } from "@/components/seller-strip";
import { Sparkline } from "@/components/sparkline";
import { SourceCopyright } from "@/components/source-copyright";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getCategory, getProduct, getStore, products } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { productStats } from "@/lib/stats";
import { priceIntel, whyBest } from "@/lib/best-choice";
import { useWaffari } from "@/hooks/use-waffari";
import { useLive } from "@/hooks/use-live";
import { useCatalog } from "@/hooks/use-catalog";
import { ShopLink } from "@/components/shop-link";
import { SpecSheet } from "@/components/spec-sheet";
import { SpecCompare } from "@/components/spec-compare";
import { ProductCard } from "@/components/product-card";
import { ProductToc, ProductVideos, VersusStrip } from "@/components/product-hub";
import { similarVirtual } from "@/lib/product-research";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { allProducts } = useCatalog();
  const catalog = getProduct(id) ?? allProducts.find((p) => p.id === id);
  const { addItem, items, addAlert, alerts, toggleCompare, compare } = useWaffari();
  const { liveProduct, quoteHistory } = useLive();
  const [target, setTarget] = useState("");

  if (!catalog) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">المنتج مش موجود</h1>
        <p className="mt-2 text-muted-foreground">يمكن الرابط قديم أو المعرّف غلط.</p>
        <Button className="mt-6" nativeButton={false} render={<Link href="/search" />}>
          ارجعي للسوق
        </Button>
      </div>
    );
  }

  const product = liveProduct(catalog);
  const { cheap, save, rating, stores } = productStats(product);
  const history = quoteHistory(product.id, cheap.storeId);
  const cat = getCategory(product.category);
  const inList = items.some((i) => i.productId === product.id);
  const related = [
    ...products.filter((p) => p.category === product.category && p.id !== product.id),
    ...similarVirtual(product, 6),
  ].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <ProductToc />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <ProductPhoto
          id={product.id}
          category={product.category}
          name={product.name}
          brand={product.brand}
          model={product.model}
          className="rounded-2xl"
        />
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <Link href={`/brands/${encodeURIComponent(product.brand)}`} className="hover:underline">
              {product.brand}
            </Link>
            {" · "}
            <Link href={`/categories/${product.category}`} className="hover:underline">
              {cat?.name}
            </Link>
          </p>
          <h1 className="font-heading text-3xl font-semibold">{product.name}</h1>
          {(() => {
            const intel = priceIntel(product);
            return (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200">
                  <p className="text-xs text-muted-foreground">أقل سعر</p>
                  <p className="text-xl font-semibold">{formatPrice(intel.lowest)}</p>
                </div>
                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">متوسط السوق</p>
                  <p className="text-xl font-semibold">{formatPrice(intel.average)}</p>
                </div>
                <div className="rounded-xl bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">أعلى سعر</p>
                  <p className="text-xl font-semibold">{formatPrice(intel.highest)}</p>
                </div>
              </div>
            );
          })()}
          <ul className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {whyBest(product).map((r) => (
              <li key={r.label} className="rounded-full bg-muted px-2 py-1">
                {r.label}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-accent text-accent" />
              {rating.toFixed(1)} تقييم مجمّع من المتاجر
            </span>
            <Badge variant="secondary">{stores} متاجر متطابقة</Badge>
            <Badge variant="outline">موديل {product.model}</Badge>
            {product.barcode && <Badge variant="outline">باركود {product.barcode}</Badge>}
          </div>
          <p className="text-3xl font-semibold text-primary">{formatPrice(cheap.price)}</p>
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            أوفر سعر حي من{" "}
            <ShopLink
              storeId={cheap.storeId}
              productName={product.name}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <StoreLogo
                name={getStore(cheap.storeId)?.name ?? ""}
                website={getStore(cheap.storeId)?.website}
                size={18}
              />
              {getStore(cheap.storeId)?.name ?? cheap.storeId}
            </ShopLink>
            — المنتج عندهم، مش عندنا. الفرق عن أغلى عرض {formatPrice(save)}.
          </p>
          <SellerStrip product={product} />
          {history.length > 1 ? <Sparkline values={history} className="h-11 w-40" /> : null}
          <SourceCopyright
            compact
            names={[
              product.brand,
              getStore(cheap.storeId)?.name,
              ...product.listings.map((l) => getStore(l.storeId)?.name),
            ]}
          />
          <ul className="list-disc space-y-1 pr-5 text-sm">
            {product.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                addItem(product.id);
                toast.success("اتضافت لقايمة الجهاز");
              }}
              disabled={inList}
            >
              {inList ? "في قايمة الجهاز" : "أضيفي لقايمة الجهاز"}
            </Button>
            <Button variant="outline" onClick={() => toggleCompare(product.id)}>
              {compare.includes(product.id) ? "اتشالت من المقارنة" : "أضيفي للمقارنة"}
            </Button>
          </div>
          <div className="flex flex-wrap items-end gap-2 rounded-xl bg-muted/50 p-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">نبّهيني لو السعر نزل تحت</label>
              <Input
                inputMode="numeric"
                placeholder={String(cheap.price - 500)}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                const n = Number(target);
                if (!n) {
                  toast.error("اكتبي سعر مستهدف");
                  return;
                }
                addAlert(product.id, n);
                toast.success("هنجيلكِ نوتيفيكيشن أول ما السعر ينزل للهدف");
              }}
            >
              <Bell />
              {alerts.some((a) => a.productId === product.id) ? "تحديث التنبيه" : "تفعيل تنبيه"}
            </Button>
          </div>
        </div>
      </div>

      <section id="secPrices" className="scroll-mt-28 space-y-3">
        <h2 className="font-heading text-xl font-semibold">
          العروض مربوطة بمصادرها ({product.listings.length} عرض)
        </h2>
        <PriceTable listings={product.listings} productName={product.name} />
      </section>

      <div id="secSpecs" className="scroll-mt-28">
        <SpecSheet product={product} />
      </div>

      <ProductVideos product={product} />

      <section id="secCompare" className="scroll-mt-28 space-y-4">
        <h2 className="font-heading text-xl font-semibold">مقارنات جاهزة</h2>
        <VersusStrip product={product} />
        <SpecCompare products={[product, ...related.slice(0, 2)]} />
      </section>

      <section id="secReviews" className="scroll-mt-28">
        <h2 className="mb-3 font-heading text-xl font-semibold">آراء من المتاجر</h2>
        <div className="space-y-3">
          {product.reviewHighlights.map((r) => (
            <blockquote key={r.author} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <p className="text-sm leading-relaxed">«{r.text}»</p>
              <footer className="mt-2 text-xs text-muted-foreground">
                {r.author} · {r.source} · {r.rating}/5
              </footer>
            </blockquote>
          ))}
          {product.reviewHighlights.length === 0 && (
            <p className="text-sm text-muted-foreground">لسه مفيش مقتطفات تقييم للمنتج ده.</p>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold">منتجات قريبة في نفس الفئة</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
