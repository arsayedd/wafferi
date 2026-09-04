import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { products, stores } from "@/lib/catalog";
import { connectorLabels, statusLabels, verticalLabels } from "@/lib/network";

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
        كل الشبكة
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-3xl font-semibold">{store.name}</h1>
        <Badge>{statusLabels[store.status]}</Badge>
        <Badge variant="outline">{connectorLabels[store.connector]}</Badge>
      </div>
      <p className="max-w-2xl text-muted-foreground">
        {store.specialty}. طريقة الربط: {store.commissionNote}. الموقع:{" "}
        <a className="underline" href={store.website} target="_blank" rel="noreferrer">
          {store.website}
        </a>
      </p>
      <p className="text-sm">
        فئات الأجهزة: {store.verticals.map((v) => verticalLabels[v]).join(" · ")}
      </p>
      <p className="text-sm text-muted-foreground">
        {list.length} منتج ظاهر من الكتالوج الموحّد · تقدير تغطية المتجر{" "}
        {store.skuEstimate.toLocaleString("ar-EG")} صنف على موقعه.
      </p>
      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
          {store.kind === "district" || store.kind === "bridal"
            ? "المصدر ده أساسًا مقارنة على الطبيعة أو بوتيك. مفيش فيد أسعار لسه — ادخلي الخريطة والدليل، ولما التاجر يرفع كاتالوج هتظهر المنتجات هنا."
            : `المتجر في الشبكة، والفيد الرسمي لسه متصل. حالة الربط الحالية: ${statusLabels[store.status]}.`}
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
