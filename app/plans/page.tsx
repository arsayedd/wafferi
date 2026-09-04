"use client";

import { Button } from "@/components/ui/button";
import { saasPlans } from "@/lib/intel/plans";
import { useIntel } from "@/hooks/use-intel";

export default function PlansPage() {
  const { plan, setPlan, watches } = useIntel();
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div>
        <h1 className="font-heading text-3xl font-semibold">خطط المراقبة</h1>
        <p className="text-muted-foreground">
          سقف محلي لعدد الروابط. الاشتراك الحقيقي وPostgreSQL/Redis مش متوصلين.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {saasPlans.map((p) => (
          <article
            key={p.id}
            className={`rounded-2xl p-5 ring-1 ${plan === p.id ? "ring-primary bg-primary/5" : "ring-foreground/10 bg-card"}`}
          >
            <h2 className="font-heading text-xl font-semibold">{p.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
            <p className="mt-3 text-2xl font-semibold">{p.watches} رابط</p>
            <Button className="mt-4" variant={plan === p.id ? "secondary" : "default"} onClick={() => setPlan(p.id)}>
              {plan === p.id ? "الخطة الحالية" : "اختاري"}
            </Button>
          </article>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">مستخدم دلوقتي: {watches.length} رابط.</p>
    </div>
  );
}
