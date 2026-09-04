import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { products, stores } from "@/lib/catalog";

export function generateStaticParams() {
  return stores.map((s) => ({ slug: s.id }));
}

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = stores.find((s) => s.id === slug);
  if (!store) notFound();
  const list = products.filter((p) => p.listings.some((l) => l.storeId === store.id));

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <Link href="/stores" className="text-sm text-muted-foreground hover:underline">
        كل المتاجر
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-3xl font-semibold">{store.name}</h1>
        <Badge>{store.affiliate ? "برنامج أفلييت" : "شراكة / لياد"}</Badge>
      </div>
      <p className="max-w-2xl text-muted-foreground">
        {store.specialty}. {store.commissionNote}. التغطية الحالية: {list.length} منتج
        في كتالوج وفّري.
      </p>
      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
          لسه مفيش عروض متوصلة للمتجر ده في الـ MVP. ده مكان الشراكات اللي هتتضاف تدريجيًا.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
