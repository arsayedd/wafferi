import { fullSpecGroups } from "@/lib/full-specs";
import type { Product } from "@/lib/types";

export function SpecSheet({ product }: { product: Product }) {
  const groups = fullSpecGroups(product);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold">كل المواصفات</h2>
        <p className="text-sm text-muted-foreground">
          ورقة مواصفات للتخطيط والمقارنة. الأرقام المرجعية مش كتالوج المصنع الموقع إلا لو فيد رسمي اتربط.
        </p>
      </div>
      {groups.map((g) => (
        <section key={g.title} className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
          <h3 className="bg-muted/60 px-4 py-2 text-sm font-medium">{g.title}</h3>
          <dl>
            {g.rows.map((s) => (
              <div key={`${g.title}-${s.label}`} className="flex justify-between gap-4 border-t px-4 py-2 text-sm">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="max-w-[60%] text-end font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
