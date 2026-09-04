import type { ChangeEvent, CompetitiveSnapshot } from "./types";
import { marketAnalytics } from "./analytics";

/** رؤى من الأحداث المحلية — مش نموذج لغوي خارجي. */
export function marketInsights(events: ChangeEvent[], snaps: CompetitiveSnapshot[], myPrice?: number) {
  const day = Date.now() - 24 * 60 * 60_000;
  const recent = events.filter((e) => e.at >= day);
  const down = recent.filter((e) => e.kind === "price_down" || (e.kind === "price" && Number(e.to) < Number(e.from)));
  const sellersDown = new Set(down.map((e) => e.url)).size;
  const stats = marketAnalytics(snaps);
  const lines: string[] = [];
  if (sellersDown) {
    lines.push(`${sellersDown} مصدر خفّض السعر خلال آخر ٢٤ ساعة (من الأحداث المسجّلة هنا).`);
  }
  if (myPrice && stats.average) {
    const pct = (((myPrice - stats.average) / stats.average) * 100).toFixed(1);
    lines.push(`سعركِ ${Number(pct) > 0 ? "أعلى" : "أقل"} من متوسط العروض المراقبة بـ ${Math.abs(Number(pct))}٪.`);
  }
  if (stats.avgDiscount >= 10) {
    lines.push(`متوسط الخصم الظاهر على العروض ${stats.avgDiscount}٪.`);
  }
  if (!lines.length) lines.push("لسه مفيش إشارة سوق من المراقبة. زوّدي مصادر واتنين قراءات.");
  return lines;
}
