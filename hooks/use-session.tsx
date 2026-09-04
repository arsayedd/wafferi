"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ACCOUNTS_KEY,
  SESSION_KEY,
  type BrideProfile,
  type StoredAccount,
} from "@/lib/session";

const PLAN_KEY = "waffari-bride-journey-v1";

type SessionState = {
  ready: boolean;
  user: BrideProfile | null;
  register: (profile: BrideProfile, password: string) => string | null;
  login: (loginId: string, password: string) => string | null;
  logout: () => void;
};

const Ctx = createContext<SessionState | null>(null);

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function seedPlan(p: BrideProfile) {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    const prev = raw ? JSON.parse(raw) : {};
    localStorage.setItem(
      PLAN_KEY,
      JSON.stringify({
        ...prev,
        shown: false,
        answers: {
          months: p.months,
          weddingDate: p.weddingDate,
          budget: p.budget,
          furnished: p.furnished,
          finished: p.finished,
          hasKitchen: p.hasKitchen,
          hasAppliances: p.hasAppliances,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          tier: p.tier,
        },
      }),
    );
  } catch {
    /* ignore */
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BrideProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const id = localStorage.getItem(SESSION_KEY);
      if (id) {
        const acc = readAccounts().find((a) => a.profile.id === id);
        if (acc) setUser(acc.profile);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const register = useCallback((profile: BrideProfile, password: string) => {
    if (password.length < 6) return "الباسورد ٦ حروف على الأقل";
    const accounts = readAccounts();
    const phone = profile.phone.trim();
    const email = profile.email.trim().toLowerCase();
    if (!profile.firstName.trim()) return "اكتبي الاسم الأول";
    if (!phone && !email) return "موبايل أو إيميل مطلوب";
    if (accounts.some((a) => phone && a.profile.phone === phone)) {
      return "الموبايل مسجّل قبل كده — جرّبي الدخول";
    }
    if (accounts.some((a) => email && a.profile.email.toLowerCase() === email)) {
      return "الإيميل مسجّل قبل كده — جرّبي الدخول";
    }
    const next: BrideProfile = {
      ...profile,
      id: crypto.randomUUID(),
      phone,
      email,
    };
    accounts.push({ profile: next, password });
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    localStorage.setItem(SESSION_KEY, next.id);
    seedPlan(next);
    setUser(next);
    return null;
  }, []);

  const login = useCallback((loginId: string, password: string) => {
    const id = loginId.trim().toLowerCase();
    const acc = readAccounts().find(
      (a) =>
        a.password === password &&
        (a.profile.phone === loginId.trim() || a.profile.email.toLowerCase() === id),
    );
    if (!acc) return "الموبايل/الإيميل أو الباسورد غلط";
    localStorage.setItem(SESSION_KEY, acc.profile.id);
    setUser(acc.profile);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ ready, user, register, login, logout }),
    [ready, user, register, login, logout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSession must be inside SessionProvider");
  return v;
}
