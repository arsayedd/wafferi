"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { cheapestListing, getProduct } from "@/lib/catalog";
import type { LiveProduct, PriceMove } from "@/lib/live-quotes";
import type { Product } from "@/lib/types";

export type InboxItem = {
  id: string;
  title: string;
  body: string;
  href: string;
  ts: number;
  read: boolean;
};

type LiveState = {
  now: number;
  inbox: InboxItem[];
  unread: number;
  moves: PriceMove[];
  notifyOn: boolean;
  liveProduct: (p: Product) => LiveProduct;
  liveById: (id: string) => LiveProduct | undefined;
  markRead: () => void;
  enableBrowserNotifications: () => Promise<void>;
};

const Ctx = createContext<LiveState | null>(null);

function asCatalog(p: Product): LiveProduct {
  return {
    ...p,
    listings: p.listings.map((l) => ({
      ...l,
      previousPrice: l.price,
      catalogPrice: l.price,
    })),
  };
}

export function LiveMarketProvider({ children }: { children: React.ReactNode }) {
  const [inbox] = useState<InboxItem[]>([]);
  const now = 0;

  const liveProduct = useCallback((p: Product) => asCatalog(p), []);
  const liveById = useCallback((id: string) => {
    const p = getProduct(id);
    return p ? asCatalog(p) : undefined;
  }, []);
  const markRead = useCallback(() => {}, []);
  const enableBrowserNotifications = useCallback(async () => {}, []);

  const value = useMemo(
    () => ({
      now,
      inbox,
      unread: 0,
      moves: [] as PriceMove[],
      notifyOn: false,
      liveProduct,
      liveById,
      markRead,
      enableBrowserNotifications,
    }),
    [inbox, liveProduct, liveById, markRead, enableBrowserNotifications],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLive() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLive must be inside LiveMarketProvider");
  return v;
}
