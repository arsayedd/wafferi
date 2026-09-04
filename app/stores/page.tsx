import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { products, stores } from "@/lib/catalog";

export const metadata = { title: "المتاجر" };

export default function StoresPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold">المتاجر المتصلة</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        الـ MVP بيغطي المتاجر دي بكتالوج تجريبي. اللي عليه أفلييت نقدر نولّد منه
        عمولة من أول يوم؛ الباقي شراكة مباشرة أو لياد.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {stores.map((s) => {
          const n = products.filter((p) => p.listings.some((l) => l.storeId === s.id)).length;
          return (
            <Link
              key={s.id}
              href={`/stores/${s.id}`}
              className="rounded-xl bg-card p-5 ring-1 ring-foreground/10 hover:bg-secondary"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-medium">{s.name}</h2>
                <Badge variant={s.affiliate ? "default" : "outline"}>
                  {s.affiliate ? "أفلييت" : "شراكة مباشرة"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{s.specialty}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {s.city} · {s.commissionNote} · {n} منتج في الكتالوج
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
