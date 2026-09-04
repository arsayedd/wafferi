import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { StoreLogo } from "@/components/store-logo";
import { SourceCopyright } from "@/components/source-copyright";
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
        كل المصادر
      </Link>
      <h1 className="flex items-center gap-3 font-heading text-3xl font-semibold">
        <StoreLogo name={store.name} website={store.website} size={40} />
        {store.name}
      </h1>
      <p className="max-w-2xl text-muted-foreground">
        {store.specialty}. الموقع الرسمي:{" "}
        <a className="underline" href={store.website} target="_blank" rel="noreferrer">
          {store.website}
        </a>
      </p>
      <SourceCopyright sourceName={store.name} />
      <p className="text-sm">
        {list.length
          ? `${list.length} منتج في وفّري متربط بعرض من المصدر ده.`
          : "مفيش منتجات مربوطة هنا لسه — الاسم للتحويل والتوجيه بس."}
      </p>
      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
