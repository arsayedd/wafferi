"use client";

import { useCallback, useEffect, useState } from "react";
import { bundledRecipes, type HostRecipe } from "@/lib/ingest/recipes";

const KEY = "waffari-host-recipes-v1";

export function useRecipes() {
  const [extra, setExtra] = useState<HostRecipe[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setExtra(JSON.parse(raw) as HostRecipe[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(extra));
  }, [extra, ready]);

  const upsert = useCallback((recipe: HostRecipe) => {
    setExtra((prev) => {
      const i = prev.findIndex((r) => r.host === recipe.host);
      if (i < 0) return [...prev, recipe];
      const next = [...prev];
      next[i] = recipe;
      return next;
    });
  }, []);

  const remove = useCallback((host: string) => {
    setExtra((prev) => prev.filter((r) => r.host !== host));
  }, []);

  return { extra, all: [...extra, ...bundledRecipes], upsert, remove };
}
