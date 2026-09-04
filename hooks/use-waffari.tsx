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
import type { ListItem, PriceAlert } from "@/lib/types";

const LIST_KEY = "waffari-list-v1";
const ALERT_KEY = "waffari-alerts-v1";
const COMPARE_KEY = "waffari-compare-v1";
const BUDGET_KEY = "waffari-budget-v1";

type ListState = {
  items: ListItem[];
  budget: number;
  alerts: PriceAlert[];
  compare: string[];
  addItem: (productId: string) => void;
  addMany: (productIds: string[]) => void;
  removeItem: (productId: string) => void;
  togglePurchased: (productId: string) => void;
  setNote: (productId: string, note: string) => void;
  setQty: (productId: string, qty: number) => void;
  applyTemplate: (templateId: string) => void;
  clearList: () => void;
  setBudget: (n: number) => void;
  addAlert: (productId: string, targetPrice: number) => void;
  removeAlert: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
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

export function WaffariProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ListItem[]>([]);
  const [budget, setBudgetState] = useState(80000);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const dirty = useRef(false);

  useEffect(() => {
    if (dirty.current) {
      setReady(true);
      return;
    }
    setItems(readJson<ListItem[]>(LIST_KEY, []));
    setBudgetState(readJson<number>(BUDGET_KEY, 80000));
    setAlerts(readJson<PriceAlert[]>(ALERT_KEY, []));
    setCompare(readJson<string[]>(COMPARE_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(LIST_KEY, JSON.stringify(items));
  }, [items, ready]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
  }, [budget, ready]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(ALERT_KEY, JSON.stringify(alerts));
  }, [alerts, ready]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
  }, [compare, ready]);

  const addItem = useCallback((productId: string) => {
    dirty.current = true;
    setItems((prev) => {
      if (prev.some((i) => i.productId === productId)) return prev;
      const next = [...prev, { productId, qty: 1, purchased: false, note: "" }];
      persist(LIST_KEY, next);
      return next;
    });
  }, []);

  const addMany = useCallback((productIds: string[]) => {
    dirty.current = true;
    setItems((prev) => {
      const have = new Set(prev.map((i) => i.productId));
      const extra = productIds
        .filter((id) => !have.has(id))
        .map((productId) => ({
          productId,
          qty: 1,
          purchased: false,
          note: "",
        }));
      if (!extra.length) return prev;
      const next = [...prev, ...extra];
      persist(LIST_KEY, next);
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const togglePurchased = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, purchased: !i.purchased } : i,
      ),
    );
  }, []);

  const setNote = useCallback((productId: string, note: string) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, note } : i)),
    );
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i,
      ),
    );
  }, []);

  const applyTemplate = useCallback((templateId: string) => {
    const t = templates.find((x) => x.id === templateId);
    if (!t) return;
    setItems(
      t.productIds.map((productId) => ({
        productId,
        qty: 1,
        purchased: false,
        note: "",
      })),
    );
    setBudgetState(t.suggestedBudget);
  }, []);

  const clearList = useCallback(() => setItems([]), []);
  const setBudget = useCallback((n: number) => setBudgetState(n), []);

  const addAlert = useCallback((productId: string, targetPrice: number) => {
    dirty.current = true;
    setAlerts((prev) => {
      const rest = prev.filter((a) => a.productId !== productId);
      const next = [...rest, { productId, targetPrice }];
      persist(ALERT_KEY, next);
      return next;
    });
  }, []);
  const removeAlert = useCallback((productId: string) => {
    setAlerts((prev) => prev.filter((a) => a.productId !== productId));
  }, []);

  const toggleCompare = useCallback((productId: string) => {
    dirty.current = true;
    setCompare((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : prev.length >= 3
          ? [...prev.slice(1), productId]
          : [...prev, productId];
      persist(COMPARE_KEY, next);
      return next;
    });
  }, []);
  const clearCompare = useCallback(() => setCompare([]), []);

  const value = useMemo(
    () => ({
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
      applyTemplate,
      clearList,
      setBudget,
      addAlert,
      removeAlert,
      toggleCompare,
      clearCompare,
    }),
    [
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
      applyTemplate,
      clearList,
      setBudget,
      addAlert,
      removeAlert,
      toggleCompare,
      clearCompare,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWaffari() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWaffari must be inside provider");
  return v;
}
