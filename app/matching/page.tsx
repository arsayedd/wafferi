import { Badge } from "@/components/ui/badge";
import { demoOffers, matchOffers } from "@/lib/matching";

export const metadata = { title: "محرك المطابقة" };

export default function MatchingPage() {
  const { clusters, reviewQueue } = matchOffers(demoOffers);
  const merged = clusters.filter((c) => c.members.length > 1);
  const singles = clusters.filter((c) => c.members.length === 1);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div>
        <h1 className="font-heading text-3xl font-semibold">محرك مطابقة المنتجات</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          باركود ثم ماركة+فئة+سعة ثم تشابه الاسم. الناتج منتج رئيسي واحد، وكل متجر يبقى عرض تحته.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">اتوحدوا في كارت واحد</h2>
        {merged.map((c) => (
          <div key={c.id} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge>ثقة عالية</Badge>
              <span className="text-sm text-muted-foreground">{c.reason}</span>
            </div>
            <ul className="space-y-1 text-sm">
              {c.members.map((m) => (
                <li key={m.id}>
                  <span className="font-medium">{m.store}:</span> {m.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">محتاج مراجعة بشرية</h2>
        {reviewQueue.length === 0 ? (
          <p className="text-sm text-muted-foreground">مفيش أزواج معلّقة في التشغيل ده.</p>
        ) : (
          reviewQueue.map((r) => (
            <div
              key={`${r.a.id}-${r.b.id}`}
              className="rounded-xl border border-dashed p-4 text-sm"
            >
              <Badge variant="outline">تشابه {(r.score * 100).toFixed(0)}٪</Badge>
              <p className="mt-2">
                {r.a.store}: {r.a.title}
              </p>
              <p>
                {r.b.store}: {r.b.title}
              </p>
            </div>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">فضلوا منفصلين (منتج مختلف فعلًا)</h2>
        <ul className="list-disc space-y-1 pr-5 text-sm">
          {singles.map((c) => (
            <li key={c.id}>
              {c.members[0].store}: {c.members[0].title}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
