import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ListChecks,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeHero } from "@/components/home-hero";
import { categories, stores, templates } from "@/lib/catalog";
import { brideItemCount, brideSections } from "@/lib/bride-guide";
import { journeyStages } from "@/lib/bridal-map";
import { fiveArcs } from "@/lib/need-taxonomy";

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
  const roomTemplates = templates.filter((t) => t.kind !== "bundle").slice(0, 6);
  const bundleTemplates = templates.filter((t) => t.kind === "bundle").slice(0, 6);

  return (
    <div>
      <HomeHero stages={journeyStages.length} sections={brideSections.length} />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold">خمس مراحل، مش تبويبات متجر</h2>
            <p className="text-sm text-muted-foreground">
              قبل الجواز، يوم الفرح، تجهيز البيت، أول شهر، بعد الجواز — خدمات ومنتجات.
            </p>
          </div>
          <Button variant="ghost" nativeButton={false} render={<Link href="/plan" />}>
            ابنِي الجهاز
            <ArrowLeft />
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {fiveArcs.map((arc, i) => (
            <Link
              key={arc}
              href={`/needs?arc=${encodeURIComponent(arc)}`}
              className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:bg-secondary"
            >
              <span className="text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
              <span className="mt-1 block font-medium">{arc}</span>
            </Link>
          ))}
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
          {journeyStages.slice(0, 14).map((st) => (
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

      <section className="mx-auto max-w-6xl px-4">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground md:px-10">
          <p className="text-sm text-primary-foreground/80">جاهزة تبدئي؟</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold">سجّلي الفرح والشقة — الخطة بتتبني لوحدها</h2>
          <p className="mt-3 max-w-2xl text-sm text-primary-foreground/85">
            التسجيل فيه الاسم، العريس، المحافظة، الميزانية، التشطيب، المطبخ، الأجهزة.
            بعدين تفتحي الخطة بنفس الأرقام من غير ما تملي تاني.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              إنشاء حساب
            </Button>
            <Button
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              دخول
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-semibold">السوق والمقارنة</h2>
            <p className="text-sm text-muted-foreground">
              نفس المنتج من أكتر من متجر. الصور والعروض على صفحة السوق مش الهوم عشان الصفحة تفتح خفيفة.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/search" />}>
            فتح السوق
            <ArrowLeft />
          </Button>
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
