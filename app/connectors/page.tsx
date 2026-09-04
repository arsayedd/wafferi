import Link from "next/link";
import { connectors } from "@/lib/ingest/connectors";

export const metadata = { title: "موصّلات الأسعار" };

export default function ConnectorsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-10 leading-relaxed">
      <div>
        <h1 className="font-heading text-3xl font-semibold">إزاي بنجيب السعر الحي</h1>
        <p className="mt-2 text-muted-foreground">
          نفس أدوات منصات المقارنة: فيدات شركاء، APIs رسمية، وبيانات منظمة معلنة على صفحة
          المنتج. مش زحف عشوائي، ومش تجاوز Cloudflare أو تسجيل الدخول للمتجر.
        </p>
      </div>
      <ul className="space-y-4">
        {connectors.map((c) => (
          <li key={c.id} className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
            <p className="text-xs text-primary">{c.id}</p>
            <h2 className="mt-1 font-heading text-xl font-semibold">{c.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
          </li>
        ))}
      </ul>
      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-lg font-medium text-foreground">إيه اللي خدناه من المشاريع المرجعية</h2>
        <p>
          <strong className="text-foreground">PriceBuddy:</strong> وصفة لكل دومين (schema.org / CSS /
          regex). اتحفظت في صفحة السحب، مش محرك Laravel.
        </p>
        <p>
          <strong className="text-foreground">PriceGhost:</strong> أكتر من طريقة تقرأ السعر، ولو اختلفوا
          تختاري إنتي. من غير Puppeteer stealth.
        </p>
        <p>
          <strong className="text-foreground">Price Tracking Scraper:</strong> جدولة + تاريخ سعر. عندنا
          تيك على `/live` وتحديث كل دقيقة للروابط المحفوظة.
        </p>
        <p>
          <strong className="text-foreground">WebCrawlerForInflation:</strong> أدنى/أعلى ونسبة التغيّر من
          التيكات. مش Spark ولا Common Crawl.
        </p>
        <p>
          <strong className="text-foreground">Google Maps Scrapper:</strong> مش مستخدم. أماكن وفّري
          أحياء مصر متجمّعة عندنا، من غير زحف خرائط جوجل.
        </p>
      </section>
      <section className="space-y-2 text-sm text-muted-foreground">
        <h2 className="text-lg font-medium text-foreground">جوميا ونون</h2>
        <p>
          مفيش API عام للمنتجات. السعر الحي المعتمد: فيد الأفلييت من لوحتهم (CSV/XML). لو صفحة
          المنتج فيها JSON-LD بنقرأ الـ Offer المعلن — مش بنفك الحماية ولا بنسحب الكتالوج كله.
        </p>
        <h2 className="mt-6 text-lg font-medium text-foreground">أمازون مصر</h2>
        <p>
          Creators API (بديل PA-API). حطي في البيئة{" "}
          <code className="rounded bg-muted px-1">AMAZON_CREATORS_ACCESS_TOKEN</code> و{" "}
          <code className="rounded bg-muted px-1">AMAZON_PARTNER_TAG</code> و{" "}
          <code className="rounded bg-muted px-1">AMAZON_MARKETPLACE=www.amazon.eg</code>.
        </p>
      </section>
      <Link href="/ingest" className="text-primary underline">
        جرّبي السحب
      </Link>
    </article>
  );
}
