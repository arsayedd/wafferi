"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseProductFeed, sampleFeedCsv } from "@/lib/parse-feed";
import { stores } from "@/lib/catalog";
import { useCatalog } from "@/hooks/use-catalog";
import { usePartners } from "@/hooks/use-partners";
import type { PartnerRule } from "@/lib/outbound";
import type { Product } from "@/lib/types";

export default function IngestPage() {
  const { ingested, replaceFeed, clearFeed } = useCatalog();
  const { rules, upsert, outbound } = usePartners();
  const [raw, setRaw] = useState(sampleFeedCsv);
  const [feedUrl, setFeedUrl] = useState("");
  const [note, setNote] = useState("");
  const [pulling, setPulling] = useState(false);
  const [addId, setAddId] = useState("btech");

  function applyProducts(products: Product[], msg: string) {
    replaceFeed(products);
    setNote(msg);
    toast.success("الكتالوج اتحدّث من المصدر");
  }

  function runPaste() {
    const { products, error } = parseProductFeed(raw);
    if (error) {
      toast.error(error);
      return;
    }
    applyProducts(products, `اتربط ${products.length} صنف من الفيد. المصدر ظاهر على كل عرض.`);
  }

  async function runUrl() {
    if (!feedUrl.trim()) {
      toast.error("حطي رابط الفيد");
      return;
    }
    setPulling(true);
    try {
      const res = await fetch("/api/pull-feed", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: feedUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error ?? "فشل السحب");
        return;
      }
      applyProducts(data.products, `اتسحب ${data.count} صنف من رابط الفيد.`);
    } catch {
      toast.error("السحب فشل");
    } finally {
      setPulling(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-10">
      <div>
        <h1 className="font-heading text-3xl font-semibold">السحب، المصدر، والأفلييت</h1>
        <p className="mt-2 text-muted-foreground">
          بنسحب كتالوج من فيد التاجر أو لوحة الأفلييت (CSV/JSON)، وبنكتب المصدر على كل
          منتج، والتحويل يروح لصفحتهم بلينك فيه أفلييت وكوبون وفّري. مش بنزحف على HTML
          جوميا ونون — ده فيد مصرّح، والعميلة بتشوف مين البائع.
        </p>
      </div>

      <section className="space-y-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="font-medium">1) اسحبي فيد المصدر</h2>
        <p className="text-sm text-muted-foreground">
          رابط ملف من لوحة جوميا أفلييت / نون / أي تاجر اداكِ فيد. لو الرابط صفحة منتج
          HTML هنرفضه ونطلب الملف.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={feedUrl}
            onChange={(e) => setFeedUrl(e.target.value)}
            placeholder="https://…/catalog.csv أو .json"
          />
          <Button onClick={runUrl} disabled={pulling}>
            {pulling ? "بسحب…" : "اسحبي المصدر"}
          </Button>
        </div>
        <label className="block text-sm">
          أو الصقِي CSV / JSON
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="mt-2 min-h-40 w-full rounded-xl border border-input bg-background p-3 font-mono text-xs"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button onClick={runPaste}>اربط الفيد</Button>
          <Button variant="outline" onClick={() => setRaw(sampleFeedCsv)}>
            مثال CSV
          </Button>
          <Button variant="ghost" onClick={clearFeed} disabled={!ingested.length}>
            امسح المستورد
          </Button>
          <Button variant="secondary" nativeButton={false} render={<Link href="/search" />}>
            السوق
          </Button>
        </div>
        {note ? <p className="text-sm text-emerald-800">{note}</p> : null}
        <p className="text-xs text-muted-foreground">
          أعمدة مقترحة: name, brand, price, store, category, url, coupon
        </p>
      </section>

      <section className="space-y-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="font-medium">2) أفلييت وكوبونات وفّري لكل مصدر</h2>
        <p className="text-sm text-muted-foreground">
          لما العميلة تضغط «اشتري من جوميا» بنحوّلها على نفس المنتج عندهم، ونركّب aff_id
          والكوبون. السعر عندهم زي ما هو.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="px-2 py-2 text-start">المصدر</th>
                <th className="px-2 py-2 text-start">رقم الأفلييت</th>
                <th className="px-2 py-2 text-start">كوبون</th>
                <th className="px-2 py-2 text-start">باراميتر زيادة</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => {
                const store = stores.find((s) => s.id === r.storeId);
                return (
                  <tr key={r.storeId} className="border-t">
                    <td className="px-2 py-2 font-medium">{store?.name ?? r.storeId}</td>
                    <td className="px-2 py-2">
                      <Input
                        value={r.affiliateId}
                        placeholder="aff / tag / sid"
                        onChange={(e) => upsert({ ...r, affiliateId: e.target.value })}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <Input
                        value={r.coupon}
                        placeholder="BRIDE10"
                        onChange={(e) => upsert({ ...r, coupon: e.target.value })}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <Input
                        value={r.extraQuery}
                        placeholder="utm_campaign=ramadan"
                        onChange={(e) => upsert({ ...r, extraQuery: e.target.value })}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-sm">
            أضيفي مصدر
            <select
              className="mt-1 h-9 w-full min-w-48 rounded-lg border border-input bg-background px-2"
              value={addId}
              onChange={(e) => setAddId(e.target.value)}
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <Button
            variant="outline"
            onClick={() =>
              upsert({
                storeId: addId,
                affiliateId: "",
                coupon: "",
                extraQuery: "",
              } satisfies PartnerRule)
            }
          >
            أضيفي للجدول
          </Button>
        </div>
        {rules[0] ? (
          <p className="text-xs text-muted-foreground">
            مثال لينك خروج لجوميا:{" "}
            <span className="break-all font-mono">
              {outbound("https://www.jumia.com.eg/lg-8kg", "jumia")}
            </span>
          </p>
        ) : null}
      </section>
    </div>
  );
}
