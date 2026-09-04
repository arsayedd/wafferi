"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseProductFeed, sampleFeedCsv } from "@/lib/parse-feed";
import { connectors } from "@/lib/ingest/connectors";
import { stores } from "@/lib/catalog";
import { useCatalog } from "@/hooks/use-catalog";
import { useLive } from "@/hooks/use-live";
import { usePartners } from "@/hooks/use-partners";
import { useRecipes } from "@/hooks/use-recipes";
import type { PriceCandidate } from "@/lib/ingest/vote";
import type { PartnerRule } from "@/lib/outbound";
import type { Product } from "@/lib/types";

export default function IngestPage() {
  const { ingested, applyFeed, clearFeed } = useCatalog();
  const { addFeedUrl } = useLive();
  const { rules, upsert, outbound } = usePartners();
  const [raw, setRaw] = useState(sampleFeedCsv);
  const [feedUrl, setFeedUrl] = useState("");
  const [asin, setAsin] = useState("");
  const [note, setNote] = useState("");
  const [pulling, setPulling] = useState(false);
  const [addId, setAddId] = useState("btech");
  const { extra, upsert: upsertRecipe, remove } = useRecipes();
  const [pending, setPending] = useState<{
    products: Product[];
    candidates: PriceCandidate[];
  } | null>(null);
  const [recipeHost, setRecipeHost] = useState("btech.com");
  const [recipeCss, setRecipeCss] = useState(".price");

  function applyProducts(products: Product[], msg: string) {
    applyFeed(products);
    setNote(msg);
    toast.success("الأسعار اتحدّثت من المصدر");
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
        body: JSON.stringify({ url: feedUrl.trim(), recipes: extra }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error ?? "فشل السحب");
        return;
      }
      if (data.needsReview && Array.isArray(data.candidates) && data.candidates.length) {
        setPending({ products: data.products, candidates: data.candidates });
        toast.message("لقينا أكتر من سعر — اختاري الصح");
        return;
      }
      applyProducts(
        data.products,
        `اتسحب ${data.count} صنف عبر ${data.connector ?? "موصّل"}.`,
      );
      addFeedUrl(feedUrl.trim());
    } catch {
      toast.error("السحب فشل");
    } finally {
      setPulling(false);
    }
  }

  async function runAmazon() {
    const trimmed = asin.trim();
    if (!trimmed) {
      toast.error("حطي ASIN أو رابط أمازون");
      return;
    }
    const payload = trimmed.startsWith("http")
      ? { url: trimmed }
      : { asins: trimmed.split(/[,\s]+/).filter(Boolean) };
    setPulling(true);
    try {
      const res = await fetch("/api/amazon-items", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error ?? "أمازون رفض الطلب");
        return;
      }
      applyProducts(data.products, `أمازون Creators: ${data.count} صنف`);
    } catch {
      toast.error("طلب أمازون فشل");
    } finally {
      setPulling(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-10">
      <div>
        <h1 className="font-heading text-3xl font-semibold">السحب، المصدر، والأفلييت</h1>
        <p className="mt-2 text-muted-foreground">
          كل الطرق اللي تخلّينا نحدّث سعر منتج: فيد شريك، XML تسوق، Shopify، WooCommerce،
          JSON-LD/Open Graph من صفحة المنتج، وAmazon Creators API. التفاصيل على{" "}
          <Link href="/connectors" className="text-primary underline">
            الموصّلات
          </Link>
          .
        </p>
      </div>

      <section className="space-y-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="font-medium">1) اسحبي سعر من رابط</h2>
        <p className="text-sm text-muted-foreground">
          فيد CSV/JSON/XML، أو رابط منتج Shopify/Woo، أو صفحة فيها schema.org Product.
          السيستم يختار الموصّل لوحده.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {connectors.map((c) => (
            <div key={c.id} className="rounded-xl bg-muted/40 p-3 text-sm">
              <p className="font-medium">{c.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={feedUrl}
            onChange={(e) => setFeedUrl(e.target.value)}
            placeholder="فيد CSV/JSON/XML أو رابط منتج"
          />
          <Button onClick={runUrl} disabled={pulling}>
            {pulling ? "بسحب…" : "اسحبي المصدر"}
          </Button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={asin}
            onChange={(e) => setAsin(e.target.value)}
            placeholder="ASIN أمازون أو https://www.amazon.eg/dp/…"
          />
          <Button variant="outline" onClick={runAmazon} disabled={pulling}>
            أمازون API
          </Button>
        </div>
        {pending ? (
          <div className="space-y-2 rounded-xl bg-muted/50 p-3 text-sm">
            <p className="font-medium">ترشيحات السعر — اختاري اللي هنتتبعه</p>
            <div className="flex flex-wrap gap-2">
              {pending.candidates.map((c, i) => (
                <Button
                  key={`${c.method}-${c.price}-${i}`}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const products = pending.products.map((p) => ({
                      ...p,
                      listings: p.listings.map((l) => ({ ...l, price: c.price })),
                    }));
                    applyProducts(products, `اتحدد ${c.price} ج من ${c.method}`);
                    setPending(null);
                  }}
                >
                  {c.price} ج · {c.method}
                </Button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="space-y-2 rounded-xl border border-dashed p-3">
          <p className="text-sm font-medium">وصفة دومين (CSS) — لو JSON-LD مش كفاية</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input value={recipeHost} onChange={(e) => setRecipeHost(e.target.value)} placeholder="btech.com" />
            <Input
              value={recipeCss}
              onChange={(e) => setRecipeCss(e.target.value)}
              placeholder=".price أو meta[property=&quot;product:price:amount&quot;]|content"
            />
            <Button
              variant="outline"
              onClick={() => {
                upsertRecipe({
                  host: recipeHost.replace(/^www\./, ""),
                  price: { type: "css", value: recipeCss },
                  title: { type: "schema_org" },
                });
                toast.success("الوصفة اتحفظت على الجهاز");
              }}
            >
              احفظي
            </Button>
          </div>
          {extra.length ? (
            <ul className="text-xs text-muted-foreground">
              {extra.map((r) => (
                <li key={r.host} className="flex justify-between gap-2">
                  <span>
                    {r.host} → {r.price?.value ?? r.price?.type}
                  </span>
                  <button type="button" className="underline" onClick={() => remove(r.host)}>
                    حذف
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
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
          <Button variant="secondary" nativeButton={false} render={<Link href="/live" />}>
            أسعار حية
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
