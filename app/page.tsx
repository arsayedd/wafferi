import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ListChecks,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/search-bar";
import { ProductCard } from "@/components/product-card";
import { categories, products, stores, templates } from "@/lib/catalog";
import { productStats } from "@/lib/stats";
import { brideItemCount, brideSections } from "@/lib/bride-guide";
import { journeyStages } from "@/lib/bridal-map";

const homeCats = [
  "kitchen-tools",
  "cleaning",
  "bathroom",
  "textiles",
  "beauty",
  "bridal-wear",
  "storage",
  "travel",
  "emergency",
  "small-appliances",
  "washers",
  "fridges",
] as const;

export default function HomePage() {
  const deals = [...products]
    .sort((a, b) => productStats(b).save - productStats(a).save)
    .slice(0, 6);
  const roomTemplates = templates.filter((t) => t.kind !== "bundle");
  const bundleTemplates = templates.filter((t) => t.kind === "bundle");

  return (
    <div>
      <section className="relative overflow-hidden border-b bg-[radial-gradient(circle_at_20%_20%,oklch(0.92_0.05_75),transparent_45%),radial-gradient(circle_at_90%_10%,oklch(0.93_0.04_20),transparent_40%)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              <Sparkles className="size-4" />
              ماركتبليس العروسة: من الخطوبة لأول يوم في البيت — أونلاين وأحياء مصر
            </p>
            <h1 className="font-heading text-4xl leading-tight font-semibold md:text-5xl">
              كل مصدر شراء في خريطة واحدة. كل بند في الدليل. الأرخص ظاهر.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              مش محل جهاز. رحلة كاملة: فستان، ذهب، مكياج، رفايع حمام التلات، أجهزة
              عبدالعزيز، وايكيا. الأونلاين يتقارن؛ الجملة تتعرفي تروحي فين.
            </p>
            <SearchBar />
            <div className="flex flex-wrap gap-2">
              <Button nativeButton={false} render={<Link href="/map" />}>
                خريطة الشراء
              </Button>
              <Button nativeButton={false} render={<Link href="/guide" />}>
                دليل العروسة
              </Button>
              <Button variant="outline" nativeButton={false} render={<Link href="/places" />}>
                لو هتنزلي
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {["طقم حلل", "ستارة حمام", "بوكس الطوارئ", "شنطة سفر"].map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="rounded-full bg-background px-3 py-1 ring-1 ring-foreground/10 hover:bg-muted"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
          <Card className="bg-background/80 py-5 shadow-lg backdrop-blur">
            <CardContent className="space-y-4">
              <p className="text-sm font-medium">تغطية الدليل</p>
              <ul className="grid grid-cols-2 gap-3 text-sm">
                <li>
                  <strong className="block text-2xl text-primary">
                    {stores.length}
                  </strong>
                  مصدر شراء في الشبكة
                </li>
                <li>
                  <strong className="block text-2xl text-primary">
                    {journeyStages.length}
                  </strong>
                  مرحلة من الخطوبة للبيت
                </li>
                <li>
                  <strong className="block text-2xl text-primary">
                    {products.length}
                  </strong>
                  منتج موحّد
                </li>
                <li>
                  <strong className="block text-2xl text-primary">
                    {brideSections.length}
                  </strong>
                  باب في الدليل
                </li>
              </ul>
              <p className="text-xs leading-relaxed text-muted-foreground">
                البيانات تجريبية للتفاعل. الشبكة فيها ماركتبليس وسلاسل وهايبر وعلامات،
                والربط الحي بيمشي أفلييت ثم فيد رسمي — من غير سكرابينج كعمود فقري.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold">رحلة العروسة بـ 21 مرحلة</h2>
            <p className="text-sm text-muted-foreground">
              كل مرحلة ليها مصادر أونلاين وأحياء. مش 20 تبويب مفتوح في نفس الوقت.
            </p>
          </div>
          <Button variant="ghost" nativeButton={false} render={<Link href="/map" />}>
            الخريطة كاملة
            <ArrowLeft />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {journeyStages.map((st) => (
            <Link
              key={st.id}
              href={`/map#${st.id}`}
              className="rounded-xl bg-card p-3 text-sm ring-1 ring-foreground/10 hover:bg-secondary"
            >
              <span className="block text-xs text-primary">{st.n}</span>
              <span className="font-medium">{st.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold">تسوقِي حسب الباب</h2>
            <p className="text-sm text-muted-foreground">
              عيّنة من الفئات. الدليل الكامل فيه {brideItemCount} بند.
            </p>
          </div>
          <Button variant="ghost" nativeButton={false} render={<Link href="/guide" />}>
            دليل العروسة
            <ArrowLeft />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {homeCats.map((id) => {
            const c = categories.find((x) => x.id === id);
            if (!c) return null;
            return (
              <Link
                key={c.id}
                href={`/categories/${c.id}`}
                className="rounded-xl bg-card p-3 text-center text-sm ring-1 ring-foreground/10 hover:bg-secondary"
              >
                <span className="font-medium">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-semibold">أكبر فرق سعر بين المتاجر</h2>
          <p className="text-sm text-muted-foreground">
            نفس المنتج، متاجر مختلفة — الشراء من الأرخص يوفّر الفرق ده
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-2 font-heading text-2xl font-semibold">قايمات غرف</h2>
        <p className="mb-6 text-sm text-muted-foreground">بتفتح القايمة وتستبدل المحتويات بالقالب.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roomTemplates.map((t) => (
            <Card key={t.id}>
              <CardContent className="space-y-3">
                <ListChecks className="text-primary" />
                <h3 className="font-medium">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.description}</p>
                <p className="text-sm">
                  ميزانية مقترحة: {t.suggestedBudget.toLocaleString("ar-EG")} ج
                </p>
                <Button nativeButton={false} render={<Link href={`/list?template=${t.id}`} />}>
                  افتحي القايمة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <h2 className="mt-12 mb-2 font-heading text-2xl font-semibold">بوكسات العروسة</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          باقات تجارية جاهزة: مطبخ، تنظيم، حمام، عناية، شهر العسل، أول بيت.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bundleTemplates.map((t) => (
            <Card key={t.id}>
              <CardContent className="space-y-3">
                <ListChecks className="text-primary" />
                <h3 className="font-medium">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.description}</p>
                <p className="text-sm">
                  ميزانية مقترحة: {t.suggestedBudget.toLocaleString("ar-EG")} ج
                </p>
                <Button nativeButton={false} render={<Link href={`/list?template=${t.id}`} />}>
                  افتحي القايمة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
          {[
            {
              icon: Search,
              title: "1. دورِي",
              text: "اكتبي الماركة أو السعة. بنمطّق نفس الغسالة من جوميا ونون وبي تك في كارت واحد.",
            },
            {
              icon: CheckCircle2,
              title: "2. قارني",
              text: "الأرخص متعلم، التقييم ظاهر، ورابط الشراء أفلييت رسمي للمتجر.",
            },
            {
              icon: ListChecks,
              title: "3. ابنِي الجهاز",
              text: "قايمة بميزانية لحظية وتنبيه لو السعر نزل. تقدري تبدّلي بمنتج أرخص في نفس الفئة.",
            },
          ].map((s) => (
            <div key={s.title} className="space-y-2">
              <s.icon className="text-primary" />
              <h3 className="font-medium">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-heading text-2xl font-semibold">شبكة المتاجر</h2>
          <Link href="/stores" className="text-sm text-primary hover:underline">
            كل الشبكة وحالة الربط
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {stores
            .filter((s) => s.status === "connected" || s.status === "affiliate_ready")
            .map((s) => (
              <Link
                key={s.id}
                href={`/stores/${s.id}`}
                className="rounded-full bg-card px-3 py-1.5 text-sm ring-1 ring-foreground/10 hover:bg-muted"
              >
                {s.name}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
