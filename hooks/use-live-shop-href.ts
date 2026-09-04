"use client";

import { useEffect, useState } from "react";
import { isGoogleShopUrl, isShopableListingUrl } from "@/lib/link-health";

const cache = new Map<string, boolean>();

/** Hide until the shop URL is confirmed reachable (or a known marketplace bot-wall). */
export function useLiveShopHref(href: string) {
  const [ok, setOk] = useState<boolean>(() => {
    if (!href || !isShopableListingUrl(href) || isGoogleShopUrl(href)) return false;
    return cache.get(href) ?? false;
  });
  const [checked, setChecked] = useState(() => cache.has(href));

  useEffect(() => {
    if (!href || !isShopableListingUrl(href) || isGoogleShopUrl(href)) {
      setOk(false);
      setChecked(true);
      return;
    }
    const hit = cache.get(href);
    if (hit != null) {
      setOk(hit);
      setChecked(true);
      return;
    }
    let alive = true;
    fetch(`/api/link-health?u=${encodeURIComponent(href)}`)
      .then((r) => r.json())
      .then((j: { ok?: boolean }) => {
        const next = Boolean(j.ok);
        cache.set(href, next);
        if (alive) {
          setOk(next);
          setChecked(true);
        }
      })
      .catch(() => {
        cache.set(href, false);
        if (alive) {
          setOk(false);
          setChecked(true);
        }
      });
    return () => {
      alive = false;
    };
  }, [href]);

  return { ok, checked };
}
