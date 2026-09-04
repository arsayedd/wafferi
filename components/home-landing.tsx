"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CalendarHeart,
  Compass,
  Heart,
  Layers,
  ListChecks,
  MapPinned,
  Scale,
  Radio,
  Sparkles,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { displayName } from "@/lib/session";
import { fiveArcs } from "@/lib/need-taxonomy";
import { journeyStages } from "@/lib/bridal-map";
import { cn } from "cn";

const arcCopy: Record<(typeof fiveArcs)[number], string> = {
  "قبل الجواز": "خطوبة، فستان، قاعة، تصوير — اللي بيتظبط قبل اليوم.",
  "يوم الجواز": "الميكب، الضيافة، التنسيق — يوم الفرح نفسه.",
  "تجهيز البيت": "أجهزة، مطبخ، غرف، تشطيب — حسب الشقة اللي داخلة عليها.",
  "أول شهر": "رفايع، تنظيف، طوارئ، بوكس البيت الجديد.",
  "بعد الجواز": "صيانة، هدايا، بيت أهدأ — بعد ما الدنيا تهدى.",
};

const modules = [
  {
    href: "/plan",
    icon: CalendarHeart,
    title: "الخطة",
    text: "تاريخ الفرح والميزانية والشقة يدخلوا. السيستم يطلع جهاز شهر بشهر ويشيل اللي عندكِ.",
  },
  {
    href: "/needs",
    icon: Heart,
    title: "الاحتياجات",
    text: "قاعدة بنود على خمس مراحل حياة. مش تبويبات متجر — قائمة تجهيز.",
  },
  {
    href: "/map",
    icon: Compass,
    title: "خريطة الرحلة",
    text: "مراحل من الخطوبة لبعد الفرح. كل مرحلة ليها مصدر أونلاين أو حي.",
  },
  {
    href: "/sourcing",
    icon: Layers,
    title: "خريطة التوريد",
    text: "لكل فئة: أونلاين، جملة، مصنع. اقتصادي / متوسط / فاخر.",
  },
  {
    href: "/guide",
    icon: ListChecks,
    title: "الدليل",
    text: "بنود الجهاز والبوكسات. تختاري وتضيفي للقايمة.",
  },
  {
    href: "/search",
    icon: Scale,
    title: "المقارنة",
    text: "نفس المنتج من أكتر من مصدر. السعر يتحدّث من فيد المصدر، والشراء عندهم.",
  },
  {
    href: "/live",
    icon: Radio,
    title: "أسعار حية",
    text: "فيد، Shopify، Woo، JSON-LD، وأمازون API. مش زحف عشوائي للمتاجر.",
  },
  {
    href: "/places",
    icon: MapPinned,
    title: "الأحياء",
    text: "حمام التلات، عبدالعزيز، دمياط، الصاغة — توجيه للحي من غير خرائط جوجل.",
  },
  {
    href: "/stores",
    icon: Store,
    title: "المصادر",
    text: "الأسماء حقوق أصحابها. المنتج يتربط بمتجره، والسعر الحي من الفيد المصرّح.",
  },
];

const flow = [
  { n: "١", title: "تعرّفي السيستم", text: "الهوم ده تعريف: مراحل، أدوات، وإيه اللي وفّري بتعمله وإيه اللي مش بتعمله." },
  { n: "٢", title: "تدخّلي بياناتك", text: "الفرح، الميزانية، الشقة، الغرف — تسجيل أو الخطة مباشرة." },
  { n: "٣", title: "تطلعلك خطة", text: "ضروري / مهم / رفاهيات. اقتصادي أو متوسط أو فاخر لكل بند." },
  { n: "٤", title: "تروحي للمصدر", text: "لينك أونلاين أو حي في مصر. السعر النهائي عندهم، والحقوق ليهم." },
];

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setOn(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", on && "reveal-on", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function HomeLanding() {
  const { user } = useSession();
  const firstName = user ? displayName(user).split(" ")[0] : null;
  const ticker = [...journeyStages.map((s) => s.title), ...journeyStages.map((s) => s.title)];

  return (
    <div className="overflow-x-hidden">
      <section className="relative isolate overflow-hidden border-b">
        <div className="orb orb-slow start-[-12%] top-[-24%] size-[30rem] bg-primary/25" />
        <div
          className="orb end-[-10%] top-[8%] size-[22rem] bg-accent/45"
          style={{ animationDelay: "-4s" }}
        />
        <div
          className="orb start-[38%] bottom-[-28%] size-[16rem] bg-secondary"
          style={{ animationDelay: "-7s" }}
        />
        <div className="home-grid-fade pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center md:py-28">
          <p className="rise inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            <Sparkles className="size-4" />
            تعريف بالسيستم — مش كتالوج شراء
          </p>
          <h1 className="rise-2 mx-auto mt-6 max-w-3xl font-heading text-4xl leading-[1.2] font-semibold md:text-6xl">
            <span className="text-primary">وفّري</span>
            <span className="mt-3 block">مخطِّط جهاز العروسة في مصر.</span>
          </h1>
          <p className="rise-3 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            مش محل بيحطلك رفوف منتجات. السيستم بياخد الفرح والشقة والميزانية، يبني خطة
            تجهيز، ويربط كل بند بمصدره. الشراء عند المتجر أو في الحي — الحقوق ليهم.
          </p>
          <div className="rise-4 mt-8 flex flex-wrap justify-center gap-2">
            {firstName ? (
              <Button size="lg" nativeButton={false} render={<Link href="/plan" />}>
                كمّلي خطة {firstName}
              </Button>
            ) : (
              <Button size="lg" nativeButton={false} render={<Link href="/register" />}>
                سجّلي وابدئي
              </Button>
            )}
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/plan" />}>
              شوفي الخطة
            </Button>
            <Button size="lg" variant="ghost" nativeButton={false} render={<Link href="/how-it-works" />}>
              إزاي بتشتغل
            </Button>
          </div>
        </div>

        <div className="relative border-t bg-background/50 py-4 backdrop-blur">
          <div className="marquee" aria-hidden>
            <div className="marquee-track">
              {ticker.map((title, i) => (
                <span key={`${title}-${i}`} className="marquee-item">
                  {title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Reveal>
          <p className="text-sm text-primary">المسار</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold md:text-4xl">أربع حركات، وبعدين تشتري برّه.</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {flow.map((step, i) => (
            <Reveal key={step.n} delay={i * 90}>
              <article className="home-card h-full rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                  {step.n}
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y bg-secondary/35">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <Reveal>
            <p className="text-sm text-primary">خمس مراحل حياة</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold md:text-4xl">مش تبويبات متجر.</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              كل مرحلة ليها بنودها في الاحتياجات، والخطة بتوزّعهم على الشهور لحد الفرح.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {fiveArcs.map((arc, i) => (
              <Reveal key={arc} delay={i * 80}>
                <Link
                  href={`/needs?arc=${encodeURIComponent(arc)}`}
                  className="home-card block h-full rounded-2xl bg-background p-5 ring-1 ring-foreground/10"
                >
                  <span className="text-xs tracking-widest text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-3 block font-heading text-xl font-semibold">{arc}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                    {arcCopy[arc]}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Reveal>
          <p className="text-sm text-primary">أدوات السيستم</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold md:text-4xl">
            الهوم يعرّف. الشغل جوّه الصفحات.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            كل أداة ليها صفحة. من هنا بتدخلي، مش بتشتري.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m, i) => (
            <Reveal key={m.href} delay={(i % 4) * 70}>
              <Link
                href={m.href}
                className="home-card group flex h-full flex-col rounded-2xl bg-card p-5 ring-1 ring-foreground/10"
              >
                <m.icon className="size-6 text-primary transition-transform duration-500 group-hover:-translate-x-1" />
                <h3 className="mt-4 font-heading text-lg font-semibold">{m.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                  ادخلي
                  <ArrowLeft className="size-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <Reveal>
            <h2 className="font-heading text-3xl font-semibold">وفّري بتعمل إيه</h2>
            <ul className="mt-6 space-y-3 text-muted-foreground">
              {[
                "تخطّط الجهاز حسب الفرح والشقة والميزانية.",
                "تجمع الاحتياج في مكان واحد على خمس مراحل.",
                "تورّيك مصدر الشراء: أونلاين أو حي.",
                "تقارن أسعار حية لنفس المنتج من فيدات الشركاء — زي منصات المقارنة.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-heading text-3xl font-semibold">وفّري مش بتعمل إيه</h2>
            <ul className="mt-6 space-y-3 text-muted-foreground">
              {[
                "مش محل ومش checkout. الفلوس عند المصدر.",
                "مش مخزون مسروق من صفحات المتاجر. السعر الحي من فيد مصرّح.",
                "مش مالكة أسماء جوميا ونون وكارفور وشعاراتهم.",
                "مش بنسكرِب صفحات المتاجر. الفيد الرسمي أو التوجيه للحي.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="orb start-[-8%] bottom-[-40%] size-[20rem] bg-primary/20" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center md:py-28">
          <Reveal>
            <h2 className="font-heading text-3xl font-semibold md:text-5xl">
              جاهزة تبني الجهاز؟
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              سجّلي الفرح والشقة، أو ابدئي الخطة فاضيّة. الباقي صفحات السيستم — مش الهوم.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <Button size="lg" nativeButton={false} render={<Link href="/register" />}>
                إنشاء حساب
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/login" />}>
                دخول
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
