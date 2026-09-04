"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  houseTiers,
  marketplaceProfiles,
  matchSourcing,
  sourcingCategories,
  type SourcingCategory,
} from "@/lib/sourcing";
import { namedSuppliers } from "@/lib/named-suppliers";
import { egyptAreas } from "@/lib/egypt-areas";
import { stores } from "@/lib/catalog";
import { StoreLogo } from "@/components/store-logo";
import { storeHomeHref } from "@/lib/store-link";
import { kindLabels } from "@/lib/network";

function storeName(id: string) {
  return stores.find((s) => s.id === id)?.name ?? id;
}

function areaName(id: string) {
  return (
    egyptAreas.find((a) => a.id === id)?.name ??
    stores.find((s) => s.id === id)?.name ??
    id
  );
}

export default function SourcingClient() {
  const params = useSearchParams();
  const router = useRouter();
  const q0 = params.get("q") ?? "";
  const cat0 = params.get("cat") ?? "";
  const [q, setQ] = useState(q0);

  const cats = useMemo(() => matchSourcing(q0), [q0]);
  const active: SourcingCategory | undefined =
    cats.find((c) => c.id === cat0) ?? cats[0];

  const suppliers = namedSuppliers.filter(
    (s) => !active || s.categories.includes(active.id),
  );

  function go(nextQ: string, cat?: string) {
    const sp = new URLSearchParams();
    if (nextQ) sp.set("q", nextQ);
    if (cat) sp.set("cat", cat);
    const qs = sp.toString();
    router.push(qs ? `/sourcing?${qs}` : "/sourcing");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <div className="space-y-3">
        <p className="text-sm text-primary">Master Sourcing Map — مش قائمة مواقع وبس</p>
        <h1 className="font-heading text-3xl font-semibold md:text-4xl">
          منين تجيبي كل فئة: أونلاين، جملة، مصنع
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          خريطة عملية لأهم مصادر العروسة في مصر. آلاف صفحات الإنستجرام مش هتتعدّ.
          اللي هنا يكفي تبني عليه متجر أو ماركتبليس: ماركتبليس كبير، أسواق القاهرة،
          أحياء الجملة، ومناطق المصانع.
        </p>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            go(q.trim(), cat0);
          }}
        >
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="حلل، غسالة، بلاستيك، فستان، ذهب…"
            className="h-12"
          />
          <button type="submit" className={cn(buttonVariants(), "h-12")}>
            منين؟
          </button>
        </form>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        {[
          {
            t: "أونلاين",
            d: "جوميا، نون، أمازون، ايكيا، هومزمارت، رنين، صفقة، كوبيندي… تشوفي إيه موجود في السوق.",
          },
          {
            t: "جملة / أسواق",
            d: "العتبة، الموسكي، حمام التلات، درب سعادة، عبدالعزيز، الجمهورية. تنزلي تقارني كاش.",
          },
          {
            t: "مصانع",
            d: "العاشر، أكتوبر، العبور، دمياط، بدر. للكميات وMOQ — مش مشوار العروسة اليومي.",
          },
        ].map((x) => (
          <div key={x.t} className="rounded-xl bg-secondary/60 p-4">
            <p className="font-medium">{x.t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{x.d}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-semibold">ماركتبليس — بداية السوق</h2>
        <p className="text-sm text-muted-foreground">
          أهم نقطة لو عايزة تشوفي التغطية، مش تشتري وخلاص.
        </p>
        <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-muted/60 text-start">
              <tr>
                <th className="p-3 text-start font-medium">المصدر</th>
                <th className="p-3 text-start font-medium">أهم الحاجات</th>
              </tr>
            </thead>
            <tbody>
              {marketplaceProfiles.map((m) => (
                <tr key={m.id} className="border-t border-border/60">
                  <td className="p-3">
                    <Link className="text-primary hover:underline" href={`/stores/${m.id}`}>
                      {storeName(m.id)}
                    </Link>
                  </td>
                  <td className="p-3 text-muted-foreground">{m.sells}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-semibold">طبقات الجهاز</h2>
        <p className="text-sm text-muted-foreground">
          بدل ما العميلة تدور على مصفاة لوحدها: اختاري مستوى، والمنتجات متقسمة على
          الغرف في{" "}
          <Link className="text-primary underline" href="/guide">
            الدليل
          </Link>
          .
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {houseTiers.map((t) => (
            <Link
              key={t.id}
              href={`/plan`}
              className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:bg-secondary"
            >
              <p className="text-xs text-primary">{t.name}</p>
              <p className="font-medium">{t.budget.toLocaleString("ar-EG")} ج</p>
              <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
              <p className="mt-2 text-xs">{t.rooms.join(" · ")}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {sourcingCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => go(q0, c.id)}
            className={cn(
              "rounded-full px-3 py-1 text-sm",
              active?.id === c.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-muted",
            )}
          >
            {c.title}
          </button>
        ))}
      </div>

      {active ? (
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold">{active.title}</h2>
            <p className="text-sm text-muted-foreground">{active.blurb}</p>
            <p className="mt-1 text-xs">دورِي على: {active.products.join(" · ")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Lane
              title="أونلاين"
              empty="الفئة دي على الطبيعة أكتر."
              items={active.online.map((id) => ({
                href: `/stores/${id}`,
                name: storeName(id),
                meta: stores.find((s) => s.id === id)?.kind
                  ? kindLabels[stores.find((s) => s.id === id)!.kind]
                  : "",
              }))}
            />
            <Lane
              title="جملة / أسواق"
              empty="مفيش حي جملة مربوط."
              items={active.wholesale.map((id) => ({
                href: `/places?q=${encodeURIComponent(areaName(id))}`,
                name: areaName(id),
                meta: "انزلي على الطبيعة",
              }))}
            />
            <Lane
              title="مصانع"
              empty="الريتيل يكفي هنا؛ المصنع للكميات."
              items={active.factory.map((id) => ({
                href: `/places?q=${encodeURIComponent(areaName(id))}`,
                name: areaName(id),
                meta: "MOQ أعلى",
              }))}
            />
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-heading text-2xl font-semibold">موردين بأسماء</h2>
        <p className="text-sm text-muted-foreground">
          نواة قاعدة بيانات: اسم، عنوان، تليفون، جملة/قطاعي، الفئة. التوسعة لـ
          500–1000 مورد تتم بإضافة صفوف هنا، مش بادّعاء إننا غطّينا مصر.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {(suppliers.length ? suppliers : namedSuppliers).map((s) => (
            <article
              key={s.id}
              className="rounded-xl bg-card p-4 text-sm ring-1 ring-foreground/10"
            >
              <div className="flex flex-wrap items-center gap-2">
                {s.website ? <StoreLogo name={s.name} website={s.website} size={22} /> : null}
                <h3 className="font-medium">{s.name}</h3>
                <Badge variant="outline">{s.channel === "factory" ? "مصنع" : s.wholesale ? "جملة" : "قطاعي"}</Badge>
              </div>
              <p className="mt-1 text-muted-foreground">{s.notes}</p>
              {s.address ? <p className="mt-2 text-xs">{s.address}</p> : null}
              <p className="text-xs text-muted-foreground">{s.region}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {s.phone ? (
                  <a className="text-primary underline" href={`tel:${s.phone}`}>
                    {s.phone}
                  </a>
                ) : null}
                {s.website ? (
                  <a className="text-primary underline" href={storeHomeHref(s.website)} target="_blank" rel="noreferrer">
                    الموقع
                  </a>
                ) : null}
                {s.facebook ? (
                  <a className="text-primary underline" href={s.facebook} target="_blank" rel="noreferrer">
                    فيسبوك
                  </a>
                ) : null}
                {s.areaId ? (
                  <Link className="text-primary underline" href={`/places?q=${encodeURIComponent(areaName(s.areaId))}`}>
                    الحي
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="text-sm text-muted-foreground">
        الرحلة بالمراحل لسه على{" "}
        <Link className="text-primary underline" href="/map">
          خريطة الشراء
        </Link>
        . البنود كلها على{" "}
        <Link className="text-primary underline" href="/needs">
          الاحتياجات
        </Link>
        . الأحياء على{" "}
        <Link className="text-primary underline" href="/places">
          أماكن
        </Link>
        .
      </p>
    </div>
  );
}

function Lane({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: { href: string; name: string; meta: string }[];
}) {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <h3 className="font-medium">{title}</h3>
      {items.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((it) => (
            <li key={it.href + it.name}>
              <Link href={it.href} className="block rounded-lg p-2 hover:bg-secondary">
                <span className="block text-sm">{it.name}</span>
                <span className="text-xs text-muted-foreground">{it.meta}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{empty}</p>
      )}
    </div>
  );
}
