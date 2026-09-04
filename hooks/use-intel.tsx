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
import { afterRunStats } from "@/lib/intel/scheduler";
import { evaluateRules, type AlertHit, type AlertRule } from "@/lib/intel/alerts";
import { saasPlans, type PlanId } from "@/lib/intel/plans";
import {
  type ChangeEvent,
  type WatchItem,
  type WatchTier,
  watchDue,
} from "@/lib/intel/types";
import { catalogReferenceWatches, catalogSpreadEvents, defaultMyPrice, hydrateIntelWatches } from "@/lib/intel/catalog-seed";
import { snapshotsFromCatalogProduct } from "@/lib/intel/from-product";
import { getProduct } from "@/lib/catalog";

const KEY = "waffari-intel-v3";

type File = {
  watches: WatchItem[];
  events: ChangeEvent[];
  auto: boolean;
  rules: AlertRule[];
  plan: PlanId;
  myPrice: number;
};

type IntelState = {
  ready: boolean;
  watches: WatchItem[];
  events: ChangeEvent[];
  auto: boolean;
  polling: boolean;
  rules: AlertRule[];
  hits: AlertHit[];
  plan: PlanId;
  myPrice: number;
  setAuto: (on: boolean) => void;
  setPlan: (p: PlanId) => void;
  setMyPrice: (n: number) => void;
  addRule: (rule: Omit<AlertRule, "id">) => void;
  removeRule: (id: string) => void;
  addWatch: (url: string, tier: WatchTier) => Promise<void>;
  removeWatch: (id: string) => void;
  resetCatalog: () => void;
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
  const initial = catalogReferenceWatches();
  const [watches, setWatches] = useState<WatchItem[]>(initial);
  const [events, setEvents] = useState<ChangeEvent[]>(() => catalogSpreadEvents(initial));
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [plan, setPlan] = useState<PlanId>("starter");
  const [myPrice, setMyPrice] = useState(() => defaultMyPrice(initial));
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
        const next = hydrateIntelWatches(file.watches);
        setWatches(next);
        setEvents(file.events?.length ? file.events : catalogSpreadEvents(next));
        setAuto(Boolean(file.auto));
        setRules(file.rules ?? []);
        setPlan(file.plan ?? "starter");
        setMyPrice(file.myPrice || defaultMyPrice(next));
      } else {
        const next = catalogReferenceWatches();
        setWatches(next);
        setEvents(catalogSpreadEvents(next));
        setMyPrice(defaultMyPrice(next));
      }
    } catch {
      const next = catalogReferenceWatches();
      setWatches(next);
      setEvents(catalogSpreadEvents(next));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      KEY,
      JSON.stringify({ watches, events, auto, rules, plan, myPrice } satisfies File),
    );
  }, [watches, events, auto, rules, plan, myPrice, ready]);

  const applyInspect = useCallback((watch: WatchItem, data: InspectResult, changed: boolean): WatchItem => {
    const snaps = data.snapshots ?? [];
    const stats = afterRunStats(watch, changed);
    return {
      ...watch,
      lastCheck: Date.now(),
      lastSnapshots: snaps,
      snapshot: snaps[0],
      history: snaps[0] ? [...watch.history, snaps[0]].slice(-40) : watch.history,
      waterfall: data.waterfall ?? [],
      error: data.error,
      discovery: data.discovery,
      platform: data.platform,
      robotsNote: data.robotsNote,
      ...stats,
    };
  }, []);

  const runWatch = useCallback(
    async (id: string) => {
      const current = watches.find((w) => w.id === id);
      if (!current) return;
      if (current.platform === "catalog-reference" || current.id.startsWith("catalog-")) {
        const pid = current.id.replace(/^catalog-/, "");
        const p = getProduct(pid);
        if (!p) return;
        const snaps = snapshotsFromCatalogProduct(p);
        const prevSnaps = current.lastSnapshots ?? [];
        const delta = diffRuns(prevSnaps, snaps);
        setEvents((ev) => [...delta, ...ev].slice(0, 200));
        setWatches((all) =>
          all.map((w) =>
            w.id === id
              ? {
                  ...w,
                  lastCheck: Date.now(),
                  lastSnapshots: snaps,
                  snapshot: snaps[0],
                  history: snaps[0] ? [...w.history, snaps[0]].slice(-40) : w.history,
                }
              : w,
          ),
        );
        return;
      }
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
          all.map((w) => (w.id === id ? applyInspect(w, data, delta.length > 0) : w)),
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
    const cap = saasPlans.find((p) => p.id === plan)?.watches ?? 25;
    if (watches.length >= cap) return;
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
      setWatches((all) => all.map((w) => (w.url === trimmed ? applyInspect(w, data, false) : w)));
    } finally {
      setPolling(false);
    }
  }, [applyInspect, plan, watches.length]);

  const removeWatch = useCallback((id: string) => {
    setWatches((prev) => {
      const next = prev.filter((w) => w.id !== id);
      return next.length ? next : catalogReferenceWatches();
    });
  }, []);

  const resetCatalog = useCallback(() => {
    const next = catalogReferenceWatches();
    setWatches(next);
    setEvents(catalogSpreadEvents(next));
    setMyPrice(defaultMyPrice(next));
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

  const addRule = useCallback((rule: Omit<AlertRule, "id">) => {
    setRules((prev) => [...prev, { ...rule, id: uid() }]);
  }, []);
  const removeRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const snaps = watches.flatMap((w) => w.lastSnapshots ?? []);
  const hits = evaluateRules(rules, events, snaps);

  const value = useMemo(
    () => ({
      ready,
      watches,
      events,
      auto,
      polling,
      rules,
      hits,
      plan,
      myPrice,
      setAuto,
      setPlan,
      setMyPrice,
      addRule,
      removeRule,
      addWatch,
      removeWatch,
      resetCatalog,
      setTier,
      runWatch,
      runDue,
    }),
    [
      ready,
      watches,
      events,
      auto,
      polling,
      rules,
      hits,
      plan,
      myPrice,
      addRule,
      removeRule,
      addWatch,
      removeWatch,
      resetCatalog,
      setTier,
      runWatch,
      runDue,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useIntel() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useIntel must be inside IntelProvider");
  return v;
}
