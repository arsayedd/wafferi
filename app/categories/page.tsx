import Link from "next/link";
import { categories } from "@/lib/catalog";
import { departments } from "@/lib/departments";
import { virtualTotalForCategory, VIRTUAL_SKU_COUNT } from "@/lib/virtual-catalog";
import { formatNumber } from "@/lib/format";

export const metadata = { title: "أقسام السوق" };

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <div>
        <h1 className="font-heading text-3xl font-semibold">السوق مقسوم أقسام</h1>
        <p className="mt-2 text-muted-foreground">
          {departments.length} أقسام · {categories.length} فئة · {formatNumber(VIRTUAL_SKU_COUNT)} تركيبة مرجعية. مش سحب كل مواقع الإنترنت — كل فئة بتودّي بحث المتاجر المصرية.
        </p>
      </div>
      {departments.map((d) => (
        <section key={d.id} className="space-y-3">
          <div>
            <h2 className="font-heading text-2xl font-semibold">{d.name}</h2>
            <p className="text-sm text-muted-foreground">{d.blurb}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {d.categories.map((id) => {
              const c = categories.find((x) => x.id === id);
              if (!c) return null;
              const n = virtualTotalForCategory(id);
              return (
                <Link
                  key={id}
                  href={`/search?category=${id}`}
                  className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:bg-secondary"
                >
                  <h3 className="font-medium">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  <p className="mt-2 text-xs text-primary">{formatNumber(n)} صنف في الفئة</p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
