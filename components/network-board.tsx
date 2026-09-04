"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { StoreLogo } from "@/components/store-logo";
import { products } from "@/lib/catalog";
import { kindLabels, stores } from "@/lib/network";
import type { StoreKind } from "@/lib/types";

const kinds = Object.keys(kindLabels) as StoreKind[];

export function NetworkBoard() {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    return stores.filter((s) => {
      if (!q) return true;
      return `${s.name} ${s.specialty} ${s.city} ${s.website}`.includes(q);
    });
  }, [q]);

  const groups = kinds
    .map((k) => ({ k, items: list.filter((s) => s.kind === k) }))
    .filter((g) => g.items.length);

  return (
    <div className="space-y-8">
      <Input placeholder="دورِي على مصدر…" value={q} onChange={(e) => setQ(e.target.value)} />
      {groups.map((g) => (
        <section key={g.k} className="space-y-3">
          <h2 className="font-heading text-xl font-semibold">{kindLabels[g.k]}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {g.items.map((s) => {
              const n = products.filter((p) => p.listings.some((l) => l.storeId === s.id)).length;
              return (
                <Link
                  key={s.id}
                  href={`/stores/${s.id}`}
                  className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:bg-secondary"
                >
                  <h3 className="flex items-center gap-2 font-medium">
                    <StoreLogo name={s.name} website={s.website} size={28} />
                    {s.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.specialty}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    حقوق الاسم لـ {s.name}. {n} منتج في وفّري بيروح لعرض عندهم.
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
