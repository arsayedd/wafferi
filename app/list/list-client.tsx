"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cheapestListing, getProduct, templates } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useWaffari } from "@/hooks/use-waffari";
import { ProductArt } from "@/components/product-art";

export default function ListClient() {
  const params = useSearchParams();
  const templateId = params.get("template");
  const {
    items,
    budget,
    setBudget,
    applyTemplate,
    removeItem,
    togglePurchased,
    setNote,
    setQty,
    clearList,
  } = useWaffari();

  useEffect(() => {
    if (templateId) applyTemplate(templateId);
  }, [templateId, applyTemplate]);

  const rows = items
    .map((i) => {
      const p = getProduct(i.productId);
      if (!p) return null;
      const cheap = cheapestListing(p);
      return { item: i, product: p, cheap };
    })
    .filter((x) => x !== null);

  const total = rows.reduce((s, r) => s + r.cheap.price * r.item.qty, 0);
  const remaining = budget - total;
  const bought = rows.filter((r) => r.item.purchased).length;
  const pct = rows.length ? Math.round((bought / rows.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold">قايمة الجهاز</h1>
          <p className="text-muted-foreground">
            الميزانية بتتحدث مع كل إضافة. علّمي اللي اشتريتيه عشان تتابعي التقدم.
          </p>
        </div>
        <Button variant="outline" onClick={clearList} disabled={!items.length}>
          تفريغ القايمة
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {templates.map((t) => (
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
          الميزانية الإجمالية
          <Input
            className="mt-1"
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value) || 0)}
          />
        </label>
        <div>
          <p className="text-sm text-muted-foreground">مجموع أوفر الأسعار</p>
          <p className="text-2xl font-semibold">{formatPrice(total)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">المتبقي</p>
          <p
            className={`text-2xl font-semibold ${remaining < 0 ? "text-destructive" : "text-emerald-700"}`}
          >
            {formatPrice(remaining)}
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="mb-2 text-sm">
            تقدّم الشراء: {bought} من {rows.length}
          </p>
          <Progress value={pct} />
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="font-medium">القايمة فاضية</p>
          <p className="mt-1 text-sm text-muted-foreground">
            اختاري قالب من فوق، أو أضيفي منتجات من السوق.
          </p>
          <Button className="mt-4" nativeButton={false} render={<Link href="/search" />}>
            فتح السوق
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map(({ item, product, cheap }) => (
            <li
              key={product.id}
              className="grid gap-3 rounded-xl bg-card p-3 ring-1 ring-foreground/10 md:grid-cols-[120px_1fr_auto]"
            >
              <ProductArt category={product.category} className="rounded-lg" />
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Checkbox
                    checked={item.purchased}
                    onCheckedChange={() => togglePurchased(product.id)}
                  />
                  <div>
                    <Link
                      href={`/product/${product.id}`}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      أوفر سعر {formatPrice(cheap.price)} × {item.qty}
                    </p>
                  </div>
                </div>
                <Input
                  placeholder="ملاحظة: لون، مقاس المطبخ، ميعاد التوصيل…"
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
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false} render={<Link href={`/product/${product.id}`} />}
                >
                  قارني الأسعار
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(product.id)}
                >
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
