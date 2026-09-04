"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { clusterSnapshots } from "@/lib/intel/match";
import { exportSnapshots } from "@/lib/intel/export";
import { marketAnalytics } from "@/lib/intel/analytics";
import { marketInsights } from "@/lib/intel/insights";
import { learnedInterval } from "@/lib/intel/scheduler";
import { discountPct, tierLabels, type WatchTier } from "@/lib/intel/types";
import { Sparkline } from "@/components/sparkline";
import { catalogSpreadEvents } from "@/lib/intel/catalog-seed";
import { useIntel } from "@/hooks/use-intel";

export function IntelClient() {
  const {
    watches,
    events,
    auto,
    setAuto,
    addWatch,
    removeWatch,
    setTier,
    runWatch,
    polling,
    hits,
    rules,
    addRule,
    removeRule,
    myPrice,
    setMyPrice,
    resetCatalog,
    plan,
  } = useIntel();
  const [url, setUrl] = useState("");
  const [tier, setNewTier] = useState<WatchTier>(3);
  const [view, setView] = useState<"table" | "cards">("table");

  const snapshots = watches.flatMap((w) => w.lastSnapshots ?? []);
  const sellers = new Set(snapshots.map((s) => s.seller)).size;
  const inStock = snapshots.filter((s) => s.availability === "in_stock" || s.stock === "in_stock").length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();
  const priceToday = events.filter((e) => e.kind === "price" && e.at >= todayTs).length;
  const stockToday = events.filter((e) => e.kind === "stock" && e.at >= todayTs).length;
  const stats = marketAnalytics(snapshots);
  const insights = marketInsights(events, snapshots, myPrice || undefined);
  const clusters = useMemo(
    () => clusterSnapshots(snapshots).filter((c) => c.members.length > 1),
    [snapshots],
  );
  const alertFeed = useMemo(() => {
    const spread = catalogSpreadEvents(watches);
    const seen = new Set(events.map((e) => e.id));
    return [...events, ...spread.filter((s) => !seen.has(s.id))];
  }, [events, watches]);

  async function add() {
    if (!url.trim()) {
      toast.error("حطي رابط منتج أو سايتماب أو فيد");
      return;
    }
    await addWatch(url.trim(), tier);
    setUrl("");
    toast.success("اتضافت للمراقبة");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold">مراقبة أسعار المنافسين</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          الأرقام دي من كتالوج وفّري المرجعي (غسالة، ثلاجة، بوتاجاز…) عشان اللوحة متبقاش فاضية.
          مسار الفيد الحقيقي: JSON-LD / Shopify / Woo / CSV مصرّح — HTTP منظم، من غير Playwright.
          Scrape → Match → Compare → Alert
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="روابط مراقبة" value={String(watches.length)} />
        <Metric label="عروض آخر سحب" value={String(snapshots.length)} />
        <Metric label="بائعون" value={String(sellers)} />
        <Metric label="متوفر" value={String(inStock)} />
        <Metric label="أقل سعر سوق" value={stats.lowest ? formatPrice(stats.lowest) : "—"} />
        <Metric label="متوسط" value={stats.average ? formatPrice(stats.average) : "—"} />
        <Metric label="فجوة السوق" value={stats.gap ? formatPrice(stats.gap) : "—"} />
        <Metric label="توفر %" value={`${stats.stockPct}٪`} />
        <Metric label="تغيّر سعر اليوم" value={String(priceToday)} />
        <Metric label="تغيّر ستوك اليوم" value={String(stockToday)} />
        <Metric label="الجدولة" value={auto ? "شغالة" : "واقفة"} />
        <p className="sm:col-span-2 lg:col-span-4 text-xs text-muted-foreground">
          تغيّر السعر/الستوك اليوم = فرق بين قراءتين من فيد حي. فجوة البائعين تحت من الكتالوج المرجعي.
        </p>
      </div>

      <section className="grid gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium">رؤى السوق (من بياناتكِ هنا)</p>
          <ul className="mt-2 list-disc space-y-1 pr-5 text-sm text-muted-foreground">
            {insights.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">الخطة الحالية: {plan}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm">
            سعركِ المرجعي (للمقارنة والتنبيه)
            <Input
              className="mt-1"
              type="number"
              value={myPrice || ""}
              onChange={(e) => setMyPrice(Number(e.target.value) || 0)}
            />
          </label>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              addRule({
                name: "أرخص من سعري ١٠٪",
                kind: "below_mine",
                myPrice: myPrice || undefined,
                percent: 10,
                channel: "dashboard",
              })
            }
          >
            قاعدة: منافس أرخص ١٠٪
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addRule({ name: "نزول ٥٠٠ج", kind: "drop_egp", dropEgp: 500, channel: "dashboard" })}
          >
            قاعدة: نزول ٥٠٠ جنيه
          </Button>
          {rules.map((r) => (
            <p key={r.id} className="text-xs">
              {r.name}{" "}
              <button type="button" className="text-primary" onClick={() => removeRule(r.id)}>
                حذف
              </button>
            </p>
          ))}
          {hits.slice(0, 5).map((h) => (
            <p key={h.ruleId + h.at} className="text-sm text-amber-800">
              {h.message}
            </p>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
        <p className="text-sm font-medium">أضيفي مصدر</p>
        <p className="mt-1 text-xs text-muted-foreground">
          رابط منتج فيه JSON-LD / Shopify / Woo / فيد CSV، أو sitemap.xml (اكتشاف محدود).
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className="flex-1"
          />
          <select
            className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
            value={tier}
            onChange={(e) => setNewTier(Number(e.target.value) as WatchTier)}
          >
            {( [1, 2, 3, 4, 5] as WatchTier[] ).map((t) => (
              <option key={t} value={t}>
                {tierLabels[t]}
              </option>
            ))}
          </select>
          <Button onClick={() => void add()} disabled={polling}>
            تشغيل المسار
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant={auto ? "secondary" : "outline"} size="sm" onClick={() => setAuto(!auto)}>
            {auto ? "إيقاف الجدولة" : "جدولة حسب الطبقة"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportSnapshots(snapshots, "csv")}
            disabled={!snapshots.length}
          >
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportSnapshots(snapshots, "json")}
            disabled={!snapshots.length}
          >
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetCatalog();
              toast.success("اتحمّل كتالوج الجهاز المرجعي");
            }}
          >
            تحميل عيّنة الكتالوج
          </Button>
          <Button variant={view === "table" ? "secondary" : "outline"} size="sm" onClick={() => setView("table")}>
            جدول
          </Button>
          <Button variant={view === "cards" ? "secondary" : "outline"} size="sm" onClick={() => setView("cards")}>
            كروت
          </Button>
        </div>
      </section>

      {watches.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          <p>مفيش روابط محفوظة. حمّلي عيّنة الكتالوج عشان تتملّي اللوحة.</p>
          <Button className="mt-4" onClick={() => resetCatalog()}>
            تحميل عيّنة الكتالوج
          </Button>
        </div>
      ) : view === "table" ? (
        <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-start">المنتج</th>
                <th className="px-3 py-2 text-start">بائع</th>
                <th className="px-3 py-2 text-start">سعر</th>
                <th className="px-3 py-2 text-start">ستوك</th>
                <th className="px-3 py-2 text-start">موصّل</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {watches.map((w) => {
                const s = w.snapshot ?? w.lastSnapshots?.[0];
                return (
                  <tr key={w.id} className="border-t">
                    <td className="px-3 py-3">
                      <p className="font-medium">{(s ?? w.lastSnapshots?.[0])?.name ?? w.url}</p>
                      <p className="text-xs text-muted-foreground">
                        {tierLabels[w.tier]} · فحص متعلّم {Math.round(learnedInterval(w) / 60000)} د
                        {w.platform ? ` · ${w.platform}` : ""}
                      </p>
                      {w.error ? <p className="text-xs text-destructive">{w.error}</p> : null}
                    </td>
                    <td className="px-3 py-3">{s?.seller ?? "—"}</td>
                    <td className="px-3 py-3">
                      {s ? formatPrice(s.price) : "—"}
                      {s && discountPct(s) ? (
                        <Badge variant="secondary" className="ms-1">
                          {discountPct(s)}٪
                        </Badge>
                      ) : null}
                      {w.history.length > 1 ? (
                        <Sparkline values={w.history.map((h) => h.price)} className="mt-1 h-8 w-28" />
                      ) : null}
                    </td>
                    <td className="px-3 py-3">{s?.stock ?? s?.availability ?? "—"}</td>
                    <td className="px-3 py-3 font-mono text-xs">{w.waterfall.join(" → ") || "—"}</td>
                    <td className="px-3 py-3 text-end">
                      <select
                        className="mb-1 h-8 rounded border px-1 text-xs"
                        value={w.tier}
                        onChange={(e) => setTier(w.id, Number(e.target.value) as WatchTier)}
                      >
                        {([1, 2, 3, 4, 5] as WatchTier[]).map((t) => (
                          <option key={t} value={t}>
                            T{t}
                          </option>
                        ))}
                      </select>
                      <Button size="sm" variant="outline" onClick={() => void runWatch(w.id)}>
                        حدّث
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeWatch(w.id)}>
                        احذف
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {snapshots.map((s, i) => (
            <article key={`${s.url}-${i}`} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-muted-foreground">{s.seller}</p>
              <p className="mt-2 text-lg font-semibold">{formatPrice(s.price)}</p>
              <p className="text-xs text-muted-foreground">
                {s.availability} · {s.adapter} · SKU {s.sku ?? "—"}
              </p>
            </article>
          ))}
        </div>
      )}

      {watches.some((w) => w.discovery?.length) ? (
        <section className="space-y-2">
          <h2 className="font-heading text-xl font-semibold">اكتشاف من السايتماب</h2>
          <p className="text-sm text-muted-foreground">مش زحف كامل — اختاري روابط تضيفيها كطبقة ٤.</p>
          <div className="flex flex-wrap gap-2">
            {watches.flatMap((w) =>
              (w.discovery ?? []).slice(0, 12).map((u) => (
                <Button
                  key={u}
                  size="sm"
                  variant="outline"
                  onClick={() => void addWatch(u, 4)}
                >
                  راقبي
                </Button>
              )),
            )}
          </div>
        </section>
      ) : null}

      {clusters.length ? (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold">مطابقة عبر المصادر</h2>
          {clusters.slice(0, 8).map((c, i) => {
            const prices = c.members.map((m) => m.price);
            const low = Math.min(...prices);
            return (
              <div key={i} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
                <Badge>ثقة {(c.score * 100).toFixed(1)}٪</Badge>
                {c.reasons?.length ? (
                  <p className="mt-1 text-xs text-muted-foreground">{c.reasons.join(" · ")}</p>
                ) : null}
                <ul className="mt-2 space-y-1 text-sm">
                  {c.members.map((m) => (
                    <li key={m.url + m.seller}>
                      {m.seller}: {m.name} · {formatPrice(m.price)}
                      {m.price === low ? " · الأرخص" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="font-heading text-xl font-semibold">فجوات الأسعار والتنبيهات</h2>
        <p className="text-sm text-muted-foreground">
          اللي ظاهر دلوقتي فرق السعر بين البائعين في الكتالوج المرجعي. دلتا الزمن (نزول/ارتفاع بعد
          قراءتين) تظهر بعد فيد حي يتقري مرتين.
        </p>
        {alertFeed.length === 0 ? (
          <p className="text-sm text-muted-foreground">مفيش فجوة متسجّلة. حمّلي عيّنة الكتالوج.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {alertFeed.slice(0, 20).map((e) => (
              <li key={e.id} className="rounded-lg bg-muted/50 px-3 py-2">
                {e.message ?? `${e.kind}: ${e.from} ← ${e.to}`}
                <span className="ms-2 text-xs text-muted-foreground">
                  {new Date(e.at).toLocaleString("ar-EG")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-sm text-muted-foreground">
        المراقبة HTTP لفيد مصرّح، من غير Playwright. التفاصيل على{" "}
        <Link href="/legal" className="text-primary underline">
          الامتثال
        </Link>
        {" · "}
        <Link href="/connectors" className="text-primary underline">
          الموصّلات
        </Link>
        {" · "}
        <Link href="/admin" className="text-primary underline">
          التشغيل
        </Link>
        {" · "}
        <Link href="/plans" className="text-primary underline">
          الخطط
        </Link>
        .
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
