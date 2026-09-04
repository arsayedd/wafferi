"use client";

import { useState } from "react";
import { productImage } from "@/lib/product-images";
import { ProductArt } from "@/components/product-art";
import type { CategoryId } from "@/lib/types";

export function ProductPhoto({
  id,
  category,
  name,
  className = "",
}: {
  id: string;
  category: CategoryId;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <ProductArt category={category} className={className} />;
  }
  return (
    <div className={`relative aspect-[4/3] overflow-hidden bg-muted ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={productImage(id, category)}
        alt={name}
        className="size-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
