import Link from "next/link";
import { flatSpecs } from "@/lib/full-specs";
import type { Product } from "@/lib/types";

export function SpecCompare({ products }: { products: Product[] }) {
  if (products.length < 2) return null;
  const keys = [...new Set(products.flatMap((p) => flatSpecs(p).map((s) => s.label)))];
  const valueOf = (p: Product, label: string) =>
    flatSpecs(p).find((s) => s.label === label)?.value ?? "—";

  return (
    <div className="space-y-3">
      <h2 className="font-heading text-xl font-semibold">مقارنة جنب جنب</h2>
      <p className="text-sm text-muted-foreground">نفس الفئة — عشان تفرّقي الموديل والمقاس والسعر.</p>
      <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-3 py-2 text-start font-medium">البند</th>
              {products.map((p) => (
                <th key={p.id} className="px-3 py-2 text-start font-medium">
                  <Link href={`/product/${p.id}`} className="hover:underline">
                    {p.brand}
                  </Link>
                  <div className="text-xs font-normal text-muted-foreground">{p.capacity ?? p.model}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.slice(0, 28).map((label) => (
              <tr key={label} className="border-t">
                <td className="px-3 py-2 text-muted-foreground">{label}</td>
                {products.map((p) => (
                  <td key={p.id} className="px-3 py-2">
                    {valueOf(p, label)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
