"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cheapestListing, getStore } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { productStats } from "@/lib/stats";
import { useWaffari } from "@/hooks/use-waffari";
import { useLive } from "@/hooks/use-live";

export default function ComparePage() {
  const { compare, toggleCompare, clearCompare } = useWaffari();
  const { liveById } = useLive();
  const cols = compare.map((id) => liveById(id)).filter((p) => p !== undefined);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold">قارني بين المنتجات</h1>
          <p className="text-muted-foreground">حد أقصى 3 منتجات. اختاريهم بزر «قارني» من الكروت.</p>
        </div>
        <Button variant="outline" onClick={clearCompare} disabled={!cols.length}>
          مسح المقارنة
        </Button>
      </div>

      {cols.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="font-medium">لسه مفيش منتجات في المقارنة</p>
          <Button className="mt-4" nativeButton={false} render={<Link href="/search" />}>
            اختاري من السوق
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr>
                <th className="p-2 text-start">البند</th>
                {cols.map((p) => (
                  <th key={p.id} className="p-2 text-start">
                    <Link href={`/product/${p.id}`} className="hover:underline">
                      {p.name}
                    </Link>
                    <div>
                      <Button variant="ghost" size="sm" onClick={() => toggleCompare(p.id)}>
                        إزالة
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2 text-muted-foreground">الماركة</td>
                {cols.map((p) => (
                  <td key={p.id} className="p-2">
                    {p.brand}
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-2 text-muted-foreground">أوفر سعر</td>
                {cols.map((p) => {
                  const c = cheapestListing(p);
                  return (
                    <td key={p.id} className="p-2 font-semibold text-primary">
                      {formatPrice(c.price)}
                      <div className="text-xs font-normal text-muted-foreground">
                        عند {getStore(c.storeId)?.name}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr className="border-t">
                <td className="p-2 text-muted-foreground">التوفير بين المتاجر</td>
                {cols.map((p) => (
                  <td key={p.id} className="p-2">
                    {formatPrice(productStats(p).save)}
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-2 text-muted-foreground">التقييم</td>
                {cols.map((p) => (
                  <td key={p.id} className="p-2">
                    {productStats(p).rating.toFixed(1)}
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-2 text-muted-foreground">عدد المتاجر</td>
                {cols.map((p) => (
                  <td key={p.id} className="p-2">
                    {p.listings.length}
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-2 text-muted-foreground">السعة / المقاس</td>
                {cols.map((p) => (
                  <td key={p.id} className="p-2">
                    {p.capacity ?? "—"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
