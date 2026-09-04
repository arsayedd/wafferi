"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  arcOf,
  fiveArcs,
  needGroups,
  needItemCount,
  searchNeeds,
  type FiveArc,
} from "@/lib/need-taxonomy";
import { sourcingCategories } from "@/lib/sourcing";

const priLabel = { must: "ضروري", should: "مهم", nice: "رفاهية" } as const;

export default function NeedsClient() {
  const params = useSearchParams();
  const router = useRouter();
  const q0 = params.get("q") ?? "";
  const arc0 = (params.get("arc") ?? "") as FiveArc | "";
  const [q, setQ] = useState(q0);

  const rows = useMemo(() => {
    const found = searchNeeds(q0);
    if (!arc0) return found;
    return found.filter((r) => arcOf(r.group.id) === arc0);
  }, [q0, arc0]);

  function go(nextQ: string, arc?: string) {
    const sp = new URLSearchParams();
    if (nextQ) sp.set("q", nextQ);
    if (arc) sp.set("arc", arc);
    router.push(sp.toString() ? `/needs?${sp}` : "/needs");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="space-y-3">
        <p className="text-sm text-primary">خمس مراحل: قبل الجواز → بعد الجواز</p>
        <h1 className="font-heading text-3xl font-semibold md:text-4xl">
          كل اللي العروسة ممكن تحتاجه
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          {needItemCount} بند في {needGroups.length} مجموعة — خدمات فرح، لبس، مطبخ، أجهزة،
          بيت، هدايا، تركيب. مش أسعار لكل سطر. الخطة الذكية على{" "}
          <Link className="text-primary underline" href="/plan">
            رحلة العروسة
          </Link>
          .
        </p>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            go(q.trim(), arc0);
          }}
        >
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="قاعة، ثلاجة، عصارة ثوم، تركيب تكييف…"
            className="h-12"
          />
          <button type="submit" className={cn(buttonVariants(), "h-12")}>
            دورِي
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => go(q0, "")}
            className={cn(
              "rounded-full px-3 py-1 text-sm",
              !arc0 ? "bg-primary text-primary-foreground" : "bg-secondary",
            )}
          >
            الكل
          </button>
          {fiveArcs.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => go(q0, p)}
              className={cn(
                "rounded-full px-3 py-1 text-sm",
                arc0 === p ? "bg-primary text-primary-foreground" : "bg-secondary",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          مفيش بند بالكلمة دي.
        </p>
      ) : (
        rows.map(({ group, items }) => (
          <section key={group.id} className="space-y-3">
            <div>
              <p className="text-xs text-primary">
                {arcOf(group.id)} · {group.phase}
              </p>
              <h2 className="font-heading text-2xl font-semibold">{group.title}</h2>
              <p className="text-sm text-muted-foreground">{group.blurb}</p>
            </div>
            <ul className="divide-y rounded-xl bg-card ring-1 ring-foreground/10">
              {items.map((it) => {
                const src = sourcingCategories.find((c) => c.id === it.source);
                return (
                  <li
                    key={`${group.id}-${it.name}`}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                  >
                    <span>{it.name}</span>
                    <span className="flex items-center gap-2">
                      <Badge variant="outline">{priLabel[it.pri]}</Badge>
                      {src ? (
                        <Link
                          href={`/sourcing?cat=${src.id}&q=${encodeURIComponent(it.name)}`}
                          className="text-xs text-primary hover:underline"
                        >
                          {src.title} ← منين
                        </Link>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
