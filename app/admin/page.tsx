"use client";

import Link from "next/link";
import { useIntel } from "@/hooks/use-intel";
import { learnedInterval } from "@/lib/intel/scheduler";
import { marketTree } from "@/lib/intel/categories";

export default function AdminPage() {
  const { watches, events, polling, auto } = useIntel();
  const ok = watches.filter((w) => w.lastSnapshots.length && !w.error).length;
  const fail = watches.filter((w) => w.error).length;
  const pending = watches.filter((w) => !w.lastCheck).length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div>
        <h1 className="font-heading text-3xl font-semibold">لوحة التشغيل</h1>
        <p className="text-muted-foreground">
          صحة المراقبة المحلية. مش كولستر Crawlee — نفس البيانات اللي على /intel.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="روابط" value={watches.length} />
        <Card label="نجح" value={ok} />
        <Card label="فشل" value={fail} />
        <Card label="قيد الانتظار" value={pending} />
      </div>
      <p className="text-sm text-muted-foreground">
        الجدولة {auto ? "شغالة" : "واقفة"} · السحب {polling ? "جارٍ" : "هادي"} · أحداث {events.length}
      </p>
      <section>
        <h2 className="font-heading text-xl font-semibold">المتاجر / الروابط</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {watches.map((w) => (
            <li key={w.id} className="rounded-lg bg-card p-3 ring-1 ring-foreground/10">
              <p className="font-medium">{w.platform ?? "—"} · {w.url}</p>
              <p className="text-xs text-muted-foreground">
                {w.lastSnapshots.length} عرض · كل {Math.round(learnedInterval(w) / 60000)} د
                {w.error ? ` · ${w.error}` : ""}
                {w.robotsNote ? ` · ${w.robotsNote}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-heading text-xl font-semibold">تصنيف موحّد</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {marketTree.map((n) => (
            <div key={n.id} className="rounded-xl bg-card p-3 text-sm ring-1 ring-foreground/10">
              <p className="font-medium">{n.name}</p>
              <ul className="mt-1 list-disc pr-4 text-muted-foreground">
                {n.kids.map((k) => (
                  <li key={k.id}>{k.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <Link href="/intel" className="text-primary underline">
        رجوع للمراقبة
      </Link>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
