import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);
  const list = products.filter((p) => p.brand === name);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold">{name}</h1>
      <p className="text-muted-foreground">
        {list.length ? `${list.length} منتج موحّد تحت الماركة دي` : "مفيش منتجات بالماركة دي في الكتالوج الحالي"}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
