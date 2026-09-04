import Link from "next/link";
import { brands, products } from "@/lib/catalog";

export const metadata = { title: "الماركات" };

export default function BrandsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold">الماركات</h1>
      <p className="mt-2 text-muted-foreground">
        فلترِي بالجهاز حسب الماركة اللي بتثقي فيها — توشيبا العربي، إل جي، بوش، ايكيا…
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {brands.map((b) => {
          const n = products.filter((p) => p.brand === b.name).length;
          return (
            <Link
              key={b.id}
              href={`/brands/${encodeURIComponent(b.name)}`}
              className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:bg-secondary"
            >
              <p className="font-medium">{b.name}</p>
              <p className="text-xs text-muted-foreground">
                {b.origin} · {n} منتج
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
