"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { parseProductFeed, sampleFeedCsv } from "@/lib/parse-feed";
import { useCatalog } from "@/hooks/use-catalog";

export default function IngestPage() {
  const { ingested, replaceFeed, clearFeed } = useCatalog();
  const [raw, setRaw] = useState(sampleFeedCsv);
  const [note, setNote] = useState("");

  function run() {
    const { products, error } = parseProductFeed(raw);
    if (error) {
      toast.error(error);
      return;
    }
    replaceFeed(products);
    setNote(`اتربط ${products.length} صنف من الفيد. ظاهرين في السوق فورًا.`);
    toast.success("الفيد اتنقل للكتالوج");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold">استيراد فيد تاجر</h1>
      <p className="text-muted-foreground">
        ده الطريق المصرّح لسحب كتالوج حقيقي: CSV أو JSON من المتجر أو شبكة الأفلييت
        بعد ما يديك الملف. مش بنزحف على مواقع تانية من غير إذنهم — حتى لو السكرابينج
        مش مجرّم جنائيًا في مصر، شروط جوميا ونون ومعظم المتاجر بتمنعه، والمواقع بتحظر
        الـ IP وتغيّر الـ HTML. المقارنة المحترفة بتشتغل على فيد.
      </p>
      <label className="block text-sm">
        الصقِي CSV أو JSON
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className="mt-2 min-h-48 w-full rounded-xl border border-input bg-background p-3 font-mono text-xs"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <Button onClick={run}>اربط الفيد</Button>
        <Button variant="outline" onClick={() => setRaw(sampleFeedCsv)}>
          مثال CSV
        </Button>
        <Button variant="ghost" onClick={clearFeed} disabled={!ingested.length}>
          امسح الفيد المستورد
        </Button>
        <Button variant="secondary" nativeButton={false} render={<Link href="/search" />}>
          فتح السوق
        </Button>
      </div>
      {note ? <p className="text-sm text-emerald-800">{note}</p> : null}
      <p className="text-xs text-muted-foreground">
        الأعمدة المتوقعة: name, brand, price, store, category, rating, url — أو JSON بنفس
        المفاتيح. الفئات زي bridal-wear و pajamas و washers.
      </p>
    </div>
  );
}
