"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { buildPlan, type PlanAnswers } from "@/lib/bride-plan";
import { houseTiers, sourcingCategories } from "@/lib/sourcing";
import { needsForSources } from "@/lib/need-taxonomy";
import { cn } from "@/lib/utils";

const defaults: PlanAnswers = {
  months: 6,
  budget: 150000,
  furnished: false,
  hasKitchen: false,
  hasAppliances: false,
  bedrooms: 1,
  bathrooms: 1,
  tier: "smart",
};

export default function PlanClient() {
  const [a, setA] = useState<PlanAnswers>(defaults);
  const [shown, setShown] = useState(false);
  const plan = useMemo(() => buildPlan(a), [a]);
  const shopping = useMemo(() => {
    const ids = plan.months.flatMap((m) => m.categoryIds);
    const seen = new Set<string>();
    const pick = (pri: "must" | "should") =>
      needsForSources(ids, pri).filter((it) => {
        if (seen.has(it.name)) return false;
        seen.add(it.name);
        return true;
      });
    return { must: pick("must").slice(0, 28), should: pick("should").slice(0, 12) };
  }, [plan]);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div className="space-y-3">
        <p className="text-sm text-primary">مش قائمة تسوّق عشوائية — خطة حسب بيتك وميزانيتك</p>
        <h1 className="font-heading text-3xl font-semibold">خطة جهاز العروسة</h1>
        <p className="text-muted-foreground">
          تاريخ الفرح، الميزانية، الشقة مفروشة ولا لأ. نطلع أولويات + مصادر من الخريطة.
          الخدمات (قاعة، مصور، ميكب آرتست) ظاهرة كمرحلة، من غير ما ندّعي إن عندنا كل
          مقدّم خدمة في مصر.
        </p>
      </div>

      <form
        className="space-y-5 rounded-xl bg-card p-5 ring-1 ring-foreground/10"
        onSubmit={(e) => {
          e.preventDefault();
          setShown(true);
        }}
      >
        <label className="block space-y-1 text-sm">
          فاضل كام شهر على الفرح؟
          <Input
            inputMode="numeric"
            value={a.months}
            onChange={(e) => setA({ ...a, months: Number(e.target.value) || 1 })}
          />
        </label>
        <label className="block space-y-1 text-sm">
          الميزانية بالجنيه
          <Input
            inputMode="numeric"
            value={a.budget}
            onChange={(e) => setA({ ...a, budget: Number(e.target.value) || 0 })}
          />
        </label>
        <fieldset className="space-y-2 text-sm">
          <legend>مستوى الجهاز</legend>
          <div className="flex flex-wrap gap-2">
            {houseTiers.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setA({ ...a, tier: t.id })}
                className={cn(
                  "rounded-full px-3 py-1",
                  a.tier === t.id ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <Toggle
            label="الشقة مفروشة؟"
            on={a.furnished}
            set={(furnished) => setA({ ...a, furnished })}
          />
          <Toggle
            label="المطبخ موجود؟"
            on={a.hasKitchen}
            set={(hasKitchen) => setA({ ...a, hasKitchen })}
          />
          <Toggle
            label="الأجهزة الكبيرة موجودة؟"
            on={a.hasAppliances}
            set={(hasAppliances) => setA({ ...a, hasAppliances })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <label className="space-y-1">
            غرف نوم
            <Input
              inputMode="numeric"
              value={a.bedrooms}
              onChange={(e) => setA({ ...a, bedrooms: Number(e.target.value) || 1 })}
            />
          </label>
          <label className="space-y-1">
            حمّامات
            <Input
              inputMode="numeric"
              value={a.bathrooms}
              onChange={(e) => setA({ ...a, bathrooms: Number(e.target.value) || 1 })}
            />
          </label>
        </div>
        <Button type="submit">طلّعي الخطة</Button>
      </form>

      {shown ? (
        <section className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="ضروري" value={plan.must} />
            <Stat label="مهم" value={plan.should} />
            <Stat label="رفاهيات" value={plan.nice} />
          </div>
          {plan.skipped.length ? (
            <p className="text-sm text-muted-foreground">اتشال من الخطة: {plan.skipped.join(" · ")}</p>
          ) : null}
          <ol className="space-y-4">
            {plan.months.map((m) => (
              <li key={m.label} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
                <p className="font-medium">{m.label}</p>
                <p className="text-sm text-muted-foreground">{m.focus}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.categoryIds.map((id) => (
                    <Link key={id} href={`/sourcing?cat=${id}`}>
                      <Badge variant="secondary">
                        {sourcingCategories.find((c) => c.id === id)?.title ?? id}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2">
            <Link href="/guide" className={cn(buttonVariants())}>
              بنود الدليل
            </Link>
            <Link href="/needs" className={cn(buttonVariants({ variant: "outline" }))}>
              كل الاحتياجات
            </Link>
          </div>
          <div className="space-y-2">
            <h2 className="font-medium">قايمة مشتريات (ضروري)</h2>
            <ul className="divide-y rounded-xl bg-card text-sm ring-1 ring-foreground/10">
              {shopping.must.map((it) => (
                <li key={it.name} className="flex justify-between gap-2 px-4 py-2">
                  <span>{it.name}</span>
                  <Link className="text-xs text-primary" href={`/sourcing?cat=${it.source}`}>
                    منين
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Toggle({
  label,
  on,
  set,
}: {
  label: string;
  on: boolean;
  set: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => set(!on)}
      className={cn(
        "rounded-xl px-3 py-2 text-start ring-1 ring-foreground/10",
        on ? "bg-secondary" : "bg-muted/40",
      )}
    >
      {label} — {on ? "أيوه" : "لأ"}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-secondary p-3">
      <p className="text-xs">{label}</p>
      <p className="font-medium">{value.toLocaleString("ar-EG")} ج</p>
    </div>
  );
}
