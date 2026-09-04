"use client";

import { useEffect, useState } from "react";
import { productPhotoSrc, PHOTO_CREDIT } from "@/lib/product-images";
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
  const primary = productPhotoSrc({ id, category, name, brand, model });
  const [src, setSrc] = useState(primary);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(primary);
    setFailed(false);
  }, [primary]);

  return (
    <div
      className={`relative overflow-hidden bg-white ${
        /(?:^|\s)(h-|aspect-)/.test(className) ? "" : "aspect-[4/3]"
      } ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${name}${model ? ` · ${model}` : ""}`}
        className="size-full object-contain"
        referrerPolicy="no-referrer"
        onError={() => {
          if (failed) return;
          setFailed(true);
          setSrc(`${primary}${primary.includes("?") ? "&" : "?"}fallback=glyph`);
        }}
      />
      <span className="pointer-events-none absolute bottom-1 start-1 max-w-[90%] truncate rounded bg-background/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">
        {PHOTO_CREDIT}
      </span>
    </div>
  );
}
