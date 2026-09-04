import { TIER_MS, type WatchItem } from "./types";

/** جدولة تتعلّم: تغيّر متكرر → أسرع، سكون → أبطأ. */
export function learnedInterval(w: WatchItem): number {
  const base = w.effectiveMs ?? TIER_MS[w.tier];
  const quiet = w.quietChecks ?? 0;
  const hot = w.changeChecks ?? 0;
  if (hot >= 3) return Math.max(60_000, Math.floor(base / 2));
  if (quiet >= 8) return Math.min(TIER_MS[5], base * 2);
  return base;
}

export function afterRunStats(
  w: WatchItem,
  changed: boolean,
): Pick<WatchItem, "quietChecks" | "changeChecks" | "effectiveMs"> {
  const quiet = changed ? 0 : (w.quietChecks ?? 0) + 1;
  const hot = changed ? (w.changeChecks ?? 0) + 1 : Math.max(0, (w.changeChecks ?? 0) - 1);
  const draft: WatchItem = { ...w, quietChecks: quiet, changeChecks: hot };
  return { quietChecks: quiet, changeChecks: hot, effectiveMs: learnedInterval(draft) };
}
