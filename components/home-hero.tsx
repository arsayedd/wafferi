"use client";

import Link from "next/link";
import { ArrowLeft, Heart, MapPin, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { fiveArcs, needItemCount } from "@/lib/need-taxonomy";
import { stores } from "@/lib/catalog";
import { useSession } from "@/hooks/use-session";
import { displayName } from "@/lib/session";

const pillars = [
  {
    n: "01",
    title: "رحلة، مش كتالوج",
    text: "تاريخ الفرح والميزانية والشقة يدخلوا، والسيستم يطلع خطة شهر بشهر: فستان وقاعة أولًا، رفايع وطوارئ آخر شهر.",
  },
  {
    n: "02",
    title: "ماركتبليس مقارنة",
    text: "نفس المنتج من جوميا ونون وكارفور وهيبر. الأرخص ظاهر، والشراء يتم على المتجر — وفّري مش البائع.",
  },
  {
    n: "03",
    title: "خريطة مصر",
    text: "حمام التلات للحلل، عبدالعزيز للأجهزة، دمياط للأثاث، الصاغة للذهب. لو هتنزلي، بنرميكي على الحي.",
  },
  {
    n: "04",
    title: "خدمات + منتجات",
    text: "قاعة، ميكب، تصوير، تركيب تكييف، نقل عفش. بنوجّه للمصدر، مش بنحجز من هنا.",
  },
];

export function HomeHero({
  stages,
  sections,
}: {
  stages: number;
  sections: number;
}) {
  const { user } = useSession();

  return (
    <section className="relative overflow-hidden border-b">
      <div className="orb orb-slow start-[-10%] top-[-20%] size-[28rem] bg-primary/20" />
      <div
        className="orb end-[-8%] top-[10%] size-[22rem] bg-accent/40"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="orb start-[40%] bottom-[-30%] size-[18rem] bg-secondary"
        style={{ animationDelay: "-6s" }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
        <div className="space-y-6">
          <p className="rise inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            <Sparkles className="size-4" />
            منصة جهاز العروسة في مصر
          </p>
          <h1 className="rise-2 font-heading text-4xl leading-[1.15] font-semibold md:text-6xl">
            <span className="text-primary">وفّري</span>
            <span className="mt-2 block">تعرّفي السيستم قبل ما تشتري حاجة.</span>
          </h1>
          <p className="rise-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
            مش متجر بيحطلك ٥٠٠ منتج وتضيعي. بتدخلي بيانات الفرح والشقة، والسيستم يبني
            جهاز كامل: اقتصادي أو متوسط أو فاخر، يشيل اللي عندك، ويربط كل بند بمصدر شراء.
          </p>
          <div className="rise-4">
            <SearchBar />
          </div>
          <div className="rise-4 flex flex-wrap gap-2">
            {user ? (
              <Button nativeButton={false} render={<Link href="/plan" />}>
                كمّلي خطة {displayName(user).split(" ")[0]}
              </Button>
            ) : (
              <Button nativeButton={false} render={<Link href="/register" />}>
                سجّلي وابدئي الجهاز
              </Button>
            )}
            <Button variant="outline" nativeButton={false} render={<Link href="/plan" />}>
              جرّبي الخطة من غير حساب
            </Button>
            <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
              عندك حساب؟ دخولي
            </Button>
          </div>
          <ul className="rise-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <li className="inline-flex items-center gap-1.5">
              <Heart className="size-4 text-primary" /> {fiveArcs.length} مراحل حياة
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Wallet className="size-4 text-primary" /> {needItemCount} بند احتياج
            </li>
            <li className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-primary" /> {stores.length} مصدر في الشبكة
            </li>
          </ul>
        </div>

        <div className="rise-3 space-y-3">
          <div className="rounded-2xl bg-background/80 p-5 shadow-xl ring-1 ring-foreground/10 backdrop-blur">
            <p className="text-xs tracking-wide text-primary">إزاي بتشتغل في دقيقة</p>
            <ol className="mt-4 space-y-4">
              {[
                "تسجّلي: الفرح، الميزانية، الشقة، الغرف.",
                "الخطة تطلع: ضروري / مهم / رفاهيات.",
                "تعلّمي الموجود، تختارِي اقتصادي أو فاخر.",
                "كل بند يوديكي أونلاين أو للحي المناسب.",
              ].map((step, i) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <Link
              href="/how-it-works"
              className="mt-5 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              التفاصيل كاملة
              <ArrowLeft className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-card/90 p-4 ring-1 ring-foreground/10">
              <strong className="block text-2xl text-primary">{stages}</strong>
              مرحلة على الخريطة
            </div>
            <div className="rounded-xl bg-card/90 p-4 ring-1 ring-foreground/10">
              <strong className="block text-2xl text-primary">{sections}</strong>
              باب في دليل الجهاز
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t bg-background/40 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-px sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.n} className="space-y-2 px-4 py-8">
              <p className="text-xs text-primary">{p.n}</p>
              <h2 className="font-heading text-lg font-semibold">{p.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
