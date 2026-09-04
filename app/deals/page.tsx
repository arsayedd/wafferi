import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";
import { productStats } from "@/lib/stats";

export const metadata = { title: "أوفر سعر" };

export default function DealsPage() {
  const deals = [...products]
    .map((p) => ({ p, save: productStats(p).save }))
    .filter((x) => x.save > 0)
    .sort((a, b) => b.save - a.save);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold">أوفر سعر بين المتاجر</h1>
      <p className="mt-2 text-muted-foreground">
        المنتجات اللي فرق السعر فيها بين أرخص وأغلى متجر واضح. اشتري من الأخضر.
      </p>
      {deals.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">مفيش فروقات سعر في الكتالوج الحالي.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map(({ p }) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
