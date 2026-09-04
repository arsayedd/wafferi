"use client";

import { categories } from "@/lib/catalog";
import {
  Refrigerator,
  WashingMachine,
  Wind,
  Flame,
  Sparkles,
  Fan,
  Droplets,
  Tv,
  Blend,
  BedDouble,
  Sofa,
  Utensils,
  Layers,
  Lamp,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/lib/types";

const icons: Record<CategoryId, LucideIcon> = {
  washers: WashingMachine,
  fridges: Refrigerator,
  acs: Wind,
  stoves: Flame,
  dishwashers: Sparkles,
  vacuums: Fan,
  heaters: Droplets,
  tvs: Tv,
  "small-appliances": Blend,
  bedroom: BedDouble,
  living: Sofa,
  "kitchen-tools": Utensils,
  textiles: Layers,
  decor: Lamp,
};

const tints: Record<CategoryId, string> = {
  washers: "from-sky-100 to-sky-50 text-sky-800",
  fridges: "from-cyan-100 to-white text-cyan-800",
  acs: "from-teal-100 to-white text-teal-800",
  stoves: "from-orange-100 to-amber-50 text-orange-800",
  dishwashers: "from-blue-100 to-white text-blue-800",
  vacuums: "from-slate-100 to-white text-slate-700",
  heaters: "from-rose-100 to-white text-rose-800",
  tvs: "from-indigo-100 to-white text-indigo-800",
  "small-appliances": "from-amber-100 to-white text-amber-800",
  bedroom: "from-stone-200 to-stone-50 text-stone-800",
  living: "from-emerald-100 to-white text-emerald-800",
  "kitchen-tools": "from-yellow-100 to-white text-yellow-800",
  textiles: "from-pink-100 to-white text-pink-800",
  decor: "from-yellow-50 to-amber-100 text-amber-900",
};

export function ProductArt({
  category,
  className = "",
}: {
  category: CategoryId;
  className?: string;
}) {
  const Icon = icons[category] ?? Sparkles;
  const tint = tints[category] ?? "from-muted to-white";
  const cat = categories.find((c) => c.id === category);
  return (
    <div
      className={`flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br ${tint} ${className}`}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon className="size-12 opacity-80" strokeWidth={1.4} />
        <span className="text-xs font-medium opacity-70">{cat?.name}</span>
      </div>
    </div>
  );
}
