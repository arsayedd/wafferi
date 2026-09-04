import Link from "next/link";
import { products, stores } from "@/lib/catalog";
import { formatNumber } from "@/lib/format";

export const metadata = { title: "ذكاء السوق" };

export default function IntelPage() {
  const offers = products.reduce((s, p) => s + p.listings.length, 0);
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-10 leading-relaxed">
      <div>
        <h1 className="font-heading text-3xl font-semibold">محرك بحث الجهاز — مش سكرابر</h1>
        <p className="mt-2 text-muted-foreground">
          القاعدة: منتج رئيسي ← عروض البائعين. البحث والفلاتر والجهاز يشتغلوا على المنتج الموحّد،
          والسعر النهائي عند المصدر.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="منتجات رئيسية" value={formatNumber(products.length)} />
        <Stat label="عروض بائعين" value={formatNumber(offers)} />
        <Stat label="مصادر في الشبكة" value={formatNumber(stores.length)} />
      </div>
      <section className="space-y-2 text-sm text-muted-foreground">
        <h2 className="text-lg font-medium text-foreground">العشر محركات جوّه وفّري</h2>
        <ol className="list-decimal space-y-2 pr-5">
          <li>موصّلات المنصات: فيد، Shopify، Woo، Magento GraphQL، JSON-LD، سايتماب — Playwright مش في المسار.</li>
          <li>توحيد المنتج: باركود ثم ماركة+موديل ثم تشابه الاسم.</li>
          <li>بحث عربي يفهم غسالة/غساله و«أقل من ٣٠ ألف» و«تقييم فوق ٤.٥».</li>
          <li>فلاتر: سعر، ماركة، تقييم، مراجعات، خصم، ستوك، بائع، توصيل.</li>
          <li>ذكاء السعر على صفحة المنتج: أقل / متوسط / أعلى + جدول البائعين.</li>
          <li>تاريخ السعر والتنبيه من التيكات الحية.</li>
          <li>جهاز العروسة: قوائم متعددة وميزانية لكل قايمة.</li>
          <li>تجميعة: المجموع، أقل تجميعة، التوفير المحتمل.</li>
          <li>مقارنة البائعين وترتيب الأرخص/التقييم/الخصم.</li>
          <li>تصدير Excel (CSV) للجهاز.</li>
        </ol>
        <p>
          مفيش Elasticsearch أو Redis هنا. الفهرس في الذاكرة على الكتالوج + الفيد. اللحظة بلحظة لكل
          متاجر مصر محتاجة APIs/webhooks من التجار.
        </p>
      </section>
      <div className="flex flex-wrap gap-3">
        <Link href="/search?q=غسالة+10+كيلو+أقل+من+30000" className="text-primary underline">
          جرّبي جملة بحث
        </Link>
        <Link href="/list" className="text-primary underline">
          جهاز العروسة
        </Link>
        <Link href="/connectors" className="text-primary underline">
          الموصّلات
        </Link>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
