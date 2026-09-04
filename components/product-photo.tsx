"use client";

import { useState } from "react";
import { productImageFallback, productPhotoSrc, PHOTO_CREDIT } from "@/lib/product-images";
import { ProductArt } from "@/components/product-art";
import type { CategoryId } from "@/lib/types";

export function ProductPhoto({
  id,
  category,
  name,
  brand = "",
  model = "",
  className = "",
}: {
  id: string;
  category: CategoryId;
  name: string;
  brand?: string;
  model?: string;
  className?: string;
}) {
  const [step, setStep] = useState(0);
  const sources = [
    productPhotoSrc({ id, category, name, brand, model }),
    productImageFallback(id, category, name),
  ];

  if (step >= sources.length) {
    return <ProductArt category={category} name={name} className={className} />;
  }

  return (
    <div
      className={`relative overflow-hidden bg-white ${
        /(?:^|\s)(h-|aspect-)/.test(className) ? "" : "aspect-[4/3]"
      } ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sources[step]}
        alt={`${name}${model ? ` · ${model}` : ""}`}
        className="size-full object-contain"
        referrerPolicy="no-referrer"
        onError={() => setStep((s) => s + 1)}
      />
      <span className="pointer-events-none absolute bottom-1 start-1 max-w-[90%] truncate rounded bg-background/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
        {PHOTO_CREDIT}
      </span>
    </div>
  );
}
