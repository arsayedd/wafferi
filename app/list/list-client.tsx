"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cheapestListing, getProduct, getStore, templates } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { budgetSwitches, collectionTotals } from "@/lib/budget-optimizer";
import { roomBlueprints } from "@/lib/setup-rooms";
import { downloadCsv, setupSellersCsv, setupToCsv } from "@/lib/export-setup";
import { pickBestChoice } from "@/lib/best-choice";
import { useWaffari } from "@/hooks/use-waffari";
import { useLive } from "@/hooks/use-live";
import { useCatalog } from "@/hooks/use-catalog";
import { ProductPhoto } from "@/components/product-photo";

export default function ListClient() {
  const params = useSearchParams();
  const templateId = params.get("template");
  const {
    items,
    budget,
    setBudget,
    applyTemplate,
    fillTemplate,
    addMany,
    addItem,
    removeItem,
    togglePurchased,
    setNote,
    setQty,
    setItemStore,
    clearList,
    setups,
    activeId,
    switchSetup,
    createSetup,
    renameSetup,
    deleteSetup,
  } = useWaffari();
  const { liveProduct } = useLive();
  const { allProducts } = useCatalog();
  const [newName, setNewName] = useState("");
  const active = setups.find((s) => s.id === activeId);

  useEffect(() => {
    if (templateId) applyTemplate(templateId);
  }, [templateId, applyTemplate]);

  const resolve = (id: string) => {
    const p = getProduct(id) ?? allProducts.find((x) => x.id === id);
    return p ? liveProduct(p) : undefined;
  };

  const rows = items.map((i) => {
    const p = resolve(i.productId);
    if (!p) {
      return {
        item: i,
        product: { id: i.productId, name: i.productId, category: "accessories" as const, listings: [] },
        cheap: { price: 0, storeId: "" },
        missing: true as const,
      };
    }
    const offer =
      (i.storeId ? p.listings.find((l) => l.storeId === i.storeId) : undefined) ?? cheapestListing(p);
    return { item: i, product: p, cheap: offer, missing: false as const };
  });

  const totals = collectionTotals(items, resolve);
  const remaining = budget - totals.selected;
  const over = Math.max(0, totals.selected - budget);
  const bought = rows.filter((r) => r.item.purchased).length;
  const pct = rows.length ? Math.round((bought / rows.length) * 100) : 0;
  const tips = useMemo(
    () => budgetSwitches(items, allProducts, resolve),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, allProducts],
  );

  function exportExcel() {
    if (!items.length) {
      toast.error("القايمة فاضية");
      return;
    }
    downloadCsv(`${active?.name ?? "setup"}.csv`, setupToCsv(active?.name ?? "setup", items, resolve));
    toast.success("اتحمّل ملف CSV يفتح في Excel");
  }

  function exportSellers() {
    if (!items.length) {
      toast.error("القايمة فاضية");
      return;
    }
    downloadCsv(
      `${active?.name ?? "setup"}-sellers.csv`,
      setupSellersCsv(items, resolve),
    );
    toast.success("اتحمّل ملف كل البائعين: المنتج عند مين ومين");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">جهاز العروسة</h1>
          <p className="text-muted-foreground">
            سيّفي البنود، اختاري البائع لكل قطعة، صدّري القايمة أو ملف كل البائعين (مين بيبيع إيه وبكام).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportExcel} disabled={!items.length}>
            تصدير الجهاز
          </Button>
          <Button variant="outline" onClick={exportSellers} disabled={!items.length}>
            تصدير كل البائعين
          </Button>
          <Button variant="outline" onClick={clearList} disabled={!items.length}>
            تفريغ القايمة الحالية
          </Button>
        </div>
      </div>

      <section className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
        <p className="text-sm font-medium">القوائم</p>
        <div className="flex flex-wrap gap-2">
          {setups.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => switchSetup(s.id)}
              className={`rounded-full px-3 py-1 text-sm ${
                s.id === activeId ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="جهاز مريم / المطبخ / هدايا…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="max-w-xs"
          />
          <Button
            size="sm"
            onClick={() => {
              createSetup(newName || "قايمة جديدة");
              setNewName("");
            }}
          >
            قايمة جديدة
          </Button>
          {active ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const name = window.prompt("اسم القايمة", active.name);
                if (name) renameSetup(active.id, name);
              }}
            >
              إعادة تسمية
            </Button>
          ) : null}
          {setups.length > 1 ? (
            <Button size="sm" variant="ghost" onClick={() => deleteSetup(activeId)}>
              حذف القايمة
            </Button>
          ) : null}
        </div>
      </section>

      <div>
        <p className="mb-2 text-sm font-medium">كمّلي التجهيز</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roomBlueprints.map((b) => {
            const covered = b.slots.filter((slot) =>
              items.some((it) => resolve(it.productId)?.category === slot.category),
            ).length;
            return (
              <div key={b.id} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
                <p className="font-medium">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.blurb}</p>
                <p className="mt-2 text-sm">
                  {covered} من {b.slots.length} بنود
                </p>
                <Progress className="mt-2" value={b.slots.length ? (covered / b.slots.length) * 100 : 0} />
                <div className="mt-3 flex gap-2">
                  {b.templateId ? (
                    <Button size="sm" variant="secondary" onClick={() => fillTemplate(b.templateId!)}>
                      كمّلي الناقص
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const ids = b.slots
                          .map((slot) => pickBestChoice(allProducts.filter((p) => p.category === slot.category))?.id)
                          .filter((id): id is string => Boolean(id));
                        addMany(ids);
                      }}
                    >
                      أفضل اختيارات
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {templates
          .filter((t) => t.kind !== "bundle")
          .map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                applyTemplate(t.id);
                toast.success(`اتطبقت قايمة ${t.name}`);
              }}
              className="rounded-xl bg-card p-4 text-start ring-1 ring-foreground/10 hover:bg-secondary"
            >
              <p className="font-medium">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.description}</p>
            </button>
          ))}
      </div>

      <div className="grid gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 md:grid-cols-3">
        <label className="text-sm">
          ميزانية القايمة
          <Input
            className="mt-1"
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value) || 0)}
          />
        </label>
        <div>
          <p className="text-sm text-muted-foreground">مجموع العروض المختارة</p>
          <p className="text-2xl font-semibold">{formatPrice(totals.selected)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">المتبقي</p>
          <p className={`text-2xl font-semibold ${remaining < 0 ? "text-destructive" : "text-emerald-700"}`}>
            {formatPrice(remaining)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">أقل تجميعة ممكنة</p>
          <p className="text-lg font-semibold">{formatPrice(totals.lowest)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">توفير محتمل لو الأرخص</p>
          <p className="text-lg font-semibold">{formatPrice(totals.saving)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">تقدّم الشراء</p>
          <p className="mb-2 text-sm">
            {bought} من {rows.length}
          </p>
          <Progress value={pct} />
        </div>
      </div>

      {over > 0 || tips.length ? (
        <section className="rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
          <p className="font-medium">
            {over > 0 ? `أعلى من الميزانية بـ ${formatPrice(over)}` : "توفير لو بدّلتي بند"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">بدائل أرخص في نفس الفئة:</p>
          {tips.length === 0 ? (
            <p className="mt-2 text-sm">مفيش بديل واضح من غير نزول كبير في التقييم.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {tips.map((t) => (
                <li key={t.fromId} className="flex flex-wrap items-center justify-between gap-2">
                  <span>
                    بدّلي {t.fromName} ← {t.toName} · توفّري {formatPrice(t.save)}
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      removeItem(t.fromId);
                      addItem(t.toId);
                      toast.success("اتبدّل المنتج");
                    }}
                  >
                    تطبيق
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="font-medium">القايمة فاضية</p>
          <p className="mt-1 text-sm text-muted-foreground">
            كمّلي تجهيز المطبخ من فوق، أو{" "}
            <Link href="/search" className="text-primary underline">
              ابحثي في السوق
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map(({ item, product, cheap }) => (
            <li
              key={product.id}
              className="grid gap-3 rounded-xl bg-card p-3 ring-1 ring-foreground/10 md:grid-cols-[120px_1fr_auto]"
            >
              <ProductPhoto
                id={product.id}
                category={product.category}
                name={product.name}
                className="rounded-lg"
              />
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Checkbox checked={item.purchased} onCheckedChange={() => togglePurchased(product.id)} />
                  <div>
                    <Link href={`/product/${product.id}`} className="font-medium hover:underline">
                      {product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(cheap?.price ?? 0)} × {item.qty}
                      {"listings" in product && product.listings?.length
                        ? ` · عند ${product.listings.length} بائع`
                        : ""}
                    </p>
                  </div>
                </div>
                {"listings" in product && product.listings?.length ? (
                  <select
                    className="h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
                    value={item.storeId ?? cheapestListing(product as never).storeId}
                    onChange={(e) => setItemStore(product.id, e.target.value)}
                  >
                    {(product as { listings: { storeId: string; price: number }[] }).listings.map((l) => (
                      <option key={l.storeId} value={l.storeId}>
                        {getStore(l.storeId)?.name ?? l.storeId} · {formatPrice(l.price)}
                      </option>
                    ))}
                  </select>
                ) : null}
                <Input
                  placeholder="ملاحظة: لون، مقاس المطبخ…"
                  value={item.note}
                  onChange={(e) => setNote(product.id, e.target.value)}
                />
              </div>
              <div className="flex flex-col items-stretch gap-2">
                <Input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) => setQty(product.id, Number(e.target.value))}
                />
                <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/product/${product.id}`} />}>
                  البائعون
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeItem(product.id)}>
                  احذف
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
