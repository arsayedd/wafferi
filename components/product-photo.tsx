"use client";

import { useState } from "react";
import { productImage, productImageFallback, PHOTO_CREDIT } from "@/lib/product-images";
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
      <span className="pointer-events-none absolute bottom-1 start-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
        {PHOTO_CREDIT}
      </span>
    </div>
  );
}
