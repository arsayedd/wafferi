"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Navigation, BadgePercent, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  googleMapsDirUrl,
  googleMapsSearchUrl,
  osmEmbedSrc,
  type EgyptArea,
} from "@/lib/egypt-areas";
import type { PlacesResponse } from "@/lib/places-search";

const chips = ["حلل", "غسالة", "ذهب", "أثاث", "منظم", "فوط", "مكياج", "فستان"];

export default function PlacesClient() {
  const params = useSearchParams();
  const router = useRouter();
  const q0 = params.get("q") ?? "";
  const [q, setQ] = useState(q0);
  const [data, setData] = useState<PlacesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState<EgyptArea | null>(null);

  useEffect(() => {
    setQ(q0);
  }, [q0]);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    fetch(`/api/places?q=${encodeURIComponent(q0)}`, { signal: ac.signal })
      .then((r) => r.json())
      .then((d: PlacesResponse) => {
        setData(d);
        setPicked(d.areas[0] ?? null);
      })
      .catch(() => {
        if (!ac.signal.aborted) setData(null);
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, [q0]);

  function go(next: string) {
    router.push(next ? `/places?q=${encodeURIComponent(next)}` : "/places");
  }

  const area = picked ?? data?.areas[0];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="space-y-3">
        <p className="text-sm text-primary">أماكن على الطبيعة — أرخص جملة وأونلاين للمقارنة</p>
        <h1 className="font-heading text-3xl font-semibold md:text-4xl">
          فين هتلاقي الحاجة دي؟
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          اكتبي اللي محتاجاه (حلل، غسالة، ذهب…). بنرشّح أحياء مصر اللي غالبًا أرخص،
          ونفتح خرائط جوجل للمحلات هناك. مش بنزحف على ماب؛ يا Places API يا أحياء
          معروفة + لينك جوجل.
        </p>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            go(q.trim());
          }}
        >
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="حلل تيفال، غسالة، شبكة ذهب…"
            className="h-12 text-base"
          />
          <Button type="submit" className="h-12">
            أماكن
          </Button>
        </form>
        <div className="flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => go(c)}
              className={`rounded-full px-3 py-1 text-sm ${
                q0 === c ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        {data?.note ? <p className="text-xs text-muted-foreground">{data.note}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-2">
          <h2 className="font-medium">مناطق مرشّحة</h2>
          {(data?.areas ?? []).map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setPicked(a)}
              className={`w-full rounded-xl p-3 text-start ring-1 ring-foreground/10 ${
                area?.id === a.id ? "bg-secondary" : "bg-card hover:bg-muted"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-medium">{a.name}</span>
                {a.cheaper ? (
                  <Badge variant="secondary" className="gap-1">
                    <BadgePercent className="size-3" />
                    غالبًا أرخص
                  </Badge>
                ) : (
                  <Badge variant="outline">سعر أوضح</Badge>
                )}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">{a.city}</span>
            </button>
          ))}
        </aside>

        <div className="space-y-6">
          {area ? (
            <section className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">{area.name}</h2>
                  <p className="text-sm text-muted-foreground">{area.why}</p>
                  <p className="mt-1 text-xs">هتلاقي: {area.finds.join(" · ")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    nativeButton={false}
                    render={
                      <a
                        href={googleMapsSearchUrl(area.mapsQuery)}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                  >
                    <MapPin />
                    خرائط جوجل
                  </Button>
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={
                      <a
                        href={googleMapsDirUrl(area.lat, area.lng)}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                  >
                    <Navigation />
                    اتجاهات
                  </Button>
                </div>
              </div>
              <iframe
                title={area.name}
                src={osmEmbedSrc(area.lat, area.lng)}
                className="h-72 w-full rounded-xl ring-1 ring-foreground/10"
                loading="lazy"
              />
              <p className="text-xs text-muted-foreground">
                الخريطة التفاعلية من OpenStreetMap. زرار جوجل ماب فوق بيفتح التطبيق/الموقع الرسمي.
              </p>
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">محلات ونقاط قريبة</h2>
            {loading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : data?.shops.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.shops.map((s) => (
                  <a
                    key={s.id}
                    href={s.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:bg-secondary"
                  >
                    <p className="font-medium">{s.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.address}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-primary">
                      <ExternalLink className="size-3" />
                      {s.source}
                      {s.rating ? ` · ${s.rating}` : ""}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
                مفيش نقاط حية للكلمة دي. اختاري حي من اليمين وافتحي خرائط جوجل على المنطقة.
              </p>
            )}
          </section>

          <p className="text-sm">
            قارني السعر الأونلاين كمان من{" "}
            <Link className="text-primary underline" href={`/search?q=${encodeURIComponent(q0 || "حلل")}`}>
              السوق
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
