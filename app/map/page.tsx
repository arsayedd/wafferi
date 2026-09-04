import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { kindLabels, statusLabels } from "@/lib/network";
import {
  journeyStages,
  oneStopStores,
  storesForStage,
} from "@/lib/bridal-map";
import { stores } from "@/lib/catalog";

export const metadata = { title: "خريطة شراء العروسة" };

export default function MapPage() {
  const oneStop = oneStopStores();

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
      <div className="space-y-3">
        <p className="text-sm text-primary">Bridal Marketplace — مش محل جهاز بس</p>
        <h1 className="font-heading text-3xl font-semibold md:text-4xl">
          خريطة الشراء من الخطوبة لأول يوم في البيت
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          العروسة في مصر بتشتري من ماركتبليس وهايبر وديبارتمنت، وكمان من عبدالعزيز وحمام
          التلات والصاغة وبوتيكات الفساتين. وفّري بتلمّ المصادر دي في رحلة واحدة: تقارني
          الأونلاين، وتعرفي أنهي حي تروحي للجملة. الربط الحي بأفلييت وفيد — الأحياء
          الفيزيائية ظاهرة كمصدر مقارنة على الطبيعة لحد ما التاجر يرفع كاتالوج.
        </p>
        <p className="text-sm">
          {stores.length} مصدر في الشبكة · {journeyStages.length} مرحلة في الرحلة
        </p>
        <div className="flex flex-wrap gap-2">
          <Button nativeButton={false} render={<Link href="/sourcing" />}>
            خريطة المصادر
          </Button>
          <Button nativeButton={false} render={<Link href="/places" />}>
            أماكن الأحياء
          </Button>
          <Button nativeButton={false} render={<Link href="/guide" />}>
            دليل المنتجات
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/stores" />}>
            كل الشبكة
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-heading text-2xl font-semibold">وان ستوب شوب</h2>
        <p className="text-sm text-muted-foreground">
          ابدئي من هنا لو عايزة تغطي أكتر من فئة في مكان واحد.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {oneStop.map((s) => (
            <Link
              key={s.id}
              href={`/stores/${s.id}`}
              className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:bg-secondary"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{s.name}</p>
                <Badge variant="outline">{kindLabels[s.kind]}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{s.specialty}</p>
              <p className="mt-2 text-xs">{s.city}</p>
            </Link>
          ))}
        </div>
      </section>

      <nav className="flex flex-wrap gap-2">
        {journeyStages.map((st) => (
          <a
            key={st.id}
            href={`#${st.id}`}
            className="rounded-full bg-secondary px-3 py-1 text-sm hover:bg-muted"
          >
            {st.n} {st.title}
          </a>
        ))}
      </nav>

      {journeyStages.map((st) => {
        const list = storesForStage(st);
        return (
          <section key={st.id} id={st.id} className="scroll-mt-24 space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs text-primary">{st.n}</p>
                <h2 className="font-heading text-2xl font-semibold">{st.title}</h2>
                <p className="text-sm text-muted-foreground">{st.blurb}</p>
                {st.finds?.length ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    هتلاقي: {st.finds.join(" · ")}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-2">
                {st.guideHref ? (
                  <Button size="sm" variant="outline" nativeButton={false} render={<Link href={st.guideHref} />}>
                    بنود الدليل
                  </Button>
                ) : null}
                {st.search ? (
                  <Button
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/search?q=${encodeURIComponent(st.search)}`} />}
                  >
                    دورِي في السوق
                  </Button>
                ) : null}
              </div>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/stores/${s.id}`}
                    className="flex h-full flex-col rounded-xl bg-card p-3 text-sm ring-1 ring-foreground/10 hover:bg-secondary"
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.city} · {statusLabels[s.status]}
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">{s.specialty}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
