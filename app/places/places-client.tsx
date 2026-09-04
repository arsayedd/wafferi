"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, BadgePercent, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  cheapestDistricts,
  osmEmbedSrc,
  osmPinUrl,
  type EgyptArea,
} from "@/lib/egypt-areas";
import { searchPlaces } from "@/lib/places-search";
import { cn } from "@/lib/utils";

const chips = ["حلل", "غسالة", "ذهب", "أثاث", "منظم", "فوط", "مكياج", "فستان"];

export default function PlacesClient() {
  const params = useSearchParams();
  const router = useRouter();
  const q0 = params.get("q") ?? "";
  const [q, setQ] = useState(q0);
  const data = useMemo(() => searchPlaces(q0), [q0]);
  const fallback = cheapestDistricts();
  const areas = data.areas.length ? data.areas : fallback;
  const [pickedId, setPickedId] = useState<string | null>(null);
  const area: EgyptArea | undefined =
    areas.find((a) => a.id === pickedId) ?? areas[0];

  function go(next: string) {
    setPickedId(null);
    router.push(next ? `/places?q=${encodeURIComponent(next)}` : "/places");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="space-y-3">
        <p className="text-sm text-primary">لو عايزة تنزلي — بنودّيكي للحي من داتا وفّري</p>
        <h1 className="font-heading text-3xl font-semibold md:text-4xl">
          فين هتلاقي الحاجة دي؟
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          اكتبي اللي محتاجاه. بنجمع الأحياء عندنا (حمام التلات، عبدالعزيز، الصاغة…)
          ونرميكي على المنطقة اللي تناسب الكلمة. مفيش بحث جوجل — الخريطة بتورّي
          إحداثيات الحي بس.
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
            placeholder="حلل، غسالة، شبكة ذهب…"
            className="h-12 text-base"
          />
          <button type="submit" className={cn(buttonVariants(), "h-12")}>
            ودّيني للحي
          </button>
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
        <p className="text-xs text-muted-foreground">{data.note}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-2">
          <h2 className="font-medium">
            {q0 && data.areas.length ? "المنطقة المناسبة" : "مناطق الجملة"}
          </h2>
          {areas.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setPickedId(a.id)}
              className={`w-full rounded-xl p-3 text-start ring-1 ring-foreground/10 ${
                area?.id === a.id ? "bg-secondary" : "bg-card hover:bg-muted"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-medium">
                  {q0 && data.areas.length && i === 0 ? "الأقرب لكلمتك: " : ""}
                  {a.name}
                </span>
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
                <a
                  href={osmPinUrl(area.lat, area.lng)}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants())}
                >
                  <MapPin />
                  افتحي الخريطة
                </a>
              </div>
              <iframe
                title={area.name}
                src={osmEmbedSrc(area.lat, area.lng)}
                className="h-72 w-full rounded-xl ring-1 ring-foreground/10"
                loading="lazy"
              />
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">نقاط تنزلي عندها في الحي</h2>
            {area?.spots.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {area.spots.map((s) => (
                  <a
                    key={s.id}
                    href={osmPinUrl(area.lat, area.lng)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 hover:bg-secondary"
                  >
                    <p className="font-medium">{s.name}</p>
                    <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{s.note}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-primary">
                      <ExternalLink className="size-3" />
                      {area.name}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
                اختاري حي من القائمة عشان تشوفي نقاط النزول.
              </p>
            )}
          </section>

          <p className="text-sm">
            لو هتشتري أونلاين كمان،{" "}
            <Link className="text-primary underline" href={`/search?q=${encodeURIComponent(q0 || "حلل")}`}>
              قارني في السوق
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
