"use client";

import { useState } from "react";
import { storeHostname, storeLogoUrl } from "@/lib/store-link";

export function StoreLogo({
  name,
  website,
  size = 20,
}: {
  name: string;
  website?: string;
  size?: number;
}) {
  const host = website ? storeHostname(website) : "";
  const sources = host
    ? [
        storeLogoUrl(website!),
        `https://icons.duckduckgo.com/ip3/${host}.ico`,
      ]
    : [];
  const [i, setI] = useState(0);
  const letter = name.trim().slice(0, 1) || "م";
  const failed = !sources.length || i >= sources.length;

  if (failed) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-semibold text-primary"
        style={{ width: size, height: size }}
        aria-hidden
      >
        {letter}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={sources[i]}
      alt=""
      width={size}
      height={size}
      className="inline-block shrink-0 rounded-md bg-white object-contain ring-1 ring-foreground/10"
      onError={() => setI((n) => n + 1)}
    />
  );
}
