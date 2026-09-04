"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";

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

  useEffect(() => {
    setQ(defaultValue);
  }, [defaultValue]);

  function go(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  return (
    <form action="/search" method="get" onSubmit={go} className="flex w-full gap-2">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={
          compact ? "غسالة، ثلاجة، فستان، أي فئة…" : "دورِي بأي منتج أو فئة: غسالة ١٠ كيلو، ثلاجة، فستان فرح"
        }
        className={compact ? "h-9 bg-muted/50" : "h-12 bg-background text-base"}
        name="q"
        autoComplete="off"
      />
      <button
        type="submit"
        className={buttonVariants({
          size: compact ? "default" : "lg",
          className: compact ? undefined : "h-12 px-5",
        })}
      >
        <Search />
        {!compact && "بحث"}
      </button>
    </form>
  );
}
