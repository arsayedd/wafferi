import Link from "next/link";
import { categories, products } from "@/lib/catalog";
import { ProductPhoto } from "@/components/product-photo";

export const metadata = { title: "الفئات" };

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold">فئات جهاز العروسة</h1>
      <p className="mt-2 text-muted-foreground">
        كل فئة بتجمع منتجات متطابقة من متاجر مصر — مش مجرد تصفح متجر واحد.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const list = products.filter((p) => p.category === c.id);
          const sample = list[0];
          return (
            <Link
              key={c.id}
              href={`/categories/${c.id}`}
              className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 hover:bg-secondary"
            >
              {sample ? (
                <ProductPhoto id={sample.id} category={c.id} name={sample.name} brand={sample.brand} model={sample.model} />
              ) : null}
              <div className="p-5">
              <h2 className="font-medium">{c.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <p className="mt-3 text-xs">{list.length} منتج موحّد</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
