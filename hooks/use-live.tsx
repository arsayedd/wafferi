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
import { toast } from "sonner";
import { cheapestListing, getProduct } from "@/lib/catalog";
import {
  TICK_MS,
  recentMoves,
  tickBucket,
  withLivePrices,
  type LiveProduct,
  type PriceMove,
} from "@/lib/live-quotes";
import { formatPrice } from "@/lib/format";
import { useWaffari } from "@/hooks/use-waffari";
import type { Product } from "@/lib/types";

export type InboxItem = {
  id: string;
  title: string;
  body: string;
  href: string;
  ts: number;
  read: boolean;
};

const INBOX_KEY = "waffari-inbox-v1";
const PERM_KEY = "waffari-notify-on";

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

export function LiveMarketProvider({ children }: { children: React.ReactNode }) {
  const { alerts, items } = useWaffari();
  const [now, setNow] = useState(() => Date.now());
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [notifyOn, setNotifyOn] = useState(false);
  const lastBucket = useRef<number>(-1);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(INBOX_KEY);
      if (raw) setInbox(JSON.parse(raw) as InboxItem[]);
      setNotifyOn(localStorage.getItem(PERM_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    localStorage.setItem(INBOX_KEY, JSON.stringify(inbox.slice(0, 80)));
  }, [inbox]);

  const pushNote = useCallback(
    (item: Omit<InboxItem, "id" | "ts" | "read">) => {
      const full: InboxItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ts: Date.now(),
        read: false,
      };
      setInbox((prev) => [full, ...prev].slice(0, 80));
      toast.success(item.title, { description: item.body });
      if (
        notifyOn &&
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        try {
          new Notification(item.title, { body: item.body });
        } catch {
          /* ignore */
        }
      }
    },
    [notifyOn],
  );

  useEffect(() => {
    const bucket = tickBucket(now);
    if (lastBucket.current === bucket) return;
    const prev = lastBucket.current;
    lastBucket.current = bucket;
    if (prev < 0) return;

    for (const a of alerts) {
      const p = getProduct(a.productId);
      if (!p) continue;
      const cheapNow = cheapestListing(withLivePrices(p, now)).price;
      const cheapWas = cheapestListing(withLivePrices(p, now - TICK_MS)).price;
      if (cheapNow <= a.targetPrice && cheapWas > a.targetPrice) {
        pushNote({
          title: "السعر وصل للهدف",
          body: `${p.name} بقت ${formatPrice(cheapNow)}`,
          href: `/product/${p.id}`,
        });
      }
    }

    for (const it of items) {
      const p = getProduct(it.productId);
      if (!p) continue;
      const cheapNow = cheapestListing(withLivePrices(p, now)).price;
      const cheapWas = cheapestListing(withLivePrices(p, now - TICK_MS)).price;
      const drop = cheapWas - cheapNow;
      if (drop >= Math.max(50, cheapWas * 0.015)) {
        pushNote({
          title: "نزول سعر في قايمتك",
          body: `${p.name} نزلت ${formatPrice(drop)}`,
          href: `/product/${p.id}`,
        });
      }
    }
  }, [now, alerts, items, pushNote]);

  const liveProduct = useCallback(
    (p: Product) => withLivePrices(p, now),
    [now],
  );

  const liveById = useCallback(
    (id: string) => {
      const p = getProduct(id);
      return p ? withLivePrices(p, now) : undefined;
    },
    [now],
  );

  const moves = useMemo(() => recentMoves(now, 18), [now]);

  const markRead = useCallback(() => {
    setInbox((prev) => prev.map((i) => ({ ...i, read: true })));
  }, []);

  const enableBrowserNotifications = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    const perm = await Notification.requestPermission();
    const on = perm === "granted";
    setNotifyOn(on);
    localStorage.setItem(PERM_KEY, on ? "1" : "0");
    if (on) {
      toast.success("التنبيهات اللحظية اتفتحِت على الجهاز ده");
    } else {
      toast.error("المتصفح رفض الإذن. تقدري تفعّليه من إعدادات الموقع.");
    }
  }, []);

  const unread = inbox.filter((i) => !i.read).length;

  const value = useMemo(
    () => ({
      now,
      inbox,
      unread,
      moves,
      notifyOn,
      liveProduct,
      liveById,
      markRead,
      enableBrowserNotifications,
    }),
    [
      now,
      inbox,
      unread,
      moves,
      notifyOn,
      liveProduct,
      liveById,
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
