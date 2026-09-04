"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { products } from "@/lib/catalog";
import {
  connectorLabels,
  kindLabels,
  statusLabels,
  stores,
  verticalLabels,
} from "@/lib/network";
import type { ConnectionStatus, StoreKind, VerticalId } from "@/lib/types";

const kinds = Object.keys(kindLabels) as StoreKind[];
const statuses = Object.keys(statusLabels) as ConnectionStatus[];

export function NetworkBoard() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<StoreKind | "">("");
  const [status, setStatus] = useState<ConnectionStatus | "">("");
  const [vertical, setVertical] = useState<VerticalId | "">("");

  const list = useMemo(() => {
    return stores.filter((s) => {
      if (kind && s.kind !== kind) return false;
      if (status && s.status !== status) return false;
      if (vertical && !s.verticals.includes(vertical)) return false;
      if (q && !`${s.name} ${s.specialty} ${s.city}`.includes(q)) return false;
      return true;
    });
  }, [q, kind, status, vertical]);

  const groups = kinds
    .map((k) => ({ k, items: list.filter((s) => s.kind === k) }))
    .filter((g) => g.items.length);

  return (
    <div className="space-y-8">
      <div className="grid gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 md:grid-cols-4">
        <Input
          placeholder="دورِي على متجر…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={kind}
          onChange={(e) => setKind(e.target.value as StoreKind | "")}
        >
          <option value="">كل الأنواع</option>
          {kinds.map((k) => (
            <option key={k} value={k}>
              {kindLabels[k]}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as ConnectionStatus | "")}
        >
          <option value="">كل حالات الربط</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={vertical}
          onChange={(e) => setVertical(e.target.value as VerticalId | "")}
        >
          <option value="">كل أنواع الأجهزة</option>
          {(Object.keys(verticalLabels) as VerticalId[]).map((v) => (
            <option key={v} value={v}>
              {verticalLabels[v]}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-muted-foreground">
        {list.length} مصدر من أصل {stores.length} في خريطة العروسة
      </p>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">مفيش متجر مطابق للفلاتر</p>
          <p className="mt-1 text-sm text-muted-foreground">وسّعي النوع أو امسحي البحث.</p>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.k} className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">{kindLabels[g.k]}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {g.items.map((s) => {
                const n = products.filter((p) =>
                  p.listings.some((l) => l.storeId === s.id),
                ).length;
                return (
                  <Link
                    key={s.id}
                    href={`/stores/${s.id}`}
                    className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:bg-secondary"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-medium">{s.name}</h3>
                      <Badge variant={s.status === "connected" ? "default" : "outline"}>
                        {statusLabels[s.status]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{s.specialty}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {connectorLabels[s.connector]} · {s.commissionNote}
                    </p>
                    <p className="mt-1 text-xs">
                      {n} منتج ظاهر في وفّري · تقدير تغطية {s.skuEstimate.toLocaleString("ar-EG")} SKU
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
