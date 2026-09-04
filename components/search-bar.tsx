"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { searchSuggestions } from "@/lib/search-suggest";

export function SearchBar({
  compact = false,
  defaultValue = "",
  category,
}: {
  compact?: boolean;
  defaultValue?: string;
  category?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const suggestions = useMemo(() => searchSuggestions(q), [q]);

  useEffect(() => {
    setQ(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function go(query: string) {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    const qs = params.toString();
    setOpen(false);
    router.push(qs ? `/search?${qs}` : "/search");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    go(q);
  }

  return (
    <div ref={box} className="relative w-full">
      <form action="/search" method="get" onSubmit={onSubmit} className="flex w-full gap-2">
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={compact ? "دورِي على ثلاجة، موبايل، لابتوب…" : "اكتبي أي منتج — ثلاجة، موبايل سامسونج، لابتوب، فستان…"}
          className={compact ? "h-10 bg-muted/50" : "h-14 bg-background text-base"}
          name="q"
          autoComplete="off"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        <button
          type="submit"
          className={buttonVariants({
            size: compact ? "default" : "lg",
            className: compact ? undefined : "h-14 px-6",
          })}
        >
          <Search />
          {!compact && "بحث"}
        </button>
      </form>
      {open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
          <p className="border-b px-4 py-2 text-xs text-muted-foreground">
            قايمة البحث: فئات، ماركات، وجمل جاهزة — مش صندوق صغير فاضي
          </p>
          <ul className="max-h-80 overflow-auto py-1">
            {suggestions.map((s) => (
              <li key={s.href}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-right hover:bg-muted"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setQ(s.label);
                    router.push(s.href);
                    setOpen(false);
                  }}
                >
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="text-[11px] text-muted-foreground">{s.hint}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
