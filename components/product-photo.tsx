"use client";

import { useState } from "react";
import { productImage, productImageFallback } from "@/lib/product-images";
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
  const [step, setStep] = useState(0);
  const sources = [productImage(id, category, name), productImageFallback(id, category)];

  if (step >= sources.length) {
    return <ProductArt category={category} name={name} className={className} />;
  }

  return (
    <div
      className={`relative overflow-hidden bg-muted ${
        /(?:^|\s)(h-|aspect-)/.test(className) ? "" : "aspect-[4/3]"
      } ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sources[step]}
        alt={name}
        className="size-full object-cover"
        referrerPolicy="no-referrer"
        onError={() => setStep((s) => s + 1)}
      />
    </div>
  );
}
