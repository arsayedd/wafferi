"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products as seed } from "@/lib/catalog";
import type { Product } from "@/lib/types";

const KEY = "waffari-ingested-feed-v1";

type CatalogState = {
  ingested: Product[];
  allProducts: Product[];
  replaceFeed: (items: Product[]) => void;
  clearFeed: () => void;
};

const Ctx = createContext<CatalogState | null>(null);

export function CatalogOverlayProvider({ children }: { children: React.ReactNode }) {
  const [ingested, setIngested] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIngested(JSON.parse(raw) as Product[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(ingested));
  }, [ingested, ready]);

  const replaceFeed = useCallback((items: Product[]) => setIngested(items), []);
  const clearFeed = useCallback(() => setIngested([]), []);

  const allProducts = useMemo(() => {
    const ids = new Set(ingested.map((p) => p.id));
    return [...ingested, ...seed.filter((p) => !ids.has(p.id))];
  }, [ingested]);

  const value = useMemo(
    () => ({ ingested, allProducts, replaceFeed, clearFeed }),
    [ingested, allProducts, replaceFeed, clearFeed],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCatalog must be inside CatalogOverlayProvider");
  return v;
}
