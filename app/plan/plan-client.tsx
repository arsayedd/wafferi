"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildJourney, priceBands, TIER_AR, type PlanAnswers } from "@/lib/bride-plan";
import { houseTiers } from "@/lib/sourcing";
import { cn } from "@/lib/utils";
import type { NeedItem } from "@/lib/need-taxonomy";

const STORAGE = "waffari-bride-journey-v1";

const defaults: PlanAnswers = {
  months: 6,
  weddingDate: "",
  budget: 150000,
  furnished: false,
  finished: false,
  hasKitchen: false,
  hasAppliances: false,
  bedrooms: 1,
  bathrooms: 1,
  tier: "smart",
};

type Band = "eco" | "mid" | "prem";

type Saved = {
  answers: PlanAnswers;
  owned: Record<string, boolean>;
  band: Record<string, Band>;
  shown: boolean;
};

export default function PlanClient() {
  const [a, setA] = useState<PlanAnswers>(defaults);
  const [shown, setShown] = useState(false);
  const [owned, setOwned] = useState<Record<string, boolean>>({});
  const [band, setBand] = useState<Record<string, Band>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const s = JSON.parse(raw) as Saved;
        if (s.answers) setA({ ...defaults, ...s.answers });
        if (s.owned) setOwned(s.owned);
        if (s.band) setBand(s.band);
        if (s.shown) setShown(true);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: Saved = { answers: a, owned, band, shown };
    localStorage.setItem(STORAGE, JSON.stringify(payload));
  }, [a, owned, band, shown, hydrated]);

  const journey = useMemo(() => buildJourney(a), [a]);

  const allItems = useMemo(() => {
    const seen = new Set<string>();
    const list: NeedItem[] = [];
    for (const st of journey.stages) {
      for (const it of st.items) {
        if (seen.has(it.name)) continue;
        seen.add(it.name);
        list.push(it);
      }
    }
    return list;
  }, [journey]);

  const remaining = allItems.filter((it) => !owned[it.name]);
  const n = Math.max(remaining.length, 1);

  function pickedTotal() {
    return remaining.reduce((sum, it) => {
      const pick = band[it.name] ?? "mid";
      return sum + priceBands(a.budget, n, it.pri)[pick];
    }, 0);
  }

  function totalFor(b: Band) {
    return remaining.reduce((sum, it) => sum + priceBands(a.budget, n, it.pri)[b], 0);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div className="space-y-3">
        <p className="text-sm text-primary">رحلة العروسة — مش متجر بس</p>
        <h1 className="font-heading text-3xl font-semibold">أنا عروسة وبتجهز</h1>
        <p className="text-muted-foreground">
          دخّلي تاريخ الفرح والميزانية ووضع الشقة. السيستم يطلع خطة تسوّق شهر بشهر، يشيل
          اللي عندك، ويوزّع الميزانية: ضروري / مهم / رفاهيات — مع اختيار اقتصادي أو متوسط
          أو فاخر لكل بند. الأسعار تقدير تخطيط، مش عروض لايف.
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
          تاريخ الفرح
          <Input
            type="date"
            value={a.weddingDate}
            onChange={(e) => setA({ ...a, weddingDate: e.target.value })}
          />
        </label>
        <label className="block space-y-1 text-sm">
          فاضل كام شهر؟
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
                {TIER_AR[t.id]}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <Toggle label="الشقة متشطبة؟" on={a.finished} set={(finished) => setA({ ...a, finished })} />
          <Toggle label="الشقة مفروشة؟" on={a.furnished} set={(furnished) => setA({ ...a, furnished })} />
          <Toggle label="المطبخ موجود؟" on={a.hasKitchen} set={(hasKitchen) => setA({ ...a, hasKitchen })} />
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
        <Button type="submit">طلّعي خطة الجهاز</Button>
      </form>

      {shown ? (
        <section className="space-y-6">
          <div>
            <p className="text-sm text-primary">{journey.packageName}</p>
            <p className="text-sm text-muted-foreground">
              {a.bedrooms} غرفة نوم · {a.bathrooms} حمّام
              {a.weddingDate ? ` · الفرح ${a.weddingDate}` : ""} · الناقص {remaining.length} بند
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="ضروري" value={journey.must} />
            <Stat label="مهم" value={journey.should} />
            <Stat label="رفاهيات" value={journey.nice} />
          </div>
          <p className="text-sm">
            تقدير الباقي حسب اختيارك:{" "}
            <strong>{pickedTotal().toLocaleString("ar-EG")} ج</strong>
            {" · "}اقتصادي للكل {totalFor("eco").toLocaleString("ar-EG")} · متوسط{" "}
            {totalFor("mid").toLocaleString("ar-EG")} · فاخر {totalFor("prem").toLocaleString("ar-EG")}
          </p>
          {journey.skipped.length ? (
            <p className="text-sm text-muted-foreground">اتشال: {journey.skipped.join(" · ")}</p>
          ) : null}

          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold">خطة التسوق شهر بشهر</h2>
            {journey.months.map((mo) => (
              <div key={mo.label} className="rounded-xl bg-secondary/60 p-4">
                <p className="font-medium">{mo.label}</p>
                <p className="text-sm text-muted-foreground">{mo.focus}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {mo.items.filter((it) => !owned[it.name]).length} بند ناقص من {mo.items.length}
                </p>
              </div>
            ))}
          </div>

          {journey.stages.map((st) => (
            <div key={st.arc} className="space-y-2">
              <h2 className="font-heading text-xl font-semibold">{st.arc}</h2>
              <p className="text-sm text-muted-foreground">{st.focus}</p>
              <ul className="divide-y rounded-xl bg-card text-sm ring-1 ring-foreground/10">
                {st.items.map((it) => {
                  const prices = priceBands(a.budget, n, it.pri);
                  const pick = band[it.name] ?? "mid";
                  const have = Boolean(owned[it.name]);
                  return (
                    <li key={`${st.arc}-${it.name}`} className="space-y-2 px-4 py-3">
                      <label className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={have}
                          onChange={() =>
                            setOwned((o) => ({ ...o, [it.name]: !o[it.name] }))
                          }
                        />
                        <span className={have ? "text-muted-foreground line-through" : ""}>
                          {it.name}
                        </span>
                      </label>
                      {!have ? (
                        <div className="flex flex-wrap gap-1 ps-6">
                          {(
                            [
                              ["eco", "اقتصادي", prices.eco],
                              ["mid", "متوسط", prices.mid],
                              ["prem", "فاخر", prices.prem],
                            ] as const
                          ).map(([k, lab, p]) => (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setBand((b) => ({ ...b, [it.name]: k }))}
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs",
                                pick === k
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted",
                              )}
                            >
                              {lab} {p.toLocaleString("ar-EG")}
                            </button>
                          ))}
                          <Link
                            className="px-2 text-xs text-primary underline"
                            href={`/sourcing?q=${encodeURIComponent(it.name)}&cat=${it.source}`}
                          >
                            منين
                          </Link>
                        </div>
                      ) : (
                        <p className="ps-6 text-xs text-muted-foreground">موجود — اتشال من الناقص</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Link href="/needs" className={cn(buttonVariants())}>
              كل الاحتياجات
            </Link>
            <Link href="/guide" className={cn(buttonVariants({ variant: "outline" }))}>
              بوكسات الدليل
            </Link>
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
