"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
        placeholder="دورِي على غسالة، ثلاجة، ماركة، موديل..."
        className={compact ? "h-9 bg-muted/50" : "h-12 bg-background text-base"}
        name="q"
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
