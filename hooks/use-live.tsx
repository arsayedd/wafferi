"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getProduct } from "@/lib/catalog";
import { asStaticLive, type LiveProduct, type PriceMove } from "@/lib/live-quotes";
import {
  appendTicks,
  historyFor,
  lastTickAt,
  movesFromTicks,
  overlayProduct,
  ticksFromIncomingFeed,
  type QuoteTick,
} from "@/lib/quote-book";
import type { Product } from "@/lib/types";
import { useCatalog } from "@/hooks/use-catalog";

const TICKS_KEY = "waffari-quote-ticks-v2";
const FEEDS_KEY = "waffari-live-feed-urls-v1";
const POLL_MS = 60_000;

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
  ticks: QuoteTick[];
  feedUrls: string[];
  autoPoll: boolean;
  polling: boolean;
  lastFeedAt: number;
  liveProduct: (p: Product) => LiveProduct;
  liveById: (id: string) => LiveProduct | undefined;
  quoteHistory: (productId: string, storeId: string) => number[];
  addFeedUrl: (url: string) => void;
  removeFeedUrl: (url: string) => void;
  refreshFeeds: () => Promise<number>;
  setAutoPoll: (on: boolean) => void;
  recordProducts: (products: Product[]) => void;
  markRead: () => void;
  enableBrowserNotifications: () => Promise<void>;
};

const Ctx = createContext<LiveState | null>(null);

export function LiveMarketProvider({ children }: { children: React.ReactNode }) {
  const { ingested, allProducts, applyFeed } = useCatalog();
  const [ticks, setTicks] = useState<QuoteTick[]>([]);
  const [feedUrls, setFeedUrls] = useState<string[]>([]);
  const [autoPoll, setAutoPoll] = useState(false);
  const [polling, setPolling] = useState(false);
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [notifyOn, setNotifyOn] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const ready = useRef(false);
  const lastIngestSig = useRef("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TICKS_KEY);
      if (raw) setTicks(JSON.parse(raw) as QuoteTick[]);
      const urls = localStorage.getItem(FEEDS_KEY);
      if (urls) setFeedUrls(JSON.parse(urls) as string[]);
    } catch {
      /* ignore */
    }
    ready.current = true;
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    localStorage.setItem(TICKS_KEY, JSON.stringify(ticks.slice(-8000)));
  }, [ticks]);

  useEffect(() => {
    if (!ready.current) return;
    localStorage.setItem(FEEDS_KEY, JSON.stringify(feedUrls));
  }, [feedUrls]);

  const recordProducts = useCallback(
    (products: Product[]) => {
      const incoming = ticksFromIncomingFeed(products, allProducts);
      setTicks((prev) => appendTicks(prev, incoming));
      setNow(Date.now());
    },
    [allProducts],
  );

  useEffect(() => {
    if (!ingested.length) return;
    const sig = ingested
      .map((p) => `${p.id}:${p.listings.map((l) => `${l.storeId}:${l.price}`).join(",")}`)
      .join("|");
    if (sig === lastIngestSig.current) return;
    lastIngestSig.current = sig;
    recordProducts(ingested);
  }, [ingested, recordProducts]);

  const names = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of allProducts) m.set(p.id, p.name);
    return m;
  }, [allProducts]);

  const moves = useMemo(() => movesFromTicks(ticks, names, 40), [ticks, names]);
  const prevMoves = useRef<string>("");

  useEffect(() => {
    const key = moves.map((m) => `${m.productId}-${m.storeId}-${m.at}`).join();
    if (!key || key === prevMoves.current) return;
    const fresh = moves.filter((m) => !prevMoves.current.includes(`${m.productId}-${m.storeId}-${m.at}`));
    prevMoves.current = key;
    if (!fresh.length) return;
    setInbox((box) =>
      [
        ...fresh.slice(0, 8).map((m) => ({
          id: `${m.productId}-${m.storeId}-${m.at}`,
          title: m.productName,
          body: `${m.storeName}: ${m.from} → ${m.to} ج`,
          href: `/product/${m.productId}`,
          ts: m.at,
          read: false,
        })),
        ...box,
      ].slice(0, 40),
    );
    setUnread((n) => n + Math.min(8, fresh.length));
  }, [moves]);

  const liveProduct = useCallback(
    (p: Product) => overlayProduct(p, ticks),
    [ticks],
  );
  const liveById = useCallback(
    (id: string) => {
      const p = allProducts.find((x) => x.id === id) ?? getProduct(id);
      return p ? overlayProduct(p, ticks) : undefined;
    },
    [allProducts, ticks],
  );
  const quoteHistoryFn = useCallback(
    (productId: string, storeId: string) => historyFor(ticks, productId, storeId),
    [ticks],
  );

  const addFeedUrl = useCallback((url: string) => {
    const u = url.trim();
    if (!u) return;
    setFeedUrls((prev) => (prev.includes(u) ? prev : [...prev, u]));
  }, []);
  const removeFeedUrl = useCallback((url: string) => {
    setFeedUrls((prev) => prev.filter((x) => x !== url));
  }, []);

  const refreshFeeds = useCallback(async () => {
    if (!feedUrls.length) return 0;
    setPolling(true);
    let count = 0;
    try {
      for (const url of feedUrls) {
        let recipes: unknown[] = [];
        try {
          recipes = JSON.parse(localStorage.getItem("waffari-host-recipes-v1") ?? "[]");
        } catch {
          recipes = [];
        }
        const res = await fetch("/api/pull-feed", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url, recipes }),
        });
        const data = await res.json();
        if (!res.ok || data.error || !Array.isArray(data.products)) continue;
        applyFeed(data.products);
        count += data.products.length;
      }
    } finally {
      setPolling(false);
      setNow(Date.now());
    }
    return count;
  }, [feedUrls, applyFeed]);

  useEffect(() => {
    if (!autoPoll || !feedUrls.length) return;
    const id = window.setInterval(() => {
      void refreshFeeds();
    }, POLL_MS);
    void refreshFeeds();
    return () => window.clearInterval(id);
  }, [autoPoll, feedUrls, refreshFeeds]);

  const markRead = useCallback(() => {
    setInbox((box) => box.map((n) => ({ ...n, read: true })));
    setUnread(0);
  }, []);

  const enableBrowserNotifications = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const perm = await Notification.requestPermission();
    setNotifyOn(perm === "granted");
  }, []);

  const value = useMemo(
    () => ({
      now,
      inbox,
      unread,
      moves,
      notifyOn,
      ticks,
      feedUrls,
      autoPoll,
      polling,
      lastFeedAt: lastTickAt(ticks),
      liveProduct,
      liveById,
      quoteHistory: quoteHistoryFn,
      addFeedUrl,
      removeFeedUrl,
      refreshFeeds,
      setAutoPoll,
      recordProducts,
      markRead,
      enableBrowserNotifications,
    }),
    [
      now,
      inbox,
      unread,
      moves,
      notifyOn,
      ticks,
      feedUrls,
      autoPoll,
      polling,
      liveProduct,
      liveById,
      quoteHistoryFn,
      addFeedUrl,
      removeFeedUrl,
      refreshFeeds,
      recordProducts,
      markRead,
      enableBrowserNotifications,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLive() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLive must be inside LiveMarketProvider");
  return v;
}

export { asStaticLive, POLL_MS };
