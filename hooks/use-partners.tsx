"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { buildOutboundUrl, type PartnerRule } from "@/lib/outbound";

const KEY = "waffari-partner-rules-v2";

const defaults: PartnerRule[] = [
  { storeId: "jumia", affiliateId: "", coupon: "", extraQuery: "utm_campaign=bridal" },
  { storeId: "noon", affiliateId: "", coupon: "", extraQuery: "utm_campaign=bridal" },
  { storeId: "amazon", affiliateId: "", coupon: "", extraQuery: "" },
  { storeId: "namshi", affiliateId: "", coupon: "", extraQuery: "utm_campaign=bridal" },
  { storeId: "carrefour", affiliateId: "", coupon: "", extraQuery: "" },
];

type PartnersState = {
  rules: PartnerRule[];
  upsert: (rule: PartnerRule) => void;
  ruleFor: (storeId: string) => PartnerRule | undefined;
  outbound: (url: string, storeId: string, listingCoupon?: string, productName?: string) => string;
};

const Ctx = createContext<PartnersState | null>(null);

function merge(saved: PartnerRule[]): PartnerRule[] {
  const map = new Map(defaults.map((d) => [d.storeId, { ...d }]));
  for (const s of saved) map.set(s.storeId, { ...map.get(s.storeId), ...s });
  return [...map.values()];
}

function PartnersProvider({ children }: { children: React.ReactNode }) {
  const [rules, setRules] = useState<PartnerRule[]>(defaults);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setRules(merge(raw ? (JSON.parse(raw) as PartnerRule[]) : []));
    } catch {
      setRules(merge([]));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(rules));
  }, [rules, ready]);

  const upsert = useCallback((rule: PartnerRule) => {
    setRules((prev) => {
      const i = prev.findIndex((r) => r.storeId === rule.storeId);
      if (i < 0) return [...prev, rule];
      const next = [...prev];
      next[i] = rule;
      return next;
    });
  }, []);

  const ruleFor = useCallback(
    (storeId: string) => rules.find((r) => r.storeId === storeId),
    [rules],
  );

  const outbound = useCallback(
    (url: string, storeId: string, listingCoupon?: string, productName?: string) => {
      const rule = ruleFor(storeId) ?? {
        storeId,
        affiliateId: "",
        coupon: "",
        extraQuery: "",
      };
      return buildOutboundUrl(url, { ...rule, storeId }, listingCoupon, productName);
    },
    [ruleFor],
  );

  const value = useMemo(
    () => ({ rules, upsert, ruleFor, outbound }),
    [rules, upsert, ruleFor, outbound],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePartners() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePartners must be inside PartnersProvider");
  return v;
}

export { PartnersProvider };
export default PartnersProvider;
