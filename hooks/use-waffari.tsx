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
import { templates } from "@/lib/catalog";
import type { BridalSetup, ListItem, PriceAlert } from "@/lib/types";

const LIST_KEY = "waffari-list-v1";
const ALERT_KEY = "waffari-alerts-v1";
const COMPARE_KEY = "waffari-compare-v1";
const BUDGET_KEY = "waffari-budget-v1";
const SETUPS_KEY = "waffari-setups-v1";

function uid() {
  return `setup-${Math.random().toString(36).slice(2, 9)}`;
}

function emptySetup(name = "جهاز العروسة"): BridalSetup {
  return { id: uid(), name, budget: 200000, items: [] };
}

type SetupsFile = { setups: BridalSetup[]; activeId: string };

type ListState = {
  ready: boolean;
  setups: BridalSetup[];
  activeId: string;
  items: ListItem[];
  budget: number;
  alerts: PriceAlert[];
  compare: string[];
  addItem: (productId: string, storeId?: string) => void;
  addMany: (productIds: string[]) => void;
  removeItem: (productId: string) => void;
  togglePurchased: (productId: string) => void;
  setNote: (productId: string, note: string) => void;
  setQty: (productId: string, qty: number) => void;
  setItemStore: (productId: string, storeId: string | undefined) => void;
  applyTemplate: (templateId: string) => void;
  fillTemplate: (templateId: string) => void;
  clearList: () => void;
  setBudget: (n: number) => void;
  addAlert: (productId: string, targetPrice: number) => void;
  removeAlert: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  createSetup: (name: string) => void;
  renameSetup: (id: string, name: string) => void;
  deleteSetup: (id: string) => void;
  switchSetup: (id: string) => void;
};

const Ctx = createContext<ListState | null>(null);

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function migrateSetups(): SetupsFile {
  const existing = readJson<SetupsFile | null>(SETUPS_KEY, null);
  if (existing?.setups?.length) return existing;
  const items = readJson<ListItem[]>(LIST_KEY, []);
  const budget = readJson<number>(BUDGET_KEY, 200000);
  const first = emptySetup("جهاز العروسة");
  first.items = items;
  first.budget = budget;
  return { setups: [first], activeId: first.id };
}

function patchActive(setups: BridalSetup[], activeId: string, patch: Partial<BridalSetup>) {
  return setups.map((s) => (s.id === activeId ? { ...s, ...patch } : s));
}

export function WaffariProvider({ children }: { children: React.ReactNode }) {
  const [setups, setSetups] = useState<BridalSetup[]>([emptySetup()]);
  const [activeId, setActiveId] = useState(setups[0].id);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    const file = migrateSetups();
    setSetups(file.setups);
    setActiveId(file.activeId);
    setAlerts(readJson<PriceAlert[]>(ALERT_KEY, []));
    setCompare(readJson<string[]>(COMPARE_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    persist(SETUPS_KEY, { setups, activeId });
  }, [setups, activeId, ready]);
  useEffect(() => {
    if (!ready) return;
    persist(ALERT_KEY, alerts);
  }, [alerts, ready]);
  useEffect(() => {
    if (!ready) return;
    persist(COMPARE_KEY, compare);
  }, [compare, ready]);

  const active = setups.find((s) => s.id === activeId) ?? setups[0];
  const items = active?.items ?? [];
  const budget = active?.budget ?? 200000;

  const mutateItems = useCallback(
    (fn: (prev: ListItem[]) => ListItem[]) => {
      dirty.current = true;
      setSetups((prev) => {
        const cur = prev.find((s) => s.id === activeId) ?? prev[0];
        if (!cur) return prev;
        return patchActive(prev, cur.id, { items: fn(cur.items) });
      });
    },
    [activeId],
  );

  const addItem = useCallback(
    (productId: string, storeId?: string) => {
      mutateItems((prev) => {
        if (prev.some((i) => i.productId === productId)) return prev;
        return [...prev, { productId, qty: 1, purchased: false, note: "", storeId }];
      });
    },
    [mutateItems],
  );

  const addMany = useCallback(
    (productIds: string[]) => {
      mutateItems((prev) => {
        const have = new Set(prev.map((i) => i.productId));
        const extra = productIds
          .filter((id) => !have.has(id))
          .map((productId) => ({ productId, qty: 1, purchased: false, note: "" }));
        return extra.length ? [...prev, ...extra] : prev;
      });
    },
    [mutateItems],
  );

  const removeItem = useCallback(
    (productId: string) => mutateItems((prev) => prev.filter((i) => i.productId !== productId)),
    [mutateItems],
  );

  const togglePurchased = useCallback(
    (productId: string) =>
      mutateItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, purchased: !i.purchased } : i)),
      ),
    [mutateItems],
  );

  const setNote = useCallback(
    (productId: string, note: string) =>
      mutateItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, note } : i))),
    [mutateItems],
  );

  const setQty = useCallback(
    (productId: string, qty: number) =>
      mutateItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i)),
      ),
    [mutateItems],
  );

  const setItemStore = useCallback(
    (productId: string, storeId: string | undefined) =>
      mutateItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, storeId } : i))),
    [mutateItems],
  );

  const applyTemplate = useCallback(
    (templateId: string) => {
      const t = templates.find((x) => x.id === templateId);
      if (!t) return;
      dirty.current = true;
      setSetups((prev) =>
        patchActive(prev, activeId, {
          items: t.productIds.map((productId) => ({
            productId,
            qty: 1,
            purchased: false,
            note: "",
          })),
          budget: t.suggestedBudget,
        }),
      );
    },
    [activeId],
  );

  const fillTemplate = useCallback(
    (templateId: string) => {
      const t = templates.find((x) => x.id === templateId);
      if (!t) return;
      addMany(t.productIds);
    },
    [addMany],
  );

  const clearList = useCallback(() => mutateItems(() => []), [mutateItems]);

  const setBudget = useCallback(
    (n: number) => {
      dirty.current = true;
      setSetups((prev) => patchActive(prev, activeId, { budget: n }));
    },
    [activeId],
  );

  const addAlert = useCallback((productId: string, targetPrice: number) => {
    dirty.current = true;
    setAlerts((prev) => {
      const rest = prev.filter((a) => a.productId !== productId);
      return [...rest, { productId, targetPrice }];
    });
  }, []);
  const removeAlert = useCallback((productId: string) => {
    setAlerts((prev) => prev.filter((a) => a.productId !== productId));
  }, []);

  const toggleCompare = useCallback((productId: string) => {
    dirty.current = true;
    setCompare((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= 3) return [...prev.slice(1), productId];
      return [...prev, productId];
    });
  }, []);
  const clearCompare = useCallback(() => setCompare([]), []);

  const createSetup = useCallback((name: string) => {
    const s = emptySetup(name.trim() || "قايمة جديدة");
    setSetups((prev) => [...prev, s]);
    setActiveId(s.id);
  }, []);

  const renameSetup = useCallback((id: string, name: string) => {
    setSetups((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  }, []);

  const deleteSetup = useCallback((id: string) => {
    setSetups((prev) => {
      if (prev.length <= 1) return [emptySetup()];
      const next = prev.filter((s) => s.id !== id);
      return next.length ? next : [emptySetup()];
    });
    setActiveId((cur) => (cur === id ? "" : cur));
  }, []);

  useEffect(() => {
    if (!setups.some((s) => s.id === activeId) && setups[0]) setActiveId(setups[0].id);
  }, [setups, activeId]);

  const switchSetup = useCallback((id: string) => setActiveId(id), []);

  const value = useMemo(
    () => ({
      ready,
      setups,
      activeId,
      items,
      budget,
      alerts,
      compare,
      addItem,
      addMany,
      removeItem,
      togglePurchased,
      setNote,
      setQty,
      setItemStore,
      applyTemplate,
      fillTemplate,
      clearList,
      setBudget,
      addAlert,
      removeAlert,
      toggleCompare,
      clearCompare,
      createSetup,
      renameSetup,
      deleteSetup,
      switchSetup,
    }),
    [
      ready,
      setups,
      activeId,
      items,
      budget,
      alerts,
      compare,
      addItem,
      addMany,
      removeItem,
      togglePurchased,
      setNote,
      setQty,
      setItemStore,
      applyTemplate,
      fillTemplate,
      clearList,
      setBudget,
      addAlert,
      removeAlert,
      toggleCompare,
      clearCompare,
      createSetup,
      renameSetup,
      deleteSetup,
      switchSetup,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWaffari() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWaffari must be inside provider");
  return v;
}
