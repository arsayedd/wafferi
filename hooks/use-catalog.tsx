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
import { mergeFeedIntoCatalog } from "@/lib/merge-feed";
import type { Product } from "@/lib/types";

const KEY = "waffari-ingested-feed-v1";

type CatalogState = {
  ingested: Product[];
  allProducts: Product[];
  applyFeed: (items: Product[]) => void;
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

  const applyFeed = useCallback((items: Product[]) => {
    setIngested((prev) => mergeFeedIntoCatalog(items, prev));
  }, []);
  const replaceFeed = applyFeed;
  const clearFeed = useCallback(() => setIngested([]), []);

  const allProducts = useMemo(() => mergeFeedIntoCatalog(ingested, seed), [ingested]);

  const value = useMemo(
    () => ({ ingested, allProducts, applyFeed, replaceFeed, clearFeed }),
    [ingested, allProducts, applyFeed, replaceFeed, clearFeed],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCatalog must be inside CatalogOverlayProvider");
  return v;
}
