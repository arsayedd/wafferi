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
import { useRecipes } from "@/hooks/use-recipes";
import { diffRuns } from "@/lib/intel/diff";
import type { InspectResult } from "@/lib/intel/inspect";
import {
  type ChangeEvent,
  type WatchItem,
  type WatchTier,
  watchDue,
} from "@/lib/intel/types";

const KEY = "waffari-intel-v1";

type File = { watches: WatchItem[]; events: ChangeEvent[]; auto: boolean };

type IntelState = {
  ready: boolean;
  watches: WatchItem[];
  events: ChangeEvent[];
  auto: boolean;
  polling: boolean;
  setAuto: (on: boolean) => void;
  addWatch: (url: string, tier: WatchTier) => Promise<void>;
  removeWatch: (id: string) => void;
  setTier: (id: string, tier: WatchTier) => void;
  runWatch: (id: string) => Promise<void>;
  runDue: () => Promise<void>;
};

const Ctx = createContext<IntelState | null>(null);

function uid() {
  return `w-${Math.random().toString(36).slice(2, 9)}`;
}

export function IntelProvider({ children }: { children: React.ReactNode }) {
  const { extra } = useRecipes();
  const [watches, setWatches] = useState<WatchItem[]>([]);
  const [events, setEvents] = useState<ChangeEvent[]>([]);
  const [auto, setAuto] = useState(false);
  const [polling, setPolling] = useState(false);
  const [ready, setReady] = useState(false);
  const extraRef = useRef(extra);
  extraRef.current = extra;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const file = JSON.parse(raw) as File;
        setWatches(
          (file.watches ?? []).map((w) => ({
            ...w,
            lastSnapshots: w.lastSnapshots ?? [],
            waterfall: w.waterfall ?? [],
            history: w.history ?? [],
          })),
        );
        setEvents(file.events ?? []);
        setAuto(Boolean(file.auto));
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ watches, events, auto } satisfies File));
  }, [watches, events, auto, ready]);

  const applyInspect = useCallback((watch: WatchItem, data: InspectResult): WatchItem => {
    const snaps = data.snapshots ?? [];
    const next: WatchItem = {
      ...watch,
      lastCheck: Date.now(),
      lastSnapshots: snaps,
      snapshot: snaps[0],
      history: snaps[0] ? [...watch.history, snaps[0]].slice(-40) : watch.history,
      waterfall: data.waterfall ?? [],
      error: data.error,
      discovery: data.discovery,
    };
    return next;
  }, []);

  const runWatch = useCallback(
    async (id: string) => {
      const current = watches.find((w) => w.id === id);
      if (!current) return;
      setPolling(true);
      try {
        const res = await fetch("/api/intel-check", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url: current.url, recipes: extraRef.current }),
        });
        const data = (await res.json()) as InspectResult & { error?: string };
        const prevSnaps = current.lastSnapshots ?? [];
        const nextSnaps = data.snapshots ?? [];
        const delta = diffRuns(prevSnaps, nextSnaps);
        setEvents((ev) => [...delta, ...ev].slice(0, 200));
        setWatches((all) =>
          all.map((w) => (w.id === id ? applyInspect(w, data) : w)),
        );
      } finally {
        setPolling(false);
      }
    },
    [watches, applyInspect],
  );

  const addWatch = useCallback(async (url: string, tier: WatchTier) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const item: WatchItem = {
      id: uid(),
      url: trimmed,
      tier,
      lastCheck: 0,
      lastSnapshots: [],
      history: [],
      waterfall: [],
    };
    setWatches((prev) => (prev.some((w) => w.url === trimmed) ? prev : [item, ...prev]));
    setPolling(true);
    try {
      const res = await fetch("/api/intel-check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: trimmed, recipes: extraRef.current }),
      });
      const data = (await res.json()) as InspectResult;
      setWatches((all) => all.map((w) => (w.url === trimmed ? applyInspect(w, data) : w)));
    } finally {
      setPolling(false);
    }
  }, [applyInspect]);

  const removeWatch = useCallback((id: string) => {
    setWatches((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const setTier = useCallback((id: string, tier: WatchTier) => {
    setWatches((prev) => prev.map((w) => (w.id === id ? { ...w, tier } : w)));
  }, []);

  const runDue = useCallback(async () => {
    const due = watches.filter((w) => watchDue(w)).slice(0, 3);
    for (const w of due) await runWatch(w.id);
  }, [watches, runWatch]);

  useEffect(() => {
    if (!auto || !ready) return;
    const t = setInterval(() => {
      void runDue();
    }, 20_000);
    return () => clearInterval(t);
  }, [auto, ready, runDue]);

  const value = useMemo(
    () => ({
      ready,
      watches,
      events,
      auto,
      polling,
      setAuto,
      addWatch,
      removeWatch,
      setTier,
      runWatch,
      runDue,
    }),
    [ready, watches, events, auto, polling, addWatch, removeWatch, setTier, runWatch, runDue],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useIntel() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useIntel must be inside IntelProvider");
  return v;
}
