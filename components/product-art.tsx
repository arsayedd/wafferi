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
  Speaker,
  Snowflake,
  GlassWater,
  Scissors,
  Shirt,
  Baby,
  Moon,
  Footprints,
  ShoppingBag,
  Gem,
  Sparkle,
  SprayCan,
  Bath,
  Archive,
  Plane,
  HeartPulse,
  Smartphone,
  Laptop,
  Tablet,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/lib/types";

const icons: Record<CategoryId, LucideIcon> = {
  washers: WashingMachine,
  fridges: Refrigerator,
  freezers: Snowflake,
  acs: Wind,
  fans: Fan,
  stoves: Flame,
  dishwashers: Sparkles,
  vacuums: Fan,
  heaters: Droplets,
  water: GlassWater,
  tvs: Tv,
  audio: Speaker,
  "small-appliances": Blend,
  "personal-care": Scissors,
  bedroom: BedDouble,
  living: Sofa,
  "kitchen-tools": Utensils,
  textiles: Layers,
  decor: Lamp,
  "women-wear": Shirt,
  "men-wear": Shirt,
  "kids-wear": Baby,
  "bridal-wear": Sparkle,
  pajamas: Moon,
  shoes: Footprints,
  bags: ShoppingBag,
  jewelry: Gem,
  beauty: Sparkles,
  accessories: Utensils,
  cleaning: SprayCan,
  bathroom: Bath,
  storage: Archive,
  travel: Plane,
  emergency: HeartPulse,
  baby: Baby,
  phones: Smartphone,
  laptops: Laptop,
  tablets: Tablet,
  gaming: Gamepad2,
};

const tints: Record<CategoryId, string> = {
  washers: "from-sky-100 to-sky-50 text-sky-800",
  fridges: "from-cyan-100 to-white text-cyan-800",
  freezers: "from-blue-100 to-white text-blue-900",
  acs: "from-teal-100 to-white text-teal-800",
  fans: "from-cyan-50 to-white text-cyan-700",
  stoves: "from-orange-100 to-amber-50 text-orange-800",
  dishwashers: "from-blue-100 to-white text-blue-800",
  vacuums: "from-slate-100 to-white text-slate-700",
  heaters: "from-rose-100 to-white text-rose-800",
  water: "from-sky-50 to-white text-sky-800",
  tvs: "from-indigo-100 to-white text-indigo-800",
  audio: "from-violet-100 to-white text-violet-800",
  "small-appliances": "from-amber-100 to-white text-amber-800",
  "personal-care": "from-fuchsia-100 to-white text-fuchsia-800",
  bedroom: "from-stone-200 to-stone-50 text-stone-800",
  living: "from-emerald-100 to-white text-emerald-800",
  "kitchen-tools": "from-yellow-100 to-white text-yellow-800",
  textiles: "from-pink-100 to-white text-pink-800",
  decor: "from-yellow-50 to-amber-100 text-amber-900",
  "women-wear": "from-rose-100 to-white text-rose-800",
  "men-wear": "from-slate-100 to-white text-slate-800",
  "kids-wear": "from-orange-50 to-white text-orange-800",
  "bridal-wear": "from-amber-50 to-rose-100 text-rose-900",
  pajamas: "from-violet-50 to-white text-violet-800",
  shoes: "from-stone-100 to-white text-stone-800",
  bags: "from-yellow-50 to-white text-yellow-900",
  jewelry: "from-amber-100 to-white text-amber-900",
  beauty: "from-fuchsia-50 to-white text-fuchsia-800",
  accessories: "from-lime-50 to-white text-lime-800",
  cleaning: "from-teal-50 to-white text-teal-800",
  bathroom: "from-sky-50 to-cyan-100 text-sky-900",
  storage: "from-amber-50 to-white text-amber-900",
  travel: "from-indigo-50 to-white text-indigo-800",
  emergency: "from-red-50 to-white text-red-800",
  baby: "from-orange-50 to-white text-orange-800",
  phones: "from-slate-100 to-white text-slate-800",
  laptops: "from-zinc-100 to-white text-zinc-800",
  tablets: "from-sky-50 to-white text-sky-800",
  gaming: "from-violet-100 to-white text-violet-900",
};

export function ProductArt({
  category,
  name,
  className = "",
}: {
  category: CategoryId;
  name?: string;
  className?: string;
}) {
  const Icon = icons[category] ?? Sparkles;
  const tint = tints[category] ?? "from-muted to-white";
  const cat = categories.find((c) => c.id === category);
  return (
    <div
      className={`flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br ${tint} ${className}`}
    >
      <div className="flex flex-col items-center gap-2 px-3 text-center">
        <Icon className="size-12 opacity-80" strokeWidth={1.4} />
        <span className="text-xs font-medium opacity-80">{name || cat?.name}</span>
      </div>
    </div>
  );
}
